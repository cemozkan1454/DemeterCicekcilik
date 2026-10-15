import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowLeft, Check, Eye, EyeOff, ImagePlus, Images, Loader2, LockKeyhole, LogOut, Pencil, Star, Trash2, X } from 'lucide-react';
import { galleryCategories } from '@/config/gallery';
import { fetchGalleryRows, photoUrl, seedStaticGalleryIfEmpty } from '@/lib/galleryRepository';
import { rememberSession, supabase, supabaseConfigured } from '@/lib/supabase';
import './AdminGallery.css';

const LIMIT = 20;
const MAX_INPUT = 20 * 1024 * 1024;
const MAX_OUTPUT = 500 * 1024;
function errorMessage(error: unknown, fallback: string): string {
  if (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string') return error.message;
  return fallback;
}
type Photo = { id: string; src: string; caption: string; bytes?: number; storagePath?: string | null };
type Category = { id: string; title: string; photos: Photo[]; coverId: string | null; contain: boolean };
type Prepared = Photo & { originalBytes: number; blob: Blob };
const formatSize = (bytes: number) => bytes >= 1024 * 1024
  ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  : `${Math.ceil(bytes / 1024)} KB`;

function initialCategories(): Category[] {
  return galleryCategories.map(category => {
    const photos = category.photos.map((photo, index) => ({
      id: `${category.id}-${index}`, src: photo.src, caption: photo.caption,
      storagePath: null,
    }));
    return {
      id: category.id, title: category.title, photos,
      coverId: photos[category.coverIndex ?? 0]?.id ?? photos[0]?.id ?? null,
      contain: Boolean(category.contain),
    };
  });
}

async function optimizePhoto(file: File): Promise<Prepared> {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new Error('JPG, PNG veya WebP seçin. HEIC fotoğrafları önce JPG olarak dışa aktarın.');
  }
  if (file.size > MAX_INPUT) throw new Error('Bir fotoğraf en fazla 20 MB olabilir.');
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    if (!img.naturalWidth || !img.naturalHeight) throw new Error('Fotoğraf okunamadı.');
    const ratio = Math.min(1, 1600 / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(img.naturalWidth * ratio));
    canvas.height = Math.max(1, Math.round(img.naturalHeight * ratio));
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Tarayıcınız fotoğraf işlemeyi desteklemiyor.');
    let blob: Blob | null = null;
    let outputType = 'image/webp';
    for (let attempt = 0; attempt < 8; attempt++) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const quality = Math.max(0.5, 0.85 - attempt * 0.07);
      blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, outputType, quality));
      if (blob && blob.type !== outputType) {
        // Safari may return PNG when WebP encoding is unavailable.
        outputType = 'image/jpeg';
        blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, outputType, quality));
      }
      if (!blob) throw new Error('Fotoğraf hazırlanamadı.');
      if (blob.size <= MAX_OUTPUT) break;
      if (attempt >= 3) {
        canvas.width = Math.max(1, Math.round(canvas.width * 0.8));
        canvas.height = Math.max(1, Math.round(canvas.height * 0.8));
      }
    }
    if (!blob || blob.size > MAX_OUTPUT) throw new Error('Fotoğraf yeterince küçültülemedi. Başka bir fotoğraf seçin.');
    if (file.size < blob.size && file.size <= MAX_OUTPUT && ratio === 1) blob = file;
    return {
      id: crypto.randomUUID(), src: URL.createObjectURL(blob),
      caption: file.name.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' ').trim().slice(0, 80) || 'Demeter çiçek tasarımı',
      bytes: blob.size, originalBytes: file.size, blob,
    };
  } finally {
    URL.revokeObjectURL(url);
  }
}

