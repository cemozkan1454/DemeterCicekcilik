import { ArrowUpRight } from 'lucide-react';
import { galleryItems } from '@/config/content';
import { siteConfig } from '@/config/site';

export default function Gallery() {
  return (
    <section id="galeri" className="py-20 sm:py-24 bg-cream-50">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="sm:flex justify-between items-end gap-6 mb-10">
          <div>
            <p className="text-sage-600 text-xs tracking-widest-2 uppercase mb-4">Demeter’den Kareler</p>
            <h2 className="text-4xl sm:text-5xl text-sage-800 font-light">Çiçeklerle anlattıklarımız.</h2>
            <p className="text-charcoal-700 mt-4">Kendi çalışmalarımızdan seçtiğimiz buketler ve aranjmanlar.</p>
          </div>
          <a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sage-700 mt-5 text-sm underline underline-offset-4 shrink-0">
            Instagram’da daha fazlası <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-6">
          {galleryItems.map((item) => (
            <figure key={item.id}>
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-cream-200">
                <img src={'/images/' + item.id + '.jpg'} alt={item.alt} loading="lazy" decoding="async"
                  className="w-full h-full object-cover" />
              </div>
              <figcaption className="font-serif text-lg sm:text-2xl text-sage-800 mt-3">{item.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
