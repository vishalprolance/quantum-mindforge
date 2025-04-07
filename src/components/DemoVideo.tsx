
import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { PlayCircle, Monitor, BrainCircuit, Network, Upload, Wand, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIntersectionObserver } from '@/lib/animations';

const DemoVideo = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const isInView = useIntersectionObserver(sectionRef, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });
  const isVideoInView = useIntersectionObserver(videoRef, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });
  const [isPlaying, setIsPlaying] = useState(false);
  
  const handlePlayVideo = () => {
    setIsPlaying(true);
    const videoElement = document.getElementById('demo-video') as HTMLVideoElement;
    if (videoElement) {
      videoElement.play();
    }
  };
  
  return (
    <section 
      id="demo" 
      className="py-24 px-6 relative overflow-hidden"
      ref={sectionRef}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-noise opacity-[0.015] pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-400/10 rounded-full filter blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-400/10 rounded-full filter blur-3xl" />
      
      <div className="max-w-7xl mx-auto">
        <div className={cn(
          "text-center mb-12 transition-all duration-700",
          isInView ? "opacity-100" : "opacity-0 translate-y-10"
        )}>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <Monitor size={14} className="mr-1.5" />
            <span>See It In Action</span>
          </div>
          <h2 className="heading-lg mb-4">How Quantum Mindforge Works</h2>
          <p className="body-md max-w-2xl mx-auto">
            Watch how our platform transforms the way you think, connect ideas, and discover new insights using advanced AI.
          </p>
        </div>
        
        <div 
          ref={videoRef}
          className={cn(
            "relative rounded-2xl overflow-hidden glass-panel transition-all duration-700 aspect-video max-w-4xl mx-auto",
            isVideoInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          {!isPlaying ? (
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-6">
              <BrainCircuit size={56} className="text-white mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">Quantum Mindforge Demo</h3>
              <p className="text-white/90 max-w-lg mb-6">
                This demo showcases how to map your thoughts, connect ideas, and use AI to transform your content into visual mind maps.
              </p>
              
              <Button 
                className="bg-white text-primary hover:bg-white/90"
                onClick={handlePlayVideo}
              >
                <PlayCircle size={20} className="mr-2" />
                Watch Demo
              </Button>
              
              <div className="absolute inset-x-0 bottom-6 flex justify-center space-x-8 text-sm text-white/80">
                <div className="flex items-center">
                  <Network size={16} className="mr-1.5" />
                  <span>Mind Mapping</span>
                </div>
                <div className="flex items-center">
                  <Wand size={16} className="mr-1.5" />
                  <span>AI Generation</span>
                </div>
                <div className="flex items-center">
                  <FileText size={16} className="mr-1.5" />
                  <span>Content Processing</span>
                </div>
              </div>
            </div>
          ) : (
            <video 
              id="demo-video"
              className="w-full h-full object-cover"
              controls
              autoPlay
              poster="/lovable-uploads/c6415b59-4fa2-48b5-a3a1-ee99034b4966.png"
            >
              {/* For demo purposes, we'll use a sample video */}
              <source 
                src="https://assets.mixkit.co/videos/preview/mixkit-drawing-abstract-connect-dots-animation-97-large.mp4" 
                type="video/mp4" 
              />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
          <div className={cn(
            "transition-all duration-700 delay-100 glass-panel p-6 rounded-xl border border-gray-200 dark:border-gray-800",
            isVideoInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}>
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4 text-purple-600">
              <Network size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Interactive Mind Mapping</h3>
            <p className="text-sm text-muted-foreground">
              Create connections between ideas with our intuitive drag-and-drop interface. Visualize complex thoughts in a structured, organized way.
            </p>
          </div>
          
          <div className={cn(
            "transition-all duration-700 delay-200 glass-panel p-6 rounded-xl border border-gray-200 dark:border-gray-800",
            isVideoInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}>
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4 text-blue-600">
              <Wand size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2">AI-Powered Generation</h3>
            <p className="text-sm text-muted-foreground">
              Leverage advanced AI models to automatically generate mind maps from your text, documents, or spoken input. Save time and discover new connections.
            </p>
          </div>
          
          <div className={cn(
            "transition-all duration-700 delay-300 glass-panel p-6 rounded-xl border border-gray-200 dark:border-gray-800",
            isVideoInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}>
            <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center mb-4 text-amber-600">
              <Upload size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Multi-Format Input</h3>
            <p className="text-sm text-muted-foreground">
              Import content from various sources like text, PDFs, images, code files, and voice recordings to quickly transform them into visual thought maps.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoVideo;
