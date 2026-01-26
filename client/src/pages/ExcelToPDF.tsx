import { TOOL_SEO } from "@/seo/seo";
import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { FileUpload } from "@/components/FileUpload";
import { ToolFooter } from "@/components/ToolFooter";
import { ProgressBar } from "@/components/ProgressBar";
import { BuyMeCoffeeButton } from "@/components/BuyMeCoffeeButton";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/SEOHead";
import { convertExcelToPDF, downloadBlob } from "@/lib/realPdfUtils";
import { useToast } from "@/hooks/use-toast";
import { trackToolUsage } from "@/lib/analytics";
import { ToolSEOContent } from "@/components/ToolSEOContent";
import { FileSpreadsheet, Download, RefreshCw, CheckCircle2, X } from "lucide-react";

const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://pdfo.io';

export default function ExcelToPDF() {
  const seoData = TOOL_SEO['excel-to-pdf'];
  
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedFile, setConvertedFile] = useState<Blob | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const { toast } = useToast();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Reset function
  const handleReset = useCallback(() => {
    setFile(null);
    setConvertedFile(null);
    setProgress(0);
    setIsProcessing(false);
    setShowSuccess(false);
  }, []);

  // File validation
  const isValidExcelFile = (file: File): boolean => {
    const validExtensions = ['.xlsx', '.xls'];
    const fileName = file.name.toLowerCase();
    return validExtensions.some(ext => fileName.endsWith(ext));
  };

  // Handle file selection
  const handleFilesSelected = useCallback((files: File[]) => {
    const selectedFile = files[0];
    
    if (!isValidExcelFile(selectedFile)) {
      toast({
        title: "Invalid file format",
        description: "Please select an Excel spreadsheet (.xlsx or .xls file).",
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);
    setConvertedFile(null);
    setProgress(0);
  }, [toast]);

  // Download handler
  const handleDownload = useCallback(() => {
    if (convertedFile) {
      const filename = `${file?.name.replace(/\.(xlsx?|xls)$/i, '')}_converted.pdf`;
      downloadBlob(convertedFile, filename);
    }
  }, [convertedFile, file]);

  // Convert Excel to PDF
  const handleConvert = useCallback(async () => {
    if (!file) return;
    
    setIsProcessing(true);
    setProgress(0);

    try {
      setProgress(25);
      const pdfBlob = await convertExcelToPDF(file);
      
      setProgress(90);
      setConvertedFile(pdfBlob);
      setProgress(100);
      
      // Track analytics (non-blocking)
      try {
        await trackToolUsage("Excel to PDF", "conversion", 1);
      } catch (analyticsError) {
        console.warn('Analytics tracking failed:', analyticsError);
      }

      // Show success
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      toast({
        title: "Success! ✓",
        description: "Excel spreadsheet converted to PDF successfully.",
      });

    } catch (error) {
      console.error('Conversion error:', error);
      toast({
        title: "Error",
        description: "Failed to convert Excel to PDF. Please try again.",
        variant: "destructive",
      });
      setProgress(0);
    } finally {
      setIsProcessing(false);
      setTimeout(() => setProgress(0), 500);
    }
  }, [file, toast]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Download: Ctrl/Cmd + S
      if ((e.ctrlKey || e.metaKey) && e.key === 's' && convertedFile) {
        e.preventDefault();
        handleDownload();
      }
      
      // Convert: Ctrl/Cmd + Enter
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && file && !isProcessing) {
        e.preventDefault();
        handleConvert();
      }
      
      // Reset: Escape
      if (e.key === 'Escape' && !isProcessing) {
        handleReset();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [convertedFile, file, isProcessing, handleDownload, handleConvert, handleReset]);

  return (
    <>
      <SEOHead 
        title={seoData.title}
        description={seoData.metaDescription}
        keywords="excel to pdf, convert excel to pdf, xlsx to pdf, spreadsheet to pdf"
        canonicalUrl={`${SITE_URL}/excel-to-pdf`}
        faqs={seoData.faqs}
        breadcrumbs={[
          { name: "Home", url: SITE_URL },
          { name: "Excel to PDF", url: `${SITE_URL}/excel-to-pdf` },
        ]}
      />

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in z-50">
          ✓ Excel converted successfully!
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/">
            <a className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors inline-flex items-center gap-2">
              <span>←</span>
              <span>Back to Tools</span>
            </a>
          </Link>
        </div>

        {/* Header */}
        <header className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4 shadow-lg">
            <FileSpreadsheet className="h-8 w-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Excel to PDF Converter
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
            Convert Excel spreadsheets to PDF format instantly
          </p>
          
          {/* Features */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-6 text-sm">
            <div className="flex items-center text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Table Formatting
            </div>
            <div className="flex items-center text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Data Preservation
            </div>
            <div className="flex items-center text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Free to Use
            </div>
          </div>
        </header>

        {/* Main Content */}
        {!file ? (
          <FileUpload
            onFilesSelected={handleFilesSelected}
            acceptMultiple={false}
            accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            title="Drag and drop Excel spreadsheet here"
            subtitle="or click to select a .xlsx or .xls file"
          />
        ) : (
          <>
            {/* Reset Button */}
            <div className="flex justify-center mb-6">
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={isProcessing}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Change File
              </Button>
            </div>

            {/* File Info Card */}
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-2 border-emerald-200 dark:border-emerald-700 rounded-lg p-4 mb-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                    <FileSpreadsheet className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                      {file.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Size: {(file.size / 1024).toFixed(2)} KB
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-100 gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Ready to Convert
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  disabled={isProcessing}
                  className="ml-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors disabled:opacity-50"
                  title="Remove file"
                  aria-label="Remove file"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Convert Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Ready to Convert
              </h3>
              
              <div className="space-y-4">
                <Button
                  onClick={handleConvert}
                  disabled={isProcessing}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Converting...
                    </>
                  ) : (
                    "Convert to PDF"
                  )}
                </Button>

                {!isProcessing && (
                  <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                    Press Ctrl+Enter to convert
                  </p>
                )}
              </div>
              
              <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                <p className="text-sm text-emerald-700 dark:text-emerald-300 flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>
                    Your Excel spreadsheet will be converted to PDF preserving tables and data formatting.
                  </span>
                </p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <ProgressBar 
              progress={progress} 
              isVisible={isProcessing} 
              color="emerald"
              className="mt-6"
            />
            
            {/* Download Section */}
            {convertedFile && !isProcessing && (
              <div className="text-center space-y-4 mt-8">
                <div className="space-y-3">
                  <Button
                    onClick={handleDownload}
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg gap-2"
                  >
                    <Download className="h-5 w-5" />
                    Download PDF
                  </Button>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Press Ctrl+S to download
                  </p>
                </div>

                <div className="pt-4">
                  <BuyMeCoffeeButton />
                </div>
              </div>
            )}
            
            {/* Coffee Button (when idle) */}
            {!convertedFile && !isProcessing && (
              <div className="text-center mt-6">
                <BuyMeCoffeeButton />
              </div>
            )}
          </>
        )}
      </div>

      {/* SEO Content */}
      <ToolSEOContent 
        pageTitle="Excel to PDF Converter"
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