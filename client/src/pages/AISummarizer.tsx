import { useEffect } from "react";
import { Link } from "wouter";
import { ToolFooter } from "@/components/ToolFooter";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { summarizeSEO } from "@/seo/summarize";
import {
  ArrowLeft,
  Bot,
  Sparkles,
  BrainCircuit,
  Construction,
} from "lucide-react";

export default function AISummarizer() {
  const seoData = summarizeSEO;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEOHead
        breadcrumbs={[
          { name: "Home", url: window.location.origin },
          { name: "AI Summarizer", url: `${window.location.origin}/summarize` },
        ]}
        title={
          seoData?.title || "AI PDF Summarizer - Summarize Documents Instantly"
        }
        description={
          seoData?.metaDescription ||
          "Use AI to summarize long PDF documents into concise bullet points."
        }
        keywords={
          (seoData as any)?.keywords ||
          "ai pdf summarizer, summarize pdf, ai document analysis"
        }
        canonicalUrl={`${window.location.origin}/summarize`}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[70vh] flex flex-col">
        {/* Navigation */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-muted-foreground hover:text-primary flex items-center text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Tools
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 shadow-sm animate-in zoom-in duration-500">
            <Bot className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight">
            AI PDF Summarizer
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg leading-relaxed">
            Turn long documents into clear, actionable insights using advanced
            Artificial Intelligence.
          </p>
        </div>

        {/* Coming Soon Card */}
        <div className="max-w-3xl mx-auto w-full bg-card border border-violet-200 dark:border-violet-900/50 rounded-2xl shadow-xl p-8 md:p-12 text-center relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-full shadow-lg shadow-violet-500/20">
              <Sparkles className="text-white w-10 h-10 animate-pulse" />
            </div>

            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Coming Very Soon
            </h2>

            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
              We are currently fine-tuning our AI models to provide you with the
              most accurate summaries.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
              <Link href="/">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700 text-white shadow-md gap-2 h-12 text-base"
                >
                  <ArrowLeft className="w-4 h-4" /> Explore Other Tools
                </Button>
              </Link>

              <Button
                variant="outline"
                size="lg"
                disabled
                className="w-full sm:w-auto border-violet-200 dark:border-violet-800 text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/20 h-12 text-base cursor-not-allowed opacity-100"
              >
                <Construction className="w-4 h-4 mr-2" /> In Development
              </Button>
            </div>

            {/* Feature Teaser Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 w-full text-left">
              <div className="p-4 rounded-xl bg-background/50 border shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 mb-3">
                  <BrainCircuit className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-sm">Smart Analysis</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Extracts key points instantly.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-background/50 border shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 mb-3">
                  <i className="fas fa-list-ul text-xs"></i>
                </div>
                <h3 className="font-semibold text-sm">Bullet Points</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Get concise, readable lists.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-background/50 border shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 mb-3">
                  <i className="fas fa-language text-xs"></i>
                </div>
                <h3 className="font-semibold text-sm">Multi-language</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Supports major global languages.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToolFooter />
    </>
  );
}
