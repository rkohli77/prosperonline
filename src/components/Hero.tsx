import { Button } from '@/components/ui/button';
import heroBackground from '@/assets/hero-background.webp';

const Hero = () => {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroBackground}
          alt="Digital marketing background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/70 to-background/90" />
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-accent/20 rounded-full animate-float" />
        <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-primary/20 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-accent/10 rounded-full animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 animate-fade-in-up">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Digital Solutions
            </span>
            <br />
            <span className="text-foreground">That Drive Results</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-6 sm:mb-8 animate-fade-in-up max-w-3xl mx-auto px-2" style={{ animationDelay: '0.2s' }}>
            We help businesses grow online with marketing, SEO, custom website, lead generation, and analytics solutions designed for the Canadian market.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 animate-fade-in-up px-4" style={{ animationDelay: '0.4s' }}>
            <Button
              onClick={scrollToContact}
              size="lg"
              className="w-full sm:w-auto bg-gradient-accent hover:shadow-glow transition-smooth text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 hover-lift"
            >
              Get Started Today
            </Button>
            <Button
              onClick={() => window.location.href = '/about'}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-smooth"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-accent rounded-full flex justify-center">
          <div className="w-1 h-2 bg-accent rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;