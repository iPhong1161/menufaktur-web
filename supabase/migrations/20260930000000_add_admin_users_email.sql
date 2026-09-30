-- promoteToAdmin() inserts an email alongside user_id and role, and
-- types/database.ts declares the column, but dev's admin_users has only
-- id/user_id/role/created_at — so the insert fails there with PGRST204.
--
-- Nullable and idempotent: a no-op where the column already exists (prod),
-- and existing rows stay as they are.
alter table public.admin_users add column if not exists email text;
