import { useState, useEffect } from "react";
import { Link } from "wouter";
import { FileUpload } from "@/components/FileUpload";
import { ToolFooter } from "@/components/ToolFooter";
import { ProgressBar } from "@/components/ProgressBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SEOHead } from "@/components/SEOHead";
import { downloadBlob } from "@/lib/realPdfUtils";
import { useToast } from "@/hooks/use-toast";
import { ToolSEOContent } from "@/components/ToolSEOContent";
import { TOOL_SEO } from "@/seo/seo";
import {
  ArrowLeft,
  Lock,
  FileText,
  Download,
  RefreshCw,
  CheckCircle,
  Coffee,
  Eye,
  EyeOff,
  ShieldCheck,
  X,
} from "lucide-react";

export default function LockPDF() {
  const seoData = TOOL_SEO["lock"];

  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedFile, setConvertedFile] = useState<Blob | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFilesSelected = (files: File[]) => {
    const selectedFile = files[0];
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }
    setFile(selectedFile);
    setConvertedFile(null);
    setPassword("");
    setConfirmPassword("");
    setProgress(0);
  };

  const handleDownload = () => {
    if (convertedFile) {
      downloadBlob(convertedFile, `PDFo_Protected_${file?.name || "Doc.pdf"}`);
    }
  };

  const passwordsMatch = password === confirmPassword && password.length > 0;
  const canLock = passwordsMatch && !isProcessing;

  const handleLockPDF = async () => {
    if (!file || !canLock) return;

    setIsProcessing(true);
    setProgress(10);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("password", password);

      // Simulate upload progress
      const interval = setInterval(
        () => setProgress((prev) => Math.min(prev + 10, 90)),
        300,
      );

      const response = await fetch("/api/pdf/lock", {
        method: "POST",
        body: formData,
      });

      clearInterval(interval);

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

      // Clear sensitive data immediately
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error",
        description: err?.message || "Failed to lock PDF. Please try again.",
        variant: "destructive",
      });
      setProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetTool = () => {
    setFile(null);
    setConvertedFile(null);
    setPassword("");
    setConfirmPassword("");
    setProgress(0);
  };

  return (
    <>
      <SEOHead
        breadcrumbs={[
          { name: "Home", url: window.location.origin },
          { name: "Lock PDF", url: `${window.location.origin}/lock` },
        ]}
        title={seoData.title}
        description={seoData.metaDescription}
        keywords="lock pdf, password protect pdf, encrypt pdf, secure pdf"
        canonicalUrl={`${window.location.origin}/lock`}
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
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 shadow-sm">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {seoData.h1}
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-base md:text-lg leading-relaxed">
            {seoData.shortIntro}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm font-medium">
            <div className="flex items-center text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 rounded-full">
              <ShieldCheck className="w-4 h-4 mr-2" /> 256-bit Encryption
            </div>
            <div className="flex items-center text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-3 py-1 rounded-full">
              <Lock className="w-4 h-4 mr-2" /> Secure Processing
            </div>
          </div>
        </div>

        {!file ? (
          <FileUpload
            onFilesSelected={handleFilesSelected}
            acceptMultiple={false}
            maxSize={10 * 1024 * 1024} // 10MB limit
            accept=".pdf"
            className="max-w-2xl mx-auto"
          />
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {!convertedFile ? (
              <div className="max-w-xl mx-auto bg-card border rounded-xl shadow-sm p-6 sm:p-8">
                {/* File Info */}
                <div className="flex items-center justify-between mb-8 pb-6 border-b">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/20 rounded-lg flex items-center justify-center text-amber-600 dark:text-amber-400">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground truncate max-w-[180px] sm:max-w-xs">
                        {file.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={resetTool}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Password Form */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Set Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter strong password"
                          className="pr-10 h-11"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repeat password"
                        className="h-11"
                      />
                      {confirmPassword && !passwordsMatch && (
                        <p className="text-xs text-destructive mt-1 animate-pulse">
                          Passwords do not match
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={handleLockPDF}
                    disabled={!canLock}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white shadow-md h-12 text-lg font-semibold"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />{" "}
                        Encrypting...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" /> Protect PDF
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

                <h2 className="text-2xl font-bold mb-2">PDF Protected!</h2>
                <p className="text-muted-foreground mb-8">
                  Your document has been successfully encrypted with the
                  password.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={handleDownload}
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-white shadow-lg font-semibold w-full sm:w-auto h-12"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download File
                  </Button>

                  <Button
                    onClick={resetTool}
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto h-12"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Protect Another
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
              color="amber"
              className="fixed top-0 left-0 right-0 z-50 h-1"
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
