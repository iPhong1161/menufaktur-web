-- Drops the two permissive policies on public.bookings that let any holder of
-- the public anon key read every booking and insert arbitrary rows.
--
-- Apply only after the matching code change is deployed: every server path now
-- reads and writes bookings through the service client, which bypasses RLS.
-- "Owner can read own bookings" is left in place.
--
-- Not wired into any automated pipeline. Run by hand; revert with
-- 20261013-restore-permissive-bookings-policies.sql.

drop policy if exists "Booking number lookup" on public.bookings;
drop policy if exists "Anyone can create bookings" on public.bookings;
