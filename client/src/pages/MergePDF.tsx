import { useState, useEffect } from "react";
import { Link } from "wouter";
import { FileUpload } from "@/components/FileUpload";
import { DocumentsList } from "@/components/DocumentsList";
import { Button } from "@/components/ui/button";
import { ToolFooter } from "@/components/ToolFooter";
import { mergePDFs } from "@/lib/realPdfUtils";
import { useToast } from "@/hooks/use-toast";
import { trackToolUsage } from "@/lib/analytics";
import {
  Download,
  Coffee,
  RefreshCw,
  ArrowLeft,
  Layers, // ✅ FIXED: Imported 'Layers' correctly (Merge ki jagah)
  Files,
  CheckCircle,
  Zap,
  Shield,
} from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { ProgressBar } from "@/components/ProgressBar";
import { mergeSEO } from "@/seo/merge";
import { ToolSEOContent } from "@/components/ToolSEOContent";

export default function MergePDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const seoData = mergeSEO;

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Cleanup memory when component unmounts or url changes
  useEffect(() => {
    return () => {
      if (mergedPdfUrl) {
        URL.revokeObjectURL(mergedPdfUrl);
      }
    };
  }, [mergedPdfUrl]);

  const handleFilesSelected = (selectedFiles: File[]) => {
    if (selectedFiles.length === 0) return;
    setFiles((prev) => [...prev, ...selectedFiles]);

    // Reset previous merge if new files are added
    if (mergedPdfUrl) {
      URL.revokeObjectURL(mergedPdfUrl);
      setMergedPdfUrl(null);
    }
  };

  const handleFilesReorder = (reorderedFiles: File[]) => {
    setFiles(reorderedFiles);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      toast({
        title: "Not enough files",
        description: "Please upload at least 2 PDF files to merge.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    if (mergedPdfUrl) {
      URL.revokeObjectURL(mergedPdfUrl);
      setMergedPdfUrl(null);
    }

    try {
      // Simulate start
      setProgress(10);

      const mergedBlob = await mergePDFs(files, (current, total) => {
        // Calculate progress: 10% start + 80% processing
        const fileProgress = (current / total) * 80;
        setProgress(10 + fileProgress);
      });

      setProgress(95);

      const url = URL.createObjectURL(mergedBlob);
      setMergedPdfUrl(url);

      setProgress(100);

      await trackToolUsage("Merge PDF", "manipulation", files.length);

      toast({
        title: "Success!",
        description: `Successfully merged ${files.length} PDF files.`,
      });
    } catch (error) {
      console.error('Merge failed:', error);
      const errorMessage = error instanceof Error ? error.message : "Could not merge the PDF files.";
      toast({
        title: "Merge Failed",
        description: errorMessage.includes("Failed to process") 
          ? errorMessage 
          : "Could not merge the PDF files. Please check if all files are valid PDFs and try again.",
        variant: "destructive",
      });
      setProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (mergedPdfUrl) {
      const a = document.createElement("a");
      a.href = mergedPdfUrl;
      const timestamp = new Date().toISOString().slice(0, 10);
      a.download = `PDFo-merged-${timestamp}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const clearFiles = () => {
    if (mergedPdfUrl) {
      URL.revokeObjectURL(mergedPdfUrl);
    }
    setFiles([]);
    setMergedPdfUrl(null);
    setProgress(0);
  };

  return (
    <>
      <SEOHead
        breadcrumbs={[
          { name: "Home", url: window.location.origin },
          { name: "Merge PDF", url: `${window.location.origin}/merge` },
        ]}
        title={seoData.title}
        description={seoData.metaDescription}
        keywords="merge pdf, combine pdf, join pdf online, pdf merger, stitch pdf"
        canonicalUrl={`${window.location.origin}/merge`}
        faqs={seoData.faqs}
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

        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 shadow-sm">
            {/* ✅ FIXED: Using Layers icon to match Home Page */}
            <Layers className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {seoData.h1}
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-base md:text-lg leading-relaxed">
            {seoData.shortIntro}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm font-medium">
            <div className="flex items-center text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 rounded-full">
              <Zap className="w-4 h-4 mr-2" /> Fast Processing
            </div>
            <div className="flex items-center text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-3 py-1 rounded-full">
              <Shield className="w-4 h-4 mr-2" /> Secure & Private
            </div>
          </div>
        </div>

        {/* Main Interface */}
        {files.length === 0 ? (
          <FileUpload
            onFilesSelected={handleFilesSelected}
            acceptMultiple={true}
            accept=".pdf"
            title="Combine PDF Files"
            className="max-w-2xl mx-auto"
          />
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {!mergedPdfUrl ? (
              <div className="space-y-6">
                {/* File List & Controls */}
                <div className="bg-card border rounded-xl shadow-sm p-2 sm:p-4">
                  <div className="flex justify-between items-center px-2 mb-2">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Files className="w-4 h-4 text-blue-500" />
                      {files.length} Files Selected
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFiles}
                      className="text-destructive hover:text-destructive"
                    >
                      Clear All
                    </Button>
                  </div>

                  <DocumentsList
                    files={files}
                    onFilesChange={handleFilesReorder}
                    title="" 
                  />

                  <div className="mt-4 flex justify-center pb-2">
                    <FileUpload
                      onFilesSelected={handleFilesSelected}
                      acceptMultiple={true}
                      variant="button"
                      buttonText="Add More PDFs"
                      className="w-full sm:w-auto"
                    />
                  </div>
                </div>

                {/* Sticky Merge Button */}
                <div className="sticky bottom-6 z-10 flex justify-center mt-8">
                  <Button
                    onClick={handleMerge}
                    disabled={files.length < 2 || isProcessing}
                    className="rounded-full bg-blue-600 hover:bg-blue-700 text-white min-w-[200px] h-12 shadow-lg font-semibold text-lg hover:scale-105 transition-transform"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />{" "}
                        Merging...
                      </>
                    ) : (
                      <>
                        {/* ✅ FIXED: Button icon also updated to Layers */}
                        <Layers className="w-4 h-4 mr-2" /> Merge {files.length}{" "}
                        PDFs
                      </>
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

                <h2 className="text-2xl font-bold mb-2">PDFs Merged!</h2>
                <p className="text-muted-foreground mb-8">
                  Your files have been combined into a single document.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={handleDownload}
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-white shadow-lg font-semibold w-full sm:w-auto h-12"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Merged PDF
                  </Button>

                  <Button
                    onClick={clearFiles}
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto h-12"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Merge Another
                  </Button>
                </div>

                {/* Buy Me Coffee */}
                <div className="mt-8 pt-6 border-t">
                  <p className="text-sm text-muted-foreground mb-3">
                    Saved you time?
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
              indicatorColor="bg-blue-600"
              className="fixed top-0 left-0 right-0 z-50 h-1"
            />
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