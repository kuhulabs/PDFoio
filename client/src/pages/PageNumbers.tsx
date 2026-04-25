import { useState, useEffect } from "react";
import { Link } from "wouter";
import { FileUpload } from "@/components/FileUpload";
// Assuming you have a component for settings, if not, we use standard placeholder
import { ToolFooter } from "@/components/ToolFooter";
import { ProgressBar } from "@/components/ProgressBar";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/SEOHead";
import { ToolSEOContent } from "@/components/ToolSEOContent";
import { addPageNumbers, downloadBlob } from "@/lib/realPdfUtils";
import { useToast } from "@/hooks/use-toast";
import { trackToolUsage } from "@/lib/analytics";
import { TOOL_SEO } from "@/seo/seo";
import {
  ArrowLeft,
  ListOrdered, // ✅ FIXED: Using 'ListOrdered' to match Home Page
  Download,
  RefreshCw,
  CheckCircle,
  Settings,
  Zap,
  Shield,
  LayoutTemplate,
} from "lucide-react";

export default function PageNumbers() {
  const seoData = TOOL_SEO["page-numbers"] || {
    title: "Add Page Numbers to PDF",
    h1: "Add PDF Page Numbers Online",
    shortIntro:
      "Professionally number your PDF pages with customizable positions.",
    metaDescription:
      "Add page numbers to PDF documents online. Free and secure.",
    faqs: [],
  };

  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setProcessedBlob(null);
    }
  };

  const handleAddNumbers = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(10);

    try {
      // Simulate progress
      const interval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      // Default settings: Bottom Center, Size 12
      const blob = await addPageNumbers(file, {
        position: "bottom-center",
        format: "{n}",
        fontFamily: "Helvetica",
        fontSize: 12,
        color: "#000000",
      });

      clearInterval(interval);
      setProgress(100);
      setProcessedBlob(blob);
      await trackToolUsage("Page Numbers", "edit", 1);

      toast({
        title: "Success!",
        description: "Page numbers added successfully.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed",
        description: "Could not add page numbers. Please try again.",
        variant: "destructive",
      });
      setProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetTool = () => {
    setFile(null);
    setProcessedBlob(null);
    setProgress(0);
  };

  return (
    <>
      <SEOHead
        title={seoData.title}
        description={seoData.metaDescription}
        keywords="add page numbers to pdf, pdf pagination online, number pdf pages"
        canonicalUrl={`${window.location.origin}/page-numbers`}
        breadcrumbs={[
          { name: "Home", url: window.location.origin },
          { name: "Page Numbers", url: `${window.location.origin}/page-numbers` },
        ]}
        faqs={seoData.faqs}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[60vh]">
        {/* Navigation */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-muted-foreground hover:text-primary flex items-center text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Tools
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            {/* ✅ FIXED: Icon updated to ListOrdered */}
            <ListOrdered className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{seoData.h1}</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {seoData.shortIntro}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm font-medium">
            <div className="flex items-center text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 rounded-full">
              <Zap className="w-4 h-4 mr-2" /> Instant Processing
            </div>
            <div className="flex items-center text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-3 py-1 rounded-full">
              <Shield className="w-4 h-4 mr-2" /> Secure & Private
            </div>
          </div>
        </div>

        {/* Content */}
        {!file ? (
          <FileUpload
            onFilesSelected={handleFilesSelected}
            accept=".pdf"
            className="max-w-2xl mx-auto"
          />
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {!processedBlob ? (
              <div className="bg-card border rounded-xl shadow-sm p-6 max-w-2xl mx-auto">
                <div className="flex items-center gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
                  <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded flex items-center justify-center shadow-sm">
                    <LayoutTemplate className="w-6 h-6 text-indigo-500" />
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="font-medium truncate">{file.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      Ready to add numbers
                    </p>
                  </div>
                </div>

                {/* Settings Placeholder (Can be expanded with real controls) */}
                <div className="space-y-4 mb-8">
                  <div className="p-4 border rounded-lg bg-white dark:bg-gray-900">
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Settings className="w-4 h-4" /> Default Settings
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Numbers will be added to the{" "}
                      <strong>Bottom Center</strong> of each page.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 justify-center">
                  <Button variant="ghost" onClick={resetTool}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddNumbers}
                    disabled={isProcessing}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[160px]"
                  >
                    {isProcessing ? "Processing..." : "Add Page Numbers"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-card border rounded-xl shadow-sm p-8 max-w-2xl mx-auto text-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Numbers Added!</h2>
                <p className="text-muted-foreground mb-8">
                  Your document is ready for download.
                </p>
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={() =>
                      downloadBlob(processedBlob, `PDFo_Numbered.pdf`)
                    }
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-white shadow-lg"
                  >
                    <Download className="w-4 h-4 mr-2" /> Download PDF
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
              color="indigo"
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
