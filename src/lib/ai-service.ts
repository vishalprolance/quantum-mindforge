
import { toast } from '@/hooks/use-toast';

// Interface for the mind map data structure
export interface MindMapNode {
  id: string;
  content: string;
  x: number;
  y: number;
  color: string;
  children?: string[];
  shape?: 'rectangle' | 'circle' | 'triangle';
}

export interface MindMapConnection {
  id: string;
  sourceId: string;
  targetId: string;
}

export interface MindMapData {
  nodes: MindMapNode[];
  connections: MindMapConnection[];
}

// Function to generate a mind map using Google Gemini API
export const generateMindMap = async (
  text: string, 
  files: File[] = []
): Promise<MindMapData> => {
  try {
    // Start with a loading toast
    toast({
      title: "Processing your input",
      description: "Analyzing content and generating mind map..."
    });
    
    // Read files content if any
    const fileContents = await Promise.all(
      files.map(async file => {
        // For images, we would need to handle differently
        if (file.type.startsWith('image/')) {
          return `[Image file: ${file.name}]`;
        }
        try {
          return await readFileAsText(file);
        } catch (err) {
          console.error(`Error reading file ${file.name}:`, err);
          return `[Error reading file: ${file.name}]`;
        }
      })
    );
    
    // Combine text and file contents
    const combinedInput = [text, ...fileContents].filter(Boolean).join('\n\n');
    
    // In a production environment, you would send this to a backend API
    // that would call the Gemini API with your API key
    
    // For demo purposes, we'll use a mock response
    // In a real implementation with proper backend, we'd call something like:
    // const response = await callGeminiApi(combinedInput);
    
    let mockResponse: MindMapData;
    
    // Generate more complex mind map for longer inputs
    if (combinedInput.length > 500) {
      mockResponse = generateComplexMockMindMap(combinedInput);
    } else {
      mockResponse = generateSimpleMockMindMap(combinedInput);
    }
    
    return mockResponse;
  } catch (error) {
    console.error("Error generating mind map:", error);
    toast({
      title: "Error",
      description: "Failed to generate mind map. Please try again.",
      variant: "destructive"
    });
    
    // Return a simple default mind map in case of error
    return {
      nodes: [
        {
          id: "1",
          content: "Central Idea",
          x: 50,
          y: 50,
          color: "bg-blue-100 border-blue-300",
          children: []
        }
      ],
      connections: []
    };
  }
};

// Helper function to read file content
const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

// Generate a simple mind map based on input
const generateSimpleMockMindMap = (input: string): MindMapData => {
  const centralNode = {
    id: "1",
    content: "Central Idea",
    x: 50,
    y: 50,
    color: "bg-blue-100 border-blue-300",
    shape: "rectangle" as const,
    children: []
  };
  
  // Generate some nodes based on input length
  const words = input.split(/\s+/).filter(w => w.length > 3);
  const topics = words.slice(0, Math.min(words.length, 5));
  
  const nodes: MindMapNode[] = [centralNode];
  const connections: MindMapConnection[] = [];
  
  // If no substantial input, return basic structure
  if (topics.length === 0) {
    return { nodes, connections };
  }
  
  // Generate nodes in a radial pattern
  topics.forEach((topic, i) => {
    const angle = (2 * Math.PI * i) / topics.length;
    const distance = 30; // Distance from center
    
    const nodeId = String(i + 2);
    const x = 50 + distance * Math.cos(angle);
    const y = 50 + distance * Math.sin(angle);
    
    // Pick a color and shape
    const colors = [
      "bg-green-100 border-green-300",
      "bg-purple-100 border-purple-300",
      "bg-amber-100 border-amber-300",
      "bg-rose-100 border-rose-300",
      "bg-cyan-100 border-cyan-300",
    ];
    
    const shapes = ["rectangle", "circle", "triangle"] as const;
    
    nodes.push({
      id: nodeId,
      content: topic.charAt(0).toUpperCase() + topic.slice(1),
      x,
      y,
      color: colors[i % colors.length],
      shape: shapes[i % shapes.length]
    });
    
    connections.push({
      id: `c${i}`,
      sourceId: "1",
      targetId: nodeId
    });
    
    centralNode.children!.push(nodeId);
  });
  
  return { nodes, connections };
};

