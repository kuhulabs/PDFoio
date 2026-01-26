import { SEOHead } from "@/components/SEOHead";
import { ToolFooter } from "@/components/ToolFooter";

export default function TermsOfUse() {
  return (
    <>
      <SEOHead breadcrumbs={[{ name: "Home", url: window.location.origin }, { name: "Terms of Use", url: `${window.location.origin}/terms` }]} 
        title="Terms of Use - PDFo"
        description="Terms of Use for PDFo by Kuhu Labs. Please read these terms carefully before using our PDF tools."
        keywords="terms of use, terms and conditions, pdfo legal"
        canonicalUrl={`${window.location.origin}/terms`}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
          Terms of Use
        </h1>

        <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-300">

          {/* 1. Agreement */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              1. Agreement to Terms
            </h2>
            <p>
              By accessing or using <strong>PDFo</strong>, operated by{" "}
              <strong>Kuhu Labs</strong>, you agree to be bound by these Terms of Use.
              If you do not agree with these terms, you must discontinue use of the service.
            </p>
          </section>

          {/* 2. Services */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              2. Use of Services
            </h2>
            <p>
              PDFo provides online tools for working with PDF documents, including
              merging, splitting, converting, compressing, and securing PDF files.
              All services are provided online and may be updated or changed at any time.
            </p>
          </section>

          {/* 3. Upload limits */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              3. File Upload Limits
            </h2>
            <p>
              To ensure fair usage, performance, and platform security:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The maximum allowed upload size is <strong>25 MB per file</strong>.</li>
              <li>Files exceeding this limit may not upload or process correctly.</li>
              <li>Attempting to bypass upload limits may result in restricted access.</li>
            </ul>
          </section>

          {/* 4. User responsibilities */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              4. User Responsibilities
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You confirm that you own or have legal rights to the files you upload.</li>
              <li>You must not upload illegal, copyrighted, or malicious content.</li>
              <li>You agree not to misuse, abuse, or attempt to disrupt the service.</li>
            </ul>
          </section>

          {/* 5. File processing */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              5. File Processing & Deletion
            </h2>
            <p>
              Uploaded files are processed temporarily to provide the requested functionality.
              Files are automatically deleted after processing. PDFo does not permanently
              store uploaded documents and does not manually access user files.
            </p>
          </section>

          {/* 6. Disclaimer */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              6. Disclaimer of Warranties
            </h2>
            <p>
              PDFo is provided on an <strong>“as is”</strong> and{" "}
              <strong>“as available”</strong> basis. We make no warranties regarding
              availability, accuracy, or reliability of the services.
            </p>
          </section>

          {/* 7. Liability */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              7. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by law, PDFo and Kuhu Labs shall not be
              liable for any indirect, incidental, or consequential damages, including
              loss of data or files. Use of the service is at your own risk.
            </p>
          </section>

          {/* 8. Prohibited use */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              8. Prohibited Activities
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Reverse engineering or attempting to exploit the service.</li>
              <li>Using automated systems to overload or scrape the website.</li>
              <li>Uploading malware, viruses, or harmful scripts.</li>
            </ul>
          </section>

          {/* 9. Changes */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              9. Changes to These Terms
            </h2>
            <p>
              We may update these Terms of Use from time to time. Continued use of
              PDFo after changes means you accept the updated terms.
            </p>
          </section>

          {/* 10. Law */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              10. Governing Law
            </h2>
            <p>
              These Terms of Use are governed by and construed in accordance with
              the laws of <strong>India</strong>.
            </p>
          </section>

          {/* 11. Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              11. Contact Information
            </h2>
            <p>
              If you have any questions about these Terms of Use, please contact us:
            </p>
            <p>📧 <strong>kuhulabs@zohomail.in</strong></p>
          </section>

        </div>
      </div>

      <ToolFooter />
    </>
  );
}
