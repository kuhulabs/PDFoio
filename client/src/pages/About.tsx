import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, 
  Zap, 
  Infinity, 
  Monitor, 
  XCircle, 
  UserCheck, 
  GraduationCap, 
  Briefcase, 
  Layers, 
  Heart, 
  Mail,
  Coffee,
  CheckCircle2,
  Globe
} from "lucide-react";
import { Link } from "wouter";
import { MainFooter } from "@/components/MainFooter";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 pb-12">
        <SEOHead 
          breadcrumbs={[
            { name: "Home", url: window.location.origin },
            { name: "About", url: `${window.location.origin}/about` }
          ]}  
          title="About PDFo - Simple, Secure & Free PDF Tools"
          description="PDFo helps individuals and businesses work with PDFs easily using fast, secure, and privacy-first online tools. No sign-up, no watermarks, 100% free."
        />

        {/* 1. Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-20 md:py-32 border-b">
          <div className="container px-4 mx-auto text-center">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-6 animate-in fade-in slide-in-from-bottom-3">
              <span>🚀 Simply Powerful PDF Tools</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-foreground max-w-4xl mx-auto leading-tight">
              We make working with PDFs <br className="hidden md:block" />
              <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">Simple, Secure & Free</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              No installations. No sign-ups. No headaches. Just the tools you need to get the job done right now.
            </p>
          </div>
        </section>

        <div className="container px-4 mx-auto mt-16 space-y-24">
          
          {/* 2. Mission Statement */}
          <section className="max-w-4xl mx-auto text-center">
            <div className="grid md:grid-cols-2 gap-12 items-center text-left">
              <div>
                <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We believe essential digital tools should be accessible to everyone. Our mission is to democratize PDF management by providing a suite of professional-grade tools that are completely free, incredibly fast, and relentlessly secure.
                </p>
                <div className="mt-6 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>Always Free for Everyone</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>Privacy First Architecture</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>No Hidden Paywalls</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-2xl blur-2xl -z-10"></div>
                <div className="bg-card border rounded-2xl p-8 shadow-xl">
                  <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6 mx-auto">
                    <Globe className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-xl font-medium text-center italic">
                    "Technology works best when it gets out of the way. We build tools that just work."
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Why Choose PDFo? (Cards) */}
          <section>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose PDFo?</h2>
              <p className="text-muted-foreground">Built for performance, designed for privacy.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: ShieldCheck, title: "Privacy-First", desc: "Your files are encrypted securely and automatically deleted from our servers permanently after 1 hour." },
                { icon: Zap, title: "Lightning Fast", desc: "Our optimized processing engine handles even large files in seconds, running directly in your browser where possible." },
                { icon: Infinity, title: "100% Free", desc: "No trial periods, no credit cards, no 'premium' tier. Every tool is available to everyone, completely free." },
                { icon: Monitor, title: "Universal Access", desc: "Works perfectly on any device with a browser—Windows, Mac, Linux, iPhone, or Android." },
                { icon: XCircle, title: "No Watermarks", desc: "We respect your documents. We never add watermarks to your files. Your work stays yours." },
                { icon: UserCheck, title: "No Sign-up Required", desc: "Start working immediately. We don't ask for your email or force you to create an account." },
              ].map((feature, i) => (
                <Card key={i} className="hover:shadow-lg transition-all hover:-translate-y-1 border-primary/10">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* 4. Company & Made in India */}
          <section className="bg-muted/30 rounded-3xl p-10 md:p-16 text-center border">
            <h2 className="text-3xl font-bold mb-6">Built by Kuhu Labs</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              PDFo is proudly developed by <span className="font-semibold text-foreground">Kuhu Labs</span>, a technology studio committed to building elegant, high-performance digital solutions that simplify complex tasks.
            </p>
            
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-800 rounded-full shadow-sm border text-lg font-medium">
              <span className="text-2xl">🇮🇳</span> 
              <span>Proudly Made in India</span>
            </div>
          </section>

          {/* 5. Who is it for? */}
          <section>
            <h2 className="text-3xl font-bold text-center mb-12">Who Uses PDFo?</h2>
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { icon: GraduationCap, label: "Students" },
                { icon: Briefcase, label: "Professionals" },
                { icon: Heart, label: "Freelancers" },
                { icon: Layers, label: "Designers" },
                { icon: ShieldCheck, label: "Legal Teams" },
                { icon: Zap, label: "Startups" },
              ].map((item, i) => (
                <div key={i} className="group flex flex-col items-center gap-3 p-6 bg-card border rounded-2xl w-36 md:w-44 transition-all hover:border-primary hover:shadow-md">
                  <item.icon className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 6. Contact & Support CTA */}
          <section className="text-center pt-10 pb-10">
            <h2 className="text-3xl font-bold mb-6">We'd Love to Hear From You</h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
              Have a suggestion, found a bug, or just want to say hi? Our support team is always ready to help.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="h-12 px-8 text-base">
                <Link href="/contact">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Support
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base bg-[#FFDD00] hover:bg-[#FFDD00]/90 text-black border-none hover:text-black">
                <a href="https://www.buymeacoffee.com/kuhulabsq" target="_blank" rel="noopener noreferrer">
                  <Coffee className="w-4 h-4 mr-2" />
                  Buy us a Coffee
                </a>
              </Button>
            </div>
          </section>
        </div>
      </div>
      <MainFooter />
    </div>
  );
}
