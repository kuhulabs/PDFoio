import { useState, useMemo, useEffect } from "react";
import { Link } from "wouter";
// 1. All icons imported from lucide-react (Matches your other pages)
import {
  Coffee,
  Shield,
  Zap,
  Smartphone,
  Bot,
  Layers,
  Scissors,
  ArrowUpDown,
  Trash2,
  RotateCw,
  ListOrdered,
  Stamp,
  FileText,
  Lock,
  Unlock,
  Minimize2,
  Wand2,
  Image as ImageIcon,
  FileType,
  FileSpreadsheet,
  Presentation,
  FileCode,
  Images,
  LayoutTemplate,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainFooter } from "@/components/MainFooter";
import { SEOHead } from "@/components/SEOHead";
// Hero variants are served from /public/assets/ so the URLs are stable in
// dev and production. This lets the <link rel="preload"> in index.html
// match the <img> src exactly and avoids a double-fetch.
const heroBg = "/assets/hero_bg_1280.webp";
const heroBg768 = "/assets/hero_bg_768.webp";
const heroBg1280 = "/assets/hero_bg_1280.webp";
const heroBg1768 = "/assets/hero_bg_1768.webp";

// 2. Updated Interface to accept React Component for Icon
interface Tool {
  name: string;
  path: string;
  description: string;
  iconBg: string;
  Icon: React.ElementType;
  category:
    | "ai"
    | "organize"
    | "edit"
    | "security"
    | "optimize"
    | "from_pdf"
    | "to_pdf";
}

