import React, { useEffect, useState } from "react";
import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";
import pLimit from "p-limit";
import { getPdfjsLib } from "@/lib/pdfjs-loader";

export interface PDFThumbnail {
  file: File;
  thumbnailUrl: string | null;
  pageCount: number;
  error?: string;
}

/**
 * Custom error class for PDF thumbnail generation
 */
export class PDFThumbnailError extends Error {
  constructor(
    message: string,
    public readonly originalError?: unknown,
    public readonly file?: File,
  ) {
    super(message);
    this.name = "PDFThumbnailError";
  }
}

/**
 * Generate thumbnail for a single PDF file
 * @param file - PDF file
 * @param pageNumber - Page number (1-based)
 * @param scale - Render scale (default: 0.5)
 * @param maxFileSize - Maximum file size in bytes (default: 50MB)
 * @param signal - AbortSignal for cancellation
 * @returns PDFThumbnail object
 */
export async function generatePDFThumbnail(
  file: File,
  pageNumber: number = 1,
  scale: number = 0.5,
  maxFileSize: number = 50 * 1024 * 1024,
  signal?: AbortSignal,
): Promise<PDFThumbnail> {
  let canvas: HTMLCanvasElement | null = null;
  let pdf: PDFDocumentProxy | null = null;
  let page: PDFPageProxy | null = null;

  try {
    // Check if aborted
    if (signal?.aborted) {
      throw new PDFThumbnailError("Generation aborted");
    }

    // Validate file
    if (!file || !(file instanceof File)) {
      throw new PDFThumbnailError("Invalid file object");
    }

    // Check file type
    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      return {
        file,
        thumbnailUrl: null,
        pageCount: 0,
        error: "File is not a PDF",
      };
    }

    // Check file size
    if (file.size > maxFileSize) {
      return {
        file,
        thumbnailUrl: null,
        pageCount: 0,
        error: `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max: ${(maxFileSize / 1024 / 1024).toFixed(0)}MB`,
      };
    }

    // Check if empty file
    if (file.size === 0) {
      return {
        file,
        thumbnailUrl: null,
        pageCount: 0,
        error: "Empty PDF file",
      };
    }

    // Load PDF
    const arrayBuffer = await file.arrayBuffer();

    // Check if aborted after loading
    if (signal?.aborted) {
      throw new PDFThumbnailError("Generation aborted");
    }

    const pdfjsLib = await getPdfjsLib();

    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      // Optimize for thumbnails
      cMapUrl: "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/cmaps/",
      cMapPacked: true,
      standardFontDataUrl:
        "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/standard_fonts/",
    });

    pdf = await loadingTask.promise;

    // Check if aborted after loading PDF
    if (signal?.aborted) {
      throw new PDFThumbnailError("Generation aborted");
    }

    const pageCount = pdf.numPages;

    if (pageCount === 0) {
      return {
        file,
        thumbnailUrl: null,
        pageCount: 0,
        error: "PDF has no pages",
      };
    }

    // Validate page number
    const targetPage = Math.min(Math.max(1, pageNumber), pageCount);
    page = await pdf.getPage(targetPage);

    // Check if aborted after loading page
    if (signal?.aborted) {
      throw new PDFThumbnailError("Generation aborted");
    }

    // Calculate adaptive scale for consistent thumbnail size
    const viewport = page.getViewport({ scale: 1 });
    const maxDimension = 400; // max width/height for thumbnail
    const adaptiveScale = Math.min(
      scale,
      maxDimension / Math.max(viewport.width, viewport.height),
    );
    const finalViewport = page.getViewport({ scale: adaptiveScale });

    // Create canvas
    canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", {
      alpha: false, // No transparency for better performance
      willReadFrequently: false,
      desynchronized: true, // Better performance
    });

    if (!context) {
      throw new PDFThumbnailError("Could not get canvas context");
    }

    canvas.height = finalViewport.height;
    canvas.width = finalViewport.width;

    // Render page
    await page.render({
      canvasContext: context,
      viewport: finalViewport,
      background: "white", // White background
      intent: "display",
    }).promise;

    // Check if aborted after rendering
    if (signal?.aborted) {
      throw new PDFThumbnailError("Generation aborted");
    }

    // Convert to Blob URL (more memory efficient than data URL)
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas!.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new PDFThumbnailError("Failed to create blob"));
          }
        },
        "image/jpeg",
        0.85,
      );
    });

    const thumbnailUrl = URL.createObjectURL(blob);

    return {
      file,
      thumbnailUrl,
      pageCount,
    };
  } catch (error) {
    // Better error messages
    let errorMessage = "Unknown error";

    if (error instanceof PDFThumbnailError) {
      errorMessage = error.message;
    } else if (error instanceof Error) {
      if (error.message.includes("Invalid PDF")) {
        errorMessage = "Invalid or corrupted PDF file";
      } else if (error.message.includes("password")) {
        errorMessage = "PDF is password protected";
      } else if (error.message.includes("worker")) {
        errorMessage = "PDF worker not loaded";
      } else if (error.message.includes("abort")) {
        errorMessage = "Generation cancelled";
      } else {
        errorMessage = error.message;
      }
    }

    console.error("Thumbnail generation error:", error);

    return {
      file,
      thumbnailUrl: null,
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
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
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
 * @param signal - AbortSignal for cancellation
 * @returns Array of PDFThumbnail objects
 */
export async function generateMultiplePDFThumbnails(
  files: File[],
  onProgress?: (completed: number, total: number) => void,
  concurrency: number = 3,
  signal?: AbortSignal,
): Promise<PDFThumbnail[]> {
  // Validate inputs
  if (!Array.isArray(files)) {
    throw new PDFThumbnailError("Files must be an array");
  }

  if (files.length === 0) {
    return [];
  }

  // Check if aborted
  if (signal?.aborted) {
    throw new PDFThumbnailError("Generation aborted");
  }

  // Limit concurrency to reasonable range
  const safeConcurrency = Math.max(1, Math.min(concurrency, 5));
  const limit = pLimit(safeConcurrency);
  const total = files.length;
  let completed = 0;

  const promises = files.map((file, index) =>
    limit(async () => {
      try {
        // Check if aborted before processing each file
        if (signal?.aborted) {
          return {
            file,
            thumbnailUrl: null,
            pageCount: 0,
            error: "Generation cancelled",
          };
        }

        const thumbnail = await generatePDFThumbnail(
          file,
          1,
          0.5,
          50 * 1024 * 1024,
          signal,
        );
        completed++;
        onProgress?.(completed, total);
        return thumbnail;
      } catch (error) {
        console.error(`Error processing ${file.name}:`, error);
        completed++;
        onProgress?.(completed, total);

        return {
          file,
          thumbnailUrl: null,
          pageCount: 0,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }),
  );

  try {
    return await Promise.all(promises);
  } catch (error) {
    console.error("Error in batch thumbnail generation:", error);
    throw new PDFThumbnailError("Failed to generate thumbnails", error);
  }
}

/**
 * Single PDF thumbnail component with loading and error states
 */
export function SinglePDFThumbnail({
  file,
  pageNumber = 1,
  className,
  onLoad,
  onError,
}: {
  file: File;
  pageNumber?: number;
  className?: string;
  onLoad?: () => void;
  onError?: (error: string) => void;
}) {
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let currentThumbnailUrl: string | null = null;
    const abortController = new AbortController();

    setLoading(true);
    setError(null);
    setThumbnail(null);

    generatePDFThumbnail(
      file,
      pageNumber,
      0.5,
      50 * 1024 * 1024,
      abortController.signal,
    )
      .then((res) => {
        if (cancelled) {
          // Cleanup if component unmounted
          if (res.thumbnailUrl) {
            URL.revokeObjectURL(res.thumbnailUrl);
          }
          return;
        }

        if (res.error) {
          setError(res.error);
          onError?.(res.error);
        } else if (res.thumbnailUrl) {
          currentThumbnailUrl = res.thumbnailUrl;
          setThumbnail(res.thumbnailUrl);
          onLoad?.();
        }
      })
      .catch((err) => {
        if (!cancelled) {
          const errorMsg = err.message || "Failed to generate thumbnail";
          setError(errorMsg);
          onError?.(errorMsg);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
      abortController.abort();

      // Revoke the blob URL to prevent memory leak
      if (currentThumbnailUrl) {
        URL.revokeObjectURL(currentThumbnailUrl);
      }
    };
  }, [file, pageNumber, onLoad, onError]);

  if (error) {
    return (
      <div
        className={`${className} flex flex-col items-center justify-center bg-red-50 dark:bg-red-900/20 p-4`}
        role="alert"
        aria-live="polite"
      >
        <svg
          className="w-8 h-8 text-red-500 mb-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
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
        role="status"
        aria-label="Loading thumbnail"
      >
        <div className="animate-pulse w-full h-full bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    );
  }

  return (
    <div className={className}>
      <img
        src={thumbnail}
        alt={`PDF Page ${pageNumber} Preview of ${file.name}`}
        className="w-full h-full object-contain"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

/**
 * Cleanup utility to revoke multiple thumbnail URLs
 * @param thumbnails - Array of PDFThumbnail objects
 */
export function cleanupThumbnails(thumbnails: PDFThumbnail[]): void {
  thumbnails.forEach((thumbnail) => {
    if (thumbnail.thumbnailUrl) {
      try {
        URL.revokeObjectURL(thumbnail.thumbnailUrl);
      } catch (error) {
        console.warn("Failed to revoke URL:", error);
      }
    }
  });
}
