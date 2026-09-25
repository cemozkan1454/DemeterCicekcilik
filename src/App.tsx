import BotanicalDecor from '@/components/BotanicalDecor';
import Storefront from '@/components/Storefront';
import SEO from '@/components/SEO';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Intro from '@/components/Intro';
import Services from '@/components/Services';
import Gallery from '@/components/Gallery';
import DemeterStory from '@/components/DemeterStory';
import Footer from '@/components/Footer';
import MobileContactBar from '@/components/MobileContactBar';

function App() {
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
        <Services />
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
