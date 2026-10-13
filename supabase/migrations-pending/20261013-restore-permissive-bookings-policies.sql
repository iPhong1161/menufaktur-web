-- Rollback for 20261013-drop-permissive-bookings-policies.sql.
--
-- Recreates both permissive policies exactly as they were in production.
-- This restores anon read access to every booking and anon insert — apply only
-- to unblock a production incident, then re-drop once the cause is fixed.

drop policy if exists "Booking number lookup" on public.bookings;
create policy "Booking number lookup" on public.bookings for select to public using (true);

drop policy if exists "Anyone can create bookings" on public.bookings;
create policy "Anyone can create bookings" on public.bookings for insert to public with check (true);
