import { Link } from "wouter";
import { SEOHead } from "@/components/SEOHead";
import {
  Mail,
  MessageSquare,
  ShieldCheck,
  Zap,
  Info,
  LifeBuoy,
  MapPin,
  Globe,
  ArrowRight,
  Coffee,
  HelpCircle,
  Heart,
} from "lucide-react";
import { MainFooter } from "@/components/MainFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 pb-12">
        <SEOHead
          breadcrumbs={[
            { name: "Home", url: window.location.origin },
            { name: "Contact", url: `${window.location.origin}/contact` },
          ]}
          title="Contact PDFo Support | Kuhu Labs"
          description="Get in touch with the PDFo team. Support, API inquiries, and feedback. Proudly built by Kuhu Labs in India."
        />

        {/* 1. Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden border-b bg-slate-50 dark:bg-slate-950">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-40"></div>

          <div className="container px-4 mx-auto text-center relative z-10">
            <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium bg-background shadow-sm mb-6 animate-in fade-in slide-in-from-bottom-4">
              <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
              We usually reply within 24 hours
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-foreground">
              Let's Start a{" "}
              <span className="text-blue-600 dark:text-blue-400">
                Conversation
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Whether you have a question about our PDF tools, need API access,
              or just want to share feedback, we're here to help.
            </p>
          </div>
        </section>

        <div className="container px-4 mx-auto -mt-16 relative z-20 space-y-24">
          {/* 2. Contact Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* General Support */}
            <Card className="shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border-t-4 border-t-blue-500">
              <CardContent className="p-8 flex flex-col h-full">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6">
                  <LifeBuoy className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Help & Support</h3>
                <p className="text-muted-foreground mb-8 flex-1">
                  Facing issues with a tool? Found a bug? Our support team is
                  ready to assist you.
                </p>
                <Button
                  asChild
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <a href="mailto:kuhulabs@zohomail.in?subject=PDFo Support Request">
                    Email Support <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* API / Business */}
            <Card className="shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border-t-4 border-t-purple-500">
              <CardContent className="p-8 flex flex-col h-full">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">API & Business</h3>
                <p className="text-muted-foreground mb-8 flex-1">
                  Interested in our API for your application? Contact us for
                  early access.
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-purple-200 hover:bg-purple-50 dark:border-purple-900 dark:hover:bg-purple-900/20"
                >
                  <a href="mailto:kuhulabs@zohomail.in?subject=PDFo API Inquiry">
                    Request Access <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Support Us */}
            <Card className="shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border-t-4 border-t-amber-400">
              <CardContent className="p-8 flex flex-col h-full">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mb-6">
                  <Coffee className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Support Our Work</h3>
                <p className="text-muted-foreground mb-8 flex-1">
                  PDFo is free and ad-free. If we saved you time, consider
                  buying us a coffee!
                </p>
                <Button
                  asChild
                  className="w-full bg-[#FFDD00] hover:bg-[#FFDD00]/90 text-black border-none"
                >
                  <a
                    href="https://www.buymeacoffee.com/kuhulabsq"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Buy Me a Coffee{" "}
                    <Heart className="w-4 h-4 ml-2 fill-black/20" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 3. FAQ Section */}
          <section className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground">
                Quick answers to questions we get asked the most.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "Is PDFo completely free?",
                  a: "Yes! All our tools are 100% free to use. We don't have hidden paywalls, subscriptions, or watermarks.",
                },
                {
                  q: "Are my files safe?",
                  a: "Absolutely. We use end-to-end encryption for file transfers. Your files are processed securely and are automatically deleted from our servers permanently after 1 hour.",
                },
                {
                  q: "Do you have an API?",
                  a: "We are currently developing our developer API. You can use the contact form above to request early access.",
                },
                {
                  q: "Can I suggest a new feature?",
                  a: "We love feedback! Please email us at kuhulabs@zohomail.in with your ideas.",
                },
              ].map((faq, i) => (
                <Card key={i} className="border-none shadow-sm bg-muted/30">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-lg mb-2 flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-blue-500 mt-1 shrink-0" />
                      {faq.q}
                    </h4>
                    <p className="text-muted-foreground pl-8">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* 4. Company Info / Footer Note */}
          <section className="bg-slate-900 text-slate-300 rounded-3xl p-12 text-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-10"></div>

            <div className="relative z-10 flex flex-col items-center gap-6">
              <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center">
                <Globe className="w-8 h-8 text-blue-400" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Visit Us</h3>
                <p className="text-lg text-slate-400">
                  PDFo is built with ❤️ by{" "}
                  <span className="text-white font-semibold">Kuhu Labs</span>
                </p>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full text-sm font-medium">
                <MapPin className="w-4 h-4 text-red-400" />
                <span>Undel, Gujarat, India</span>
              </div>

              <div className="mt-4 pt-6 border-t border-slate-800 w-full max-w-md mx-auto">
                <p className="text-sm text-slate-500">
                  Email:{" "}
                  <a
                    href="mailto:kuhulabs@zohomail.in"
                    className="text-blue-400 hover:underline"
                  >
                    kuhulabs@zohomail.in
                  </a>
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
      <MainFooter />
    </div>
  );
}
