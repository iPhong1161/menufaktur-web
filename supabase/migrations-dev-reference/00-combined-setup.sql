-- =============================================================================
-- menufaktur — Combined dev setup reference (manual run only)
-- =============================================================================
-- This file is a MANUAL REFERENCE for setting up a fresh Supabase project
-- (e.g. menufaktur-dev). It concatenates all versioned migrations under
-- supabase/migrations/ in filename order, followed by additional pieces that
-- live outside version-controlled migrations in the current production project
-- (create_booking_atomic replacement with invoice phone, admin_users,
-- contact_messages).
--
-- This file is NOT wired into any automated migration pipeline and will not
-- run against production. Paste the whole file — or individual sections — into
-- the Supabase SQL Editor of a new project.
--
-- Recommended run order is top-to-bottom. Each section is idempotent-ish
-- relative to its predecessors but the file assumes an empty public schema.
-- =============================================================================


-- ===== SECTION 1: 20260429000000_initial_schema.sql =====

-- menufaktur initial schema
-- Run in Supabase SQL editor or via `supabase db push`

-- ─── courses ──────────────────────────────────────────────────────────────────

create table public.courses (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  title            text not null,
  slug             text not null unique,
  tagline          text,
  category         text,
  description      text,
  date             date not null,
  start_time       time not null,
  end_time         time not null,
  location         text not null default 'Frankfurt-Bornheim',
  address          text,
  capacity         integer not null,
  price_per_person numeric(10,2) not null,
  vat_rate         numeric(5,2) not null default 19.00,
  photo_url        text,
  food_options     text[] not null default '{}',
  status           text not null default 'draft'
    check (status in ('draft', 'published', 'cancelled', 'archived'))
);

-- ─── vouchers ─────────────────────────────────────────────────────────────────
-- Must be defined before bookings (FK dependency)

create table public.vouchers (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  code              text not null unique,
  value             numeric(10,2) not null,
  remaining_value   numeric(10,2) not null,
  status            text not null default 'active'
    check (status in ('active', 'redeemed', 'expired', 'cancelled')),
  expires_at        date,
  purchaser_name    text not null,
  purchaser_email   text not null,
  recipient_name    text not null,
  recipient_email   text,
  delivery_method   text not null default 'email'
    check (delivery_method in ('email', 'post')),
  postal_address    jsonb,
  personal_message  text,
  stripe_session_id text,
  payment_status    text not null default 'unpaid'
    check (payment_status in ('unpaid', 'paid', 'refunded')),
  postal_fee        numeric(10,2) not null default 0
);

-- ─── bookings ─────────────────────────────────────────────────────────────────

create table public.bookings (
  id                        uuid primary key default gen_random_uuid(),
  created_at                timestamptz not null default now(),
  course_id                 uuid not null references public.courses(id),
  user_id                   uuid references auth.users(id),
  booking_number            text not null unique,
  status                    text not null default 'pending'
    check (status in ('pending', 'confirmed', 'cancelled', 'refunded')),
  payment_method            text not null
    check (payment_method in ('card', 'sepa', 'bank_transfer')),
  payment_status            text not null default 'unpaid'
    check (payment_status in ('unpaid', 'paid', 'refunded')),
  stripe_session_id         text,
  stripe_payment_intent     text,
  total_amount              numeric(10,2) not null,
  vat_amount                numeric(10,2) not null default 0,
  voucher_id                uuid references public.vouchers(id),
  voucher_discount          numeric(10,2) not null default 0,
  confirmation_email_sent   boolean not null default false
);

-- ─── participants ─────────────────────────────────────────────────────────────

create table public.participants (
  id                uuid primary key default gen_random_uuid(),
  booking_id        uuid not null references public.bookings(id) on delete cascade,
  first_name        text not null,
  last_name         text not null,
  email             text not null,
  phone             text,
  food_preferences  text[] not null default '{}',
  food_notes        text,
  is_primary        boolean not null default false
);

-- ─── invoice_recipients ───────────────────────────────────────────────────────

create table public.invoice_recipients (
  id              uuid primary key default gen_random_uuid(),
  booking_id      uuid not null references public.bookings(id) on delete cascade,
  first_name      text not null,
  last_name       text not null,
  company_name    text,
  address_line1   text not null,
  postal_code     text not null,
  city            text not null,
  country         text not null default 'DE',
  email           text not null,
  vat_id          text,
  is_business     boolean not null default false
);

