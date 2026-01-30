import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { FileUpload } from "@/components/FileUpload";
import { ToolFooter } from "@/components/ToolFooter";
import { ProgressBar } from "@/components/ProgressBar";
import { Button } from "@/components/ui/button";
import { downloadBlob, type CompressionLevel } from "@/lib/realPdfUtils";
import { useToast } from "@/hooks/use-toast";
import { trackToolUsage } from "@/lib/analytics";
import { SEOHead } from "@/components/SEOHead";
import { TOOL_SEO } from "@/seo/seo";
import { ToolSEOContent } from "@/components/ToolSEOContent";
import {
  ArrowLeft,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Coffee,
  FileText,
} from "lucide-react";

export default function CompressPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [compressionLevel, setCompressionLevel] = useState<
    CompressionLevel["level"] | null
  >(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const { toast } = useToast();

  const seoData = TOOL_SEO["compress"];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFilesSelected = (files: File[]) => {
    const selectedFile = files[0];
    if (!selectedFile) return;

    // Check for max size (e.g. 50MB) before uploading
    if (selectedFile.size > 50 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 50MB for compression.",
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);
    setOriginalSize(selectedFile.size);
    setCompressedSize(null);
    setCompressionLevel(null);
    setCompressedBlob(null);
    setProgress(0);
  };

  const handleDownload = () => {
    if (!compressedBlob) return;
    downloadBlob(compressedBlob, `PDFo_Compressed_${Date.now()}.pdf`);
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ["B", "KB", "MB", "GB"];
    if (bytes === 0) return "0 B";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  const getReductionPercentage = () => {
    if (!compressedSize) return 0;
    return Math.round(((originalSize - compressedSize) / originalSize) * 100);
  };

  const handleCompress = async (level: CompressionLevel["level"]) => {
    if (!file) return;

    setCompressionLevel(level);
    setIsProcessing(true);
    setProgress(10); // Start progress

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("level", level);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 5;
        });
      }, 500);

      const res = await fetch("/api/compress-pdf", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Compression failed");
      }

      const blob = await res.blob();
      setProgress(100);

      // If compression didn't help much
      if (blob.size >= originalSize) {
        toast({
          title: "Already Optimized",
          description:
            "This PDF is already highly compressed. We couldn't make it smaller without ruining quality.",
        });
        // Still allow download, but warn
        setCompressedSize(blob.size);
        setCompressedBlob(blob);
      } else {
        setCompressedSize(blob.size);
        setCompressedBlob(blob);
        await trackToolUsage("Compress PDF", "optimization", 1);

        toast({
          title: "Success!",
          description: `Reduced by ${Math.round(((originalSize - blob.size) / originalSize) * 100)}%!`,
        });
      }
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to compress PDF. Please try again.",
        variant: "destructive",
      });
      setProgress(0);
      setCompressionLevel(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetTool = () => {
    setFile(null);
    setOriginalSize(0);
    setCompressedSize(null);
    setCompressionLevel(null);
    setCompressedBlob(null);
    setProgress(0);
  };

  return (
    <>
      <SEOHead
        breadcrumbs={[
          { name: "Home", url: window.location.origin },
          { name: "Compress PDF", url: `${window.location.origin}/compress` },
        ]}
        title={seoData.title}
        description={seoData.metaDescription}
        keywords="compress pdf, reduce pdf size, shrink pdf, optimize pdf"
        canonicalUrl={`${window.location.origin}/compress`}
        faqs={seoData.faqs}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[60vh]">
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
            <i className="fas fa-compress-alt" aria-hidden="true"></i>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {seoData.h1}
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-base md:text-lg leading-relaxed">
            {seoData.shortIntro}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm font-medium">
            <div className="flex items-center text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 rounded-full">
              <i className="fas fa-bolt mr-2"></i> Smart Compression
            </div>
            <div className="flex items-center text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-3 py-1 rounded-full">
              <i className="fas fa-shield-alt mr-2"></i> Secure Processing
            </div>
          </div>
        </div>

        {/* Main Interface */}
        {!file ? (
          <FileUpload
            onFilesSelected={handleFilesSelected}
            accept=".pdf"
            maxSize={50 * 1024 * 1024} // 50MB Match Server Limit
            acceptMultiple={false}
            className="max-w-2xl mx-auto"
          />
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* File Info Card */}
            <div className="bg-card border rounded-xl shadow-sm p-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold truncate text-foreground">
                    {file.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Original size:{" "}
                    <span className="font-medium text-foreground">
                      {formatFileSize(originalSize)}
                    </span>
                  </p>
                </div>
                {!isProcessing && !compressedBlob && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={resetTool}
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    <span className="sr-only">Remove file</span>
                    <i className="fas fa-times"></i>
                  </Button>
                )}
              </div>

              {/* Success Result Banner */}
              {compressedSize && (
                <div className="mt-6 bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-100 dark:border-green-800">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                      <div>
                        <p className="text-sm font-semibold text-green-800 dark:text-green-200">
                          Compression Successful!
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400">
                          {formatFileSize(originalSize)} →{" "}
                          {formatFileSize(compressedSize)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        -{getReductionPercentage()}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Compression Levels - Only show if not yet compressed */}
            {!compressedBlob && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-foreground text-center">
                  Select Compression Level
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      id: "low",
                      label: "Low Compression",
                      desc: "Best Quality",
                      save: "~10-20%",
                      color: "blue",
                    },
                    {
                      id: "medium",
                      label: "Medium Compression",
                      desc: "Good Balance",
                      save: "~30-50%",
                      color: "orange",
                    },
                    {
                      id: "high",
                      label: "High Compression",
                      desc: "Smallest Size",
                      save: "~50-70%",
                      color: "red",
                    },
                  ].map((level) => (
                    <button
                      key={level.id}
                      onClick={() =>
                        handleCompress(level.id as CompressionLevel["level"])
                      }
                      disabled={isProcessing}
                      className={`
                        relative p-4 rounded-xl border-2 text-left transition-all duration-200
                        ${
                          compressionLevel === level.id
                            ? `border-${level.color}-500 ring-1 ring-${level.color}-500 bg-${level.color}-50 dark:bg-${level.color}-950/30`
                            : "border-border hover:border-primary/50 hover:bg-accent"
                        }
                        ${isProcessing ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                      `}
                    >
                      {isProcessing && compressionLevel === level.id && (
                        <div className="absolute inset-0 bg-white/50 dark:bg-black/20 flex items-center justify-center rounded-xl z-10">
                          <i className="fas fa-spinner fa-spin text-2xl text-primary"></i>
                        </div>
                      )}

                      <div className="flex flex-col h-full justify-between">
                        <div>
                          <h5 className="font-semibold text-foreground">
                            {level.label}
                          </h5>
                          <p className="text-xs text-muted-foreground mt-1">
                            {level.desc}
                          </p>
                        </div>
                        <div className="mt-3 flex items-end justify-between">
                          <span
                            className={`text-sm font-bold text-${level.color}-600 dark:text-${level.color}-400`}
                          >
                            {level.save}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex items-start p-3 text-sm text-amber-600 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-100 dark:border-amber-900/50">
                  <AlertTriangle className="w-4 h-4 mt-0.5 mr-2 shrink-0" />
                  <p>
                    High compression may slightly reduce image quality.
                    Recommended for documents with mostly text.
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons (Download/Reset) */}
            {compressedBlob && (
              <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <Button
                  onClick={handleDownload}
                  size="lg"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-14 text-lg shadow-md"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download Compressed PDF
                </Button>

                <div className="flex justify-center pt-4">
                  <Button
                    onClick={resetTool}
                    variant="outline"
                    className="text-muted-foreground"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Compress Another File
                  </Button>
                </div>

                {/* Coffee Button */}
                <div className="pt-6 text-center border-t mt-6">
                  <p className="text-sm text-muted-foreground mb-3">
                    Saved some space? Support the developer!
                  </p>
                  <a
                    href="https://www.buymeacoffee.com/kuhulabsq"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-2 text-sm font-medium text-black bg-[#FFDD00] hover:bg-[#FFDD00]/90 rounded-full transition-all hover:scale-105 shadow-sm"
                  >
                    <Coffee className="h-4 w-4 mr-2" />
                    Buy me a coffee
                  </a>
                </div>
              </div>
            )}

            {/* Global Progress Bar (Top) */}
            <ProgressBar
              progress={progress}
              isVisible={isProcessing}
              color="blue"
              className="mt-6"
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
