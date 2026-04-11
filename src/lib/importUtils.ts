import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set worker for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export const parseFile = async (file: File): Promise<string> => {
  const extension = file.name.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'html':
    case 'htm':
      return await file.text();
    case 'txt':
    case 'md': {
      const text = await file.text();
      // Basic conversion of line breaks to paragraphs for editor
      return text.split('\n\n').map(p => `<p>${p.replace(/\n/g, '<br/>')}</p>`).join('');
    }
    case 'docx': {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      return result.value;
    }
    case 'pdf': {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let html = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const strings = textContent.items.map((item: any) => item.str);
        html += `<p>${strings.join(' ')}</p>`;
      }
      return html;
    }
    default:
      throw new Error('Unsupported file format');
  }
};
