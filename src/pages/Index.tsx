import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import About from '@/components/About';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
<div> 
<script>
  var _hsq = window._hsq = window._hsq || [];
  _hsq.push(['setPath', '/home']);
</script>

<script type="text/javascript" id="hs-script-loader" async defer src="//js.hs-scripts.com/{hubId}.js"></script>
</div>
const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Services />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
