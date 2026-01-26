import React, { useId, useMemo, useCallback } from "react";
import { DocumentCard } from "./DocumentCard";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  Announcements,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from "@/components/ui/button";

interface FileWithId {
  file: File;
  id: string;
}

interface DocumentsListProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  title?: string;
}

interface SortableDocumentCardProps {
  file: File;
  id: string;
  onRemove: () => void;
}

function SortableDocumentCard({ file, id, onRemove }: SortableDocumentCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <DocumentCard
        file={file}
        onRemove={onRemove}
        showPages={true}
        dragListeners={listeners}
        isDragging={isDragging}
      />
    </div>
  );
}

// Generate stable unique ID for a file
function generateFileId(file: File, instanceId: string, index: number): string {
  // Use lastModified for more uniqueness, with instanceId to prevent cross-list conflicts
  return `${instanceId}-${file.name}-${file.size}-${file.lastModified}-${index}`;
}

export function DocumentsList({ 
  files, 
  onFilesChange, 
  title = "Documents",
}: DocumentsListProps) {
  const instanceId = useId();
  
  // Create stable IDs for files - memoized to prevent unnecessary recalculations
  const filesWithIds = useMemo<FileWithId[]>(() => 
    files.map((file, index) => ({
      file,
      id: generateFileId(file, instanceId, index),
    }))
  , [files, instanceId]);

  // Create a map for O(1) lookups
  const idToIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    filesWithIds.forEach((item, index) => {
      map.set(item.id, index);
    });
    return map;
  }, [filesWithIds]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Prevent accidental drags
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const removeFile = useCallback((index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  }, [files, onFilesChange]);

  const clearAllFiles = useCallback(() => {
    onFilesChange([]);
  }, [onFilesChange]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const activeIndex = idToIndexMap.get(active.id as string);
    const overIndex = idToIndexMap.get(over.id as string);

    if (activeIndex !== undefined && overIndex !== undefined) {
      const newFiles = arrayMove(files, activeIndex, overIndex);
      onFilesChange(newFiles);
    }
  }, [files, onFilesChange, idToIndexMap]);

  // Custom announcements for screen readers
  const customAnnouncements = useMemo(() => ({
    onDragStart({ active }: DragStartEvent) {
      const index = idToIndexMap.get(active.id as string);
      if (index !== undefined) {
        return `Picked up ${files[index].name}. Use arrow keys to move, space to drop.`;
      }
      return "Picked up document.";
    },
    onDragOver({ active, over }: { active: any; over: any }) {
      if (over) {
        const activeIndex = idToIndexMap.get(active.id as string);
        const overIndex = idToIndexMap.get(over.id as string);
        if (activeIndex !== undefined && overIndex !== undefined) {
          return `${files[activeIndex].name} is over position ${overIndex + 1}.`;
        }
      }
      return undefined;
    },
    onDragEnd({ active, over }: DragEndEvent) {
      const activeIndex = idToIndexMap.get(active.id as string);
      if (over && activeIndex !== undefined) {
        const overIndex = idToIndexMap.get(over.id as string);
        if (overIndex !== undefined) {
          return `${files[activeIndex].name} dropped at position ${overIndex + 1}.`;
        }
      }
      return "Dropped.";
    },
    onDragCancel({ active }: { active: any }) {
      const index = idToIndexMap.get(active.id as string);
      if (index !== undefined) {
        return `Dragging cancelled. ${files[index].name} returned to position ${index + 1}.`;
      }
      return "Dragging cancelled.";
    },
  }), [files, idToIndexMap]);

  if (files.length === 0) {
    return null;
  }

  const itemIds = filesWithIds.map(item => item.id);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title} ({files.length})
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAllFiles}
          aria-label={`Clear all ${files.length} documents`}
          className="text-sm text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
        >
          Clear All
        </Button>
      </div>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        accessibility={{
          announcements: customAnnouncements,
          screenReaderInstructions: {
            draggable: "To pick up a document, press space or enter. Use arrow keys to move. Press space or enter again to drop, or escape to cancel.",
          },
        }}
      >
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          <ul className="space-y-3" role="list" aria-label={`${title} list, draggable`}>
            {filesWithIds.map((item, index) => (
              <li key={item.id}>
                <SortableDocumentCard
                  id={item.id}
                  file={item.file}
                  onRemove={() => removeFile(index)}
                />
              </li>
            ))}
          </ul>
        </SortableContext>
      </DndContext>
      
      {/* Live region for announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only" />
    </div>
  );
}