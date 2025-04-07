
import { useRef, useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { Plus, Trash2, Link2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ThoughtNode = {
  id: string;
  content: string;
  x: number;
  y: number;
  color: string;
};

type Connection = {
  id: string;
  sourceId: string;
  targetId: string;
};

const colors = [
  'bg-blue-100 border-blue-300',
  'bg-green-100 border-green-300',
  'bg-purple-100 border-purple-300',
  'bg-amber-100 border-amber-300',
  'bg-rose-100 border-rose-300',
  'bg-cyan-100 border-cyan-300',
];

const ThoughtCanvas = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<ThoughtNode[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [connectingMode, setConnectingMode] = useState(false);
  const [connectSource, setConnectSource] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const editInputRef = useRef<HTMLTextAreaElement>(null);
  
  // Initialize with sample data
  useEffect(() => {
    const initialNodes = [
      { id: '1', content: 'Central Idea', x: 50, y: 50, color: colors[0] },
      { id: '2', content: 'Related Concept', x: 30, y: 20, color: colors[1] },
      { id: '3', content: 'Another Thought', x: 70, y: 30, color: colors[2] },
    ];
    
    const initialConnections = [
      { id: 'c1', sourceId: '1', targetId: '2' },
      { id: 'c2', sourceId: '1', targetId: '3' },
    ];
    
    setNodes(initialNodes);
    setConnections(initialConnections);
  }, []);
  
  // Save to localStorage when nodes or connections change
  useEffect(() => {
    localStorage.setItem('thoughtNodes', JSON.stringify(nodes));
    localStorage.setItem('connections', JSON.stringify(connections));
  }, [nodes, connections]);
  
  const handleDragStart = (nodeId: string) => (e: React.DragEvent) => {
    e.dataTransfer.setData('nodeId', nodeId);
    setSelectedNodeId(nodeId);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    const nodeId = e.dataTransfer.getData('nodeId');
    if (!nodeId || !canvasRef.current) return;
    
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - canvasRect.left) / canvasRect.width) * 100;
    const y = ((e.clientY - canvasRect.top) / canvasRect.height) * 100;
    
    setNodes(prev =>
      prev.map(node => 
        node.id === nodeId ? { ...node, x, y } : node
      )
    );
  };
  
  const handleNodeClick = (nodeId: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (connectingMode) {
      if (connectSource) {
        if (connectSource === nodeId) {
          toast({
            title: "Cannot connect to self",
            description: "A node cannot connect to itself",
            variant: "destructive"
          });
          return;
        }
        
        // Check if connection already exists
        const connectionExists = connections.some(
          conn => (conn.sourceId === connectSource && conn.targetId === nodeId) ||
                 (conn.sourceId === nodeId && conn.targetId === connectSource)
        );
        
        if (connectionExists) {
          toast({
            title: "Connection exists",
            description: "These nodes are already connected",
            variant: "destructive"
          });
          return;
        }
        
        // Create new connection
        const newConnection = {
          id: `c${Date.now()}`,
          sourceId: connectSource,
          targetId: nodeId
        };
        
        setConnections(prev => [...prev, newConnection]);
        setConnectSource(null);
        setConnectingMode(false);
        
        toast({
          title: "Connection created",
          description: "Nodes are now connected"
        });
      } else {
        setConnectSource(nodeId);
        toast({
          title: "Select target node",
          description: "Now click on another node to connect"
        });
      }
    } else {
      setSelectedNodeId(prevId => prevId === nodeId ? null : nodeId);
    }
  };
  
  const handleNodeDoubleClick = (nodeId: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(nodeId);
    
    // Focus the textarea after a short delay to allow React to render it
    setTimeout(() => {
      if (editInputRef.current) {
        editInputRef.current.focus();
        editInputRef.current.select();
      }
    }, 10);
  };
  
  const addNewNode = () => {
    // Find average position or default to center
    const avgX = nodes.length ? nodes.reduce((sum, node) => sum + node.x, 0) / nodes.length : 50;
    const avgY = nodes.length ? nodes.reduce((sum, node) => sum + node.y, 0) / nodes.length : 50;
    
    // Add slight offset
    const x = avgX + (Math.random() * 10 - 5);
    const y = avgY + (Math.random() * 10 - 5);
    
    const newNode = {
      id: `node-${Date.now()}`,
      content: 'New Thought',
      x: Math.min(Math.max(x, 5), 95), // Keep within bounds
      y: Math.min(Math.max(y, 5), 95), // Keep within bounds
      color: colors[Math.floor(Math.random() * colors.length)]
    };
    
    setNodes(prev => [...prev, newNode]);
    setSelectedNodeId(newNode.id);
    setIsEditing(newNode.id);
    
    toast({
      title: "New thought added",
      description: "Double-click to edit content"
    });
  };
  
  const deleteSelectedNode = () => {
    if (!selectedNodeId) return;
    
    setNodes(prev => prev.filter(node => node.id !== selectedNodeId));
    
    // Also delete any connections to this node
    setConnections(prev => 
      prev.filter(conn => 
        conn.sourceId !== selectedNodeId && conn.targetId !== selectedNodeId
      )
    );
    
    setSelectedNodeId(null);
    
    toast({
      title: "Thought deleted",
      description: "The thought and its connections have been removed"
    });
  };
  
  const cancelConnecting = () => {
    setConnectingMode(false);
    setConnectSource(null);
  };
  
  const handleCanvasClick = () => {
    setSelectedNodeId(null);
    
    if (isEditing) {
      setIsEditing(null);
    }
    
    if (connectingMode && connectSource) {
      cancelConnecting();
    }
  };
  
  const handleEditChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isEditing) return;
    
    setNodes(prev =>
      prev.map(node =>
        node.id === isEditing
          ? { ...node, content: e.target.value }
          : node
      )
    );
  };
  
  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      setIsEditing(null);
    }
  };
  
  const handleEditBlur = () => {
    setIsEditing(null);
  };
  
  // Draw connections between nodes as SVG lines
  const drawConnections = () => {
    return connections.map(conn => {
      const source = nodes.find(node => node.id === conn.sourceId);
      const target = nodes.find(node => node.id === conn.targetId);
      
      if (!source || !target || !canvasRef.current) return null;
      
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const sourceX = (source.x / 100) * canvasRect.width;
      const sourceY = (source.y / 100) * canvasRect.height;
      const targetX = (target.x / 100) * canvasRect.width;
      const targetY = (target.y / 100) * canvasRect.height;
      
      return (
        <line
          key={conn.id}
          x1={sourceX}
          y1={sourceY}
          x2={targetX}
          y2={targetY}
          stroke="rgba(139, 92, 246, 0.5)"
          strokeWidth={2}
          strokeDasharray={connectingMode ? "5,5" : "none"}
        />
      );
    });
  };
  
  return (
    <div className="relative h-full">
      <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
        <Button 
          size="sm" 
          variant="outline" 
          className="h-9 w-9 p-0 rounded-full bg-white" 
          onClick={addNewNode}
        >
          <Plus size={16} />
        </Button>
        {selectedNodeId && (
          <>
            <Button 
              size="sm" 
              variant="outline"
              className="h-9 w-9 p-0 rounded-full bg-white"
              onClick={() => {
                setConnectingMode(!connectingMode);
                if (!connectingMode) {
                  setConnectSource(selectedNodeId);
                  toast({
                    title: "Connection mode active",
                    description: "Click on another node to create a connection"
                  });
                } else {
                  setConnectSource(null);
                }
              }}
            >
              <Link2 size={16} className={connectingMode ? "text-primary" : ""} />
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              className="h-9 w-9 p-0 rounded-full bg-white text-destructive hover:text-destructive"
              onClick={deleteSelectedNode}
            >
              <Trash2 size={16} />
            </Button>
          </>
        )}
      </div>
      
      {connectingMode && (
        <div className="absolute top-4 right-4 z-10">
          <Button variant="outline" size="sm" onClick={cancelConnecting}>
            Cancel Connecting
          </Button>
        </div>
      )}
      
      <div 
        ref={canvasRef}
        className="w-full h-full relative bg-gray-50 dark:bg-gray-900/50 overflow-hidden"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleCanvasClick}
      >
        <svg 
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
        >
          {drawConnections()}
        </svg>
        
        {nodes.map(node => (
          <div
            key={node.id}
            className={cn(
              "absolute p-3 rounded-lg shadow-sm border-2 cursor-grab active:cursor-grabbing transition-all",
              node.color,
              node.id === selectedNodeId && "ring-2 ring-primary border-primary",
              connectingMode && connectSource === node.id && "border-primary ring-2 ring-primary",
              connectingMode && connectSource && connectSource !== node.id && "hover:border-primary"
            )}
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              transform: 'translate(-50%, -50%)',
              maxWidth: '250px',
              minWidth: '120px',
              zIndex: node.id === selectedNodeId ? 10 : 1
            }}
            onClick={handleNodeClick(node.id)}
            onDoubleClick={handleNodeDoubleClick(node.id)}
            draggable
            onDragStart={handleDragStart(node.id)}
          >
            {isEditing === node.id ? (
              <textarea
                ref={editInputRef}
                className="w-full bg-transparent resize-none focus:outline-none text-sm"
                value={node.content}
                onChange={handleEditChange}
                onKeyDown={handleEditKeyDown}
                onBlur={handleEditBlur}
              />
            ) : (
              <div className="text-sm">{node.content}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThoughtCanvas;
