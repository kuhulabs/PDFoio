import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { FileUpload } from "@/components/FileUpload";
import { ToolFooter } from "@/components/ToolFooter";
import { ProgressBar } from "@/components/ProgressBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Assuming you have this, otherwise Input is fine
import { SEOHead } from "@/components/SEOHead";
import { metadataSEO } from "@/seo/metadata";
import { ToolSEOContent } from "@/components/ToolSEOContent";
import {
  editPDFMetadata,
  getPDFMetadata,
  downloadBlob,
  type PDFMetadata,
} from "@/lib/realPdfUtils";
import { useToast } from "@/hooks/use-toast";
import { trackToolUsage } from "@/lib/analytics";
import {
  ArrowLeft,
  FileText,
  User,
  Tag,
  BookOpen,
  Save,
  Download,
  RefreshCw,
  CheckCircle,
  Coffee,
} from "lucide-react";

export default function EditMetadata() {
  const seoData = metadataSEO;
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<PDFMetadata>({
    title: "",
    author: "",
    subject: "",
    keywords: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [updatedBlob, setUpdatedBlob] = useState<Blob | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFilesSelected = async (files: File[]) => {
    const selectedFile = files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setUpdatedBlob(null);

    try {
      const existingMetadata = await getPDFMetadata(selectedFile);
      setMetadata(existingMetadata);
    } catch (e) {
      console.error("Error reading metadata", e);
      toast({
        title: "Metadata Read Error",
        description:
          "Could not read existing metadata, but you can still set new values.",
        variant: "default",
      });
    }
  };

  const handleDownload = () => {
    if (updatedBlob) {
      downloadBlob(updatedBlob, `PDFo_Metadata_${Date.now()}.pdf`);
    }
  };

  const handleUpdateMetadata = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(20);

    try {
      const blob = await editPDFMetadata(file, metadata);
      setProgress(100);
      setUpdatedBlob(blob);

      await trackToolUsage("Edit Metadata", "manipulation", 1);

      toast({
        title: "Success!",
        description: "PDF properties updated successfully.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Update Failed",
        description:
          "Failed to update PDF metadata. Is the file password protected?",
        variant: "destructive",
      });
      setProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetTool = () => {
    setFile(null);
    setMetadata({ title: "", author: "", subject: "", keywords: "" });
    setUpdatedBlob(null);
    setProgress(0);
  };

  // Helper to render input fields with icons
  const renderField = (
    key: keyof PDFMetadata,
    label: string,
    icon: React.ReactNode,
    placeholder: string,
    isTextArea = false,
  ) => (
    <div className="space-y-2">
      <Label
        htmlFor={key}
        className="text-sm font-medium flex items-center gap-2"
      >
        {icon} {label}
      </Label>
      {isTextArea ? (
        <Textarea
          id={key}
          value={metadata[key] || ""}
          onChange={(e) =>
            setMetadata((prev) => ({ ...prev, [key]: e.target.value }))
          }
          placeholder={placeholder}
          className="min-h-[80px] resize-none"
        />
      ) : (
        <Input
          id={key}
          value={metadata[key] || ""}
          onChange={(e) =>
            setMetadata((prev) => ({ ...prev, [key]: e.target.value }))
          }
          placeholder={placeholder}
          className="h-10"
        />
      )}
    </div>
  );

  return (
    <>
      <SEOHead
        breadcrumbs={[
          { name: "Home", url: window.location.origin },
          { name: "Edit Metadata", url: `${window.location.origin}/metadata` },
        ]}
        title={seoData.title}
        description={seoData.metaDescription}
        keywords="edit pdf metadata, change pdf author, pdf title editor, pdf properties"
        canonicalUrl={`${window.location.origin}/metadata`}
        faqs={seoData.faqs}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[60vh]">
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
          <div className="w-16 h-16 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 shadow-sm">
            <FileText className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {seoData.h1}
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-base md:text-lg leading-relaxed">
            {seoData.shortIntro}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm font-medium">
            <div className="flex items-center text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 rounded-full">
              <i className="fas fa-bolt mr-2"></i> Instant Update
            </div>
            <div className="flex items-center text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-3 py-1 rounded-full">
              <i className="fas fa-shield-alt mr-2"></i> Browser-based
            </div>
          </div>
        </div>

        {/* Main Interface */}
        {!file ? (
          <FileUpload
            onFilesSelected={handleFilesSelected}
            accept=".pdf"
            acceptMultiple={false}
            className="max-w-2xl mx-auto"
          />
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Show Form or Result */}
            {!updatedBlob ? (
              <div className="max-w-2xl mx-auto bg-card border rounded-xl shadow-sm p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6 pb-6 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                      <i className="fas fa-file-pdf text-red-600 dark:text-red-400"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground truncate max-w-[200px] sm:max-w-xs">
                        {file.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Ready to edit
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetTool}
                    className="text-muted-foreground"
                  >
                    Change File
                  </Button>
                </div>

                <div className="grid gap-6">
                  {renderField(
                    "title",
                    "Title",
                    <BookOpen className="w-4 h-4 text-cyan-500" />,
                    "e.g. Q4 Financial Report",
                  )}

                  {renderField(
                    "author",
                    "Author",
                    <User className="w-4 h-4 text-cyan-500" />,
                    "e.g. John Doe",
                  )}

                  {renderField(
                    "subject",
                    "Subject / Description",
                    <FileText className="w-4 h-4 text-cyan-500" />,
                    "e.g. Annual report for stakeholders",
                    true, // Textarea
                  )}

                  {renderField(
                    "keywords",
                    "Keywords (Comma separated)",
                    <Tag className="w-4 h-4 text-cyan-500" />,
                    "e.g. finance, report, 2024, confidential",
                  )}
                </div>

                <div className="mt-8 pt-4 border-t flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={handleUpdateMetadata}
                    disabled={isProcessing}
                    className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white shadow-md h-11"
                  >
                    {isProcessing ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>{" "}
                        Processing...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" /> Update Metadata
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              /* Success View */
              <div className="max-w-2xl mx-auto bg-card border rounded-xl shadow-sm p-8 text-center animate-in zoom-in-95 duration-300">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>

                <h2 className="text-2xl font-bold mb-2">Metadata Updated!</h2>
                <p className="text-muted-foreground mb-8">
                  Your PDF properties have been successfully saved.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={handleDownload}
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-white shadow-lg font-semibold w-full sm:w-auto"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download PDF
                  </Button>

                  <Button
                    onClick={resetTool}
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Edit Another
                  </Button>
                </div>

                {/* Buy Me Coffee */}
                <div className="mt-8 pt-6 border-t">
                  <p className="text-sm text-muted-foreground mb-3">
                    Found this helpful?
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

            <ProgressBar
              progress={progress}
              isVisible={isProcessing}
              color="cyan"
              className="fixed top-0 left-0 right-0 z-50 h-1"
            />
          </div>
        )}
      </div>

      <ToolSEOContent {...seoData} />
      <ToolFooter />
    </>
  );
}
