import { useState, useEffect } from "react";
import { Link } from "wouter";
import { FileUpload } from "@/components/FileUpload";
import { ToolFooter } from "@/components/ToolFooter";
import { ProgressBar } from "@/components/ProgressBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { SEOHead } from "@/components/SEOHead";
import { TOOL_SEO } from "@/seo/seo";
import { ToolSEOContent } from "@/components/ToolSEOContent";
import {
  addWatermarkToPDF,
  downloadBlob,
  generateRealPDFPages,
  type WatermarkSettings,
} from "@/lib/realPdfUtils";
import { SinglePDFThumbnail } from "@/components/SinglePDFThumbnail";
import { useToast } from "@/hooks/use-toast";
import { trackToolUsage } from "@/lib/analytics";
import {
  ArrowLeft,
  Stamp,
  FileText,
  Download,
  RefreshCw,
  CheckCircle,
  Coffee,
  Type,
  Palette,
  LayoutTemplate,
  Move,
} from "lucide-react";

interface PDFPage {
  id: string;
  pageNumber: number;
}

// Color options for watermark
const COLOR_OPTIONS = [
  { value: "#000000", label: "Black" },
  { value: "#333333", label: "Dark Gray" },
  { value: "#666666", label: "Gray" },
  { value: "#999999", label: "Light Gray" },
  { value: "#FFFFFF", label: "White" },
  { value: "#FF0000", label: "Red" },
  { value: "#FF3333", label: "Light Red" },
  { value: "#990000", label: "Dark Red" },
  { value: "#0066CC", label: "Blue" },
  { value: "#0099FF", label: "Light Blue" },
  { value: "#003399", label: "Dark Blue" },
  { value: "#00CC00", label: "Green" },
  { value: "#33FF33", label: "Light Green" },
  { value: "#006600", label: "Dark Green" },
  { value: "#FF9900", label: "Orange" },
  { value: "#FFCC00", label: "Gold" },
  { value: "#9966CC", label: "Purple" },
  { value: "#FF00FF", label: "Magenta" },
  { value: "#00CCCC", label: "Cyan" },
  { value: "#663300", label: "Brown" },
];

// Font size options
const FONT_SIZE_OPTIONS = [
  { value: 12, label: "12px - Very Small" },
  { value: 16, label: "16px - Small" },
  { value: 20, label: "20px - Regular" },
  { value: 24, label: "24px - Medium" },
  { value: 30, label: "30px - Large" },
  { value: 36, label: "36px - Very Large" },
  { value: 48, label: "48px - Extra Large" },
  { value: 60, label: "60px - Huge" },
  { value: 72, label: "72px - Massive" },
  { value: 96, label: "96px - Giant" },
];

// Font family options
const FONT_FAMILY_OPTIONS = [
  { value: "Helvetica", label: "Helvetica" },
  { value: "Times-Roman", label: "Times New Roman" },
  { value: "Courier", label: "Courier" },
  { value: "Helvetica-Bold", label: "Helvetica Bold" },
  { value: "Times-Bold", label: "Times Bold" },
  { value: "Courier-Bold", label: "Courier Bold" },
];

// Predefined watermark text options
const TEXT_PRESETS = [
  "CONFIDENTIAL",
  "DRAFT",
  "COPY",
  "SAMPLE",
  "ORIGINAL",
  "DO NOT COPY",
  "FOR REVIEW ONLY",
  "APPROVED",
  "REJECTED",
  "INTERNAL USE ONLY",
];

