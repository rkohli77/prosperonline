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
    <section id="services" className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Our Services
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Comprehensive digital solutions tailored to help your business thrive in the online marketplace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card
              key={service.title}
              className="group hover-lift bg-gradient-card border-0 shadow-custom-md hover:shadow-custom-lg transition-smooth animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-accent flex items-center justify-center text-3xl group-hover:animate-pulse-glow transition-smooth">
                  {service.icon}
                </div>
                <CardTitle className="text-xl font-bold text-foreground group-hover:text-accent transition-smooth">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-muted-foreground leading-relaxed">
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