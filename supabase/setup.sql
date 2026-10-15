create extension if not exists pgcrypto;

create table if not exists public.gallery_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.gallery_admins enable row level security;

insert into public.gallery_admins (user_id)
select id from auth.users order by created_at asc limit 1
on conflict (user_id) do nothing;

create or replace function public.is_gallery_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.gallery_admins where user_id = auth.uid());
$$;
revoke all on function public.is_gallery_admin() from public;
grant execute on function public.is_gallery_admin() to authenticated;

create table if not exists public.gallery_photos (
  id uuid primary key default gen_random_uuid(),
  category_id text not null check (category_id in (
    'aranjmanlar', 'buketler', 'celenkler', 'gelin-buketleri',
    'isteme-ve-teklif', 'arac-susleme', 'saksi'
  )),
  source_url text,
  storage_path text unique,
  caption text not null default 'Demeter çiçek tasarımı',
  position integer not null default 0 check (position >= 0),
  is_cover boolean not null default false,
  created_at timestamptz not null default now(),
  check (source_url is not null or storage_path is not null)
);

create unique index if not exists gallery_one_cover_per_category
  on public.gallery_photos (category_id) where is_cover;

alter table public.gallery_photos enable row level security;
grant usage on schema public to anon, authenticated;
grant select on public.gallery_photos to anon, authenticated;
grant insert, update, delete on public.gallery_photos to authenticated;

drop policy if exists "Gallery is publicly readable" on public.gallery_photos;
create policy "Gallery is publicly readable"
  on public.gallery_photos for select using (true);

drop policy if exists "Authenticated users can add gallery photos" on public.gallery_photos;
create policy "Authenticated users can add gallery photos"
  on public.gallery_photos for insert to authenticated with check (public.is_gallery_admin());

drop policy if exists "Authenticated users can update gallery photos" on public.gallery_photos;
create policy "Authenticated users can update gallery photos"
  on public.gallery_photos for update to authenticated using (public.is_gallery_admin()) with check (public.is_gallery_admin());

drop policy if exists "Authenticated users can delete gallery photos" on public.gallery_photos;
create policy "Authenticated users can delete gallery photos"
  on public.gallery_photos for delete to authenticated using (public.is_gallery_admin());

create or replace function public.enforce_gallery_category_limit()
returns trigger language plpgsql set search_path = public as $$
begin
  if (select count(*) from public.gallery_photos where category_id = new.category_id) >= 50 then
    raise exception 'Bu kategoride en fazla 50 fotoğraf bulunabilir.';
  end if;
  return new;
end;
$$;

drop trigger if exists gallery_category_limit on public.gallery_photos;
create trigger gallery_category_limit before insert on public.gallery_photos
for each row execute function public.enforce_gallery_category_limit();

create or replace function public.set_gallery_cover(photo_id uuid, selected_category text)
returns void language plpgsql security invoker set search_path = public as $$
begin
  if not public.is_gallery_admin() then raise exception 'Yetkisiz işlem'; end if;
  update public.gallery_photos set is_cover = false where category_id = selected_category and is_cover;
  update public.gallery_photos set is_cover = true where id = photo_id and category_id = selected_category;
end;
$$;
grant execute on function public.set_gallery_cover(uuid, text) to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('gallery', 'gallery', true, 524288, array['image/webp'])
on conflict (id) do update set public = true, file_size_limit = 524288,
  allowed_mime_types = array['image/webp'];

drop policy if exists "Public gallery images are readable" on storage.objects;
create policy "Public gallery images are readable"
  on storage.objects for select using (bucket_id = 'gallery');

drop policy if exists "Authenticated users can upload gallery images" on storage.objects;
create policy "Authenticated users can upload gallery images"
  on storage.objects for insert to authenticated with check (bucket_id = 'gallery' and public.is_gallery_admin());

drop policy if exists "Authenticated users can update gallery images" on storage.objects;
create policy "Authenticated users can update gallery images"
  on storage.objects for update to authenticated using (bucket_id = 'gallery' and public.is_gallery_admin()) with check (bucket_id = 'gallery' and public.is_gallery_admin());

drop policy if exists "Authenticated users can delete gallery images" on storage.objects;
create policy "Authenticated users can delete gallery images"
  on storage.objects for delete to authenticated using (bucket_id = 'gallery' and public.is_gallery_admin());
