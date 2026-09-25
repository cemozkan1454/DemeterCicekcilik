import { siteConfig } from '@/config/site';
import BrandLogo from './BrandLogo';

export default function Footer() {
  return (
    <footer className="bg-cream-50 py-10">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <a href="#top" aria-label="Demeter — ana sayfa"><BrandLogo /></a>
          <p className="text-sage-700 text-sm mt-4">Toprağın bereketi, çiçeklerin dili.</p>
        </div>
        <div className="text-sm text-charcoal-700 sm:text-right space-y-3">
          <a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer" className="text-sage-700 underline underline-offset-4">{siteConfig.instagramHandle}</a>
          <p>© {new Date().getFullYear()} {siteConfig.name}. Tüm hakları saklıdır.</p>
          <p>Merkez / Bolu</p>
        </div>
      </div>
    </footer>
  );
}
