import { useState, useEffect, useRef } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { siteConfig } from '@/config/site';
import BrandLogo from './BrandLogo';

const navLinks = [
  { href: '#hakkimizda', label: 'Hakkımızda' },
  { href: '#ciceklerimiz', label: 'Hizmetlerimiz' },
  { href: '#galeri', label: 'Galeri' },
  { href: '#demeterin-hikayesi', label: 'Demeter’in Hikâyesi' },
  { href: '#iletisim', label: 'İletişim' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    const desktop = window.matchMedia('(min-width: 1024px)');
    const onResize = () => { if (desktop.matches) setMenuOpen(false); };
    document.addEventListener('keydown', onKey);
    desktop.addEventListener('change', onResize);
    return () => {
      document.removeEventListener('keydown', onKey);
      desktop.removeEventListener('change', onResize);
    };
  }, [menuOpen]);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-b border-cream-200">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between gap-5">
        <a href="#top" aria-label="Demeter — ana sayfa" onClick={() => setMenuOpen(false)}><BrandLogo /></a>
        <nav aria-label="Ana menü" className="hidden lg:flex items-center gap-5 xl:gap-7">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="text-sm font-medium text-sage-800 hover:text-sage-500">{link.label}</a>
          ))}
        </nav>
        <a href={siteConfig.phoneHref} className="hidden lg:inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm bg-sage-700 text-white hover:bg-sage-800">
          <Phone size={16} aria-hidden="true" /> Bizi Ara
        </a>
        <button ref={menuButton} type="button" className="lg:hidden p-3 text-sage-800"
          onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
          aria-expanded={menuOpen} aria-controls="mobile-menu">
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>
      {menuOpen && (
        <nav id="mobile-menu" aria-label="Mobil menü" className="lg:hidden bg-white px-5 pb-6 flex flex-col max-h-[calc(100dvh-10rem)] overflow-y-auto border-t border-cream-200">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
              className="py-3.5 text-sage-800 border-b border-cream-200">{link.label}</a>
          ))}
          <a href={siteConfig.phoneHref} className="mt-4 text-sage-800 inline-flex gap-2 items-center"><Phone size={16} aria-hidden="true" />{siteConfig.phone}</a>
        </nav>
      )}
    </header>
  );
}
