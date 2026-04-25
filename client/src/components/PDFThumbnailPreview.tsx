import React, { useEffect, useState, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  generateMultiplePDFThumbnails,
  PDFThumbnail,
} from "@/lib/pdfThumbnails";
import { FileText, AlertCircle, Image } from "lucide-react";

interface PDFThumbnailPreviewProps {
  files: File[];
  onThumbnailsGenerated?: (thumbnails: PDFThumbnail[]) => void;
}

export function PDFThumbnailPreview({
  files,
  onThumbnailsGenerated,
}: PDFThumbnailPreviewProps) {
  const [thumbnails, setThumbnails] = useState<PDFThumbnail[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ completed: 0, total: 0 });
  const [useSimplePreview, setUseSimplePreview] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const onThumbnailsGeneratedRef = useRef(onThumbnailsGenerated);
  const thumbnailUrlsRef = useRef<Set<string>>(new Set());

  // Update callback ref
  useEffect(() => {
    onThumbnailsGeneratedRef.current = onThumbnailsGenerated;
  }, [onThumbnailsGenerated]);

  // Cleanup function to revoke all thumbnail URLs
  const cleanupThumbnailUrls = useCallback(() => {
    thumbnailUrlsRef.current.forEach((url) => {
      URL.revokeObjectURL(url);
    });
    thumbnailUrlsRef.current.clear();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupThumbnailUrls();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [cleanupThumbnailUrls]);

  // Generate thumbnails when files change
  useEffect(() => {
    if (!files.length) {
      cleanupThumbnailUrls();
      setThumbnails([]);
      setLoading(false);
      setUseSimplePreview(false);
      setThumbnails([]);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Cleanup previous thumbnails
    cleanupThumbnailUrls();

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    const generateThumbnails = async () => {
      setLoading(true);
      setProgress({ completed: 0, total: files.length });
      setUseSimplePreview(false);
      setThumbnails([]);

      try {
        const generated = await generateMultiplePDFThumbnails(
          files,
          (completed: number, total: number) => {
            if (!signal.aborted) {
              setProgress({ completed, total });
            }
          },
          (thumbnail) => {
            if (signal.aborted) return;

            if (thumbnail.thumbnailUrl) {
              thumbnailUrlsRef.current.add(thumbnail.thumbnailUrl);
            }

            setThumbnails((prev) => {
              const existingIndex = prev.findIndex((t) => t.file === thumbnail.file);
              if (existingIndex === -1) {
                return [...prev, thumbnail];
              }

              const next = [...prev];
              next[existingIndex] = thumbnail;
              return next;
            });
          },
        );

        if (signal.aborted) {
          // Cleanup generated thumbnails if request was aborted
          generated.forEach((thumb) => {
            if (thumb.thumbnailUrl) {
              URL.revokeObjectURL(thumb.thumbnailUrl);
            }
          });
          return;
        }

        // Track new thumbnail URLs for cleanup
        generated.forEach((thumb) => {
          if (thumb.thumbnailUrl) {
            thumbnailUrlsRef.current.add(thumb.thumbnailUrl);
          }
        });

        // Worker error detection
        const hasWorkerErrors = generated.some(
          (t) =>
            t.error?.includes("worker") ||
            t.error?.includes("GlobalWorkerOptions"),
        );

        setUseSimplePreview(hasWorkerErrors);
        setThumbnails(generated);

        // Call callback with generated thumbnails
        onThumbnailsGeneratedRef.current?.(generated);
      } catch (err) {
        if (!signal.aborted) {
          console.error("Thumbnail generation error:", err);

          // Create fallback thumbnails with error state
          const fallbackThumbnails = files.map((file) => ({
            file,
            thumbnailUrl: null,
            pageCount: 0,
            error: "Failed to generate preview",
          }));

          setThumbnails(fallbackThumbnails);
          setUseSimplePreview(true);
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    generateThumbnails();
  }, [files, cleanupThumbnailUrls]);

  if (!files.length) return null;

  const pendingCount = Math.max(0, files.length - thumbnails.length);

  return (
    <div
      className="space-y-4"
      role="region"
      aria-label="PDF thumbnail previews"
    >
      {loading && (
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div
              className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"
              role="status"
              aria-label="Loading thumbnails"
            />
            <span>
              {useSimplePreview
                ? "Creating file previews..."
                : "Generating PDF previews..."}
            </span>
          </div>
          <div className="text-xs mb-2">
            {progress.completed} of {progress.total} files processed
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-md mx-auto bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${progress.total > 0 ? (progress.completed / progress.total) * 100 : 0}%`,
              }}
              role="progressbar"
              aria-valuenow={progress.completed}
              aria-valuemin={0}
              aria-valuemax={progress.total}
            />
          </div>
        </div>
      )}

      {useSimplePreview && !loading && (
        <div
          className="text-center text-xs text-amber-600 dark:text-amber-400 mb-3 flex items-center justify-center gap-1"
          role="alert"
        >
          <Image className="h-3 w-3" aria-hidden="true" />
          Fallback preview mode enabled
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {thumbnails.map((thumbnail, index) => (
          <ThumbnailCard
            key={`${thumbnail.file.name}-${index}`}
            thumbnail={thumbnail}
          />
        ))}

        {loading &&
          Array.from({ length: pendingCount }).map((_, index) => (
            <Card key={`skeleton-${index}`} className="p-3">
              <Skeleton className="w-full h-32 mb-2 rounded" />
              <Skeleton className="h-4 w-3/4 mb-1" />
              <Skeleton className="h-3 w-1/2" />
            </Card>
          ))}
      </div>
    </div>
  );
}

// Memoized thumbnail card component for better performance
const ThumbnailCard = React.memo(
  ({ thumbnail }: { thumbnail: PDFThumbnail }) => {
    const { file, thumbnailUrl, pageCount, error } = thumbnail;
    const [imageError, setImageError] = useState(false);

    // Validate thumbnail data
    if (!thumbnail || !file) {
      return null;
    }

    const hasValidThumbnail = thumbnailUrl && !imageError && !error;

    return (
      <Card className="p-3 hover:shadow-md transition-shadow">
        <div
          className="aspect-[3/4] mb-3 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden"
          role="img"
          aria-label={`Preview of ${file.name}`}
        >
          {error ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-red-500 p-2">
              <AlertCircle className="h-6 w-6 mb-1" aria-hidden="true" />
              <span className="text-xs text-center">Preview Error</span>
              <span
                className="text-xs text-center text-gray-500 mt-1"
                title={error}
              >
                {error.includes("worker")
                  ? "PDF worker loading..."
                  : "Invalid PDF"}
              </span>
            </div>
          ) : hasValidThumbnail ? (
            <img
              src={thumbnailUrl}
              alt={`Preview of ${file.name}`}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-contain"
              style={{ imageRendering: "auto" }}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FileText
                className="h-12 w-12 text-gray-400"
                aria-hidden="true"
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div
            className="text-sm font-medium text-gray-900 dark:text-white truncate"
            title={file.name}
          >
            {file.name}
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span aria-label={`File size: ${formatFileSize(file.size)}`}>
              {formatFileSize(file.size)}
            </span>
            {pageCount > 0 && (
              <Badge
                variant="secondary"
                className="text-xs"
                aria-label={`${pageCount} page${pageCount !== 1 ? "s" : ""}`}
              >
                {pageCount} page{pageCount !== 1 ? "s" : ""}
              </Badge>
            )}
          </div>

          {error && (
            <div
              className="text-xs text-red-500 truncate"
              title={error}
              role="alert"
            >
              {error.includes("worker") ? "Fallback preview active" : error}
            </div>
          )}
        </div>
      </Card>
    );
  },
);

ThumbnailCard.displayName = "ThumbnailCard";

function formatFileSize(bytes: number): string {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
