import { useState, useEffect } from "react";
import { Link } from "wouter";
import { FileUpload } from "@/components/FileUpload";
import { ToolFooter } from "@/components/ToolFooter";
import { ProgressBar } from "@/components/ProgressBar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { SEOHead } from "@/components/SEOHead";
import {
  convertPDFToImages,
  downloadBlob,
  type ImageConversionOptions,
} from "@/lib/realPdfUtils";
import { useToast } from "@/hooks/use-toast";
import { ToolSEOContent } from "@/components/ToolSEOContent";
import { TOOL_SEO } from "@/seo/seo";
import {
  ArrowLeft,
  Image as ImageIcon,
  FileText,
  Download,
  RefreshCw,
  CheckCircle,
  Coffee,
  Layers,
  Zap,
  ChevronDown,
  ChevronUp,
  FileArchive,
  FileImage,
} from "lucide-react";

export default function PDFToJPG() {
  const seoData = TOOL_SEO["pdf-to-jpg"];
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(90);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedFile, setConvertedFile] = useState<Blob | null>(null);
  const [individualImages, setIndividualImages] = useState<Blob[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [isIndividualOpen, setIsIndividualOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFilesSelected = (files: File[]) => {
    setFile(files[0]);
    setConvertedFile(null);
    setIndividualImages([]);
    setPageCount(0);
    setProgress(0);
  };

  const handleDownload = () => {
    if (!convertedFile) return;
    const fileName = file
      ? `PDFo_${file.name.replace(/\.[^/.]+$/, "")}_Images.zip`
      : "PDFo_Images.zip";
    downloadBlob(convertedFile, fileName);
  };

  const handleDownloadSingle = (imageBlob: Blob, pageNum: number) => {
    const fileName = file
      ? `Page_${pageNum}_${file.name.replace(/\.[^/.]+$/, "")}.jpg`
      : `PDFo_Page${pageNum}.jpg`;
    downloadBlob(imageBlob, fileName);
  };

  const handleConvert = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(10);
    try {
      const options: ImageConversionOptions = { quality };

      // Simulate progress for user feedback
      const interval = setInterval(
        () => setProgress((prev) => Math.min(prev + 5, 90)),
        500,
      );

      const result = await convertPDFToImages(file, "jpg", options);

      clearInterval(interval);
      setProgress(100);
      setConvertedFile(result.zipBlob);
      setIndividualImages(result.images);
      setPageCount(result.pageCount);

      toast({
        title: "Success!",
        description: `Converted ${result.pageCount} pages to images.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Conversion Failed",
        description: "Failed to convert PDF. The file might be corrupted.",
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
    setIndividualImages([]);
    setPageCount(0);
    setProgress(0);
  };

  return (
    <>
      <SEOHead
        breadcrumbs={[
          { name: "Home", url: window.location.origin },
          { name: "PDF to JPG", url: `${window.location.origin}/pdf-to-jpg` },
        ]}
        title={seoData.title}
        description={seoData.metaDescription}
        keywords={
          (seoData as any).keywords ||
          "pdf to jpg, convert pdf to images, pdf to jpeg"
        }
        canonicalUrl={`${window.location.origin}/pdf-to-jpg`}
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
          <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 shadow-sm">
            <ImageIcon className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {seoData.h1}
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-base md:text-lg leading-relaxed">
            {seoData.shortIntro}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm font-medium">
            <div className="flex items-center text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 rounded-full">
              <Zap className="w-4 h-4 mr-2" /> High Quality
            </div>
            <div className="flex items-center text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-3 py-1 rounded-full">
              <Layers className="w-4 h-4 mr-2" /> Batch Processing
            </div>
          </div>
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
              <div className="max-w-xl mx-auto bg-card border rounded-xl shadow-sm p-6 sm:p-8">
                {/* File Info */}
                <div className="flex items-center justify-between mb-8 pb-6 border-b">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/20 rounded-lg flex items-center justify-center text-rose-600 dark:text-rose-400">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground truncate max-w-[180px] sm:max-w-xs">
                        {file.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={resetTool}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <i className="fas fa-times"></i>
                  </Button>
                </div>

                {/* Options */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm font-medium">
                        Image Quality: {quality}%
                      </Label>
                      <span className="text-xs text-muted-foreground">
                        {quality > 80
                          ? "High"
                          : quality > 50
                            ? "Medium"
                            : "Low"}
                      </span>
                    </div>
                    <Slider
                      value={[quality]}
                      onValueChange={(value) => setQuality(value[0])}
                      max={100}
                      min={10}
                      step={10}
                      className="py-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Smaller File</span>
                      <span>Better Quality</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleConvert}
                    disabled={isProcessing}
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white shadow-md h-12 text-lg"
                  >
                    {isProcessing ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>{" "}
                        Converting...
                      </>
                    ) : (
                      "Convert to JPG"
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              /* Success View */
              <div className="max-w-3xl mx-auto space-y-6 animate-in zoom-in-95 duration-300">
                <div className="bg-card border rounded-xl shadow-sm p-8 text-center">
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                  </div>

                  <h2 className="text-2xl font-bold mb-2">
                    Conversion Complete!
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    Your PDF has been converted into {pageCount} high-quality
                    images.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={handleDownload}
                      size="lg"
                      className="bg-green-600 hover:bg-green-700 text-white shadow-lg font-semibold w-full sm:w-auto h-12"
                    >
                      <FileArchive className="w-5 h-5 mr-2" />
                      Download All (ZIP)
                    </Button>

                    <Button
                      onClick={resetTool}
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto h-12"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Convert Another
                    </Button>
                  </div>
                </div>

                {/* Individual Downloads */}
                <Collapsible
                  open={isIndividualOpen}
                  onOpenChange={setIsIndividualOpen}
                  className="bg-card border rounded-xl shadow-sm overflow-hidden"
                >
                  <CollapsibleTrigger className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2 font-semibold">
                      <ImageIcon className="w-5 h-5 text-rose-500" />
                      Download Individual Pages
                    </div>
                    {isIndividualOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="p-4 border-t bg-muted/20">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {individualImages.map((imageBlob, index) => (
                          <button
                            key={index}
                            onClick={() =>
                              handleDownloadSingle(imageBlob, index + 1)
                            }
                            className="group flex flex-col items-center p-3 bg-background border rounded-lg hover:border-rose-500 hover:shadow-md transition-all"
                          >
                            <div className="w-full aspect-[3/4] bg-muted mb-2 rounded overflow-hidden flex items-center justify-center">
                              <FileImage className="w-8 h-8 text-muted-foreground/50 group-hover:text-rose-500 transition-colors" />
                            </div>
                            <span className="text-sm font-medium">
                              Page {index + 1}
                            </span>
                            <span className="text-xs text-rose-600 dark:text-rose-400 mt-1 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Download className="w-3 h-3 mr-1" /> Download
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Buy Me Coffee */}
                <div className="text-center pt-4">
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

            <ProgressBar
              progress={progress}
              isVisible={isProcessing}
              color="rose"
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
