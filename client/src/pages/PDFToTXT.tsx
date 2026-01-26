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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SEOHead } from "@/components/SEOHead";
import { ToolSEOContent } from "@/components/ToolSEOContent";
import {
  convertPDFToTXT,
  downloadBlob,
  type DocumentConversionOptions,
} from "@/lib/realPdfUtils";
import { useToast } from "@/hooks/use-toast";
import { trackToolUsage } from "@/lib/analytics";

export default function PDFToTXT() {
  const seoData = TOOL_SEO["pdf-to-txt"];
  const [file, setFile] = useState<File | null>(null);
  const [includePageBreaks, setIncludePageBreaks] = useState(true);
  const [lineEndingStyle, setLineEndingStyle] = useState<
    "unix" | "windows" | "mac"
  >("unix");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedFile, setConvertedFile] = useState<Blob | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFilesSelected = (files: File[]) => {
    setFile(files[0]);
    setConvertedFile(null);
  };

  const handleDownload = () => {
    if (!convertedFile) return;
    downloadBlob(convertedFile, "PDFo_ToTXT.txt");
  };

  const handleConvert = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);
    try {
      setProgress(25);
      const options: DocumentConversionOptions = {
        includePageBreaks,
        lineEndingStyle,
      };
      setProgress(70);
      const txtBlob = await convertPDFToTXT(file, options);
      setProgress(100);
      setConvertedFile(txtBlob);

      await trackToolUsage("PDF to TXT", "conversion", 1);

      toast({
        title: "Success!",
        description:
          "PDF has been converted to plain text successfully. Download button available below.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to convert PDF to text. Please try again.",
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
        breadcrumbs={[
          { name: "Home", url: window.location.origin },
          {
            name: "PDF to TXT",
            url: `${window.location.origin}/pdf-to-txt`,
          },
        ]}
        title={seoData.title}
        description={seoData.metaDescription}
        keywords={(seoData as any).keywords || ""}
        canonicalUrl={`${window.location.origin}/pdf-to-txt`}
        faqs={seoData.faqs}
      />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-gray-500 hover:text-gray-700 flex items-center text-sm"
          >
            ← Back to Tools
          </Link>
        </div>

        {/* Tool Header */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 bg-slate-500 rounded-2xl flex items-center justify-center text-white text-xl mx-auto mb-4"
            role="img"
            aria-label="PDF to TXT tool"
          >
            <i className="fas fa-file-lines" aria-hidden="true"></i>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            PDF to TXT
          </h1>

          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
            Extract plain text from PDF documents instantly and accurately.
          </p>

          {/* Features */}
          <div className="flex justify-center gap-6 mt-6 text-sm">
            <div className="flex items-center text-green-600 dark:text-green-400">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Plain Text
            </div>
            <div className="flex items-center text-green-600 dark:text-green-400">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Secure & Private
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
            {/* Options */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Conversion Options</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Include Page Breaks</Label>
                    <p className="text-xs text-gray-500">
                      Add markers between pages
                    </p>
                  </div>
                  <Switch
                    checked={includePageBreaks}
                    onCheckedChange={setIncludePageBreaks}
                  />
                </div>

                <div>
                  <Label>Line Ending Style</Label>
                  <Select
                    value={lineEndingStyle}
                    onValueChange={(v) =>
                      setLineEndingStyle(v as "unix" | "windows" | "mac")
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unix">Unix / Linux (LF)</SelectItem>
                      <SelectItem value="windows">Windows (CRLF)</SelectItem>
                      <SelectItem value="mac">Mac (CR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleConvert}
                disabled={isProcessing}
                className="w-full bg-slate-600 hover:bg-slate-700 text-white mt-6"
              >
                {isProcessing ? "Converting..." : "Convert to TXT"}
              </Button>
            </div>

            <ProgressBar
              progress={progress}
              isVisible={isProcessing}
              color="slate"
            />

            {convertedFile && !isProcessing && (
              <div className="text-center mt-6 space-y-4">
                <Button
                  onClick={handleDownload}
                  size="lg"
                  className="bg-green-500 hover:bg-green-600 text-white px-8"
                >
                  <i className="fas fa-download mr-2"></i>
                  Download Text File
                </Button>
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
