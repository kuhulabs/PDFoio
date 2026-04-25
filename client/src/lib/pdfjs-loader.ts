import { initializePDFJS } from "./pdf-worker-config";

let pdfjsLibPromise: Promise<typeof import("pdfjs-dist")> | null = null;

export async function getPdfjsLib() {
  if (!pdfjsLibPromise) {
    pdfjsLibPromise = import("pdfjs-dist").then((lib) => {
      initializePDFJS();
      return lib;
    });
  }

  return pdfjsLibPromise;
}
