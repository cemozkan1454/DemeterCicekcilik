import { Car, Flower2, Gift, Heart, Sprout } from 'lucide-react';
import { services } from '@/config/content';

const icons = { Car, Flower2, Gift, Heart, Sprout };

export default function Services() {
  return (
    <section id="ciceklerimiz" className="py-20 sm:py-24 bg-cream-100">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <p className="text-sage-600 text-xs tracking-widest-2 uppercase mb-4">Çiçeklerimiz & Hizmetlerimiz</p>
        <h2 className="text-4xl sm:text-5xl text-sage-800 font-light">Hayatın içinden, sizin için.</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
          {services.map((service) => {
            const Icon = icons[service.icon];
            return (
              <article key={service.id} className="p-7 sm:p-8 rounded-2xl border border-cream-300 bg-cream-50">
                <Icon size={28} aria-hidden="true" className="text-sage-500 mb-5" />
                <h3 className="text-2xl text-sage-800 mb-3">{service.title}</h3>
                <p className="text-charcoal-700 text-sm leading-relaxed">{service.description}</p>
              </article>
            );
          })}
          <div className="rounded-2xl bg-sage-800 text-cream-50 p-8 flex flex-col justify-center">
            <p className="font-serif text-3xl italic leading-snug">Bir çiçek, bazen söyleyemediklerimizi söyler.</p>
            <a href="#demeterin-hikayesi" className="mt-5 text-sm underline underline-offset-4">Demeter’in hikâyesini okuyun</a>
          </div>
        </div>
      </div>
    </section>
  );
}
