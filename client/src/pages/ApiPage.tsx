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
  ArrowRight,
  Terminal,
  Server,
  Shield
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
        <section className="relative overflow-hidden bg-slate-950 text-white py-20 md:py-32 border-b border-slate-800">
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
          
          <div className="container px-4 mx-auto text-center relative z-10">
            <Badge variant="outline" className="mb-6 border-blue-500/50 text-blue-400 px-4 py-1.5 text-sm bg-blue-500/10 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-blue-400 mr-2 animate-pulse"></span>
              Work in Progress
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8">
              PDFo API <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Coming Soon</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-10">
              Integrate enterprise-grade PDF manipulation directly into your applications. Fast, secure, and developer-friendly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold h-12 px-8">
                <Link href="/contact">
                  Request Early Access <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white h-12 px-8">
                <a href="#features">View Capabilities</a>
              </Button>
            </div>
          </div>
        </section>

        <div className="container px-4 mx-auto mt-16 space-y-24">
          
          {/* Code Example */}
          <section className="max-w-4xl mx-auto -mt-32 relative z-20">
            <div className="bg-[#0f172a] rounded-xl border border-slate-700 shadow-2xl overflow-hidden backdrop-blur-xl">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50 bg-slate-900/50">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="text-xs font-mono text-slate-500 flex items-center">
                  <Terminal className="w-3 h-3 mr-1" /> bash
                </div>
              </div>
              <div className="p-6 overflow-x-auto">
                <pre className="font-mono text-sm leading-relaxed">
                  <code className="text-slate-300">
                    <span className="text-purple-400">curl</span> -X POST https://api.pdfo.io/v1/merge \<br/>
                    &nbsp;&nbsp;<span className="text-blue-400">-H</span> <span className="text-green-400">"Authorization: Bearer YOUR_API_KEY"</span> \<br/>
                    &nbsp;&nbsp;<span className="text-blue-400">-H</span> <span className="text-green-400">"Content-Type: application/json"</span> \<br/>
                    &nbsp;&nbsp;<span className="text-blue-400">-d</span> '<span className="text-yellow-300">{`{
    "files": [
      "https://pdfo.io/files/doc1.pdf",
      "https://pdfo.io/files/doc2.pdf"
    ],
    "options": {
      "normalize": true
    }
  }`}</span>'
                  </code>
                </pre>
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section id="features">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Powerful Capabilities</h2>
              <p className="text-muted-foreground text-lg">Everything you need to build robust PDF workflows.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { 
                  icon: Zap, 
                  color: "text-amber-500",
                  bg: "bg-amber-500/10",
                  title: "Core Operations", 
                  desc: "Merge, split, rotate, and compress PDFs with high-performance engines." 
                },
                { 
                  icon: FileJson, 
                  color: "text-blue-500",
                  bg: "bg-blue-500/10",
                  title: "High-Fidelity Conversion", 
                  desc: "Convert PDF to Office formats, Images, and HTML with layout preservation." 
                },
                { 
                  icon: Cpu, 
                  color: "text-purple-500",
                  bg: "bg-purple-500/10",
                  title: "AI Extraction", 
                  desc: "Leverage LLMs for intelligent summarization and structured data extraction." 
                },
                { 
                  icon: Shield, 
                  color: "text-emerald-500",
                  bg: "bg-emerald-500/10",
                  title: "Enterprise Security", 
                  desc: "SOC2 compliant infrastructure with end-to-end encryption and auto-deletion." 
                },
              ].map((item, i) => (
                <Card key={i} className="hover:shadow-lg transition-all hover:-translate-y-1 border-primary/10">
                  <CardContent className="pt-6">
                    <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center mb-4`}>
                      <item.icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Roadmap / Status */}
          <section className="max-w-5xl mx-auto bg-card border rounded-3xl p-8 md:p-12 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-12">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium">
                  <Clock className="w-3 h-3" /> Roadmap 2024
                </div>
                <h2 className="text-3xl font-bold">Development Status</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We are currently in the <strong>Closed Alpha</strong> phase, testing core endpoints with select partners. Our focus is on optimizing latency and ensuring 99.9% uptime reliability.
                </p>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="p-4 bg-muted/50 rounded-xl">
                    <Server className="w-5 h-5 text-primary mb-2" />
                    <div className="font-semibold">API Gateway</div>
                    <div className="text-sm text-muted-foreground">90% Complete</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-xl">
                    <Lock className="w-5 h-5 text-primary mb-2" />
                    <div className="font-semibold">Auth System</div>
                    <div className="text-sm text-muted-foreground">100% Complete</div>
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-8">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> Core Engines</span>
                    <span className="text-green-600">Ready</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-full animate-pulse" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="flex items-center gap-2"><Code2 className="w-4 h-4 text-blue-500"/> SDKs (Node, Python)</span>
                    <span className="text-blue-600">In Progress</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[75%]" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="flex items-center gap-2"><FileJson className="w-4 h-4 text-purple-500"/> Documentation</span>
                    <span className="text-purple-600">Drafting</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 w-[40%]" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center pb-12">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-12 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-10"></div>
              
              <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold">Ready to Build?</h2>
                <p className="text-slate-300 text-lg">
                  Get notified when we launch public beta. First 100 developers get <span className="text-white font-semibold">10,000 free credits</span>.
                </p>
                <div className="flex justify-center pt-4">
                  <Button asChild size="lg" className="bg-white text-slate-900 hover:bg-slate-100 hover:text-slate-950 font-bold h-12 px-8">
                    <Link href="/contact">
                      Join Waitlist
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
      <MainFooter />
    </div>
  );
}
