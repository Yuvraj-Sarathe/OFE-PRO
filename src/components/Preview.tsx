import React from 'react';
import { cn } from '../lib/utils';

interface PreviewProps {
  content: string;
  className?: string;
}

export function Preview({ content, className }: PreviewProps) {
  return (
    <div className={cn("double-bezel h-full flex flex-col", className)}>
      <div className="double-bezel-inner flex-1 p-6 overflow-y-auto bg-[#0a0a0a]">
        <div 
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: content || '<p class="text-gray-600 italic">Preview will appear here...</p>' }}
        />
      </div>
    </div>
  );
}
