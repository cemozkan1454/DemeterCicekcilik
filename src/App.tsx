import SEO from '@/components/SEO';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Intro from '@/components/Intro';
import Services from '@/components/Services';
import Gallery from '@/components/Gallery';
import DemeterStory from '@/components/DemeterStory';
import ContactCTA from '@/components/ContactCTA';
import Footer from '@/components/Footer';
import MobileContactBar from '@/components/MobileContactBar';

function App() {
  return (
    <>
      <SEO />
      <Header />
      <main>
        <Hero />
        <Intro />
        <Services />
        <Gallery />
        <DemeterStory />
        <ContactCTA />
      </main>
      <Footer />
      <MobileContactBar />
    </>
  );
}

export default App;
