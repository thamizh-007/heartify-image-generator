
import React, { useRef, forwardRef } from 'react';
import { Heart, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NameDisplayProps {
  firstName: string;
  secondName: string;
  visible: boolean;
  onDownload: () => void;
}

const NameDisplay = forwardRef<HTMLDivElement, NameDisplayProps>(
  ({ firstName, secondName, visible, onDownload }, ref) => {
    return (
      <div 
        ref={ref}
        className={cn(
          "transition-all duration-500 ease-in-out rounded-md flex flex-col items-center justify-center py-12 px-8 bg-card shadow-lg w-full max-w-xl relative",
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}
      >
        <div className="absolute top-6 right-6">
          <button 
            onClick={onDownload}
            className="flex items-center justify-center p-2 rounded-full hover:bg-secondary transition-colors duration-300"
            aria-label="Download image"
          >
            <Download size={20} className="text-muted-foreground hover:text-foreground transition-colors duration-300" />
          </button>
        </div>
        
        <div className="flex items-center justify-center space-x-8 sm:space-x-10 mb-8">
          <span className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-wider animate-fade-in">{firstName}</span>
          
          <div className="heart-container animate-pulse-heart">
            <Heart fill="#dc2626" size={40} className="text-red-600" />
          </div>
          
          <span className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-wider animate-fade-in">{secondName}</span>
        </div>
        
        <div className="text-sm text-muted-foreground tracking-wide animate-subtle-float mt-4">
          © Made for each other
        </div>
      </div>
    );
  }
);

NameDisplay.displayName = "NameDisplay";

export default NameDisplay;
