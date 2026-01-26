import { SEOHead } from "@/components/SEOHead";
import { ToolFooter } from "@/components/ToolFooter";

export default function PrivacyPolicy() {
  return (
    <>
      <SEOHead breadcrumbs={[{ name: "Home", url: window.location.origin }, { name: "Privacy Policy", url: `${window.location.origin}/privacy` }]} 
        title="Privacy Policy - PDFo"
        description="Privacy Policy for PDFo by Kuhu Labs. Learn how we handle your files and protect your data."
        keywords="privacy policy, pdf privacy, data protection, pdfo"
        canonicalUrl={`${window.location.origin}/privacy`}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
          Privacy Policy
        </h1>

        <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-300">
          {/* 1. Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              1. Introduction
            </h2>
            <p>
              Welcome to <strong>PDFo</strong>, a service provided by{" "}
              <strong>Kuhu Labs</strong>. Your privacy is important to us, and
              this Privacy Policy explains how we collect, use, and protect your
              information when you use our website and services.
            </p>
          </section>

          {/* 2. Information We Collect */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              2. Information We Collect
            </h2>

            <p>
              <strong>a) Uploaded Files</strong>
              <br />
              When you use our PDF tools, you may upload files for processing.
              These files are used only to provide the requested service.
            </p>

            <p>
              <strong>b) Contact Information</strong>
              <br />
              If you contact us (for example, via email or newsletter
              subscription), we may collect your email address and message
              content.
            </p>

            <p>
              <strong>c) Non-Personal Usage Data</strong>
              <br />
              We may collect limited, non-identifiable technical data such as
              browser type or device information to improve performance and
              reliability.
            </p>
          </section>

          {/* 3. How We Use Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              3. How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To process PDF files and deliver requested tools.</li>
              <li>To respond to support requests and user inquiries.</li>
              <li>To improve service performance and security.</li>
              <li>To communicate updates (only if you opt in).</li>
            </ul>
          </section>

          {/* 4. File Processing & Deletion */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              4. File Processing & Deletion
            </h2>
            <p>
              Uploaded files are processed temporarily on our systems to provide
              the requested functionality.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Files are automatically deleted after processing.</li>
              <li>We do not permanently store uploaded documents.</li>
              <li>We do not manually access or review your files.</li>
            </ul>
          </section>

          {/* 5. File Size Limits */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              5. File Upload Limits
            </h2>
            <p>
              To ensure platform stability and fair usage, the maximum allowed
              upload size is <strong>25 MB per file</strong>. Files exceeding
              this limit may not be processed.
            </p>
          </section>

          {/* 6. Data Security */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              6. Data Security
            </h2>
            <p>
              We take reasonable technical and organizational measures to
              protect your data. However, no online service can guarantee
              absolute security.
            </p>
          </section>

          {/* 7. Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              7. Cookies & Tracking
            </h2>
            <p>
              PDFo may use minimal cookies or similar technologies for basic
              functionality and performance monitoring. We do not use cookies
              for targeted advertising.
            </p>
          </section>

          {/* 8. Children */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              8. Children’s Privacy
            </h2>
            <p>
              PDFo is not intended for children under the age of 13, and we do
              not knowingly collect personal data from children.
            </p>
          </section>

          {/* 9. Changes */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              9. Changes to This Privacy Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will
              be effective immediately upon posting on this page.
            </p>
          </section>

          {/* 10. Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              10. Contact Us
            </h2>
            <p>
              If you have any questions or concerns about this Privacy Policy,
              please contact us at:
            </p>
            <p>
              📧 <strong>kuhulabs@zohomail.in</strong>
            </p>
          </section>
        </div>
      </div>

      <ToolFooter />
    </>
  );
}
