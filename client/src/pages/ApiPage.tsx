// 1. FIXED: 'import' must be lowercase
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { SEOHead } from "@/components/SEOHead";
import { 
  Code2, 
  Cpu, 
  Lock, 
  Zap, 
  FileJson, 
  CheckCircle2, 
  Clock, 
  Send,
  Webhook
} from "lucide-react";
import { MainFooter } from "@/components/MainFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ApiPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 pb-12">
        <SEOHead 
          title="PDFo API – PDF Processing API (Coming Soon)"
          description="PDFo API is coming soon. Powerful PDF processing APIs for developers. Request early access today."
        />

        {/* Hero Section */}
        <section className="bg-slate-950 text-white py-16 md:py-24 border-b border-slate-800 relative overflow-hidden">
          {/* Background Grid Pattern Effect */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          
          <div className="container px-4 mx-auto text-center relative z-10">
            <Badge variant="outline" className="mb-6 border-blue-500/50 text-blue-400 px-4 py-1.5 rounded-full">
              <ConstructionIcon className="w-3 h-3 mr-2 inline" />
              Work in Progress
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              PDFo API – <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">Coming Soon</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Powerful, scalable, and secure PDF processing APIs for developers. Integrate professional PDF manipulation directly into your apps.
            </p>
          </div>
        </section>

        <div className="container px-4 mx-auto mt-16 space-y-24">
          
          {/* Code Example Section */}
          <section className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1 space-y-4">
                    <h2 className="text-3xl font-bold">Simple Integration</h2>
                    <p className="text-muted-foreground text-lg">
                        Process documents with a simple JSON payload. We handle the heavy lifting and notify your webhook when the job is done.
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> Async processing</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> Webhook notifications</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> S3 / URL input support</li>
                    </ul>
                </div>

                {/* Code Block */}
                <div className="flex-1 w-full">
                    <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-2xl overflow-hidden font-mono text-sm relative group">
                    <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="text-slate-500 ml-2 text-xs">POST /api/v1/merge</span>
                    </div>
                    <pre className="text-blue-300 overflow-x-auto custom-scrollbar">
{`{
  "tasks": ["merge"],
  "files": [
    "https://cdn.example.com/report_a.pdf",
    "https://cdn.example.com/report_b.pdf"
  ],
  "options": {
    "output_name": "annual_report_2024.pdf"
  },
  "webhook_url": "https://api.yourapp.com/hooks"
}`}
                    </pre>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Badge variant="secondary" className="text-xs">JSON</Badge>
                    </div>
                    </div>
                </div>
            </div>
            
            <div className="mt-12">
                
            </div>
          </section>

          {/* What the API Will Offer */}
          <section>
            <h2 className="text-3xl font-bold text-center mb-12">API Capabilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Zap, title: "Core Operations", desc: "Merge, split, and compress PDFs with high-performance engines." },
                { icon: FileJson, title: "High Fidelity", desc: "Convert PDF to Word, Excel, & Images while preserving exact layout." },
                { icon: Cpu, title: "AI Extraction", desc: "Extract structured data (tables, invoices) using our AI models." },
                { icon: Webhook, title: "Webhooks", desc: "Event-driven architecture. Receive real-time updates on job status." },
              ].map((item, i) => (
                <Card key={i} className="group hover:shadow-lg transition-all duration-300 border-border/50">
                  <CardContent className="pt-6">
                    <div className="mb-4 inline-flex p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Development Status Tracker */}
          <section className="max-w-4xl mx-auto bg-card rounded-2xl p-8 md:p-12 border shadow-sm">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1 space-y-6">
                <h2 className="text-3xl font-bold">Development Roadmap</h2>
                <p className="text-lg text-muted-foreground">
                  The PDFo API is currently in alpha testing. We are stress-testing our infrastructure to ensure enterprise-grade reliability.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="secondary" className="px-3 py-1">
                    <Clock className="w-3 h-3 mr-2" /> Phase 1: Alpha
                  </Badge>
                  <Badge variant="secondary" className="px-3 py-1">
                    <Lock className="w-3 h-3 mr-2" /> Security Audits
                  </Badge>
                </div>
              </div>
              
              <div className="flex-1 space-y-6 w-full">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Architecture Design</span>
                    <span className="text-green-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Complete</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-full" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Core Endpoints (Merge/Split)</span>
                    <span className="text-blue-600">90% Ready</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[90%]" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Public Beta Launch</span>
                    <span className="text-muted-foreground">Q4 2024</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-slate-300 dark:bg-slate-700 w-[20%]" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center pb-8">
            <h2 className="text-3xl font-bold mb-4">Request Developer Access</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Be the first to build with PDFo. We are accepting a limited number of developers for our closed beta program.
            </p>
            <Button asChild size="lg" className="px-8 h-12 text-lg font-medium shadow-lg hover:shadow-primary/25">
              <Link href="/contact">
                <Send className="w-4 h-4 mr-2" />
                Join Waitlist
              </Link>
            </Button>
          </section>

        </div>
      </div>
      <MainFooter />
    </div>
  );
}

// Simple icon for the badge
function ConstructionIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="6" width="20" height="8" rx="1" />
      <path d="M17 14v7" />
      <path d="M7 14v7" />
      <path d="M17 3v3" />
      <path d="M7 3v3" />
      <path d="M10 14 2.3 6.3" />
      <path d="m14 6 7.7 7.7" />
      <path d="m8 6 8 8" />
    </svg>
  )
}
