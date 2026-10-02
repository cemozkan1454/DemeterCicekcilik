import { useRef, useState, type CSSProperties } from 'react';
import { ArrowUp, ArrowUpRight, ChevronLeft, ChevronRight, Car, Flower2, Heart, Instagram, MessageCircle } from 'lucide-react';
import ZoomImage from './ZoomImage';
import { galleryCategories } from '@/config/gallery';
import { siteConfig } from '@/config/site';

export default function Gallery() {
  const [selectedId, setSelectedId] = useState(galleryCategories[0].id);
  const [panelOpen, setPanelOpen] = useState(true);
  const panel = useRef<HTMLDivElement>(null);
  const categoryGrid = useRef<HTMLDivElement>(null);
  const photoRail = useRef<HTMLDivElement>(null);
  const categoryButtons = useRef<Record<string, HTMLButtonElement | null>>({});
  const category = galleryCategories.find((item) => item.id === selectedId)!;
  function selectCategory(id: string) {
    setSelectedId(id);
    setPanelOpen(true);
    requestAnimationFrame(() => {
      photoRail.current?.scrollTo({ left: 0 });
      panel.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      panel.current?.focus({ preventScroll: true });
    });
  }
  function closePanel() {
    setPanelOpen(false);
    categoryButtons.current[selectedId]?.focus({ preventScroll: true });
    categoryGrid.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  }
  function movePhotos(direction: number) {
    const rail = photoRail.current;
    if (rail) rail.scrollBy({ left: direction * rail.clientWidth, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }
  return (
    <section id="galeri" className="py-16 sm:py-20 bg-cream-50" aria-labelledby="gallery-title">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="sm:flex justify-between items-end gap-6 mb-10">
          <div><p className="text-sage-600 text-xs tracking-widest-2 uppercase mb-4">Demeter’den Tasarımlar</p><h2 id="gallery-title" className="text-4xl sm:text-5xl text-sage-800 font-light">Çiçeklerimiz & Hizmetlerimiz</h2><p className="text-charcoal-700 mt-4">Bir kategori seçin, tasarımlarımızı yakından keşfedin.</p></div>
          <a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-sage-700 text-white rounded-full px-6 py-3.5 mt-5 text-sm hover:bg-sage-800 shrink-0"><Instagram size={19} aria-hidden="true" /> Instagram’da Bizi Takip Edin <ArrowUpRight size={16} aria-hidden="true" /></a>
        </div>
        <div ref={categoryGrid} className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 scroll-mt-28" aria-label="Tasarım kategorileri">
          {galleryCategories.map((item) => {
            const selected = panelOpen && item.id === selectedId;
            const Icon = item.id === 'arac-susleme' ? Car : item.id === 'isteme-ve-teklif' ? Heart : Flower2;
            return <button ref={(element) => { categoryButtons.current[item.id] = element; }} key={item.id} type="button" onClick={() => selectCategory(item.id)} aria-pressed={selected} aria-expanded={selected} aria-controls="gallery-collection" className={`group text-left rounded-2xl overflow-hidden border shadow-sm transition-colors ${selected ? 'border-sage-700 bg-sage-700 text-white' : 'border-cream-300 bg-white text-sage-800 hover:border-sage-400'}`}>
              <div className="aspect-[5/4] overflow-hidden bg-cream-100">{item.photos.length > 0 ? <img src={item.photos[item.coverIndex ?? 0].src} style={{ objectPosition: item.coverPosition ?? "center" }} alt="" loading="lazy" decoding="async" className={`w-full h-full transition-transform duration-300 motion-safe:group-hover:scale-105 ${item.contain ? 'object-contain p-2' : 'object-cover'}`} /> : <div className="h-full flex items-center justify-center bg-gradient-to-br from-cream-100 to-sage-100"><Icon size={48} strokeWidth={1} className="text-sage-500" aria-hidden="true" /></div>}</div>
              <div className="px-4 py-4 flex items-center justify-between gap-2"><span className="font-serif text-lg sm:text-xl">{item.title}</span><ArrowUpRight size={18} className="shrink-0" aria-hidden="true" /></div>
            </button>;
          })}
        </div>
        <div hidden={!panelOpen} ref={panel} id="gallery-collection" tabIndex={-1} aria-labelledby="collection-title" className="mt-10 sm:mt-14 scroll-mt-28 rounded-3xl bg-cream-100 border border-cream-300 p-5 sm:p-8">
          <div className="sm:hidden flex justify-end mb-3"><button type="button" onClick={closePanel} className="inline-flex min-h-11 items-center gap-2 text-sm text-sage-700">Kategorilere dön <ArrowUp size={18} aria-hidden="true" /></button></div><div className="flex flex-wrap justify-between items-end gap-5 mb-7"><div><p className="text-xs uppercase tracking-widest text-sage-600 mb-2">Seçtiğiniz koleksiyon</p><h3 id="collection-title" className="font-serif text-3xl sm:text-4xl text-sage-800">{category.title}</h3><p className="mt-3 text-charcoal-700 max-w-xl">{category.description}</p></div><a href={siteConfig.whatsappHref} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-sage-700 px-6 py-3.5 text-sm font-medium text-white shadow-md hover:bg-sage-800 hover:shadow-lg transition-all"><MessageCircle size={19} aria-hidden="true" /> Bilgi Alın <ArrowUpRight size={17} aria-hidden="true" /></a></div>
          {category.photos.length > 0 ? <>
            {category.photos.length > 1 && <div className="flex justify-between items-center mb-4"><p className="text-sm text-sage-700">{category.photos.length} tasarım · Dokunup inceleyin</p><div className="collection-rail-controls gap-2" data-count-over-four={category.photos.length > 4} data-count-over-six={category.photos.length > 6}><button type="button" onClick={() => movePhotos(-1)} aria-label="Önceki tasarımları göster" aria-controls="collection-photos" className="rounded-full border border-sage-300 bg-cream-50 p-3 text-sage-800 hover:bg-sage-100"><ChevronLeft size={20} /></button><button type="button" onClick={() => movePhotos(1)} aria-label="Sonraki tasarımları göster" aria-controls="collection-photos" className="rounded-full border border-sage-300 bg-cream-50 p-3 text-sage-800 hover:bg-sage-100"><ChevronRight size={20} /></button></div></div>}
            <div key={category.id} ref={photoRail} id="collection-photos" aria-label={`${category.title} fotoğrafları`} className={`collection-photo-grid ${category.photos.length === 1 ? 'collection-photo-grid-single' : ''}`}>{category.photos.map((item, index) => <figure key={item.src} style={{ '--tablet-column': Math.floor(index / 4) * 2 + index % 2 + 1, '--tablet-row': Math.floor((index % 4) / 2) + 1, '--desktop-column': Math.floor(index / 6) * 3 + index % 3 + 1, '--desktop-row': Math.floor((index % 6) / 3) + 1 } as CSSProperties} className="min-w-0 snap-start"><div className="aspect-[3/4] rounded-2xl overflow-hidden bg-cream-50"><ZoomImage src={item.src} alt={item.alt} collection={category.photos} initialIndex={index} loading="lazy" decoding="async" className={`w-full h-full ${category.contain ? 'object-contain' : 'object-cover'}`} /></div><figcaption className="font-serif text-lg sm:text-xl text-sage-800 mt-3">{item.caption}</figcaption></figure>)}</div>
          </> : <div className="rounded-2xl bg-cream-50 border border-cream-300 p-6 text-charcoal-700"><p>Bu kategoriye ait fotoğrafları yakında paylaşacağız.</p><p className="mt-2">Tasarım seçenekleri hakkında bize ulaşabilirsiniz.</p></div>}
          <div className="flex justify-end mt-6 border-t border-cream-300 pt-5"><button type="button" onClick={closePanel} aria-label="Koleksiyonu kapat ve kategorilere dön" className="inline-flex items-center gap-2 rounded-full border border-sage-300 bg-cream-50 pl-4 pr-3 py-3 text-sm text-sage-800 hover:bg-sage-100 transition-colors">Kategorilere dön <ArrowUp size={20} aria-hidden="true" /></button></div>
        </div>
        <div className="mt-10 rounded-3xl bg-sage-800 text-cream-50 p-7 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-md">
          <div><h3 className="font-serif text-2xl sm:text-3xl">Aklınızdaki çiçeği birlikte tasarlayalım.</h3><p className="mt-3 text-cream-200 leading-relaxed">Renk, çiçek ve özel gün tercihlerinizi bizimle paylaşın.</p></div>
          <a href={siteConfig.whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-cream-50 text-sage-800 px-6 py-3.5 font-medium text-sm hover:bg-cream-200 transition-colors"><MessageCircle size={19} aria-hidden="true" /> WhatsApp’tan Konuşalım <ArrowUpRight size={17} aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  );
}
