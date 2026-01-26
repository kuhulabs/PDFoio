import { TOOL_SEO } from "@/seo/seo";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { FileUpload } from "@/components/FileUpload";
import { ToolFooter } from "@/components/ToolFooter";
import { ProgressBar } from "@/components/ProgressBar";
import { BuyMeCoffeeButton } from "@/components/BuyMeCoffeeButton";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/SEOHead";
import { convertImagesToPDF, downloadBlob, type ImageToPDFOptions } from "@/lib/realPdfUtils";
import { useToast } from "@/hooks/use-toast";
import { trackToolUsage } from "@/lib/analytics";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ImageFile {
  id: string;
  file: File;
  preview: string;
}

function SortableImageItem({
  image,
  onRemove,
}: {
  image: ImageFile;
  onRemove: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-2 ${isDragging ? 'shadow-xl' : 'shadow-sm'}`}
    >
      <div 
        {...attributes} 
        {...listeners} 
        className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 mb-2 cursor-grab active:cursor-grabbing"
      >
        <img 
          src={image.preview} 
          alt={image.file.name}
          className="w-full h-full object-cover"
        />
      </div>
      <p className="text-[10px] text-gray-500 dark:text-gray-400 text-center truncate">
        {image.file.name}
      </p>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(image.id);
        }}
        className="absolute top-1 left-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
        title="Remove image"
      >
        ✕
      </button>
      <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <i className="fas fa-arrows-alt"></i>
      </div>
    </div>
  );
}

export default function PNGToPDF() {
  const seoData = TOOL_SEO['png-to-pdf'];
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedFile, setConvertedFile] = useState<Blob | null>(null);
  const { toast } = useToast();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleFilesSelected = async (files: File[]) => {
    const imageFiles: ImageFile[] = [];
    
    for (const file of files) {
      if (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg') {
        const preview = URL.createObjectURL(file);
        imageFiles.push({
          id: `${file.name}-${Date.now()}-${Math.random()}`,
          file,
          preview,
        });
      }
    }
    
    if (imageFiles.length === 0) {
      toast({
        title: "No valid images",
        description: "Please select PNG or JPG image files.",
        variant: "destructive",
      });
      return;
    }
    
    setImages(prev => [...prev, ...imageFiles]);
    setConvertedFile(null);
  };

  const handleRemoveImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
    setConvertedFile(null);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setImages((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleDownload = () => {
    if (!convertedFile) return;
    downloadBlob(convertedFile, 'PDFo_PNGToPDF.pdf');
  };

  const handleCreatePDF = async () => {
    if (images.length === 0) return;
    
    setIsProcessing(true);
    setProgress(0);
    try {
      setProgress(25);
      const files = images.map(img => img.file);
      const options: ImageToPDFOptions = { pageSize: 'A4' };
      setProgress(70);
      const pdfBlob = await convertImagesToPDF(files, options);
      setProgress(100);
      setConvertedFile(pdfBlob);
      
      // Track usage
      await trackToolUsage("PNG to PDF", "conversion", images.length);
      
      toast({
        title: "Success!",
        description: "PNG images have been converted to PDF successfully. Download button available below.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to convert images to PDF. Please try again.",
        variant: "destructive",
      });
      setProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <SEOHead 
        title={seoData.title}
        description={seoData.metaDescription}
        keywords={(seoData as any).keywords || ""}
        canonicalUrl="https://pdfo.io/png-to-pdf"
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to Tools */}
        <div className="mb-8">
          <Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center text-sm" data-testid="link-back-home">
            ← Back to Tools
          </Link>
        </div>

        {/* Tool Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-lime-500 rounded-2xl flex items-center justify-center text-white text-xl mx-auto mb-4" role="img" aria-label="PNG to PDF conversion tool">
            <i className="fas fa-file-image" aria-hidden="true"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">PNG to PDF</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
            Convert PNG images to a single PDF document
          </p>
          
          {/* Features */}
          <div className="flex justify-center gap-6 mt-6 text-sm">
            <div className="flex items-center text-green-600">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Drag & Drop Order
            </div>
            <div className="flex items-center text-green-600">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              High Quality PDF
            </div>
            <div className="flex items-center text-green-600">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Free & Secure
            </div>
          </div>
        </div>

        {images.length === 0 ? (
          <FileUpload
            onFilesSelected={handleFilesSelected}
            acceptMultiple={true}
            accept="image/png,image/jpeg,image/jpg"
            title="Drag and drop PNG files here"
            subtitle="or click to select PNG images"
          />
        ) : (
          <>
            {/* Summary Info Card */}
            <div className="bg-gradient-to-r from-lime-50 to-green-50 dark:from-lime-900/20 dark:to-green-900/20 border-2 border-lime-200 dark:border-lime-700 rounded-lg p-4 mb-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-12 h-12 bg-lime-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                    <i className="fas fa-images text-xl"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{images.length} Image{images.length > 1 ? 's' : ''} Ready</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Total Size: {(images.reduce((sum, img) => sum + img.file.size, 0) / 1024).toFixed(2)} KB
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-lime-100 dark:bg-lime-800 text-lime-800 dark:text-lime-100">
                        <i className="fas fa-file-pdf mr-1"></i>
                        Ready to Convert
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setImages([]);
                    setConvertedFile(null);
                  }}
                  className="ml-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  title="Remove all images"
                  data-testid="button-remove-all"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Image Order ({images.length} images)
              </h3>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Drag and drop to reorder images. The order here will be the page order in your PDF.
              </p>
              
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={images.map(img => img.id)} strategy={verticalListSortingStrategy}>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {images.map((image) => (
                      <SortableImageItem key={image.id} image={image} onRemove={handleRemoveImage} />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
              
              <div className="mt-6">
                <Button
                  onClick={handleCreatePDF}
                  disabled={isProcessing}
                  className="w-full bg-lime-600 hover:bg-lime-700 text-white"
                >
                  {isProcessing ? "Creating PDF..." : "Convert PNG to PDF"}
                </Button>
              </div>
            </div>
            
            <ProgressBar 
              progress={progress} 
              isVisible={isProcessing} 
              color="lime"
              className="mt-6"
            />
            
            {/* Download Button */}
            {convertedFile && !isProcessing && (
              <div className="text-center space-y-4 mt-6">
                <Button
                  onClick={handleDownload}
                  size="lg"
                  className="bg-green-500 hover:bg-green-600 text-white px-8"
                >
                  <i className="fas fa-download mr-2"></i>
                  Download PDF
                </Button>
                <BuyMeCoffeeButton />
              </div>
            )}
            
            {!convertedFile && !isProcessing && (
              <div className="text-center mt-6">
                <BuyMeCoffeeButton />
              </div>
            )}
          </>
        )}
      </div>

      <ToolFooter />
    </>
  );
}