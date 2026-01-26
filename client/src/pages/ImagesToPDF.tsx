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
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ImageFile {
  id: string;
  file: File;
  preview: string;
}

function SortableImageItem({ image, onRemove }: { image: ImageFile, onRemove: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
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
        className="aspect-[3/4] rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 mb-2 cursor-grab active:cursor-grabbing"
      >
        <img 
          src={image.preview} 
          alt={image.file.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex items-center justify-between gap-1">
        <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate flex-1">
          {image.file.name}
        </p>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onRemove(image.id);
          }}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <i className="fas fa-times-circle"></i>
        </button>
      </div>
      <div className="absolute top-1 left-1 bg-blue-500/80 text-white rounded-md px-1.5 py-0.5 text-[10px] pointer-events-none">
        DRAG
      </div>
    </div>
  );
}

export default function ImagesToPDF() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedFile, setConvertedFile] = useState<Blob | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleFilesSelected = async (files: File[]) => {
    const currentCount = images.length;
    const remainingSlots = 10 - currentCount;
    
    if (remainingSlots <= 0) {
      toast({
        title: "Limit Reached",
        description: "You can only upload up to 10 images.",
        variant: "destructive",
      });
      return;
    }

    const filesToAdd = files.slice(0, remainingSlots);
    const newImageFiles: ImageFile[] = [];
    
    for (const file of filesToAdd) {
      if (file.type.startsWith('image/')) {
        const preview = URL.createObjectURL(file);
        newImageFiles.push({
          id: `${file.name}-${Date.now()}-${Math.random()}`,
          file,
          preview,
        });
      }
    }
    
    if (newImageFiles.length === 0) {
      toast({
        title: "No valid images",
        description: "Please select image files (JPG, PNG, etc).",
        variant: "destructive",
      });
      return;
    }

    if (files.length > remainingSlots) {
      toast({
        title: "Partial Upload",
        description: `Only ${remainingSlots} images were added (limit: 10).`,
      });
    }
    
    setImages(prev => [...prev, ...newImageFiles]);
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

  const handleCreatePDF = async () => {
    if (images.length === 0) return;
    
    setIsProcessing(true);
    setProgress(0);
    try {
      setProgress(20);
      const files = images.map(img => img.file);
      const options: ImageToPDFOptions = { pageSize: 'A4' };
      setProgress(60);
      const pdfBlob = await convertImagesToPDF(files, options);
      setProgress(100);
      setConvertedFile(pdfBlob);
      
      // Track analytics
      await trackToolUsage("Images to PDF", "conversion", images.length);
      
      toast({
        title: "Success!",
        description: "Your PDF is ready for download.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create PDF. Please try again.",
        variant: "destructive",
      });
      setProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!convertedFile) return;
    downloadBlob(convertedFile, 'PDFo_ImagesToPDF.pdf');
  };

  return (
    <>
      <SEOHead 
        title="Images to PDF - Convert Multiple Images to PDF | PDFo"
        description="Convert up to 10 images (JPG, PNG) to a single PDF. Reorder images with drag and drop for perfect alignment."
        keywords="images to pdf, jpg to pdf, png to pdf, convert images to pdf online"
        canonicalUrl={`${window.location.origin}/images-to-pdf`}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center text-sm">
            ← Back to Tools
          </Link>
        </div>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-lime-500 rounded-2xl flex items-center justify-center text-white text-xl mx-auto mb-4">
            <i className="fas fa-file-image" aria-hidden="true"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Images to PDF</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
            Convert up to 10 images into a single professional PDF document. Drag and drop to reorder.
          </p>
          
          {/* Features */}
          <div className="flex justify-center gap-6 mt-6 text-sm">
            <div className="flex items-center text-green-600 dark:text-green-400">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Drag & Drop Order
            </div>
            <div className="flex items-center text-green-600 dark:text-green-400">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              High Quality PDF
            </div>
            <div className="flex items-center text-green-600 dark:text-green-400">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Free to Use
            </div>
          </div>
        </div>

        {images.length === 0 ? (
          <FileUpload
            onFilesSelected={handleFilesSelected}
            acceptMultiple={true}
            accept="image/png, image/jpeg, image/jpg, image/webp"
            title="Upload Images (Max 10)"
            subtitle="JPG, PNG, WEBP"
          />
        ) : (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Arrange Images ({images.length}/10)
                </h3>
                <div className="flex gap-2">
                  {images.length < 10 && (
                    <FileUpload 
                      onFilesSelected={handleFilesSelected} 
                      variant="button" 
                      buttonText="Add More" 
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                    />
                  )}
                  <Button variant="outline" size="sm" onClick={() => setImages([])}>Clear All</Button>
                </div>
              </div>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={images.map(img => img.id)} strategy={verticalListSortingStrategy}>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {images.map((image) => (
                      <SortableImageItem key={image.id} image={image} onRemove={handleRemoveImage} />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              <div className="mt-8">
                <Button
                  onClick={handleCreatePDF}
                  disabled={isProcessing || images.length === 0}
                  className="w-full bg-lime-600 hover:bg-lime-700 text-white py-6 text-lg"
                >
                  {isProcessing ? "Generating PDF..." : "Convert Images to PDF"}
                </Button>
                <ProgressBar progress={progress} isVisible={isProcessing} color="lime" className="mt-4" />
              </div>
            </div>

            {convertedFile && !isProcessing && (
              <div className="text-center space-y-4 bg-green-50 dark:bg-green-950/20 p-8 rounded-2xl border border-green-100 dark:border-green-900">
                <h3 className="text-xl font-bold text-green-800 dark:text-green-300">Your PDF is Ready!</h3>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Pages: {images.length}
                </p>
                <Button onClick={handleDownload} size="lg" className="bg-green-600 hover:bg-green-700 text-white px-10">
                  <i className="fas fa-download mr-2"></i> Download PDF
                </Button>
                <div className="pt-2">
                  <BuyMeCoffeeButton />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <ToolFooter />
    </>
  );
}