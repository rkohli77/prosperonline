import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useToast } from '../hooks/use-toast';

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    industry: '',
    message: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});
    
    // Remove non-digit characters for validation
    const phoneDigits = formData.phone.replace(/\D/g, '');
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email address is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email address';
    if (!formData.message) newErrors.message = 'Message is required';
    if (!formData.industry) newErrors.industry = 'Please select a service';
    if (formData.phone && phoneDigits.length !== 10) newErrors.phone = 'Please enter a valid 10-digit phone number';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast({
        title: "Error",
        description: "Please fix the errors below and try again.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Success!",
        description: `Thank you, ${formData.firstName}! We'll contact you at ${formData.email} within 24 hours.`,
        className: "bg-success text-success-foreground",
      });
      
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        industry: '',
        message: '',
      });
      setErrors({});
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <>
      {/* Skip link for keyboard navigation */}
      <a 
        href="#contact" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-accent"
      >
        Skip to contact form
      </a>
      <section id="contact" className="py-24 bg-gradient-primary relative overflow-hidden" aria-labelledby="contact-heading">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-glow rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Contact Info */}
          <div className="text-white animate-fade-in-up">
            <h2 id="contact-heading" className="text-4xl md:text-5xl font-bold mb-6">
              Get Started Today
            </h2>
            <p className="text-xl mb-8 text-primary-foreground/90">
              Ready to grow your business online? Contact us for a free consultation and audit.
            </p>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm" aria-hidden="true">
                  <span className="text-xl">📧</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Email</h3>
                  <p className="text-primary-foreground/80">
                    <a href="mailto:info@prosperonline.ca" className="hover:text-accent transition-smooth">
                      info@prosperonline.ca
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm" aria-hidden="true">
                  <span className="text-xl">🇨🇦</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Serving</h3>
                  <p className="text-primary-foreground/80">Businesses across Canada</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm" aria-hidden="true">
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
              <CardTitle className="text-2xl text-center" id="form-title">Send us a message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6" role="form" aria-labelledby="form-title" aria-describedby="form-description">
                {/* Form description for screen readers */}
                <p id="form-description" className="sr-only">
                  Fill out this form to contact Prosper Online. All fields marked with an asterisk (*) are required.
                </p>
                
                {/* Error summary for screen readers */}
                {Object.keys(errors).length > 0 && (
                  <div role="alert" aria-live="assertive" className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                    <h3 className="text-sm font-medium text-red-800 mb-2">Please fix the following errors:</h3>
                    <ul className="text-sm text-red-700 list-disc list-inside">
                      {Object.entries(errors).map(([field, error]) => (
                        <li key={field}>
                          <a href={`#${field}`} className="underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded">
                            {error}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4" aria-describedby="personal-info-desc">
                  <legend className="sr-only">Personal Information</legend>
                  <p id="personal-info-desc" className="sr-only">Enter your first and last name</p>
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={`focus-ring ${errors.firstName ? 'border-red-500' : ''}`}
                      required
                      autoComplete="given-name"
                      aria-invalid={!!errors.firstName}
                      aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                    />
                    {errors.firstName && (
                      <p id="firstName-error" className="text-sm text-red-600" role="alert">
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={`focus-ring ${errors.lastName ? 'border-red-500' : ''}`}
                      required
                      autoComplete="family-name"
                      aria-invalid={!!errors.lastName}
                      aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                    />
                    {errors.lastName && (
                      <p id="lastName-error" className="text-sm text-red-600" role="alert">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </fieldset>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <p className="sr-only" id="email-help">Enter a valid email address where we can contact you</p>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`focus-ring ${errors.email ? 'border-red-500' : ''}`}
                    required
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error email-help' : 'email-help'}
                  />
                  {errors.email && (
                    <p id="email-error" className="text-sm text-red-600" role="alert">
                      {errors.email}
                    </p>
                  )}
                </div>
                <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4" aria-describedby="contact-details-desc">
                  <legend className="sr-only">Contact Details</legend>
                  <p id="contact-details-desc" className="sr-only">Enter your phone number and company name (optional)</p>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`focus-ring ${errors.phone ? 'border-red-500' : ''}`}
                      pattern="[0-9\s\-()]{10,}" // allow user to type any format, but validate in JS
                      title="Please enter a valid 10-digit phone number."
                      maxLength={20}
                      autoComplete="tel"
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? 'phone-error' : undefined}
                    />
                    {errors.phone && (
                      <p id="phone-error" className="text-sm text-red-600" role="alert">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="focus-ring"
                      autoComplete="organization"
                    />
                  </div>
                </fieldset>

                <fieldset className="space-y-2" aria-describedby="service-selection-desc">
                  <legend className="text-sm font-medium text-gray-700 mb-2">Service Selection</legend>
                  <p id="service-selection-desc" className="sr-only">Select the service you are most interested in</p>
                  <Label htmlFor="industry">Service Interested In *</Label>
                  <Select name="industry" value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)} required>
                    <SelectTrigger 
                      id="industry" 
                      className={`focus-ring ${errors.industry ? 'border-red-500' : ''}`}
                      aria-invalid={!!errors.industry}
                      aria-describedby={errors.industry ? 'service-error' : undefined}
                    >
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent >
                      <SelectItem value="digital-marketing">Digital Marketing</SelectItem>
                      <SelectItem value="seo">SEO Optimization</SelectItem>
                      <SelectItem value="lead-generation">Lead Generation</SelectItem>
                      <SelectItem value="analytics">Analytics & Insights</SelectItem>
                      <SelectItem value="social-media">Social Media</SelectItem>
                      <SelectItem value="crm">CRM Integration</SelectItem>
                      <SelectItem value="multiple">Multiple Services</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.industry && (
                    <p id="service-error" className="text-sm text-red-600" role="alert">
                      {errors.industry}
                    </p>
                  )}
                </fieldset>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <p className="sr-only" id="message-help">Tell us about your project, goals, and how we can help you</p>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Tell us about your project and goals..."
                    className={`focus-ring min-h-[120px] ${errors.message ? 'border-red-500' : ''}`}
                    required
                    autoComplete="off"
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'message-error message-help' : 'message-help'}
                  />
                  {errors.message && (
                    <p id="message-error" className="text-sm text-red-600" role="alert">
                      {errors.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-accent hover:shadow-glow transition-smooth hover-lift text-lg py-3 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                  aria-describedby="submit-description"
                  aria-label={isSubmitting ? 'Sending your message, please wait' : 'Send your contact message'}
                  aria-live="polite"
                >
                  {isSubmitting ? (
                    <>
                      <span className="sr-only">Sending your message, please wait</span>
                      <span aria-hidden="true">Sending...</span>
                    </>
                  ) : (
                    <>
                      <span className="sr-only">Send your contact message to Prosper Online</span>
                      <span aria-hidden="true">Send Message</span>
                    </>
                  )}
                </Button>
                <p id="submit-description" className="text-sm text-gray-600 text-center">
                  By submitting this form, you agree to be contacted by Prosper Online regarding your inquiry.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
    </>
  );
};

export default Contact;