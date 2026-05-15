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