// Generate a more complex mind map with secondary connections
const generateComplexMockMindMap = (input: string): MindMapData => {
  // Start with the simple structure
  const { nodes, connections } = generateSimpleMockMindMap(input);
  
  // Only proceed if we have enough nodes
  if (nodes.length <= 3) {
    return { nodes, connections };
  }
  
  const centralNode = nodes[0];
  const keywords = extractKeywords(input, 12);
  
  // Add secondary nodes connected to first-level nodes
  nodes.slice(1).forEach((parentNode, i) => {
    // Skip if we've run out of keywords
    if (keywords.length <= i * 2) return;
    
    // Add 2 sub-nodes to each first-level node
    for (let j = 0; j < 2; j++) {
      const keywordIndex = i * 2 + j;
      if (keywordIndex >= keywords.length) continue;
      
      const keyword = keywords[keywordIndex];
      const nodeId = `${i + 2}-${j + 1}`;
      
      // Calculate position as offset from parent
      const angle = (Math.PI / 4) * (j === 0 ? -1 : 1); // -45 or +45 degrees from parent
      const distance = 15;
      
      // Get parent position
      const parentX = parentNode.x;
      const parentY = parentNode.y;
      
      // Calculate angle from center to parent
      const parentAngle = Math.atan2(parentY - 50, parentX - 50);
      
      // Calculate new position
      const x = parentX + distance * Math.cos(parentAngle + angle);
      const y = parentY + distance * Math.sin(parentAngle + angle);
      
      // Ensure position is within bounds (0-100)
      const boundedX = Math.min(Math.max(x, 10), 90);
      const boundedY = Math.min(Math.max(y, 10), 90);
      
      // Add node
      const newNode: MindMapNode = {
        id: nodeId,
        content: keyword.charAt(0).toUpperCase() + keyword.slice(1),
        x: boundedX,
        y: boundedY,
        color: parentNode.color.replace('100', '50'), // Lighter version of parent color
        shape: parentNode.shape
      };
      
      nodes.push(newNode);
      
      // Connect to parent
      connections.push({
        id: `c${parentNode.id}-${j}`,
        sourceId: parentNode.id,
        targetId: nodeId
      });
      
      // Occasionally add cross-connections for complexity
      if (Math.random() < 0.3 && nodes.length > 3) {
        // Choose a random node that isn't the central node or the parent
        const potentialTargets = nodes.filter(n => 
          n.id !== '1' && n.id !== parentNode.id && n.id !== nodeId
        );
        
        if (potentialTargets.length > 0) {
          const targetNode = potentialTargets[Math.floor(Math.random() * potentialTargets.length)];
          connections.push({
            id: `c-cross-${nodeId}-${targetNode.id}`,
            sourceId: nodeId,
            targetId: targetNode.id
          });
        }
      }
    }
  });
  
  return { nodes, connections };
};

// Extract keywords from text
const extractKeywords = (text: string, count: number): string[] => {
  // This is a simple implementation
  // In a real app, you would use NLP techniques or an AI service
  
  // Remove common words
  const commonWords = new Set([
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it',
    'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but',
    'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will',
    'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out',
    'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can',
    'like', 'time', 'no', 'just', 'him', 'know', 'take', 'people', 'into',
    'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than',
    'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
    'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well',
    'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day',
    'most', 'us'
  ]);
  
  // Tokenize text
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.has(word));
  
  // Count frequency of each word
  const wordCounts = new Map<string, number>();
  for (const word of words) {
    wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
  }
  
  // Sort by frequency and take top 'count'
  return Array.from(wordCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([word]) => word);
};

// This would be your backend implementation for calling the Gemini API
// It's commented out because it would require backend code to securely use the API key
/*
const callGeminiApi = async (input: string) => {
  try {
    // In a real implementation, this would be a fetch call to your backend
    // that securely uses the API key
    const prompt = `
      Create a mind map based on the following content.
      Generate it as a JSON object with the following structure:
      {
        "nodes": [
          {
            "id": "string",
            "content": "string",
            "x": number, // position from 0-100
            "y": number, // position from 0-100
            "color": "string", // Tailwind CSS class
            "shape": "rectangle" | "circle" | "triangle"
          }
        ],
        "connections": [
          {
            "id": "string",
            "sourceId": "string",
            "targetId": "string"
          }
        ]
      }
      
      Content to analyze:
      ${input}
    `;
    
    // In a real application, this would call your backend API
    // const response = await fetch('/api/generate-mind-map', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ prompt })
    // });
    // 
    // const data = await response.json();
    // return data;
    
    // For now, return a mock response
    return generateComplexMockMindMap(input);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};
*/
