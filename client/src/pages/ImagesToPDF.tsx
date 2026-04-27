import { SITE_URL } from "@/lib/site";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { FileUpload } from "@/components/FileUpload";
import { ToolFooter } from "@/components/ToolFooter";
import { ProgressBar } from "@/components/ProgressBar";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/SEOHead";
import {
  convertImagesToPDF,
  downloadBlob,
  type ImageToPDFOptions,
} from "@/lib/realPdfUtils";
import { useToast } from "@/hooks/use-toast";
import { trackToolUsage } from "@/lib/analytics";
import { ToolSEOContent } from "@/components/ToolSEOContent";
import { imagesToPdfSEO } from "@/seo/images-to-pdf";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ArrowLeft,
  Images, // ✅ FIXED: Using 'Images' to match Home Page
  X,
  GripHorizontal,
  Download,
  RefreshCw,
  CheckCircle,
  Coffee,
  Plus,
} from "lucide-react";

interface ImageFile {
  id: string;
  file: File;
  preview: string;
}

// Sub-component for Sortable Item
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
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.3 : 1, // Dim original when dragging
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
    >
      {/* Image Preview */}
      <div
        className="aspect-[3/4] bg-muted relative cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <img
          src={image.preview}
          alt="preview"
          className="w-full h-full object-cover"
        />
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <GripHorizontal className="text-white drop-shadow-md w-6 h-6" />
        </div>
      </div>

      {/* Remove Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(image.id);
        }}
        className="absolute top-1 right-1 bg-black/50 hover:bg-red-500 text-white p-1 rounded-full transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
      >
        <X className="w-3 h-3" />
      </button>

      {/* Footer Info */}
      <div className="p-2 bg-card border-t text-[10px] text-muted-foreground truncate text-center">
        {image.file.name}
      </div>
    </div>
  );
}

