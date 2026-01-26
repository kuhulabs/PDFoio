import React, { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { FileUpload } from "@/components/FileUpload";
import { ToolFooter } from "@/components/ToolFooter";
import { ProgressBar } from "@/components/ProgressBar";
import { BuyMeCoffeeButton } from "@/components/BuyMeCoffeeButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { SEOHead } from "@/components/SEOHead";
import { TOOL_SEO } from "@/seo/seo";
import { ToolSEOContent } from "@/components/ToolSEOContent";
import {
  editPDFMetadata,
  getPDFMetadata,
  downloadBlob,
  type PDFMetadata,
} from "@/lib/realPdfUtils";
import { useToast } from "@/hooks/use-toast";
import { trackToolUsage } from "@/lib/analytics";
import { Edit, RefreshCw, Download, FileText } from "lucide-react";

const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://pdfo.io';

const METADATA_FIELDS = [
  { key: "title", label: "Title", placeholder: "Document title" },
  { key: "author", label: "Author", placeholder: "Author name" },
  { key: "subject", label: "Subject", placeholder: "Document subject" },
  { key: "keywords", label: "Keywords", placeholder: "keyword1, keyword2" },
] as const;

export default function EditMetadata() {
  const seoData = TOOL_SEO["metadata"];
  
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<PDFMetadata>({
    title: "",
    author: "",
    subject: "",
    keywords: "",
  });
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [updatedBlob, setUpdatedBlob] = useState<Blob | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const { toast } = useToast();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Reset function
  const handleReset = useCallback(() => {
    setFile(null);
    setMetadata({ title: "", author: "", subject: "", keywords: "" });
    setUpdatedBlob(null);
    setProgress(0);
    setIsProcessing(false);
    setIsLoadingMetadata(false);
    setShowSuccess(false);
  }, []);

  // Handle file selection
  const handleFilesSelected = useCallback(async (files: File[]) => {
    const selectedFile = files[0];
    setFile(selectedFile);
    setUpdatedBlob(null);
    setProgress(0);
    setIsLoadingMetadata(true);

    try {
      const existingMetadata = await getPDFMetadata(selectedFile);
      setMetadata(existingMetadata);
    } catch (error) {
      console.error('Error loading metadata:', error);
      toast({
        title: "Warning",
        description: "Could not read existing metadata. You can still add new metadata.",
      });
      // Don't reset - allow user to add new metadata
    } finally {
      setIsLoadingMetadata(false);
    }
  }, [toast]);

  // Download handler
  const handleDownload = useCallback(() => {
    if (updatedBlob) {
      const filename = `PDFo_${file?.name.replace('.pdf', '')}_metadata.pdf`;
      downloadBlob(updatedBlob, filename);
    }
  }, [updatedBlob, file]);

  // Update metadata
  const handleUpdateMetadata = useCallback(async () => {
    if (!file) return;

    // Validation - at least one field should be filled
    const hasData = Object.values(metadata).some(val => val.trim() !== "");
    if (!hasData) {
      toast({
        title: "Validation Error",
        description: "Please fill at least one metadata field.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      setProgress(30);
      const blob = await editPDFMetadata(file, metadata);
      
      setProgress(90);
      setUpdatedBlob(blob);
      setProgress(100);

      // Track analytics (non-blocking)
      try {
        await trackToolUsage("Edit Metadata", "manipulation", 1);
      } catch (analyticsError) {
        console.warn('Analytics tracking failed:', analyticsError);
      }

      // Show success
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      toast({
        title: "Success! ✓",
        description: "PDF metadata updated successfully.",
      });

    } catch (error) {
      console.error('Error updating metadata:', error);
      toast({
        title: "Error",
        description: "Failed to update metadata. Please try again.",
        variant: "destructive",
      });
      setProgress(0);
    } finally {
      setIsProcessing(false);
      setTimeout(() => setProgress(0), 500);
    }
  }, [file, metadata, toast]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Download: Ctrl/Cmd + S
      if ((e.ctrlKey || e.metaKey) && e.key === 's' && updatedBlob) {
        e.preventDefault();
        handleDownload();
      }
      
      // Update: Ctrl/Cmd + Enter
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && file && !isProcessing) {
        e.preventDefault();
        handleUpdateMetadata();
      }
      
      // Reset: Escape
      if (e.key === 'Escape' && !isProcessing) {
        handleReset();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [updatedBlob, file, isProcessing, handleDownload, handleUpdateMetadata, handleReset]);

  return (
    <>
      <SEOHead
        title={seoData.title}
        description={seoData.metaDescription}
        keywords="edit pdf metadata, change pdf properties, pdf author, pdf title"
        canonicalUrl={`${SITE_URL}/metadata`}
        faqs={seoData.faqs}
        breadcrumbs={[
          { name: "Home", url: SITE_URL },
          { name: "Edit Metadata", url: `${SITE_URL}/metadata` },
        ]}
      />

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in z-50">
          ✓ Metadata updated successfully!
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
        <header className="text-center mb-10">
          <div className="w-16 h-16 bg-cyan-500 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4 shadow-lg shadow-cyan-500/20">
            <Edit className="h-8 w-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            {seoData.h1}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            {seoData.shortIntro}
          </p>
        </header>

        {/* Main Content */}
        {!file ? (
          <FileUpload 
            onFilesSelected={handleFilesSelected} 
            acceptMultiple={false}
          />
        ) : (
          <>
            {/* Reset Button */}
            <div className="flex justify-center mb-6">
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={isProcessing || isLoadingMetadata}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Change File
              </Button>
            </div>

            {/* Loading Metadata */}
            {isLoadingMetadata && (
              <Card className="max-w-2xl mx-auto p-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Loading metadata...
                  </p>
                </div>
              </Card>
            )}

            {/* Metadata Form */}
            {!isLoadingMetadata && (
              <Card className="max-w-2xl mx-auto p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="h-6 w-6 text-cyan-500" />
                  <h3 className="text-xl font-semibold">PDF Metadata</h3>
                </div>

                <div className="space-y-5">
                  {METADATA_FIELDS.map(({ key, label, placeholder }) => (
                    <div key={key} className="space-y-2">
                      <Label 
                        htmlFor={key}
                        className="text-sm font-medium"
                      >
                        {label}
                      </Label>
                      <Input
                        id={key}
                        value={metadata[key] || ""}
                        onChange={(e) =>
                          setMetadata((prev) => ({
                            ...prev,
                            [key]: e.target.value,
                          }))
                        }
                        placeholder={placeholder}
                        disabled={isProcessing}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-3">
                  <Button
                    onClick={handleUpdateMetadata}
                    disabled={isProcessing}
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-6"
                    size="lg"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Updating Metadata...
                      </>
                    ) : (
                      "Update Metadata"
                    )}
                  </Button>
                  
                  {!isProcessing && (
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                      Press Ctrl+Enter to update
                    </p>
                  )}
                </div>
              </Card>
            )}

            {/* Progress Bar */}
            <ProgressBar
              progress={progress}
              isVisible={isProcessing}
              indicatorColor="bg-cyan-500"
              className="mt-6"
            />

            {/* Download Section */}
            {updatedBlob && !isProcessing && (
              <div className="text-center mt-8 space-y-4">
                <div className="space-y-3">
                  <Button
                    onClick={handleDownload}
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg gap-2"
                  >
                    <Download className="h-5 w-5" />
                    Download Updated PDF
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

            {/* Coffee Button (when not processing) */}
            {!isProcessing && !updatedBlob && (
              <div className="text-center mt-8">
                <BuyMeCoffeeButton />
              </div>
            )}
          </>
        )}
      </div>

      {/* SEO Content */}
      <ToolSEOContent 
        pageTitle={seoData.h1}
        {...seoData} 
      />
      
      <ToolFooter />
    </>
  );
}