// This aggregator is preserved so existing `import { TOOL_SEO } from '@/seo/seo'`
// imports keep compiling. New code should import the per-tool module directly
// (e.g. `import { mergeSEO } from '@/seo/merge'`) so the per-tool chunk only
// pulls in what it needs (~5KB) instead of the full table.
import { mergeSEO } from './merge';
import { splitSEO } from './split';
import { compressSEO } from './compress';
import { rotateSEO } from './rotate';
import { reorderSEO } from './reorder';
import { deletePagesSEO } from './delete-pages';
import { removeBlankPagesSEO } from './remove-blank-pages';
import { pageNumbersSEO } from './page-numbers';
import { watermarkSEO } from './watermark';
import { metadataSEO } from './metadata';
import { pdfToWordSEO } from './pdf-to-word';
import { pdfToExcelSEO } from './pdf-to-excel';
import { pdfToPptSEO } from './pdf-to-ppt';
import { pdfToJpgSEO } from './pdf-to-jpg';
import { pdfToPngSEO } from './pdf-to-png';
import { pdfToTiffSEO } from './pdf-to-tiff';
import { pdfToTxtSEO } from './pdf-to-txt';
import { pdfToJsonSEO } from './pdf-to-json';
import { wordToPdfSEO } from './word-to-pdf';
import { excelToPdfSEO } from './excel-to-pdf';
import { pngToPdfSEO } from './png-to-pdf';
import { imagesToPdfSEO } from './images-to-pdf';
import { unlockSEO } from './unlock';
import { lockSEO } from './lock';
import { summarizeSEO } from './summarize';

export const TOOL_SEO = {
  merge: mergeSEO,
  split: splitSEO,
  compress: compressSEO,
  rotate: rotateSEO,
  reorder: reorderSEO,
  "delete-pages": deletePagesSEO,
  "remove-blank-pages": removeBlankPagesSEO,
  "page-numbers": pageNumbersSEO,
  watermark: watermarkSEO,
  metadata: metadataSEO,
  "pdf-to-word": pdfToWordSEO,
  "pdf-to-excel": pdfToExcelSEO,
  "pdf-to-ppt": pdfToPptSEO,
  "pdf-to-jpg": pdfToJpgSEO,
  "pdf-to-png": pdfToPngSEO,
  "pdf-to-tiff": pdfToTiffSEO,
  "pdf-to-txt": pdfToTxtSEO,
  "pdf-to-json": pdfToJsonSEO,
  "word-to-pdf": wordToPdfSEO,
  "excel-to-pdf": excelToPdfSEO,
  "png-to-pdf": pngToPdfSEO,
  "images-to-pdf": imagesToPdfSEO,
  unlock: unlockSEO,
  lock: lockSEO,
  summarize: summarizeSEO,
} as const;

export const toolSEOData = TOOL_SEO;
