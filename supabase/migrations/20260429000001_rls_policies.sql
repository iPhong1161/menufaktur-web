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