export default function WatermarkPDF() {
  const seoData = TOOL_SEO["watermark"];
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PDFPage[]>([]);
  const [settings, setSettings] = useState<WatermarkSettings>({
    type: "text",
    text: "CONFIDENTIAL",
    opacity: 0.3,
    rotation: 45,
    fontSize: 36,
    fontFamily: "Helvetica-Bold",
    color: "#FF0000",
    position: "center",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedFile, setConvertedFile] = useState<Blob | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFilesSelected = async (files: File[]) => {
    const selectedFile = files[0];
    setFile(selectedFile);
    setConvertedFile(null);
    setProgress(0);

    try {
      const realPages = await generateRealPDFPages(selectedFile);
      setPages(realPages);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error reading PDF",
        description:
          "Failed to load PDF pages. The file might be password protected.",
        variant: "destructive",
      });
      setFile(null);
    }
  };

  const handleDownload = () => {
    if (!convertedFile) return;
    const fileName = file
      ? `PDFo_Watermarked_${file.name}`
      : "PDFo_Watermarked.pdf";
    downloadBlob(convertedFile, fileName);
  };

  const handleAddWatermark = async () => {
    if (!file || !settings.text) return;

    setIsProcessing(true);
    setProgress(10);
    try {
      // Simulate progress
      const interval = setInterval(
        () => setProgress((prev) => Math.min(prev + 5, 90)),
        300,
      );

      const watermarkedBlob = await addWatermarkToPDF(file, settings);

      clearInterval(interval);
      setProgress(100);
      setConvertedFile(watermarkedBlob);

      await trackToolUsage("Watermark PDF", "security", 1);

      toast({
        title: "Success!",
        description: "Watermark added successfully.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Process Failed",
        description: "Failed to add watermark. Please try again.",
        variant: "destructive",
      });
      setProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetTool = () => {
    setFile(null);
    setPages([]);
    setConvertedFile(null);
    setProgress(0);
  };

  return (
    <>
      <SEOHead
        breadcrumbs={[
          { name: "Home", url: window.location.origin },
          { name: "Watermark PDF", url: `${window.location.origin}/watermark` },
        ]}
        title={seoData.title}
        description={seoData.metaDescription}
        keywords="watermark pdf, add watermark to pdf, stamp pdf, protect pdf document"
        canonicalUrl={`${window.location.origin}/watermark`}
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
          <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 shadow-sm">
            <Stamp className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {seoData.h1}
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-base md:text-lg leading-relaxed">
            {seoData.shortIntro}
          </p>
        </div>

        {!file ? (
          <FileUpload
            onFilesSelected={handleFilesSelected}
            acceptMultiple={false}
            accept=".pdf"
            title="Drag & Drop PDF"
            className="max-w-2xl mx-auto"
          />
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {!convertedFile ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Settings Panel */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-card border rounded-xl shadow-sm p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Type className="w-4 h-4 text-teal-600" /> Content
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetTool}
                        className="text-muted-foreground h-8"
                      >
                        Change File
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Watermark Text</Label>
                        <Select
                          value={
                            TEXT_PRESETS.includes(settings.text ?? "")
                              ? settings.text
                              : "custom"
                          }
                          onValueChange={(value) => {
                            if (value !== "custom") {
                              setSettings((prev) => ({ ...prev, text: value }));
                            } else {
                              setSettings((prev) => ({ ...prev, text: "" }));
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select preset" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="custom">
                              Custom Text...
                            </SelectItem>
                            {TEXT_PRESETS.map((preset) => (
                              <SelectItem key={preset} value={preset}>
                                {preset}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {(!TEXT_PRESETS.includes(settings.text ?? "") ||
                          settings.text === "") && (
                          <Input
                            value={settings.text}
                            onChange={(e) =>
                              setSettings((prev) => ({
                                ...prev,
                                text: e.target.value,
                              }))
                            }
                            placeholder="Type watermark here..."
                            className="mt-2 border-teal-500/50 focus:ring-teal-500"
                            autoFocus
                          />
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Typography</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Select
                            value={settings.fontFamily}
                            onValueChange={(value) =>
                              setSettings((prev) => ({
                                ...prev,
                                fontFamily: value,
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {FONT_FAMILY_OPTIONS.map((font) => (
                                <SelectItem key={font.value} value={font.value}>
                                  {font.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Select
                            value={String(settings.fontSize)}
                            onValueChange={(value) =>
                              setSettings((prev) => ({
                                ...prev,
                                fontSize: parseInt(value),
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {FONT_SIZE_OPTIONS.map((size) => (
                                <SelectItem
                                  key={size.value}
                                  value={String(size.value)}
                                >
                                  {size.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Palette className="w-4 h-4 text-teal-600" /> Color
                        </Label>
                        <div className="grid grid-cols-5 gap-2">
                          {COLOR_OPTIONS.map((color) => (
                            <button
                              key={color.value}
                              onClick={() =>
                                setSettings((prev) => ({
                                  ...prev,
                                  color: color.value,
                                }))
                              }
                              className={`w-full h-8 rounded-md border transition-all ${
                                settings.color === color.value
                                  ? "border-teal-500 ring-2 ring-teal-300 scale-110"
                                  : "border-transparent hover:border-gray-300"
                              }`}
                              style={{
                                backgroundColor: color.value,
                                boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.1)",
                              }}
                              title={color.label}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-card border rounded-xl shadow-sm p-6 space-y-6">
                    <h3 className="font-semibold flex items-center gap-2">
                      <LayoutTemplate className="w-4 h-4 text-teal-600" />{" "}
                      Appearance
                    </h3>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Position</Label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            "top-left",
                            "top-right",
                            "center",
                            "bottom-left",
                            "bottom-right",
                          ].map((pos) => (
                            <Button
                              key={pos}
                              variant={
                                settings.position === pos
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              onClick={() =>
                                setSettings((prev) => ({
                                  ...prev,
                                  position: pos as any,
                                }))
                              }
                              className={`capitalize text-xs ${settings.position === pos ? "bg-teal-600 hover:bg-teal-700" : ""}`}
                            >
                              {pos.replace("-", " ")}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <Label>Opacity</Label>
                            <span className="text-muted-foreground">
                              {Math.round(settings.opacity * 100)}%
                            </span>
                          </div>
                          <Slider
                            value={[settings.opacity]}
                            onValueChange={(val) =>
                              setSettings((prev) => ({
                                ...prev,
                                opacity: val[0],
                              }))
                            }
                            max={1}
                            min={0.1}
                            step={0.1}
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <Label>Rotation</Label>
                            <span className="text-muted-foreground">
                              {settings.rotation}°
                            </span>
                          </div>
                          <Slider
                            value={[settings.rotation]}
                            onValueChange={(val) =>
                              setSettings((prev) => ({
                                ...prev,
                                rotation: val[0],
                              }))
                            }
                            max={360}
                            min={0}
                            step={15}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleAddWatermark}
                    disabled={isProcessing || !settings.text}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white h-12 text-lg shadow-md"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />{" "}
                        Processing...
                      </>
                    ) : (
                      "Add Watermark"
                    )}
                  </Button>
                </div>

                {/* Preview Panel */}
                <div className="lg:col-span-2">
                  <div className="bg-muted/30 border rounded-xl p-6 h-full min-h-[500px]">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-muted-foreground flex items-center gap-2">
                        <Move className="w-4 h-4" /> Live Preview
                      </h3>
                      <span className="text-xs bg-muted px-2 py-1 rounded">
                        Showing first 4 pages
                      </span>
                    </div>

                    {pages.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {pages.slice(0, 4).map((page) => (
                          <div
                            key={page.id}
                            className="relative bg-white shadow-sm rounded-lg overflow-hidden border"
                          >
                            {/* Watermark Overlay */}
                            <div
                              className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 overflow-hidden"
                              style={{
                                opacity: settings.opacity,
                                transform: `rotate(${settings.rotation}deg)`,
                                justifyContent: (settings.position ?? "center").includes(
                                  "left",
                                )
                                  ? "flex-start"
                                  : (settings.position ?? "center").includes("right")
                                    ? "flex-end"
                                    : "center",
                                alignItems: (settings.position ?? "center").includes("top")
                                  ? "flex-start"
                                  : (settings.position ?? "center").includes("bottom")
                                    ? "flex-end"
                                    : "center",
                                padding: "2rem",
                              }}
                            >
                              <div
                                style={{
                                  color: settings.color,
                                  fontSize: `${Math.max((settings.fontSize || 36) / 2, 12)}px`, // Scaled for preview
                                  fontFamily: settings.fontFamily,
                                  fontWeight: "bold",
                                  whiteSpace: "nowrap",
                                  textShadow:
                                    "0px 0px 2px rgba(255,255,255,0.5)",
                                }}
                              >
                                {settings.text || "Watermark"}
                              </div>
                            </div>

                            {/* Page Content */}
                            <SinglePDFThumbnail
                              file={file}
                              pageNumber={page.pageNumber}
                              className="w-full h-auto"
                            />

                            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full z-10">
                              Page {page.pageNumber}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground">
                        <RefreshCw className="w-6 h-6 animate-spin mr-2" />{" "}
                        Loading preview...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Success View */
              <div className="max-w-2xl mx-auto bg-card border rounded-xl shadow-sm p-8 text-center animate-in zoom-in-95 duration-300">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>

                <h2 className="text-2xl font-bold mb-2">Watermark Added!</h2>
                <p className="text-muted-foreground mb-8">
                  Your document has been stamped with "{settings.text}".
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={handleDownload}
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-white shadow-lg font-semibold w-full sm:w-auto h-12"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download PDF
                  </Button>

                  <Button
                    onClick={resetTool}
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto h-12"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Watermark Another
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
              color="teal"
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
