import React, { useRef } from 'react';
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

interface ToolbarProps {
  execCommand: (command: string, value?: string) => void;
}

export function Toolbar({ execCommand }: ToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    const url = prompt('Enter link URL:');
    if (url) execCommand('createLink', url);
  };

  const handleImage = () => {
    const url = prompt('Enter image URL:');
    if (url) execCommand('insertImage', url);
  };

  const handleVideo = () => {
    const url = prompt('Enter YouTube/Vimeo embed URL:');
    if (url) {
      const html = `<iframe width="560" height="315" src="${url}" frameborder="0" allowfullscreen></iframe>`;
      execCommand('insertHTML', html);
    }
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
    const search = prompt('Find:');
    if (!search) return;
    const replace = prompt(`Replace "${search}" with:`);
    if (replace === null) return;

    const editor = document.getElementById('editor-content');
    if (editor) {
      // Clone the editor to manipulate safely
      const clone = editor.cloneNode(true) as HTMLElement;
      
      let count = 0;
      const replaceInTextNodes = (node: Node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          if (node.nodeValue && node.nodeValue.includes(search)) {
            const parts = node.nodeValue.split(search);
            count += parts.length - 1;
            node.nodeValue = parts.join(replace);
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
        
        // This registers as a single undoable action
        document.execCommand('insertHTML', false, clone.innerHTML);
      } else {
        alert('No occurrences found.');
      }
    }
  };

  const handleTable = () => {
    const rows = prompt('Number of rows?', '3');
    const cols = prompt('Number of columns?', '3');
    if (rows && cols) {
      let html = '<table border="1" style="width:100%; border-collapse: collapse;"><tbody>';
      for (let i = 0; i < parseInt(rows); i++) {
        html += '<tr>';
        for (let j = 0; j < parseInt(cols); j++) {
          html += '<td style="padding: 8px; border: 1px solid #ccc;">Cell</td>';
        }
        html += '</tr>';
      }
      html += '</tbody></table><p><br></p>';
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
    <div className="flex flex-wrap items-center gap-1 p-2 glass-pill mb-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]">
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
    </div>
  );
}
