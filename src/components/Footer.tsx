const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-xl font-bold">ProsperOnline.ca</span>
            </div>
            <p className="text-primary-foreground/80 mb-4 max-w-md">
              Helping Canadian businesses grow online with comprehensive digital marketing solutions, 
              SEO optimization, and analytics-driven strategies.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-primary-foreground/60 hover:text-accent transition-smooth">
                LinkedIn
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-accent transition-smooth">
                Facebook
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-accent transition-smooth">
                Twitter
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#services" className="hover:text-accent transition-smooth">Digital Marketing</a></li>
              <li><a href="#services" className="hover:text-accent transition-smooth">SEO Optimization</a></li>
              <li><a href="#services" className="hover:text-accent transition-smooth">Lead Generation</a></li>
              <li><a href="#services" className="hover:text-accent transition-smooth">Analytics</a></li>
              <li><a href="#services" className="hover:text-accent transition-smooth">Social Media</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-2 text-primary-foreground/80">
              <li>📧 info@prosperonline.ca</li>
              <li>🇨🇦 Serving Canada</li>
              <li>⚡ 24h Response Time</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-primary-foreground/60">
            &copy; 2025 ProsperOnline.ca. All rights reserved. Built with 💙 for Canadian businesses.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;