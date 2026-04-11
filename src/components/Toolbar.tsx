import React, { useRef, useState } from 'react';
import { 
  TextB, TextItalic, TextUnderline, TextStrikethrough,
  TextSubscript, TextSuperscript, Highlighter, Palette,
  ListBullets, ListNumbers, TextAlignLeft, TextAlignCenter, TextAlignRight,
  TextIndent, TextOutdent,
  Link, Image, VideoCamera, Table, Quotes, Eraser, 
  ArrowCounterClockwise, ArrowClockwise,
  Upload, MagnifyingGlass
} from '@phosphor-icons/react';
import { cn } from '../lib/utils';
import { Modal } from './Modal';

interface ToolbarProps {
  execCommand: (command: string, value?: string) => void;
}

export function Toolbar({ execCommand }: ToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const savedSelection = useRef<Range | null>(null);
  
  const [linkModal, setLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  
  const [imageModal, setImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  
  const [videoModal, setVideoModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  
  const [tableModal, setTableModal] = useState(false);
  const [tableRows, setTableRows] = useState('3');
  const [tableCols, setTableCols] = useState('3');
  
  const [findModal, setFindModal] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSelection.current = sel.getRangeAt(0);
    }
  };

  const restoreSelection = () => {
    if (savedSelection.current) {
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(savedSelection.current);
    }
  };

  const handleHeading = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'HEADER') {
      execCommand('insertHTML', '<header style="padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.2); margin-bottom: 1rem; font-size: 0.875rem; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.1em;"><strong>Document Header</strong></header><p><br></p>');
      e.target.value = 'P';
    } else if (val === 'FOOTER') {
      execCommand('insertHTML', '<p><br></p><footer style="padding: 1rem; border-top: 1px solid rgba(255,255,255,0.2); margin-top: 1rem; font-size: 0.875rem; color: #9ca3af; text-align: center;"><strong>Document Footer</strong></footer><p><br></p>');
      e.target.value = 'P';
    } else {
      execCommand('formatBlock', val);
    }
  };

  const handleFontName = (e: React.ChangeEvent<HTMLSelectElement>) => {
    execCommand('fontName', e.target.value);
  };

  const handleFontSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
    execCommand('fontSize', e.target.value);
  };

  const handleLink = () => {
    saveSelection();
    setLinkUrl('');
    setLinkModal(true);
  };

  const submitLink = () => {
    setLinkModal(false);
    if (linkUrl) {
      restoreSelection();
      execCommand('createLink', linkUrl);
    }
  };

  const handleImage = () => {
    saveSelection();
    setImageUrl('');
    setImageModal(true);
  };

  const submitImage = () => {
    setImageModal(false);
    if (imageUrl) {
      restoreSelection();
      execCommand('insertImage', imageUrl);
    }
  };

  const handleVideo = () => {
    saveSelection();
    setVideoUrl('');
    setVideoModal(true);
  };

  const submitVideo = () => {
    setVideoModal(false);
    if (!videoUrl) return;
    
    let embedUrl = videoUrl;
    const youtubeMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (youtubeMatch) {
      embedUrl = `https://www.youtube-nocookie.com/embed/${youtubeMatch[1]}`;
    }
    
    const vimeoMatch = videoUrl.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      embedUrl = `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    
    const html = `<div style="position: relative; padding-bottom: 56.25%; height: 0; margin: 1rem 0; overflow: hidden;"><iframe src="${embedUrl}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div><p><br></p>`;
    restoreSelection();
    execCommand('insertHTML', html);
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (file.type.startsWith('image/')) {
        execCommand('insertImage', dataUrl);
      } else if (file.type.startsWith('video/')) {
        const html = `<video src="${dataUrl}" controls style="max-width: 100%;"></video><p><br></p>`;
        execCommand('insertHTML', html);
      }
    };
    reader.readAsDataURL(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFindReplace = () => {
    setFindText('');
    setReplaceText('');
    setFindModal(true);
  };

  const submitFindReplace = () => {
    setFindModal(false);
    if (!findText) return;

    const editor = document.getElementById('editor-content');
    if (editor) {
      const clone = editor.cloneNode(true) as HTMLElement;
      
      let count = 0;
      const replaceInTextNodes = (node: Node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          if (node.nodeValue && node.nodeValue.includes(findText)) {
            const parts = node.nodeValue.split(findText);
            count += parts.length - 1;
            node.nodeValue = parts.join(replaceText);
          }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          node.childNodes.forEach(child => replaceInTextNodes(child));
        }
      };
      
      replaceInTextNodes(clone);

      if (count > 0) {
        editor.focus();
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(editor);
        selection?.removeAllRanges();
        selection?.addRange(range);
        document.execCommand('insertHTML', false, clone.innerHTML);
      }
    }
  };

  const handleTable = () => {
    saveSelection();
    setTableRows('3');
    setTableCols('3');
    setTableModal(true);
  };

  const submitTable = () => {
    setTableModal(false);
    if (tableRows && tableCols) {
      let html = '<table border="1" style="width:100%; border-collapse: collapse;"><tbody>';
      for (let i = 0; i < parseInt(tableRows); i++) {
        html += '<tr>';
        for (let j = 0; j < parseInt(tableCols); j++) {
          html += '<td style="padding: 8px; border: 1px solid #ccc;">Cell</td>';
        }
        html += '</tr>';
      }
      html += '</tbody></table><p><br></p>';
      restoreSelection();
      execCommand('insertHTML', html);
    }
  };

  const Button = ({ icon: Icon, command, value, title, onClick }: any) => (
    <button
      title={title}
      onClick={onClick || (() => execCommand(command, value))}
      className="p-2 rounded-lg hover:bg-white/10 transition-all active:scale-[0.98] text-gray-300 hover:text-white group"
    >
      <Icon weight="bold" className="w-5 h-5 group-hover:translate-x-[1px] group-hover:-translate-y-[1px] transition-transform" />
    </button>
  );

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 glass-pill mb-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] relative z-30">
      <select 
        onChange={handleFontName} 
        className="bg-transparent text-gray-300 hover:text-white p-2 rounded-lg outline-none cursor-pointer hover:bg-white/10 transition-colors"
        title="Font Family"
      >
        <option value="Plus Jakarta Sans" className="bg-[#1a1a1a]">Plus Jakarta Sans</option>
        <option value="Arial" className="bg-[#1a1a1a]">Arial</option>
        <option value="Courier New" className="bg-[#1a1a1a]">Courier New</option>
        <option value="Georgia" className="bg-[#1a1a1a]">Georgia</option>
        <option value="Times New Roman" className="bg-[#1a1a1a]">Times New Roman</option>
        <option value="Verdana" className="bg-[#1a1a1a]">Verdana</option>
      </select>

      <div className="w-px h-6 bg-white/10 mx-1" />

      <select 
        onChange={handleFontSize} 
        className="bg-transparent text-gray-300 hover:text-white p-2 rounded-lg outline-none cursor-pointer hover:bg-white/10 transition-colors"
        title="Font Size"
      >
        <option value="1" className="bg-[#1a1a1a]">10px</option>
        <option value="2" className="bg-[#1a1a1a]">13px</option>
        <option value="3" className="bg-[#1a1a1a]">16px</option>
        <option value="4" className="bg-[#1a1a1a]">18px</option>
        <option value="5" className="bg-[#1a1a1a]">24px</option>
        <option value="6" className="bg-[#1a1a1a]">32px</option>
        <option value="7" className="bg-[#1a1a1a]">48px</option>
      </select>

      <div className="w-px h-6 bg-white/10 mx-1" />

      <select 
        onChange={handleHeading} 
        defaultValue="P"
        className="bg-transparent text-gray-300 hover:text-white p-2 rounded-lg outline-none cursor-pointer hover:bg-white/10 transition-colors"
        title="Format"
      >
        <option value="P" className="bg-[#1a1a1a]">Body</option>
        <option value="H1" className="bg-[#1a1a1a]">Heading</option>
        <option value="H2" className="bg-[#1a1a1a]">Subheading</option>
        <option value="H3" className="bg-[#1a1a1a]">Heading 3</option>
        <option value="HEADER" className="bg-[#1a1a1a]">Header Block</option>
        <option value="FOOTER" className="bg-[#1a1a1a]">Footer Block</option>
      </select>
      
      <div className="w-px h-6 bg-white/10 mx-1" />
      
      <Button icon={TextB} command="bold" title="Bold" />
      <Button icon={TextItalic} command="italic" title="Italic" />
      <Button icon={TextUnderline} command="underline" title="Underline" />
      <Button icon={TextStrikethrough} command="strikeThrough" title="Strikethrough" />
      <Button icon={TextSubscript} command="subscript" title="Subscript" />
      <Button icon={TextSuperscript} command="superscript" title="Superscript" />
      
      <div className="w-px h-6 bg-white/10 mx-1" />
      
      <Button icon={Highlighter} onClick={() => execCommand('hiliteColor', 'yellow')} title="Highlight" />
      <Button icon={Palette} onClick={() => {
        const color = prompt('Enter text color (e.g. red, #ff0000):', '#10b981');
        if (color) execCommand('foreColor', color);
      }} title="Text Color" />

      <div className="w-px h-6 bg-white/10 mx-1" />
      
      <Button icon={ListBullets} command="insertUnorderedList" title="Bullet List" />
      <Button icon={ListNumbers} command="insertOrderedList" title="Numbered List" />
      
      <div className="w-px h-6 bg-white/10 mx-1" />
      
      <Button icon={TextAlignLeft} command="justifyLeft" title="Align Left" />
      <Button icon={TextAlignCenter} command="justifyCenter" title="Align Center" />
      <Button icon={TextAlignRight} command="justifyRight" title="Align Right" />
      
      <div className="w-px h-6 bg-white/10 mx-1" />
      
      <Button icon={TextIndent} command="indent" title="Indent" />
      <Button icon={TextOutdent} command="outdent" title="Outdent" />
      
      <div className="w-px h-6 bg-white/10 mx-1" />
      
      <Button icon={Link} onClick={handleLink} title="Link" />
      <Button icon={Image} onClick={handleImage} title="Image" />
      <Button icon={VideoCamera} onClick={handleVideo} title="Video URL" />
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleMediaUpload} 
        className="hidden" 
        accept="image/*,video/*,.svg"
      />
      <Button icon={Upload} onClick={() => fileInputRef.current?.click()} title="Upload Media (Local)" />
      <Button icon={Table} onClick={handleTable} title="Table" />
      
      <div className="w-px h-6 bg-white/10 mx-1" />
      
      <Button icon={MagnifyingGlass} onClick={handleFindReplace} title="Find and Replace" />

      <Button icon={Quotes} command="formatBlock" value="BLOCKQUOTE" title="Quote" />
      <Button icon={Eraser} command="removeFormat" title="Clear Formatting" />
      
      <div className="w-px h-6 bg-white/10 mx-1" />
      
      <Button icon={ArrowCounterClockwise} command="undo" title="Undo" />
      <Button icon={ArrowClockwise} command="redo" title="Redo" />

      <Modal isOpen={linkModal} onClose={() => setLinkModal(false)} title="Insert Link">
        <input
          type="url"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submitLink()}
          placeholder="https://example.com"
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 outline-none focus:border-emerald-500 transition-colors"
        />
        <div className="flex gap-2 mt-4">
          <button onClick={() => setLinkModal(false)} className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-colors">Cancel</button>
          <button onClick={submitLink} className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors">Insert</button>
        </div>
      </Modal>

      <Modal isOpen={imageModal} onClose={() => setImageModal(false)} title="Insert Image">
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submitImage()}
          placeholder="https://example.com/image.jpg"
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 outline-none focus:border-emerald-500 transition-colors"
        />
        <div className="flex gap-2 mt-4">
          <button onClick={() => setImageModal(false)} className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-colors">Cancel</button>
          <button onClick={submitImage} className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors">Insert</button>
        </div>
      </Modal>

      <Modal isOpen={videoModal} onClose={() => setVideoModal(false)} title="Insert Video">
        <input
          type="url"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submitVideo()}
          placeholder="YouTube or Vimeo URL"
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 outline-none focus:border-emerald-500 transition-colors"
        />
        <div className="flex gap-2 mt-4">
          <button onClick={() => setVideoModal(false)} className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-colors">Cancel</button>
          <button onClick={submitVideo} className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors">Insert</button>
        </div>
      </Modal>

      <Modal isOpen={tableModal} onClose={() => setTableModal(false)} title="Insert Table">
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Rows</label>
            <input
              type="number"
              min="1"
              value={tableRows}
              onChange={(e) => setTableRows(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Columns</label>
            <input
              type="number"
              min="1"
              value={tableCols}
              onChange={(e) => setTableCols(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submitTable()}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={() => setTableModal(false)} className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-colors">Cancel</button>
          <button onClick={submitTable} className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors">Insert</button>
        </div>
      </Modal>

      <Modal isOpen={findModal} onClose={() => setFindModal(false)} title="Find and Replace">
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Find</label>
            <input
              type="text"
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
              placeholder="Search text..."
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Replace with</label>
            <input
              type="text"
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submitFindReplace()}
              placeholder="Replacement text..."
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={() => setFindModal(false)} className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-colors">Cancel</button>
          <button onClick={submitFindReplace} className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors">Replace All</button>
        </div>
      </Modal>
    </div>
  );
}
