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
        </div>
      </div>
    </section>
  );
};

export default About;