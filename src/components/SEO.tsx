import { useEffect } from 'react';
import { siteConfig } from '@/config/site';

export default function SEO() {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Florist',
      '@id': `${siteConfig.url}#isletme`,
      name: siteConfig.name,
      description: siteConfig.description,
      url: siteConfig.url,
      image: siteConfig.image,
      logo: `${siteConfig.url}images/demeter-logo.png`,
      foundingDate: siteConfig.foundingDate,
      telephone: siteConfig.telephone,
      hasMap: siteConfig.mapsHref,
      openingHoursSpecification: [{
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '09:00',
        closes: '23:00',
      }],
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Bolu',
        addressRegion: 'Bolu',
        addressCountry: 'TR',
        streetAddress: 'Aşağısoku Mahallesi, Emek Sokak, Kocaoğlu İnşaat 7B/8',
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
