import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { FileUpload } from "@/components/FileUpload";
import { ToolFooter } from "@/components/ToolFooter";
import { ProgressBar } from "@/components/ProgressBar";
import { BuyMeCoffeeButton } from "@/components/BuyMeCoffeeButton";
import { Button } from "@/components/ui/button";
import {
  compressPDF,
  downloadBlob,
} from "@/lib/realPdfUtils";
import { useToast } from "@/hooks/use-toast";
import { trackToolUsage } from "@/lib/analytics";
import { SEOHead } from "@/components/SEOHead";
import { TOOL_SEO } from "@/seo/seo";
import { ToolSEOContent } from "@/components/ToolSEOContent";
import { 
  Minimize2, 
  FileText, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowLeft 
} from "lucide-react";

export default function CompressPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [compressionLevel, setCompressionLevel] = useState<"low" | "medium" | "high" | null>(null);
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

  const handleCompress = async (level: "low" | "medium" | "high") => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(10);
    setCompressionLevel(level);

    try {
      // level here is "low" | "medium" | "high" which matches CompressionLevel type
      const blob = await compressPDF(file, level as any);
      setProgress(100);

      const compSize = blob.size;
      setCompressedSize(compSize);
      setCompressedBlob(blob);

      if (compSize >= originalSize) {
        toast({
          title: "Optimization Complete",
          description: "This PDF is already highly optimized.",
          variant: "default",
        });
      } else {
        await trackToolUsage("Compress PDF", "optimization", 1);
        toast({
          title: "Success!",
          description: `Size reduced by ${Math.round(((originalSize - compSize) / originalSize) * 100)}%.`,
        });
      }
    } catch (error) {
      toast({
        title: "Compression Failed",
        description: "Could not compress the file.",
        variant: "destructive",
      });
      setCompressionLevel(null);
      setProgress(0);
    } finally {
      setIsProcessing(false);
    }
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
        keywords="compress pdf, reduce pdf size, shrink pdf online"
        canonicalUrl={`${window.location.origin}/compress`}
        faqs={seoData.faqs}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/">
            <a className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center text-sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tools
            </a>
          </Link>
        </div>

        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-red-500/20">
            <Minimize2 className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            {seoData.h1}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {seoData.shortIntro}
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {["Smart Compression", "Secure & Private", "100% Free"].map((feat, i) => (
              <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                <CheckCircle2 className="w-3 h-3 mr-2" /> {feat}
              </span>
            ))}
          </div>
        </div>

        {!file ? (
          <FileUpload onFilesSelected={handleFilesSelected} acceptMultiple={false} />
        ) : (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{file.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Original Size: {formatFileSize(originalSize)}</p>
                </div>
                <Button onClick={() => { setFile(null); setCompressedBlob(null); }} variant="ghost" size="icon"><RefreshCw className="w-4 h-4" /></Button>
              </div>
              {compressedSize && (
                <div className="mt-6 bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-100 dark:border-green-900/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" /></div>
                      <div><p className="text-sm font-semibold">Compression Successful</p><p className="text-xs">{formatFileSize(originalSize)} → {formatFileSize(compressedSize)}</p></div>
                    </div>
                    <span className="text-2xl font-bold text-green-600">-{getReductionPercentage()}%</span>
                  </div>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['low', 'medium', 'high'].map((lvl) => (
                <button key={lvl} onClick={() => handleCompress(lvl as any)} disabled={isProcessing} className={`p-4 rounded-xl border-2 text-left transition-all ${compressionLevel === lvl ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"}`}>
                  <div className="text-sm font-semibold capitalize">{lvl}</div>
                </button>
              ))}
            </div>
            <ProgressBar progress={progress} isVisible={isProcessing} indicatorColor="bg-blue-500" className="mt-6" />
            {compressedBlob && !isProcessing && (
              <div className="flex flex-col items-center gap-4 mt-8 pt-8 border-t">
                <Button onClick={handleDownload} size="lg" className="bg-green-600 text-white shadow-lg"><Download className="w-5 h-5 mr-2" />Download Compressed PDF</Button>
                <BuyMeCoffeeButton />
              </div>
            )}
          </div>
        )}
      </div>
      <ToolSEOContent intro={seoData.intro} howItWorks={seoData.howItWorks} benefits={seoData.benefits} faqs={seoData.faqs} relatedTools={seoData.relatedTools} />
      <ToolFooter />
    </>
  );
}