const CATEGORIES = [
  { id: "all", label: "All Tools" },
  { id: "ai", label: "AI Tools" },
  { id: "organize", label: "Organize PDF" },
  { id: "edit", label: "Edit PDF" },
  { id: "security", label: "Security" },
  { id: "optimize", label: "Optimize PDF" },
  { id: "from_pdf", label: "Convert from PDF" },
  { id: "to_pdf", label: "Convert to PDF" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<"pdf" | "other">("pdf");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const homeSEO = {
    title: "PDFo - Free Online PDF Tools | Merge, Split, Convert & AI PDF Tool",
    description:
      "Free online PDF tools for professionals and businesses. Securely merge, split, and convert PDF documents with ease.",
    keywords:
      "pdf tools, merge pdf, split pdf, ai pdf tool, ai pdf summarize, pdf summary ai, pdf converter, compress pdf, free pdf tools online, professional pdf editor, online document tools",
    image: heroBg,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "PDFo",
      description:
        "Free online PDF tools for professionals and businesses. Securely merge, split, and convert PDF documents with ease.",
      url: typeof window !== "undefined" ? window.location.origin : "",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: [
        "AI PDF Tool & Summarization",
        "Merge PDF files",
        "Split PDF documents",
        "Convert PDF to Word/Excel/PowerPoint",
        "Convert images to PDF",
        "Compress PDF files",
        "Add watermarks and page numbers",
        "Edit PDF metadata",
        "Password protect PDFs",
      ],
    },
  };

  // 3. Icons mapped consistently with your specific tool pages
  const tools: Tool[] = [
    {
      name: "AI PDF Summarise",
      path: "/summarize",
      description: "Get key insights from your PDF using AI",
      iconBg: "bg-violet-600",
      Icon: Bot,
      category: "ai",
    },
    {
      name: "Merge PDF",
      path: "/merge",
      description: "Combine multiple PDF files into one document",
      iconBg: "bg-blue-500",
      Icon: Layers,
      category: "organize",
    },
    {
      name: "Split PDF",
      path: "/split",
      description: "Extract pages or split PDF into multiple files",
      iconBg: "bg-green-500",
      Icon: Scissors,
      category: "organize",
    },
    {
      name: "Reorder Pages",
      path: "/reorder",
      description: "Rearrange pages in your PDF document",
      iconBg: "bg-purple-500",
      Icon: ArrowUpDown, // Matches ReorderPages.tsx
      category: "organize",
    },
    {
      name: "Delete Pages",
      path: "/delete-pages",
      description: "Remove unwanted pages from PDF",
      iconBg: "bg-red-500",
      Icon: Trash2, // Matches DeletePages.tsx
      category: "organize",
    },
    {
      name: "Rotate PDF",
      path: "/rotate",
      description: "Rotate PDF pages by 90, 180, or 270 degrees",
      iconBg: "bg-orange-500",
      Icon: RotateCw,
      category: "organize",
    },
    {
      name: "Page Numbers",
      path: "/page-numbers",
      description: "Add page numbers to your PDF document",
      iconBg: "bg-indigo-500",
      Icon: ListOrdered,
      category: "edit",
    },
    {
      name: "Watermark PDF",
      path: "/watermark",
      description: "Add text or image watermarks to your PDF",
      iconBg: "bg-teal-500",
      Icon: Stamp,
      category: "edit",
    },
    {
      name: "Edit Metadata",
      path: "/metadata",
      description: "Change PDF title, author, and other metadata",
      iconBg: "bg-cyan-500",
      Icon: FileText,
      category: "edit",
    },
    {
      name: "Lock PDF",
      path: "/lock",
      description: "Password protect your PDF document",
      iconBg: "bg-yellow-500",
      Icon: Lock,
      category: "security",
    },
    {
      name: "Unlock PDF",
      path: "/unlock",
      description: "Remove password protection from PDF",
      iconBg: "bg-pink-500",
      Icon: Unlock,
      category: "security",
    },
    {
      name: "Compress PDF",
      path: "/compress",
      description: "Reduce PDF file size efficiently",
      iconBg: "bg-gray-500",
      Icon: Minimize2,
      category: "optimize",
    },
    {
      name: "PDF to JPG",
      path: "/pdf-to-jpg",
      description: "Convert PDF pages to high-quality JPG images",
      iconBg: "bg-rose-500",
      Icon: ImageIcon, // Matches PDFToJPG.tsx
      category: "from_pdf",
    },
    {
      name: "PDF to PNG",
      path: "/pdf-to-png",
      description: "Convert PDF pages to PNG images with transparency",
      iconBg: "bg-emerald-500",
      Icon: Images,
      category: "from_pdf",
    },
    {
      name: "PDF to Word",
      path: "/pdf-to-word",
      description: "Convert PDF to editable Word document",
      iconBg: "bg-blue-600",
      Icon: FileType,
      category: "from_pdf",
    },
    {
      name: "PDF to Excel",
      path: "/pdf-to-excel",
      description: "Extract tables and data to Excel spreadsheet",
      iconBg: "bg-green-600",
      Icon: FileSpreadsheet,
      category: "from_pdf",
    },
    {
      name: "PDF to PPT",
      path: "/pdf-to-ppt",
      description: "Convert PDF pages to PowerPoint slides",
      iconBg: "bg-orange-600",
      Icon: Presentation,
      category: "from_pdf",
    },
    {
      name: "PDF to TXT",
      path: "/pdf-to-txt",
      description: "Extract plain text content from PDF",
      iconBg: "bg-slate-500",
      Icon: FileText,
      category: "from_pdf",
    },
    {
      name: "PDF to JSON",
      path: "/pdf-to-json",
      description: "Convert PDF structure to JSON format",
      iconBg: "bg-amber-600",
      Icon: FileCode,
      category: "from_pdf",
    },
    {
      name: "Images to PDF",
      path: "/images-to-pdf",
      description: "Convert JPG, PNG, and more to a single PDF document",
      iconBg: "bg-lime-500",
      Icon: Images,
      category: "to_pdf",
    },
    {
      name: "PNG to PDF",
      path: "/png-to-pdf",
      description: "Convert PNG images to PDF",
      iconBg: "bg-emerald-600",
      Icon: ImageIcon,
      category: "to_pdf",
    },
    {
      name: "Word to PDF",
      path: "/word-to-pdf",
      description: "Convert Word documents to PDF format",
      iconBg: "bg-sky-600",
      Icon: FileType,
      category: "to_pdf",
    },
    {
      name: "Excel to PDF",
      path: "/excel-to-pdf",
      description: "Convert Excel spreadsheets to PDF format",
      iconBg: "bg-emerald-600",
      Icon: FileSpreadsheet,
      category: "to_pdf",
    },
  ];

  const filteredTools = useMemo(() => {
    if (activeCategory === "all") return tools;
    return tools.filter((tool) => tool.category === activeCategory);
  }, [activeCategory, tools]);

  const scrollToTools = () => {
    document.getElementById("tools-section")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <>
      <SEOHead
        title={homeSEO.title}
        description={homeSEO.description}
        keywords={homeSEO.keywords}
        canonicalUrl={
          typeof window !== "undefined" ? window.location.origin : ""
        }
        structuredData={homeSEO.structuredData}
      />

      {/* Hero Section */}
      <section className="hero-bg py-12 lg:py-16 relative overflow-hidden bg-gray-900">
        <img
          src={heroBg1280}
          srcSet={`${heroBg768} 768w, ${heroBg1280} 1280w, ${heroBg1768} 1768w`}
          sizes="100vw"
          alt=""
          aria-hidden="true"
          width={1768}
          height={995}
          loading="eager"
          decoding="async"
          {...({ fetchpriority: "high" } as Record<string, string>)}
          className="absolute inset-0 w-full h-full object-cover"
          data-testid="img-hero-bg"
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6))",
          }}
          aria-hidden="true"
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            Professional PDF Tools
          </h1>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-blue-400 mb-8">
            Made Simple
          </h2>
          <p className="text-lg text-gray-100 mb-8 max-w-3xl mx-auto">
            Merge, split, convert, and edit your PDF files with our
            comprehensive suite of professional tools and AI PDF Tool. Fast,
            secure, and completely free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="bg-violet-600 text-white hover:bg-violet-700 px-8 py-3 text-lg rounded-lg font-medium"
            >
              <Link href="/summarize" className="flex items-center">
                <Zap className="mr-2 h-5 w-5" />
                AI PDF Summarise
              </Link>
            </Button>
            <Button
              onClick={scrollToTools}
              size="lg"
              variant="outline"
              className="border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-8 py-3 text-lg rounded-lg font-medium"
            >
              Explore Tools
            </Button>
            <Button
              asChild
              className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 min-h-12 px-8 rounded-lg font-medium"
            >
              <a
                href="https://www.buymeacoffee.com/kuhulabsq"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <Coffee className="mr-2 h-5 w-5" />
                Support Us
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools-section" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {activeTab === "pdf"
                ? "Choose Your PDF Tool"
                : "Choose Your Tool"}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Select from our comprehensive suite of PDF manipulation tools
              designed for professionals and individuals alike.
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <div className="inline-flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab("pdf")}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === "pdf"
                    ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                <FileText className="mr-2 w-4 h-4 inline" />
                PDF Tools
              </button>
              <button
                onClick={() => setActiveTab("other")}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === "other"
                    ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                <Wand2 className="mr-2 w-4 h-4 inline" />
                Other Tools
              </button>
            </div>
          </div>

          <div className={`transition-all duration-300 ease-in-out`}>
            {activeTab === "pdf" ? (
              <div className="space-y-8">
                {/* Categories Tabs */}
                <div className="flex justify-start sm:justify-center overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                  <div className="flex gap-2 min-w-max">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap border ${
                          activeCategory === cat.id
                            ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20"
                            : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid Rendering */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {filteredTools.map((tool) => (
                    <Link key={tool.path} href={tool.path}>
                      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700 cursor-pointer group">
                        <div className="flex items-center">
                          <div
                            className={`w-14 h-14 ${tool.iconBg} rounded-xl flex items-center justify-center text-white mr-5 group-hover:scale-105 transition-transform`}
                            role="img"
                            aria-label={`${tool.name} tool`}
                          >
                            {/* Rendering the React Component Icon */}
                            <tool.Icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                              {tool.name}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm line-clamp-2">
                              {tool.description}
                            </p>
                          </div>
                          <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <LayoutTemplate className="w-5 h-5 text-gray-300 rotate-90" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto mt-12 p-12 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Coming Soon
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                  New utility tools are currently in development.
                </p>
                <p className="text-blue-600 dark:text-blue-400 font-medium tracking-wider uppercase text-sm">
                  Development Mode
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose PDFo?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Secure & Private
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Your files are processed securely and deleted automatically
                after processing.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Lightning Fast
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Process your PDF files in seconds with our optimized algorithms.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-violet-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Works Everywhere
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Access our tools from any device, anywhere, anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      <MainFooter />
    </>
  );
}
