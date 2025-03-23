
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Plus, Minus, RotateCw, Download, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIntersectionObserver } from '@/lib/animations';

type Node = {
  id: string;
  x: number;
  y: number;
  radius: number;
  text: string;
  color: string;
  connections: string[];
};

const Canvas = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [nodes, setNodes] = useState<Node[]>([]);
  const isInView = useIntersectionObserver(containerRef, { threshold: 0.1 });
  const [isVisible, setIsVisible] = useState(false);
  
  // Sample nodes
  const sampleNodes: Node[] = [
    { id: '1', x: 0, y: 0, radius: 60, text: 'Quantum\nThinking', color: '#3B82F6', connections: ['2', '3', '5'] },
    { id: '2', x: -180, y: -150, radius: 50, text: 'Neural\nPatterns', color: '#8B5CF6', connections: ['1', '4'] },
    { id: '3', x: 200, y: -100, radius: 45, text: 'Creative\nExpansion', color: '#EC4899', connections: ['1', '6'] },
    { id: '4', x: -250, y: 50, radius: 40, text: 'Memory\nEnhancement', color: '#10B981', connections: ['2'] },
    { id: '5', x: -50, y: 200, radius: 55, text: 'Cognitive\nFlexibility', color: '#F59E0B', connections: ['1', '6'] },
    { id: '6', x: 220, y: 170, radius: 45, text: 'Intuitive\nLeaps', color: '#6366F1', connections: ['3', '5'] },
  ];
  
  // Initialize canvas with nodes when in view
  useEffect(() => {
    if (isInView && !isVisible) {
      setIsVisible(true);
      
      // Animate nodes appearing
      const timer = setTimeout(() => {
        setNodes(sampleNodes);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isInView, isVisible]);
  
  // Draw canvas
  useEffect(() => {
    if (!canvasRef.current || nodes.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const updateCanvasSize = () => {
      if (!containerRef.current) return;
      canvas.width = containerRef.current.clientWidth;
      canvas.height = containerRef.current.clientHeight;
    };
    
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate center of canvas
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Draw connections
    ctx.save();
    ctx.translate(centerX + offset.x, centerY + offset.y);
    ctx.scale(zoom, zoom);
    
    nodes.forEach(node => {
      node.connections.forEach(connectionId => {
        const connectedNode = nodes.find(n => n.id === connectionId);
        if (connectedNode) {
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(connectedNode.x, connectedNode.y);
          
          // Create gradient for connection
          const gradient = ctx.createLinearGradient(
            node.x, node.y, connectedNode.x, connectedNode.y
          );
          gradient.addColorStop(0, `${node.color}80`); // Semi-transparent
          gradient.addColorStop(1, `${connectedNode.color}80`);
          
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });
    });
    
    // Draw nodes
    nodes.forEach(node => {
      // Node background
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${node.color}20`; // Very light
      ctx.fill();
      
      // Node border
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.strokeStyle = node.color;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Node text
      ctx.fillStyle = '#333';
      ctx.font = '14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Handle multi-line text
      const lines = node.text.split('\n');
      lines.forEach((line, i) => {
        const lineOffset = (i - (lines.length - 1) / 2) * 20;
        ctx.fillText(line, node.x, node.y + lineOffset);
      });
    });
    
    ctx.restore();
    
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [nodes, zoom, offset]);
  
  // Handle mouse interactions
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    
    setOffset({
      x: offset.x + dx,
      y: offset.y + dy,
    });
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 0.1, 2));
  };
  
  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 0.1, 0.5));
  };
  
  const handleReset = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };
  
  return (
    <section 
      id="canvas-section" 
      className="relative py-20 px-6"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <Sparkles size={14} className="mr-1.5" />
            <span>Interactive Mindscape</span>
          </div>
          <h2 className="heading-lg text-foreground mb-4">
            Visualize Your Quantum Thoughts
          </h2>
          <p className="body-md max-w-2xl mx-auto">
            Explore the interconnections between ideas in this interactive canvas. 
            Drag to navigate, zoom to focus, and witness how thoughts connect in unexpected ways.
          </p>
        </div>
        
        <div 
          className={cn(
            "relative h-[600px] rounded-2xl overflow-hidden glass-panel transition-all duration-500",
            isVisible ? "opacity-100" : "opacity-0 translate-y-10"
          )}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
          
          {/* Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button
              size="icon"
              variant="outline"
              className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm h-9 w-9"
              onClick={handleZoomIn}
              aria-label="Zoom in"
            >
              <Plus size={16} />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm h-9 w-9"
              onClick={handleZoomOut}
              aria-label="Zoom out"
            >
              <Minus size={16} />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm h-9 w-9"
              onClick={handleReset}
              aria-label="Reset view"
            >
              <RotateCw size={16} />
            </Button>
          </div>
          
          {/* Action buttons */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            <Button
              variant="outline"
              className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
              aria-label="Download mindscape"
            >
              <Download size={16} className="mr-2" />
              Save
            </Button>
            <Button
              className="bg-primary text-white hover:bg-primary/90"
              aria-label="Share mindscape"
            >
              <Share2 size={16} className="mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Canvas;
