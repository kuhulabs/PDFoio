// Document format conversions: PDF ↔ Word/Excel/PPT/TXT/JSON, plus
// images-to-PDF, Word-to-PDF, Excel-to-PDF. Heavy libraries (mammoth,
// xlsx, pptxgenjs, jszip, pdf-lib, pdfjs) are all loaded lazily.
import { loadPdfLib } from './pdf-utils-common';
import { getPdfjsLib } from './pdfjs-loader';
import type {
  DocumentConversionOptions,
  ImageToPDFOptions,
} from './pdf-utils-common';

// Convert PDF to Word document using enhanced text extraction
export async function convertPDFToWord(
  file: File,
  _options: DocumentConversionOptions = {}
): Promise<Blob> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await (await getPdfjsLib()).getDocument({ data: arrayBuffer }).promise;

    let textContent = '';
    let htmlContent = '<html><head><meta charset="utf-8"><title>Converted from PDF</title></head><body>';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();

      const pageItems = content.items.map((item: any) => ({
        text: item.str,
        x: Math.round(item.transform[4]),
        y: Math.round(item.transform[5]),
        width: item.width,
        height: item.height,
      }));

      pageItems.sort((a: any, b: any) => {
        const yDiff = b.y - a.y;
        if (Math.abs(yDiff) > 5) return yDiff;
        return a.x - b.x;
      });

      let currentLine = '';
      let lastY = null;

      for (const item of pageItems) {
        if (lastY !== null && Math.abs(item.y - lastY) > 5) {
          if (currentLine.trim()) {
            textContent += currentLine.trim() + '\n';
            htmlContent += `<p>${currentLine.trim()}</p>`;
          }
          currentLine = item.text;
        } else {
          currentLine += (currentLine && item.text ? ' ' : '') + item.text;
        }
        lastY = item.y;
      }

      if (currentLine.trim()) {
        textContent += currentLine.trim() + '\n';
        htmlContent += `<p>${currentLine.trim()}</p>`;
      }

      if (pageNum < pdf.numPages) {
        textContent += '\n--- Page Break ---\n\n';
        htmlContent += '<div style="page-break-before: always;"></div>';
      }
    }

    htmlContent += '</body></html>';

    // mammoth import preserved (matches original side-effect behavior even though only used for the dynamic import cost)
    await import('mammoth');

    const docxTemplate = `
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${htmlContent.split('\n').map(line =>
      line.trim() ? `<w:p><w:r><w:t>${line.trim()}</w:t></w:r></w:p>` : '<w:p></w:p>'
    ).join('')}
  </w:body>
</w:document>`;

    const JSZip = await import('jszip');
    const zip = new JSZip.default();

    zip.file('word/document.xml', docxTemplate);

    zip.file('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`);

    zip.file('_rels/.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`);

    zip.file('word/_rels/document.xml.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
</Relationships>`);

    const docxBlob = await zip.generateAsync({
      type: 'blob',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    return docxBlob;
  } catch {
    throw new Error('Failed to convert PDF to Word document');
  }
}

// Convert PDF to Excel using XLSX library
export async function convertPDFToExcel(
  file: File,
  options: DocumentConversionOptions = {}
): Promise<Blob> {
  try {
    const XLSX = await import('xlsx');

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await (await getPdfjsLib()).getDocument({ data: arrayBuffer }).promise;

    const workbook = XLSX.utils.book_new();
    const worksheetData: any[][] = [];

    worksheetData.push(['Page', 'Line', 'Text', 'X Position', 'Y Position']);

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();

      if (options.autoDetectTables) {
        const pageItems = content.items.map((item: any) => ({
          text: item.str.trim(),
          x: Math.round(item.transform[4]),
          y: Math.round(item.transform[5]),
          width: item.width,
          height: item.height,
        })).filter((item: any) => item.text);

        const rows: { [key: number]: any[] } = {};
        pageItems.forEach((item: any) => {
          const yKey = Math.round(item.y / 5) * 5;
          if (!rows[yKey]) rows[yKey] = [];
          rows[yKey].push(item);
        });

        Object.keys(rows)
          .map(Number)
          .sort((a, b) => b - a)
          .forEach((yPos, lineIndex) => {
            const rowItems = rows[yPos].sort((a, b) => a.x - b.x);
            const rowText = rowItems.map(item => item.text).join(' ');

            if (rowItems.length > 1) {
              const cellData = rowItems.map(item => item.text);
              worksheetData.push([pageNum, lineIndex + 1, ...cellData]);
            } else {
              worksheetData.push([pageNum, lineIndex + 1, rowText, rowItems[0]?.x || '', rowItems[0]?.y || '']);
            }
          });
      } else {
        const pageText = content.items
          .map((item: any) => item.str)
          .join(' ');

        const lines = pageText.split(/\n+/).filter((line: string) => line.trim());
        lines.forEach((line: string, lineIndex: number) => {
          worksheetData.push([pageNum, lineIndex + 1, line.trim()]);
        });
      }
    }

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    const colWidths = worksheetData[0].map((_, colIndex) => {
      const maxLength = Math.max(
        ...worksheetData.map(row => String(row[colIndex] || '').length)
      );
      return { wch: Math.min(maxLength + 2, 50) };
    });
    worksheet['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Extracted Data');

    const metadataSheet = XLSX.utils.aoa_to_sheet([
      ['Property', 'Value'],
      ['Source File', file.name],
      ['Total Pages', pdf.numPages],
      ['Conversion Date', new Date().toISOString()],
      ['Table Detection', options.autoDetectTables ? 'Enabled' : 'Disabled'],
    ]);
    XLSX.utils.book_append_sheet(workbook, metadataSheet, 'Metadata');

    const excelBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });

    return new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
  } catch {
    throw new Error('Failed to convert PDF to Excel');
  }
}

// Convert PDF to PowerPoint using pptxgenjs
export async function convertPDFToPPT(file: File): Promise<Blob> {
  try {
    const PptxGenJS = await import('pptxgenjs');
    const pptx = new PptxGenJS.default();

    pptx.author = 'PDFo Converter';
    pptx.company = 'PDFo';
    pptx.title = `Converted from ${file.name}`;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await (await getPdfjsLib()).getDocument({ data: arrayBuffer }).promise;

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();

      const pageItems = content.items.map((item: any) => ({
        text: item.str.trim(),
        x: Math.round(item.transform[4]),
        y: Math.round(item.transform[5]),
        fontSize: item.height || 12,
      })).filter((item: any) => item.text);

      const lines: { [key: number]: any[] } = {};
      pageItems.forEach((item: any) => {
        const yKey = Math.round(item.y / 10) * 10;
        if (!lines[yKey]) lines[yKey] = [];
        lines[yKey].push(item);
      });

      const sortedLines = Object.keys(lines)
        .map(Number)
        .sort((a, b) => b - a)
        .map(yPos => {
          const lineItems = lines[yPos].sort((a, b) => a.x - b.x);
          return {
            text: lineItems.map(item => item.text).join(' '),
            fontSize: Math.max(...lineItems.map(item => item.fontSize)),
          };
        })
        .filter(line => line.text.trim());

      const slide = pptx.addSlide();

      let titleText = `Page ${pageNum}`;
      let contentLines = sortedLines;

      if (sortedLines.length > 0) {
        const firstLine = sortedLines[0];
        if (firstLine.text.length < 60 || firstLine.fontSize > 14) {
          titleText = firstLine.text;
          contentLines = sortedLines.slice(1);
        }
      }

      slide.addText(titleText, {
        x: 0.5, y: 0.5, w: 9, h: 1,
        fontSize: 24, bold: true, color: '2F4F4F',
      });

      if (contentLines.length > 0) {
        const contentText = contentLines
          .map(line => line.text)
          .join('\n')
          .substring(0, 800);

        slide.addText(contentText, {
          x: 0.5, y: 2, w: 9, h: 5,
          fontSize: 14, color: '333333', valign: 'top',
        });
      }

      slide.addText(`Source: ${file.name} | Page ${pageNum}`, {
        x: 0.5, y: 7, w: 9, h: 0.3,
        fontSize: 10, color: '666666', align: 'center',
      });
    }

    const pptBuffer = (await pptx.write({ outputType: 'arraybuffer' })) as ArrayBuffer;

    return new Blob([pptBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    });
  } catch {
    throw new Error('Failed to convert PDF to PowerPoint');
  }
}

// Convert PDF to plain text
export async function convertPDFToTXT(
  file: File,
  options: DocumentConversionOptions = {}
): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await (await getPdfjsLib()).getDocument({ data: arrayBuffer }).promise;

  let textContent = '';
  const lineEnding = options.lineEndingStyle === 'windows' ? '\r\n' :
                     options.lineEndingStyle === 'mac' ? '\r' : '\n';

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();

    const pageText = content.items
      .map((item: any) => item.str)
      .join(' ');

    textContent += pageText;

    if (options.includePageBreaks && pageNum < pdf.numPages) {
      textContent += lineEnding + '--- Page Break ---' + lineEnding;
    } else {
      textContent += lineEnding;
    }
  }

  await pdf.destroy();
  return new Blob([textContent], { type: 'text/plain' });
}

// Convert PDF to JSON
export async function convertPDFToJSON(
  file: File,
  options: DocumentConversionOptions = {}
): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await (await getPdfjsLib()).getDocument({ data: arrayBuffer }).promise;

  const data: any = {
    metadata: {
      title: (pdf as any)._pdfInfo?.title || '',
      numPages: pdf.numPages,
      creationDate: new Date().toISOString(),
    },
    pages: [],
  };

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();

    if (options.structureType === 'words') {
      const words = content.items.map((item: any) => ({
        text: item.str,
        x: item.transform[4],
        y: item.transform[5],
        width: item.width,
        height: item.height,
      }));

      data.pages.push({ pageNumber: pageNum, words });
    } else {
      const pageText = content.items
        .map((item: any) => item.str)
        .join(' ');

      data.pages.push({ pageNumber: pageNum, text: pageText });
    }
  }

  await pdf.destroy();
  return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
}

// Convert PNG/JPG images to PDF
export async function convertImagesToPDF(
  files: File[],
  _options: ImageToPDFOptions = {}
): Promise<Blob> {
  const { PDFDocument } = await loadPdfLib();
  const pdf = await PDFDocument.create();

  for (const file of files) {
    const imageBytes = await file.arrayBuffer();
    let image;

    if (file.type === 'image/png') {
      image = await pdf.embedPng(imageBytes);
    } else if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
      image = await pdf.embedJpg(imageBytes);
    } else {
      continue;
    }

    const page = pdf.addPage();
    const { width, height } = page.getSize();
    const imageSize = image.scale(Math.min(width / image.width, height / image.height) * 0.8);

    page.drawImage(image, {
      x: (width - imageSize.width) / 2,
      y: (height - imageSize.height) / 2,
      width: imageSize.width,
      height: imageSize.height,
    });
  }

  const pdfBytes = await pdf.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

// Convert Word document to PDF using mammoth.js
export async function convertWordToPDF(file: File): Promise<Blob> {
  const { PDFDocument, StandardFonts } = await loadPdfLib();

  try {
    const mammoth = await import('mammoth');

    const arrayBuffer = await file.arrayBuffer();

    const result = await mammoth.convertToHtml({ arrayBuffer }, {
      styleMap: [
        "p[style-name='Heading 1'] => h1:fresh",
        "p[style-name='Heading 2'] => h2:fresh",
        'b => strong',
        'i => em',
      ],
    });

    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

    const htmlContent = result.value;
    const paragraphs = htmlContent.split(/<\/p>|<br\s*\/?>/).filter(p => p.trim());

    const formattedContent = paragraphs.map(p => {
      const text = p.replace(/<[^>]*>/g, '').trim();
      const isBold = /<(strong|b)>/.test(p);
      const isItalic = /<(em|i)>/.test(p);
      const isHeading = /<h[1-6]>/.test(p);

      return {
        text,
        isBold: isBold || isHeading,
        isItalic,
        isHeading,
        fontSize: isHeading ? 16 : 12,
      };
    }).filter(item => item.text);

    let currentPage = pdfDoc.addPage();
    const { width, height } = currentPage.getSize();
    const fontSize = 12;
    const lineHeight = fontSize * 1.4;
    let yPosition = height - 50;

    currentPage.drawText(`Converted from: ${file.name}`, {
      x: 50,
      y: yPosition,
      size: 16,
      font: boldFont,
    });
    yPosition -= lineHeight * 2;

    for (const contentItem of formattedContent) {
      if (!contentItem.text) continue;

      let selectedFont = font;
      if (contentItem.isBold && contentItem.isItalic) {
        selectedFont = boldFont;
      } else if (contentItem.isBold) {
        selectedFont = boldFont;
      } else if (contentItem.isItalic) {
        selectedFont = italicFont;
      }

      const words = contentItem.text.split(' ');
      let currentLine = '';
      const itemFontSize = contentItem.fontSize;
      const itemLineHeight = itemFontSize * 1.4;

      for (const word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const textWidth = selectedFont.widthOfTextAtSize(testLine, itemFontSize);

        if (textWidth > width - 100) {
          if (currentLine) {
            if (yPosition < 50) {
              currentPage = pdfDoc.addPage();
              yPosition = height - 50;
            }

            currentPage.drawText(currentLine, {
              x: 50,
              y: yPosition,
              size: itemFontSize,
              font: selectedFont,
            });
            yPosition -= itemLineHeight;
          }
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine) {
        if (yPosition < 50) {
          currentPage = pdfDoc.addPage();
          yPosition = height - 50;
        }

        currentPage.drawText(currentLine, {
          x: 50,
          y: yPosition,
          size: itemFontSize,
          font: selectedFont,
        });
        yPosition -= itemLineHeight;
      }

      if (contentItem.isHeading) {
        yPosition -= itemLineHeight * 0.5;
      }
    }

    const pdfBytes = await pdfDoc.save();

    return new Blob([pdfBytes], { type: 'application/pdf' });
  } catch {
    throw new Error("Failed to convert Word document to PDF. Please ensure it's a valid .docx file.");
  }
}

// Convert Excel spreadsheet to PDF using xlsx
export async function convertExcelToPDF(file: File): Promise<Blob> {
  const { PDFDocument, StandardFonts } = await loadPdfLib();

  try {
    const XLSX = await import('xlsx');

    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    workbook.SheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();

      page.drawText(`Sheet: ${sheetName}`, {
        x: 50,
        y: height - 50,
        size: 16,
        font: boldFont,
      });

      let yPosition = height - 80;
      const fontSize = 9;
      const lineHeight = fontSize * 1.3;
      const colWidth = (width - 100) / 6;

      (jsonData as any[][]).slice(0, 50).forEach((row, rowIndex) => {
        if (yPosition < 50) return;

        let xPosition = 50;

        row.slice(0, 6).forEach((cell) => {
          const cellText = String(cell || '').substring(0, 12);
          const isHeader = rowIndex === 0;

          page.drawText(cellText, {
            x: xPosition,
            y: yPosition,
            size: fontSize,
            font: isHeader ? boldFont : font,
          });

          xPosition += colWidth;
        });

        yPosition -= lineHeight;
      });

      if (yPosition > 100) {
        yPosition -= 20;
        page.drawText(`Rows: ${jsonData.length}, Converted from: ${file.name}`, {
          x: 50,
          y: yPosition,
          size: 8,
          font,
        });
      }
    });

    const pdfBytes = await pdfDoc.save();

    return new Blob([pdfBytes], { type: 'application/pdf' });
  } catch {
    throw new Error("Failed to convert Excel to PDF. Please ensure it's a valid .xlsx or .xls file.");
  }
}
