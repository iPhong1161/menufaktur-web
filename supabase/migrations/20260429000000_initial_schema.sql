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
