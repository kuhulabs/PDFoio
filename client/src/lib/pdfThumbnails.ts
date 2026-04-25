import type { PDFDocumentProxy } from "pdfjs-dist";
import pLimit from "p-limit";
import { getPdfjsLib } from "./pdfjs-loader";

export interface PDFThumbnail {
  file: File;
  thumbnailUrl: string | null;
  pageCount: number;
  error?: string;
}

// ===============================
// SINGLE PDF THUMBNAIL (HD)
// ===============================

export async function generatePDFThumbnail(
  file: File,
  pageNumber: number = 1
): Promise<PDFThumbnail> {

  try {
    const pdfjsLib = await getPdfjsLib();

    const arrayBuffer = await file.arrayBuffer();

    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      verbosity: 0,
      disableAutoFetch: true,
      disableStream: true,
    });

    const pdf: PDFDocumentProxy = await loadingTask.promise;

    const pageIndex = Math.min(pageNumber, pdf.numPages);
    const page = await pdf.getPage(pageIndex);

    // ---------- HD SCALE CONFIG ----------

    const baseViewport = page.getViewport({ scale: 1 });

    const TARGET_WIDTH = 240;
    const TARGET_HEIGHT = 320;

    const scaleFactor = Math.min(
      TARGET_WIDTH / baseViewport.width,
      TARGET_HEIGHT / baseViewport.height
    );

    const dpr = window.devicePixelRatio || 2;

    const viewport = page.getViewport({
      scale: scaleFactor * dpr,
    });

    // ---------- CANVAS SETUP ----------

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", {
      alpha: false,
      willReadFrequently: false,
    });

    if (!context) {
      throw new Error("Canvas context failed");
    }

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // Set CSS size (important for retina)
    canvas.style.width = `${viewport.width / dpr}px`;
    canvas.style.height = `${viewport.height / dpr}px`;

    // White background
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // ---------- RENDER ----------

    await page.render({
      canvasContext: context,
      viewport,
      intent: "display",
    }).promise;

    const thumbnailUrl = canvas.toDataURL("image/webp", 0.92);

    // Cleanup memory
    page.cleanup();
    pdf.cleanup();

    return {
      file,
      thumbnailUrl,
      pageCount: pdf.numPages,
    };

  } catch (error) {

    const message =
      error instanceof Error ? error.message : "Thumbnail generation failed";

    return {
      file,
      thumbnailUrl: "",
      pageCount: 0,
      error: message,
    };
  }
}


// ===============================
// MULTIPLE PDF THUMBNAILS (FAST)
// ===============================

export async function generateMultiplePDFThumbnails(
  files: File[],
  onProgress?: (completed: number, total: number) => void,
  onItemGenerated?: (thumbnail: PDFThumbnail, index: number) => void,
): Promise<PDFThumbnail[]> {

  let completed = 0;
  const limit = pLimit(2);

  const tasks = files.map((file, index) =>
    limit(async () => {
      const result = await generatePDFThumbnail(file);

      completed++;
      onProgress?.(completed, files.length);
      onItemGenerated?.(result, index);

      return result;
    }),
  );

  return Promise.all(tasks);
}


// ===============================
// PDF INFO FETCHER
// ===============================

export async function getPDFInfo(
  file: File
): Promise<{ pageCount: number; title?: string }> {

  try {
    const pdfjsLib = await getPdfjsLib();

    const buffer = await file.arrayBuffer();

    const pdf = await pdfjsLib
      .getDocument({
        data: buffer,
        verbosity: 0,
      })
      .promise;

    const metadata = await pdf.getMetadata();

    pdf.cleanup();

    return {
      pageCount: pdf.numPages,
      title:
        metadata?.info &&
        typeof metadata.info === "object" &&
        "Title" in metadata.info
          ? String(metadata.info.Title)
          : undefined,
    };

  } catch {

    return {
      pageCount: 0,
    };
  }
}