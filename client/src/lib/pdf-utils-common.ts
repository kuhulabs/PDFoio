// Shared types, helpers, and the lazy pdf-lib loader.
// This is intentionally tiny (no heavy imports) so every page chunk that
// only needs `downloadBlob` or one of the type interfaces stays small.
import type * as PdfLibType from 'pdf-lib';
import { getPdfjsLib } from './pdfjs-loader';

let _pdfLibPromise: Promise<typeof PdfLibType> | null = null;
export function loadPdfLib(): Promise<typeof PdfLibType> {
  if (!_pdfLibPromise) _pdfLibPromise = import('pdf-lib');
  return _pdfLibPromise;
}

export const isDev = import.meta.env.DEV;
export const debugLog = (...args: unknown[]) => {
  if (isDev) console.log(...args);
};

export interface PDFPage {
  id: string;
  pageNumber: number;
  rotation?: number;
  deleted?: boolean;
}

export interface PageNumberSettings {
  position: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  format: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  backgroundColor?: string;
  showBackground?: boolean;
  padding?: number;
}

export interface PDFMetadata {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
}

export interface WatermarkSettings {
  type: 'text' | 'image';
  text?: string;
  imageFile?: File;
  opacity: number;
  rotation: number;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  position?: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export interface CompressionLevel {
  level: 'low' | 'medium' | 'high';
  quality: number;
}

export interface ImageConversionOptions {
  quality?: number;
  transparentBackground?: boolean;
  compressionType?: 'none' | 'lzw' | 'jpeg';
}

export interface DocumentConversionOptions {
  ocr?: boolean;
  autoDetectTables?: boolean;
  includePageBreaks?: boolean;
  lineEndingStyle?: 'unix' | 'windows' | 'mac';
  structureType?: 'pages' | 'words' | 'tables';
}

export interface ImageToPDFOptions {
  pageSize?: 'A4' | 'Letter' | 'A3' | 'A5';
  margin?: number;
  quality?: number;
}

export interface SplitPoint {
  afterPage: number;
  groupName: string;
}

// Get PDF page count using PDF.js for accuracy
export async function getPDFPageCount(file: File): Promise<number> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = (await getPdfjsLib()).getDocument({
      data: arrayBuffer,
      verbosity: 0,
    });
    const pdf = await loadingTask.promise;
    return pdf.numPages;
  } catch {
    return 0;
  }
}

// Generate actual PDF pages array from file
export async function generateRealPDFPages(file: File): Promise<PDFPage[]> {
  try {
    const pageCount = await getPDFPageCount(file);
    if (pageCount === 0) return [];

    return Array.from({ length: pageCount }, (_, index) => ({
      id: `page-${index + 1}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      pageNumber: index + 1,
      rotation: 0,
      deleted: false,
    }));
  } catch {
    return [];
  }
}

// Utility function to download blob
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
