
import { useEffect, useRef } from 'react';

const ComplexMindMap = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    // The map will be drawn by CSS positioning
  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto h-[500px] mt-10 mb-16 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm overflow-hidden">
      <div ref={canvasRef} className="absolute inset-0">
        {/* Center Node */}
        <div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 p-4 rounded-lg shadow-md border-2 border-blue-300 dark:border-blue-700 z-30 w-48 text-center font-medium"
        >
          Quantum Computing
        </div>
        
        {/* Level 1 Nodes */}
        <div 
          className="absolute left-[30%] top-[25%] -translate-x-1/2 -translate-y-1/2 bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 p-3 rounded-lg shadow-md border-2 border-purple-300 dark:border-purple-700 z-20 w-40 text-center"
        >
          Quantum Algorithms
        </div>
        
        <div 
          className="absolute left-[70%] top-[30%] -translate-x-1/2 -translate-y-1/2 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 p-3 rounded-lg shadow-md border-2 border-green-300 dark:border-green-700 z-20 w-40 text-center"
        >
          Quantum Hardware
        </div>
        
        <div 
          className="absolute left-[25%] top-[70%] -translate-x-1/2 -translate-y-1/2 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 p-3 rounded-lg shadow-md border-2 border-amber-300 dark:border-amber-700 z-20 w-40 text-center"
        >
          Quantum Theory
        </div>
        
        <div 
          className="absolute left-[75%] top-[65%] -translate-x-1/2 -translate-y-1/2 bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-200 p-3 rounded-lg shadow-md border-2 border-rose-300 dark:border-rose-700 z-20 w-40 text-center"
        >
          Applications
        </div>
        
        {/* Level 2 Nodes */}
        <div 
          className="absolute left-[15%] top-[15%] -translate-x-1/2 -translate-y-1/2 bg-purple-50 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 p-2 rounded-lg shadow-sm border border-purple-200 dark:border-purple-800 z-10 w-32 text-center text-sm"
        >
          Shor's Algorithm
        </div>
        
        <div 
          className="absolute left-[40%] top-[12%] -translate-x-1/2 -translate-y-1/2 bg-purple-50 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 p-2 rounded-lg shadow-sm border border-purple-200 dark:border-purple-800 z-10 w-32 text-center text-sm"
        >
          Grover's Algorithm
        </div>
        
        <div 
          className="absolute left-[85%] top-[20%] -translate-x-1/2 -translate-y-1/2 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200 p-2 rounded-lg shadow-sm border border-green-200 dark:border-green-800 z-10 w-32 text-center text-sm"
        >
          Superconducting
        </div>
        
        <div 
          className="absolute left-[65%] top-[15%] -translate-x-1/2 -translate-y-1/2 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200 p-2 rounded-lg shadow-sm border border-green-200 dark:border-green-800 z-10 w-32 text-center text-sm"
        >
          Ion Traps
        </div>
        
        <div 
          className="absolute left-[10%] top-[60%] -translate-x-1/2 -translate-y-1/2 bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 p-2 rounded-lg shadow-sm border border-amber-200 dark:border-amber-800 z-10 w-32 text-center text-sm"
        >
          Entanglement
        </div>
        
        <div 
          className="absolute left-[20%] top-[85%] -translate-x-1/2 -translate-y-1/2 bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 p-2 rounded-lg shadow-sm border border-amber-200 dark:border-amber-800 z-10 w-32 text-center text-sm"
        >
          Superposition
        </div>
        
        <div 
          className="absolute left-[70%] top-[80%] -translate-x-1/2 -translate-y-1/2 bg-rose-50 dark:bg-rose-900/30 text-rose-800 dark:text-rose-200 p-2 rounded-lg shadow-sm border border-rose-200 dark:border-rose-800 z-10 w-32 text-center text-sm"
        >
          Cryptography
        </div>
        
        <div 
          className="absolute left-[85%] top-[65%] -translate-x-1/2 -translate-y-1/2 bg-rose-50 dark:bg-rose-900/30 text-rose-800 dark:text-rose-200 p-2 rounded-lg shadow-sm border border-rose-200 dark:border-rose-800 z-10 w-32 text-center text-sm"
        >
          Drug Discovery
        </div>
        
        {/* SVG for connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {/* Central to Level 1 */}
          <line x1="50%" y1="50%" x2="30%" y2="25%" stroke="rgba(139, 92, 246, 0.5)" strokeWidth="2" />
          <line x1="50%" y1="50%" x2="70%" y2="30%" stroke="rgba(34, 197, 94, 0.5)" strokeWidth="2" />
          <line x1="50%" y1="50%" x2="25%" y2="70%" stroke="rgba(251, 191, 36, 0.5)" strokeWidth="2" />
          <line x1="50%" y1="50%" x2="75%" y2="65%" stroke="rgba(244, 63, 94, 0.5)" strokeWidth="2" />
          
          {/* Level 1 to Level 2 */}
          <line x1="30%" y1="25%" x2="15%" y2="15%" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="1.5" />
          <line x1="30%" y1="25%" x2="40%" y2="12%" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="1.5" />
          <line x1="70%" y1="30%" x2="85%" y2="20%" stroke="rgba(34, 197, 94, 0.3)" strokeWidth="1.5" />
          <line x1="70%" y1="30%" x2="65%" y2="15%" stroke="rgba(34, 197, 94, 0.3)" strokeWidth="1.5" />
          <line x1="25%" y1="70%" x2="10%" y2="60%" stroke="rgba(251, 191, 36, 0.3)" strokeWidth="1.5" />
          <line x1="25%" y1="70%" x2="20%" y2="85%" stroke="rgba(251, 191, 36, 0.3)" strokeWidth="1.5" />
          <line x1="75%" y1="65%" x2="70%" y2="80%" stroke="rgba(244, 63, 94, 0.3)" strokeWidth="1.5" />
          <line x1="75%" y1="65%" x2="85%" y2="65%" stroke="rgba(244, 63, 94, 0.3)" strokeWidth="1.5" />
        </svg>
      </div>
    </div>
  );
};

export default ComplexMindMap;
