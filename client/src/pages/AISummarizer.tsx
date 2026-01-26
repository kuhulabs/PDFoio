// 1. FIXED: 'import' must be lowercase
import { TOOL_SEO } from "@/seo/seo";
import { useEffect } from "react";
import { Link } from "wouter";
import { ToolFooter } from "@/components/ToolFooter";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
// 2. FIXED: Using Lucide icons for consistency
import { ArrowLeft, Bot, Construction, Sparkles } from "lucide-react"; 

export default function AISummarizer() {
  const seoData = TOOL_SEO['summarize'];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <SEOHead 
        breadcrumbs={[
          { name: "Home", url: window.location.origin }, 
          { name: "AI PDF Summarizer", url: `${window.location.origin}/summarize` }
        ]}  
        title={seoData?.title || "AI PDF Summarizer - Free Online Tool"}
        description={seoData?.metaDescription || "Summarize PDF documents using AI. Fast, accurate, and free."}
        keywords={(seoData as any)?.keywords || "ai pdf summarizer, pdf summary tool"}
      />
      
      <div className="flex-grow max-w-4xl mx-auto px-4 py-12 w-full">
        {/* Navigation */}
        <div className="mb-12">
          <Link href="/">
            <a className="inline-flex items-center text-violet-600 dark:text-violet-400 font-medium hover:underline transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tools
            </a>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 mb-4 bg-violet-100 dark:bg-violet-900/30 rounded-2xl">
            <Sparkles className="w-8 h-8 text-violet-600 dark:text-violet-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
            AI PDF Summarizer
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Summarize long PDFs into clear, concise bullet points using advanced AI.
          </p>
        </div>

        {/* Coming Soon Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-12 text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500" />
          
          <div className="mb-6 inline-flex items-center justify-center w-24 h-24 bg-violet-50 dark:bg-violet-900/20 rounded-full animate-pulse">
            <Bot className="w-12 h-12 text-violet-600 dark:text-violet-400" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Coming Soon
          </h2>
          
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide flex items-center">
              <Construction className="w-3 h-3 mr-1" />
              Under Development
            </span>
          </div>

          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
            We are fine-tuning our AI models to ensure you get the most accurate summaries possible. Check back shortly!
          </p>
          
          <Link href="/">
            <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-6 px-8 rounded-xl transition-all shadow-lg hover:shadow-violet-500/25 hover:-translate-y-1">
              Explore Available Tools
            </Button>
          </Link>
        </div>
      </div>

      <ToolFooter />
    </div>
  );
}
