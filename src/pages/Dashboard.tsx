
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ThoughtCanvas from '@/components/ThoughtCanvas';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { PlusCircle, Save, DownloadCloud, Share2 } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [saveStatus, setSaveStatus] = useState("saved");
  const [projectName, setProjectName] = useState("My Thought Map");
  
  useEffect(() => {
    // Simulating check if user is signed in
    const isSignedIn = localStorage.getItem('user') !== null;
    
    if (!isSignedIn) {
      navigate('/signin');
      toast({
        title: "Sign in required",
        description: "Please sign in to access your dashboard",
        variant: "destructive"
      });
    }
    
    const savedProject = localStorage.getItem('currentProject');
    if (savedProject) {
      setProjectName(JSON.parse(savedProject).name);
    }
  }, [navigate]);
  
  const handleSave = () => {
    setSaveStatus("saving");
    
    // Simulating save operation
    setTimeout(() => {
      setSaveStatus("saved");
      localStorage.setItem('currentProject', JSON.stringify({
        name: projectName,
        lastSaved: new Date().toISOString()
      }));
      
      toast({
        title: "Project saved",
        description: "Your thought map has been saved successfully"
      });
    }, 800);
  };
  
  const handleExport = () => {
    toast({
      title: "Exporting project",
      description: "Your thought map is being prepared for download"
    });
    
    // Simulating export operation
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: "Your thought map has been exported successfully"
      });
    }, 1500);
  };
  
  const handleShare = () => {
    toast({
      title: "Share your project",
      description: "Sharing options opened in a new window"
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold mb-1">{projectName}</h1>
              <p className="text-sm text-muted-foreground">
                {saveStatus === "saved" ? "All changes saved" : "Saving..."}
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={handleExport}>
                <DownloadCloud size={18} className="mr-2" />
                Export
              </Button>
              <Button variant="outline" onClick={handleShare}>
                <Share2 size={18} className="mr-2" />
                Share
              </Button>
              <Button onClick={handleSave}>
                <Save size={18} className="mr-2" />
                Save
              </Button>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800 h-[calc(100vh-240px)] overflow-hidden">
            <ThoughtCanvas />
          </div>
          
          <div className="mt-4 flex justify-center">
            <Button variant="outline" className="rounded-full">
              <PlusCircle size={20} className="mr-2" />
              Add New Thought
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
