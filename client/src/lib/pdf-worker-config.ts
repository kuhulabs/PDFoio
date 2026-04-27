/**
 * Optimized PDF.js worker configuration for better performance.
 *
 * The worker is bundled locally via Vite's `?url` import — no CDN dependency.
 * This works in both dev and production: Vite serves the file in dev, and
 * emits a hashed asset at build time.
 */

import * as pdfjsLib from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.js?url";

if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
}

const PDF_CONFIG = {
  enableTextLayer: true,
  enableAnnotations: false,
  thumbnailScale: 0.5,
  maxConcurrentRenders: 3,
  canvasSettings: {
    willReadFrequently: false,
    alpha: false,
  },
  maxImageSize: 16777216,
  renderingOptions: {
    intent: "display" as const,
    enableWebGL: true,
    renderInteractiveForms: false,
  },
};

export { pdfjsLib, PDF_CONFIG };

let isWorkerInitialized = false;

export const initializePDFJS = () => {
  if (isWorkerInitialized) {
    return;
  }

  if (typeof window !== "undefined") {
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
    isWorkerInitialized = true;
  }
};
