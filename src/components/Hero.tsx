import { ArrowUpRight } from 'lucide-react';

export default function Hero() {
  return (
    <section id="top" className="bg-cream-100 pt-32 pb-16 sm:pt-40 sm:pb-24">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div>
          <p className="text-sage-600 text-xs tracking-widest-2 uppercase mb-6">Demeter Çiçek Tasarım · Bolu</p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl text-sage-800 font-light leading-[1.1]">
            Her çiçekte bir duygu,<br /><span className="italic">her bukette bir hikâye.</span>
          </h1>
          <p className="mt-7 text-charcoal-700 leading-relaxed max-w-md">
            Çiçeklerin renkleriyle küçük anları güzelleştiriyor, özel günlerinize
            özenle hazırlanan tasarımlarla eşlik ediyoruz.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <a href="#galeri" className="rounded-full px-6 py-3.5 bg-sage-700 text-white inline-flex gap-2 items-center hover:bg-sage-800 transition-colors">
              Tasarımlarımızı Keşfedin <ArrowUpRight size={18} aria-hidden="true" />
            </a>
            <a href="#iletisim" className="rounded-full px-6 py-3.5 border border-sage-300 text-sage-800 hover:bg-sage-100 transition-colors">Bize Ulaşın</a>
          </div>
        </div>
        <figure className="max-w-md w-full mx-auto">
          <img src="/images/41039b0caf784ea1.jpg" alt="Demeter’in dükkânında hazırlanan pembe kutulu beyaz gül aranjmanı"
            width="518" height="640" loading="eager" className="w-full rounded-t-[10rem] rounded-b-3xl" />
          <figcaption className="mt-4 text-sm text-sage-600 text-center">Demeter’den bir dokunuş.</figcaption>
        </figure>
      </div>
    </section>
  );
}
