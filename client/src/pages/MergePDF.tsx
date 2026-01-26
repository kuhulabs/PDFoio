import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { FileUpload } from "@/components/FileUpload";
import { DocumentsList } from "@/components/DocumentsList";
import { Button } from "@/components/ui/button";
import { ToolFooter } from "@/components/ToolFooter";
import { mergePDFs } from "@/lib/realPdfUtils";
import { useToast } from "@/hooks/use-toast";
import { trackToolUsage } from "@/lib/analytics";
import { Download, RefreshCw, Plus, Layers } from "lucide-react"; // Added Layers icon
import { SEOHead } from "@/components/SEOHead";
import { ProgressBar } from "@/components/ProgressBar";
import { BuyMeCoffeeButton } from "@/components/BuyMeCoffeeButton"; // Using this now
import { TOOL_SEO } from "@/seo/seo";
import { ToolSEOContent } from "@/components/ToolSEOContent";

export default function MergePDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const seoData = TOOL_SEO["merge"];

  // 1. MEMORY MANAGEMENT: Cleanup Blob URL on unmount or change
  useEffect(() => {
    return () => {
      if (mergedPdfUrl) {
        URL.revokeObjectURL(mergedPdfUrl);
      }
    };
  }, [mergedPdfUrl]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFilesSelected = (selectedFiles: File[]) => {
    if (selectedFiles.length === 0) return;
    setFiles(prev => [...prev, ...selectedFiles]);
    
    // If we add files after merging, reset the merge state
    if (mergedPdfUrl) {
      URL.revokeObjectURL(mergedPdfUrl);
      setMergedPdfUrl(null);
      setProgress(0);
    }
  };

  const handleFilesReorder = (reorderedFiles: File[]) => {
    setFiles(reorderedFiles);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      toast({
        title: "Not enough files",
        description: "Please select at least 2 PDF files to merge.",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    setProgress(0);
    
    // Cleanup previous result if exists
    if (mergedPdfUrl) URL.revokeObjectURL(mergedPdfUrl);
    setMergedPdfUrl(null);
    
    try {
      setProgress(10);
      
      const mergedBlob = await mergePDFs(files, (current, total) => {
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
      console.error(error);
      toast({
        title: "Merge Failed",
        description: "An error occurred while merging your files. Please try again.",
        variant: "destructive",
      });
      setProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (mergedPdfUrl) {
      const a = document.createElement('a');
      a.href = mergedPdfUrl;
      a.download = `PDFo_Merge_${new Date().toISOString().slice(0,10)}.pdf`; // Better filename
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const clearFiles = () => {
    if (mergedPdfUrl) URL.revokeObjectURL(mergedPdfUrl); // Cleanup memory
    setFiles([]);
    setMergedPdfUrl(null);
    setProgress(0);
  };

  // 

  return (
    <>
      <SEOHead 
        breadcrumbs={[
          { name: "Home", url: window.location.origin }, 
          { name: "Merge PDF", url: `${window.location.origin}/merge` }
        ]} 
        title={seoData.title}
        description={seoData.metaDescription}
        keywords="merge pdf, combine pdf, join pdf online, free pdf merger"
        canonicalUrl={`${window.location.origin}/merge`}
        faqs={seoData.faqs}
      />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground flex items-center text-sm transition-colors">
            ← Back to Tools
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-6 shadow-lg shadow-blue-500/20">
            <Layers className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
            {seoData.h1}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {seoData.shortIntro}
          </p>
        </div>

        {/* Main Workspace */}
        {files.length === 0 ? (
          <div className="max-w-3xl mx-auto">
            <FileUpload
              onFilesSelected={handleFilesSelected}
              acceptMultiple={true}
              title="Drop PDFs to Merge"
              subtitle="Combine multiple PDFs into one document"
            />
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* List and Reorder Area */}
            <DocumentsList
              files={files}
              onFilesChange={handleFilesReorder}
              title="Arrange Your Files"
            />
            
            {/* Add More Button */}
            <div className="flex justify-center">
               <FileUpload
                  onFilesSelected={handleFilesSelected}
                  acceptMultiple={true}
                  variant="button"
                  buttonText="Add More PDFs"
                  className="w-full max-w-xs"
               />
            </div>

            {/* Progress Bar */}
            <ProgressBar 
              progress={progress} 
              isVisible={isProcessing || !!mergedPdfUrl} // Keep visible if finished
              indicatorColor="bg-blue-500"
              className="max-w-xl mx-auto"
              showLabel={true}
            />

            {/* Action Area */}
            <div className="flex flex-col items-center justify-center gap-6 py-4">
              {!mergedPdfUrl ? (
                <div className="flex gap-4">
                  <Button
                    onClick={handleMerge}
                    disabled={files.length < 2 || isProcessing}
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white min-w-[200px] shadow-lg hover:shadow-blue-500/25 transition-all"
                  >
                    {isProcessing ? 'Merging...' : 'Merge PDFs'}
                  </Button>
                  
                  <Button
                    onClick={clearFiles}
                    variant="outline"
                    size="lg"
                    disabled={isProcessing}
                  >
                    Clear All
                  </Button>
                </div>
              ) : (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-8 text-center w-full max-w-lg animate-in zoom-in-50">
                  <h3 className="text-xl font-bold text-green-800 dark:text-green-300 mb-2">
                    Files Merged Successfully!
                  </h3>
                  <p className="text-green-600 dark:text-green-400 mb-6">
                    Your document is ready for download.
                  </p>
                  
                  <div className="flex flex-col gap-4">
                    <Button
                      onClick={handleDownload}
                      size="lg"
                      className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-green-500/25"
                    >
                      <Download className="h-5 w-5 mr-2" />
                      Download Merged PDF
                    </Button>

                    <div className="flex gap-3 justify-center mt-2">
                       <Button onClick={clearFiles} variant="ghost" size="sm" className="text-gray-500">
                         <RefreshCw className="h-4 w-4 mr-2" />
                         Merge New Files
                       </Button>
                    </div>

                    {/* 2. CONSISTENCY: Using the actual component */}
                    <div className="border-t border-green-200 dark:border-green-800/50 pt-4 mt-2">
                      <BuyMeCoffeeButton className="w-full justify-center" />
                    </div>
                  </div>
                </div>
              )}
            </div>
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
