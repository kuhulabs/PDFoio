import * as pdfjsLib from "pdfjs-dist";
import { generatePDFThumbnail } from "./pdfThumbnails";
import { initializePDFJS } from "./pdf-worker-config";

interface ThumbnailOptions {
  scale?: number;
  format?: "jpeg" | "png";
  quality?: number;
  useOffscreenCanvas?: boolean;
}

export class PDFPerformanceOptimizer {
  static async generateOptimizedThumbnail(file: File, _options: ThumbnailOptions = {}): Promise<string> {
    const thumbnail = await generatePDFThumbnail(file, 1);
    if (!thumbnail.thumbnailUrl) {
      throw new Error(thumbnail.error || "Failed to generate thumbnail");
    }
    return thumbnail.thumbnailUrl;
  }

  static async processWithMemoryManagement<T>(operation: () => Promise<T>): Promise<T> {
    return operation();
  }

  static async cacheOperation<T>(_key: string, operation: () => Promise<T>): Promise<T> {
    return operation();
  }

  static async initializeOptimizedWorker() {
    initializePDFJS();
    return pdfjsLib;
  }
}
