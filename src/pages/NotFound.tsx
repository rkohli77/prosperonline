import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-hero">
      <div className="text-center animate-fade-in-up max-w-md mx-auto px-6">
        <div className="w-24 h-24 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
          <span className="text-4xl">🔍</span>
        </div>
        <h1 className="mb-4 text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">404</h1>
        <h2 className="mb-4 text-2xl font-semibold text-foreground">Page Not Found</h2>
        <p className="mb-8 text-muted-foreground">
          Oops! The page you're looking for doesn't exist. Let's get you back on track.
        </p>
        <Button 
          onClick={() => window.location.href = '/'}
          className="bg-gradient-accent hover:shadow-glow transition-smooth hover-lift"
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
