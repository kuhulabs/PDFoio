import { useState, useEffect } from "react";
import { Link } from "wouter";
import { FileUpload } from "@/components/FileUpload";
import { DeletePDFGrid } from "@/components/DeletePDFGrid"; // Component we will fix next
import { ToolFooter } from "@/components/ToolFooter";
import { ProgressBar } from "@/components/ProgressBar";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/SEOHead";
import { ToolSEOContent } from "@/components/ToolSEOContent";
import {
  deletePDFPages,
  downloadBlob,
  generateRealPDFPages,
} from "@/lib/realPdfUtils";
import { useToast } from "@/hooks/use-toast";
import { trackToolUsage } from "@/lib/analytics";
import { deletePagesSEO } from "@/seo/delete-pages";
import {
  ArrowLeft,
  Trash2,
  Download,
  RefreshCw,
  CheckCircle,
  Coffee,
  AlertCircle,
  Zap,
  Shield,
} from "lucide-react";

interface PDFPage {
  id: string;
  pageNumber: number;
  deleted: boolean;
  originalIndex: number; // Added to track reordering
}

export default function DeletePages() {
  const seoData = deletePagesSEO || {
      title: "Delete PDF Pages",
      h1: "Delete PDF Pages",
      shortIntro: "Remove unwanted pages from your PDF securely.",
      metaDescription: "Delete pages from PDF online for free.",
      faqs: [],
    };

  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PDFPage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingPages, setIsLoadingPages] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFilesSelected = async (files: File[]) => {
    const selectedFile = files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setProcessedBlob(null);
    setIsLoadingPages(true);
    setPages([]);

    try {
      const realPages = await generateRealPDFPages(selectedFile);
      setPages(
        realPages.map((p: any, index: number) => ({
          ...p,
          deleted: false,
          originalIndex: index,
        })),
      );
    } catch (error) {
      console.error(error);
      toast({
        title: "Error loading PDF",
        description:
          "Could not load the pages. Is the file password protected?",
        variant: "destructive",
      });
      setFile(null);
    } finally {
      setIsLoadingPages(false);
    }
  };

  // ✅ IMPROVED: Toggle by ID is safer than pageNumber during reordering
  const togglePageSelection = (id: string) => {
    setPages((currentPages) =>
      currentPages.map((p) =>
        p.id === id ? { ...p, deleted: !p.deleted } : p,
      ),
    );
  };

  // ✅ NEW: Handle Reordering if user drags pages
  const handlePagesChange = (newPages: PDFPage[]) => {
    setPages(newPages);
  };

  const handleProcessDelete = async () => {
    if (!file) return;

    // Filter pages that are NOT deleted
    // Use originalIndex to ensure we pick the correct page from the source PDF
    const pagesToKeep = pages
      .filter((p) => !p.deleted)
      .map((p) => p.originalIndex); // Use original index for pdf-lib

    if (pagesToKeep.length === pages.length) {
      toast({
        title: "No pages selected",
        description: "Select pages to delete first.",
        variant: "destructive",
      });
      return;
    }

    if (pagesToKeep.length === 0) {
      toast({
        title: "Error",
        description: "You cannot delete all pages.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(20);

    try {
      // Pass pagesToKeep indices
      const blob = await deletePDFPages(file, pagesToKeep);
      setProgress(100);
      setProcessedBlob(blob);
      await trackToolUsage("Delete Pages", "manipulation", 1);
      toast({ title: "Success!", description: "Pages removed successfully." });
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed",
        description: "Could not process PDF.",
        variant: "destructive",
      });
      setProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetTool = () => {
    setFile(null);
    setPages([]);
    setProcessedBlob(null);
    setProgress(0);
  };

  const selectedCount = pages.filter((p) => p.deleted).length;

  return (
    <>
      <SEOHead
        title={seoData.title}
        description={seoData.metaDescription}
        canonicalUrl={`${window.location.origin}/delete-pages`}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[60vh]">
        <div className="mb-6">
          <Link
            href="/"
            className="text-muted-foreground hover:text-primary flex items-center text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Tools
          </Link>
        </div>

        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{seoData.h1}</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {seoData.shortIntro}
          </p>
        </div>

        {!file ? (
          <FileUpload
            onFilesSelected={handleFilesSelected}
            acceptMultiple={false}
            accept=".pdf"
            className="max-w-2xl mx-auto"
          />
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {!processedBlob ? (
              <>
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-card border p-4 rounded-xl shadow-sm gap-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <AlertCircle className="w-4 h-4 mr-2 text-primary" />
                    <span>Tap pages to mark for deletion</span>
                  </div>
                  <span className="text-sm font-medium bg-red-100 dark:bg-red-900/30 text-red-600 px-3 py-1 rounded-full">
                    {selectedCount} selected
                  </span>
                </div>

                {isLoadingPages ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                    <p className="text-muted-foreground">Loading pages...</p>
                  </div>
                ) : (
                  <div className="mb-8">
                    {/* The Grid Component */}
                    <DeletePDFGrid
                      file={file}
                      pages={pages}
                      // 👇 Passing strict props to sync state
                      onUpdatePages={handlePagesChange}
                      onToggleDelete={togglePageSelection}
                      isProcessing={isProcessing}
                    />
                  </div>
                )}

                {/* Floating Action Bar */}
                <div className="sticky bottom-6 z-50 flex justify-center">
                  <div className="bg-background/80 backdrop-blur-md border rounded-full shadow-2xl p-2 flex gap-3 px-6">
                    <Button
                      variant="ghost"
                      onClick={resetTool}
                      disabled={isProcessing}
                      className="rounded-full"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleProcessDelete}
                      disabled={selectedCount === 0 || isProcessing}
                      className="rounded-full bg-red-600 hover:bg-red-700 text-white min-w-[180px]"
                    >
                      {isProcessing
                        ? "Processing..."
                        : `Remove ${selectedCount} Pages`}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-card border rounded-xl shadow-sm p-8 max-w-2xl mx-auto text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Done!</h2>
                <p className="text-muted-foreground mb-8">
                  Removed {selectedCount} pages successfully.
                </p>
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={() =>
                      downloadBlob(processedBlob, `PDFo_Edited.pdf`)
                    }
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Download className="w-4 h-4 mr-2" /> Download
                  </Button>
                  <Button variant="outline" size="lg" onClick={resetTool}>
                    <RefreshCw className="w-4 h-4 mr-2" /> Start Over
                  </Button>
                </div>
              </div>
            )}
            <ProgressBar
              progress={progress}
              isVisible={isProcessing}
              color="red"
              className="fixed top-0 left-0 right-0 z-50 h-1"
            />
          </div>
        )}
      </div>
      <ToolSEOContent {...seoData} />
      <ToolFooter />
    </>
  );
}
