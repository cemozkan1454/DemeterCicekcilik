import { lazy, Suspense } from 'react';
import BotanicalDecor from '@/components/BotanicalDecor';
import Storefront from '@/components/Storefront';
import SEO from '@/components/SEO';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Intro from '@/components/Intro';
import Gallery from '@/components/Gallery';
import DemeterStory from '@/components/DemeterStory';
import Footer from '@/components/Footer';
import MobileContactBar from '@/components/MobileContactBar';

const AdminGallery = lazy(() => import('@/components/AdminGallery'));

function App() {
  if (window.location.pathname.replace(/\/+$/, '') === '/admin') {
    return <Suspense fallback={<p role="status" className="p-8">Fotoğraf yönetimi açılıyor…</p>}><AdminGallery /></Suspense>;
  }
  return (
    <>
      <SEO />
      <Header />
      <div className="site-canvas">
      <BotanicalDecor />
      <main>
        <Hero />
        <Intro />
        <Gallery />
        <DemeterStory />
        <Storefront />
      </main>
      <Footer />
      </div>
      <MobileContactBar />
    </>
  );
}

export default App;
