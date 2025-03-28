
import React, { useState, useRef, useEffect } from 'react';
import { Anchor, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import html2canvas from 'html2canvas';
import NameDisplay from '@/components/NameDisplay';
import JSZip from 'jszip';

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
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
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

  const handleDownloadProject = async () => {
    try {
      toast({
        title: "Preparing download",
        description: "Creating ZIP file...",
      });
      
      const zip = new JSZip();
      
      // Add a README file
      zip.file("README.md", `# Heartify Image Generator

This application allows you to generate beautiful images of two names connected with a heart.

## How to use
1. Enter the first name
2. Enter the second name
3. Click "Display Names" to see the preview
4. Click "Download Image" to download a high-quality PNG

Created with love for ${firstName || 'you'} and ${secondName || 'your loved ones'}.
`);

      // Create the project structure
      const src = zip.folder("src");
      const components = src?.folder("components");
      const pages = src?.folder("pages");
      
      // Add main HTML file
      zip.file("index.html", `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Heartify Image Generator</title>
    <meta name="description" content="Create beautiful name combinations with a glowing heart" />
    <link rel="stylesheet" href="src/index.css" />
  </head>
  <body>
    <div id="root"></div>
    <script src="src/main.js"></script>
  </body>
</html>
      `);
      
      // Add CSS file with styles
      src?.file("index.css", `
:root {
  --background: #121212;
  --foreground: #ffffff;
  --primary: #dc2626;
  --card: #1e1e1e;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: var(--background);
  color: var(--foreground);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.heart-container {
  animation: pulse 2s infinite;
  filter: drop-shadow(0 0 8px rgba(220, 38, 38, 0.7));
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.animate-fade-in {
  animation: fadeIn 1s ease-in;
}

@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}
      `);
      
      // Add a simple JavaScript implementation
      src?.file("main.js", `
document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  
  // Create the app structure
  const app = document.createElement('div');
  app.className = 'min-h-screen flex flex-col items-center justify-center p-4';
  
  // Create header
  const header = document.createElement('div');
  header.className = 'mb-8 flex items-center justify-between w-full max-w-xl';
  
  const title = document.createElement('h1');
  title.textContent = 'LOVE PLANES DEPARTURES';
  title.className = 'text-xl font-bold tracking-widest text-center whitespace-nowrap';
  
  const timeDisplay = document.createElement('div');
  timeDisplay.className = 'text-sm text-red-600';
  
  // Update time function
  function updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    timeDisplay.textContent = \`\${hours}:\${minutes}:\${seconds}\`;
  }
  
  updateTime();
  setInterval(updateTime, 1000);
  
  // Create form
  const form = document.createElement('form');
  form.className = 'space-y-6 w-full max-w-xl';
  
  // First name input
  const firstNameLabel = document.createElement('label');
  firstNameLabel.textContent = 'Enter First Name:';
  firstNameLabel.className = 'block text-lg';
  
  const firstNameInput = document.createElement('input');
  firstNameInput.type = 'text';
  firstNameInput.placeholder = 'e.g. Romeo';
  firstNameInput.className = 'w-full p-4 h-14 text-lg bg-card text-foreground rounded-md';
  
  // Second name input
  const secondNameLabel = document.createElement('label');
  secondNameLabel.textContent = 'Enter Second Name:';
  secondNameLabel.className = 'block text-lg';
  
  const secondNameInput = document.createElement('input');
  secondNameInput.type = 'text';
  secondNameInput.placeholder = 'e.g. Juliet';
  secondNameInput.className = 'w-full p-4 h-14 text-lg bg-card text-foreground rounded-md';
  
  // Submit button
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = 'Display Names';
  submitBtn.className = 'w-full h-14 mt-6 text-lg bg-primary text-white p-4 rounded-md';
  
  // Result container
  const resultContainer = document.createElement('div');
  resultContainer.className = 'mt-6 flex flex-col hidden';
  
  // Result display
  const display = document.createElement('div');
  display.className = 'rounded-md flex flex-col items-center justify-center py-12 px-8 bg-card shadow-lg w-full max-w-xl';
  
  // Names container
  const namesContainer = document.createElement('div');
  namesContainer.className = 'flex items-center justify-center space-x-8 mb-8';
  
  // Footer
  const footer = document.createElement('div');
  footer.textContent = '© Made for each other';
  footer.className = 'text-sm text-gray-400 tracking-wide mt-4';
  
  // Download button
  const downloadBtn = document.createElement('button');
  downloadBtn.textContent = 'Download Image';
  downloadBtn.className = 'w-full h-12 text-lg bg-primary text-white p-3 rounded-md mt-4';
  
  // Back button
  const backBtn = document.createElement('button');
  backBtn.textContent = 'Create New';
  backBtn.className = 'w-full h-12 text-lg bg-card text-white p-3 rounded-md mt-4';
  
  // Build the DOM
  header.appendChild(title);
  header.appendChild(timeDisplay);
  
  form.appendChild(firstNameLabel);
  form.appendChild(firstNameInput);
  form.appendChild(secondNameLabel);
  form.appendChild(secondNameInput);
  form.appendChild(submitBtn);
  
  display.appendChild(namesContainer);
  display.appendChild(footer);
  
  resultContainer.appendChild(display);
  resultContainer.appendChild(downloadBtn);
  resultContainer.appendChild(backBtn);
  
  app.appendChild(header);
  app.appendChild(form);
  app.appendChild(resultContainer);
  
  root.appendChild(app);
  
  // Event listeners
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const firstName = firstNameInput.value.trim();
    const secondName = secondNameInput.value.trim();
    
    if (!firstName || !secondName) {
      alert('Please enter both names');
      return;
    }
    
    // First name
    const firstNameEl = document.createElement('span');
    firstNameEl.textContent = firstName;
    firstNameEl.className = 'text-4xl font-bold tracking-wider';
    
    // Heart
    const heartContainer = document.createElement('div');
    heartContainer.innerHTML = \`<svg width="40" height="40" viewBox="0 0 24 24" fill="#dc2626" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>\`;
    heartContainer.className = 'heart-container';
    
    // Second name
    const secondNameEl = document.createElement('span');
    secondNameEl.textContent = secondName;
    secondNameEl.className = 'text-4xl font-bold tracking-wider';
    
    // Clear and update names container
    namesContainer.innerHTML = '';
    namesContainer.appendChild(firstNameEl);
    namesContainer.appendChild(heartContainer);
    namesContainer.appendChild(secondNameEl);
    
    // Show result, hide form
    resultContainer.classList.remove('hidden');
    form.classList.add('hidden');
  });
  
  backBtn.addEventListener('click', () => {
    // Show form, hide result
    resultContainer.classList.add('hidden');
    form.classList.remove('hidden');
  });
  
  downloadBtn.addEventListener('click', () => {
    alert('In this simplified version, image download is not implemented. You would need canvas capabilities to generate the image.');
  });
});
      `);
      
      // Generate the zip
      const content = await zip.generateAsync({ type: "blob" });
      
      // Create a download link and click it
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = "heartify-project.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Success!",
        description: "Your project has been downloaded as a ZIP file.",
      });
    } catch (error) {
      console.error("Error downloading project:", error);
      toast({
        title: "Error",
        description: "Failed to download project. Please try again.",
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
          
          <h1 className="text-xl sm:text-2xl font-bold tracking-widest text-center whitespace-nowrap">
            LOVE PLANES DEPARTURES
          </h1>
          
          <div className="text-xs sm:text-sm red-glow text-red-600">
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
                onClick={handleDownloadProject}
                className="w-full h-12 text-lg bg-green-600 hover:bg-green-700 transition-colors duration-300"
              >
                <Download className="mr-2" size={18} />
                Download Project as ZIP
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
