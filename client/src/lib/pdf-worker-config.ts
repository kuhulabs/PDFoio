/**
 * Optimized PDF.js worker configuration for better performance.
 *
 * The worker URL is bundled locally via Vite's `?url` import — it resolves
 * to a string at build time and does NOT pull pdfjs-dist into the bundle.
 *
 * pdfjs-dist itself is intentionally NOT imported at module top-level.
 * Importing it here would force every page that touches this file to drag
 * the entire library (~600KB) into its initial chunk. Instead, the dynamic
 * import lives in `pdfjs-loader.ts` and only fires the first time a user
 * actually opens a PDF.
 */

import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.js?url";

export const PDF_CONFIG = {
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

let isWorkerInitialized = false;

export function configureWorker(pdfjsLib: typeof import("pdfjs-dist")): void {
  if (isWorkerInitialized || typeof window === "undefined") {
    return;
  }
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
  isWorkerInitialized = true;
}

/**
 * @deprecated Kept for callers that don't have a pdfjsLib reference handy.
 * Loads pdfjs-dist on demand and configures the worker. Prefer
 * `getPdfjsLib()` from `./pdfjs-loader` which already does this.
 */
export async function initializePDFJS(): Promise<void> {
  if (isWorkerInitialized || typeof window === "undefined") {
    return;
  }
  const pdfjsLib = await import("pdfjs-dist");
  configureWorker(pdfjsLib);
}
