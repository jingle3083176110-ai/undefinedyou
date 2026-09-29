alter table public.photos
  add column if not exists original_path text not null default '';

insert into storage.buckets (id, name, public)
values
  ('photo-previews', 'photo-previews', true),
  ('photo-originals', 'photo-originals', false)
on conflict (id) do update
set
  name = excluded.name,
  public = excluded.public;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Public can read photo previews'
  ) then
    create policy "Public can read photo previews"
      on storage.objects
      for select
      to anon, authenticated
      using (bucket_id = 'photo-previews');
  end if;
end;
$$;
