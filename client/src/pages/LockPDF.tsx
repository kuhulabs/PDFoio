import { TOOL_SEO } from "@/seo/seo";
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
import { downloadBlob } from "@/lib/realPdfUtils";
import { useToast } from "@/hooks/use-toast";
import { ToolSEOContent } from "@/components/ToolSEOContent";
import { Lock, Download } from "lucide-react";

export default function LockPDF() {
  const seoData = TOOL_SEO["lock"];

  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    if (convertedFile) {
      downloadBlob(convertedFile, "PDFo_Lock.pdf");
    }
  };

  const passwordsMatch = password === confirmPassword && password.length > 0;
  const canLock = passwordsMatch && !isProcessing;

  const handleLockPDF = async () => {
    if (!file || !canLock) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      setProgress(30);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("password", password);

      const response = await fetch("/api/pdf/lock", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Encryption failed");
      }

      const blob = await response.blob();
      setConvertedFile(blob);
      setProgress(100);

      toast({
        title: "Success!",
        description: "Your PDF is now password protected.",
      });

      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to lock PDF.",
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
          { name: seoData.h1, url: `${window.location.origin}/lock` },
        ]}
        title={seoData.title}
        description={seoData.metaDescription}
        keywords="lock pdf, password protect pdf, encrypt pdf"
        canonicalUrl={`${window.location.origin}/lock`}
        faqs={seoData.faqs}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back */}
        <div className="mb-8">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← Back to Tools
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center text-white text-xl mx-auto mb-4 shadow-lg shadow-yellow-500/20">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">
            {seoData.h1}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            {seoData.shortIntro}
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
            {/* Password Card */}
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">
                Password Protection
              </h3>

              <div className="space-y-4">
                {/* Password */}
                <div>
                  <Label>Password</Label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {/* Confirm */}
                <div>
                  <Label>Confirm Password</Label>
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {confirmPassword && !passwordsMatch && (
                    <p className="text-sm text-red-500 mt-1">
                      Passwords do not match
                    </p>
                  )}
                </div>
              </div>

              <Button
                onClick={handleLockPDF}
                disabled={!canLock}
                className="w-full mt-6 bg-yellow-600 hover:bg-yellow-700"
              >
                {isProcessing ? "Encrypting..." : "Lock PDF"}
              </Button>
            </div>

            <ProgressBar
              progress={progress}
              isVisible={isProcessing}
              indicatorColor="bg-yellow-500"
              className="mt-6"
            />

            {convertedFile && !isProcessing && (
              <div className="text-center mt-6 space-y-4">
                <Button
                  onClick={handleDownload}
                  size="lg"
                  className="bg-green-500 hover:bg-green-600"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Protected PDF
                </Button>
                <BuyMeCoffeeButton />
              </div>
            )}
          </>
        )}
      </div>

      <ToolSEOContent {...seoData} />
      <ToolFooter />
    </>
  );
}
