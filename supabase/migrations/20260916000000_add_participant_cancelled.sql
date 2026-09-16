alter table public.participants add column if not exists cancelled boolean not null default false;
