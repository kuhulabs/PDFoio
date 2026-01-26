import { Switch, Route } from "wouter";
import { lazy, Suspense } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeProvider";

// Static pages (immediate load)
import Home from "@/pages/Home";

// Lazy load all other pages
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const ApiPage = lazy(() => import("@/pages/ApiPage"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Terms = lazy(() => import("@/pages/Terms"));
const NotFound = lazy(() => import("@/pages/not-found"));

// PDF Tools
const AISummarizer = lazy(() => import("@/pages/AISummarizer"));
const MergePDF = lazy(() => import("@/pages/MergePDF"));
const CompressPDF = lazy(() => import("@/pages/CompressPDF"));
const SplitPDF = lazy(() => import("@/pages/SplitPDF"));
const RotatePDF = lazy(() => import("@/pages/RotatePDF"));
const UnlockPDF = lazy(() => import("@/pages/UnlockPDF"));
const LockPDF = lazy(() => import("@/pages/LockPDF"));
const WatermarkPDF = lazy(() => import("@/pages/WatermarkPDF"));
const EditMetadata = lazy(() => import("@/pages/EditMetadata"));
const PageNumbers = lazy(() => import("@/pages/PageNumbers"));
const RemoveBlankPages = lazy(() => import("@/pages/RemoveBlankPages"));
const DeletePages = lazy(() => import("@/pages/DeletePages"));
const ReorderPages = lazy(() => import("@/pages/ReorderPages"));

// Conversions
const WordToPDF = lazy(() => import("@/pages/WordToPDF"));
const ExcelToPDF = lazy(() => import("@/pages/ExcelToPDF"));
const PNGToPDF = lazy(() => import("@/pages/PNGToPDF"));
const ImagesToPDF = lazy(() => import("@/pages/ImagesToPDF"));
const PDFToWord = lazy(() => import("@/pages/PDFToWord"));
const PDFToExcel = lazy(() => import("@/pages/PDFToExcel"));
const PDFToPPT = lazy(() => import("@/pages/PDFToPPT"));
const PDFToJPG = lazy(() => import("@/pages/PDFToJPG"));
const PDFToPNG = lazy(() => import("@/pages/PDFToPNG"));
const PDFToTIFF = lazy(() => import("@/pages/PDFToTIFF"));
const PDFToTXT = lazy(() => import("@/pages/PDFToTXT"));
const PDFToJSON = lazy(() => import("@/pages/PDFToJSON"));

// Loading component
function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
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
  );
}

export default App;
