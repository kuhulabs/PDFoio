import React, { useState, useEffect } from "react";
import { Trash2, RotateCcw, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SinglePDFThumbnail } from "@/components/SinglePDFThumbnail";
import { cn } from "@/lib/utils";

interface PDFPage {
  id: string;
  pageNumber: number;
  deleted: boolean;
  originalIndex: number;
}

interface DeletePDFGridProps {
  file: File;
  pages: PDFPage[];
  onUpdatePages?: (updatedPages: PDFPage[]) => void;
  onToggleDelete?: (id: string) => void;
  isProcessing: boolean;
}

export function DeletePDFGrid({
  file,
  pages,
  onUpdatePages,
  onToggleDelete,
  isProcessing,
}: DeletePDFGridProps) {
  // If parent handles state (onToggleDelete), use it. Otherwise use local state (fallback).
  const [localPages, setLocalPages] = useState<PDFPage[]>(pages);

  useEffect(() => {
    setLocalPages(pages);
  }, [pages]);

  const handleToggle = (id: string) => {
    if (onToggleDelete) {
      onToggleDelete(id);
    } else {
      // Fallback local logic
      const updated = localPages.map((p) =>
        p.id === id ? { ...p, deleted: !p.deleted } : p,
      );
      setLocalPages(updated);
      onUpdatePages?.(updated);
    }
  };

  const handleSelectAll = () => {
    if (onUpdatePages) {
      onUpdatePages(pages.map((p) => ({ ...p, deleted: true })));
    }
  };

  const handleReset = () => {
    if (onUpdatePages) {
      onUpdatePages(pages.map((p) => ({ ...p, deleted: false })));
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card border rounded-xl p-4 shadow-sm">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Select Pages to Remove
          </h3>
          <p className="text-xs text-muted-foreground">
            Tap a page to mark it for deletion.
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
            className="flex-1 sm:flex-none text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            Select All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="flex-1 sm:flex-none text-green-600 border-green-200 hover:bg-green-50 dark:hover:bg-green-900/20"
          >
            Reset
          </Button>
        </div>
      </div>

      {/* 2. Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {localPages.map((page) => (
          <div
            key={page.id}
            onClick={() => !isProcessing && handleToggle(page.id)}
            className={cn(
              "group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-200 border-2",
              page.deleted
                ? "bg-red-50 dark:bg-red-900/20 border-red-500 scale-95 opacity-80"
                : "bg-white dark:bg-gray-800 border-transparent hover:border-blue-400 hover:shadow-md dark:hover:border-blue-600",
            )}
          >
            {/* Action Icon (Overlay) */}
            <div
              className={cn(
                "absolute top-2 right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm",
                page.deleted
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-white dark:bg-gray-700 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-gray-600",
              )}
            >
              {page.deleted ? (
                <RotateCcw className="w-4 h-4" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </div>

            {/* Page Number */}
            <div
              className={cn(
                "absolute top-2 left-2 z-10 text-xs font-bold px-2 py-1 rounded-full shadow-sm",
                page.deleted
                  ? "bg-red-500 text-white"
                  : "bg-gray-900/80 text-white dark:bg-white/90 dark:text-black",
              )}
            >
              {page.pageNumber}
            </div>

            {/* Deleted Stamp Overlay */}
            {page.deleted && (
              <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none bg-red-500/10">
                <span className="bg-red-600 text-white px-3 py-1 rounded text-xs font-bold tracking-widest uppercase transform -rotate-12 shadow-lg border-2 border-white/20">
                  Deleted
                </span>
              </div>
            )}

            {/* Thumbnail */}
            <div className="aspect-[3/4] p-3">
              <div
                className={cn(
                  "w-full h-full rounded overflow-hidden transition-opacity",
                  page.deleted ? "opacity-50 grayscale" : "",
                )}
              >
                <SinglePDFThumbnail
                  file={file}
                  pageNumber={page.pageNumber}
                  className="w-full h-full object-contain pointer-events-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
