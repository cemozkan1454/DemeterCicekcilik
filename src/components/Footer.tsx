import { Instagram, MapPin, Phone } from 'lucide-react';
import { siteConfig } from '@/config/site';
import BrandLogo from './BrandLogo';

const footerLinks = [
  { href: '#galeri', label: 'Çiçeklerimiz & Hizmetlerimiz' },
  { href: '#demeterin-hikayesi', label: 'Hikâyemiz' },
  { href: '#iletisim', label: 'Dükkânımız' },
];

function CornerBotanical({ side }: { side: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 220 250" className={`footer-botanical footer-botanical-${side}`} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M34 235C48 178 103 110 162 27" strokeWidth="1.4" />
        <g fill="currentColor" fillOpacity=".09" strokeWidth="1.2">
          <path d="M49 192C17 179 15 153 23 134C47 147 57 169 49 192Z" />
          <path d="M49 192C72 160 99 161 115 168C97 192 73 200 49 192Z" />
          <path d="M83 135C53 126 50 101 58 80C82 95 88 112 83 135Z" />
          <path d="M83 135C104 110 128 108 148 118C128 138 108 145 83 135Z" />
          <path d="M119 86C100 70 101 48 112 33C127 50 130 67 119 86Z" />
          <path d="M119 86C138 62 159 60 177 69C160 89 139 94 119 86Z" />
        </g>
      </g>
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="footer-shell">
      <div className="footer-panel">
        <CornerBotanical side="left" /><CornerBotanical side="right" />
        <div className="footer-inner">
          <div className="footer-brand">
            <a href="#top" aria-label="Demeter — ana sayfa" className="footer-logo"><BrandLogo /></a>
            <p className="font-serif text-xl italic text-cream-100 mt-5">Toprağın bereketi, çiçeklerin dili.</p>
          </div>
          <nav aria-label="Alt menü" className="footer-nav">
            <p className="footer-eyebrow">Keşfedin</p>
            {footerLinks.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
          </nav>
          <div className="footer-contact">
            <p className="footer-eyebrow">Bize ulaşın</p>
            <a href={siteConfig.phoneHref}><Phone size={16} aria-hidden="true" />{siteConfig.phone}</a>
            <a href={siteConfig.mapsHref} target="_blank" rel="noopener noreferrer"><MapPin size={16} aria-hidden="true" />Merkez / Bolu</a>
            <a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer"><Instagram size={16} aria-hidden="true" />{siteConfig.instagramHandle}</a>
          </div>
        </div>
        <div className="footer-divider" aria-hidden="true"><span>✦</span></div>
        <p className="footer-copyright">© {new Date().getFullYear()} {siteConfig.name}. Tüm hakları saklıdır.</p>
      </div>
    </footer>
  );
}
