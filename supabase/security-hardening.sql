begin;

-- Existing content is retained; the constraint applies to new or edited rows.
alter table public.gallery_photos drop constraint if exists gallery_caption_length;
alter table public.gallery_photos add constraint gallery_caption_length
  check (char_length(btrim(caption)) between 1 and 80) not valid;

create or replace function public.enforce_gallery_category_limit()
returns trigger language plpgsql volatile set search_path = public as $$
begin
  if TG_OP = 'UPDATE' then
    if new.category_id = old.category_id then return new; end if;
  end if;
  -- Serialise inserts and category moves to the same destination.
  perform pg_advisory_xact_lock(hashtextextended('gallery-category:' || new.category_id, 0));
  if (select count(*) from public.gallery_photos where category_id = new.category_id) >= 20 then
    raise exception 'Bu kategoride en fazla 20 fotoğraf bulunabilir.';
  end if;
  return new;
end;
$$;
drop trigger if exists gallery_category_limit on public.gallery_photos;
create trigger gallery_category_limit before insert or update of category_id on public.gallery_photos
for each row execute function public.enforce_gallery_category_limit();

revoke all on function public.set_gallery_cover(uuid, text) from public, anon;
grant execute on function public.set_gallery_cover(uuid, text) to authenticated;
revoke all on table public.gallery_admins from anon, authenticated;

commit;
