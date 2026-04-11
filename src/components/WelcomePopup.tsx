import React from 'react';
import { createPortal } from 'react-dom';
import { Sparkle, Info } from '@phosphor-icons/react';

interface WelcomePopupProps {
  onClose: () => void;
  onOpenGuide: () => void;
}

export function WelcomePopup({ onClose, onOpenGuide }: WelcomePopupProps) {
  const handleOpenGuide = () => {
    onClose();
    onOpenGuide();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100001] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      <div className="relative w-full max-w-md double-bezel animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="double-bezel-inner p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Sparkle weight="fill" className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">Welcome to OFE PRO!</h2>
          <p className="text-gray-400 mb-6 leading-relaxed">
            Your universal text editor for creating, editing, and exporting documents with ease.
          </p>
          
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <div className="flex items-center gap-3 text-emerald-100">
              <Info weight="fill" className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm text-left">
                New here? Click the <strong>Guide button</strong> (info icon) in the top right to learn how to use all features!
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-lg transition-colors font-medium"
            >
              Start Writing
            </button>
            <button
              onClick={handleOpenGuide}
              className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors font-medium shadow-lg shadow-emerald-500/20"
            >
              Open Guide
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
