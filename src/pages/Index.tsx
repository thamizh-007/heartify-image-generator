
import React, { useState, useRef, useEffect } from 'react';
import { Anchor } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useToast } from "@/components/ui/use-toast";
import html2canvas from 'html2canvas';
import NameDisplay from '@/components/NameDisplay';

// Add html2canvas dependency
const Index = () => {
  const [firstName, setFirstName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [showNames, setShowNames] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const { toast } = useToast();
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds} PST`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName.trim() || !secondName.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter both names",
        variant: "destructive",
      });
      return;
    }

    setShowNames(true);
  };

  const handleDownload = async () => {
    if (!resultRef.current) return;

    try {
      const canvas = await html2canvas(resultRef.current, {
        backgroundColor: '#121212',
        scale: 2,
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `${firstName}-${secondName}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      toast({
        title: "Success!",
        description: "Your image has been downloaded",
      });
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative p-4 overflow-hidden">
      <div className="w-full max-w-xl relative z-10">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <Anchor size={18} className="mr-2 opacity-80" />
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold tracking-widest text-center">
            SF FERRY DEPARTURES
          </h1>
          
          <div className="text-sm sm:text-base red-glow text-red-600 ml-2">
            {currentTime}
          </div>
        </div>

        {!showNames ? (
          <form onSubmit={handleSubmit} className="animate-fade-in space-y-6">
            <div className="space-y-2">
              <label htmlFor="firstName" className="block text-lg tracking-wide">
                Enter First Name:
              </label>
              <Input
                id="firstName"
                placeholder="e.g. Romeo"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-4 h-14 text-lg tracking-wide"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="secondName" className="block text-lg tracking-wide">
                Enter Second Name:
              </label>
              <Input
                id="secondName"
                placeholder="e.g. Juliet"
                value={secondName}
                onChange={(e) => setSecondName(e.target.value)}
                className="w-full p-4 h-14 text-lg tracking-wide"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-14 mt-6 text-lg bg-red-600 hover:bg-red-700 transition-colors duration-300"
            >
              Display Names
            </Button>
          </form>
        ) : (
          <div className="mt-6">
            <NameDisplay
              ref={resultRef}
              firstName={firstName}
              secondName={secondName}
              visible={showNames}
              onDownload={handleDownload}
            />
            
            <Button 
              onClick={() => setShowNames(false)}
              variant="secondary" 
              className="w-full mt-4 h-12"
            >
              Create New
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
