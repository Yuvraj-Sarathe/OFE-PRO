import { saveAs } from 'file-saver';
import TurndownService from 'turndown';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { jsPDF } from 'jspdf';

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

export const exportToPDF = (content: string, filename: string = 'document.pdf') => {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const ML = 20, MR = 20, MT = 20, MB = 25;
  const PW = 210, PH = 297;
  const TW = PW - ML - MR; // usable text width: 170mm

  let y = MT;

  const newPage = () => { pdf.addPage(); y = MT; };
  const lh = (size: number) => size * 0.352778 * 1.55; // pt → mm with line spacing
  const gap = (mm: number) => { y += mm; };

  const writeLines = (text: string, size: number, style: string, indent = 0) => {
    if (!text.trim()) return;
    pdf.setFontSize(size);
    pdf.setFont('helvetica', style);
    const lineH = lh(size);
    const lines: string[] = pdf.splitTextToSize(text, TW - indent);
    for (const line of lines) {
      if (y + lineH > PH - MB) newPage();
      pdf.text(line, ML + indent, y);
      y += lineH;
    }
  };

  const dom = new DOMParser().parseFromString(content, 'text/html');

  const walk = (node: Element) => {
    const tag = node.tagName?.toLowerCase();
    const txt = (node.textContent || '').trim();

    switch (tag) {
      case 'h1': gap(4); writeLines(txt, 22, 'bold'); gap(3); break;
      case 'h2': gap(3); writeLines(txt, 16, 'bold'); gap(2); break;
      case 'h3': gap(2); writeLines(txt, 13, 'bold'); gap(2); break;
      case 'h4': gap(1); writeLines(txt, 11, 'bold'); gap(1); break;
      case 'h5': case 'h6': writeLines(txt, 10, 'bold'); gap(1); break;

      case 'p':
        if (txt) { writeLines(txt, 11, 'normal'); gap(2); }
        break;

      case 'blockquote': {
        const lineH = lh(11);
        const lines: string[] = pdf.splitTextToSize(txt, TW - 7);
        const blockH = lines.length * lineH + 2;
        if (y + blockH > PH - MB) newPage();
        // draw emerald left border
        pdf.setDrawColor(5, 150, 105);
        pdf.setLineWidth(1);
        pdf.line(ML, y - lineH + 2, ML, y - lineH + 2 + blockH);
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'italic');
        for (const line of lines) {
          if (y + lineH > PH - MB) newPage();
          pdf.text(line, ML + 5, y);
          y += lineH;
        }
        gap(3);
        break;
      }

      case 'ul': case 'ol': {
        const items = Array.from(node.children).filter(
          c => c.tagName?.toLowerCase() === 'li'
        );
        items.forEach((li, i) => {
          const bullet = tag === 'ol' ? `${i + 1}.` : '•';
          const liTxt = (li.textContent || '').trim();
          const lineH = lh(11);
          pdf.setFontSize(11);
          pdf.setFont('helvetica', 'normal');
          const lines: string[] = pdf.splitTextToSize(liTxt, TW - 9);
          lines.forEach((line, j) => {
            if (y + lineH > PH - MB) newPage();
            if (j === 0) pdf.text(bullet, ML + 2, y);
            pdf.text(line, ML + 8, y);
            y += lineH;
          });
        });
        gap(2);
        break;
      }

      case 'hr': {
        gap(2);
        if (y > PH - MB) newPage();
        pdf.setDrawColor(200, 200, 200);
        pdf.setLineWidth(0.3);
        pdf.line(ML, y, PW - MR, y);
        gap(3);
        break;
      }

      case 'table': {
        const rows = Array.from(node.querySelectorAll('tr'));
        const colCount = Math.max(...rows.map(r => r.querySelectorAll('th, td').length));
        const cw = TW / colCount;
        const rh = 7;
        for (const row of rows) {
          const cells = Array.from(row.querySelectorAll('th, td'));
          if (y + rh > PH - MB) newPage();
          const isHeader = cells[0]?.tagName.toLowerCase() === 'th';
          pdf.setFont('helvetica', isHeader ? 'bold' : 'normal');
          pdf.setFontSize(9);
          if (isHeader) {
            pdf.setFillColor(240, 240, 240);
            pdf.rect(ML, y - 5, TW, rh, 'F');
          }
          cells.forEach((cell, ci) => {
            const cx = ML + ci * cw;
            pdf.setDrawColor(180, 180, 180);
            pdf.setLineWidth(0.2);
            pdf.rect(cx, y - 5, cw, rh);
            const ct = pdf.splitTextToSize((cell.textContent || '').trim(), cw - 3)[0] ?? '';
            pdf.text(ct, cx + 2, y);
          });
          y += rh;
        }
        gap(3);
        break;
      }

      default: {
        // div, section, header, footer, article etc — recurse into children
        const blockTags = new Set(['p','h1','h2','h3','h4','h5','h6',
          'ul','ol','blockquote','table','hr','div','section','article','header','footer','main']);
        const hasBlockKids = Array.from(node.children)
          .some(c => blockTags.has(c.tagName?.toLowerCase()));

        if (hasBlockKids) {
          Array.from(node.children).forEach(c => walk(c as Element));
        } else if (txt) {
          writeLines(txt, 11, 'normal');
          gap(2);
        }
        break;
      }
    }
  };

  Array.from(dom.body.children).forEach(c => walk(c as Element));
  pdf.save(filename);
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
