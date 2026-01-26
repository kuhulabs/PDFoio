import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { FileUpload } from "@/components/FileUpload";
import { ToolFooter } from "@/components/ToolFooter";
import { ProgressBar } from "@/components/ProgressBar";
import { BuyMeCoffeeButton } from "@/components/BuyMeCoffeeButton";
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

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFilesSelected = async (files: File[]) => {
    const selectedFile = files[0];
    setFile(selectedFile);
    setConvertedFile(null);

    try {
      // Generate real PDF pages from file
      const realPages = await generateRealPDFPages(selectedFile);
      setPages(realPages);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load PDF pages. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    if (!convertedFile) return;
    downloadBlob(convertedFile, "PDFo_Watermark.pdf");
  };

  const handleAddWatermark = async () => {
    if (!file || !settings.text) return;

    setIsProcessing(true);
    setProgress(0);
    try {
      setProgress(25);
      const watermarkedBlob = await addWatermarkToPDF(file, settings);
      setProgress(100);
      setConvertedFile(watermarkedBlob);

      // Track usage for dashboard
      await trackToolUsage("Watermark PDF", "security", 1);

      toast({
        title: "Success!",
        description:
          "Watermark has been added to your PDF successfully. Download button available below.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add watermark. Please try again.",
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
          { name: "Watermark PDF", url: `${window.location.origin}/watermark` },
        ]}
        title={seoData.title}
        description={seoData.metaDescription}
        keywords="watermark pdf, add watermark to pdf, protect pdf"
        canonicalUrl={`${window.location.origin}/watermark`}
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
            className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center text-white text-xl mx-auto mb-4"
            role="img"
            aria-label="Watermark PDF tool"
          >
            <i className="fas fa-tint" aria-hidden="true"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Watermark PDF
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
            Add text watermarks to protect your PDF documents
          </p>
        </div>

        {!file ? (
          <FileUpload
            onFilesSelected={handleFilesSelected}
            acceptMultiple={false}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Settings Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Watermark Settings
                </h3>

                <div className="space-y-4">
                  {/* Text Preset */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Quick Presets
                    </Label>
                    <Select
                      value={settings.text}
                      onValueChange={(value) =>
                        setSettings((prev) => ({ ...prev, text: value }))
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select preset or type custom" />
                      </SelectTrigger>
                      <SelectContent>
                        {TEXT_PRESETS.map((preset) => (
                          <SelectItem key={preset} value={preset}>
                            {preset}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Custom Text */}
                  <div>
                    <Label
                      htmlFor="watermark-text"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Custom Text
                    </Label>
                    <Input
                      id="watermark-text"
                      type="text"
                      value={settings.text || ""}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          text: e.target.value,
                        }))
                      }
                      placeholder="Enter custom watermark text"
                      className="mt-1"
                      data-testid="input-watermark-text"
                    />
                  </div>

                  {/* Font Family */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Font Style
                    </Label>
                    <Select
                      value={settings.fontFamily || "Helvetica-Bold"}
                      onValueChange={(value) =>
                        setSettings((prev) => ({ ...prev, fontFamily: value }))
                      }
                    >
                      <SelectTrigger className="mt-1">
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
                  </div>

                  {/* Font Size Dropdown */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Font Size
                    </Label>
                    <Select
                      value={String(settings.fontSize || 36)}
                      onValueChange={(value) =>
                        setSettings((prev) => ({
                          ...prev,
                          fontSize: parseInt(value),
                        }))
                      }
                    >
                      <SelectTrigger className="mt-1">
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

                  {/* Color Palette */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Color
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
                          className={`w-full h-10 rounded-lg border-2 transition-all ${
                            settings.color === color.value
                              ? "border-teal-500 ring-2 ring-teal-300"
                              : "border-gray-300 dark:border-gray-600 hover:border-teal-400"
                          } ${color.value === "#FFFFFF" ? "border-gray-400" : ""}`}
                          style={{
                            backgroundColor: color.value,
                            boxShadow:
                              color.value === "#FFFFFF"
                                ? "inset 0 0 0 1px rgba(0,0,0,0.1)"
                                : "none",
                          }}
                          title={color.label}
                          data-testid={`color-${color.value}`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {COLOR_OPTIONS.find((c) => c.value === settings.color)
                        ?.label || "Custom Color"}
                    </p>
                  </div>

                  {/* Position */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Position
                    </Label>
                    <Select
                      value={settings.position}
                      onValueChange={(value) =>
                        setSettings((prev) => ({
                          ...prev,
                          position: value as any,
                        }))
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="top-left">Top Left</SelectItem>
                        <SelectItem value="top-right">Top Right</SelectItem>
                        <SelectItem value="bottom-left">Bottom Left</SelectItem>
                        <SelectItem value="bottom-right">
                          Bottom Right
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Opacity */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Opacity: {Math.round(settings.opacity * 100)}%
                    </Label>
                    <Slider
                      value={[settings.opacity]}
                      onValueChange={(value) =>
                        setSettings((prev) => ({ ...prev, opacity: value[0] }))
                      }
                      max={1}
                      min={0.1}
                      step={0.1}
                      className="mt-2"
                    />
                  </div>

                  {/* Rotation */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Rotation: {settings.rotation}°
                    </Label>
                    <Slider
                      value={[settings.rotation]}
                      onValueChange={(value) =>
                        setSettings((prev) => ({ ...prev, rotation: value[0] }))
                      }
                      max={360}
                      min={0}
                      step={15}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    onClick={handleAddWatermark}
                    disabled={isProcessing || !settings.text}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    data-testid="button-add-watermark"
                  >
                    {isProcessing ? "Adding Watermark..." : "Add Watermark"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Preview Panel */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Preview
                </h3>
                {pages.length > 0 ? (
                  <div className="space-y-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <span>
                        Preview with watermark: "{settings.text}" at{" "}
                        {Math.round(settings.opacity * 100)}% opacity,{" "}
                        {settings.rotation}° rotation
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                      {pages.slice(0, 4).map((page) => (
                        <div
                          key={page.id}
                          className="relative bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden"
                        >
                          {/* Page Number Badge */}
                          <div className="absolute top-2 left-2 bg-teal-500 text-white text-xs px-2 py-1 rounded-full font-semibold z-10">
                            {page.pageNumber}
                          </div>

                          {/* Watermark Preview Overlay */}
                          <div
                            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                            style={{
                              opacity: settings.opacity,
                              transform: `rotate(${settings.rotation}deg)`,
                            }}
                          >
                            <div
                              className="font-bold select-none"
                              style={{
                                color: settings.color,
                                fontSize: `${Math.max((settings.fontSize || 36) / 4, 8)}px`,
                                textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                                fontFamily:
                                  settings.fontFamily || "Helvetica-Bold",
                              }}
                            >
                              {settings.text || "WATERMARK"}
                            </div>
                          </div>

                          {/* Page Content */}
                          <div className="aspect-[3/4]">
                            <SinglePDFThumbnail
                              file={file}
                              pageNumber={page.pageNumber}
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    {pages.length > 4 && (
                      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                        Showing first 4 pages. Watermark will be applied to all{" "}
                        {pages.length} pages.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      Upload a PDF to see preview with watermark
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {file && (
          <>
            <ProgressBar
              progress={progress}
              isVisible={isProcessing}
              color="green"
              className="mt-6"
            />

            {/* Download Button */}
            {convertedFile && !isProcessing && (
              <div className="text-center space-y-4 mt-6">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
                  <p className="text-green-800 dark:text-green-200 font-medium mb-2">
                    ✅ Watermark Added Successfully!
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Your PDF is ready with the text watermark applied to all{" "}
                    {pages.length} pages.
                  </p>
                </div>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center px-8 py-4 text-lg font-medium bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  data-testid="button-download-watermarked"
                >
                  <i className="fas fa-download mr-3"></i>
                  Download Watermarked PDF
                </button>
                <div className="mt-4">
                  <BuyMeCoffeeButton />
                </div>
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
