// 1. FIXED: 'import' must be lowercase
import { useState } from "react";
import { Link } from "wouter";
import { SEOHead } from "@/components/SEOHead";
import { 
  Mail, 
  Zap, 
  Info, 
  LifeBuoy, 
  Copy, 
  Check, 
  ExternalLink,
  MessageSquare
} from "lucide-react";
import { MainFooter } from "@/components/MainFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BuyMeCoffeeButton } from "@/components/BuyMeCoffeeButton"; // 2. REUSE: Component use kiya
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();
  const SUPPORT_EMAIL = "kuhulabs@zohomail.in";

  // 3. FEATURE: Copy Email Functionality
  const handleCopyEmail = () => {
    navigator.clipboard.writeText(SUPPORT_EMAIL);
    setIsCopied(true);
    toast({
      title: "Email Copied",
      description: "Support email copied to clipboard.",
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 pb-12">
        <SEOHead 
          breadcrumbs={[
            { name: "Home", url: window.location.origin }, 
            { name: "Contact", url: `${window.location.origin}/contact` }
          ]}  
          title="Contact PDFo Support | Kuhu Labs"
          description="Contact PDFo support for help with PDF tools or API early access. Email us at kuhulabs@zohomail.in."
        />

        {/* Hero Section */}
        <section className="bg-slate-50 dark:bg-slate-900/50 py-16 md:py-24 border-b border-border/50">
          <div className="container px-4 mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-foreground">
              Contact PDFo
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Have questions, feedback, or need assistance? We're here to help you.
            </p>
          </div>
        </section>

        <div className="container px-4 mx-auto -mt-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* Primary Contact Card - Support Focus */}
            <Card className="shadow-xl border-t-4 border-t-primary overflow-hidden bg-card">
              <CardContent className="p-8 space-y-6">
                <div className="flex items-start justify-between">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <LifeBuoy className="w-8 h-8 text-primary" />
                    </div>
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-3 py-1 rounded-full">
                        Typical Reply: &lt; 24h
                    </span>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-foreground">General Support</h2>
                  <p className="text-muted-foreground">
                    For technical issues, bug reports, or tool-related questions.
                  </p>
                </div>
                
                {/* Email Display & Copy Area */}
                <div className="p-4 bg-muted/50 rounded-xl border border-border/50 flex items-center justify-between group">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Mail className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-lg font-semibold truncate select-all">{SUPPORT_EMAIL}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleCopyEmail}
                    className="shrink-0 hover:bg-background shadow-sm"
                    aria-label="Copy email address"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>

                <div className="space-y-3 pt-2">
                  <Button asChild className="w-full h-12 text-lg font-bold shadow-lg hover:shadow-primary/20">
                    <a href={`mailto:${SUPPORT_EMAIL}?subject=PDFo Support Request`}>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open Mail App
                    </a>
                  </Button>
                  
                  {/* Reuse Buy Me Coffee */}
                  <div className="w-full">
                    <BuyMeCoffeeButton className="w-full justify-center h-12" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Secondary CTA - API Early Access */}
            <Card className="shadow-xl border-t-4 border-t-slate-500 overflow-hidden bg-card">
              <CardContent className="p-8 space-y-6 text-center h-full flex flex-col justify-between">
                <div>
                    <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Zap className="w-8 h-8 text-slate-500 dark:text-slate-400" />
                    </div>
                    <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-foreground">API Early Access</h2>
                    <p className="text-muted-foreground">
                        Building a document workflow? Join our developer program to get early access to PDFo APIs.
                    </p>
                    </div>
                </div>

                {/* 4. DIAGRAM: Visual appeal for developers */}
                <div className="py-4">
                    
                </div>
                
                <div className="pt-4">
                  <Button variant="outline" asChild className="w-full h-12 text-lg font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <a href={`mailto:${SUPPORT_EMAIL}?subject=PDFo API Early Access Request`}>
                      Request Access
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Help Topics Grid */}
          <div className="max-w-4xl mx-auto mt-20 space-y-10">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground">Common Topics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: MessageSquare, text: "Feature suggestions" },
                { icon: Zap, text: "Bug reports" },
                { icon: Mail, text: "Business inquiries" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-5 bg-card rounded-xl border border-border shadow-sm hover:border-primary/50 transition-colors">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium text-foreground">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Note */}
          <div className="max-w-2xl mx-auto mt-16 p-6 bg-blue-50 dark:bg-blue-950/20 rounded-2xl border border-blue-100 dark:border-blue-900 text-center flex flex-col items-center gap-3">
            <Info className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <p className="text-sm text-muted-foreground">
              We respect your inbox. No spam, ever. Your email is only used to reply to your inquiry.
              Read our <Link href="/privacy" className="text-primary hover:underline font-semibold">Privacy Policy</Link>.
            </p>
          </div>

          {/* Company Info */}
          <div className="text-center mt-12 mb-8 text-muted-foreground">
            <p className="text-lg">
              Developed by <span className="font-bold text-foreground">Kuhu Labs</span>
            </p>
            <p className="mt-2 text-sm font-medium">Proudly Made in India 🇮🇳</p>
          </div>
        </div>
      </div>
      <MainFooter />
    </div>
  );
}
