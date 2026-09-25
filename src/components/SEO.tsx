import { useEffect } from 'react';
import { siteConfig } from '@/config/site';

export default function SEO() {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Florist',
      name: siteConfig.name,
      description: siteConfig.description,
      telephone: siteConfig.phone,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Bolu',
        addressRegion: 'Bolu',
        addressCountry: 'TR',
        streetAddress: siteConfig.address,
      },
      sameAs: [siteConfig.instagram],
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
    return () => { script.remove(); };
  }, []);
  return null;
}
