// 1. FIXED: 'import' must be lowercase
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
  CheckCircle2 // Added for bullet points
} from "lucide-react";
import { Link } from "wouter";
import { MainFooter } from "@/components/MainFooter";
import { BuyMeCoffeeButton } from "@/components/BuyMeCoffeeButton"; // 2. REUSE: Component use kiya

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
        <section className="bg-primary/5 py-16 md:py-24 border-b border-border/50">
          <div className="container px-4 mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-foreground">
              About PDFo – Simple, Secure & <span className="text-primary">Free</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We help individuals and businesses master their documents with fast, privacy-first, and completely free online tools.
            </p>
          </div>
        </section>

        <div className="container px-4 mx-auto mt-16 space-y-24">
          
          {/* 2. Who We Are */}
          <section className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-foreground">Who We Are</h2>
            <div className="text-lg text-muted-foreground space-y-4 leading-relaxed">
              <p>
                PDFo is an online platform designed to solve daily PDF challenges with ease. Whether you need to merge documents, compress files, or edit metadata, we provide the tools to get it done in seconds.
              </p>
              <p>
                Built for students, professionals, freelancers, and businesses, PDFo removes the barriers of expensive software. No installation, no sign-up, and absolutely no watermarks on your professional documents.
              </p>
            </div>
          </section>

          {/* 3. Our Mission */}
          <section className="max-w-4xl mx-auto bg-primary text-primary-foreground rounded-3xl p-8 md:p-12 text-center shadow-xl shadow-primary/10">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 opacity-90">Our Mission</h2>
            <p className="text-xl md:text-2xl leading-relaxed italic font-medium">
              "To make professional document tools accessible to everyone — free, fast, and secure — without compromising user privacy."
            </p>
          </section>

          {/* 4. Why Choose PDFo? */}
          <section>
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Why Choose PDFo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: ShieldCheck, title: "Privacy-first", desc: "Your files are encrypted during processing and auto-deleted after use." },
                { icon: Zap, title: "Lightning Fast", desc: "Optimized algorithms ensure your files are processed in the blink of an eye." },
                { icon: Infinity, title: "100% Free", desc: "No hidden costs, no premium tiers. All tools are available to everyone for free." },
                { icon: Monitor, title: "Universal Access", desc: "Works seamlessly on all devices - Windows, Mac, Linux, iOS, and Android." },
                { icon: XCircle, title: "No Watermark", desc: "We believe in professional results. Your documents stay clean and original." },
                { icon: UserCheck, title: "No Sign-up", desc: "Start working immediately. We don't require any personal information." },
              ].map((feature, i) => (
                <Card key={i} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50">
                  <CardContent className="pt-8">
                    <div className="mb-4 inline-flex p-3 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* 5. Our Tools & Technology */}
          <section className="grid md:grid-cols-2 gap-12 items-center bg-muted/30 p-8 rounded-3xl border border-border/50">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl font-bold mb-6 text-foreground">Powering Your Productivity</h2>
              <ul className="space-y-4 text-lg text-muted-foreground">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="text-green-500 w-6 h-6 shrink-0" /> 20+ professional PDF tools
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="text-green-500 w-6 h-6 shrink-0" /> AI-powered Summarization
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="text-green-500 w-6 h-6 shrink-0" /> Browser-based local processing
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="text-green-500 w-6 h-6 shrink-0" /> Frequent updates & new features
                </li>
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/merge">
                  <Button variant="outline" className="rounded-full">Merge PDF</Button>
                </Link>
                <Link href="/compress">
                   <Button variant="outline" className="rounded-full">Compress PDF</Button>
                </Link>
                <Link href="/summarize">
                   <Button variant="default" className="rounded-full">Try AI Tools</Button>
                </Link>
              </div>
            </div>
            <div className="order-1 md:order-2 flex justify-center">
              <div className="w-full max-w-sm bg-background rounded-2xl p-8 shadow-xl border border-border/50 flex items-center justify-center aspect-square relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent" />
                <Layers className="w-32 h-32 text-primary relative z-10" />
              </div>
            </div>
          </section>

          {/* 6. Security & Privacy */}
          <section className="bg-background rounded-2xl p-8 md:p-12 border border-border shadow-sm">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-foreground">
                  <ShieldCheck className="text-primary w-8 h-8" /> Security & Privacy
                </h2>
                <h3 className="text-xl font-semibold mb-4 text-foreground">Our Commitment</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We take your document security seriously. PDFo is built with a privacy-first architecture. In many cases, files are processed directly in your browser and never even leave your device.
                </p>
              </div>
              <div className="md:w-1/2 bg-muted/50 rounded-xl p-6">
                <ul className="grid grid-cols-1 gap-4">
                  {[
                    "Files encrypted during transfer (SSL/TLS)",
                    "Automatic file deletion after 1 hour",
                    "No data mining or content analysis",
                    "GDPR compliant practices"
                  ].map((point, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <ShieldCheck className="text-primary w-5 h-5 mt-1 shrink-0" />
                      <span className="text-muted-foreground">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* 7. Who Is PDFo For? */}
          <section>
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Who Uses PDFo?</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { icon: GraduationCap, label: "Students" },
                { icon: Briefcase, label: "Professionals" },
                { icon: Heart, label: "Freelancers" },
                { icon: Layers, label: "Designers" },
                { icon: ShieldCheck, label: "Legal Teams" },
                { icon: Zap, label: "Startups" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-3 p-6 bg-card border rounded-2xl w-36 md:w-44 hover:border-primary/50 transition-colors duration-300">
                  <item.icon className="w-8 h-8 text-primary" />
                  <span className="font-medium text-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 8. Contact & Support */}
          <section className="text-center border-t border-border pt-20">
            <h2 className="text-3xl font-bold mb-6 text-foreground">Get in Touch</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Have questions, feedback, or found a bug? We'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/contact">
                <Button size="lg" className="px-8 h-14 text-lg font-medium shadow-lg hover:shadow-primary/20">
                  <Mail className="w-5 h-5 mr-2" />
                  Contact Support
                </Button>
              </Link>
              
              {/* 2. REUSE: Consistent Buy Me Coffee Button */}
              <div className="h-14 flex items-center">
                 <BuyMeCoffeeButton />
              </div>
            </div>
          </section>
        </div>
      </div>
      
      {/* 9. Company Info Footer Section */}
      <div className="bg-muted/30 border-t border-border py-12 text-center">
         <p className="text-lg text-muted-foreground mb-2">
            Developed by <span className="font-semibold text-foreground">Kuhu Labs</span>
         </p>
         <div className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground">
            Proudly Made in India 🇮🇳
         </div>
      </div>

      <MainFooter />
    </div>
  );
}
