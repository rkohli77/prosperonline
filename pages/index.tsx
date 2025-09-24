import Header from '../components/Header';
import Hero from '../components/Hero';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
