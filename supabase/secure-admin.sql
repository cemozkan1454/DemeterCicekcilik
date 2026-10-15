create table if not exists public.gallery_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.gallery_admins enable row level security;

insert into public.gallery_admins (user_id)
select id from auth.users order by created_at asc limit 1
on conflict (user_id) do nothing;

create or replace function public.is_gallery_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.gallery_admins where user_id = auth.uid()
  );
$$;

revoke all on function public.is_gallery_admin() from public;
grant execute on function public.is_gallery_admin() to authenticated;

drop policy if exists "Authenticated users can add gallery photos" on public.gallery_photos;
drop policy if exists "Gallery admins can add gallery photos" on public.gallery_photos;
create policy "Gallery admins can add gallery photos"
  on public.gallery_photos for insert to authenticated
  with check (public.is_gallery_admin());

drop policy if exists "Authenticated users can update gallery photos" on public.gallery_photos;
drop policy if exists "Gallery admins can update gallery photos" on public.gallery_photos;
create policy "Gallery admins can update gallery photos"
  on public.gallery_photos for update to authenticated
  using (public.is_gallery_admin()) with check (public.is_gallery_admin());

drop policy if exists "Authenticated users can delete gallery photos" on public.gallery_photos;
drop policy if exists "Gallery admins can delete gallery photos" on public.gallery_photos;
create policy "Gallery admins can delete gallery photos"
  on public.gallery_photos for delete to authenticated
  using (public.is_gallery_admin());

drop policy if exists "Authenticated users can upload gallery images" on storage.objects;
drop policy if exists "Gallery admins can upload gallery images" on storage.objects;
create policy "Gallery admins can upload gallery images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'gallery' and public.is_gallery_admin());

drop policy if exists "Authenticated users can update gallery images" on storage.objects;
drop policy if exists "Gallery admins can update gallery images" on storage.objects;
create policy "Gallery admins can update gallery images"
  on storage.objects for update to authenticated
  using (bucket_id = 'gallery' and public.is_gallery_admin())
  with check (bucket_id = 'gallery' and public.is_gallery_admin());

drop policy if exists "Authenticated users can delete gallery images" on storage.objects;
drop policy if exists "Gallery admins can delete gallery images" on storage.objects;
create policy "Gallery admins can delete gallery images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'gallery' and public.is_gallery_admin());

create or replace function public.set_gallery_cover(photo_id uuid, selected_category text)
returns void language plpgsql security invoker set search_path = public as $$
begin
  if not public.is_gallery_admin() then raise exception 'Yetkisiz işlem'; end if;
  update public.gallery_photos set is_cover = false where category_id = selected_category and is_cover;
  update public.gallery_photos set is_cover = true where id = photo_id and category_id = selected_category;
end;
$$;
