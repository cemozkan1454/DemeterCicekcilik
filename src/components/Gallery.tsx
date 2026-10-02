import { useRef, useState } from 'react';
import { ArrowUpRight, Car, Flower2, Heart, Instagram, MessageCircle } from 'lucide-react';
import ZoomImage from './ZoomImage';
import { galleryCategories } from '@/config/gallery';
import { siteConfig } from '@/config/site';

export default function Gallery() {
  const [selectedId, setSelectedId] = useState(galleryCategories[0].id);
  const panel = useRef<HTMLDivElement>(null);
  const category = galleryCategories.find((item) => item.id === selectedId)!;
  function selectCategory(id: string) {
    setSelectedId(id);
    requestAnimationFrame(() => {
      panel.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      panel.current?.focus({ preventScroll: true });
    });
  }
  return (
    <section id="galeri" className="py-16 sm:py-20 bg-cream-50" aria-labelledby="gallery-title">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="sm:flex justify-between items-end gap-6 mb-10">
          <div><p className="text-sage-600 text-xs tracking-widest-2 uppercase mb-4">Demeter’den Tasarımlar</p><h2 id="gallery-title" className="text-4xl sm:text-5xl text-sage-800 font-light">Her an için bir çiçek.</h2><p className="text-charcoal-700 mt-4">Bir kategori seçin, tasarımlarımızı yakından keşfedin.</p></div>
          <a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-sage-700 text-white rounded-full px-6 py-3.5 mt-5 text-sm hover:bg-sage-800 shrink-0"><Instagram size={19} aria-hidden="true" /> Instagram’da Bizi Takip Edin <ArrowUpRight size={16} aria-hidden="true" /></a>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5" aria-label="Tasarım kategorileri">
          {galleryCategories.map((item) => {
            const selected = item.id === selectedId;
            const Icon = item.id === 'arac-susleme' ? Car : item.id === 'evlenme-teklifi' ? Heart : Flower2;
            return <button key={item.id} type="button" onClick={() => selectCategory(item.id)} aria-pressed={selected} aria-controls="gallery-collection" className={`group text-left rounded-2xl overflow-hidden border shadow-sm transition-colors ${selected ? 'border-sage-700 bg-sage-700 text-white' : 'border-cream-300 bg-white text-sage-800 hover:border-sage-400'}`}>
              <div className="aspect-[5/4] overflow-hidden bg-cream-100">{item.photos.length > 0 ? <img src={item.photos[0].src} alt="" loading="lazy" decoding="async" className={`w-full h-full transition-transform duration-300 motion-safe:group-hover:scale-105 ${item.contain ? 'object-contain p-2' : 'object-cover'}`} /> : <div className="h-full flex items-center justify-center bg-gradient-to-br from-cream-100 to-sage-100"><Icon size={48} strokeWidth={1} className="text-sage-500" aria-hidden="true" /></div>}</div>
              <div className="px-4 py-4 flex items-center justify-between gap-2"><span className="font-serif text-lg sm:text-xl">{item.title}</span><ArrowUpRight size={18} className="shrink-0" aria-hidden="true" /></div>
            </button>;
          })}
        </div>
        <div ref={panel} id="gallery-collection" tabIndex={-1} aria-labelledby="collection-title" className="mt-10 sm:mt-14 scroll-mt-28 rounded-3xl bg-cream-100 border border-cream-300 p-5 sm:p-8">
          <div className="flex flex-wrap justify-between items-end gap-5 mb-7"><div><p className="text-xs uppercase tracking-widest text-sage-600 mb-2">Seçtiğiniz koleksiyon</p><h3 id="collection-title" className="font-serif text-3xl sm:text-4xl text-sage-800">{category.title}</h3><p className="mt-3 text-charcoal-700 max-w-xl">{category.description}</p></div><a href={siteConfig.whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-sage-800 underline underline-offset-4"><MessageCircle size={18} aria-hidden="true" /> Bilgi alın</a></div>
          {category.photos.length > 0 ? <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-7 sm:gap-x-6">{category.photos.map((item) => <figure key={item.src}><div className="aspect-[3/4] rounded-2xl overflow-hidden bg-cream-50"><ZoomImage src={item.src} alt={item.alt} loading="lazy" decoding="async" className={`w-full h-full ${category.contain ? 'object-contain' : 'object-cover'}`} /></div><figcaption className="font-serif text-lg sm:text-xl text-sage-800 mt-3">{item.caption}</figcaption></figure>)}</div> : <div className="rounded-2xl bg-cream-50 border border-cream-300 p-6 text-charcoal-700"><p>Bu kategoriye ait fotoğrafları yakında paylaşacağız.</p><p className="mt-2">Tasarım seçenekleri hakkında bize ulaşabilirsiniz.</p></div>}
        </div>
      </div>
    </section>
  );
}
