import React, { useEffect, useState, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { generateMultiplePDFThumbnails, PDFThumbnail } from "@/lib/pdfThumbnails";
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

  // Update callback ref
  useEffect(() => {
    onThumbnailsGeneratedRef.current = onThumbnailsGenerated;
  }, [onThumbnailsGenerated]);

  // Cleanup thumbnails on unmount or when files change
  useEffect(() => {
    return () => {
      thumbnails.forEach(thumb => {
        if (thumb.thumbnailUrl) {
          URL.revokeObjectURL(thumb.thumbnailUrl);
        }
      });
    };
  }, [thumbnails]);

  useEffect(() => {
    if (!files.length) {
      setThumbnails([]);
      setLoading(false);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    const generateThumbnails = async () => {
      setLoading(true);
      setProgress({ completed: 0, total: files.length });

      try {
        const generated = await generateMultiplePDFThumbnails(
          files,
          (completed: number, total: number) => {
            if (!signal.aborted) {
              setProgress({ completed, total });
            }
          }
        );

        if (signal.aborted) return;

        // Worker error detection
        const hasWorkerErrors = generated.some(t =>
          t.error?.includes("worker") ||
          t.error?.includes("GlobalWorkerOptions")
        );

        setUseSimplePreview(hasWorkerErrors);
        setThumbnails(generated);
        
        // Call callback with generated thumbnails
        onThumbnailsGeneratedRef.current?.(generated);

      } catch (err) {
        if (!signal.aborted) {
          console.error('Thumbnail generation error:', err);
          setThumbnails([]);
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    generateThumbnails();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [files]);

  if (!files.length) return null;

  const pendingCount = Math.max(0, files.length - thumbnails.length);

  return (
    <div className="space-y-4">
      {loading && (
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500" />
            {useSimplePreview
              ? "Creating file previews..."
              : "Generating PDF previews..."}
          </div>
          <div className="text-xs">
            {progress.completed} of {progress.total} files processed
          </div>
        </div>
      )}

      {useSimplePreview && !loading && (
        <div className="text-center text-xs text-amber-600 dark:text-amber-400 mb-3 flex items-center justify-center gap-1">
          <Image className="h-3 w-3" />
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

function ThumbnailCard({ thumbnail }: { thumbnail: PDFThumbnail }) {
  const { file, thumbnailUrl, pageCount, error } = thumbnail;
  const [imageError, setImageError] = useState(false);

  return (
    <Card className="p-3 hover:shadow-md transition-shadow">
      <div className="aspect-[3/4] mb-3 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
        {error ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-red-500 p-2">
            <AlertCircle className="h-6 w-6 mb-1" />
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
        ) : thumbnailUrl && !imageError ? (
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
            <FileText className="h-12 w-12 text-gray-400" />
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
          <span>{formatFileSize(file.size)}</span>
          {pageCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {pageCount} page{pageCount !== 1 ? "s" : ""}
            </Badge>
          )}
        </div>

        {error && (
          <div className="text-xs text-red-500 truncate" title={error}>
            {error.includes("worker") ? "Fallback preview active" : error}
          </div>
        )}
      </div>
    </Card>
  );
}

function formatFileSize(bytes: number): string {
  if (!bytes) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}