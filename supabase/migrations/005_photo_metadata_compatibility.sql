-- Keep the admin editor fields aligned with the production photo schema.
alter table if exists public.photos
  add column if not exists title text not null default '';

alter table if exists public.photos
  drop constraint if exists photos_aspect_check;

alter table if exists public.photos
  add constraint photos_aspect_check
  check (aspect in ('portrait', 'landscape', 'square', 'wide', 'tall'));
