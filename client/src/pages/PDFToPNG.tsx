import { TOOL_SEO } from "@/seo/seo";
import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { FileUpload } from "@/components/FileUpload";
import { ToolFooter } from "@/components/ToolFooter";
import { ProgressBar } from "@/components/ProgressBar";
import { BuyMeCoffeeButton } from "@/components/BuyMeCoffeeButton";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { SEOHead } from "@/components/SEOHead";
import {
  convertPDFToImages,
  downloadBlob,
  type ImageConversionOptions,
} from "@/lib/realPdfUtils";
import { useToast } from "@/hooks/use-toast";
import { ToolSEOContent } from "@/components/ToolSEOContent";

export default function PDFToPNG() {
  const seoData = TOOL_SEO["pdf-to-png"];
  const [file, setFile] = useState<File | null>(null);
  const [transparentBackground, setTransparentBackground] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedFile, setConvertedFile] = useState<Blob | null>(null);
  const [individualImages, setIndividualImages] = useState<Blob[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [isIndividualOpen, setIsIndividualOpen] = useState(false);
  const { toast } = useToast();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFilesSelected = (files: File[]) => {
    setFile(files[0]);
    setConvertedFile(null);
    setIndividualImages([]);
    setPageCount(0);
  };

  const handleDownload = () => {
    if (!convertedFile) return;
    downloadBlob(convertedFile, "PDFo_ToPNG.zip");
  };

  const handleDownloadSingle = (imageBlob: Blob, pageNum: number) => {
    downloadBlob(imageBlob, `PDFo_Page${pageNum}.png`);
  };

  const handleConvert = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);
    try {
      setProgress(10);
      const options: ImageConversionOptions = { transparentBackground };

      // We'll update progress based on page processing in a future iteration
      // For now, let's just show progress starting
      setProgress(30);

      const result = await convertPDFToImages(file, "png", options);
      setProgress(100);
      setConvertedFile(result.zipBlob);
      setIndividualImages(result.images);
      setPageCount(result.pageCount);
      toast({
        title: "Success!",
        description: `PDF converted to ${result.pageCount} PNG images. Download individually or as ZIP.`,
      });
    } catch (error) {
      console.error("PNG conversion error:", error);
      toast({
        title: "Error",
        description:
          "Failed to convert PDF to PNG. Please ensure the PDF is not password protected.",
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
        canonicalUrl="https://pdfo.io/pdf-to-png"
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to Tools */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center text-sm"
            data-testid="link-back-home"
          >
            ← Back to Tools
          </Link>
        </div>

        {/* Tool Header */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white text-xl mx-auto mb-4"
            role="img"
            aria-label="PDF to PNG conversion tool"
          >
            <i className="far fa-images" aria-hidden="true"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            PDF to PNG
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
            Convert your PDF pages to PNG images with transparency support
          </p>

          {/* Features */}
          <div className="flex justify-center gap-6 mt-6 text-sm">
            <div className="flex items-center text-green-600 dark:text-green-400">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Transparency Support
            </div>
            <div className="flex items-center text-green-600 dark:text-green-400">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Lossless Quality
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
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-2 border-emerald-200 dark:border-emerald-700 rounded-lg p-4 mb-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                    <i className="fas fa-file-pdf text-xl"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                      {file.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Size: {(file.size / 1024).toFixed(2)} KB
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-100">
                        <i className="fas fa-image mr-1"></i>
                        Ready to Convert
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setFile(null);
                    setConvertedFile(null);
                    setIndividualImages([]);
                    setPageCount(0);
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Conversion Options
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Transparent Background
                    </Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Enable transparency instead of white background
                    </p>
                  </div>
                  <Switch
                    checked={transparentBackground}
                    onCheckedChange={setTransparentBackground}
                  />
                </div>
              </div>

              <div className="mt-6">
                <Button
                  onClick={handleConvert}
                  disabled={isProcessing}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {isProcessing ? "Converting..." : "Convert to PNG"}
                </Button>
              </div>

              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-300">
                  <i className="fas fa-info-circle mr-2"></i>
                  All pages will be converted to PNG format and downloaded as a
                  ZIP file.
                </p>
              </div>
            </div>

            <ProgressBar
              progress={progress}
              isVisible={isProcessing}
              color="emerald"
              className="mt-6"
            />

            {/* Download Section */}
            {convertedFile && !isProcessing && individualImages.length > 0 && (
              <div className="space-y-6 mt-6">
                {/* Individual Downloads - Collapsible */}
                <Collapsible
                  open={isIndividualOpen}
                  onOpenChange={setIsIndividualOpen}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg"
                >
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <CollapsibleTrigger
                      className="w-full flex items-center justify-between hover:opacity-80 transition-opacity"
                      data-testid="button-toggle-individual"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        <i className="fas fa-images mr-2 text-emerald-500"></i>
                        Individual Images ({pageCount} pages)
                      </h3>
                      <i
                        className={`fas fa-chevron-${isIndividualOpen ? "up" : "down"} text-gray-500`}
                      ></i>
                    </CollapsibleTrigger>
                  </div>

                  <CollapsibleContent>
                    <div className="p-6">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {individualImages.map((imageBlob, index) => (
                          <button
                            key={index}
                            onClick={() =>
                              handleDownloadSingle(imageBlob, index + 1)
                            }
                            className="flex flex-col items-center justify-center p-4 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-lg border-2 border-emerald-200 dark:border-emerald-700 transition-colors"
                            data-testid={`button-download-page-${index + 1}`}
                          >
                            <i className="fas fa-file-image text-2xl text-emerald-500 mb-2"></i>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              Page {index + 1}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              <i className="fas fa-download mr-1"></i>
                              Download
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* ZIP Download */}
                <div className="text-center space-y-4">
                  <Button
                    onClick={handleDownload}
                    size="lg"
                    className="bg-green-500 hover:bg-green-600 text-white px-8"
                    data-testid="button-download-zip"
                  >
                    <i className="fas fa-file-archive mr-2"></i>
                    Download All as ZIP
                  </Button>
                  <BuyMeCoffeeButton />
                </div>
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
