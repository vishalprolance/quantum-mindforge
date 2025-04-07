
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Canvas from '@/components/Canvas';
import Features from '@/components/Features';
import DemoVideo from '@/components/DemoVideo';
import Footer from '@/components/Footer';
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  
  // Smooth scroll behavior for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (!link) return;
      
      const href = link.getAttribute('href');
      if (!href?.startsWith('#')) return;
      
      const id = href.substring(1);
      const element = document.getElementById(id);
      
      if (element) {
        e.preventDefault();
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    };
    
    document.addEventListener('click', handleAnchorClick);
    
    // Show welcome toast
    toast({
      title: "Welcome to Quantum Mindforge",
      description: "Explore the future of thought visualization and idea mapping",
    });
    
    return () => document.removeEventListener('click', handleAnchorClick);
  }, [toast]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Canvas />
        <Features />
        <DemoVideo />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
