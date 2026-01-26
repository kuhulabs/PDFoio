import React, { useState, useMemo, memo } from 'react';
import { Scissors, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SinglePDFThumbnail } from '@/components/SinglePDFThumbnail';
import { cn } from '@/lib/utils'; // Assuming standard shadcn utility

// --- Types ---

interface PDFPage {
  id: string;
  pageNumber: number;
}

interface SplitPoint {
  id: string;
  afterPage: number;
}

interface SplitPDFGridProps {
  file: File;
  pages: PDFPage[];
  onSplit: (splitPoints: SplitPoint[]) => void;
  isProcessing: boolean;
}

// --- Constants ---

const GROUP_COLORS = [
  { border: 'border-blue-500', bg: 'bg-blue-500', text: 'text-blue-700', bgLight: 'bg-blue-50' },
  { border: 'border-green-500', bg: 'bg-green-500', text: 'text-green-700', bgLight: 'bg-green-50' },
  { border: 'border-purple-500', bg: 'bg-purple-500', text: 'text-purple-700', bgLight: 'bg-purple-50' },
  { border: 'border-orange-500', bg: 'bg-orange-500', text: 'text-orange-700', bgLight: 'bg-orange-50' },
  { border: 'border-pink-500', bg: 'bg-pink-500', text: 'text-pink-700', bgLight: 'bg-pink-50' },
  { border: 'border-teal-500', bg: 'bg-teal-500', text: 'text-teal-700', bgLight: 'bg-teal-50' },
];

const getGroupColor = (index: number) => GROUP_COLORS[index % GROUP_COLORS.length];

// --- Sub-components ---

// 1. Memoized Page Row to prevent re-rendering PDF Thumbnails unnecessarily
const PageRow = memo(({ 
  page, 
  file, 
  groupIndex, 
  isStartOfGroup 
}: { 
  page: PDFPage; 
  file: File; 
  groupIndex: number; 
  isStartOfGroup: boolean 
}) => {
  const colors = getGroupColor(groupIndex);

  return (
    <div className={cn(
      "relative rounded-xl p-4 border-2 transition-all duration-300",
      colors.border,
      colors.bgLight,
      "dark:bg-gray-800"
    )}>
      {/* Group Label */}
      {isStartOfGroup && (
        <div className={cn(
          "absolute -top-3 left-4 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm",
          colors.bg,
          "text-white"
        )}>
          File {groupIndex + 1}
        </div>
      )}

      <div className="flex items-center gap-6">
        {/* Thumbnail */}
        <div className="w-20 h-28 flex-shrink-0 relative shadow-md rounded-md overflow-hidden bg-white">
          <SinglePDFThumbnail 
            file={file} 
            pageNumber={page.pageNumber}
            className="w-full h-full object-contain"
          />
          <div className="absolute bottom-0 right-0 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-tl-md font-medium">
            {page.pageNumber}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            Page {page.pageNumber}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Original: {file.name}
          </p>
        </div>
      </div>
    </div>
  );
}, (prev, next) => {
  // Only re-render if group index changes or page ID changes
  return prev.groupIndex === next.groupIndex && prev.page.id === next.page.id && prev.isStartOfGroup === next.isStartOfGroup;
});

PageRow.displayName = 'PageRow';


// --- Main Component ---

