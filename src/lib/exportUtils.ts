import { saveAs } from 'file-saver';
import TurndownService from 'turndown';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

export const exportToPDF = async (content: string, filename: string = 'document.pdf') => {
  // Create a temporary container for rendering
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '210mm'; // A4 width
  container.style.padding = '20mm';
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#000000';
  container.style.fontFamily = 'Arial, sans-serif';
  container.style.fontSize = '12pt';
  container.style.lineHeight = '1.6';
  
  // Apply content with proper styling
  container.innerHTML = `
    <div style="max-width: 100%; word-wrap: break-word;">
      ${content}
    </div>
  `;
  
  // Apply styles to make it look good in PDF
  const style = document.createElement('style');
  style.textContent = `
    h1, h2, h3, h4, h5, h6 { color: #000; margin-top: 1em; margin-bottom: 0.5em; font-weight: bold; }
    h1 { font-size: 24pt; }
    h2 { font-size: 20pt; }
    h3 { font-size: 16pt; }
    p { margin: 0.5em 0; color: #000; }
    ul, ol { margin: 0.5em 0; padding-left: 2em; }
    li { margin: 0.25em 0; }
    blockquote { border-left: 4px solid #059669; padding-left: 1em; margin: 1em 0; font-style: italic; }
    a { color: #059669; text-decoration: underline; }
    img { max-width: 100%; height: auto; margin: 1em 0; }
    table { width: 100%; border-collapse: collapse; margin: 1em 0; }
    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
    strong { font-weight: bold; }
    em { font-style: italic; }
  `;
  container.appendChild(style);
  
  document.body.appendChild(container);
  
  try {
    // Capture the content as canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
    });
    
    // Calculate PDF dimensions (A4: 210mm x 297mm)
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    let position = 0;
    
    // Add image to PDF
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    // Add new pages if content is longer than one page
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    // Save the PDF
    pdf.save(filename);
  } catch (error) {
    console.error('PDF generation failed:', error);
    alert('Failed to generate PDF. Please try again.');
  } finally {
    // Clean up
    document.body.removeChild(container);
  }
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
