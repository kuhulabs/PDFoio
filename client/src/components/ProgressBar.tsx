import React from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils"; // Standard Shadcn utility

interface ProgressBarProps {
  progress: number;
  isVisible: boolean;
  /**
   * Pass a Tailwind color class for the indicator (e.g., "bg-green-500")
   * or a raw CSS color string if you modify the style logic.
   */
  indicatorColor?: string; 
  className?: string;
  showLabel?: boolean;
}

export function ProgressBar({ 
  progress, 
  isVisible, 
  indicatorColor = "bg-primary", // Default to primary theme color
  className,
  showLabel = false
}: ProgressBarProps) {
  
  // LOGIC: Use opacity/height for smooth transition instead of returning null
  return (
    <div
      className={cn(
        "transition-all duration-300 ease-in-out overflow-hidden",
        isVisible ? "opacity-100 max-h-20" : "opacity-0 max-h-0",
        className
      )}
      aria-hidden={!isVisible}
    >
      <div className="flex items-center gap-3 mb-1">
        {/* The Progress Bar */}
        <div className="flex-1">
          <Progress 
            value={progress} 
            className={cn(
              "w-full h-2 transition-all",
              // MAGIC: This targets the inner Radix/Shadcn Indicator div
              // We use [&>*] to apply the background color to the direct child
              `[&>*]:${indicatorColor}` 
            )} 
          />
        </div>

        {/* Optional: Percentage Label */}
        {showLabel && (
          <span className="text-xs font-medium text-muted-foreground w-8 text-right">
            {Math.round(progress)}%
          </span>
        )}
      </div>
    </div>
  );
}
