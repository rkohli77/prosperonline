import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { handleGetStarted } from '@/lib/navigation';

const About = () => {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="pt-32 sm:pt-40 md:pt-52 lg:pt-60 pb-16 sm:pb-20 md:pb-32 bg-gradient-to-r from-blue-300 via-white to-blue-500 to-purple-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 sm:px-6 relative">
          <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-6 sm:mb-8 animate-fade-in-up">
            About{' '}
               <span className="bg-gradient-to-r from-blue-600 via-purple-900 to-pink-600 bg-clip-text text-transparent">
              ProsperOnline
            </span>
             </h1>
          
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 sm:mb-12 animate-fade-in-up max-w-4xl mx-auto leading-relaxed px-2" style={{ animationDelay: '0.2s' }}>
              We're a dynamic startup specializing in comprehensive digital solutions for businesses 
              looking to establish and grow their online presence in the Canadian market.
            </p>
          </div>
        </div>
      </section>
      {/* Story Section */}
      <section className="py-16 sm:py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
              <div className="animate-fade-in-up">
                <span className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium mb-6">
                  Our Journey
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-6 sm:mb-8 text-foreground leading-tight">
                  Building Digital Success Stories
                </h2>
                <div className="space-y-4 sm:space-y-6 text-base sm:text-lg text-muted-foreground leading-relaxed">
                  <p>
                    Founded in 2025 with a vision to democratize digital marketing for Canadian businesses, 
                    ProsperOnline is a small team of passionate developers providing comprehensive 
                    digital solutions to businesses.
                  </p>
                  <p>
                    We understand that every business is unique, especially in the diverse Canadian market. 
                    That's why we don't believe in one-size-fits-all solutions. Instead, we craft personalized 
                    strategies that align with your business goals, target audience, and industry dynamics.
                  </p>
                  <p>
                    Our success is measured by your success - it's that simple. We're not just service providers; 
                    we're your growth partners, committed to helping you achieve sustainable, long-term success 
                    in the digital landscape.
                  </p>
                </div>
              </div>
              
              <div className="animate-fade-in-up lg:pl-12" style={{ animationDelay: '0.2s' }}>
                <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 rounded-3xl p-8 md:p-12 relative overflow-hidden">
                  <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-primary opacity-10 rounded-full blur-xl"></div>
                  <div className="relative">
                    <div className="text-6xl mb-6 text-center">🧭</div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-6 text-foreground text-center">Our Mission</h3>
                    <p className="text-muted-foreground leading-relaxed text-center text-lg">
                      To empower our clients with cutting-edge digital marketing solutions 
                      that drive real growth, measurable results, and lasting success in an increasingly 
                      competitive digital marketplace.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 animate-fade-in-up">
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  How We Work
                </span>
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                Our proven process ensures every project delivers exceptional results through strategic planning and flawless execution.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="group bg-card border-2 border-transparent hover:border-accent/20 transition-smooth animate-scale-in" style={{ animationDelay: '0.1s' }}>
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center text-2xl font-bold text-white group-hover:animate-pulse-glow transition-smooth">
                    1
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground">
                    Discover & Analyze
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    We dive deep into your business, market, and competition to understand your unique challenges and opportunities.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="group bg-card border-2 border-transparent hover:border-accent/20 transition-smooth animate-scale-in" style={{ animationDelay: '0.2s' }}>
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-accent flex items-center justify-center text-2xl font-bold text-white group-hover:animate-pulse-glow transition-smooth">
                    2
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground">
                    Strategy & Planning
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    We create a customized digital strategy with clear goals, timelines, and measurable KPIs tailored to your business.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="group bg-card border-2 border-transparent hover:border-accent/20 transition-smooth animate-scale-in" style={{ animationDelay: '0.3s' }}>
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center text-2xl font-bold text-white group-hover:animate-pulse-glow transition-smooth">
                    3
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground">
                    Execute & Optimize
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    We implement your strategy with precision and continuously optimize based on real-time data and performance metrics.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-8 animate-fade-in-up">
                Why Choose{' '}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  ProsperOnline?
                </span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-card via-card to-muted/20 border border-border hover:border-accent/30 transition-smooth animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="text-5xl mb-6 group-hover:animate-float">🇨🇦</div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">Canadian Expertise</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Deep understanding of the Canadian market, regulations, consumer behavior, and cultural nuances that matter for your success.
                </p>
              </div>
              
              <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-card via-card to-muted/20 border border-border hover:border-accent/30 transition-smooth animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="text-5xl mb-6 group-hover:animate-float">⚡</div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">Lightning Fast</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Quick turnaround times with 24-hour response guarantee and rapid implementation to get your campaigns live fast.
                </p>
              </div>
              
              <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-card via-card to-muted/20 border border-border hover:border-accent/30 transition-smooth animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div className="text-5xl mb-6 group-hover:animate-float">🎯</div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">Data-Driven Results</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Every strategy backed by comprehensive analytics, A/B testing, and measurable ROI to ensure your investment pays off.
                </p>
              </div>

              <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-card via-card to-muted/20 border border-border hover:border-accent/30 transition-smooth animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <div className="text-5xl mb-6 group-hover:animate-float">🤝</div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">Partnership Approach</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We're not just vendors - we're your growth partners invested in your long-term success and business growth.
                </p>
              </div>

              <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-card via-card to-muted/20 border border-border hover:border-accent/30 transition-smooth animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                <div className="text-5xl mb-6 group-hover:animate-float">🔧</div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">Custom Solutions</h3>
                <p className="text-muted-foreground leading-relaxed">
                  No cookie-cutter approaches. Every solution is tailored specifically to your industry, audience, and business goals.
                </p>
              </div>

              <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-card via-card to-muted/20 border border-border hover:border-accent/30 transition-smooth animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                <div className="text-5xl mb-6 group-hover:animate-float">🏆</div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">Proven Track Record</h3>
                <p className="text-muted-foreground leading-relaxed">
                  95% client satisfaction rate with documented case studies showing consistent growth and ROI improvements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 animate-fade-in-up">
              Ready to{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Prosper Online?
              </span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 animate-fade-in-up max-w-3xl mx-auto" style={{ animationDelay: '0.2s' }}>
              Join us in our journey to help Canadian businesses transform their digital presence with our proven strategies. 
              Let's discuss how we can help you achieve your growth goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Button 
              onClick={handleGetStarted}
              size="lg" className="text-lg px-8 py-4 rounded-full">
                Start Your Free Consultation
              </Button>
            </div>
          </div>
        </div>
      </section>
      </div>
  );
};

export default About;