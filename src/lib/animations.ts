
import { useEffect, useState, useRef, RefObject } from 'react';

// Utility for staggered animations on elements
export const useStaggeredAnimation = (
  elements: RefObject<HTMLElement>[],
  options = { 
    threshold: 0.1, 
    delay: 100, 
    rootMargin: '0px 0px -10% 0px',
    animation: 'animate-slide-up'
  }
) => {
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    
    elements.forEach((elementRef, index) => {
      if (!elementRef.current) return;
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add(options.animation);
            }, index * options.delay);
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: options.threshold,
        rootMargin: options.rootMargin
      });
      
      observer.observe(elementRef.current);
      observers.push(observer);
    });
    
    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, [elements, options]);
};

// Utility for particle animations
export const createParticles = (
  canvas: HTMLCanvasElement,
  options = {
    particleCount: 100,
    color: '#3B82F6',
    speed: 0.5,
    size: 2,
    connectionDistance: 150,
    connectionWidth: 1
  }
) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  // Set canvas to full window size
  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // Particle class
  class Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * options.speed;
      this.vy = (Math.random() - 0.5) * options.speed;
      this.size = Math.random() * options.size + 1;
      this.color = options.color;
    }
    
    update() {
      this.x += this.vx;
      this.y += this.vy;
      
      // Bounce on edges
      if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
      if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
    }
    
    draw() {
      if (!ctx) return;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }
  
  // Create particles
  const particles: Particle[] = [];
  for (let i = 0; i < options.particleCount; i++) {
    particles.push(new Particle());
  }
  
  // Animation loop
  const animate = () => {
    requestAnimationFrame(animate);
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw particles
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });
    
    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < options.connectionDistance) {
          if (!ctx) continue;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const opacity = 1 - (distance / options.connectionDistance);
          ctx.strokeStyle = `rgba(59, 130, 246, ${opacity * 0.3})`;
          ctx.lineWidth = options.connectionWidth;
          ctx.stroke();
        }
      }
    }
  };
  
  animate();
  
  // Cleanup function
  return () => {
    window.removeEventListener('resize', resizeCanvas);
  };
};

// Hook for intersection observer based animations
export const useIntersectionObserver = (
  ref: RefObject<HTMLElement>,
  options = { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
): boolean => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);
    
    const element = ref.current;
    if (element) {
      observer.observe(element);
    }
    
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [ref, options]);
  
  return isIntersecting;
};

// Parallax effect hook
export const useParallax = (ref: RefObject<HTMLElement>, speed = 0.1) => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const yPos = -(scrollY * speed);
      element.style.transform = `translate3d(0, ${yPos}px, 0)`;
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [ref, speed]);
};
