
import { toast } from '@/hooks/use-toast';

// Interface for the mind map data structure
export interface MindMapNode {
  id: string;
  content: string;
  x: number;
  y: number;
  color: string;
  children?: string[];
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

// Mock function to simulate file reading since we can't do this directly in the browser
const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

// Function to generate a mind map using Google Gemini API
export const generateMindMap = async (
  text: string, 
  files: File[] = []
): Promise<MindMapData> => {
  try {
    // For demo purposes, we'll use a client-side approach
    // In a production app, this should be a server-side API call
    
    // Simulate API request with loading time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
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
    
    // For demo purposes, we'll generate a mock mind map
    // In a real implementation, we would call the Gemini API here
    const mockResponse = generateMockMindMap(combinedInput);
    
    return mockResponse;
  } catch (error) {
    console.error("Error generating mind map:", error);
    toast({
      title: "Error",
      description: "Failed to generate mind map. Please try again.",
      variant: "destructive"
    });
    
    // Return a simple default mind map
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

// Mock function to generate a mind map based on input text
// In a real implementation, this would be replaced with the Gemini API call
const generateMockMindMap = (input: string): MindMapData => {
  const centralNode = {
    id: "1",
    content: "Central Idea",
    x: 50,
    y: 50,
    color: "bg-blue-100 border-blue-300",
    children: ["2", "3", "4"]
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
    
    // Pick a color
    const colors = [
      "bg-green-100 border-green-300",
      "bg-purple-100 border-purple-300",
      "bg-amber-100 border-amber-300",
      "bg-rose-100 border-rose-300",
      "bg-cyan-100 border-cyan-300",
    ];
    
    nodes.push({
      id: nodeId,
      content: topic.charAt(0).toUpperCase() + topic.slice(1),
      x,
      y,
      color: colors[i % colors.length],
    });
    
    connections.push({
      id: `c${i}`,
      sourceId: "1",
      targetId: nodeId
    });
  });
  
  return { nodes, connections };
};

// In a real implementation, this function would call the Gemini API
// Here's how it might look (commented out since it won't work in the browser directly)
/*
const callGeminiApi = async (input: string) => {
  try {
    // This would normally be a server-side function
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    
    const apiKey = "AIzaSyDzdRxEYKrbBzVzHpScWC4lVkuo89r8gsE"; // In production, use environment variable
    const genAI = new GoogleGenerativeAI(apiKey);
    
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });
    
    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
    };
    
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });
    
    const prompt = `
      Create a mind map structure based on the following content. 
      Format the response as a JSON object with nodes and connections arrays.
      Each node should have id, content, and position (x, y).
      Each connection should link two nodes.
      
      Content to analyze:
      ${input}
    `;
    
    const result = await chatSession.sendMessage(prompt);
    const responseText = result.response.text();
    
    // Parse the JSON response
    try {
      return JSON.parse(responseText);
    } catch (error) {
      console.error("Error parsing AI response:", error);
      return null;
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return null;
  }
};
*/
