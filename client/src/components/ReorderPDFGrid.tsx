import React, { useState, memo } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ChevronLeft, ChevronRight } from "lucide-react";
import { SinglePDFThumbnail } from "@/components/SinglePDFThumbnail";
import { Button } from "@/components/ui/button";

// --- Types ---

interface PDFPage {
  id: string;
  pageNumber: number;
  originalIndex?: number; 
}

interface ReorderPDFGridProps {
  file: File;
  pages: PDFPage[];
  onReorder: (reorderedPages: PDFPage[]) => void;
  isProcessing: boolean;
}

interface SortablePageProps {
  page: PDFPage;
  file: File;
  index: number;
  total: number;
  disabled?: boolean;
  onMove: (index: number, direction: 'left' | 'right') => void;
}

// ================================
// SORTABLE CARD (Memoized)
// ================================

const SortablePage = memo(function SortablePage({
  page,
  file,
  index,
  total,
  disabled,
  onMove
}: SortablePageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: page.id,
    disabled,
    data: { page },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group select-none outline-none ${
        isDragging ? "opacity-50 z-50" : "opacity-100"
      }`}
    >
      <div
        className={`
          bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 
          transition-all duration-200 p-2 h-full relative
          ${!disabled && !isDragging && "hover:border-primary/50 hover:shadow-md"}
        `}
      >
        {/* 1. Grip Handle - Always Visible Now */}
        <div
          {...attributes}
          {...listeners}
          className={`
            absolute top-3 left-3 z-20 p-1.5 rounded-md bg-white/90 dark:bg-black/80 
            backdrop-blur-sm border border-gray-200 dark:border-gray-800 shadow-sm cursor-grab active:cursor-grabbing
            ${disabled ? "hidden" : "flex"}
          `}
        >
          <GripVertical size={14} className="text-gray-500" />
        </div>

        {/* Page Number Badge */}
        <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-gray-900/80 dark:bg-gray-100/90 text-white dark:text-gray-900 text-[10px] font-bold backdrop-blur-sm shadow-sm">
          {page.pageNumber}
        </div>

        {/* Thumbnail Container */}
        <div className="aspect-[3/4] w-full overflow-hidden rounded-md bg-gray-100 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 mb-2">
          <SinglePDFThumbnail file={file} pageNumber={page.pageNumber} />
        </div>

        <div className="flex items-center justify-between mt-2">
           {/* 2. Move Left Button */}
           <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            disabled={index === 0 || disabled}
            onClick={(e) => {
              e.stopPropagation(); // Prevent drag start
              onMove(index, 'left');
            }}
          >
            <ChevronLeft size={14} />
          </Button>

          <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
            Page {page.pageNumber}
          </span>

          {/* 3. Move Right Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            disabled={index === total - 1 || disabled}
            onClick={(e) => {
              e.stopPropagation(); // Prevent drag start
              onMove(index, 'right');
            }}
          >
            <ChevronRight size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
});

// ================================
// MAIN GRID COMPONENT
// ================================

export function ReorderPDFGrid({
  file,
  pages,
  onReorder,
  isProcessing,
}: ReorderPDFGridProps) {
  const [activePage, setActivePage] = useState<PDFPage | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250, // Long press for drag
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const page = pages.find((p) => p.id === active.id);
    if (page) {
      setActivePage(page);
      if (navigator.vibrate) navigator.vibrate(50); 
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActivePage(null);

    if (!over || active.id === over.id) return;

    const oldIndex = pages.findIndex((p) => p.id === active.id);
    const newIndex = pages.findIndex((p) => p.id === over.id);

    onReorder(arrayMove(pages, oldIndex, newIndex));
  };

  // 4. Handle Button Click Move
  const handleMove = (index: number, direction: 'left' | 'right') => {
    if (direction === 'left' && index > 0) {
      onReorder(arrayMove(pages, index, index - 1));
    } else if (direction === 'right' && index < pages.length - 1) {
      onReorder(arrayMove(pages, index, index + 1));
    }
  };

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: { opacity: "0.4" },
      },
    }),
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={pages.map((p) => p.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 p-1">
          {pages.map((page, index) => (
            <SortablePage
              key={page.id}
              page={page}
              file={file}
              index={index}
              total={pages.length}
              disabled={isProcessing}
              onMove={handleMove} // Pass the handler
            />
          ))}
        </div>
      </SortableContext>

      <DragOverlay dropAnimation={dropAnimation}>
        {activePage ? (
          <div className="w-full h-full cursor-grabbing">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl border-2 border-primary p-2 scale-105 rotate-2 h-full">
              <div className="aspect-[3/4] overflow-hidden rounded-md bg-gray-50">
                <SinglePDFThumbnail
                  file={file}
                  pageNumber={activePage.pageNumber}
                />
              </div>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
