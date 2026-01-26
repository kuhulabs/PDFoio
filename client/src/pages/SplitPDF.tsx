import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { FileUpload } from "@/components/FileUpload";
import { SplitPDFGrid } from "@/components/SplitPDFGrid";
import { ToolFooter } from "@/components/ToolFooter";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ProgressBar";
import { BuyMeCoffeeButton } from "@/components/BuyMeCoffeeButton";
import { 
  CheckCircle2, 
  Shield, 
  Zap, 
  Scissors, 
  FileText, 
  X, 
  Download,
  ArrowLeft
} from "lucide-react";
import {
  splitPDF,
  downloadBlob,
  generateRealPDFPages,
} from "@/lib/realPdfUtils";
import { useToast } from "@/hooks/use-toast";
import { SEOHead } from "@/components/SEOHead";
import { TOOL_SEO } from "@/seo/seo";
import { ToolSEOContent } from "@/components/ToolSEOContent";

interface PDFPage {
  id: string;
  pageNumber: number;
}

interface SplitPoint {
  id: string;
  afterPage: number;
}

export default function SplitPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PDFPage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [splitFiles, setSplitFiles] = useState<Blob[]>([]);
  const { toast } = useToast();

  const seoData = TOOL_SEO["split"];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFilesSelected = async (selectedFiles: File[]) => {
    setFiles((prev) => [...prev, ...selectedFiles]);
    if (selectedFiles.length > 0 && !selectedFile) {
      const firstFile = selectedFiles[0];
      setSelectedFile(firstFile);
      const realPages = await generateRealPDFPages(firstFile);
      setPages(realPages);
    }
  };

  const [currentSplitPoints, setCurrentSplitPoints] = useState<SplitPoint[]>([]);

  const handleSplit = async (splitPoints: SplitPoint[]) => {
    if (!selectedFile) return;

    setCurrentSplitPoints(splitPoints);
    setIsProcessing(true);
    setProgress(0);
    try {
      setProgress(10);
      const groups: PDFPage[][] = [];
      let currentGroup: PDFPage[] = [];

      for (const page of pages) {
        currentGroup.push(page);
        const hasSplit = splitPoints.some(
          (sp) => sp.afterPage === page.pageNumber,
        );
        if (hasSplit) {
          groups.push(currentGroup);
          currentGroup = [];
        }
      }

      if (currentGroup.length > 0) {
        groups.push(currentGroup);
      }

      const pageRanges = groups.map((group) => [
        group[0].pageNumber,
        group[group.length - 1].pageNumber,
      ]);

      setProgress(50);
      const splitBlobs = await splitPDF(selectedFile, pageRanges);
      setProgress(90);
      setSplitFiles(splitBlobs);
      setProgress(100);

      toast({
        title: "Success!",
        description: `PDF split into ${splitBlobs.length} separate files.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to split PDF file.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <SEOHead
        breadcrumbs={[
          { name: "Home", url: window.location.origin },
          { name: "Split PDF", url: `${window.location.origin}/split` },
        ]}
        title={seoData.title}
        description={seoData.metaDescription}
        keywords="split pdf, extract pdf pages, separate pdf, free pdf splitter"
        canonicalUrl={`${window.location.origin}/split`}
        faqs={seoData.faqs}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/">
            <a className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center text-sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tools
            </a>
          </Link>
        </div>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center text-white text-xl mx-auto mb-4 shadow-lg shadow-green-500/20">
            <Scissors className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {seoData.h1}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
            {seoData.shortIntro}
          </p>

          <div className="flex justify-center gap-6 mt-6 text-sm">
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

        {files.length === 0 ? (
          <FileUpload onFilesSelected={handleFilesSelected} acceptMultiple={false} />
        ) : (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center text-white">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {selectedFile?.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {((selectedFile?.size || 0) / (1024 * 1024)).toFixed(2)} MB • {pages.length} pages
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFiles([]);
                    setSelectedFile(null);
                    setPages([]);
                    setSplitFiles([]);
                    setCurrentSplitPoints([]);
                  }}
                  className="text-red-600 hover:text-red-700 gap-2"
                >
                  <X className="w-4 h-4" />
                  Remove
                </Button>
              </div>
            </div>

            {selectedFile && pages.length > 0 && (
              <SplitPDFGrid
                file={selectedFile}
                pages={pages}
                onSplit={handleSplit}
                isProcessing={isProcessing}
              />
            )}
            <ProgressBar
              progress={progress}
              isVisible={isProcessing}
              indicatorColor="bg-green-500"
              className="mt-6"
            />

            {splitFiles.length > 0 && !isProcessing && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Download Split Files ({splitFiles.length})
                </h3>
                <div className="grid gap-3">
                  {splitFiles.map((blob, index) => {
                    const groups: PDFPage[][] = [];
                    let currentGroup: PDFPage[] = [];
                    for (const page of pages) {
                      currentGroup.push(page);
                      const hasSplit = currentSplitPoints.some((sp) => sp.afterPage === page.pageNumber);
                      if (hasSplit) {
                        groups.push(currentGroup);
                        currentGroup = [];
                      }
                    }
                    if (currentGroup.length > 0) groups.push(currentGroup);
                    const group = groups[index];
                    if (!group) return null;
                    const startPage = group[0].pageNumber;
                    const endPage = group[group.length - 1].pageNumber;
                    const fileName = startPage === endPage ? `PDFo_Split_Page${startPage}.pdf` : `PDFo_Split_Pages${startPage}-${endPage}.pdf`;
                    return (
                      <Button key={index} onClick={() => downloadBlob(blob, fileName)} variant="outline" className="justify-start">
                        <Download className="w-4 h-4 mr-2" />
                        {fileName}
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}

            {!isProcessing && (
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
