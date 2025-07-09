import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ExpandableTextProps {
  children: React.ReactNode;
  previewLines?: number;
}

export const ExpandableText: React.FC<ExpandableTextProps> = ({ children, previewLines = 3 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div>
      <div className={`${!isExpanded ? `line-clamp-${previewLines}` : ''}`}>
        {children}
      </div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-2 text-google-red hover:text-google-orange font-medium flex items-center space-x-1 transition-colors"
      >
        <span>{isExpanded ? 'Show Less' : 'Read More'}</span>
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
    </div>
  );
};