export default function AdminGallery() {
  const [authenticated, setAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [categories, setCategories] = useState(initialCategories);
  const [selectedId, setSelectedId] = useState(categories[0].id);
  const [pending, setPending] = useState<Prepared[]>([]);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [removing, setRemoving] = useState<Photo | null>(null);
  const [preview, setPreview] = useState<Photo | null>(null);
  const [editing, setEditing] = useState<Photo | null>(null);
  const [editedCaption, setEditedCaption] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);
  const removeCancel = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const urls = useRef(new Set<string>());
  const category = categories.find(item => item.id === selectedId)!;
  const remaining = LIMIT - category.photos.length - pending.length;
  const total = categories.reduce((sum, item) => sum + item.photos.length, 0);
  const modalOpen = Boolean(removing || preview || editing);

  async function loadGallery() {
    if (!supabase) return;
    await seedStaticGalleryIfEmpty();
    const rows = await fetchGalleryRows();
    setCategories(galleryCategories.map(categoryInfo => {
      const categoryRows = rows.filter(row => row.category_id === categoryInfo.id);
      return {
        id: categoryInfo.id,
        title: categoryInfo.title,
        contain: Boolean(categoryInfo.contain),
        coverId: categoryRows.find(row => row.is_cover)?.id ?? categoryRows[0]?.id ?? null,
        photos: categoryRows.map(row => ({
          id: row.id,
          src: photoUrl(row),
          caption: row.caption,
          storagePath: row.storage_path,
        })),
      };
    }));
  }

  useEffect(() => {
    if (!supabase) { setAuthChecking(false); return; }
    supabase.auth.getSession().then(({ data }) => {
      setAuthenticated(Boolean(data.session));
      setAuthChecking(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthenticated(Boolean(session));
      setAuthChecking(false);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    setBusy(true);
    loadGallery()
      .catch(error => setErrors([error instanceof Error ? error.message : 'Galeri yüklenemedi.']))
      .finally(() => setBusy(false));
  }, [authenticated]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) {
      setLoginError('Supabase bağlantısı henüz yapılandırılmadı.');
      return;
    }
    setBusy(true);
    setLoginError('');
    try {
      rememberSession(remember);
      const { error } = await supabase.auth.signInWithPassword({ email: username.trim(), password });
      if (error) {
        if (error.code === 'invalid_credentials') {
          setLoginError('E-posta veya şifre bu Supabase projesindeki hesapla eşleşmiyor.');
        } else if (error.code === 'email_not_confirmed') {
          setLoginError('Hesabın e-posta adresi henüz doğrulanmamış.');
        } else if (!error.status || error.name === 'AuthRetryableFetchError') {
          setLoginError('Giriş sunucusuna ulaşılamıyor. İnternet bağlantısını ve Supabase proje adresini kontrol edin.');
        } else {
          setLoginError(`Giriş tamamlanamadı: ${error.message}`);
        }
        return;
      }
      setPassword('');
    } catch {
      setLoginError('Giriş sunucusuna bağlanılamadı. İnternet bağlantısını ve Supabase proje adresini kontrol edin.');
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await supabase?.auth.signOut();
    setUsername('');
    setPassword('');
  }

  useEffect(() => {
    const oldTitle = document.title;
    document.title = 'Fotoğraf yönetimi | Demeter';
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    const activeUrls = urls.current;
    return () => {
      document.title = oldTitle;
      meta.remove();
      activeUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  useEffect(() => {
    if (!modalOpen) return;
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    removeCancel.current?.focus();
    function keydown(event: KeyboardEvent) {
      if (event.key === 'Escape') { setRemoving(null); setPreview(null); setEditing(null); }
      if (event.key === 'Tab') {
        const buttons = document.querySelectorAll<HTMLButtonElement>('.ag-dialog button');
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    }
    document.addEventListener('keydown', keydown);
    return () => {
      document.body.style.overflow = oldOverflow;
      document.removeEventListener('keydown', keydown);
      returnFocus.current?.focus();
    };
  }, [modalOpen]);

  function revoke(src: string) {
    if (urls.current.delete(src)) URL.revokeObjectURL(src);
  }

  async function prepare(files: FileList | null) {
    if (!files?.length || busy) return;
    if (files.length > remaining) {
      setErrors([`Bu kategoriye ${remaining} fotoğraf daha seçebilirsiniz. Seçiminizi azaltıp tekrar deneyin.`]);
      return;
    }
    setBusy(true);
    setErrors([]);
    setMessage('');
    const failures: string[] = [];
    const prepared: Prepared[] = [];
    for (const file of Array.from(files)) {
      try {
        const photo = await optimizePhoto(file);
        urls.current.add(photo.src);
        prepared.push(photo);
      } catch (error) {
        failures.push(`${file.name}: ${error instanceof Error ? error.message : 'Fotoğraf okunamadı.'}`);
      }
    }
    setPending(previous => [...previous, ...prepared]);
    setErrors(failures);
    setBusy(false);
  }

  async function addPhotos() {
    if (!pending.length || busy) return;
    if (category.photos.length + pending.length > LIMIT) return;
    if (!supabase) return;
    setBusy(true);
    setErrors([]);
    const savedIds = new Set<string>();
    let stage = 'Fotoğraf yükleme';
    try {
      const startPosition = category.photos.length;
      for (const [index, photo] of pending.entries()) {
        stage = 'Fotoğraf deposuna yükleme';
        const extension = photo.blob.type === 'image/jpeg' ? 'jpg' : photo.blob.type === 'image/png' ? 'png' : 'webp';
        const path = `${selectedId}/${crypto.randomUUID()}.${extension}`;
        const { error: uploadError } = await supabase.storage.from('gallery').upload(path, photo.blob, { contentType: photo.blob.type });
        if (uploadError) throw uploadError;
        stage = 'Galeri kaydını oluşturma';
        const { error: insertError } = await supabase.from('gallery_photos').insert({
          category_id: selectedId,
          storage_path: path,
          caption: photo.caption.trim().slice(0, 80) || 'Demeter çiçek tasarımı',
          position: startPosition + index,
          is_cover: !category.coverId && index === 0,
        });
        if (insertError) {
          // Yalnızca bu denemede yüklenen ve kaydı oluşturulamayan dosyayı temizle.
          const { error: cleanupError } = await supabase.storage.from('gallery').remove([path]);
          if (cleanupError) throw new Error(`${errorMessage(insertError, 'Kayıt oluşturulamadı.')} Yüklenen dosya temizlenemedi: ${cleanupError.message}`);
          throw insertError;
        }
        savedIds.add(photo.id);
      }
      const count = pending.length;
      pending.forEach(photo => revoke(photo.src));
      setPending([]);
      stage = 'Kaydedilen fotoğrafları görüntüleme';
      await loadGallery();
      setMessage(`${count} fotoğraf yüklendi ve ana galeriye eklendi.`);
    } catch (error) {
      pending.filter(photo => savedIds.has(photo.id)).forEach(photo => revoke(photo.src));
      setPending(previous => previous.filter(photo => !savedIds.has(photo.id)));
      setErrors([`${stage}: ${errorMessage(error, 'İşlem tamamlanamadı.')}`]);
      if (savedIds.size) {
        setMessage(`${savedIds.size} fotoğraf kaydedildi. Kalan fotoğrafları tekrar deneyebilirsiniz.`);
        try { await loadGallery(); } catch (refreshError) {
          setErrors(previous => [...previous, errorMessage(refreshError, 'Galeri yenilenemedi.')]);
        }
      }
    } finally {
      setBusy(false);
    }
  }

  async function removePhoto() {
    if (!removing) return;
    if (!supabase) return;
    const removed = removing;
    setBusy(true);
    setErrors([]);
    try {
      const wasCover = category.coverId === removed.id;
      const nextPhoto = category.photos.find(photo => photo.id !== removed.id);
      const { error } = await supabase.from('gallery_photos').delete().eq('id', removed.id);
      if (error) throw error;
      if (removed.storagePath) {
        const { error: storageError } = await supabase.storage.from('gallery').remove([removed.storagePath]);
        if (storageError) throw storageError;
      }
      if (wasCover && nextPhoto) {
        const { error: coverError } = await supabase.rpc('set_gallery_cover', { photo_id: nextPhoto.id, selected_category: selectedId });
        if (coverError) throw coverError;
      }
      setRemoving(null);
      await loadGallery();
      setMessage('Fotoğraf ana galeriden kaldırıldı.');
    } catch (error) {
      setErrors([error instanceof Error ? error.message : 'Fotoğraf kaldırılamadı.']);
    } finally {
      setBusy(false);
    }
  }

  async function setCover(photo: Photo) {
    if (!supabase || busy || photo.id === category.coverId) return;
    setBusy(true);
    setErrors([]);
    const { error } = await supabase.rpc('set_gallery_cover', { photo_id: photo.id, selected_category: selectedId });
    if (error) setErrors([error.message]);
    else {
      await loadGallery();
      setMessage('Kategori kapağı değiştirildi.');
    }
    setBusy(false);
  }

  function openCaptionEditor(photo: Photo) {
    setEditedCaption(photo.caption);
    setEditing(photo);
  }

  async function updateCaption(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || !editing || busy) return;
    const caption = editedCaption.trim();
    if (!caption) return;
    setBusy(true);
    setErrors([]);
    try {
      const { error } = await supabase.from('gallery_photos').update({ caption }).eq('id', editing.id);
      if (error) throw error;
      setEditing(null);
      await loadGallery();
      setMessage('Fotoğraf adı güncellendi ve ana siteye yansıtıldı.');
    } catch (error) {
      setErrors([errorMessage(error, 'Fotoğraf adı güncellenemedi.')]);
    } finally {
      setBusy(false);
    }
  }

  function changeCategory(id: string) {
    if (id === selectedId || busy) return;
    if (pending.length && !window.confirm('Seçili fotoğraflar henüz eklenmedi. Seçimi bırakıp kategori değiştirmek istiyor musunuz?')) return;
    pending.forEach(photo => revoke(photo.src));
    setPending([]);
    setErrors([]);
    setMessage('');
    setSelectedId(id);
  }

  if (authChecking) {
    return <div className="ag-login-page"><p role="status">Yönetim paneli açılıyor…</p></div>;
  }

  if (!authenticated) {
    return <div className="ag-login-page">
      <a className="ag-login-back" href="/"><ArrowLeft size={17} /> Siteye dön</a>
      <main className="ag-login-card">
        <div className="ag-login-mark" aria-hidden="true"><LockKeyhole size={25} /></div>
        <span className="ag-login-brand">DEMETER</span>
        <h1>Yönetim paneli</h1>
        <p>Galeri fotoğraflarını düzenlemek için giriş yapın.</p>
        <form onSubmit={login}>
          <label htmlFor="admin-username">E-posta adresi</label>
          <input id="admin-username" name="username" type="email" inputMode="email" autoComplete="username" autoFocus value={username} onChange={event => { setUsername(event.target.value); setLoginError(''); }} required />
          <label htmlFor="admin-password">Şifre</label>
          <div className="ag-password-field">
            <input id="admin-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={event => { setPassword(event.target.value); setLoginError(''); }} required />
            <button type="button" aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'} onClick={() => setShowPassword(value => !value)}>{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button>
          </div>
          {loginError && <p className="ag-login-error" role="alert">{loginError}</p>}
          <label className="ag-remember"><input type="checkbox" checked={remember} onChange={event => setRemember(event.target.checked)} /> Oturumumu açık tut</label>
          <button className="ag-login-submit" type="submit" disabled={busy}>{busy ? 'Giriş yapılıyor…' : 'Giriş yap'}</button>
        </form>
        <small>Bu panel yalnızca yetkili kullanıcılar içindir.</small>
      </main>
    </div>;
  }

  return (
    <div className="ag-page">
      <header className="ag-header">
        <div><span className="ag-brand">DEMETER</span><span className="ag-header-label">Fotoğraf yönetimi</span></div>
        <div className="ag-header-actions"><a href="/"><ArrowLeft size={17} /> Siteye dön</a><button type="button" onClick={() => void logout()}><LogOut size={17} /> Çıkış yap</button></div>
      </header>
      <main className="ag-main">
        <div className="ag-intro"><div><h1>Galeri fotoğrafları</h1><p>Kategori seçin, fotoğraf ekleyin veya kaldırın.</p></div><span className="ag-total"><Images size={18} /> {total} fotoğraf · 7 kategori</span></div>
        {!supabaseConfigured && <div className="ag-demo" role="note"><strong>Bağlantı eksik</strong><span>Supabase ortam değişkenleri tanımlanmadığı için değişiklikler kaydedilemez.</span></div>}
        <div className="ag-layout">
          <aside className="ag-sidebar"><h2>1. Kategori seçin</h2><nav aria-label="Galeri kategorileri">
            {categories.map(item => {
              const cover = item.photos.find(photo => photo.id === item.coverId) ?? item.photos[0];
              return <button key={item.id} type="button" disabled={busy} aria-pressed={item.id === selectedId} onClick={() => changeCategory(item.id)} className={item.id === selectedId ? 'ag-category ag-selected' : 'ag-category'}>
                {cover ? <img src={cover.src} alt="" loading="lazy" /> : <span className="ag-category-placeholder"><Images size={18} /></span>}
                <span>{item.title}<small>{item.photos.length} / {LIMIT} fotoğraf</small></span>
                {item.id === selectedId && <Check size={18} />}
              </button>;
            })}
          </nav><p className="ag-side-note">Her kategoride en fazla 20 fotoğraf bulunabilir.</p></aside>
          <section className="ag-content" aria-labelledby="ag-category-title">
            <div className="ag-section-heading"><div><h2 id="ag-category-title">{category.title}</h2><p>{category.photos.length} / {LIMIT} fotoğraf · {LIMIT - category.photos.length} boş yer</p></div></div>
            <div className="ag-upload">
              <h3>2. Fotoğraf ekleyin</h3><p>Birden fazla fotoğraf seçebilirsiniz. Fotoğraflar otomatik küçültülür; oranları korunur.</p>
              <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden disabled={busy || remaining <= 0} onChange={event => { void prepare(event.currentTarget.files); event.currentTarget.value = ''; }} />
              <button className="ag-upload-button" type="button" disabled={busy || remaining <= 0} onClick={() => fileInput.current?.click()}>
                {busy ? <Loader2 className="ag-spin" size={26} /> : <ImagePlus size={28} />}
                <strong>{busy ? 'Fotoğraflar hazırlanıyor…' : remaining <= 0 ? 'Fotoğraf sınırına ulaşıldı' : 'Telefondan veya bilgisayardan fotoğraf seç'}</strong>
                <span>JPG, PNG, WebP · Dosya başına en fazla 20 MB</span>
              </button>
              <p className="ag-hint">Hazırlanan görseller: uzun kenar en fazla 1600 piksel, dosya en fazla 500 KB.</p>
              {errors.length > 0 && <div className="ag-errors" role="alert">{errors.map((error, index) => <p key={index}>{error}</p>)}</div>}
              {pending.length > 0 && <div className="ag-pending">
                <h4>Seçilen fotoğraflar ({pending.length})</h4>
                <div className="ag-pending-grid">{pending.map(photo => <div key={photo.id} className="ag-pending-photo">
                  <img src={photo.src} alt={photo.caption} />
                  <button type="button" aria-label={`${photo.caption} seçimini kaldır`} disabled={busy} onClick={() => { revoke(photo.src); setPending(previous => previous.filter(item => item.id !== photo.id)); }}><X size={17} /></button>
                  <label><span>Fotoğraf adı</span><input type="text" maxLength={80} value={photo.caption} disabled={busy} onChange={event => setPending(previous => previous.map(item => item.id === photo.id ? { ...item, caption: event.target.value } : item))} /></label>
                  <span>{formatSize(photo.originalBytes)} → <strong>{formatSize(photo.bytes!)}</strong></span>
                </div>)}</div>
                <button className="ag-primary" type="button" disabled={busy} onClick={() => void addPhotos()}>{busy ? 'Yükleniyor…' : `${pending.length} fotoğrafı galeriye ekle`}</button>
                <p className="ag-hint">Fotoğraflar kaydedildiğinde ana sitede görünür.</p>
              </div>}
            </div>
            <p className="ag-status" role="status" aria-live="polite">{message}</p>
            <div className="ag-list-heading"><h3>3. Fotoğrafları yönetin</h3><span>★ Kategori kapağı</span></div>
            <div className="ag-photo-grid">{category.photos.map((photo, index) => <article className="ag-photo" key={photo.id}>
              <button className="ag-photo-preview" type="button" onClick={() => setPreview(photo)} aria-label={`${photo.caption} fotoğrafını büyüt`}>
                <img src={photo.src} alt={photo.caption} loading="lazy" style={{ objectFit: category.contain ? 'contain' : 'cover' }} />
                {photo.id === category.coverId && <span className="ag-cover-badge"><Star size={13} fill="currentColor" /> Kapak</span>}
              </button>
              <div className="ag-photo-body"><p title={photo.caption}>{photo.caption || `Fotoğraf ${index + 1}`}</p>
                <div className="ag-photo-actions"><button type="button" disabled={busy} onClick={() => openCaptionEditor(photo)}><Pencil size={15} /> Adını düzenle</button>
                <button type="button" disabled={busy || photo.id === category.coverId} onClick={() => void setCover(photo)}><Star size={15} />{photo.id === category.coverId ? 'Kapak' : 'Kapak yap'}</button>
                <button type="button" className="ag-remove" disabled={busy} onClick={() => setRemoving(photo)}><Trash2 size={15} /> Kaldır</button></div>
              </div>
            </article>)}</div>
            {category.photos.length === 0 && <div className="ag-empty"><Images size={36} /><h3>Bu kategoride henüz fotoğraf yok</h3><p>Yukarıdaki düğmeden ilk fotoğrafı ekleyin.</p></div>}
          </section>
        </div>
      </main>
      {modalOpen && <div className="ag-overlay" onClick={event => { if (event.target === event.currentTarget) { setRemoving(null); setPreview(null); setEditing(null); } }}>
        <div className={preview ? 'ag-dialog ag-preview-dialog' : 'ag-dialog'} role="dialog" aria-modal="true" aria-labelledby="ag-dialog-title">
          {removing ? <><h2 id="ag-dialog-title">Fotoğraf kaldırılsın mı?</h2><p>“{removing.caption}” seçili kategoriden ve ana siteden kaldırılacak.</p><p>Kategori kapağıysa kalan ilk fotoğraf kapak olur.</p><div className="ag-dialog-actions"><button ref={removeCancel} type="button" onClick={() => setRemoving(null)}>Vazgeç</button><button className="ag-danger" type="button" disabled={busy} onClick={() => void removePhoto()}>{busy ? 'Kaldırılıyor…' : 'Evet, kaldır'}</button></div></>
          : editing ? <form className="ag-edit-form" onSubmit={updateCaption}><h2 id="ag-dialog-title">Fotoğraf adını düzenle</h2><p>Bu ad fotoğrafın altında ana sitede de görünecek.</p><label htmlFor="ag-photo-name">Fotoğraf adı</label><input id="ag-photo-name" type="text" maxLength={80} value={editedCaption} onChange={event => setEditedCaption(event.target.value)} disabled={busy} autoFocus required /><small>{editedCaption.trim().length} / 80 karakter</small><div className="ag-dialog-actions"><button ref={removeCancel} type="button" onClick={() => setEditing(null)}>Vazgeç</button><button className="ag-save" type="submit" disabled={busy || !editedCaption.trim()}>{busy ? 'Kaydediliyor…' : 'Kaydet'}</button></div></form>
          : preview && <><div className="ag-preview-heading"><h2 id="ag-dialog-title">Fotoğraf önizlemesi</h2><button ref={removeCancel} type="button" aria-label="Önizlemeyi kapat" onClick={() => setPreview(null)}><X size={22} /></button></div><img src={preview.src} alt={preview.caption} /><p>{preview.caption}</p></>}
        </div>
      </div>}
    </div>
  );
}
