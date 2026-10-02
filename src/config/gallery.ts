export type GalleryPhoto = { src: string; alt: string; caption: string };
export type GalleryCategory = { id: string; title: string; description: string; photos: GalleryPhoto[]; contain?: boolean };
const photo = (id: string, caption: string): GalleryPhoto => ({ src: `/images/${id}.jpg`, alt: caption, caption });
export const galleryCategories: GalleryCategory[] = [
  { id: 'aranjmanlar', title: 'Aranjmanlar', description: 'Kutularda ve çantalarda, farklı duygulara eşlik eden çiçek tasarımları.', photos: [photo('b20f0064c203514a', 'Pembe ve mor çiçeklerle kutu aranjmanı'), photo('a5f763441052df25', 'Oyuncak ayılı yeni bebek aranjmanı'), photo('b867cf838bdeba61', 'Güller ve oyuncak ayıyla çanta tasarımı'), photo('8b9e3fb72316f3c1', 'Balonlarla kutlama aranjmanı')] },
  { id: 'buketler', title: 'Buketler', description: 'Sevdiklerinize bir çiçekle söylemek istedikleriniz için.', photos: [photo('af6813b60a9e59b6', 'Kırmızı gül buketi')] },
  { id: 'celenkler', title: 'Çelenkler', contain: true, description: 'Açılışlar ve özel günler için çelenk tasarımları.', photos: Array.from({ length: 6 }, (_, index) => ({ src: `/images/celenk-white/celenk-white-0${index + 1}.png`, alt: `Demeter çelenk tasarımı ${index + 1}`, caption: `Çelenk tasarımı ${index + 1}` })) },
  { id: 'gelin-buketleri', title: 'Gelin Buketleri', description: 'Beyaz ve pastel tonlarda, özel gününüze eşlik eden buketler.', photos: ['pembe-beyaz', 'beyaz', 'pastel', 'detay'].map((name, index) => ({ src: `/images/gelin-buketleri/${name}.jpg`, alt: `İnci ve tül detaylı gelin buketi ${index + 1}`, caption: ['Pembe & beyaz', 'Beyazın zarafeti', 'Pastel bir dokunuş', 'İnci ve tül detayları'][index] })) },
  { id: 'evlenme-teklifi', title: 'Evlenme Teklifi', description: 'Aklınızdaki sürprizi ve çiçek tercihlerinizi birlikte konuşalım.', photos: [] },
  { id: 'isteme-cicegi', title: 'İsteme Çiçeği', description: 'Bu anlamlı gün için renk ve sunum seçeneklerini birlikte belirleyelim.', photos: [] },
  { id: 'arac-susleme', title: 'Araç Süsleme', description: 'Özel gününüz için çiçekli araç süslemelerini birlikte planlayalım.', photos: [] },
  { id: 'saksi', title: 'Saksı Çiçekleri', description: 'Yaşam alanlarına renk katan bitkiler.', photos: [photo('f56f0d89f2fd6338', 'Çiçekli saksı bitkisi')] },
];
