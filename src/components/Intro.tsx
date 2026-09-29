import { useReveal } from '@/hooks/useReveal';

export default function Intro() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="hakkimizda" className="py-14 sm:py-20 bg-cream-50">
      <div ref={ref} className="reveal max-w-3xl mx-auto px-5 sm:px-8 text-center">
        <p className="text-sage-500 text-sm tracking-widest-2 uppercase mb-5">
          Demeter Çiçek Tasarım
        </p>
        <h2 className="text-4xl sm:text-5xl text-sage-800 font-light leading-tight text-balance">
          Bolu’da, çiçeklerle güzelleşen bir dünya.
        </h2>
        <div className="w-16 h-px bg-sage-400 mx-auto my-8" />
        <p className="text-charcoal-700 text-lg leading-relaxed font-light text-balance">
          Aşağısoku Mahallesi’ndeki dükkânımızda buket tasarımlarını, saksı ve
          kesme çiçekleri, hediyelikleri bir araya getiriyoruz. Araç süslemeden
          özel gün tasarımlarına, hayatınızdaki anlamlı anlara çiçeklerle
          eşlik ediyoruz.
        </p>
      </div>
    </section>
  );
}
