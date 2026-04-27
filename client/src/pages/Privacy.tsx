import { SITE_URL } from "@/lib/site";
import { SEOHead } from "@/components/SEOHead";
import { MainFooter } from "@/components/MainFooter";

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 pb-12">
        <SEOHead 
          title="Privacy Policy | PDFo"
          description="Privacy Policy for PDFo - Your privacy is our priority."
          canonicalUrl={`${SITE_URL}/privacy`}
          keywords="pdfo privacy policy, pdf privacy, secure file processing"
          breadcrumbs={[
            { name: "Home", url: SITE_URL },
            { name: "Privacy", url: `${SITE_URL}/privacy` },
          ]}
        />
        
        <div className="container px-4 mx-auto py-12 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          
          <section className="space-y-6 text-muted-foreground">
            <p>
              At PDFo, we take your privacy seriously. This policy describes how we handle your 
              information when you use our website and services.
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Information We Collect</h2>
              <div className="space-y-4">
                <p>
                  <strong>a) Uploaded Files:</strong> When you use our PDF tools, you may upload files for processing. 
                  These files are processed on our secure servers and are automatically deleted after 1 hour. 
                  We do not read or store your file content beyond the processing period.
                </p>
                <p>
                  <strong>b) Usage Data:</strong> We may collect anonymous usage statistics to improve our service, 
                  such as which tools are used most frequently.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Data Security</h2>
              <p>
                We use industry-standard encryption to protect your data during transfer and processing. 
                Your files are handled with the utmost care and are never shared with third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Cookies</h2>
              <p>
                We use minimal cookies to ensure the website functions correctly and to remember your preferences 
                (like light/dark mode).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Contact Us</h2>
              <p>
                If you have any questions about our privacy practices, please contact us at kuhulabs@zohomail.in.
              </p>
            </section>
          </section>
        </div>
      </div>
      <MainFooter />
    </div>
  );
}