export default function ImagesToPDF() {
  const seoData = imagesToPdfSEO || {
    title: "Images to PDF",
    metaDescription: "Convert images to PDF",
    h1: "Images to PDF",
    shortIntro: "Convert JPG, PNG to PDF",
  };
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedFile, setConvertedFile] = useState<Blob | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Prevent accidental drags when clicking remove
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleFilesSelected = async (files: File[]) => {
    const currentCount = images.length;
    const remainingSlots = 20;

    if (currentCount >= remainingSlots) {
      toast({
        title: "Limit Reached",
        description: `You can only upload up to ${remainingSlots} images.`,
        variant: "destructive",
      });
      return;
    }

    const filesToAdd = files.slice(0, remainingSlots - currentCount);
    const newImageFiles: ImageFile[] = [];

    for (const file of filesToAdd) {
      if (file.type.startsWith("image/")) {
        const preview = URL.createObjectURL(file);
        newImageFiles.push({
          id: `${file.name}-${Date.now()}-${Math.random()}`,
          file,
          preview,
        });
      }
    }

    if (newImageFiles.length === 0) return;

    setImages((prev) => [...prev, ...newImageFiles]);
    setConvertedFile(null);
  };

  const handleRemoveImage = (id: string) => {
    setImages((prev) => {
      const imgToRemove = prev.find((i) => i.id === id);
      if (imgToRemove) URL.revokeObjectURL(imgToRemove.preview);
      return prev.filter((img) => img.id !== id);
    });
    setConvertedFile(null);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleCreatePDF = async () => {
    if (images.length === 0) return;

    setIsProcessing(true);
    setProgress(10);
    try {
      const files = images.map((img) => img.file);
      const options: ImageToPDFOptions = { pageSize: "A4" };

      const interval = setInterval(
        () => setProgress((p) => Math.min(p + 5, 90)),
        200,
      );

      const pdfBlob = await convertImagesToPDF(files, options);

      clearInterval(interval);
      setProgress(100);
      setConvertedFile(pdfBlob);

      await trackToolUsage("Images to PDF", "conversion", images.length);

      toast({
        title: "Success!",
        description: "Images converted to PDF successfully.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Conversion Failed",
        description: "Failed to create PDF. Please ensure images are valid.",
        variant: "destructive",
      });
      setProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!convertedFile) return;
    downloadBlob(convertedFile, `PDFo_Images_${Date.now()}.pdf`);
  };

  const resetTool = () => {
    images.forEach((img) => URL.revokeObjectURL(img.preview));
    setImages([]);
    setConvertedFile(null);
    setProgress(0);
  };

  return (
    <>
      <SEOHead
        breadcrumbs={[
          { name: "Home", url: SITE_URL },
          {
            name: "Images to PDF",
            url: `${SITE_URL}/images-to-pdf`,
          },
        ]}
        title={seoData.title}
        description={seoData.metaDescription}
        keywords="jpg to pdf, png to pdf, convert images to pdf, merge photos to pdf"
        canonicalUrl={`${SITE_URL}/images-to-pdf`}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[60vh]">
        {/* Navigation */}
        <div className="mb-6">
          <Link
            href="/"
            className="text-muted-foreground hover:text-primary flex items-center text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Tools
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-lime-100 dark:bg-lime-900/30 text-lime-600 dark:text-lime-400 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 shadow-sm">
            {/* ✅ FIXED: Using 'Images' icon */}
            <Images className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {seoData.h1}
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-base md:text-lg leading-relaxed">
            {seoData.shortIntro}
          </p>
        </div>

        {images.length === 0 ? (
          <FileUpload
            onFilesSelected={handleFilesSelected}
            acceptMultiple={true}
            accept="image/png, image/jpeg, image/jpg, image/webp"
            title="Upload Images"
            subtitle="JPG, PNG, WEBP supported"
            className="max-w-2xl mx-auto"
          />
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {!convertedFile ? (
              <div className="space-y-6">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row justify-between items-center bg-card border rounded-xl p-4 gap-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-300 px-3 py-1 rounded-full text-sm font-medium">
                      {images.length} Images
                    </span>
                    <span className="text-sm text-muted-foreground hidden sm:inline">
                      Drag to reorder
                    </span>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <FileUpload
                      onFilesSelected={handleFilesSelected}
                      variant="button"
                      buttonText="Add"
                      accept="image/*"
                      className="w-full sm:w-auto"
                    />
                    <Button
                      variant="ghost"
                      onClick={resetTool}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      Clear
                    </Button>
                  </div>
                </div>

                {/* Sortable Grid */}
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={images.map((img) => img.id)}
                    strategy={rectSortingStrategy}
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {images.map((image) => (
                        <SortableImageItem
                          key={image.id}
                          image={image}
                          onRemove={handleRemoveImage}
                        />
                      ))}

                      {/* Add Button Card */}
                      {images.length < 20 && (
                        <div className="aspect-[3/4] border-2 border-dashed border-muted-foreground/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                          <FileUpload
                            onFilesSelected={handleFilesSelected}
                            variant="button"
                            buttonText="Add More"
                            className="w-full h-full opacity-0 absolute inset-0 cursor-pointer"
                          />
                          <Plus className="w-8 h-8 text-muted-foreground/50 mb-2" />
                          <span className="text-xs text-muted-foreground">
                            Add Image
                          </span>
                        </div>
                      )}
                    </div>
                  </SortableContext>
                </DndContext>

                {/* Convert Button */}
                <div className="sticky bottom-6 z-10 flex justify-center mt-8">
                  <Button
                    onClick={handleCreatePDF}
                    disabled={isProcessing}
                    className="rounded-full bg-lime-600 hover:bg-lime-700 text-white min-w-[200px] h-12 shadow-lg font-semibold text-lg hover:scale-105 transition-transform"
                  >
                    {isProcessing ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>{" "}
                        Converting...
                      </>
                    ) : (
                      "Convert to PDF"
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              /* Success View */
              <div className="max-w-2xl mx-auto bg-card border rounded-xl shadow-sm p-8 text-center animate-in zoom-in-95 duration-300">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>

                <h2 className="text-2xl font-bold mb-2">PDF Ready!</h2>
                <p className="text-muted-foreground mb-8">
                  Your {images.length} images have been combined into a PDF.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={handleDownload}
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-white shadow-lg font-semibold w-full sm:w-auto h-12"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download PDF
                  </Button>

                  <Button
                    onClick={resetTool}
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto h-12"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Convert More
                  </Button>
                </div>

                {/* Buy Me Coffee */}
                <div className="mt-8 pt-6 border-t">
                  <p className="text-sm text-muted-foreground mb-3">
                    Found this helpful?
                  </p>
                  <a
                    href="https://www.buymeacoffee.com/kuhulabsq"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-2 text-sm font-medium text-black bg-[#FFDD00] hover:bg-[#FFDD00]/90 rounded-full shadow-sm hover:shadow transition-transform hover:scale-105"
                  >
                    <Coffee className="h-4 w-4 mr-2" />
                    Buy me a coffee
                  </a>
                </div>
              </div>
            )}

            <ProgressBar
              progress={progress}
              isVisible={isProcessing}
              color="lime"
              className="fixed top-0 left-0 right-0 z-50 h-1"
            />
          </div>
        )}
      </div>

      {/* Fallback SEO Content if unavailable */}
      <ToolSEOContent
        intro={seoData?.intro || ""}
        howItWorks={seoData?.howItWorks || []}
        benefits={seoData?.benefits || []}
        faqs={seoData?.faqs || []}
        relatedTools={seoData?.relatedTools || []}
      />
      <ToolFooter />
    </>
  );
}
