// 1. FIXED: 'import' must be lowercase
import React, { useState, useEffect, useCallback } from "react";
import { TOOL_SEO } from "@/seo/seo";
import { Link } from "wouter";
import { FileUpload } from "@/components/FileUpload";
import { DeletePDFGrid } from "@/components/DeletePDFGrid";
import { ToolFooter } from "@/components/ToolFooter";
import { ProgressBar } from "@/components/ProgressBar";
import { BuyMeCoffeeButton } from "@/components/BuyMeCoffeeButton";
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
// 2. FIXED: Added 'Download' icon and 'ArrowLeft'
import { Trash2, RefreshCw, Download, ArrowLeft, CheckCircle2 } from "lucide-react";

interface PDFPage {
  id: string;
  pageNumber: number;
  deleted: boolean;
}

const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://pdfo.io';

export default function DeletePages() {
  const seoData = TOOL_SEO["delete-pages"];
  
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PDFPage[]>([]);
  const [isLoadingPages, setIsLoadingPages] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Cleanup blob to prevent memory leaks
  useEffect(() => {
    return () => {
      if (processedBlob) URL.revokeObjectURL(URL.createObjectURL(processedBlob));
    };
  }, [processedBlob]);

  const handleReset = useCallback(() => {
    setFile(null);
    setPages([]);
    setProcessedBlob(null);
    setProgress(0);
    setIsProcessing(false);
  }, []);

  const handleFilesSelected = useCallback(async (files: File[]) => {
    const selectedFile = files[0];
    setFile(selectedFile);
    setProcessedBlob(null);
    setPages([]);
    setIsLoadingPages(true);

    try {
      const realPages = await generateRealPDFPages(selectedFile);
      // Initialize all pages as NOT deleted
      setPages(realPages.map((p: any) => ({ ...p, deleted: false })));
    } catch (error) {
      console.error('Error loading PDF:', error);
      toast({
        title: "Error",
        description: "Failed to parse PDF. Please try another file.",
        variant: "destructive",
      });
      handleReset();
    } finally {
      setIsLoadingPages(false);
    }
  }, [toast, handleReset]);

  // 3. IMPROVED: Just updates the UI state (Visual Selection), doesn't process yet
  const togglePageDeletion = useCallback((pageNumber: number) => {
    setPages(prev => prev.map(p => 
      p.pageNumber === pageNumber ? { ...p, deleted: !p.deleted } : p
    ));
    // Clear previous result if user changes selection
    if (processedBlob) setProcessedBlob(null);
  }, [processedBlob]);

  // 4. NEW: The actual processing happens here when user clicks "Remove Pages"
  const executeDelete = async () => {
    if (!file) return;

    // Calculate pages to KEEP (Logic: All pages - Deleted pages)
    const pagesToKeep = pages
      .filter((p) => !p.deleted)
      .map((p) => p.pageNumber - 1); // PDF-lib uses 0-based index

    const pagesToDeleteCount = pages.length - pagesToKeep.length;

    if (pagesToDeleteCount === 0) {
      toast({
        title: "No pages selected",
        description: "Please select at least one page to remove.",
        variant: "destructive",
      });
      return;
    }

    if (pagesToKeep.length === 0) {
      toast({
        title: "Invalid Operation",
        description: "You cannot delete all pages. The PDF must have at least one page.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(10);

    try {
      const blob = await deletePDFPages(file, pagesToKeep);
      setProgress(100);
      setProcessedBlob(blob);

      await trackToolUsage("Delete Pages", "manipulation", 1);

      toast({
        title: "Pages Removed Successfully",
        description: `Removed ${pagesToDeleteCount} pages from your document.`,
        className: "bg-green-50 border-green-200 dark:bg-green-900/30",
      });

    } catch (error) {
      console.error('Processing failed:', error);
      toast({
        title: "Processing Failed",
        description: "An error occurred while deleting pages.",
        variant: "destructive",
      });
      setProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = useCallback(() => {
    if (processedBlob && file) {
      const deletedCount = pages.filter(p => p.deleted).length;
      const filename = `PDFo_${file.name.replace('.pdf', '')}_edited.pdf`;
      downloadBlob(processedBlob, filename);
    }
  }, [processedBlob, pages, file]);

  // Derived state for UI feedback
  const selectedCount = pages.filter(p => p.deleted).length;

  return (
    <>
      <SEOHead
        title={seoData.title}
        description={seoData.metaDescription}
        keywords="delete pdf pages, remove pdf pages, pdf page remover"
        canonicalUrl={`${SITE_URL}/delete-pages`}
        faqs={seoData.faqs}
        breadcrumbs={[
          { name: "Home", url: SITE_URL },
          { name: "Delete Pages", url: `${SITE_URL}/delete-pages` },
        ]}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/">
            <a className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Tools
            </a>
          </Link>
        </div>

        <header className="text-center mb-8">
          <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4 shadow-lg shadow-red-500/20">
            <Trash2 className="h-8 w-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            {seoData.h1}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
            {seoData.shortIntro}
          </p>
        </header>

        {!file ? (
          <FileUpload
            onFilesSelected={handleFilesSelected}
            acceptMultiple={false}
            title="Upload PDF to Remove Pages"
          />
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-card p-4 rounded-xl border shadow-sm">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Selected for deletion:</span>
                    <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-md font-bold text-sm">
                        {selectedCount} pages
                    </span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleReset} className="text-muted-foreground hover:text-red-500">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Change File
                </Button>
            </div>

            {isLoadingPages ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
                <p className="text-muted-foreground">Analyzing PDF structure...</p>
              </div>
            ) : (
               /* Note: Ensure DeletePDFGrid accepts 'onTogglePage' instead of 'onDelete' 
                  to reflect that it's just a selection change, not an immediate delete.
                  If your component strictly requires 'onDelete', pass togglePageDeletion there.
               */
              <DeletePDFGrid
                file={file}
                pages={pages}
                onDelete={(updatedPages) => {
                    // Adapter: If grid returns full array, we sync it. 
                    // Ideally, Grid should just emit the clicked page ID.
                    setPages(updatedPages);
                    if (processedBlob) setProcessedBlob(null);
                }} 
                isProcessing={isProcessing}
              />
            )}

            <ProgressBar
              progress={progress}
              isVisible={isProcessing}
              indicatorColor="bg-red-500"
              className="mt-6"
            />

            {/* Sticky Action Footer */}
            <div className="sticky bottom-4 z-40 mt-8 flex justify-center">
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-2 pr-3 rounded-full shadow-2xl border border-gray-200 dark:border-gray-700 flex items-center gap-3">
                    {processedBlob ? (
                        <Button
                            onClick={handleDownload}
                            size="lg"
                            className="rounded-full bg-green-600 hover:bg-green-700 text-white px-8"
                        >
                            <Download className="w-5 h-5 mr-2" />
                            Download Modified PDF
                        </Button>
                    ) : (
                        <Button
                            onClick={executeDelete}
                            disabled={selectedCount === 0 || isProcessing}
                            size="lg"
                            className="rounded-full bg-red-600 hover:bg-red-700 text-white px-8 transition-all"
                        >
                            {isProcessing ? 'Processing...' : `Remove ${selectedCount} Selected Page${selectedCount !== 1 ? 's' : ''}`}
                        </Button>
                    )}
                </div>
            </div>

            {processedBlob && !isProcessing && (
                <div className="mt-8 text-center">
                    <BuyMeCoffeeButton />
                </div>
            )}
          </div>
        )}
      </div>

      <ToolSEOContent
        intro={seoData.intro}
        howItWorks={seoData.howItWorks}
        benefits={seoData.benefits}
        faqs={seoData.faqs}
        relatedTools={seoData.relatedTools}
      />

      <ToolFooter />
    </>
  );
}
