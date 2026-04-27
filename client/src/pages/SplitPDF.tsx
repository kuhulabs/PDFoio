import { SITE_URL } from "@/lib/site";
import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { FileUpload } from "@/components/FileUpload";
import { SplitPDFGrid } from "@/components/SplitPDFGrid"; // Assuming this component exists
import { ToolFooter } from "@/components/ToolFooter";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ProgressBar";
import {
  splitPDF,
  downloadBlob,
  generateRealPDFPages,
} from "@/lib/realPdfUtils";
import { useToast } from "@/hooks/use-toast";
import { SEOHead } from "@/components/SEOHead";
import { splitSEO } from "@/seo/split";
import { ToolSEOContent } from "@/components/ToolSEOContent";
import {
  ArrowLeft,
  Scissors,
  FileText,
  Download,
  RefreshCw,
  CheckCircle,
  Coffee,
  Layers,
  Shield,
} from "lucide-react";

interface PDFPage {
  id: string;
  pageNumber: number;
}

interface SplitPoint {
  id: string;
  afterPage: number;
}

export default function SplitPDF() {
  const seoData = splitSEO;

  const [files, setFiles] = useState<File[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PDFPage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [splitFiles, setSplitFiles] = useState<Blob[]>([]);
  const [currentSplitPoints, setCurrentSplitPoints] = useState<SplitPoint[]>(
    [],
  );

  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFilesSelected = async (selectedFiles: File[]) => {
    setFiles((prev) => [...prev, ...selectedFiles]);

    if (selectedFiles.length > 0 && !selectedFile) {
      const firstFile = selectedFiles[0];
      setSelectedFile(firstFile);
      setSplitFiles([]);
      setCurrentSplitPoints([]);

      try {
        const realPages = await generateRealPDFPages(firstFile);
        setPages(realPages);
      } catch (error) {
        console.error(error);
        toast({
          title: "Error reading PDF",
          description:
            "Failed to load PDF pages. The file might be password protected.",
          variant: "destructive",
        });
        setSelectedFile(null);
      }
    }
  };

  const handleSplit = async (splitPoints: SplitPoint[]) => {
    if (!selectedFile) return;

    setCurrentSplitPoints(splitPoints);
    setIsProcessing(true);
    setProgress(10);

    try {
      // Logic to recreate page ranges from split points
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

      // Simulate progress
      const interval = setInterval(
        () => setProgress((prev) => Math.min(prev + 5, 90)),
        300,
      );

      const splitBlobs = await splitPDF(selectedFile, pageRanges);

      clearInterval(interval);
      setProgress(100);
      setSplitFiles(splitBlobs);

      toast({
        title: "Success!",
        description: `PDF split into ${splitBlobs.length} files.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Split Failed",
        description: "Could not split the PDF. Please try again.",
        variant: "destructive",
      });
      setProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetTool = () => {
    setFiles([]);
    setSelectedFile(null);
    setPages([]);
    setSplitFiles([]);
    setCurrentSplitPoints([]);
    setProgress(0);
  };

  return (
    <>
      <SEOHead
        breadcrumbs={[
          { name: "Home", url: SITE_URL },
          { name: "Split PDF", url: `${SITE_URL}/split` },
        ]}
        title={seoData.title}
        description={seoData.metaDescription}
        keywords="split pdf, extract pdf pages, separate pdf pages, cut pdf online"
        canonicalUrl={`${SITE_URL}/split`}
        faqs={seoData.faqs}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[60vh]">
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
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 shadow-sm">
            <Scissors className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {seoData.h1}
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-base md:text-lg leading-relaxed">
            {seoData.shortIntro}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm font-medium">
            <div className="flex items-center text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 rounded-full">
              <Layers className="w-4 h-4 mr-2" /> Custom Ranges
            </div>
            <div className="flex items-center text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-3 py-1 rounded-full">
              <Shield className="w-4 h-4 mr-2" /> Secure Processing
            </div>
          </div>
        </div>

        {files.length === 0 ? (
          <FileUpload
            onFilesSelected={handleFilesSelected}
            acceptMultiple={false}
            accept=".pdf"
            className="max-w-2xl mx-auto"
          />
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* File Info Bar */}
            <div className="flex items-center justify-between mb-6 bg-card border p-4 rounded-xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center text-green-600 dark:text-green-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-medium truncate max-w-[200px] sm:max-w-md">
                    {selectedFile?.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile?.size || 0) / 1024 / 1024 < 1
                      ? `${((selectedFile?.size || 0) / 1024).toFixed(0)} KB`
                      : `${((selectedFile?.size || 0) / 1024 / 1024).toFixed(2)} MB`}
                    • {pages.length} Pages
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetTool}
                className="text-muted-foreground hover:text-destructive"
              >
                Change File
              </Button>
            </div>

            {/* Split Interface */}
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
              color="green"
              className="mt-6"
            />

            {/* Download Section */}
            {splitFiles.length > 0 && !isProcessing && (
              <div className="bg-card border rounded-xl shadow-sm p-6 mt-8 animate-in zoom-in-95">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full text-green-600 dark:text-green-400 mb-2">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold">Split Successful!</h3>
                  <p className="text-muted-foreground text-sm">
                    Created {splitFiles.length} separate PDF files.
                  </p>
                </div>

                <div className="grid gap-3 max-w-2xl mx-auto">
                  {splitFiles.map((blob, index) => {
                    // Logic to calculate page numbers for filenames
                    // (Re-using the logic from your original code for consistency)
                    const groups: PDFPage[][] = [];
                    let currentGroup: PDFPage[] = [];
                    for (const page of pages) {
                      currentGroup.push(page);
                      const hasSplit = currentSplitPoints.some(
                        (sp) => sp.afterPage === page.pageNumber,
                      );
                      if (hasSplit) {
                        groups.push(currentGroup);
                        currentGroup = [];
                      }
                    }
                    if (currentGroup.length > 0) groups.push(currentGroup);

                    const group = groups[index];
                    if (!group) return null;
                    const start = group[0].pageNumber;
                    const end = group[group.length - 1].pageNumber;
                    const fileName =
                      start === end
                        ? `Page_${start}.pdf`
                        : `Pages_${start}-${end}.pdf`;

                    return (
                      <Button
                        key={index}
                        variant="outline"
                        onClick={() =>
                          downloadBlob(blob, `PDFo_Split_${fileName}`)
                        }
                        className="justify-between h-auto py-3 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-950/20 group"
                      >
                        <span className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-muted-foreground group-hover:text-green-600" />
                          {fileName}
                        </span>
                        <Download className="w-4 h-4 text-muted-foreground group-hover:text-green-600" />
                      </Button>
                    );
                  })}
                </div>

                <div className="text-center mt-8 pt-6 border-t">
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
