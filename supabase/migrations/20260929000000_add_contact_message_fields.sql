-- Structured fields for the contact form. The form previously carried a single
-- free-text Betreff and folded the company name into the message body; these
-- columns replace both with queryable data.
--
-- Existing rows keep their old shape: no backfill, all columns nullable.
alter table public.contact_messages add column if not exists category text;
alter table public.contact_messages add column if not exists booking_number text;
alter table public.contact_messages add column if not exists course_title text;
alter table public.contact_messages add column if not exists company text;
