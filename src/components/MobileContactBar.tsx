import { MessageCircle, Phone } from 'lucide-react';
import { siteConfig } from '@/config/site';

export default function MobileContactBar() {
  return (
    <nav
      aria-label="Hızlı iletişim seçenekleri"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 grid grid-cols-2 bg-sage-800 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(0,0,0,0.12)]"
    >
      <a
        href={siteConfig.whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 bg-sage-600 text-cream-50 py-4 text-sm font-medium active:bg-sage-700 transition-colors"
      >
        <MessageCircle size={20} />
        WhatsApp
      </a>
      <a
        href={siteConfig.phoneHref}
        className="flex items-center justify-center gap-2 bg-sage-800 text-cream-50 py-4 text-sm font-medium active:bg-sage-900 transition-colors"
      >
        <Phone size={20} />
        Ara
      </a>
    </nav>
  );
}
