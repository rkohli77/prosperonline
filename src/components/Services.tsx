import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const services = [
  {
    icon: '📈',
    title: 'Digital Marketing',
    description: 'Drive growth with targeted marketing strategies across all digital channels.',
    color: 'from-blue-500 to-purple-600',
  },
  {
    icon: '🔍',
    title: 'SEO Optimization',
    description: 'Improve search rankings and organic traffic with proven SEO techniques.',
    color: 'from-green-500 to-blue-500',
  },
  {
    icon: '🎯',
    title: 'Lead Generation',
    description: 'Convert visitors into qualified leads with optimized conversion funnels.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: '📊',
    title: 'Analytics & Insights',
    description: 'Track performance with detailed reporting and actionable insights.',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: '📱',
    title: 'Social Media',
    description: 'Facebook ads, Instagram marketing, and regular blog content creation.',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: '🔗',
    title: 'CRM Integration',
    description: 'Streamline customer relationship management with automated workflows.',
    color: 'from-teal-500 to-green-500',
  },
];

const Services = () => {
  return (
    <section id="services" className="py-16 sm:py-20 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 animate-fade-in-up">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Our Services
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up px-2" style={{ animationDelay: '0.2s' }}>
            Comprehensive digital solutions tailored to help your business thrive in the online marketplace.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {services.map((service, index) => (
            <Card
              key={service.title}
              className="group hover-lift bg-gradient-card border-0 shadow-custom-md hover:shadow-custom-lg transition-smooth animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="text-center pb-3 sm:pb-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-accent flex items-center justify-center text-2xl sm:text-3xl group-hover:animate-pulse-glow transition-smooth">
                  {service.icon}
                </div>
                <CardTitle className="text-lg sm:text-xl font-bold text-foreground group-hover:text-accent transition-smooth">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center px-4 sm:px-6">
                <CardDescription className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;