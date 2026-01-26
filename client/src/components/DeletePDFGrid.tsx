import React, { useState, useEffect } from 'react';
import { Download, X, Trash2, RotateCcw } from 'lucide-react'; // Removed FileText
import { Button } from '@/components/ui/button';
import { SinglePDFThumbnail } from '@/components/SinglePDFThumbnail';

interface PDFPage {
  id: string;
  pageNumber: number;
  deleted: boolean;
}

interface DeletePDFGridProps {
  file: File;
  pages: PDFPage[];
  onDelete: (updatedPages: PDFPage[]) => void;
  isProcessing: boolean;
}

export function DeletePDFGrid({ file, pages, onDelete, isProcessing }: DeletePDFGridProps) {
  const [currentPages, setCurrentPages] = useState<PDFPage[]>(pages);

  // Fixed: Always sync when pages prop changes
  useEffect(() => {
    setCurrentPages(pages);
  }, [pages]);

  const togglePageDeletion = (pageId: string) => {
    setCurrentPages(prev => 
      prev.map(page =>
        page.id === pageId ? { ...page, deleted: !page.deleted } : page
      )
    );
  };

  const deleteAllPages = () => {
    setCurrentPages(prev => prev.map(page => ({ ...page, deleted: true })));
  };

  const restoreAllPages = () => {
    setCurrentPages(prev => prev.map(page => ({ ...page, deleted: false })));
  };

  const deletedCount = currentPages.filter(p => p.deleted).length;
  const remainingCount = currentPages.filter(p => !p.deleted).length;
  const hasChanges = currentPages.some(p => p.deleted);
  const canApply = hasChanges && remainingCount > 0 && !isProcessing;

  const handleApplyDeletions = () => {
    if (canApply) {
      onDelete(currentPages);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            PDF Pages ({currentPages.length})
          </h3>
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Click X to mark pages for deletion
            </p>
            <div className="flex gap-2">
              {remainingCount > 0 && (
                <Button
                  onClick={deleteAllPages}
                  variant="outline"
                  size="sm"
                  aria-label="Mark all pages for deletion"
                  className="text-red-600 dark:text-red-400 border-red-300 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Delete All
                </Button>
              )}
              {deletedCount > 0 && (
                <Button
                  onClick={restoreAllPages}
                  variant="outline"
                  size="sm"
                  aria-label="Restore all deleted pages"
                  className="text-green-600 dark:text-green-400 border-green-300 dark:border-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Restore All
                </Button>
              )}
            </div>
          </div>
        </div>

        <div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          role="list"
          aria-label="PDF pages"
        >
          {currentPages.map((page) => (
            <div
              key={page.id}
              role="listitem"
              className={`group relative rounded-xl overflow-hidden transition-all duration-300 ${
                page.deleted
                  ? 'bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-600 opacity-50 scale-95'
                  : 'bg-gray-100 dark:bg-gray-700 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 hover:scale-105 hover:shadow-lg'
              }`}
            >
              <button
                onClick={() => togglePageDeletion(page.id)}
                aria-label={page.deleted ? `Restore page ${page.pageNumber}` : `Delete page ${page.pageNumber}`}
                aria-pressed={page.deleted}
                className={`absolute top-2 right-2 z-10 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                  page.deleted
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-red-500 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 focus:opacity-100'
                }`}
              >
                {page.deleted ? (
                  <RotateCcw className="w-3 h-3" />
                ) : (
                  <X className="w-3 h-3" />
                )}
              </button>

              <div className={`absolute top-2 left-2 text-xs px-2 py-1 rounded-full font-semibold ${
                page.deleted ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
              }`}>
                {page.pageNumber}
              </div>

              {page.deleted && (
                <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center pointer-events-none">
                  <span className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                    DELETED
                  </span>
                </div>
              )}

              <div className="aspect-[3/4] p-2">
                <SinglePDFThumbnail 
                  file={file} 
                  pageNumber={page.pageNumber}
                  className="w-full h-full rounded border border-gray-300 dark:border-gray-600"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Rest of the component stays the same... */}
      </div>

      <div className="flex justify-center">
        <Button
          onClick={handleApplyDeletions}
          disabled={!canApply}
          size="lg"
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 className="w-5 h-5 mr-2" /> {/* Fixed: Changed from Download */}
          {isProcessing ? (
            <span className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Deleting Pages...
            </span>
          ) : (
            `Delete ${deletedCount} Page${deletedCount !== 1 ? 's' : ''}`
          )}
        </Button>
      </div>
      {/* ... rest of component */}
    </div>
  );
}