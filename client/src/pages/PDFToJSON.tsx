import { TOOL_SEO } from "@/seo/seo";
import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { FileUpload } from "@/components/FileUpload";
import { ToolFooter } from "@/components/ToolFooter";
import { ProgressBar } from "@/components/ProgressBar";
import { BuyMeCoffeeButton } from "@/components/BuyMeCoffeeButton";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SEOHead } from "@/components/SEOHead";
import { convertPDFToJSON, downloadBlob, type DocumentConversionOptions } from "@/lib/realPdfUtils";
import { useToast } from "@/hooks/use-toast";
import { trackToolUsage } from "@/lib/analytics";
import { ToolSEOContent } from "@/components/ToolSEOContent";

export default function PDFToJSON() {
  const seoData = TOOL_SEO['pdf-to-json'];
  const [file, setFile] = useState<File | null>(null);
  const [structureType, setStructureType] = useState<'pages' | 'words' | 'tables'>('pages');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedFile, setConvertedFile] = useState<Blob | null>(null);
  const { toast } = useToast();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFilesSelected = (files: File[]) => {
    setFile(files[0]);
    setConvertedFile(null);
  };

  const handleDownload = () => {
    if (!convertedFile) return;
    downloadBlob(convertedFile, 'PDFo_ToJSON.json');
  };

  const handleConvert = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    setProgress(0);
    try {
      setProgress(25);
      const options: DocumentConversionOptions = { structureType };
      setProgress(70);
      const jsonBlob = await convertPDFToJSON(file, options);
      setProgress(100);
      setConvertedFile(jsonBlob);
      
      await trackToolUsage("PDF to JSON", "conversion", 1);
      
      toast({
        title: "Success!",
        description: "PDF has been converted to JSON format successfully. Download button available below.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to convert PDF to JSON. Please try again.",
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
        canonicalUrl="https://pdfo.io/pdf-to-json"
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
          <div
            className="w-16 h-16 bg-violet-500 rounded-2xl flex items-center justify-center text-white text-xl mx-auto mb-4"
            role="img"
            aria-label="PDF to JSON tool"
          >
            <i className="fas fa-code" aria-hidden="true"></i>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Convert PDF to JSON
          </h1>

          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
            Convert PDF documents into structured JSON data for developers, APIs, and automation workflows.
          </p>

          {/* Features */}
          <div className="flex justify-center gap-6 mt-6 text-sm">
            <div className="flex items-center text-green-600 dark:text-green-400">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Structured Output
            </div>
            <div className="flex items-center text-green-600 dark:text-green-400">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Developer Friendly
            </div>
            <div className="flex items-center text-green-600 dark:text-green-400">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Free to Use
            </div>
          </div>
        </div>

        {!file ? (
          <FileUpload
            onFilesSelected={handleFilesSelected}
            acceptMultiple={false}
          />
        ) : (
          <>
            {/* File Info Card */}
            <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border-2 border-violet-200 dark:border-violet-700 rounded-lg p-4 mb-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-12 h-12 bg-violet-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                    <i className="fas fa-file-pdf text-xl"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-white truncate">{file.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Size: {(file.size / 1024).toFixed(2)} KB</p>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-violet-100 dark:bg-violet-800 text-violet-800 dark:text-violet-100 mt-2">
                      <i className="fas fa-code mr-1"></i>Ready to Convert
                    </span>
                  </div>
                </div>
                <button onClick={() => { setFile(null); setConvertedFile(null); }} className="ml-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" title="Remove file" data-testid="button-remove-file">
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Conversion Options</h3>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Structure Type</Label>
                  <Select value={structureType} onValueChange={(value: 'pages' | 'words' | 'tables') => setStructureType(value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pages">Pages (text by page)</SelectItem>
                      <SelectItem value="words">Words (individual words with positions)</SelectItem>
                      <SelectItem value="tables">Tables (structured table data)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {structureType === 'pages' && "Extract text content organized by pages"}
                    {structureType === 'words' && "Extract individual words with coordinate positions"}
                    {structureType === 'tables' && "Extract and structure tabular data"}
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <Button
                  onClick={handleConvert}
                  disabled={isProcessing}
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white"
                >
                  {isProcessing ? "Converting..." : "Convert to JSON"}
                </Button>
              </div>
              
              <div className="mt-4 p-4 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
                <p className="text-sm text-violet-700 dark:text-violet-300">
                  <i className="fas fa-info-circle mr-2"></i>
                  The structured data will be saved as a .json file that you can use in applications or databases.
                </p>
              </div>
            </div>
            
            <ProgressBar 
              progress={progress} 
              isVisible={isProcessing} 
              color="violet"
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
                  Download JSON Data
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