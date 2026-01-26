// 1. FIXED: 'import' must be lowercase
import { useState } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // Assuming standard shadcn utility

interface Tool {
  name: string;
  path: string;
  description: string;
  iconBg: string;
  faIcon: string;
  category: string;
}

interface ToolsFilterProps {
  tools: Tool[];
  onFilteredToolsChange: (filteredTools: Tool[]) => void;
}

const CATEGORIES = {
  ALL: 'all',
  MANIPULATION: 'manipulation',
  SECURITY: 'security', 
  OPTIMIZATION: 'optimization',
  CONVERSION_FROM_PDF: 'conversion_from_pdf',
  CONVERSION_TO_PDF: 'conversion_to_pdf',
} as const;

const CATEGORY_LABELS: Record<string, string> = {
  [CATEGORIES.ALL]: 'All Tools',
  [CATEGORIES.MANIPULATION]: 'Manipulation',
  [CATEGORIES.SECURITY]: 'Security',
  [CATEGORIES.OPTIMIZATION]: 'Optimization', 
  [CATEGORIES.CONVERSION_FROM_PDF]: 'Convert from PDF',
  [CATEGORIES.CONVERSION_TO_PDF]: 'Convert to PDF',
};

export function ToolsFilter({ tools, onFilteredToolsChange }: ToolsFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORIES.ALL);
  const [showFilters, setShowFilters] = useState(false);

  // 2. FIXED: Removed unused 'query' parameter logic
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    
    if (category === CATEGORIES.ALL) {
      onFilteredToolsChange(tools);
    } else {
      const filtered = tools.filter(tool => tool.category === category);
      onFilteredToolsChange(filtered);
    }
  };

  const clearFilters = () => {
    setSelectedCategory(CATEGORIES.ALL);
    onFilteredToolsChange(tools);
    // Optional: Close filter menu on clear
    // setShowFilters(false); 
  };

  const hasActiveFilters = selectedCategory !== CATEGORIES.ALL;

  return (
    <div className="mb-8 space-y-4">

      {/* Filter Toggle Button */}
      <div className="flex justify-center">
        <Button
          variant={hasActiveFilters ? "secondary" : "outline"}
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 transition-all"
        >
          <Filter className="h-4 w-4" />
          Filter Tools
          {hasActiveFilters && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full ml-1">
              1
            </span>
          )}
        </Button>
      </div>

      {/* Category Filters Panel */}
      {showFilters && (
        <div className="bg-card border border-border rounded-lg p-4 animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="flex flex-wrap gap-2 justify-center">
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <Button
                key={key}
                // 3. IMPROVED: Using semantic variants instead of hardcoded colors
                variant={selectedCategory === key ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange(key)}
                className={cn(
                  "transition-all",
                  selectedCategory === key && "shadow-md scale-105"
                )}
              >
                {label}
              </Button>
            ))}
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="flex justify-center mt-4 border-t pt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="flex items-center gap-2 text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
                Reset Filter
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Active Filter Summary (Only shows if filters are hidden but active) */}
      {hasActiveFilters && !showFilters && (
        <div className="text-center text-sm text-muted-foreground animate-in fade-in">
          Showing: <span className="font-medium text-foreground">{CATEGORY_LABELS[selectedCategory]}</span>
        </div>
      )}
    </div>
  );
}
