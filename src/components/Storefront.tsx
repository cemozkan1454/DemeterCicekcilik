import ZoomImage from './ZoomImage';
import { MapPin, ArrowUpRight, Phone, MessageCircle, Instagram, Clock } from 'lucide-react';
import { siteConfig } from '@/config/site';

export default function Storefront() {
  return (
    <section id="iletisim" className="bg-cream-50 py-16 sm:py-20" aria-labelledby="storefront-title">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="grid grid-cols-2 gap-3 sm:gap-5 items-start">
          <ZoomImage src="/images/demeter-giris.jpg" alt="Demeter Çiçek Tasarım’ın tabelası ve kırmızı halılı dükkân girişi" width="1200" height="1600" loading="lazy" className="w-full aspect-[3/4] object-cover rounded-t-[5rem] rounded-b-2xl" />
          <div className="mt-12"><ZoomImage src="/images/demeter-dis-cephe.jpg" alt="Demeter’in Emek Sokak’taki çiçekli vitrini ve dış cephesi" width="1200" height="1600" loading="lazy" className="w-full aspect-[3/4] object-cover rounded-2xl" /></div>
        </div>
        <div>
          <p className="text-sage-600 text-xs tracking-widest-2 uppercase mb-4">Dükkânımız & İletişim</p>
          <h2 id="storefront-title" className="text-4xl sm:text-5xl text-sage-800 font-light">Çiçeklerimizi yakından keşfedin.</h2>
          <p className="mt-5 text-charcoal-700 leading-relaxed">Buketlerimizi, saksı çiçeklerimizi ve hediyeliklerimizi görmek için Aşağısoku Mahallesi’ndeki dükkânımıza bekliyoruz.</p>
          <address className="not-italic mt-6 flex gap-3 text-sage-700 leading-relaxed"><MapPin className="shrink-0 mt-1" size={20} aria-hidden="true" />{siteConfig.address}</address>
          <a href={siteConfig.phoneHref} className="mt-5 inline-flex items-center gap-3 text-xl text-sage-800"><Phone size={20} aria-hidden="true" />{siteConfig.phone}</a>
          <p className="mt-5 flex items-center gap-3 text-sage-700"><Clock size={20} aria-hidden="true" />Pazartesi–Cumartesi · 09.00–17.00</p>
          <div className="flex flex-wrap gap-3 mt-6">
            <a href={siteConfig.whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-sage-300 px-5 py-3 text-sage-800 hover:bg-sage-100"><MessageCircle size={18} aria-hidden="true" />WhatsApp</a>
            <a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-sage-300 px-5 py-3 text-sage-800 hover:bg-sage-100"><Instagram size={18} aria-hidden="true" />Instagram</a>
          </div>
          <a href={siteConfig.mapsHref} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex items-center gap-3 rounded-full bg-sage-700 text-white px-6 py-3.5 hover:bg-sage-800 transition-colors">Yol Tarifi Al <ArrowUpRight size={18} aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  );
}
