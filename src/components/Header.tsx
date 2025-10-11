import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronDown } from 'lucide-react';
import logo from '@/assets/logo.webp';
import { handleGetStarted } from '@/lib/navigation';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      // Close mobile menu when scrolling
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    // Handle hash navigation when landing on home page with #contact
    if (window.location.pathname === '/' && window.location.hash === '#contact') {
      setTimeout(() => {
        scrollToSection('contact');
      }, 100);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileMenuOpen) {
        const target = event.target as Element;
        // Check if click is outside the mobile menu and not on the menu button
        if (!target.closest('.mobile-menu') && !target.closest('.mobile-menu-button')) {
          setIsMobileMenuOpen(false);
        }
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleMobileNavigation = (path: string) => {
    setIsMobileMenuOpen(false);
    if (path === '/') {
      window.location.href = '/';
    } else {
      window.location.href = path;
    }
  };

  const handleMobileGetStarted = () => {
    setIsMobileMenuOpen(false);
    handleGetStarted();
  };


  return (
    <>
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

          {/* Desktop Navigation */}
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

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="mobile-menu-button text-foreground hover:text-accent hover:bg-accent/10 transition-all duration-300"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 transition-transform duration-300" />
              ) : (
                <Menu className="h-6 w-6 transition-transform duration-300" />
              )}
            </Button>
          </div>
        </div>
      </nav>
    </header>

    {/* Embedded Mobile Menu */}
    <div className={`mobile-menu md:hidden fixed top-0 left-0 w-full bg-gradient-to-b from-background/98 via-background/95 to-background/98 backdrop-blur-sm shadow-xl z-40 transition-all duration-300 ease-in-out ${
      isMobileMenuOpen 
        ? 'translate-y-0 opacity-100' 
        : '-translate-y-full opacity-0 pointer-events-none'
    }`} style={{ top: '80px' }}>
      <div className="container mx-auto px-4 py-6">
        {/* Navigation Links */}
        <nav className="space-y-2 mb-6">
          <button
            onClick={() => handleMobileNavigation('/')}
            className="w-full text-left px-4 py-3 rounded-xl text-foreground hover:text-accent hover:bg-accent/10 transition-all duration-200 flex items-center justify-between group"
          >
            <span className="font-medium text-lg">Home</span>
            <ChevronDown className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rotate-[-90deg]" />
          </button>
          <button
            onClick={() => handleMobileNavigation('/about')}
            className="w-full text-left px-4 py-3 rounded-xl text-foreground hover:text-accent hover:bg-accent/10 transition-all duration-200 flex items-center justify-between group"
          >
            <span className="font-medium text-lg">About</span>
            <ChevronDown className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rotate-[-90deg]" />
          </button>
          <button
            onClick={() => handleMobileNavigation('/blogs')}
            className="w-full text-left px-4 py-3 rounded-xl text-foreground hover:text-accent hover:bg-accent/10 transition-all duration-200 flex items-center justify-between group"
          >
            <span className="font-medium text-lg">Blog</span>
            <ChevronDown className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rotate-[-90deg]" />
          </button>
        </nav>

        {/* CTA Button */}
        <div className="mb-6">
          <Button
            onClick={handleMobileGetStarted}
            className="w-full bg-gradient-accent hover:shadow-glow transition-all duration-300 text-base py-3 rounded-xl font-medium"
          >
            Get Started Today
          </Button>
        </div>

        {/* Contact Info */}
        <div className="bg-muted/20 rounded-xl p-4 border border-border/20">
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div className="flex items-center space-x-3 text-muted-foreground">
              <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs">📧</span>
              </div>
              <div>
                <p className="font-medium text-foreground">Email</p>
                <p className="text-xs">info@prosperonline.ca</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-muted-foreground">
              <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs">🇨🇦</span>
              </div>
              <div>
                <p className="font-medium text-foreground">Location</p>
                <p className="text-xs">Serving Canada</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-muted-foreground">
              <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs">⚡</span>
              </div>
              <div>
                <p className="font-medium text-foreground">Response</p>
                <p className="text-xs">Within 24 hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Header;