-- ─── profiles ─────────────────────────────────────────────────────────────────

create table public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  first_name      text,
  last_name       text,
  email           text,
  phone           text,
  address_line1   text,
  postal_code     text,
  city            text,
  country         text not null default 'DE',
  created_at      timestamptz not null default now()
);

-- auto-create profile on sign-up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, first_name, last_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── booking_number sequence ──────────────────────────────────────────────────

create sequence if not exists public.booking_number_seq start 100 increment 1;

create or replace function public.next_booking_number()
returns text language sql as $$
  select 'MF-' || extract(year from now())::text || '-' ||
         lpad(nextval('public.booking_number_seq')::text, 5, '0')
$$;


-- ===== SECTION 2: 20260429000001_rls_policies.sql =====

-- menufaktur RLS policies
-- Run after initial_schema.sql

alter table public.courses           enable row level security;
alter table public.bookings          enable row level security;
alter table public.participants      enable row level security;
alter table public.invoice_recipients enable row level security;
alter table public.vouchers          enable row level security;
alter table public.profiles          enable row level security;

-- ─── courses ──────────────────────────────────────────────────────────────────

create policy "Public read published courses"
  on public.courses for select
  using (status = 'published');

-- ─── bookings ─────────────────────────────────────────────────────────────────

create policy "Owner can read own bookings"
  on public.bookings for select
  using (user_id = auth.uid());

-- Allows anonymous booking_number lookup (filtered at query layer)
create policy "Booking number lookup"
  on public.bookings for select
  using (true);

create policy "Anyone can create bookings"
  on public.bookings for insert
  with check (true);

-- ─── participants ─────────────────────────────────────────────────────────────

create policy "Owner can read own participants"
  on public.participants for select
  using (
    booking_id in (
      select id from public.bookings where user_id = auth.uid()
    )
  );

create policy "Insert participants with booking"
  on public.participants for insert
  with check (true);

-- ─── invoice_recipients ───────────────────────────────────────────────────────

create policy "Owner can read own invoice recipient"
  on public.invoice_recipients for select
  using (
    booking_id in (
      select id from public.bookings where user_id = auth.uid()
    )
  );

create policy "Insert invoice recipient with booking"
  on public.invoice_recipients for insert
  with check (true);

-- ─── vouchers ─────────────────────────────────────────────────────────────────

-- Allows code lookup and purchaser email lookup (filtered at query layer)
create policy "Voucher select"
  on public.vouchers for select
  using (true);

create policy "Insert vouchers"
  on public.vouchers for insert
  with check (true);

-- ─── profiles ─────────────────────────────────────────────────────────────────

create policy "Owner can read own profile"
  on public.profiles for select
  using (id = auth.uid());

create policy "Owner can update own profile"
  on public.profiles for update
  using (id = auth.uid());


-- ===== SECTION 3: 20260430000002_grants.sql =====

-- Table-level privileges for anon and authenticated roles.
-- Required when tables are created via raw SQL (Supabase GUI grants these automatically).
-- RLS policies alone are insufficient without these underlying grants.

-- courses: public read
grant select on public.courses to anon, authenticated;

-- bookings: anonymous booking lookup + insert; authenticated reads own
grant select, insert on public.bookings to anon, authenticated;

-- participants: insert at booking time; authenticated reads own
grant select, insert on public.participants to anon, authenticated;

-- invoice_recipients: insert at booking time; authenticated reads own
grant select, insert on public.invoice_recipients to anon, authenticated;

-- vouchers: code lookup + purchase
grant select, insert on public.vouchers to anon, authenticated;

-- profiles: authenticated only (created by trigger, updated by owner)
grant select, update on public.profiles to authenticated;

-- booking number sequence and function
grant usage on sequence public.booking_number_seq to anon, authenticated;
grant execute on function public.next_booking_number() to anon, authenticated;


-- ===== SECTION 4: 20260515000003_newsletter_subscribers.sql =====

-- Newsletter subscribers table
-- Run this migration manually in the Supabase dashboard SQL editor

