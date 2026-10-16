import { galleryCategories, type GalleryCategory } from '@/config/gallery';
import { supabase } from './supabase';

export type GalleryRow = {
  id: string;
  category_id: string;
  source_url: string | null;
  storage_path: string | null;
  caption: string;
  position: number;
  is_cover: boolean;
};

export function photoUrl(row: GalleryRow) {
  if (row.storage_path && supabase) {
    return supabase.storage.from('gallery').getPublicUrl(row.storage_path).data.publicUrl;
  }
  return row.source_url ?? '';
}

export async function fetchGalleryRows() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('gallery_photos')
    .select('id,category_id,source_url,storage_path,caption,position,is_cover')
    .order('position', { ascending: true });
  if (error) throw error;
  return (data ?? []) as GalleryRow[];
}

export function rowsToCategories(rows: GalleryRow[]): GalleryCategory[] {
  return galleryCategories.map(category => {
    const categoryRows = rows.filter(row => row.category_id === category.id);
    const coverIndex = Math.max(0, categoryRows.findIndex(row => row.is_cover));
    return {
      ...category,
      coverIndex,
      photos: categoryRows.map(row => ({
        src: photoUrl(row),
        caption: row.caption,
        alt: `Demeter Çiçek Tasarım — ${row.caption}`,
      })),
    };
  });
}
