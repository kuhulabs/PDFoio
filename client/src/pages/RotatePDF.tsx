import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { FileUpload } from "@/components/FileUpload";
import { RotatePDFGrid } from "@/components/RotatePDFGrid";
import { ToolFooter } from "@/components/ToolFooter";
import { ProgressBar } from "@/components/ProgressBar";
import { BuyMeCoffeeButton } from "@/components/BuyMeCoffeeButton";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/SEOHead";
import { TOOL_SEO } from "@/seo/seo";
import { ToolSEOContent } from "@/components/ToolSEOContent";
import { rotatePDFPages, downloadBlob, generateRealPDFPages } from "@/lib/realPdfUtils";
import { useToast } from "@/hooks/use-toast";
import { trackToolUsage } from "@/lib/analytics";
import { 
  CheckCircle2, 
  Shield, 
  Zap, 
  RotateCw, 
  Download,
  ArrowLeft
} from "lucide-react";

interface PDFPage {
  id: string;
  pageNumber: number;
  rotation: number;
}

export default function RotatePDF() {
  const seoData = TOOL_SEO['rotate'];
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PDFPage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [rotatedBlob, setRotatedBlob] = useState<Blob | null>(null);
  const { toast } = useToast();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFilesSelected = async (files: File[]) => {
    // PRODUCTION: Removed debug logging for performance optimization
    const selectedFile = files[0];
    // PRODUCTION: Removed debug logging for performance optimization
    setFile(selectedFile);
    setRotatedBlob(null);
    
    try {
      // Generate real PDF pages from file
      const realPages = await generateRealPDFPages(selectedFile);
      // PRODUCTION: Removed debug logging for performance optimization
      const pagesWithRotation = realPages.map(page => ({
        ...page,
        rotation: 0,
      }));
      setPages(pagesWithRotation);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load PDF pages. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    if (!rotatedBlob) return;
    downloadBlob(rotatedBlob, 'PDFo_Rotate.pdf');
  };

  const handleRotate = async (updatedPages: PDFPage[]) => {
    if (!file) return;
    
    setIsProcessing(true);
    setProgress(0);
    try {
      setProgress(20);
      // Create rotation map for pages that have been rotated
      const rotations: Record<number, number> = {};
      updatedPages.forEach(page => {
        if (page.rotation !== 0) {
          rotations[page.pageNumber - 1] = page.rotation; // Convert to 0-indexed
        }
      });
      
      setProgress(70);
      const processedBlob = await rotatePDFPages(file, rotations);
      setProgress(90);
      setRotatedBlob(processedBlob);
      setProgress(100);
      
      await trackToolUsage("Rotate PDF", "manipulation", 1);
      
      toast({
        title: "Success!",
        description: "Your PDF pages have been rotated successfully. Download button available below.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to rotate PDF pages. Please try again.",
        variant: "destructive",
      });
      setProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <SEOHead breadcrumbs={[{ name: "Home", url: window.location.origin }, { name: "Rotate PDF", url: `${window.location.origin}/rotate` }]}  
        title={seoData.title}
        description={seoData.metaDescription}
        keywords="rotate pdf, flip pdf, change pdf orientation"
        canonicalUrl={`${window.location.origin}/rotate`}
        faqs={seoData.faqs}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to Tools */}
        <div className="mb-8">
          <Link href="/">
            <a className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center text-sm" data-testid="link-back-home">
              ← Back to Tools
            </a>
          </Link>
        </div>

        {/* Tool Header */}
        <div className="text-center mb-8 px-4">
          <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center text-white text-xl mx-auto mb-4 shadow-lg shadow-orange-500/20" role="img" aria-label="Rotate PDF pages tool">
            <RotateCw className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">{seoData.h1}</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed text-sm sm:text-base">
            {seoData.shortIntro}
          </p>
          
          {/* Features */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mt-6 text-xs sm:text-sm">
            <div className="flex items-center text-green-600 dark:text-green-400">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Fast Processing
            </div>
            <div className="flex items-center text-green-600 dark:text-green-400">
              <Shield className="w-4 h-4 mr-2" />
              Secure & Private
            </div>
            <div className="flex items-center text-green-600 dark:text-green-400">
              <Zap className="w-4 h-4 mr-2" />
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
            <RotatePDFGrid
              file={file}
              pages={pages}
              onRotate={handleRotate}
              isProcessing={isProcessing}
            />
            <ProgressBar 
              progress={progress} 
              isVisible={isProcessing} 
              indicatorColor="bg-orange-500"
              className="mt-6"
            />
            
            {/* Download Button */}
            {rotatedBlob && !isProcessing && (
              <div className="text-center space-y-4 mt-6">
                <Button
                  onClick={handleDownload}
                  size="lg"
                  className="bg-green-500 hover:bg-green-600 text-white px-8"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Rotated PDF
                </Button>
                <BuyMeCoffeeButton />
              </div>
            )}
            
            {!rotatedBlob && !isProcessing && (
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
