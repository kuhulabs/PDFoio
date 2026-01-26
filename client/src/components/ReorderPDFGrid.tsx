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
import { GripVertical } from "lucide-react";
import { SinglePDFThumbnail } from "@/components/SinglePDFThumbnail";

// --- Types ---

interface PDFPage {
  id: string;
  pageNumber: number;
  // originalIndex is optional depending on your logic, removing to simplify if not strictly needed
  originalIndex?: number; 
}

interface ReorderPDFGridProps {
  file: File;
  pages: PDFPage[];
  onReorder: (reorderedPages: PDFPage[]) => void; // Standardized name
  isProcessing: boolean;
}

interface SortablePageProps {
  page: PDFPage;
  file: File;
  disabled?: boolean;
}

// ================================
// SORTABLE CARD (Memoized)
// ================================

// 1. PERFORMANCE: Wrapped in memo to prevent re-rendering ALL PDF canvases when dragging ONE item.
const SortablePage = memo(function SortablePage({
  page,
  file,
  disabled,
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
    // 2. MOBILE FIX: Removed 'touchAction: none'. 
    // This allows users to scroll the page by swiping on cards.
    // The TouchSensor delay handles the drag activation.
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`relative group select-none outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg ${
        isDragging ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        className={`
          bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 
          transition-all duration-200 p-2 h-full
          ${!disabled && !isDragging && "hover:border-primary/50 hover:shadow-md cursor-grab active:cursor-grabbing"}
        `}
      >
        {/* Hover Grip Handle - Visual cue only */}
        <div
          className={`
            absolute top-3 left-3 z-10 p-1.5 rounded-md bg-white/90 dark:bg-black/80 
            backdrop-blur-sm border border-gray-200 dark:border-gray-800 shadow-sm
            opacity-0 group-hover:opacity-100 transition-opacity duration-200
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
        <div className="aspect-[3/4] w-full overflow-hidden rounded-md bg-gray-100 dark:bg-gray-950 border border-gray-100 dark:border-gray-800">
          <SinglePDFThumbnail file={file} pageNumber={page.pageNumber} />
        </div>

        <div className="flex items-center justify-center mt-3 text-[11px] font-medium text-gray-500 uppercase tracking-wider">
          Page {page.pageNumber}
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
        distance: 8, // Increased slightly to prevent accidental drags when clicking
      },
    }),
    useSensor(TouchSensor, {
      // 3. UX: This is critical for mobile.
      // Delay allows scrolling (tap+swipe) vs dragging (tap+hold+swipe).
      activationConstraint: {
        delay: 250, 
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
      // Optional: Vibrate on mobile for feedback
      if (navigator.vibrate) navigator.vibrate(50); 
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActivePage(null);

    if (!over || active.id === over.id) return;

    const oldIndex = pages.findIndex((p) => p.id === active.id);
    const newIndex = pages.findIndex((p) => p.id === over.id);

    // Call the parent's handler
    onReorder(arrayMove(pages, oldIndex, newIndex));
  };

  // Smooth drop animation configuration
  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.4",
        },
      },
    }),
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      // Accessibility attributes
      accessibility={{
        screenReaderInstructions: {
          draggable: `To pick up a sortable item, press the space bar. While dragging, use the arrow keys to move the item. Press space again to drop the item in its new position, or press escape to cancel.`,
        }
      }}
    >
      <SortableContext items={pages.map((p) => p.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 p-1">
          {pages.map((page) => (
            <SortablePage
              key={page.id}
              page={page}
              file={file}
              disabled={isProcessing}
            />
          ))}
        </div>
      </SortableContext>

      {/* The DragOverlay needs to be OUTSIDE the SortableContext but inside DndContext.
        It renders the "flying" card.
      */}
      <DragOverlay dropAnimation={dropAnimation}>
        {activePage ? (
          <div className="w-full h-full cursor-grabbing">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl border-2 border-primary p-2 scale-105 rotate-2 transition-transform duration-200 h-full">
              <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-primary text-[10px] font-bold text-white shadow-md">
                {activePage.pageNumber}
              </div>
              
              <div className="aspect-[3/4] overflow-hidden rounded-md bg-gray-50 dark:bg-gray-950">
                {/* Note: This will re-mount the PDF viewer. 
                   If this flashes, you might consider passing a captured image URL 
                   instead of the live component if your PDF library supports it.
                */}
                <SinglePDFThumbnail
                  file={file}
                  pageNumber={activePage.pageNumber}
                />
              </div>
              
              <div className="flex items-center justify-center mt-3 text-[11px] font-bold text-primary uppercase tracking-wider">
                Move to...
              </div>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
