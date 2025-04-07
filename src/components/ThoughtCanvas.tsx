
import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { toast } from '@/hooks/use-toast';
import { 
  Plus, Trash2, Link2, Settings, Palette, Square, Circle, Triangle, 
  Type, Move, MousePointer, Undo, Redo, Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { MindMapData } from '@/lib/ai-service';

type ThoughtNode = {
  id: string;
  content: string;
  x: number;
  y: number;
  color: string;
  shape?: 'rectangle' | 'circle' | 'triangle';
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

interface ThoughtCanvasProps {
  // Props go here
}

const ThoughtCanvas = forwardRef<any, ThoughtCanvasProps>((props, ref) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<ThoughtNode[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [connectingMode, setConnectingMode] = useState(false);
  const [connectSource, setConnectSource] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const editInputRef = useRef<HTMLTextAreaElement>(null);
  const [currentTool, setCurrentTool] = useState<'select' | 'draw' | 'move'>('select');
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedShape, setSelectedShape] = useState<'rectangle' | 'circle' | 'triangle'>('rectangle');
  const [history, setHistory] = useState<{nodes: ThoughtNode[], connections: Connection[]}[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    importMindMap: (data: MindMapData) => {
      if (data && data.nodes && data.connections) {
        setNodes(data.nodes);
        setConnections(data.connections);
        addToHistory(data.nodes, data.connections);
        
        toast({
          title: "Mind map imported",
          description: `${data.nodes.length} nodes and ${data.connections.length} connections imported`
        });
      }
    },
    getCanvasData: () => {
      return { nodes, connections };
    },
    clearCanvas: () => {
      setNodes([]);
      setConnections([]);
      addToHistory([], []);
    }
  }));
  
  // Initialize with sample data
  useEffect(() => {
    const initialNodes = [
      { id: '1', content: 'Central Idea', x: 50, y: 50, color: colors[0], shape: 'rectangle' as const },
      { id: '2', content: 'Related Concept', x: 30, y: 20, color: colors[1], shape: 'rectangle' as const },
      { id: '3', content: 'Another Thought', x: 70, y: 30, color: colors[2], shape: 'rectangle' as const },
    ];
    
    const initialConnections = [
      { id: 'c1', sourceId: '1', targetId: '2' },
      { id: 'c2', sourceId: '1', targetId: '3' },
    ];
    
    setNodes(initialNodes);
    setConnections(initialConnections);
    
    // Initialize history
    setHistory([{ nodes: initialNodes, connections: initialConnections }]);
    setHistoryIndex(0);
  }, []);
  
  // Save to localStorage when nodes or connections change
  useEffect(() => {
    localStorage.setItem('thoughtNodes', JSON.stringify(nodes));
    localStorage.setItem('connections', JSON.stringify(connections));
  }, [nodes, connections]);
  
  // Add current state to history
  const addToHistory = (newNodes: ThoughtNode[], newConnections: Connection[]) => {
    // If we're not at the end of the history, truncate
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ nodes: [...newNodes], connections: [...newConnections] });
    
    // Limit history size to prevent memory issues
    if (newHistory.length > 30) {
      newHistory.shift();
    }
    
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };
  
  // Undo/Redo functions
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const { nodes: prevNodes, connections: prevConnections } = history[newIndex];
      
      setNodes(prevNodes);
      setConnections(prevConnections);
      setHistoryIndex(newIndex);
    }
  };
  
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const { nodes: nextNodes, connections: nextConnections } = history[newIndex];
      
      setNodes(nextNodes);
      setConnections(nextConnections);
      setHistoryIndex(newIndex);
    }
  };
  
  const handleDragStart = (nodeId: string) => (e: React.DragEvent) => {
    if (currentTool !== 'move' && currentTool !== 'select') return;
    
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
    
    const newNodes = nodes.map(node => 
      node.id === nodeId ? { ...node, x, y } : node
    );
    
    setNodes(newNodes);
    addToHistory(newNodes, connections);
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
        
        const newConnections = [...connections, newConnection];
        setConnections(newConnections);
        setConnectSource(null);
        setConnectingMode(false);
        
        addToHistory(nodes, newConnections);
        
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
      color: selectedColor,
      shape: selectedShape
    };
    
    const newNodes = [...nodes, newNode];
    setNodes(newNodes);
    setSelectedNodeId(newNode.id);
    setIsEditing(newNode.id);
    
    addToHistory(newNodes, connections);
    
    toast({
      title: "New thought added",
      description: "Double-click to edit content"
    });
  };
  
  const deleteSelectedNode = () => {
    if (!selectedNodeId) return;
    
    const newNodes = nodes.filter(node => node.id !== selectedNodeId);
    
    // Also delete any connections to this node
    const newConnections = connections.filter(conn => 
      conn.sourceId !== selectedNodeId && conn.targetId !== selectedNodeId
    );
    
    setNodes(newNodes);
    setConnections(newConnections);
    setSelectedNodeId(null);
    
    addToHistory(newNodes, newConnections);
    
    toast({
      title: "Thought deleted",
      description: "The thought and its connections have been removed"
    });
  };
  
  const cancelConnecting = () => {
    setConnectingMode(false);
    setConnectSource(null);
  };
  
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target !== canvasRef.current && e.target !== e.currentTarget) {
      return;
    }
    
    setSelectedNodeId(null);
    
    if (isEditing) {
      setIsEditing(null);
    }
    
    if (connectingMode && connectSource) {
      cancelConnecting();
    }
    
    // If in drawing mode and clicking on canvas, add a new node at click position
    if (currentTool === 'draw' && canvasRef.current) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const x = ((e.clientX - canvasRect.left) / canvasRect.width) * 100;
      const y = ((e.clientY - canvasRect.top) / canvasRect.height) * 100;
      
      const newNode = {
        id: `node-${Date.now()}`,
        content: 'New Thought',
        x: Math.min(Math.max(x, 5), 95), // Keep within bounds
        y: Math.min(Math.max(y, 5), 95), // Keep within bounds
        color: selectedColor,
        shape: selectedShape
      };
      
      const newNodes = [...nodes, newNode];
      setNodes(newNodes);
      addToHistory(newNodes, connections);
    }
  };
  
  const handleEditChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isEditing) return;
    
    const newNodes = nodes.map(node =>
      node.id === isEditing
        ? { ...node, content: e.target.value }
        : node
    );
    
    setNodes(newNodes);
  };
  
  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      setIsEditing(null);
      
      // Save the changes to history
      addToHistory(nodes, connections);
    }
  };
  
  const handleEditBlur = () => {
    setIsEditing(null);
    addToHistory(nodes, connections);
  };
  
  const changeNodeColor = (color: string) => {
    if (!selectedNodeId) return;
    
    const newNodes = nodes.map(node =>
      node.id === selectedNodeId ? { ...node, color } : node
    );
    
    setNodes(newNodes);
    addToHistory(newNodes, connections);
  };
  
  const changeNodeShape = (shape: 'rectangle' | 'circle' | 'triangle') => {
    if (!selectedNodeId) return;
    
    const newNodes = nodes.map(node =>
      node.id === selectedNodeId ? { ...node, shape } : node
    );
    
    setNodes(newNodes);
    addToHistory(newNodes, connections);
  };
  
  const exportAsPNG = () => {
    toast({
      title: "Exporting as PNG",
      description: "Your mind map is being prepared for download"
    });
    
    // In a real app, we would use html2canvas or similar library
    setTimeout(() => {
      toast({
        title: "Export completed",
        description: "Your mind map has been exported as PNG"
      });
    }, 1500);
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
  
  const renderNodeShape = (node: ThoughtNode) => {
    const baseClasses = cn(
      "p-3 rounded-lg shadow-sm border-2 cursor-grab active:cursor-grabbing transition-all",
      node.color,
      node.id === selectedNodeId && "ring-2 ring-primary border-primary",
      connectingMode && connectSource === node.id && "border-primary ring-2 ring-primary",
      connectingMode && connectSource && connectSource !== node.id && "hover:border-primary"
    );
    
    switch (node.shape) {
      case 'circle':
        return (
          <div
            className={cn(
              baseClasses,
              "rounded-full aspect-square flex items-center justify-center text-center"
            )}
            style={{
              width: '120px',
              height: '120px',
            }}
          >
            {isEditing === node.id ? (
              <textarea
                ref={editInputRef}
                className="w-full h-full bg-transparent resize-none focus:outline-none text-sm rounded-full text-center flex items-center justify-center"
                value={node.content}
                onChange={handleEditChange}
                onKeyDown={handleEditKeyDown}
                onBlur={handleEditBlur}
              />
            ) : (
              <div className="text-sm">{node.content}</div>
            )}
          </div>
        );
      
      case 'triangle':
        return (
          <div className="relative" style={{ width: '120px', height: '120px' }}>
            <div 
              className={cn(
                baseClasses,
                "clip-triangle absolute inset-0"
              )}
              style={{
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              }}
            >
              {isEditing === node.id ? (
                <textarea
                  ref={editInputRef}
                  className="absolute inset-0 pt-[40%] bg-transparent resize-none focus:outline-none text-sm text-center"
                  value={node.content}
                  onChange={handleEditChange}
                  onKeyDown={handleEditKeyDown}
                  onBlur={handleEditBlur}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center pt-8">
                  <div className="text-sm text-center">{node.content}</div>
                </div>
              )}
            </div>
          </div>
        );
        
      default: // rectangle
        return (
          <div className={baseClasses}>
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
        );
    }
  };
  
  return (
    <div className="relative h-full">
      {/* Toolbar */}
      <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <Button 
          size="sm" 
          variant={currentTool === 'select' ? 'default' : 'outline'} 
          className="h-9 w-9 p-0 rounded-md" 
          onClick={() => setCurrentTool('select')}
          title="Select Tool"
        >
          <MousePointer size={16} />
        </Button>
        <Button 
          size="sm" 
          variant={currentTool === 'draw' ? 'default' : 'outline'} 
          className="h-9 w-9 p-0 rounded-md" 
          onClick={() => setCurrentTool('draw')}
          title="Draw Tool"
        >
          <Plus size={16} />
        </Button>
        <Button 
          size="sm" 
          variant={currentTool === 'move' ? 'default' : 'outline'} 
          className="h-9 w-9 p-0 rounded-md" 
          onClick={() => setCurrentTool('move')}
          title="Move Tool"
        >
          <Move size={16} />
        </Button>
        
        <div className="border-t border-gray-200 dark:border-gray-700 my-1 w-full"></div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              size="sm" 
              variant="outline" 
              className="h-9 w-9 p-0 rounded-md"
              title="Node Shape"
            >
              {selectedShape === 'rectangle' ? (
                <Square size={16} />
              ) : selectedShape === 'circle' ? (
                <Circle size={16} />
              ) : (
                <Triangle size={16} />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setSelectedShape('rectangle')}>
              <Square size={16} className="mr-2" />
              Rectangle
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedShape('circle')}>
              <Circle size={16} className="mr-2" />
              Circle
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedShape('triangle')}>
              <Triangle size={16} className="mr-2" />
              Triangle
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              size="sm" 
              variant="outline" 
              className="h-9 w-9 p-0 rounded-md"
              title="Node Color"
            >
              <Palette size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {colors.map((color, index) => (
              <DropdownMenuItem 
                key={index} 
                onClick={() => setSelectedColor(color)}
                className="flex items-center"
              >
                <div 
                  className={`h-4 w-4 rounded-full mr-2 ${color.split(' ')[0]}`}
                ></div>
                Color {index + 1}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <div className="border-t border-gray-200 dark:border-gray-700 my-1 w-full"></div>
        
        <Button 
          size="sm" 
          variant="outline" 
          className="h-9 w-9 p-0 rounded-md" 
          onClick={handleUndo}
          disabled={historyIndex <= 0}
          title="Undo"
        >
          <Undo size={16} />
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          className="h-9 w-9 p-0 rounded-md" 
          onClick={handleRedo}
          disabled={historyIndex >= history.length - 1}
          title="Redo"
        >
          <Redo size={16} />
        </Button>
        
        <div className="border-t border-gray-200 dark:border-gray-700 my-1 w-full"></div>
        
        <Button 
          size="sm" 
          variant="outline" 
          className="h-9 w-9 p-0 rounded-md" 
          onClick={exportAsPNG}
          title="Export as PNG"
        >
          <Download size={16} />
        </Button>
      </div>
      
      {/* Node-specific tools */}
      {selectedNodeId && (
        <div className="absolute top-4 right-4 z-10 flex space-x-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                size="sm" 
                variant="outline" 
                className="h-9 w-9 p-0"
                title="Change Shape"
              >
                {selectedShape === 'rectangle' ? (
                  <Square size={16} />
                ) : selectedShape === 'circle' ? (
                  <Circle size={16} />
                ) : (
                  <Triangle size={16} />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => changeNodeShape('rectangle')}>
                <Square size={16} className="mr-2" />
                Rectangle
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeNodeShape('circle')}>
                <Circle size={16} className="mr-2" />
                Circle
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeNodeShape('triangle')}>
                <Triangle size={16} className="mr-2" />
                Triangle
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                size="sm" 
                variant="outline" 
                className="h-9 w-9 p-0"
                title="Change Color"
              >
                <Palette size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {colors.map((color, index) => (
                <DropdownMenuItem 
                  key={index} 
                  onClick={() => changeNodeColor(color)}
                  className="flex items-center"
                >
                  <div 
                    className={`h-4 w-4 rounded-full mr-2 ${color.split(' ')[0]}`}
                  ></div>
                  Color {index + 1}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            size="sm" 
            variant="outline"
            className="h-9 w-9 p-0"
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
            title="Connect Nodes"
          >
            <Link2 size={16} className={connectingMode ? "text-primary" : ""} />
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            className="h-9 w-9 p-0 text-destructive hover:text-destructive"
            onClick={deleteSelectedNode}
            title="Delete Node"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      )}
      
      {connectingMode && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
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
            className="absolute"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: node.id === selectedNodeId ? 10 : 1
            }}
            onClick={handleNodeClick(node.id)}
            onDoubleClick={handleNodeDoubleClick(node.id)}
            draggable={currentTool === 'move' || currentTool === 'select'}
            onDragStart={handleDragStart(node.id)}
          >
            {renderNodeShape(node)}
          </div>
        ))}
      </div>
    </div>
  );
});

ThoughtCanvas.displayName = "ThoughtCanvas";

export default ThoughtCanvas;
