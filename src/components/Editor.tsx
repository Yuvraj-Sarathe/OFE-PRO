import React, { useRef, useEffect } from 'react';
import { cn } from '../lib/utils';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  className?: string;
}

export function Editor({ content, onChange, className }: EditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className={cn("double-bezel h-full flex flex-col", className)}>
      <div className="double-bezel-inner flex-1 p-6 overflow-y-auto">
        <div
          id="editor-content"
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          className="prose prose-invert max-w-none min-h-full outline-none"
          placeholder="Start typing or upload a file..."
        />
      </div>
    </div>
  );
}
