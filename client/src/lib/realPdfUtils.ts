// Barrel re-export — the original 2000-line implementation has been split
// into four sibling modules for tree-shaking. Pages still import from
// "@/lib/realPdfUtils" so no call sites needed to change, but Vite/rollup
// only pull the split files whose symbols are actually referenced.
//
//   pdf-utils-common  — types, downloadBlob, page-count helpers, lazy pdf-lib loader
//   pdf-edit-utils    — merge, split, rotate, watermark, page numbers, lock/unlock, compress, etc.
//   pdf-render-utils  — convertPDFToImages, convertPDFToTIFF, extractImagesFromPDF
//   pdf-convert-utils — convertPDFTo{Word,Excel,PPT,TXT,JSON}, convert{Images,Word,Excel}ToPDF
//
// A page that only needs `mergePDFs` and `downloadBlob` will pull in
// pdf-edit-utils + pdf-utils-common — but NOT pdf-render-utils or
// pdf-convert-utils (and their lazy chunks).
export * from './pdf-utils-common';
export * from './pdf-edit-utils';
export * from './pdf-render-utils';
export * from './pdf-convert-utils';
