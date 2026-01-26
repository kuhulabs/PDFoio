import { TOOL_SEO } from "@/seo/seo";
import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { FileUpload } from "@/components/FileUpload";
import { ToolFooter } from "@/components/ToolFooter";
import { ProgressBar } from "@/components/ProgressBar";
import { BuyMeCoffeeButton } from "@/components/BuyMeCoffeeButton";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/SEOHead";
import { convertWordToPDF, downloadBlob } from "@/lib/realPdfUtils";
import { useToast } from "@/hooks/use-toast";
import { trackToolUsage } from "@/lib/analytics";
import { ToolSEOContent } from "@/components/ToolSEOContent";

export default function WordToPDF() {
  const seoData = TOOL_SEO['word-to-pdf'];
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedFile, setConvertedFile] = useState<Blob | null>(null);
  const { toast } = useToast();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFilesSelected = (files: File[]) => {
    const selectedFile = files[0];
    if (selectedFile && (selectedFile.name.endsWith('.docx') || selectedFile.name.endsWith('.doc'))) {
      setFile(selectedFile);
      setConvertedFile(null);
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
    downloadBlob(convertedFile, 'PDFo_WordToPDF.pdf');
  };

  const handleConvert = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    setProgress(0);
    try {
      setProgress(25);
      setProgress(70);
      const pdfBlob = await convertWordToPDF(file);
      setProgress(100);
      setConvertedFile(pdfBlob);
      
      // Track usage for dashboard
      await trackToolUsage("Word to PDF", "conversion", 1);
      
      toast({
        title: "Success!",
        description: "Word document has been converted to PDF successfully. Download button available below.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to convert Word document to PDF. Please try again.",
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
        canonicalUrl="https://pdfo.io/word-to-pdf"
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
          <div className="w-16 h-16 bg-sky-600 rounded-2xl flex items-center justify-center text-white text-xl mx-auto mb-4" role="img" aria-label="Word to PDF conversion tool">
            <i className="fas fa-file-word" aria-hidden="true"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Convert Word to PDF Online
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
            Convert DOC and DOCX files into high-quality PDF documents instantly.
          </p>
          
          {/* Features */}
          <div className="flex justify-center gap-6 mt-6 text-sm">
            <div className="flex items-center text-green-600">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Fast Conversion
            </div>
            <div className="flex items-center text-green-600">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Preserves Formatting
            </div>
            <div className="flex items-center text-green-600">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Secure & Private
            </div>
          </div>
        </div>

        {!file ? (
          <FileUpload
            onFilesSelected={handleFilesSelected}
            acceptMultiple={false}
            accept=".docx,.doc,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
            title="Drag & drop Word file here"
            subtitle="Supports DOC & DOCX • Max 20MB"
          />
        ) : (
          <>
            {/* File Info Card */}
            <div className="bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 border-2 border-sky-200 dark:border-sky-700 rounded-lg p-4 mb-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-12 h-12 bg-sky-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                    <i className="fas fa-file-word text-xl"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-white truncate">{file.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Size: {(file.size / 1024).toFixed(2)} KB
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-sky-100 dark:bg-sky-800 text-sky-800 dark:text-sky-100">
                        <i className="fas fa-file-pdf mr-1"></i>
                        Ready to Convert
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setFile(null);
                    setConvertedFile(null);
                  }}
                  className="ml-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  title="Remove file"
                  data-testid="button-remove-file"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ready to Convert</h3>
              
              <div className="mt-6">
                <Button
                  onClick={handleConvert}
                  disabled={isProcessing}
                  className="w-full bg-sky-600 hover:bg-sky-700 text-white"
                >
                  {isProcessing ? "Converting..." : "Convert to PDF"}
                </Button>
              </div>
              
              <div className="mt-4 p-4 bg-sky-50 dark:bg-sky-900/20 rounded-lg">
                <p className="text-sm text-sky-700 dark:text-sky-300">
                  <i className="fas fa-info-circle mr-2"></i>
                  Your Word document will be converted to a PDF file preserving the original formatting.
                </p>
              </div>
            </div>
            
            <ProgressBar 
              progress={progress} 
              isVisible={isProcessing} 
              color="sky"
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