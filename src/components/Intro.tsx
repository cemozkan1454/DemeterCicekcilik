import { useReveal } from '@/hooks/useReveal';

export default function Intro() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="hakkimizda" className="relative py-24 sm:py-32 lg:py-40 bg-sage-900 text-white bg-cover bg-center" style={{ backgroundImage: 'linear-gradient(rgba(20, 32, 20, 0.68), rgba(20, 32, 20, 0.72)), url("/images/about-floral-background.avif")' }}>
      <div ref={ref} className="reveal relative max-w-3xl mx-auto px-5 sm:px-8 text-center">
        <p className="text-white text-sm tracking-widest-2 uppercase mb-5">
          Demeter Çiçek Tasarım
        </p>
        <h2 className="text-4xl sm:text-5xl text-white font-light leading-tight text-balance">
          Bolu’da, çiçeklerle güzelleşen bir dünya.
        </h2>
        <div className="w-16 h-px bg-white/50 mx-auto my-8" />
        <p className="text-white text-base sm:text-lg leading-relaxed font-light text-balance">
          Aşağısoku Mahallesi’ndeki dükkânımızda buket tasarımlarını, saksı ve
          kesme çiçekleri, hediyelikleri bir araya getiriyoruz. Araç süslemeden
          özel gün tasarımlarına, hayatınızdaki anlamlı anlara çiçeklerle
          eşlik ediyoruz.
        </p>
      </div>
    </section>
  );
}
