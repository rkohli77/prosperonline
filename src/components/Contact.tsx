import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Success!",
        description: `Thank you, ${formData.name}! We'll contact you at ${formData.email} within 24 hours.`,
        className: "bg-success text-success-foreground",
      });
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        service: '',
        message: '',
      });
      
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section id="contact" className="py-24 bg-gradient-primary relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-glow rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Contact Info */}
          <div className="text-white animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Get Started Today
            </h2>
            <p className="text-xl mb-8 text-primary-foreground/90">
              Ready to grow your business online? Contact us for a free consultation and audit.
            </p>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <span className="text-xl">📧</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Email</h3>
                  <p className="text-primary-foreground/80">info@prosperonline.ca</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <span className="text-xl">🇨🇦</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Serving</h3>
                  <p className="text-primary-foreground/80">Businesses across Canada</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <span className="text-xl">⚡</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Response Time</h3>
                  <p className="text-primary-foreground/80">Within 24 hours</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="bg-white/95 backdrop-blur-md shadow-custom-lg animate-scale-in">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Send us a message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="focus-ring"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="focus-ring"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="focus-ring"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="focus-ring"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service">Service Interested In</Label>
                  <Select value={formData.service} onValueChange={(value) => handleInputChange('service', value)}>
                    <SelectTrigger className="focus-ring">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="digital-marketing">Digital Marketing</SelectItem>
                      <SelectItem value="seo">SEO Optimization</SelectItem>
                      <SelectItem value="lead-generation">Lead Generation</SelectItem>
                      <SelectItem value="analytics">Analytics & Insights</SelectItem>
                      <SelectItem value="social-media">Social Media</SelectItem>
                      <SelectItem value="crm">CRM Integration</SelectItem>
                      <SelectItem value="multiple">Multiple Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Tell us about your project and goals..."
                    className="focus-ring min-h-[120px]"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-accent hover:shadow-glow transition-smooth hover-lift text-lg py-3"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;