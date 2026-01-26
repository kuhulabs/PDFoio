import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { FileUpload } from "@/components/FileUpload";
import { ToolFooter } from "@/components/ToolFooter";
import { ProgressBar } from "@/components/ProgressBar";
import { BuyMeCoffeeButton } from "@/components/BuyMeCoffeeButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SEOHead } from "@/components/SEOHead";
import { TOOL_SEO } from "@/seo/seo";
import { ToolSEOContent } from "@/components/ToolSEOContent";
import { downloadBlob } from "@/lib/realPdfUtils";
import { useToast } from "@/hooks/use-toast";
import { 
  Unlock, 
  FileText, 
  X, 
  Eye, 
  EyeOff, 
  Download,
  ArrowLeft
} from "lucide-react";

export default function UnlockPDF() {
  const seoData = TOOL_SEO["unlock"];
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedFile, setConvertedFile] = useState<Blob | null>(null);
  const { toast } = useToast();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFilesSelected = (files: File[]) => {
    setFile(files[0]);
    setConvertedFile(null);
  };

  const handleDownload = () => {
    if (!convertedFile) return;
    downloadBlob(convertedFile, "PDFo_Unlock.pdf");
  };

  const canUnlock = password.length > 0 && !isProcessing;

  const handleUnlockPDF = async () => {
    if (!file || !canUnlock) return;

    setIsProcessing(true);
    setProgress(0);
    try {
      setProgress(20);

      // Create form data for upload
      const formData = new FormData();
      formData.append("pdf", file);
      formData.append("password", password);

      setProgress(40);

      // Call backend API for REAL decryption
      const response = await fetch("/api/pdf/unlock", {
        method: "POST",
        body: formData,
      });

      setProgress(70);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Decryption failed");
      }

      // Get decrypted PDF blob
      const unlockedBlob = await response.blob();
      setProgress(100);
      setConvertedFile(unlockedBlob);
      toast({
        title: "Success!",
        description:
          "PDF has been DECRYPTED successfully. Password protection removed!",
      });

      // Reset form
      setPassword("");
    } catch (error: any) {
      // Extract specific error message
      let errorMessage =
        "Failed to decrypt PDF. Please check your password and try again.";
      let errorDetails = "Error";

      if (error instanceof Error) {
        // Specific error cases from backend
        if (
          error.message.includes("password") ||
          error.message.includes("incorrect") ||
          error.message.includes("wrong")
        ) {
          errorMessage = "Incorrect password. Please try again.";
          errorDetails = "AuthenticationError";
        } else if (
          error.message.includes("require a password to open") ||
          error.message.includes("editing restrictions")
        ) {
          errorMessage =
            "This PDF doesn't need a password to open. It only has editing restrictions.";
          errorDetails = "PermissionsError";
        } else if (
          error.message.includes("not locked") ||
          error.message.includes("not protected")
        ) {
          errorMessage = "This PDF is not password protected.";
          errorDetails = "NotProtectedError";
        } else if (
          error.message.includes("corrupted") ||
          error.message.includes("invalid")
        ) {
          errorMessage = "Invalid or corrupted PDF file.";
          errorDetails = "PDFLoadError";
        } else if (
          error.message.includes("size") ||
          error.message.includes("large")
        ) {
          errorMessage = "PDF file too large (max 10MB).";
          errorDetails = "MemoryError";
        } else {
          errorMessage = error.message || errorMessage;
        }
      }

      toast({
        title: `Error: ${errorDetails || "Unknown"}`,
        description: errorMessage,
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
          { name: "Unlock PDF", url: `${window.location.origin}/unlock` },
        ]}
        title={seoData.title}
        description={seoData.metaDescription}
        keywords="unlock pdf, remove pdf password, decrypt pdf"
        canonicalUrl={`${window.location.origin}/unlock`}
        faqs={seoData.faqs}
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
            className="w-16 h-16 bg-pink-500 rounded-2xl flex items-center justify-center text-white text-xl mx-auto mb-4 shadow-lg shadow-pink-500/20"
            role="img"
            aria-label="Unlock PDF tool"
          >
            <Unlock className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Unlock PDF
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
            Decrypt password-protected PDFs - remove encryption and access your
            files
          </p>
        </div>

        {!file ? (
          <FileUpload
            onFilesSelected={handleFilesSelected}
            acceptMultiple={false}
            maxSize={10 * 1024 * 1024}
          />
        ) : (
          <>
            {/* File Info Card */}
            <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 border-2 border-pink-200 dark:border-pink-700 rounded-lg p-4 mb-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                      {file.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Size: {(file.size / 1024).toFixed(2)} KB
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-pink-100 dark:bg-pink-800 text-pink-800 dark:text-pink-100">
                        <Unlock className="w-3 h-3 mr-1" />
                        Ready to Unlock
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setFile(null);
                    setConvertedFile(null);
                    setPassword("");
                  }}
                  className="ml-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  title="Remove file"
                  data-testid="button-remove-file"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Enter PDF Password
              </h3>

              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Password
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter PDF password"
                      className="pr-10"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && canUnlock) {
                          handleUnlockPDF();
                        }
                      }}
                      data-testid="input-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      data-testid="button-toggle-password"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  onClick={handleUnlockPDF}
                  disabled={!canUnlock}
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
                  data-testid="button-unlock-pdf"
                >
                  {isProcessing ? "Decrypting PDF..." : "Unlock PDF"}
                </Button>
              </div>
            </div>

            <ProgressBar
              progress={progress}
              isVisible={isProcessing}
              indicatorColor="bg-purple-500"
              className="mt-6"
            />

            {/* Download Button */}
            {convertedFile && !isProcessing && (
              <div className="text-center space-y-4 mt-6">
                <Button
                  onClick={handleDownload}
                  size="lg"
                  className="bg-green-500 hover:bg-green-600 text-white px-8"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Unlocked PDF
                </Button>
                <BuyMeCoffeeButton />
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
