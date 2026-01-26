import React, { useState } from "react";
import { X, ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SinglePDFThumbnail } from "@/components/SinglePDFThumbnail";
import type { DraggableSyntheticListeners } from "@dnd-kit/core";

interface DocumentCardProps {
  file: File;
  onRemove: () => void;
  showPages?: boolean;
  dragListeners?: DraggableSyntheticListeners;
  isDragging?: boolean;
}

export function DocumentCard({ 
  file, 
  onRemove, 
  showPages = true, 
  dragListeners,
  isDragging = false,
}: DocumentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'] as const;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const toggleExpanded = () => setIsExpanded(prev => !prev);

  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm transition-shadow ${
        isDragging ? 'shadow-lg ring-2 ring-blue-500' : ''
      }`}
    >
      <div className="flex items-center space-x-4">
        {/* Drag Handle - Accessible */}
        <button
          type="button"
          className="flex-shrink-0 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 touch-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded p-1"
          aria-label={`Drag to reorder ${file.name}`}
          aria-roledescription="draggable"
          {...dragListeners}
        >
          <GripVertical className="h-5 w-5" />
        </button>
        
        {/* PDF Preview Thumbnail */}
        <div className="flex-shrink-0">
          <SinglePDFThumbnail 
            file={file} 
            className="w-16 h-20 rounded border border-gray-200 dark:border-gray-600"
          />
        </div>
        
        {/* File Information */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p 
                className="text-sm font-medium text-gray-900 dark:text-white truncate" 
                title={file.name}
              >
                {file.name}
              </p>
              <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                <span>{formatFileSize(file.size)}</span>
                <span>PDF Document</span>
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex items-center space-x-2">
              {showPages && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleExpanded}
                  aria-expanded={isExpanded}
                  aria-controls={`pages-${file.name}`}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <span className="text-xs mr-1">
                    {isExpanded ? 'Hide' : 'Show'} Pages
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="h-4 w-4" aria-hidden="true" />
                  )}
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemove}
                aria-label={`Remove ${file.name}`}
                className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Expanded Page Thumbnails */}
      {isExpanded && (
        <div 
          id={`pages-${file.name}`}
          className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
          role="region"
          aria-label={`Page thumbnails for ${file.name}`}
        >
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Page thumbnails will be available in a future update
          </p>
        </div>
      )}
    </div>
  );
}