-- Replaces create_booking_atomic to lock the voucher atomically inside the
-- transaction. If p_voucher_id is set but the voucher is no longer 'active'
-- (e.g. claimed by a concurrent request), the function raises
-- VOUCHER_ALREADY_USED and the entire transaction rolls back — preventing any
-- double-spend of a voucher code.

create or replace function public.create_booking_atomic(
  p_course_id         uuid,
  p_user_id           uuid,
  p_payment_method    text,
  p_total_amount      numeric,
  p_vat_amount        numeric,
  p_voucher_discount  numeric,
  p_voucher_id        uuid,
  p_participants      jsonb,
  p_invoice_recipient jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_booking_number text;
  v_booking_id     uuid;
  v_participant    jsonb;
begin
  -- Generate booking number first so it can be used in error messages if needed
  v_booking_number := next_booking_number();

  -- Atomic voucher lock — must happen before the booking insert so that any
  -- failure rolls back the entire transaction (no orphan booking with a bad voucher).
  if p_voucher_id is not null then
    update public.vouchers
    set status = 'redeemed'
    where id = p_voucher_id
      and status = 'active';

    if not found then
      raise exception 'VOUCHER_ALREADY_USED';
    end if;
  end if;

  -- Insert booking
  insert into public.bookings (
    booking_number,
    course_id,
    user_id,
    payment_method,
    payment_status,
    total_amount,
    vat_amount,
    voucher_id,
    voucher_discount
  ) values (
    v_booking_number,
    p_course_id,
    p_user_id,
    p_payment_method,
    'unpaid',
    p_total_amount,
    p_vat_amount,
    p_voucher_id,
    p_voucher_discount
  )
  returning id into v_booking_id;

  -- Insert participants
  for v_participant in select * from jsonb_array_elements(p_participants)
  loop
    insert into public.participants (
      booking_id,
      first_name,
      last_name,
      email,
      phone,
      food_preferences,
      food_notes,
      is_primary
    ) values (
      v_booking_id,
      v_participant ->> 'first_name',
      v_participant ->> 'last_name',
      coalesce(v_participant ->> 'email', ''),
      nullif(v_participant ->> 'phone', ''),
      array(select jsonb_array_elements_text(coalesce(v_participant -> 'food_preferences', '[]'::jsonb))),
      nullif(v_participant ->> 'food_notes', ''),
      coalesce((v_participant ->> 'is_primary')::boolean, false)
    );
  end loop;

  -- Insert invoice recipient
  insert into public.invoice_recipients (
    booking_id,
    first_name,
    last_name,
    company_name,
    address_line1,
    postal_code,
    city,
    country,
    email,
    vat_id,
    is_business
  ) values (
    v_booking_id,
    p_invoice_recipient ->> 'first_name',
    p_invoice_recipient ->> 'last_name',
    nullif(p_invoice_recipient ->> 'company_name', ''),
    coalesce(p_invoice_recipient ->> 'address_line1', ''),
    coalesce(p_invoice_recipient ->> 'postal_code', ''),
    coalesce(p_invoice_recipient ->> 'city', ''),
    coalesce(p_invoice_recipient ->> 'country', 'DE'),
    p_invoice_recipient ->> 'email',
    nullif(p_invoice_recipient ->> 'vat_id', ''),
    coalesce((p_invoice_recipient ->> 'is_business')::boolean, false)
  );

  return jsonb_build_object(
    'booking_number', v_booking_number,
    'id',             v_booking_id
  );
end;
$$;

-- Grant execute to authenticated and anon so existing RLS/grant policies are preserved
grant execute on function public.create_booking_atomic(uuid, uuid, text, numeric, numeric, numeric, uuid, jsonb, jsonb)
  to authenticated, anon;
