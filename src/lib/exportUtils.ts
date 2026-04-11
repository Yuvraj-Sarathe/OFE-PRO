import { saveAs } from 'file-saver';
import TurndownService from 'turndown';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

export const exportToHTML = (content: string, filename: string = 'document.html') => {
  const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
  saveAs(blob, filename);
};

export const exportToPlainText = (content: string, filename: string = 'document.txt') => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;
  const text = tempDiv.innerText || tempDiv.textContent || '';
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, filename);
};

export const exportToMarkdown = (content: string, filename: string = 'document.md') => {
  const turndownService = new TurndownService({ headingStyle: 'atx' });
  const markdown = turndownService.turndown(content);
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  saveAs(blob, filename);
};

export const exportToPDF = () => {
  window.print();
};

export const exportToDOCX = async (content: string, filename: string = 'document.docx') => {
  // A robust HTML to DOCX requires parsing the HTML.
  // For simplicity in this client-side app, we'll do a basic conversion.
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;
  
  const children = Array.from(tempDiv.childNodes);
  const docxChildren: any[] = [];

  children.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const text = el.innerText || el.textContent || '';
      if (!text.trim()) return;

      if (el.tagName.match(/^H[1-6]$/)) {
        const level = parseInt(el.tagName[1], 10);
        let headingLevel = HeadingLevel.HEADING_1;
        switch(level) {
          case 1: headingLevel = HeadingLevel.HEADING_1; break;
          case 2: headingLevel = HeadingLevel.HEADING_2; break;
          case 3: headingLevel = HeadingLevel.HEADING_3; break;
          case 4: headingLevel = HeadingLevel.HEADING_4; break;
          case 5: headingLevel = HeadingLevel.HEADING_5; break;
          case 6: headingLevel = HeadingLevel.HEADING_6; break;
        }
        docxChildren.push(new Paragraph({ text, heading: headingLevel }));
      } else {
        docxChildren.push(new Paragraph({
          children: [new TextRun(text)]
        }));
      }
    } else if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      if (text.trim()) {
        docxChildren.push(new Paragraph({
          children: [new TextRun(text)]
        }));
      }
    }
  });

  const doc = new Document({
    sections: [{
      properties: {},
      children: docxChildren.length > 0 ? docxChildren : [new Paragraph({ text: "Empty Document" })]
    }]
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
};
