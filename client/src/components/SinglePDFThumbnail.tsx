import React, { useEffect, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pLimit from "p-limit";
import "../lib/pdf-worker-config";

export interface PDFThumbnail {
  file: File;
  thumbnailUrl: string;
  pageCount: number;
  error?: string;
}

/**
 * Generate thumbnail for a single PDF file
 * @param file - PDF file
 * @param pageNumber - Page number (1-based)
 * @param scale - Render scale (default: 0.5)
 * @returns PDFThumbnail object
 */
export async function generatePDFThumbnail(
  file: File,
  pageNumber: number = 1,
  scale: number = 0.5
): Promise<PDFThumbnail> {
  let canvas: HTMLCanvasElement | null = null;
  let pdf: pdfjsLib.PDFDocumentProxy | null = null;
  let page: pdfjsLib.PDFPageProxy | null = null;

  try {
    // Load PDF
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ 
      data: arrayBuffer,
      // Optimize for thumbnails
      cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/cmaps/',
      cMapPacked: true,
    });
    
    pdf = await loadingTask.promise;
    const pageCount = pdf.numPages;

    // Validate page number
    const targetPage = Math.min(Math.max(1, pageNumber), pageCount);
    page = await pdf.getPage(targetPage);

    // Create canvas
    const viewport = page.getViewport({ scale });
    canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", {
      alpha: false, // No transparency for better performance
      willReadFrequently: false,
    });

    if (!context) {
      throw new Error("Could not get canvas context");
    }

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Render page
    await page.render({
      canvasContext: context,
      viewport: viewport,
      background: 'white', // White background
    }).promise;

    // Convert to data URL (JPEG for smaller size)
    const thumbnailUrl = canvas.toDataURL("image/jpeg", 0.85);

    return {
      file,
      thumbnailUrl,
      pageCount,
    };

  } catch (error) {
    // Better error messages
    let errorMessage = "Unknown error";
    
    if (error instanceof Error) {
      if (error.message.includes("Invalid PDF")) {
        errorMessage = "Invalid or corrupted PDF file";
      } else if (error.message.includes("password")) {
        errorMessage = "PDF is password protected";
      } else if (error.message.includes("worker")) {
        errorMessage = "PDF worker not loaded";
      } else {
        errorMessage = error.message;
      }
    }

    console.error("Thumbnail generation error:", error);

    return {
      file,
      thumbnailUrl: "",
      pageCount: 0,
      error: errorMessage,
    };

  } finally {
    // ✅ CRITICAL: Cleanup to prevent memory leaks
    try {
      if (page) {
        page.cleanup();
      }
      if (pdf) {
        await pdf.destroy();
      }
      if (canvas) {
        canvas.width = 0;
        canvas.height = 0;
        canvas = null;
      }
    } catch (cleanupError) {
      console.warn("Cleanup error:", cleanupError);
    }
  }
}

/**
 * Generate thumbnails for multiple PDF files with parallel processing
 * @param files - Array of PDF files
 * @param onProgress - Progress callback
 * @param concurrency - Number of files to process simultaneously (default: 3)
 * @returns Array of PDFThumbnail objects
 */
export async function generateMultiplePDFThumbnails(
  files: File[],
  onProgress?: (completed: number, total: number) => void,
  concurrency: number = 3
): Promise<PDFThumbnail[]> {
  const limit = pLimit(concurrency);
  const total = files.length;
  let completed = 0;

  const promises = files.map((file) =>
    limit(async () => {
      try {
        const thumbnail = await generatePDFThumbnail(file);
        completed++;
        onProgress?.(completed, total);
        return thumbnail;
      } catch (error) {
        console.error(`Error processing ${file.name}:`, error);
        completed++;
        onProgress?.(completed, total);
        return {
          file,
          thumbnailUrl: "",
          pageCount: 0,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    })
  );

  return await Promise.all(promises);
}

/**
 * Single PDF thumbnail component with loading and error states
 */
export function SinglePDFThumbnail({
  file,
  pageNumber = 1,
  className,
}: {
  file: File;
  pageNumber?: number;
  className?: string;
}) {
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    generatePDFThumbnail(file, pageNumber)
      .then((res) => {
        if (cancelled) return;

        if (res.error) {
          setError(res.error);
        } else if (res.thumbnailUrl) {
          setThumbnail(res.thumbnailUrl);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || "Failed to generate thumbnail");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [file, pageNumber]);

  if (error) {
    return (
      <div
        className={`${className} flex flex-col items-center justify-center bg-red-50 dark:bg-red-900/20 p-4`}
      >
        <svg
          className="w-8 h-8 text-red-500 mb-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <p className="text-red-600 dark:text-red-400 text-xs text-center">
          {error}
        </p>
      </div>
    );
  }

  if (loading || !thumbnail) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-gray-100 dark:bg-gray-800`}
      >
        <div className="animate-pulse w-full h-full bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    );
  }

  return (
    <div className={className}>
      <img
        src={thumbnail}
        alt={`PDF Page ${pageNumber} Preview`}
        className="w-full h-full object-contain"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}