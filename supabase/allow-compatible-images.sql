update storage.buckets
set allowed_mime_types = array['image/webp', 'image/jpeg', 'image/png'],
    file_size_limit = 524288
where id = 'gallery';
