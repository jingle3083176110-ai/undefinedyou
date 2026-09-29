create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  table_name text;
begin
  foreach table_name in array array['projects','courses','journal_entries','photo_collections','photos'] loop
    execute format('drop trigger if exists %I_updated_at on public.%I', table_name, table_name);
    execute format('create trigger %I_updated_at before update on public.%I for each row execute function public.set_updated_at()', table_name, table_name);
  end loop;
end;
$$;

grant usage on schema public to service_role;
grant select, insert, update, delete on public.projects to service_role;
grant select, insert, update, delete on public.courses to service_role;
grant select, insert, update, delete on public.journal_entries to service_role;
grant select, insert, update, delete on public.photo_collections to service_role;
grant select, insert, update, delete on public.photos to service_role;
grant select, insert, update, delete on public.collection_photos to service_role;
grant usage, select on all sequences in schema public to service_role;
