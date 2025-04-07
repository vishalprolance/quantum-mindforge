
import { useEffect, useRef } from 'react';
import { createParticles } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Brain, Zap } from 'lucide-react';
import ComplexMindMap from './ComplexMindMap';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Hero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const cleanup = createParticles(canvasRef.current, {
      particleCount: 80,
      color: '#3B82F6',
      speed: 0.2,
      size: 1.5,
      connectionDistance: 150,
      connectionWidth: 0.8
    });
    
    return cleanup;
  }, []);
  
  const handleStartJourney = () => {
    const isLoggedIn = localStorage.getItem('user') !== null;
    
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/signin');
      toast({
        title: "Sign in required",
        description: "Please sign in to start your journey"
      });
    }
  };
  
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <canvas
          ref={canvasRef}
          className="w-full h-full opacity-70"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px]" />
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full filter blur-3xl animate-float opacity-70" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-400/10 rounded-full filter blur-3xl animate-float opacity-50" style={{ animationDelay: '-3s' }} />
      
      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-8 animate-fade-in pt-24 md:pt-32">
        {/* Pill badge */}
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4 animate-scale-in">
          <Sparkles size={14} className="mr-1.5" />
          <span>Introducing Quantum Mindforge</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
          <span className="text-foreground">Expand Your Mind With</span>
          <br />
          <span className="text-primary">Quantum Thinking</span>
        </h1>
        
        <p className="text-lg md:text-xl max-w-2xl mx-auto mt-6 text-muted-foreground animate-slide-up" style={{ animationDelay: '200ms' }}>
          Explore the frontiers of your cognitive potential with our revolutionary thought visualization platform. Quantum Mindforge helps you visualize complex ideas, discover new connections, and elevate your thinking to new dimensions.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-slide-up" style={{ animationDelay: '400ms' }}>
          <Button 
            className="h-12 px-6 text-base font-medium bg-primary hover:bg-primary/90 text-white transition-all duration-300 group"
            onClick={handleStartJourney}
          >
            Start Your Journey
            <ArrowRight size={18} className="ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button 
            variant="outline" 
            className="h-12 px-6 text-base font-medium border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
            onClick={() => {
              const demoSection = document.getElementById('demo');
              if (demoSection) {
                const navbarHeight = 80;
                const elementPosition = demoSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                  top: offsetPosition,
                  behavior: 'smooth',
                });
              }
            }}
          >
            Watch Demo
          </Button>
        </div>
        
        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-12 animate-slide-up" style={{ animationDelay: '600ms' }}>
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 text-sm font-medium text-foreground">
            <Brain size={16} className="mr-2 text-blue-500" />
            Neural Mapping
          </span>
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 text-sm font-medium text-foreground">
            <Zap size={16} className="mr-2 text-amber-500" />
            Thought Acceleration
          </span>
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 text-sm font-medium text-foreground">
            <svg width="16" height="16" viewBox="0 0 24 24" className="mr-2 text-purple-500" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 8c-1.45 0-2.26 1.44-1.93 2.51l-3.55 3.56c-.3-.09-.74-.09-1.04 0l-2.55-2.55C12.27 10.45 11.46 9 10 9c-1.45 0-2.27 1.44-1.93 2.52l-4.56 4.55C2.44 15.74 1 16.55 1 18c0 1.1.9 2 2 2 1.45 0 2.26-1.44 1.93-2.51l4.55-4.56c.3.09.74.09 1.04 0l2.55 2.55C12.73 16.55 13.54 18 15 18c1.45 0 2.27-1.44 1.93-2.52l3.56-3.55c1.07.33 2.51-.48 2.51-1.93 0-1.1-.9-2-2-2z" fill="currentColor" />
            </svg>
            Quantum Connections
          </span>
        </div>
        
        {/* Complex Mind Map Example */}
        <div className="mt-16 pb-12">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">Visualize Your Quantum Thoughts</h2>
          <p className="text-base text-muted-foreground max-w-3xl mx-auto mb-8">
            Explore the interconnections between ideas in this interactive canvas. Drag to navigate, zoom to focus, and witness how thoughts connect in unexpected ways.
          </p>
          <ComplexMindMap />
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-pulse-soft">
        <span className="text-sm text-muted-foreground mb-2">Scroll to explore</span>
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center items-start p-1">
          <div className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-[bounce_1.5s_infinite]"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
