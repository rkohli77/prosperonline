import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logo.webp';
import { handleGetStarted } from '@/lib/navigation';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Handle hash navigation when landing on home page with #contact
    if (window.location.pathname === '/' && window.location.hash === '#contact') {
      setTimeout(() => {
        scrollToSection('contact');
      }, 100);
    }
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };


  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-md shadow-custom-md'
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.location.href = '/'}
              className="focus:outline-none focus-visible:ring-2 ring-accent rounded transition hover:opacity-80"
              aria-label="Go to top of home page"
              style={{ background: 'none', border: 'none', padding: 0 }}
            >
              <img src={logo} alt="ProsperOnline.ca Logo" className="w-60 h-65 object-contain" />
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => window.location.href = '/'}
              className="text-foreground hover:text-accent transition-smooth"
            >
              Home
            </button>
            <button
              onClick={() => window.location.href = '/about'}
              className="text-foreground hover:text-accent transition-smooth"
            >
              About
            </button>
            <button
              onClick={() => window.location.href = '/blogs'}
              className="text-foreground hover:text-accent transition-smooth"
            >
              Blog
            </button>
            <Button
              onClick={handleGetStarted}
              className="bg-gradient-accent hover:shadow-glow transition-smooth"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;