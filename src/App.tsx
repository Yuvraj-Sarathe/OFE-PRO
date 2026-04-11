import React, { useState, useEffect } from 'react';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { Toolbar } from './components/Toolbar';
import { ExportMenu } from './components/ExportMenu';
import { UploadZone } from './components/UploadZone';
import { GuideModal } from './components/GuideModal';
import { FileText, Columns, SquareHalf, Square, Info, EyeSlash, Eye } from '@phosphor-icons/react';
import { cn } from './lib/utils';

type ViewMode = 'editor' | 'preview' | 'split';

export default function App() {
  const [content, setContent] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [isMounted, setIsMounted] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [showToolbar, setShowToolbar] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    
    // Load initial state from local storage
    const savedContent = localStorage.getItem('ofe_pro_content');
    if (savedContent) {
      setContent(savedContent);
    }
    
    const savedAutoSave = localStorage.getItem('ofe_pro_autosave');
    if (savedAutoSave !== null) {
      setAutoSaveEnabled(savedAutoSave === 'true');
    }
  }, []);

  // Auto-save effect
  useEffect(() => {
    if (!isMounted) return;
    
    if (autoSaveEnabled) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem('ofe_pro_content', content);
      }, 1000); // 1 second debounce
      return () => clearTimeout(timeoutId);
    }
  }, [content, autoSaveEnabled, isMounted]);

  const handleToggleAutoSave = (enabled: boolean) => {
    setAutoSaveEnabled(enabled);
    localStorage.setItem('ofe_pro_autosave', String(enabled));
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col p-4 md:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <header className={cn(
        "flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 no-print transition-all duration-700 ease-out",
        isMounted ? "translate-y-0 opacity-100 blur-0" : "-translate-y-4 opacity-0 blur-sm"
      )}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
            <FileText weight="duotone" className="w-7 h-7 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">OFE PRO</h1>
            <p className="text-sm text-gray-400 font-medium tracking-wide uppercase">Universal Text Editor</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto relative z-50">
          <button 
            onClick={() => setShowGuide(true)}
            className="p-2 rounded-full text-gray-400 hover:text-white transition-colors hover:bg-white/10"
            title="Guide & Tips"
          >
            <Info weight="bold" className="w-6 h-6" />
          </button>

          {(viewMode === 'editor' || viewMode === 'split') && (
            <button 
              onClick={() => setShowToolbar(!showToolbar)}
              className="p-2 rounded-full text-gray-400 hover:text-white transition-colors hover:bg-white/10"
              title={showToolbar ? "Hide Toolbar" : "Show Toolbar"}
            >
              {showToolbar ? <EyeSlash weight="bold" className="w-6 h-6" /> : <Eye weight="bold" className="w-6 h-6" />}
            </button>
          )}

          <div className="flex items-center p-1 glass-pill mr-auto md:mr-4">
            <button 
              onClick={() => setViewMode('editor')}
              className={cn("p-2 rounded-full transition-all", viewMode === 'editor' ? "bg-white/10 text-white" : "text-gray-400 hover:text-white")}
              title="Editor Only"
            >
              <Square weight={viewMode === 'editor' ? "fill" : "regular"} className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setViewMode('split')}
              className={cn("p-2 rounded-full transition-all", viewMode === 'split' ? "bg-white/10 text-white" : "text-gray-400 hover:text-white")}
              title="Split View"
            >
              <Columns weight={viewMode === 'split' ? "fill" : "regular"} className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setViewMode('preview')}
              className={cn("p-2 rounded-full transition-all", viewMode === 'preview' ? "bg-white/10 text-white" : "text-gray-400 hover:text-white")}
              title="Preview Only"
            >
              <SquareHalf weight={viewMode === 'preview' ? "fill" : "regular"} className="w-5 h-5" />
            </button>
          </div>
          
          <UploadZone onContentParsed={setContent} />
          <ExportMenu content={content} />
        </div>
      </header>

      {/* Main Content Area */}
      <main className={cn(
        "flex-1 flex flex-col no-print transition-all duration-700 delay-150 ease-out",
        isMounted ? "translate-y-0 opacity-100 blur-0" : "translate-y-8 opacity-0 blur-sm"
      )}>
        {(viewMode === 'editor' || viewMode === 'split') && showToolbar && (
          <Toolbar execCommand={execCommand} />
        )}

        <div className={cn(
          "flex-1 grid gap-6",
          viewMode === 'split' ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
        )}>
          {(viewMode === 'editor' || viewMode === 'split') && (
            <Editor 
              content={content} 
              onChange={setContent} 
              className="min-h-[500px]"
            />
          )}
          
          {(viewMode === 'preview' || viewMode === 'split') && (
            <Preview 
              content={content} 
              className="min-h-[500px]"
            />
          )}
        </div>
      </main>

      {/* Print View (Only visible when printing) */}
      <div className="hidden print-only">
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
      </div>

      {showGuide && (
        <GuideModal 
          onClose={() => setShowGuide(false)} 
          autoSaveEnabled={autoSaveEnabled}
          onToggleAutoSave={handleToggleAutoSave}
        />
      )}
    </div>
  );
}
