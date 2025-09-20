import Header from '@/components/Header';
import About from '@/components/About';
import Services from '@/components/Services';
import Footer from '@/components/Footer';

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <About />
        <Services />
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
