import { useState, useEffect, useLayoutEffect, useRef, useId } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { siteConfig } from '@/config/site';
import BrandLogo from './BrandLogo';

const navLinks = [
  { href: '#hakkimizda', label: 'Hakkımızda' },
  { href: '#galeri', label: 'Çiçeklerimiz & Hizmetlerimiz' },
  { href: '#demeterin-hikayesi', label: 'Demeter’in Hikâyesi' },
  { href: '#iletisim', label: 'İletişim' },
];

function Butterfly() {
  const shading = useId();
  return <svg viewBox="0 0 48 40" width="34" height="29" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id={`${shading}-upper`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#f3d4c0" /><stop offset=".45" stopColor="#cd9293" /><stop offset="1" stopColor="#89596d" />
      </linearGradient>
      <linearGradient id={`${shading}-lower`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#f8dfbb" /><stop offset=".6" stopColor="#e8b9a7" /><stop offset="1" stopColor="#ac7382" />
      </linearGradient>
    </defs>
    <g className="butterfly-wing butterfly-wing-left">
      <path d="M24 21C16 1 2 2 4 14C5 21 14 23 24 21Z" fill={`url(#${shading}-upper)`} />
      <path d="M24 21C9 16 5 25 11 31C17 36 22 28 24 21Z" fill={`url(#${shading}-lower)`} />
      <path d="M21 18L10 10M21 23L13 28" stroke="#fff2e3" strokeWidth="1.2" fill="none" />
    </g>
    <g className="butterfly-wing butterfly-wing-right">
      <path d="M24 21C32 1 46 2 44 14C43 21 34 23 24 21Z" fill={`url(#${shading}-upper)`} />
      <path d="M24 21C39 16 43 25 37 31C31 36 26 28 24 21Z" fill={`url(#${shading}-lower)`} />
      <path d="M27 18L38 10M27 23L35 28" stroke="#fff2e3" strokeWidth="1.2" fill="none" />
    </g>
    <path d="M24 14V29M24 15Q18 8 19 6M24 15Q30 8 29 6" fill="none" stroke="#536746" strokeWidth="1.7" strokeLinecap="round" />
  </svg>;
}
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const menuButton = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  const butterfly = useRef<HTMLSpanElement>(null);
  const flight = useRef<Animation | null>(null);
  const positioned = useRef(false);
  const destination = useRef({ x: -1, y: -1 });

  useLayoutEffect(() => {
    const place = () => {
      const insect = butterfly.current;
      const root = header.current;
      if (!insect || !root) return;
      const desktop = window.matchMedia('(min-width: 1024px)').matches;
      const nav = root.querySelector(desktop ? 'nav[aria-label="Ana menü"]' : '#mobile-menu');
      const target = activeSection ? nav?.querySelector<HTMLAnchorElement>(`a[href="${activeSection}"]`) : null;
      const anchor = target ?? (desktop ? root.querySelector('[data-butterfly-home]') : menuButton.current);
      if (!anchor) return;
      const bounds = root.getBoundingClientRect();
      const rect = anchor.getBoundingClientRect();
      const x = target ? (desktop ? rect.left + rect.width / 2 - 17 : rect.left + 1) - bounds.left : (desktop ? rect.right + 10 : rect.left - 33) - bounds.left;
      const y = target ? (desktop ? rect.top - 28 : rect.top + rect.height / 2 - 14) - bounds.top : 22;
      if (Math.abs(destination.current.x - x) < .5 && Math.abs(destination.current.y - y) < .5) return;
      destination.current = { x, y };
      const current = insect.getBoundingClientRect();
      const fromX = current.left - bounds.left;
      const fromY = current.top - bounds.top;
      flight.current?.cancel();
      insect.style.transform = `translate(${x}px, ${y}px)`;
      if (positioned.current && (desktop || menuOpen) && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && Math.hypot(x - fromX, y - fromY) > 2) {
        insect.classList.add('is-flying');
        const distance = Math.hypot(x - fromX, y - fromY);
        const direction = x >= fromX ? 1 : -1;
        const waves = Math.max(1, Math.min(3, Math.round(distance / 180)));
        // Sample one continuous curve rather than joining a few straight legs.
        const trajectory = Array.from({ length: 121 }, (_, step) => {
          const t = step / 120;
          const progress = t * t * (3 - 2 * t);
          const envelope = Math.sin(Math.PI * t);
          const orbit = Math.sin(t * Math.PI * 2 * waves);
          const depth = Math.sin(t * Math.PI * 2 * waves + Math.PI / 3) * envelope;
          const px = fromX + (x - fromX) * progress + (desktop ? 0 : Math.sin(t * Math.PI) * 8);
          const py = Math.max(2, fromY + (y - fromY) * progress + (desktop ? (12 + orbit * 19) * envelope : 0));
          const bank = direction * Math.cos(t * Math.PI * 2 * waves) * envelope * 17;
          const scale = 1 + depth * (desktop ? .16 : .06);
          return { offset: t, zIndex: desktop && depth < -.08 ? 5 : 20, transform: `translate(${px}px, ${py}px) perspective(240px) rotateZ(${bank}deg) rotateY(${depth * 24}deg) scale(${scale})` };
        });
        flight.current = insect.animate(trajectory, { duration: desktop ? Math.min(2600, 1200 + distance * 1.6) : Math.min(850, 350 + distance), easing: 'linear' });
        flight.current.onfinish = () => insect.classList.remove('is-flying');
      } else insect.classList.remove('is-flying');
      positioned.current = true;
    };
    place();
    const observer = new ResizeObserver(place);
    if (header.current) observer.observe(header.current);
    window.addEventListener('resize', place);
    const mobileMenu = header.current?.querySelector('#mobile-menu');
    mobileMenu?.addEventListener('scroll', place, { passive: true });
    let mounted = true;
    document.fonts.ready.then(() => { if (mounted && header.current) place(); });
    return () => { mounted = false; observer.disconnect(); window.removeEventListener('resize', place); mobileMenu?.removeEventListener('scroll', place); };
  }, [activeSection, menuOpen]);

  useEffect(() => () => { flight.current?.cancel(); }, []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const readingLine = 80 + Math.min(160, window.innerHeight * 0.2);
      let active = '';
      for (const link of navLinks) {
        const section = document.querySelector(link.href);
        if (section && section.getBoundingClientRect().top <= readingLine) active = link.href;
      }
      setActiveSection(active);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(schedule);
    if (document.querySelector('main')) observer.observe(document.querySelector('main')!);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

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
    <header ref={header} className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-b border-cream-200">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between gap-5">
        <a data-butterfly-home href="#top" aria-label="Demeter — ana sayfa" onClick={() => setMenuOpen(false)}><BrandLogo /></a>
        <nav aria-label="Ana menü" className="hidden lg:flex items-center gap-5 xl:gap-7">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} aria-current={activeSection === link.href ? 'location' : undefined} className="floral-nav-link text-sm font-medium text-sage-800 hover:text-sage-500">{link.label}</a>
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
              aria-current={activeSection === link.href ? 'location' : undefined}
              className="floral-nav-link floral-nav-mobile py-3.5 text-sage-800 border-b border-cream-200">{link.label}</a>
          ))}
          <a href={siteConfig.phoneHref} className="mt-4 text-sage-800 inline-flex gap-2 items-center"><Phone size={16} aria-hidden="true" />{siteConfig.phone}</a>
        </nav>
      )}
      <span ref={butterfly} className="nav-butterfly" aria-hidden="true"><Butterfly /></span>
    </header>
  );
}
