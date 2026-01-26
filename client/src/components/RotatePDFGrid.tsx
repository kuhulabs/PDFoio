import React, { useState, useEffect, useCallback, memo } from 'react';
import { FileText, Download, RotateCw, RotateCcw, Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SinglePDFThumbnail } from '@/components/SinglePDFThumbnail';
import { cn } from '@/lib/utils'; // Assuming Shadcn utility

interface PDFPage {
  id: string;
  pageNumber: number;
  rotation: number;
}

interface RotatePDFGridProps {
  file: File;
  pages: PDFPage[];
  onRotate: (updatedPages: PDFPage[]) => void;
  isProcessing: boolean;
}

// ==========================================
// 1. MEMOIZED PAGE CARD COMPONENT
// ==========================================
// This prevents the heavy PDF Thumbnail from re-rendering unless ITS specific props change.
const RotatablePageCard = memo(({ 
  page, 
  file, 
  onRotate 
}: { 
  page: PDFPage; 
  file: File; 
  onRotate: (id: string, deg: number) => void 
}) => {
  return (
    <div className="group relative bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg ring-1 ring-gray-200 dark:ring-gray-600">
      
      {/* Rotation Controls - Always visible on mobile/focus, hover on desktop */}
      <div className="absolute top-2 left-2 right-2 flex justify-between z-20 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100 transition-opacity duration-200">
        <button
          onClick={() => onRotate(page.id, -90)}
          className="w-8 h-8 bg-black/50 hover:bg-blue-600 text-white backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-colors"
          title="Rotate Left (-90°)"
          aria-label={`Rotate page ${page.pageNumber} left`}
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={() => onRotate(page.id, 90)}
          className="w-8 h-8 bg-black/50 hover:bg-blue-600 text-white backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-colors"
          title="Rotate Right (90°)"
          aria-label={`Rotate page ${page.pageNumber} right`}
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>

      {/* Page Number Badge */}
      <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded-full font-medium z-10 pointer-events-none">
        Page {page.pageNumber}
      </div>

      {/* Rotation Indicator Badge */}
      {page.rotation !== 0 && (
        <div className="absolute bottom-2 right-2 bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold z-10 shadow-sm pointer-events-none">
          {page.rotation}°
        </div>
      )}

      {/* Page Content Container */}
      <div className="aspect-[3/4] p-3 bg-gray-50 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
        {/* The Rotation Wrapper */}
        <div 
          className="relative w-full h-full transition-transform duration-300 ease-in-out shadow-sm"
          style={{ transform: `rotate(${page.rotation}deg)` }}
        >
           {/* Performance Note: Ensure SinglePDFThumbnail handles 
              canvas sizing correctly when rotated parent changes dimensions.
           */}
          <SinglePDFThumbnail 
            file={file} 
            pageNumber={page.pageNumber}
            className="w-full h-full object-contain bg-white rounded-sm"
          />
        </div>
      </div>

      {/* Visual cue for non-zero rotation */}
      {page.rotation !== 0 && (
        <div className="absolute inset-0 border-2 border-orange-400/50 rounded-xl pointer-events-none" />
      )}
    </div>
  );
}, (prev, next) => {
  // Custom comparison to strictly limit re-renders
  return prev.page.rotation === next.page.rotation && prev.page.id === next.page.id && prev.file === next.file;
});

RotatablePageCard.displayName = 'RotatablePageCard';


// ==========================================
// 2. MAIN GRID COMPONENT
// ==========================================
export function RotatePDFGrid({ file, pages, onRotate, isProcessing }: RotatePDFGridProps) {
  const [currentPages, setCurrentPages] = useState<PDFPage[]>([]);

  useEffect(() => {
    if (pages.length > 0) setCurrentPages(pages);
  }, [pages]);

  // 2. LOGIC FIX: Normalized rotation (0-360 positive integers)
  const normalizeRotation = (current: number, change: number) => {
    return (current + change + 360) % 360;
  };

  const handlePageRotate = useCallback((pageId: string, degrees: number) => {
    setCurrentPages(prev => prev.map(page =>
      page.id === pageId 
        ? { ...page, rotation: normalizeRotation(page.rotation, degrees) }
        : page
    ));
  }, []);

  const rotateAllPages = (degrees: number) => {
    setCurrentPages(prev => prev.map(page => ({
      ...page,
      rotation: normalizeRotation(page.rotation, degrees)
    })));
  };

  const resetRotations = () => {
    setCurrentPages(prev => prev.map(page => ({ ...page, rotation: 0 })));
  };

  const hasChanges = currentPages.some(page => page.rotation !== 0);

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <RotateCw className="w-5 h-5 text-blue-500" />
              Rotate Pages
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {hasChanges 
                ? `${currentPages.filter(p => p.rotation !== 0).length} pages modified` 
                : "Select pages to rotate or use global controls"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => rotateAllPages(90)}
              variant="outline"
              className="gap-2 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20"
            >
              <RotateCw className="w-4 h-4" />
              <span className="hidden sm:inline">All Right 90°</span>
              <span className="sm:hidden">All 90°</span>
            </Button>
            
            <Button
              onClick={() => rotateAllPages(-90)}
              variant="outline"
              className="gap-2 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">All Left 90°</span>
              <span className="sm:hidden">All -90°</span>
            </Button>

            <Button
              onClick={resetRotations}
              disabled={!hasChanges}
              variant="ghost"
              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
            >
              <Undo2 className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
        {currentPages.map((page) => (
          <RotatablePageCard
            key={page.id}
            page={page}
            file={file}
            onRotate={handlePageRotate}
          />
        ))}
      </div>

      {/* Apply Action Bar */}
      <div className={cn(
        "sticky bottom-6 flex justify-center transition-all duration-300 transform",
        hasChanges ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"
      )}>
        <Button
          onClick={() => onRotate(currentPages)}
          disabled={isProcessing}
          size="lg"
          className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-6 rounded-full shadow-2xl hover:shadow-orange-500/25 transition-all active:scale-95"
        >
          {isProcessing ? (
             <span className="flex items-center gap-2">
               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
               Processing PDF...
             </span>
          ) : (
             <span className="flex items-center gap-2 text-lg">
               <Download className="w-5 h-5" /> 
               Apply Rotation
             </span>
          )}
        </Button>
      </div>
    </div>
  );
}
