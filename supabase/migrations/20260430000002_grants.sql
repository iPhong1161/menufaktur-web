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
