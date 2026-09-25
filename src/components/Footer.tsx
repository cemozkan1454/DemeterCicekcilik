import { Instagram, MapPin, Phone } from 'lucide-react';
import { siteConfig } from '@/config/site';
import BrandLogo from './BrandLogo';

const footerLinks = [
  { href: '#galeri', label: 'Galeri' },
  { href: '#ciceklerimiz', label: 'Hizmetlerimiz' },
  { href: '#demeterin-hikayesi', label: 'Hikâyemiz' },
];

function CornerBotanical({ side }: { side: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 220 250" className={`footer-botanical footer-botanical-${side}`} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 246C42 204 37 162 77 127C111 97 96 49 144 5" strokeWidth="1.5" />
        {[[35,207,-36],[49,174,24],[70,140,-32],[87,109,28],[105,74,-30],[128,34,20]].map(([x,y,rotation], index) => (
          <g key={index} transform={`translate(${x} ${y}) rotate(${rotation})`}>
            <path d="M0 0C6-18 22-27 40-23C39-5 24 8 0 0Z" fill="currentColor" fillOpacity=".12" />
            <path d="M2-1C15-8 26-15 38-21" strokeWidth="1" strokeOpacity=".7" />
          </g>
        ))}
        <g transform="translate(78 126)" stroke="#e8c4bc" strokeWidth="1">
          {[0,1,2,3,4].map((index) => <ellipse key={index} cy="-11" rx="5" ry="11" transform={`rotate(${index * 72})`} fill="#e8c4bc" fillOpacity=".22" />)}
          <circle r="4" fill="#d4bb81" fillOpacity=".65" />
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
