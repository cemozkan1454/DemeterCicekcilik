import { Instagram, MapPin, MessageCircle, Phone } from 'lucide-react';
import { siteConfig } from '@/config/site';

export default function ContactCTA() {
  return (
    <section id="iletisim" className="py-20 sm:py-24 bg-sage-800 text-cream-50">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 grid md:grid-cols-2 gap-10 md:gap-16">
        <div>
          <p className="text-sage-200 text-xs tracking-widest-2 uppercase mb-4">İletişim</p>
          <h2 className="text-4xl sm:text-5xl font-light">Çiçeklerden konuşalım.</h2>
          <p className="mt-6 text-cream-100 leading-relaxed">Tasarımlarımız hakkında bilgi almak için bize ulaşabilir, çiçeklerimizi yakından görmek için dükkânımıza uğrayabilirsiniz.</p>
        </div>
        <div className="space-y-6">
          <address className="not-italic flex gap-3 leading-relaxed"><MapPin size={22} className="shrink-0 mt-1 text-sage-200" aria-hidden="true" />{siteConfig.address}</address>
          <a href={siteConfig.phoneHref} className="inline-flex items-center gap-3 text-xl"><Phone size={20} aria-hidden="true" />{siteConfig.phone}</a>
          <div className="flex flex-wrap gap-3">
            <a href={siteConfig.mapsHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-cream-50 text-sage-800 px-5 py-3 hover:bg-white"><MapPin size={18} aria-hidden="true" />Yol Tarifi Al</a>
            <a href={siteConfig.whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-cream-50 text-sage-800 px-5 py-3 hover:bg-white"><MessageCircle size={18} aria-hidden="true" />WhatsApp’tan Ulaşın</a>
            <a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-sage-300 px-5 py-3 hover:bg-sage-700"><Instagram size={18} aria-hidden="true" />Instagram</a>
          </div>
        </div>
      </div>
    </section>
  );
}
