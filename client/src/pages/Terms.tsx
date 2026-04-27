import { SITE_URL } from "@/lib/site";
import { SEOHead } from "@/components/SEOHead";
import { MainFooter } from "@/components/MainFooter";
import { Card, CardContent } from "@/components/ui/card";
import {
  Scale,
  FileText,
  UploadCloud,
  UserCheck,
  AlertTriangle,
  ShieldAlert,
  Gavel,
  Mail,
  Check,
} from "lucide-react";

export default function TermsOfUse() {
  const lastUpdated = "January 26, 2026";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        breadcrumbs={[
          { name: "Home", url: SITE_URL },
          { name: "Terms of Use", url: `${SITE_URL}/terms` },
        ]}
        title="Terms of Use - PDFo"
        description="Read the Terms of Use for PDFo. Understanding your rights and responsibilities when using our PDF tools."
        canonicalUrl={`${SITE_URL}/terms`}
      />

      {/* Hero Section */}
      <div className="bg-slate-50 dark:bg-slate-900/50 border-b py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-6">
            <Scale className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
            Terms of Use
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Please read these terms carefully before using PDFo. They govern
            your access and use of our services.
          </p>
          <p className="text-sm text-muted-foreground mt-4 font-medium">
            Last Updated: {lastUpdated}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 flex-1">
        <div className="prose dark:prose-invert max-w-none space-y-12">
          {/* 1. Agreement */}
          <section>
            <h2 className="flex items-center gap-3 text-2xl font-bold mb-4">
              <FileText className="w-6 h-6 text-primary" />
              1. Agreement to Terms
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using <strong>PDFo</strong>, a service operated by{" "}
              <strong>Kuhu Labs</strong> ("we," "us," or "our"), you agree to be
              bound by these Terms of Use. If you do not agree to these terms,
              you must not access or use our services.
            </p>
          </section>

          {/* 2. Services & Limits */}
          <section>
            <h2 className="flex items-center gap-3 text-2xl font-bold mb-4">
              <UploadCloud className="w-6 h-6 text-primary" />
              2. Services & Usage Limits
            </h2>
            <p className="text-muted-foreground mb-4">
              PDFo provides online tools to manipulate PDF documents (merge,
              split, compress, convert). To ensure fair usage and stability for
              all users:
            </p>
            <ul className="grid sm:grid-cols-2 gap-4 list-none pl-0">
              <li className="flex items-center gap-3 bg-card border p-3 rounded-lg">
                <Check className="w-5 h-5 text-green-500" />
                <span>
                  Max file size: <strong>25 MB</strong>
                </span>
              </li>
              <li className="flex items-center gap-3 bg-card border p-3 rounded-lg">
                <Check className="w-5 h-5 text-green-500" />
                <span>Files auto-deleted after 1 hour</span>
              </li>
              <li className="flex items-center gap-3 bg-card border p-3 rounded-lg">
                <Check className="w-5 h-5 text-green-500" />
                <span>Free for personal & commercial use</span>
              </li>
              <li className="flex items-center gap-3 bg-card border p-3 rounded-lg">
                <Check className="w-5 h-5 text-green-500" />
                <span>No account required</span>
              </li>
            </ul>
          </section>

          {/* 3. User Responsibilities */}
          <section>
            <h2 className="flex items-center gap-3 text-2xl font-bold mb-4">
              <UserCheck className="w-6 h-6 text-primary" />
              3. User Responsibilities
            </h2>
            <p className="text-muted-foreground mb-4">
              You are solely responsible for the content of the files you
              upload. By using PDFo, you confirm that:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                You own the copyright or have the necessary permissions to use
                and edit the files.
              </li>
              <li>
                You will not upload files containing illegal, harmful, or
                malicious content (viruses, malware).
              </li>
              <li>You will not use the service for any unlawful purpose.</li>
            </ul>
          </section>

          {/* 4. Prohibited Activities */}
          <section>
            <h2 className="flex items-center gap-3 text-2xl font-bold mb-4">
              <AlertTriangle className="w-6 h-6 text-primary" />
              4. Prohibited Activities
            </h2>
            <Card className="border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-900/10">
              <CardContent className="p-6">
                <p className="mb-4 font-medium text-red-900 dark:text-red-200">
                  You engage in the following activities is strictly prohibited:
                </p>
                <ul className="space-y-2 text-sm text-red-800 dark:text-red-300">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                    Attempting to reverse engineer, decompile, or extract source
                    code from PDFo.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                    Using automated scripts, bots, or scrapers to access the
                    service without permission.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                    Overloading our infrastructure (DDoS attacks or spamming
                    uploads).
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* 5. Disclaimer & Liability */}
          <section>
            <h2 className="flex items-center gap-3 text-2xl font-bold mb-4">
              <ShieldAlert className="w-6 h-6 text-primary" />
              5. Disclaimer & Limitation of Liability
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The services are provided on an "AS IS" and "AS AVAILABLE" basis.{" "}
              <strong>Kuhu Labs</strong> makes no warranties regarding the
              accuracy, reliability, or availability of the service.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              To the maximum extent permitted by law, we shall not be liable for
              any indirect, incidental, or consequential damages, including loss
              of data or profits, arising out of your use of the service.
            </p>
          </section>

          {/* 6. Governing Law */}
          <section>
            <h2 className="flex items-center gap-3 text-2xl font-bold mb-4">
              <Gavel className="w-6 h-6 text-primary" />
              6. Governing Law
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms shall be governed by and defined following the laws of{" "}
              <strong>India</strong>. Any disputes related to these terms shall
              be subject to the exclusive jurisdiction of the courts in India.
            </p>
          </section>

          {/* 7. Contact */}
          <section>
            <h2 className="flex items-center gap-3 text-2xl font-bold mb-4">
              <Mail className="w-6 h-6 text-primary" />
              7. Contact Us
            </h2>
            <div className="bg-muted/50 p-6 rounded-xl border flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground mb-1">
                  For legal inquiries regarding these terms:
                </p>
                <a
                  href="mailto:kuhulabs@zohomail.in"
                  className="text-lg font-semibold text-primary hover:underline"
                >
                  kuhulabs@zohomail.in
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>

      <MainFooter />
    </div>
  );
}
