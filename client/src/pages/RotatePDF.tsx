import { SITE_URL } from "@/lib/site";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { FileUpload } from "@/components/FileUpload";
import { RotatePDFGrid } from "@/components/RotatePDFGrid"; // Assuming this component exists
import { ToolFooter } from "@/components/ToolFooter";
import { ProgressBar } from "@/components/ProgressBar";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/SEOHead";
import { rotateSEO } from "@/seo/rotate";
import { ToolSEOContent } from "@/components/ToolSEOContent";
import {
  rotatePDFPages,
  downloadBlob,
  generateRealPDFPages,
} from "@/lib/realPdfUtils";
import { useToast } from "@/hooks/use-toast";
import { trackToolUsage } from "@/lib/analytics";
import {
  ArrowLeft,
  RotateCw,
  FileText,
  Download,
  RefreshCw,
  CheckCircle,
  Coffee,
  Zap,
  Shield,
} from "lucide-react";

interface PDFPage {
  id: string;
  pageNumber: number;
  rotation: number;
}

export default function RotatePDF() {
  const seoData = rotateSEO;
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PDFPage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [rotatedBlob, setRotatedBlob] = useState<Blob | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;

    const selectedFile = files[0];
    setFile(selectedFile);
    setRotatedBlob(null);

    try {
      // Generate real PDF pages for preview
      const realPages = await generateRealPDFPages(selectedFile);
      const pagesWithRotation = realPages.map((page) => ({
        ...page,
        rotation: 0,
      }));
      setPages(pagesWithRotation);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error reading PDF",
        description:
          "Failed to load PDF pages. The file might be password protected.",
        variant: "destructive",
      });
      setFile(null);
    }
  };

  const handleDownload = () => {
    if (!rotatedBlob) return;
    const fileName = file ? `PDFo_Rotated_${file.name}` : "PDFo_Rotate.pdf";
    downloadBlob(rotatedBlob, fileName);
  };

  const handleRotate = async (updatedPages: PDFPage[]) => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(10);
    try {
      // Create rotation map
      const rotations: Record<number, number> = {};
      let hasChanges = false;

      updatedPages.forEach((page) => {
        if (page.rotation !== 0) {
          rotations[page.pageNumber - 1] = page.rotation; // 0-indexed for backend
          hasChanges = true;
        }
      });

      if (!hasChanges) {
        toast({
          title: "No changes",
          description: "No pages were rotated.",
        });
        setIsProcessing(false);
        setProgress(0);
        return;
      }

      // Simulate progress
      const interval = setInterval(
        () => setProgress((prev) => Math.min(prev + 10, 90)),
        300,
      );

      const processedBlob = await rotatePDFPages(file, rotations);

      clearInterval(interval);
      setProgress(100);
      setRotatedBlob(processedBlob);

      await trackToolUsage("Rotate PDF", "manipulation", 1);

      toast({
        title: "Success!",
        description: "Pages rotated successfully.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Processing Failed",
        description: "Failed to rotate pages. Please try again.",
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
    setRotatedBlob(null);
    setProgress(0);
  };

  return (
    <>
      <SEOHead
        breadcrumbs={[
          { name: "Home", url: SITE_URL },
          { name: "Rotate PDF", url: `${SITE_URL}/rotate` },
        ]}
        title={seoData.title}
        description={seoData.metaDescription}
        keywords="rotate pdf, flip pdf pages, change pdf orientation"
        canonicalUrl={`${SITE_URL}/rotate`}
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

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 shadow-sm">
            <RotateCw className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {seoData.h1}
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-base md:text-lg leading-relaxed">
            {seoData.shortIntro}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm font-medium">
            <div className="flex items-center text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 rounded-full">
              <Zap className="w-4 h-4 mr-2" /> Instant Preview
            </div>
            <div className="flex items-center text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-3 py-1 rounded-full">
              <Shield className="w-4 h-4 mr-2" /> Secure Processing
            </div>
          </div>
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
            {!rotatedBlob ? (
              <>
                {/* File Info Bar */}
                <div className="flex items-center justify-between mb-6 bg-card border p-4 rounded-xl shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center text-orange-600 dark:text-orange-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="font-medium truncate max-w-[200px] sm:max-w-md">
                        {file.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {pages.length} Pages
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetTool}
                    className="text-muted-foreground"
                  >
                    Change File
                  </Button>
                </div>

                {/* Rotation Grid Component */}
                <RotatePDFGrid
                  file={file}
                  pages={pages}
                  onRotate={handleRotate}
                  isProcessing={isProcessing}
                />
              </>
            ) : (
              /* Success View */
              <div className="max-w-2xl mx-auto bg-card border rounded-xl shadow-sm p-8 text-center animate-in zoom-in-95 duration-300">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>

                <h2 className="text-2xl font-bold mb-2">Rotation Complete!</h2>
                <p className="text-muted-foreground mb-8">
                  Your PDF pages have been successfully rotated.
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
                    Rotate Another
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
              color="orange"
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
