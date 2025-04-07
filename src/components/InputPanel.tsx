
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PaperclipIcon, Mic, MicOff, Send, Wand2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { generateMindMap } from '@/lib/ai-service';

interface InputPanelProps {
  onGenerateMap: (data: any) => void;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'system';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
  attachments?: File[];
}

// Define a type for the speech recognition
type SpeechRecognitionType = {
  continuous: boolean;
  interimResults: boolean;
  onresult: (event: SpeechRecognitionEvent) => void;
  start: () => void;
  stop: () => void;
};

const InputPanel = ({ onGenerateMap }: InputPanelProps) => {
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'system',
      content: 'Welcome to Quantum Mindforge! Type your thoughts or upload files to generate a mind map.',
      timestamp: new Date(),
      status: 'sent'
    }
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedText, setRecordedText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Speech recognition setup
  const [recognition, setRecognition] = useState<SpeechRecognitionType | null>(null);
  
  useEffect(() => {
    // Initialize speech recognition if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      // Use the appropriate constructor based on browser support
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognitionAPI) {
        const recognitionInstance = new SpeechRecognitionAPI() as SpeechRecognitionType;
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        
        recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
          let interimTranscript = '';
          let finalTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }
          
          setRecordedText(finalTranscript || interimTranscript);
        };
        
        setRecognition(recognitionInstance);
      }
    }
  }, []);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      
      // Update input text to indicate files
      setInputText(prev => {
        const fileNames = newFiles.map(file => file.name).join(', ');
        return prev ? `${prev} [Attached: ${fileNames}]` : `[Attached: ${fileNames}]`;
      });
      
      toast({
        title: "Files attached",
        description: `${newFiles.length} file(s) have been attached`
      });
    }
  };
  
  const handleVoiceInput = () => {
    if (!recognition) {
      toast({
        title: "Voice input unavailable",
        description: "Your browser doesn't support voice recognition",
        variant: "destructive"
      });
      return;
    }
    
    if (isRecording) {
      // Stop recording
      recognition.stop();
      setIsRecording(false);
      
      // Add recorded text to input if there's any
      if (recordedText) {
        setInputText(prev => prev + ' ' + recordedText);
        setRecordedText('');
      }
    } else {
      // Start recording
      try {
        recognition.start();
        setIsRecording(true);
        toast({
          title: "Voice recording started",
          description: "Speak clearly... tap the mic again to stop"
        });
      } catch (error) {
        console.error("Error starting voice recognition:", error);
        toast({
          title: "Failed to start recording",
          description: "Please try again",
          variant: "destructive"
        });
      }
    }
  };
  
  const handleSendMessage = async () => {
    if (!inputText.trim() && !fileInputRef.current?.files?.length) {
      toast({
        title: "Input required",
        description: "Please add some text or upload files before sending",
        variant: "destructive"
      });
      return;
    }
    
    // Create a new message
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText,
      timestamp: new Date(),
      status: 'sending',
      attachments: fileInputRef.current?.files ? Array.from(fileInputRef.current.files) : []
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    
    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    setIsGenerating(true);
    
    try {
      // Update message status
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
      ));
      
      // Process with AI service
      const files = newMessage.attachments || [];
      const result = await generateMindMap(newMessage.content, files);
      
      // Add response message
      const responseMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'system',
        content: "I've analyzed your input and created a mind map. You can view it in the canvas on the left.",
        timestamp: new Date(),
        status: 'sent'
      };
      
      setMessages(prev => [...prev, responseMessage]);
      
      // Update the mind map
      onGenerateMap(result);
      
      toast({
        title: "Mind map generated",
        description: "Your input has been processed successfully"
      });
    } catch (error) {
      console.error("Generation error:", error);
      
      // Update message status to error
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: 'error' } : msg
      ));
      
      toast({
        title: "Generation failed",
        description: "There was an error processing your input",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Send message on Ctrl/Cmd + Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-950 border-l border-gray-200 dark:border-gray-800">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-semibold">Input Panel</h2>
        <p className="text-sm text-muted-foreground">Add content to generate your mind map</p>
      </div>
      
      {/* Chat Messages Area */}
      <div className="flex-grow overflow-auto p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] p-3 rounded-lg ${
                message.type === 'user' 
                  ? 'bg-primary/10 text-primary-foreground' 
                  : 'bg-muted text-foreground'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              {message.attachments && message.attachments.length > 0 && (
                <div className="mt-2 text-xs text-muted-foreground">
                  {message.attachments.map((file, index) => (
                    <div key={index} className="flex items-center">
                      <PaperclipIcon size={12} className="mr-1" />
                      <span>{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-1 text-right text-xs text-muted-foreground">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {message.status === 'sending' && ' • Sending...'}
                {message.status === 'error' && ' • Failed to send'}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Typing indicator when recording */}
      {isRecording && (
        <div className="px-4 py-2 text-sm text-muted-foreground italic flex items-center">
          <span className="mr-2">Recording...</span>
          <span className="flex space-x-1">
            <span className="animate-ping h-1.5 w-1.5 rounded-full bg-primary opacity-75 delay-0"></span>
            <span className="animate-ping h-1.5 w-1.5 rounded-full bg-primary opacity-75 delay-300"></span>
            <span className="animate-ping h-1.5 w-1.5 rounded-full bg-primary opacity-75 delay-700"></span>
          </span>
          <span className="ml-2 text-xs">{recordedText}</span>
        </div>
      )}
      
      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-end space-x-2">
          <div className="flex-grow">
            <Textarea 
              placeholder="Type your thoughts or ideas here..."
              className="resize-none min-h-[80px]"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Press <kbd className="px-1.5 py-0.5 text-xs font-semibold border rounded-md">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 text-xs font-semibold border rounded-md">Enter</kbd> to send
            </p>
          </div>
          
          <div className="flex flex-col space-y-2">
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={handleFileUpload}
              disabled={isGenerating}
              title="Attach files"
            >
              <PaperclipIcon className="h-5 w-5" />
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                multiple 
                onChange={handleFileChange}
                accept=".txt,.md,.pdf,.docx,.py,.js,.html,.css,.jpg,.jpeg,.png"
              />
            </Button>
            
            <Button
              type="button"
              size="icon"
              variant={isRecording ? "default" : "outline"}
              onClick={handleVoiceInput}
              disabled={isGenerating}
              title={isRecording ? "Stop recording" : "Start voice input"}
              className={isRecording ? "text-white bg-primary" : ""}
            >
              {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
            
            <Button
              type="button"
              size="icon"
              onClick={handleSendMessage}
              disabled={isGenerating || (!inputText.trim() && !fileInputRef.current?.files?.length)}
              title="Generate mind map"
            >
              {isGenerating ? <Wand2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputPanel;
