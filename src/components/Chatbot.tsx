import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { handleGetStarted } from '@/lib/navigation';

const Chatbot = () => {
  return (
    <div className="pt-32 sm:pt-24 bg-background pb-24">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              AI Chatbot
            </span>
            <br />
            <span className="text-foreground">For Your Website</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Boost customer engagement and sales with our plug-and-play AI chatbot. 
            Easy setup, powerful features, and 24/7 customer support.
          </p>
          <Button 
            onClick={handleGetStarted}
            size="lg" 
            className="bg-gradient-accent hover:shadow-glow transition-smooth animate-fade-in-up"
            style={{ animationDelay: '0.4s' }}
          >
            Get Your Chatbot Today
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="hover-lift transition-smooth animate-scale-in">
            <CardHeader className="text-center">
              <div className="text-4xl mb-4">🤖</div>
              <CardTitle>AI-Powered</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription>
                Advanced AI that understands customer queries and provides intelligent responses 24/7.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover-lift transition-smooth animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="text-center">
              <div className="text-4xl mb-4">⚡</div>
              <CardTitle>Easy Setup</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription>
                Copy and paste one line of code. Your chatbot is live in under 5 minutes.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover-lift transition-smooth animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="text-center">
              <div className="text-4xl mb-4">📈</div>
              <CardTitle>Boost Sales</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription>
                Convert more visitors into customers with personalized product recommendations.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover-lift transition-smooth animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="text-center">
              <div className="text-4xl mb-4">🎨</div>
              <CardTitle>Customizable</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription>
                Match your brand colors, style, and personality. Fully customizable interface.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover-lift transition-smooth animate-scale-in" style={{ animationDelay: '0.4s' }}>
            <CardHeader className="text-center">
              <div className="text-4xl mb-4">📊</div>
              <CardTitle>Analytics</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription>
                Track conversations, customer satisfaction, and conversion rates with detailed analytics.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover-lift transition-smooth animate-scale-in" style={{ animationDelay: '0.5s' }}>
            <CardHeader className="text-center">
              <div className="text-4xl mb-4">🔧</div>
              <CardTitle>No Maintenance</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription>
                We handle updates, hosting, and maintenance. You focus on your business.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Simple <span className="bg-gradient-primary bg-clip-text text-transparent">Pricing</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 hover:border-accent/30 transition-smooth">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Starter</CardTitle>
                <div className="text-3xl font-bold mt-4">$29<span className="text-lg text-muted-foreground">/month</span></div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>✓ Up to 1,000 conversations/month</p>
                <p>✓ Basic customization</p>
                <p>✓ Email support</p>
                <p>✓ Analytics dashboard</p>
                <Button className="w-full mt-6" variant="outline">Choose Starter</Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-accent bg-accent/5 hover:border-accent/50 transition-smooth">
              <CardHeader className="text-center">
                <div className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm mb-2">Most Popular</div>
                <CardTitle className="text-2xl">Professional</CardTitle>
                <div className="text-3xl font-bold mt-4">$79<span className="text-lg text-muted-foreground">/month</span></div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>✓ Up to 5,000 conversations/month</p>
                <p>✓ Full customization</p>
                <p>✓ Priority support</p>
                <p>✓ Advanced analytics</p>
                <p>✓ Lead generation tools</p>
                <Button className="w-full mt-6 bg-gradient-accent">Choose Professional</Button>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-accent/30 transition-smooth">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Enterprise</CardTitle>
                <div className="text-3xl font-bold mt-4">$199<span className="text-lg text-muted-foreground">/month</span></div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>✓ Unlimited conversations</p>
                <p>✓ White-label solution</p>
                <p>✓ 24/7 phone support</p>
                <p>✓ Custom integrations</p>
                <p>✓ Dedicated account manager</p>
                <Button className="w-full mt-6" variant="outline">Choose Enterprise</Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 rounded-3xl p-12">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Transform Your Customer Experience?
          </h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of businesses using our AI chatbot to increase sales and improve customer satisfaction.
          </p>
          <Button 
            onClick={handleGetStarted}
            size="lg" 
            className="bg-gradient-accent hover:shadow-glow transition-smooth"
          >
            Start Free Trial
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;