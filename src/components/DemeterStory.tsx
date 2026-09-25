import { Leaf, Sprout } from 'lucide-react';

const meanings = [
  'Sevginin büyüdükçe çoğalması',
  'Küçük anların güzelleşmesi',
  'Doğanın hayatımıza dokunması',
];

export default function DemeterStory() {
  return (
    <section
      id="demeterin-hikayesi"
      aria-labelledby="demeter-story-title"
      className="py-14 sm:py-20 bg-cream-100 scroll-mt-24"
    >
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <Leaf size={32} aria-hidden="true" className="text-sage-500 mx-auto mb-6" />
          <p className="text-sage-500 text-sm tracking-widest-2 uppercase mb-4">
            Demeter Çiçek Tasarım
          </p>
          <h2 id="demeter-story-title" className="text-4xl sm:text-5xl text-sage-800 font-light">
            Demeter’in Hikâyesi
          </h2>
          <p className="font-serif text-2xl sm:text-3xl text-sage-700 mt-6 leading-relaxed text-balance">
            Toprağın bereketi, çiçeklerin dili ve sevginin en güzel hâli.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mt-8 sm:mt-10">
          <div className="border-t border-sage-200 pt-8">
            <Sprout size={28} aria-hidden="true" className="text-sage-500 mb-4" />
            <h3 className="text-2xl text-sage-800 font-medium mb-4">İsmimizin İlhamı</h3>
            <p className="text-charcoal-700 font-light leading-relaxed">
              Yunan mitolojisinde Demeter; toprağın, bereketin ve hasadın
              tanrıçasıdır. İsmimiz, doğanın yeniden canlanmasından ve
              bereketinden ilham alır.
            </p>
          </div>
          <div className="border-t border-sage-200 pt-8">
            <Leaf size={28} aria-hidden="true" className="text-sage-500 mb-4" />
            <h3 className="text-2xl text-sage-800 font-medium mb-4">Bizim İçin Demeter</h3>
            <ul className="space-y-3 text-charcoal-700 font-light leading-relaxed">
              {meanings.map((meaning) => (
                <li key={meaning} className="flex items-start gap-3">
                  <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-sage-400 shrink-0 mt-2.5" />
                  <span>{meaning}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <figure className="mt-8 sm:mt-10 border border-cream-300 rounded-3xl bg-cream-50 px-6 py-7 sm:px-10 sm:py-8 text-center">
          <figcaption className="text-sage-500 text-xs sm:text-sm tracking-widest-2 uppercase mb-5">
            Demeter’in Sözü
          </figcaption>
          <blockquote className="font-serif text-2xl sm:text-3xl italic text-sage-800 leading-relaxed max-w-2xl mx-auto text-balance">
            “Çiçekler doğanın diliyse, bizim adımız da o dilin en eski hikâyelerinden biri.”
          </blockquote>
        </figure>
      </div>
    </section>
  );
}
