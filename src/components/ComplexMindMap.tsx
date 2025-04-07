
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

const ComplexMindMap = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    // The map is drawn using CSS positioning
  }, []);

  return (
    <div className="relative w-full max-w-5xl mx-auto h-[600px] mt-10 mb-16 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm overflow-hidden">
      <div ref={canvasRef} className="absolute inset-0">
        {/* Main node */}
        <div 
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-[60%] bg-gray-700/90 dark:bg-gray-700/90 text-white p-4 rounded-lg shadow-lg border border-gray-600 z-30 w-64 text-center font-medium"
        >
          <span className="text-lg">GenAI Developer Roadmap 2025</span>
        </div>
        
        {/* Phase nodes */}
        <div 
          className="absolute left-[50%] top-[25%] transform -translate-x-1/2 -translate-y-1/2 bg-gray-600/90 dark:bg-gray-600/90 text-white p-3 rounded-lg shadow-md border border-gray-500 z-20 w-[300px] text-center"
        >
          <span>Preface: Understanding GenAI vs ML</span>
        </div>
        
        <div 
          className="absolute left-[50%] top-[32%] transform -translate-x-1/2 -translate-y-1/2 bg-gray-600/90 dark:bg-gray-600/90 text-white p-3 rounded-lg shadow-md border border-gray-500 z-20 w-[300px] text-center"
        >
          <span>Phase 0: Foundations of GenAI</span>
        </div>
        
        <div 
          className="absolute left-[50%] top-[39%] transform -translate-x-1/2 -translate-y-1/2 bg-gray-600/90 dark:bg-gray-600/90 text-white p-3 rounded-lg shadow-md border border-gray-500 z-20 w-[300px] text-center"
        >
          <span>Phase 1: Prompt Engineering & Token Management</span>
        </div>
        
        <div 
          className="absolute left-[50%] top-[46%] transform -translate-x-1/2 -translate-y-1/2 bg-gray-600/90 dark:bg-gray-600/90 text-white p-3 rounded-lg shadow-md border border-gray-500 z-20 w-[300px] text-center"
        >
          <span>Phase 2: LangChain Essentials</span>
        </div>
        
        <div 
          className="absolute left-[50%] top-[53%] transform -translate-x-1/2 -translate-y-1/2 bg-gray-600/90 dark:bg-gray-600/90 text-white p-3 rounded-lg shadow-md border border-gray-500 z-20 w-[300px] text-center"
        >
          <span>Phase 3: RAG (Retrieval-Augmented Generation)</span>
        </div>
        
        <div 
          className="absolute left-[50%] top-[60%] transform -translate-x-1/2 -translate-y-1/2 bg-gray-600/90 dark:bg-gray-600/90 text-white p-3 rounded-lg shadow-md border border-gray-500 z-20 w-[300px] text-center"
        >
          <span>Phase 4: Agents & Tools</span>
        </div>
        
        <div 
          className="absolute left-[50%] top-[67%] transform -translate-x-1/2 -translate-y-1/2 bg-gray-600/90 dark:bg-gray-600/90 text-white p-3 rounded-lg shadow-md border border-gray-500 z-20 w-[300px] text-center"
        >
          <span>Phase 5: LangGraph & Multi-Agent Systems</span>
        </div>
        
        <div 
          className="absolute left-[50%] top-[74%] transform -translate-x-1/2 -translate-y-1/2 bg-gray-600/90 dark:bg-gray-600/90 text-white p-3 rounded-lg shadow-md border border-gray-500 z-20 w-[300px] text-center"
        >
          <span>Phase 6: API Deployment + Web App Integration</span>
        </div>
        
        <div 
          className="absolute left-[50%] top-[81%] transform -translate-x-1/2 -translate-y-1/2 bg-gray-600/90 dark:bg-gray-600/90 text-white p-3 rounded-lg shadow-md border border-gray-500 z-20 w-[300px] text-center"
        >
          <span>Phase 7: Deployment & Production-Ready AI</span>
        </div>
        
        <div 
          className="absolute left-[50%] top-[88%] transform -translate-x-1/2 -translate-y-1/2 bg-gray-600/90 dark:bg-gray-600/90 text-white p-3 rounded-lg shadow-md border border-gray-500 z-20 w-[300px] text-center"
        >
          <span>Bonus Modules (Optional Advanced Topics)</span>
        </div>
        
        {/* Details for Phase 1 */}
        <div 
          className="absolute left-[82%] top-[39%] transform -translate-x-1/2 -translate-y-1/2 bg-gray-500/90 dark:bg-gray-500/90 text-white p-2 rounded-md shadow-sm border border-gray-400 z-10 w-[200px] text-center text-sm"
        >
          <span>1. Prompt Engineering Deep Dive</span>
        </div>
        
        <div 
          className="absolute left-[82%] top-[42%] transform -translate-x-1/2 -translate-y-1/2 bg-gray-500/90 dark:bg-gray-500/90 text-white p-2 rounded-md shadow-sm border border-gray-400 z-10 w-[200px] text-center text-sm"
        >
          <span>2. Project 2: Smart Email Generator</span>
        </div>
        
        <div 
          className="absolute left-[82%] top-[45%] transform -translate-x-1/2 -translate-y-1/2 bg-gray-500/90 dark:bg-gray-500/90 text-white p-2 rounded-md shadow-sm border border-gray-400 z-10 w-[200px] text-center text-sm"
        >
          <span>3. Token Management</span>
        </div>
        
        {/* Details for Phase 0 */}
        <div 
          className="absolute left-[82%] top-[32%] transform -translate-x-1/2 -translate-y-1/2 bg-gray-500/90 dark:bg-gray-500/90 text-white p-2 rounded-md shadow-sm border border-gray-400 z-10 w-[200px] text-center text-sm"
        >
          <span>1. Intro to GenAI & LLMs</span>
        </div>
        
        <div 
          className="absolute left-[82%] top-[35%] transform -translate-x-1/2 -translate-y-1/2 bg-gray-500/90 dark:bg-gray-500/90 text-white p-2 rounded-md shadow-sm border border-gray-400 z-10 w-[200px] text-center text-sm"
        >
          <span>2. Project 1: First ChatBot (OpenAI API)</span>
        </div>
        
        {/* SVG for connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {/* Central node to Phase nodes */}
          <path d="M 50% 40% Q 50% 35%, 50% 25%" stroke="rgba(209, 213, 219, 0.6)" strokeWidth="2" fill="none" />
          <path d="M 50% 40% Q 50% 35%, 50% 32%" stroke="rgba(209, 213, 219, 0.6)" strokeWidth="2" fill="none" />
          <path d="M 50% 40% Q 50% 35%, 50% 39%" stroke="rgba(209, 213, 219, 0.6)" strokeWidth="2" fill="none" />
          <path d="M 50% 40% Q 50% 45%, 50% 46%" stroke="rgba(209, 213, 219, 0.6)" strokeWidth="2" fill="none" />
          <path d="M 50% 40% Q 50% 45%, 50% 53%" stroke="rgba(209, 213, 219, 0.6)" strokeWidth="2" fill="none" />
          <path d="M 50% 40% Q 50% 45%, 50% 60%" stroke="rgba(209, 213, 219, 0.6)" strokeWidth="2" fill="none" />
          <path d="M 50% 40% Q 50% 45%, 50% 67%" stroke="rgba(209, 213, 219, 0.6)" strokeWidth="2" fill="none" />
          <path d="M 50% 40% Q 50% 45%, 50% 74%" stroke="rgba(209, 213, 219, 0.6)" strokeWidth="2" fill="none" />
          <path d="M 50% 40% Q 50% 45%, 50% 81%" stroke="rgba(209, 213, 219, 0.6)" strokeWidth="2" fill="none" />
          <path d="M 50% 40% Q 50% 45%, 50% 88%" stroke="rgba(209, 213, 219, 0.6)" strokeWidth="2" fill="none" />
          
          {/* Phase 0 to its details */}
          <path d="M 60% 32% Q 70% 32%, 72% 32%" stroke="rgba(209, 213, 219, 0.5)" strokeWidth="1.5" fill="none" />
          <path d="M 60% 32% Q 70% 32%, 72% 35%" stroke="rgba(209, 213, 219, 0.5)" strokeWidth="1.5" fill="none" />
          
          {/* Phase 1 to its details */}
          <path d="M 60% 39% Q 70% 39%, 72% 39%" stroke="rgba(209, 213, 219, 0.5)" strokeWidth="1.5" fill="none" />
          <path d="M 60% 39% Q 70% 39%, 72% 42%" stroke="rgba(209, 213, 219, 0.5)" strokeWidth="1.5" fill="none" />
          <path d="M 60% 39% Q 70% 39%, 72% 45%" stroke="rgba(209, 213, 219, 0.5)" strokeWidth="1.5" fill="none" />
        </svg>
        
        {/* Optional: Add interaction instructions */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-gray-500 dark:text-gray-400 text-sm text-center">
          <p>This mind map visualizes the GenAI Developer Roadmap for 2025</p>
        </div>
      </div>
    </div>
  );
};

export default ComplexMindMap;
