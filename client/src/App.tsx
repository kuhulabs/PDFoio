import { Switch, Route } from "wouter";
import { lazy, Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeProvider";
import { pageLoaders } from "@/lib/page-loaders";

// All page chunks are defined in `page-loaders.ts` so the same import
// functions back both `lazy()` (for routing) and `prefetchPage()` (for
// hover prefetching from Home). Single source of truth — adding a new
// page only requires one edit there.
const Home = lazy(pageLoaders["/"]);
const About = lazy(pageLoaders["/about"]);
const Contact = lazy(pageLoaders["/contact"]);
const ApiPage = lazy(pageLoaders["/api"]);
const Privacy = lazy(pageLoaders["/privacy"]);
const Terms = lazy(pageLoaders["/terms"]);
const NotFound = lazy(() => import("@/pages/not-found"));

// PDF Tools
const AISummarizer = lazy(pageLoaders["/summarize"]);
const MergePDF = lazy(pageLoaders["/merge"]);
const CompressPDF = lazy(pageLoaders["/compress"]);
const SplitPDF = lazy(pageLoaders["/split"]);
const RotatePDF = lazy(pageLoaders["/rotate"]);
const UnlockPDF = lazy(pageLoaders["/unlock"]);
const LockPDF = lazy(pageLoaders["/lock"]);
const WatermarkPDF = lazy(pageLoaders["/watermark"]);
const EditMetadata = lazy(pageLoaders["/metadata"]);
const PageNumbers = lazy(pageLoaders["/page-numbers"]);
const RemoveBlankPages = lazy(pageLoaders["/remove-blank-pages"]);
const DeletePages = lazy(pageLoaders["/delete-pages"]);
const ReorderPages = lazy(pageLoaders["/reorder"]);

// Conversions
const WordToPDF = lazy(pageLoaders["/word-to-pdf"]);
const ExcelToPDF = lazy(pageLoaders["/excel-to-pdf"]);
const PNGToPDF = lazy(pageLoaders["/png-to-pdf"]);
const ImagesToPDF = lazy(pageLoaders["/images-to-pdf"]);
const PDFToWord = lazy(pageLoaders["/pdf-to-word"]);
const PDFToExcel = lazy(pageLoaders["/pdf-to-excel"]);
const PDFToPPT = lazy(pageLoaders["/pdf-to-ppt"]);
const PDFToJPG = lazy(pageLoaders["/pdf-to-jpg"]);
const PDFToPNG = lazy(pageLoaders["/pdf-to-png"]);
const PDFToTIFF = lazy(pageLoaders["/pdf-to-tiff"]);
const PDFToTXT = lazy(pageLoaders["/pdf-to-txt"]);
const PDFToJSON = lazy(pageLoaders["/pdf-to-json"]);

// Loading fallback — lightweight skeleton that matches a typical tool page
// layout, avoiding the layout shift / flash of a full-screen spinner.
function PageFallback() {
  return (
    <div
      className="container mx-auto px-4 py-10"
      role="status"
      aria-live="polite"
      aria-busy="true"
      data-testid="loader-page"
    >
      <span className="sr-only">Loading…</span>
      <div className="mx-auto max-w-3xl space-y-6 animate-pulse">
        <div className="h-8 w-2/3 rounded-md bg-muted" />
        <div className="h-4 w-1/2 rounded-md bg-muted" />
        <div className="h-64 w-full rounded-xl bg-muted" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="h-24 rounded-lg bg-muted" />
          <div className="h-24 rounded-lg bg-muted" />
          <div className="h-24 rounded-lg bg-muted" />
        </div>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Switch>
        {/* Home */}
        <Route path="/" component={Home} />
        
        {/* Static Pages */}
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/api" component={ApiPage} />
        
        {/* AI Tools */}
        <Route path="/summarize" component={AISummarizer} />
        
        {/* PDF Operations */}
        <Route path="/merge" component={MergePDF} />
        <Route path="/compress" component={CompressPDF} />
        <Route path="/split" component={SplitPDF} />
        <Route path="/rotate" component={RotatePDF} />
        <Route path="/unlock" component={UnlockPDF} />
        <Route path="/lock" component={LockPDF} />
        <Route path="/watermark" component={WatermarkPDF} />
        <Route path="/metadata" component={EditMetadata} />
        <Route path="/page-numbers" component={PageNumbers} />
        <Route path="/remove-blank-pages" component={RemoveBlankPages} />
        <Route path="/delete-pages" component={DeletePages} />
        <Route path="/reorder" component={ReorderPages} />
        
        {/* To PDF Conversions */}
        <Route path="/word-to-pdf" component={WordToPDF} />
        <Route path="/excel-to-pdf" component={ExcelToPDF} />
        <Route path="/png-to-pdf" component={PNGToPDF} />
        <Route path="/images-to-pdf" component={ImagesToPDF} />
        
        {/* From PDF Conversions */}
        <Route path="/pdf-to-word" component={PDFToWord} />
        <Route path="/pdf-to-excel" component={PDFToExcel} />
        <Route path="/pdf-to-ppt" component={PDFToPPT} />
        <Route path="/pdf-to-jpg" component={PDFToJPG} />
        <Route path="/pdf-to-png" component={PDFToPNG} />
        <Route path="/pdf-to-tiff" component={PDFToTIFF} />
        <Route path="/pdf-to-txt" component={PDFToTXT} />
        <Route path="/pdf-to-json" component={PDFToJSON} />
        
        {/* 404 Page */}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <div className="min-h-screen bg-background text-foreground">
              <Header />
              <main>
                <Router />
              </main>
              <Toaster />
            </div>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
