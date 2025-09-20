
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const blogPosts = [
  {
    id: 1,
    title: "5 Essential Digital Marketing Strategies for Canadian Businesses in 2025",
    excerpt: "Discover the latest digital marketing trends and strategies that are driving success for Canadian businesses in the competitive online marketplace.",
    date: "January 15, 2025",
    readTime: "5 min read",
    category: "Digital Marketing",
    image: "📈"
  },
  {
    id: 2,
    title: "SEO Best Practices: How to Rank Higher in Canadian Search Results",
    excerpt: "Learn proven SEO techniques specifically tailored for the Canadian market, including local SEO strategies and content optimization tips.",
    date: "January 10, 2025",
    readTime: "7 min read",
    category: "SEO",
    image: "🔍"
  },
  {
    id: 3,
    title: "The Complete Guide to Lead Generation for Small Businesses",
    excerpt: "Transform your website visitors into qualified leads with our comprehensive guide to lead generation strategies and conversion optimization.",
    date: "January 5, 2025",
    readTime: "6 min read",
    category: "Lead Generation",
    image: "🎯"
  },
  {
    id: 4,
    title: "Social Media Marketing: Building Your Brand on Facebook and Instagram",
    excerpt: "Master social media marketing with actionable tips for creating engaging content, running effective ads, and building a loyal following.",
    date: "December 28, 2024",
    readTime: "8 min read",
    category: "Social Media",
    image: "📱"
  },
  {
    id: 5,
    title: "Analytics and Insights: Making Data-Driven Marketing Decisions",
    excerpt: "Learn how to interpret your marketing data and use analytics to make informed decisions that drive real business growth.",
    date: "December 20, 2024",
    readTime: "4 min read",
    category: "Analytics",
    image: "📊"
  },
  {
    id: 6,
    title: "CRM Integration: Streamlining Your Customer Relationship Management",
    excerpt: "Discover how to integrate CRM systems with your marketing efforts to create seamless customer experiences and improve retention.",
    date: "December 15, 2024",
    readTime: "6 min read",
    category: "CRM",
    image: "🔗"
  }
];

const Blogs = () => {
  return (
    <div className="py-24 bg-background">
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Digital Marketing
            </span>
            <br />
            <span className="text-foreground">Insights & Tips</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Stay ahead of the curve with expert insights, industry trends, and actionable strategies 
            to grow your business online in the Canadian market.
          </p>
        </div>

        {/* Featured Post */}
        <div className="mb-16">
          <Card className="bg-gradient-card border-0 shadow-custom-lg hover:shadow-custom-xl transition-smooth hover-lift">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="p-8 lg:p-12">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-4xl">{blogPosts[0].image}</span>
                  <span className="text-sm font-medium text-accent bg-accent/10 px-3 py-1 rounded-full">
                    {blogPosts[0].category}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                  {blogPosts[0].title}
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {blogPosts[0].excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    <span>{blogPosts[0].date}</span>
                    <span className="mx-2">•</span>
                    <span>{blogPosts[0].readTime}</span>
                  </div>
                  {/* <Button className="bg-gradient-accent hover:shadow-glow transition-smooth">
                    Read More
                  </Button> */}
                </div>
              </div>
              <div className="bg-gradient-primary/10 p-8 lg:p-12 flex items-center justify-center">
                <div className="text-8xl opacity-20">
                  {blogPosts[0].image}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.slice(1).map((post, index) => (
            <Card
              key={post.id}
              className="group hover-lift bg-gradient-card border-0 shadow-custom-md hover:shadow-custom-lg transition-smooth animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{post.image}</span>
                  <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>
                <CardTitle className="text-lg font-bold text-foreground group-hover:text-accent transition-smooth line-clamp-2">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                  {post.excerpt}
                </CardDescription>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    <span>{post.date}</span>
                    <span className="mx-1">•</span>
                    <span>{post.readTime}</span>
                  </div>
                  {/* <Button variant="outline" size="sm" className="text-xs">
                    Read More
                  </Button> */}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16">
          <Card className="bg-gradient-primary text-primary-foreground border-0 shadow-custom-lg">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
              <p className="text-primary-foreground/90 mb-6 max-w-2xl mx-auto">
                Get the latest digital marketing insights, tips, and industry updates delivered 
                directly to your inbox. Join hundreds of Canadian businesses growing online.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <Button className="bg-gradient-accent hover:shadow-glow transition-smooth">
                  Subscribe
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Blogs;