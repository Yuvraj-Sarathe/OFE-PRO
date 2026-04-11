import React, { useRef } from 'react';
import { UploadSimple } from '@phosphor-icons/react';
import { parseFile } from '../lib/importUtils';

interface UploadZoneProps {
  onContentParsed: (content: string) => void;
}

export function UploadZone({ onContentParsed }: UploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const content = await parseFile(file);
      onContentParsed(content);
    } catch (error) {
      console.error("Error parsing file:", error);
      alert("Failed to parse file. Please try a different format.");
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept=".txt,.md,.html,.htm,.docx,.pdf"
      />
      <button 
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 px-6 py-3 glass-pill text-white hover:bg-white/10 transition-all active:scale-[0.98]"
      >
        <UploadSimple weight="bold" className="w-5 h-5" />
        Import File
      </button>
    </div>
  );
}
