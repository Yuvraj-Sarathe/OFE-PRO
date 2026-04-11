import React from 'react';
import { X, Lightbulb, Keyboard, FileText, Export, Gear, RocketLaunch, PencilLine, Eye, MagnifyingGlass } from '@phosphor-icons/react';
import { cn } from '../lib/utils';

interface GuideModalProps {
  onClose: () => void;
  autoSaveEnabled: boolean;
  onToggleAutoSave: (enabled: boolean) => void;
}

export function GuideModal({ onClose, autoSaveEnabled, onToggleAutoSave }: GuideModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="double-bezel w-full max-w-2xl animate-in zoom-in-95 duration-200">
        <div className="double-bezel-inner bg-[#0a0a0a] flex flex-col max-h-[85vh]">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                <Lightbulb weight="duotone" className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-white">OFE PRO Guide & Tips</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X weight="bold" className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto space-y-8">
            
            <section>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-3">
                <RocketLaunch className="w-5 h-5 text-emerald-500" />
                Getting Started
              </h3>
              <div className="space-y-3 text-gray-400 leading-relaxed">
                <p>
                  Welcome to <strong className="text-white">OFE PRO</strong> - your universal text editor! Here's how to get started:
                </p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li><strong className="text-gray-300">Start Typing:</strong> Click in the editor area and begin writing your document.</li>
                  <li><strong className="text-gray-300">Format Text:</strong> Use the toolbar above the editor to apply bold, italic, headings, lists, and more.</li>
                  <li><strong className="text-gray-300">Switch Views:</strong> Use the view mode buttons (square icons) in the header to toggle between Editor, Split, or Preview mode.</li>
                  <li><strong className="text-gray-300">Import Files:</strong> Click "Import File" to load existing documents (.docx, .pdf, .md, .txt, .html).</li>
                  <li><strong className="text-gray-300">Export:</strong> When done, click "Export" to save in your preferred format.</li>
                </ol>
              </div>
            </section>

            <section>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-3">
                <PencilLine className="w-5 h-5 text-emerald-500" />
                Toolbar Features
              </h3>
              <div className="space-y-3 text-gray-400 leading-relaxed">
                <p>The toolbar provides comprehensive formatting options:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-white font-medium mb-1">Text Formatting</div>
                    <div className="text-sm">Bold, Italic, Underline, Strikethrough, Subscript, Superscript, Highlight, Text Color</div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-white font-medium mb-1">Paragraph Styles</div>
                    <div className="text-sm">Headings (H1-H3), Body text, Header/Footer blocks, Blockquotes</div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-white font-medium mb-1">Lists & Alignment</div>
                    <div className="text-sm">Bullet lists, Numbered lists, Left/Center/Right align, Indent/Outdent</div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-white font-medium mb-1">Media & Links</div>
                    <div className="text-sm">Insert links, images (URL or upload), videos (YouTube/Vimeo), tables</div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-3">
                <Eye className="w-5 h-5 text-emerald-500" />
                View Modes
              </h3>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                  <div className="text-2xl">📝</div>
                  <div>
                    <div className="text-white font-medium">Editor Only</div>
                    <div className="text-sm">Focus on writing without distractions. Perfect for drafting content.</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                  <div className="text-2xl">⚡</div>
                  <div>
                    <div className="text-white font-medium">Split View (Recommended)</div>
                    <div className="text-sm">See your formatted content in real-time as you type. Best for most users.</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                  <div className="text-2xl">👁️</div>
                  <div>
                    <div className="text-white font-medium">Preview Only</div>
                    <div className="text-sm">View the final formatted output. Great for reviewing before export.</div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-3">
                <MagnifyingGlass className="w-5 h-5 text-emerald-500" />
                Pro Tips
              </h3>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">•</span>
                  <p><strong className="text-gray-300">Hide Toolbar:</strong> Click the eye icon to hide/show the toolbar for a cleaner workspace.</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">•</span>
                  <p><strong className="text-gray-300">Keyboard Shortcuts:</strong> Use standard shortcuts like Ctrl+B (bold), Ctrl+I (italic), Ctrl+Z (undo).</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">•</span>
                  <p><strong className="text-gray-300">Custom Dialogs:</strong> All popups (link, image, video, table, find/replace) support Enter to submit and Esc to cancel.</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">•</span>
                  <p><strong className="text-gray-300">Video Embeds:</strong> Paste YouTube or Vimeo URLs and they'll automatically convert to embedded players.</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">•</span>
                  <p><strong className="text-gray-300">Local Storage:</strong> Your work is saved locally in your browser. Clear browser data will delete saved content.</p>
                </div>
              </div>
            </section>
            
            <section>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-3">
                <Gear className="w-5 h-5 text-emerald-500" />
                Settings
              </h3>
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                <div>
                  <div className="text-white font-medium">Auto-Save</div>
                  <div className="text-sm text-gray-400">Periodically save your document to local storage.</div>
                </div>
                <button 
                  onClick={() => onToggleAutoSave(!autoSaveEnabled)}
                  className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
                    autoSaveEnabled ? "bg-emerald-500" : "bg-gray-600"
                  )}
                >
                  <span className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                    autoSaveEnabled ? "translate-x-6" : "translate-x-1"
                  )} />
                </button>
              </div>
            </section>

            <section>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-3">
                <FileText className="w-5 h-5 text-emerald-500" />
                Importing Files
              </h3>
              <p className="text-gray-400 leading-relaxed mb-3">
                OFE PRO supports multiple file formats. Click the <strong>"Import File"</strong> button to load:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-400">
                <li><strong className="text-gray-300">.docx</strong> - Microsoft Word documents (preserves text and basic formatting).</li>
                <li><strong className="text-gray-300">.pdf</strong> - Extracts text from PDF files.</li>
                <li><strong className="text-gray-300">.md / .txt</strong> - Plain text and Markdown files.</li>
                <li><strong className="text-gray-300">.html</strong> - Web pages and HTML snippets.</li>
              </ul>
            </section>

            <section>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-3">
                <Keyboard className="w-5 h-5 text-emerald-500" />
                Editing & Media
              </h3>
              <p className="text-gray-400 leading-relaxed mb-3">
                The toolbar provides a rich set of formatting options.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-400">
                <li><strong>Local Media:</strong> Use the <strong className="text-gray-300">Upload Media</strong> button to insert images, GIFs, SVGs, or videos directly from your device. They are embedded as base64 data.</li>
                <li><strong>Find & Replace:</strong> Click the magnifying glass icon to quickly find and replace text within your document.</li>
                <li><strong>View Modes:</strong> Toggle between Editor Only, Split View, and Preview Only using the icons in the top right.</li>
              </ul>
            </section>

            <section>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-3">
                <Export className="w-5 h-5 text-emerald-500" />
                Exporting Your Work
              </h3>
              <p className="text-gray-400 leading-relaxed mb-3">
                When you're finished, click <strong>"Export"</strong> to save your document in various formats:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-400">
                <li><strong className="text-gray-300">HTML</strong> - Saves the raw HTML of your document.</li>
                <li><strong className="text-gray-300">Markdown</strong> - Converts your rich text into clean Markdown (.md).</li>
                <li><strong className="text-gray-300">Word (DOCX)</strong> - Generates a Microsoft Word document.</li>
                <li><strong className="text-gray-300">PDF</strong> - Opens the print dialog optimized for saving as PDF.</li>
                <li><strong className="text-gray-300">Plain Text</strong> - Strips all formatting and saves as .txt.</li>
              </ul>
            </section>

            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-100/80 text-sm leading-relaxed">
              <strong>Pro Tip:</strong> OFE PRO runs entirely in your browser. No data is sent to any server, ensuring complete privacy for your documents.
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
