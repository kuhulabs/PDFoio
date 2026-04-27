import { SITE_URL } from "@/lib/site";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { FileUpload } from "@/components/FileUpload";
import { ToolFooter } from "@/components/ToolFooter";
import { ProgressBar } from "@/components/ProgressBar";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/SEOHead";
import { convertWordToPDF, downloadBlob } from "@/lib/realPdfUtils";
import { useToast } from "@/hooks/use-toast";
import { trackToolUsage } from "@/lib/analytics";
import { ToolSEOContent } from "@/components/ToolSEOContent";
import { wordToPdfSEO } from "@/seo/word-to-pdf";
import {
  ArrowLeft,
  FileType, // ✅ FIXED: Using 'FileType' to match Home Page
  File as FileIcon,
  Download,
  RefreshCw,
  CheckCircle,
  Coffee,
  Zap,
  Shield,
} from "lucide-react";

export default function WordToPDF() {
  const seoData = wordToPdfSEO;
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedFile, setConvertedFile] = useState<Blob | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFilesSelected = (files: File[]) => {
    const selectedFile = files[0];
    if (
      selectedFile &&
      (selectedFile.name.endsWith(".docx") ||
        selectedFile.name.endsWith(".doc"))
    ) {
      setFile(selectedFile);
      setConvertedFile(null);
      setProgress(0);
    } else {
      toast({
        title: "Invalid file format",
        description: "Please select a Word document (.docx or .doc file).",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    if (!convertedFile) return;
    const fileName = file
      ? file.name.replace(/\.[^/.]+$/, "") + ".pdf"
      : "PDFo_Converted.pdf";
    downloadBlob(convertedFile, fileName);
  };

  const handleConvert = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(10);
    try {
      // Simulate progress since conversion happens in one go usually
      const interval = setInterval(
        () => setProgress((prev) => Math.min(prev + 5, 90)),
        200,
      );

      const pdfBlob = await convertWordToPDF(file);

      clearInterval(interval);
      setProgress(100);
      setConvertedFile(pdfBlob);

      await trackToolUsage("Word to PDF", "conversion", 1);

      toast({
        title: "Success!",
        description: "Word document converted to PDF successfully.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Conversion Failed",
        description:
          "Failed to convert document. Please ensure it's a valid Word file.",
        variant: "destructive",
      });
      setProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetTool = () => {
    setFile(null);
    setConvertedFile(null);
    setProgress(0);
  };

  return (
    <>
      <SEOHead
        breadcrumbs={[
          { name: "Home", url: SITE_URL },
          { name: "Word to PDF", url: `${SITE_URL}/word-to-pdf` },
        ]}
        title={seoData.title}
        description={seoData.metaDescription}
        keywords={
          (seoData as any).keywords ||
          "word to pdf, docx to pdf, doc to pdf, convert word"
        }
        canonicalUrl={`${SITE_URL}/word-to-pdf`}
        faqs={seoData.faqs}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[60vh]">
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
          <div className="w-16 h-16 bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 shadow-sm">
            {/* ✅ FIXED: Using FileType icon */}
            <FileType className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {seoData.h1}
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-base md:text-lg leading-relaxed">
            {seoData.shortIntro}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm font-medium">
            <div className="flex items-center text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 rounded-full">
              <Zap className="w-4 h-4 mr-2" /> Preserves Formatting
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
            accept=".docx,.doc,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
            title="Drag & Drop Word File"
            subtitle="Supports .docx and .doc"
            className="max-w-2xl mx-auto"
          />
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {!convertedFile ? (
              <div className="max-w-xl mx-auto bg-card border rounded-xl shadow-sm p-6 sm:p-8">
                {/* File Info */}
                <div className="flex items-center justify-between mb-8 pb-6 border-b">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900/20 rounded-lg flex items-center justify-center text-sky-600 dark:text-sky-400">
                      <FileIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground truncate max-w-[180px] sm:max-w-xs">
                        {file.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={resetTool}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <Button
                    onClick={handleConvert}
                    disabled={isProcessing}
                    className="w-full bg-sky-600 hover:bg-sky-700 text-white shadow-md h-12 text-lg"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />{" "}
                        Converting...
                      </>
                    ) : (
                      "Convert to PDF"
                    )}
                  </Button>

                  <div className="text-xs text-center text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    <i className="fas fa-info-circle mr-1"></i>
                    Fonts, images, and layout will be preserved.
                  </div>
                </div>
              </div>
            ) : (
              /* Success View */
              <div className="max-w-2xl mx-auto bg-card border rounded-xl shadow-sm p-8 text-center animate-in zoom-in-95 duration-300">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>

                <h2 className="text-2xl font-bold mb-2">
                  Conversion Complete!
                </h2>
                <p className="text-muted-foreground mb-8">
                  Your Word document has been successfully converted to PDF.
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
                    Convert Another
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
              color="sky"
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
