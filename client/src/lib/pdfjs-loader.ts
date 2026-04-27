import { configureWorker } from "./pdf-worker-config";

let pdfjsLibPromise: Promise<typeof import("pdfjs-dist")> | null = null;

/**
 * Lazily loads pdfjs-dist on first use and configures the worker. The
 * library is ~600KB compressed so deferring it keeps the initial JS
 * bundle (and TBT) small. Call this only when the user actually needs
 * PDF processing — e.g. after they upload a file.
 */
export async function getPdfjsLib() {
  if (!pdfjsLibPromise) {
    pdfjsLibPromise = import("pdfjs-dist").then((lib) => {
      configureWorker(lib);
      return lib;
    });
  }

  return pdfjsLibPromise;
}
