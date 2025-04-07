
import { useState, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Mic, File, FileText, Image, Code, Wand } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { generateMindMap } from '@/lib/ai-service';

interface InputPanelProps {
  onGenerateMap: (data: any) => void;
}

const InputPanel = ({ onGenerateMap }: InputPanelProps) => {
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
      toast({
        title: "Files added",
        description: `${newFiles.length} file(s) have been added to your input`
      });
    }
  };
  
  const handleVoiceInput = () => {
    // This would integrate with Web Speech API
    toast({
      title: "Voice input",
      description: "Speak your thoughts... (Feature coming soon)"
    });
  };
  
  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleGenerate = async () => {
    if (!inputText && selectedFiles.length === 0) {
      toast({
        title: "Input required",
        description: "Please add some text or upload files before generating",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Here we would process the input and call the AI service
      const result = await generateMindMap(inputText, selectedFiles);
      onGenerateMap(result);
      
      toast({
        title: "Mind map generated",
        description: "Your input has been processed successfully"
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "There was an error processing your input",
        variant: "destructive"
      });
      console.error("Generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-950 border-l border-gray-200 dark:border-gray-800">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-semibold">Input Panel</h2>
        <p className="text-sm text-muted-foreground">Add content to generate your mind map</p>
      </div>
      
      <Tabs defaultValue="text" className="flex-grow flex flex-col">
        <div className="px-4 pt-2">
          <TabsList className="w-full">
            <TabsTrigger value="text" className="flex-1">Text</TabsTrigger>
            <TabsTrigger value="files" className="flex-1">Files</TabsTrigger>
            <TabsTrigger value="voice" className="flex-1">Voice</TabsTrigger>
          </TabsList>
        </div>
        
        <div className="flex-grow overflow-auto p-4">
          <TabsContent value="text" className="h-full flex flex-col mt-0">
            <Textarea 
              placeholder="Enter your thoughts or paste content here..."
              className="flex-grow mb-4 resize-none min-h-[200px]"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </TabsContent>
          
          <TabsContent value="files" className="h-full flex flex-col mt-0">
            <div className="flex-grow border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md p-4 flex flex-col items-center justify-center mb-4">
              {selectedFiles.length > 0 ? (
                <div className="w-full">
                  <h3 className="text-sm font-medium mb-2">Uploaded Files:</h3>
                  <ul className="space-y-2 max-h-[200px] overflow-y-auto">
                    {selectedFiles.map((file, index) => (
                      <li key={index} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded">
                        <div className="flex items-center">
                          {file.type.includes('image') ? (
                            <Image size={16} className="mr-2" />
                          ) : file.type.includes('text') || file.name.endsWith('.md') ? (
                            <FileText size={16} className="mr-2" />
                          ) : file.name.endsWith('.py') || file.name.endsWith('.js') ? (
                            <Code size={16} className="mr-2" />
                          ) : (
                            <File size={16} className="mr-2" />
                          )}
                          <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleRemoveFile(index)}
                          className="h-6 w-6 p-0"
                        >
                          ×
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-center text-muted-foreground mb-2">
                    Drag and drop files here or click to upload
                  </p>
                  <p className="text-xs text-center text-muted-foreground">
                    Supports text, markdown, images, PDF, Word, and code files
                  </p>
                </>
              )}
              
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                multiple 
                onChange={handleFileChange}
                accept=".txt,.md,.pdf,.docx,.py,.js,.html,.css,.jpg,.jpeg,.png"
              />
              
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4" 
                onClick={handleFileUpload}
              >
                <Upload size={16} className="mr-2" />
                Upload Files
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="voice" className="h-full flex flex-col mt-0">
            <div className="flex-grow border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md p-4 flex flex-col items-center justify-center mb-4">
              <Mic className="h-16 w-16 text-gray-400 mb-4" />
              <p className="text-center text-muted-foreground mb-4">
                Click the button below to start recording your thoughts
              </p>
              <Button onClick={handleVoiceInput}>
                Start Recording
              </Button>
            </div>
          </TabsContent>
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <Button 
            className="w-full" 
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            <Wand size={16} className="mr-2" />
            {isGenerating ? "Generating..." : "Generate Mind Map"}
          </Button>
        </div>
      </Tabs>
    </div>
  );
};

export default InputPanel;