export function SplitPDFGrid({ file, pages, onSplit, isProcessing }: SplitPDFGridProps) {
  const [splitPoints, setSplitPoints] = useState<SplitPoint[]>([]);

  // Toggle split logic
  const toggleSplit = (afterPage: number) => {
    setSplitPoints(prev => {
      const exists = prev.some(sp => sp.afterPage === afterPage);
      if (exists) {
        return prev.filter(sp => sp.afterPage !== afterPage);
      } else {
        const newSplit = { id: `split-${afterPage}-${Date.now()}`, afterPage };
        return [...prev, newSplit].sort((a, b) => a.afterPage - b.afterPage);
      }
    });
  };

  // Calculate groups based on split points
  const { groups, pageToGroupMap } = useMemo(() => {
    const calculatedGroups: PDFPage[][] = [];
    const map = new Map<number, number>(); // Map pageNumber -> groupIndex
    
    let currentGroup: PDFPage[] = [];
    let groupIndex = 0;

    pages.forEach(page => {
      currentGroup.push(page);
      map.set(page.pageNumber, groupIndex);

      // If a split exists after this page
      if (splitPoints.some(sp => sp.afterPage === page.pageNumber)) {
        calculatedGroups.push(currentGroup);
        currentGroup = [];
        groupIndex++;
      }
    });

    if (currentGroup.length > 0) calculatedGroups.push(currentGroup);
    
    return { groups: calculatedGroups, pageToGroupMap: map };
  }, [pages, splitPoints]);


  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Header Info */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Scissors className="w-5 h-5 text-blue-500" />
              Split Document
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Click the scissors icon between pages to cut the document.
            </p>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-lg border border-blue-100 dark:border-blue-800">
             <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
               Total Output Files: <span className="text-lg font-bold ml-1">{groups.length}</span>
             </span>
          </div>
        </div>
      </div>

      {/* Pages List */}
      <div className="space-y-0"> 
        {pages.map((page, index) => {
          const isLastPage = index === pages.length - 1;
          const hasSplit = splitPoints.some(sp => sp.afterPage === page.pageNumber);
          const groupIndex = pageToGroupMap.get(page.pageNumber) ?? 0;
          const isStartOfGroup = index === 0 || splitPoints.some(sp => sp.afterPage === page.pageNumber - 1);

          return (
            <div key={page.id} className="relative">
              {/* The Page Row */}
              <PageRow 
                page={page} 
                file={file} 
                groupIndex={groupIndex} 
                isStartOfGroup={isStartOfGroup}
              />

              {/* The Split Control Area (Between Pages) */}
              {!isLastPage && (
                <div className="relative py-4 flex items-center justify-center group z-10">
                  {/* The visual line */}
                  <div className={cn(
                    "absolute inset-x-8 top-1/2 h-0.5 transition-all duration-300",
                    hasSplit ? "bg-red-500 opacity-100" : "bg-gray-200 dark:bg-gray-700 group-hover:bg-blue-300 border-dashed border-t-2 border-gray-300 dark:border-gray-600 h-0"
                  )} />

                  {/* The Interaction Button */}
                  <button
                    onClick={() => toggleSplit(page.pageNumber)}
                    className={cn(
                      "relative z-20 flex items-center gap-2 px-4 py-1.5 rounded-full shadow-sm border transition-all duration-200 transform hover:scale-105 active:scale-95",
                      hasSplit 
                        ? "bg-red-500 border-red-600 text-white hover:bg-red-600" 
                        : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 hover:border-blue-500 hover:text-blue-600"
                    )}
                    aria-label={hasSplit ? "Remove split" : "Add split"}
                  >
                    {hasSplit ? (
                      <>
                        <Trash2 className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wide">Remove Cut</span>
                      </>
                    ) : (
                      <>
                        <Scissors className="w-4 h-4" />
                        <span className="text-xs font-medium uppercase tracking-wide">Split Here</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary & Action */}
      <div className="sticky bottom-6 z-30 flex flex-col items-center gap-4">
        {splitPoints.length > 0 && (
          <div className="w-full max-w-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl p-4 animate-in slide-in-from-bottom-4 fade-in duration-300">
             <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Output Preview</h4>
             <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {groups.map((g, i) => (
                  <div key={i} className={cn("flex-shrink-0 px-3 py-2 rounded-lg border text-sm", getGroupColor(i).bgLight, getGroupColor(i).border)}>
                    <span className={cn("font-bold block", getGroupColor(i).text)}>File {i + 1}</span>
                    <span className="text-gray-500 text-xs">Pages {g[0].pageNumber}-{g[g.length-1].pageNumber}</span>
                  </div>
                ))}
             </div>
          </div>
        )}

        <Button
          onClick={() => onSplit(splitPoints)}
          disabled={splitPoints.length === 0 || isProcessing}
          size="lg"
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 rounded-full shadow-2xl hover:shadow-green-500/25 transition-all active:scale-95 min-w-[200px]"
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </span>
          ) : (
            <span className="flex items-center gap-2 text-lg">
              <Download className="w-5 h-5" />
              Download {groups.length} PDF{groups.length !== 1 && 's'}
            </span>
          )}
        </Button>
      </div>

    </div>
  );
}
