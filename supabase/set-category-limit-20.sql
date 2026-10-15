create or replace function public.enforce_gallery_category_limit()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if (select count(*) from public.gallery_photos where category_id = new.category_id) >= 20 then
    raise exception 'Bu kategoride en fazla 20 fotoğraf bulunabilir.';
  end if;
  return new;
end;
$$;
