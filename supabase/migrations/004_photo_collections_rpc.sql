create or replace function public.replace_photo_collections(p_photo_id text, p_collection_ids uuid[])
returns void language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from photos where id = p_photo_id) then raise exception 'photo not found'; end if;
  if exists (select 1 from unnest(coalesce(p_collection_ids, '{}'::uuid[])) ids group by ids having count(*) > 1) then raise exception 'duplicate collection id'; end if;
  if exists (select 1 from unnest(coalesce(p_collection_ids, '{}'::uuid[])) ids where not exists (select 1 from photo_collections c where c.id = ids)) then raise exception 'collection not found'; end if;
  delete from collection_photos where photo_id = p_photo_id;
  insert into collection_photos (collection_id, photo_id, sort_order) select ids, p_photo_id, ordinality - 1 from unnest(coalesce(p_collection_ids, '{}'::uuid[])) with ordinality;
end; $$;
grant execute on function public.replace_photo_collections(text, uuid[]) to service_role;
