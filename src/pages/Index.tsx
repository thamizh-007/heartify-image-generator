
import React, { useState, useRef, useEffect } from 'react';
import { Anchor } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import html2canvas from 'html2canvas';
import NameDisplay from '@/components/NameDisplay';

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
      // Create a temporary container for capturing
      const container = document.createElement('div');
      container.className = 'image-capture-container';
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      container.style.width = '1000px'; // Even wider container for better result
      container.style.backgroundColor = '#121212';
      container.style.padding = '60px'; // More padding
      document.body.appendChild(container);
      
      // Create a custom element for the download to ensure proper formatting
      const captureEl = document.createElement('div');
      captureEl.className = 'capture-content';
      captureEl.style.display = 'flex';
      captureEl.style.flexDirection = 'column';
      captureEl.style.alignItems = 'center';
      captureEl.style.justifyContent = 'center';
      captureEl.style.width = '100%';
      captureEl.style.padding = '40px';
      captureEl.style.borderRadius = '8px';
      captureEl.style.backgroundColor = '#121212';
      captureEl.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
      
      // Names and heart container
      const namesContainer = document.createElement('div');
      namesContainer.style.display = 'flex';
      namesContainer.style.alignItems = 'center';
      namesContainer.style.justifyContent = 'center';
      namesContainer.style.marginBottom = '30px';
      namesContainer.style.gap = '50px'; // Ensure consistent spacing
      
      // First name
      const firstNameEl = document.createElement('div');
      firstNameEl.textContent = firstName;
      firstNameEl.style.fontSize = '60px';
      firstNameEl.style.fontWeight = 'bold';
      firstNameEl.style.color = 'white';
      firstNameEl.style.letterSpacing = '2px';
      
      // Heart
      const heartContainer = document.createElement('div');
      heartContainer.innerHTML = `<svg width="60" height="60" viewBox="0 0 24 24" fill="#dc2626" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`;
      heartContainer.style.filter = 'drop-shadow(0 0 5px rgba(220, 38, 38, 0.7))';
      
      // Second name
      const secondNameEl = document.createElement('div');
      secondNameEl.textContent = secondName;
      secondNameEl.style.fontSize = '60px';
      secondNameEl.style.fontWeight = 'bold';
      secondNameEl.style.color = 'white';
      secondNameEl.style.letterSpacing = '2px';
      
      // Footer
      const footerEl = document.createElement('div');
      footerEl.textContent = '© Made for each other';
      footerEl.style.fontSize = '18px';
      footerEl.style.color = '#C8C8C9';
      footerEl.style.marginTop = '30px';
      footerEl.style.letterSpacing = '1px';
      
      // Assemble the elements
      namesContainer.appendChild(firstNameEl);
      namesContainer.appendChild(heartContainer);
      namesContainer.appendChild(secondNameEl);
      captureEl.appendChild(namesContainer);
      captureEl.appendChild(footerEl);
      container.appendChild(captureEl);
      
      // Capture the image with higher quality
      const canvas = await html2canvas(captureEl, {
        backgroundColor: '#121212',
        scale: 4, // Higher scale for better resolution
        logging: false,
        useCORS: true
      });
      
      // Clean up
      document.body.removeChild(container);

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
            LOVE PLANES DEPARTURES
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
          <div className="mt-6 flex flex-col">
            <NameDisplay
              ref={resultRef}
              firstName={firstName}
              secondName={secondName}
              visible={showNames}
              onDownload={handleDownload}
            />
            
            <div className="flex flex-col gap-4 mt-4">
              <Button 
                onClick={handleDownload}
                className="w-full h-12 text-lg bg-red-600 hover:bg-red-700 transition-colors duration-300"
              >
                Download Image
              </Button>
              
              <Button 
                onClick={() => setShowNames(false)}
                variant="secondary" 
                className="w-full h-12"
              >
                Create New
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
