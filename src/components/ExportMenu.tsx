import React, { useState } from 'react';
import { DownloadSimple, FileHtml, FilePdf, FileText, FileDoc, MarkdownLogo } from '@phosphor-icons/react';
import { exportToHTML, exportToPDF, exportToMarkdown, exportToDOCX, exportToPlainText } from '../lib/exportUtils';
import { cn } from '../lib/utils';

interface ExportMenuProps {
  content: string;
}

export function ExportMenu({ content }: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleExport = async (type: 'html' | 'pdf' | 'md' | 'docx' | 'txt') => {
    setIsOpen(false);
    switch (type) {
      case 'html': exportToHTML(content); break;
      case 'pdf': exportToPDF(); break;
      case 'md': exportToMarkdown(content); break;
      case 'docx': await exportToDOCX(content); break;
      case 'txt': exportToPlainText(content); break;
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-medium transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(16,185,129,0.2)]"
      >
        <DownloadSimple weight="bold" className="w-5 h-5" />
        Export
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 double-bezel z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="double-bezel-inner py-2 flex flex-col">
            <button onClick={() => handleExport('html')} className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 text-gray-300 hover:text-white transition-colors text-left">
              <FileHtml className="w-5 h-5 text-emerald-500" /> HTML Document
            </button>
            <button onClick={() => handleExport('md')} className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 text-gray-300 hover:text-white transition-colors text-left">
              <MarkdownLogo className="w-5 h-5 text-emerald-500" /> Markdown
            </button>
            <button onClick={() => handleExport('docx')} className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 text-gray-300 hover:text-white transition-colors text-left">
              <FileDoc className="w-5 h-5 text-emerald-500" /> Word (DOCX)
            </button>
            <button onClick={() => handleExport('pdf')} className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 text-gray-300 hover:text-white transition-colors text-left">
              <FilePdf className="w-5 h-5 text-emerald-500" /> PDF Document
            </button>
            <button onClick={() => handleExport('txt')} className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 text-gray-300 hover:text-white transition-colors text-left">
              <FileText className="w-5 h-5 text-emerald-500" /> Plain Text
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
