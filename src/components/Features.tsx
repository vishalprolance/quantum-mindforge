
import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { Brain, Wand, Network, Hexagon, Activity, MousePointerClick, FileText, Palette } from 'lucide-react';
import { useIntersectionObserver } from '@/lib/animations';

type FeatureProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
};

const FeatureCard = ({ icon, title, description, delay }: FeatureProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useIntersectionObserver(ref, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });
  
  return (
    <div 
      ref={ref}
      className={cn(
        "relative p-6 rounded-xl glass-panel border border-gray-200/40 dark:border-gray-800/40 transition-all duration-700 group",
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Dot decorations */}
      <div className="absolute -left-1 -top-1 w-2 h-2 rounded-full bg-primary/60 blur-[1px]" />
      <div className="absolute -right-1 -bottom-1 w-2 h-2 rounded-full bg-primary/60 blur-[1px]" />
      
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary group-hover:bg-primary/20 transition-colors">
          {icon}
        </div>
        
        <h3 className="text-xl font-semibold font-display mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

const Features = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useIntersectionObserver(sectionRef, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });
  
  const features = [
    {
      icon: <Brain size={24} />,
      title: "Neural Mapping",
      description: "Visualize your thought patterns and discover how your ideas connect to form deeper insights with our advanced neural mapping technology.",
      delay: 0
    },
    {
      icon: <Wand size={24} />,
      title: "AI-Powered Generation",
      description: "Let our advanced AI analyze your content and automatically create structured mind maps, saving you time and revealing new connections.",
      delay: 100
    },
    {
      icon: <Network size={24} />,
      title: "Quantum Connections",
      description: "Discover non-linear relationships between seemingly unrelated ideas and concepts with our intelligent connection algorithms.",
      delay: 200
    },
    {
      icon: <FileText size={24} />,
      title: "Multi-Format Input",
      description: "Import your thoughts from text, documents, code, images, or voice recordings to create comprehensive mind maps from any source material.",
      delay: 300
    },
    {
      icon: <Palette size={24} />,
      title: "Visual Customization",
      description: "Personalize your mind maps with different shapes, colors, and layouts to create visually appealing and intuitive thought diagrams.",
      delay: 400
    },
    {
      icon: <MousePointerClick size={24} />,
      title: "Intuitive Interface",
      description: "An elegant, responsive design that makes complex thought visualization feel natural with our smooth drag-and-drop experience.",
      delay: 500
    }
  ];
  
  return (
    <section 
      id="features" 
      className="py-24 px-6 relative overflow-hidden"
      ref={sectionRef}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-noise opacity-[0.015] pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400/10 rounded-full filter blur-3xl" />
      
      <div className="max-w-7xl mx-auto">
        <div className={cn(
          "text-center mb-16 transition-all duration-700",
          isInView ? "opacity-100" : "opacity-0 translate-y-10"
        )}>
          <h2 className="heading-lg mb-4">Powerful Features</h2>
          <p className="body-md max-w-2xl mx-auto">
            Quantum Mindforge combines advanced cognitive science with AI technology and elegant interface design
            to help you think in new dimensions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={feature.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