create table if not exists public.newsletter_subscribers (
  id          uuid        primary key default gen_random_uuid(),
  email       text        not null unique,
  created_at  timestamptz not null default now(),
  confirmed   boolean     not null default false
);

alter table public.newsletter_subscribers enable row level security;

-- Anyone (anon or authenticated) may subscribe
create policy "Allow public insert"
  on public.newsletter_subscribers
  for insert
  to anon, authenticated
  with check (true);

-- Only service role can read/update/delete subscriber records


-- ===== SECTION 5: 20260516000001_atomic_voucher_redemption.sql =====

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


-- ===== SECTION 6: 20260806000000_add_invoice_recipient_phone.sql =====

alter table public.invoice_recipients add column phone text;


-- ===== SECTION 7: 20260831000000_add_voucher_dispatched.sql =====

alter table public.vouchers add column dispatched_at timestamptz;


-- ===== SECTION 8: create_booking_atomic replacement (invoice phone integrated) =====

-- Aug 6 SQL Editor block. Section 5 defined the function without invoice
-- `phone`; section 6 added the column but did not update the function.
-- This replacement writes `phone` into the invoice_recipients INSERT column
-- list and value list. Run AFTER sections 5 and 6.

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
  v_booking_number := next_booking_number();

  if p_voucher_id is not null then
    update public.vouchers
    set status = 'redeemed'
    where id = p_voucher_id
      and status = 'active';

    if not found then
      raise exception 'VOUCHER_ALREADY_USED';
    end if;
  end if;

  insert into public.bookings (
    booking_number, course_id, user_id, payment_method, payment_status,
    total_amount, vat_amount, voucher_id, voucher_discount
  ) values (
    v_booking_number, p_course_id, p_user_id, p_payment_method, 'unpaid',
    p_total_amount, p_vat_amount, p_voucher_id, p_voucher_discount
  )
  returning id into v_booking_id;

  for v_participant in select * from jsonb_array_elements(p_participants)
  loop
    insert into public.participants (
      booking_id, first_name, last_name, email, phone,
      food_preferences, food_notes, is_primary
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

  insert into public.invoice_recipients (
    booking_id, first_name, last_name, company_name, address_line1,
    postal_code, city, country, email, phone, vat_id, is_business
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
    nullif(p_invoice_recipient ->> 'phone', ''),
    nullif(p_invoice_recipient ->> 'vat_id', ''),
    coalesce((p_invoice_recipient ->> 'is_business')::boolean, false)
  );

  return jsonb_build_object(
    'booking_number', v_booking_number,
    'id',             v_booking_id
  );
end;
$$;

grant execute on function public.create_booking_atomic(uuid, uuid, text, numeric, numeric, numeric, uuid, jsonb, jsonb)
  to authenticated, anon;


-- ===== SECTION 9: admin_users table =====

-- Backing table for the admin gate in middleware.ts (getAdminUser()).
-- Not created by any versioned migration in the current repo; the existing
-- production project's row lives here through manual UI creation. Recreate
-- explicitly for a fresh project.
--
-- Service role bypasses RLS, so the middleware / getAdminUser() flow works
-- without any additional select policies. Adjust as needed if you want
-- direct anon/authenticated reads.

create table public.admin_users (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null unique references auth.users(id) on delete cascade,
  role       text not null default 'admin' check (role in ('admin', 'moderator')),
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- To seed your first admin after signing up through the app:
--
--   insert into public.admin_users (user_id, role)
--   values ('<paste your auth.users.id here>', 'admin');


-- ===== SECTION 10: contact_messages table =====

-- Backing table for /api/actions/contact.ts (public contact form),
-- /admin/nachrichten (admin inbox), and the voucher webhook's postal-order
-- notification insert. Not versioned in migrations/, present in prod via UI.

create table public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name       text not null,
  email      text not null,
  subject    text not null,
  message    text not null,
  read       boolean not null default false
);

alter table public.contact_messages enable row level security;

grant insert on public.contact_messages to anon, authenticated;

create policy "Anyone can insert contact messages"
  on public.contact_messages for insert
  to anon, authenticated
  with check (true);

-- Reads/updates/deletes intentionally omitted from RLS — admin surfaces go
-- through the service role which bypasses RLS.
