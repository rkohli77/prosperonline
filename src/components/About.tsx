const About = () => {
  return (
    <section id="about" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 animate-fade-in-up">
            About{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              ProsperOnline
            </span>
          </h2>
          
          <div className="space-y-6 text-lg text-muted-foreground animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <p className="leading-relaxed">
              We're a dynamic startup specializing in comprehensive digital solutions for businesses 
              looking to establish and grow their online presence. Our team combines innovative 
              strategies with proven methodologies to deliver results that matter.
            </p>
            
            <p className="leading-relaxed">
              From digital marketing and SEO optimization to social media management and analytics, 
              we provide the tools and expertise businesses need to succeed in today's competitive 
              digital landscape. We're passionate about helping companies transform their online 
              presence and achieve sustainable growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center group animate-scale-in" style={{ animationDelay: '0.4s' }}>
              <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse-glow transition-smooth">
                <span className="text-white text-2xl font-bold">5+</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Years Experience</h3>
              <p className="text-muted-foreground">Helping businesses grow online</p>
            </div>

            <div className="text-center group animate-scale-in" style={{ animationDelay: '0.5s' }}>
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse-glow transition-smooth">
                <span className="text-white text-2xl font-bold">100+</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Happy Clients</h3>
              <p className="text-muted-foreground">Across Canada and beyond</p>
            </div>

            <div className="text-center group animate-scale-in" style={{ animationDelay: '0.6s' }}>
              <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse-glow transition-smooth">
                <span className="text-white text-2xl font-bold">24/7</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Support</h3>
              <p className="text-muted-foreground">Always here when you need us</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;