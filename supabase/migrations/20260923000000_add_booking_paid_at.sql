alter table public.bookings add column if not exists paid_at timestamptz;

-- Backfill: existing paid bookings predate this column. Dating them from
-- created_at keeps their invoices stable instead of re-dating on each download.
update public.bookings
set paid_at = created_at
where payment_status = 'paid' and paid_at is null;
