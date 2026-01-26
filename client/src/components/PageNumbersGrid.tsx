import React, { useState, useMemo } from 'react';
import { FileText, Download, Type, Palette, Check } from 'lucide-react'; // Added Check icon
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { SinglePDFThumbnail } from '@/components/SinglePDFThumbnail';
import { cn } from '@/lib/utils'; // Assuming you have a class merger utility

// ... [Interfaces remain the same] ...
interface PDFPage {
  id: string;
  pageNumber: number;
}

interface PageNumberSettings {
  position: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  format: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  backgroundColor?: string;
  showBackground?: boolean;
  padding?: number;
}

interface PageNumbersGridProps {
  file: File;
  pages: PDFPage[];
  onAddPageNumbers: (settings: PageNumberSettings) => void;
  isProcessing: boolean;
}

// ... [CONSTANTS remain the same] ...
const POSITION_OPTIONS = [
  { value: 'top-left', label: 'Top Left', position: { top: '8px', left: '8px' } },
  { value: 'top-center', label: 'Top Center', position: { top: '8px', left: '50%', transform: 'translateX(-50%)' } },
  { value: 'top-right', label: 'Top Right', position: { top: '8px', right: '8px' } },
  { value: 'bottom-left', label: 'Bottom Left', position: { bottom: '8px', left: '8px' } },
  { value: 'bottom-center', label: 'Bottom Center', position: { bottom: '8px', left: '50%', transform: 'translateX(-50%)' } },
  { value: 'bottom-right', label: 'Bottom Right', position: { bottom: '8px', right: '8px' } },
] as const; // Added as const for type safety

const COLORS = [
  { value: '#000000', label: 'Black' },
  { value: '#333333', label: 'Dark Gray' },
  // ... rest of your colors
  { value: '#FFFFFF', label: 'White' },
  { value: '#0066CC', label: 'Blue' },
];

// ... [Rest of constants] ...

