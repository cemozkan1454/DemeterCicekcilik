-- Temel tablo izinleri. RLS kuralları yazmayı yalnızca galeri yöneticisine açar.
grant usage on schema public to anon, authenticated;
grant select on table public.gallery_photos to anon, authenticated;
grant insert, update, delete on table public.gallery_photos to authenticated;
grant execute on function public.is_gallery_admin() to authenticated;
grant execute on function public.set_gallery_cover(uuid, text) to authenticated;