export function PageNumbersGrid({ file, pages, onAddPageNumbers, isProcessing }: PageNumbersGridProps) {
  const [settings, setSettings] = useState<PageNumberSettings>({
    position: 'bottom-center',
    format: 'Page {n} of {total}',
    fontFamily: 'Arial',
    fontSize: 12,
    color: '#000000',
    backgroundColor: '#FFFFFF',
    showBackground: false, // Defaulted to false usually looks cleaner
    padding: 4,
  });

  const handleSettingChange = (key: keyof PageNumberSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Memoize format function to prevent recalculation on every render
  const getFormattedPageNumber = useMemo(() => (pageNum: number, totalPages: number) => {
    return settings.format
      .replace('{n}', pageNum.toString())
      .replace('{total}', totalPages.toString())
      .replace('{page}', pageNum.toString());
  }, [settings.format]);

  const getPositionStyle = () => {
    const position = POSITION_OPTIONS.find(p => p.value === settings.position);
    return position?.position || {};
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- Settings Panel --- */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sticky top-4 h-[calc(100vh-100px)] overflow-y-auto custom-scrollbar">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Type className="w-5 h-5 mr-2" />
              Page Number Settings
            </h3>

            <div className="space-y-6">
              {/* Position Grid */}
              <div>
                <Label className="text-sm font-medium text-gray-900 dark:text-white mb-3 block">
                  Position
                </Label>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {POSITION_OPTIONS.map((pos) => (
                    <button
                      key={pos.value}
                      type="button"
                      onClick={() => handleSettingChange('position', pos.value)}
                      className={cn(
                        "p-3 rounded-lg border-2 transition-all text-xs text-center relative focus:outline-none focus:ring-2 focus:ring-blue-500",
                        settings.position === pos.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 text-gray-600'
                      )}
                      aria-label={`Set position to ${pos.label}`}
                      aria-pressed={settings.position === pos.value}
                    >
                      {/* Visual indicator for position relative to page */}
                      <div className={cn(
                        "w-full h-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-1 mx-auto relative rounded-sm opacity-50",
                        settings.position === pos.value && "border-blue-300 opacity-100"
                      )}>
                        <div className="absolute w-1.5 h-1.5 bg-current rounded-full" style={pos.position as any} />
                      </div>
                      {pos.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Format & Font Family Row */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label className="mb-2 block">Format</Label>
                  <Select value={settings.format} onValueChange={(val) => handleSettingChange('format', val)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {/* Use FORMAT_OPTIONS constant here */}
                      <SelectItem value="Page {n} of {total}">Page 1 of 10</SelectItem>
                      <SelectItem value="{n}">1</SelectItem>
                      <SelectItem value="- {n} -">- 1 -</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-2 block">Font</Label>
                    <Select value={settings.fontFamily} onValueChange={(val) => handleSettingChange('fontFamily', val)}>
                      <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Arial">Arial</SelectItem>
                        <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                        <SelectItem value="Courier New">Courier</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="mb-2 block">Size</Label>
                    <Select value={settings.fontSize.toString()} onValueChange={(val) => handleSettingChange('fontSize', parseInt(val))}>
                      <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10px</SelectItem>
                        <SelectItem value="12">12px</SelectItem>
                        <SelectItem value="14">14px</SelectItem>
                        <SelectItem value="16">16px</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Color Picker Grid */}
              <div>
                <Label className="mb-2 block">Text Color</Label>
                <div className="grid grid-cols-5 gap-2">
                  {COLORS.slice(0, 10).map((color) => ( // Sliced for brevity
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => handleSettingChange('color', color.value)}
                      className={cn(
                        "w-full h-8 rounded-full border border-gray-200 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center",
                        settings.color === color.value ? "ring-2 ring-blue-500 ring-offset-1" : ""
                      )}
                      style={{ backgroundColor: color.value }}
                      title={color.label}
                    >
                      {settings.color === color.value && (
                        <Check className={cn("w-4 h-4", color.value === '#FFFFFF' ? "text-black" : "text-white")} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Preview Grid --- */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Preview
                </h3>
                <p className="text-sm text-gray-500">
                  Showing {pages.length > 8 ? 'first 8' : pages.length} pages
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {/* Performance: Slice pages if list is massive, only show first 8-12 for preview */}
              {pages.slice(0, 12).map((page) => (
                <div
                  key={page.id}
                  className="relative bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden aspect-[3/4] group border border-gray-200 dark:border-gray-600 shadow-sm"
                >
                   {/* Thumbnail */}
                  <div className="h-full w-full p-2">
                     {/* Ensure SinglePDFThumbnail handles loading states gracefully */}
                    <SinglePDFThumbnail 
                      file={file} 
                      pageNumber={page.pageNumber}
                      className="w-full h-full object-contain shadow-sm bg-white"
                    />
                  </div>

                  {/* The Page Number Overlay */}
                  <div
                    className="absolute text-xs pointer-events-none z-10 transition-all duration-200"
                    style={{
                      ...getPositionStyle(),
                      fontFamily: settings.fontFamily,
                      // Scale font size down slightly for thumbnail preview vs real PDF
                      fontSize: `${Math.max(settings.fontSize * 0.7, 8)}px`, 
                      color: settings.color,
                      backgroundColor: settings.showBackground ? settings.backgroundColor || '#FFFFFF' : 'transparent',
                      padding: '2px 4px',
                      borderRadius: '2px',
                      whiteSpace: 'nowrap',
                      // Add a slight shadow to text if no background for readability
                      textShadow: !settings.showBackground ? '0px 0px 2px rgba(255,255,255,0.8)' : 'none'
                    }}
                  >
                    {getFormattedPageNumber(page.pageNumber, pages.length)}
                  </div>
                </div>
              ))}
            </div>
            
            {pages.length > 12 && (
               <p className="text-center text-sm text-gray-500 mt-4 italic">
                 + {pages.length - 12} more pages will follow the same pattern
               </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center sticky bottom-4 z-20">
        <Button
          onClick={() => onAddPageNumbers(settings)}
          disabled={isProcessing}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all rounded-full px-10"
        >
          {isProcessing ? (
             <>Processing...</>
          ) : (
             <><Download className="w-5 h-5 mr-2" /> Apply Page Numbers</>
          )}
        </Button>
      </div>
    </div>
  );
}
