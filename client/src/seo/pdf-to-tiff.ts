// Auto-split from the original seo.ts so each tool page only loads its
// own SEO payload (5–15KB) instead of the full 128KB monolith.
export const pdfToTiffSEO = {
    title: "PDF to TIFF Converter - Convert PDF to TIFF Online for Free | PDFo",
    h1: "Convert PDF to TIFF Online",

    metaDescription:
      "Convert your PDF files to high-quality TIFF image format for professional printing, faxing, and long-term archiving. Fast, secure, and free online tool.",

    shortIntro:
      "Generate professional-grade TIFF images from your PDF documents for high-end printing and archiving.",

    intro:
      "The PDF to TIFF converter by PDFo is built for industries that require high-fidelity raster images, such as legal, medical, and publishing. TIFF files are the gold standard for high-quality printing and long-term digital archiving because they preserve every detail without compression artifacts. Our tool ensures your document's fonts, graphics, and layouts are perfectly rendered into high-resolution TIFF files.",

    keywords: [
      "pdf to tiff converter online free",
      "convert pdf to tiff",
      "pdf to tiff online",
      "pdf to tif converter",
      "pdf to tiff archival quality",
      "pdf pages to tiff",
      "pdf to tiff for printing",
      "lossless pdf to tiff",
    ],

    longTailKeywords: [
      "how to convert pdf to tiff online free",
      "convert pdf to tiff for legal archiving",
      "pdf to tiff converter for professional printing",
      "convert scanned pdf to tiff",
      "pdf to tiff high resolution",
    ],

    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "PDFo PDF to TIFF Converter",
      description:
        "Free online PDF to TIFF converter for professional archiving and high-quality printing.",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Web Browser",
      url: "https://pdfo.io/pdf-to-tiff",
      publisher: {
        "@type": "Organization",
        name: "PDFo",
        url: "https://pdfo.io",
      },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: [
        "Convert PDF to TIFF",
        "Archival quality output",
        "High-resolution rendering",
        "Professional printing support",
        "Legal compliance ready",
      ],
    },

    breadcrumb: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://pdfo.io",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "PDF Tools",
          item: "https://pdfo.io/tools",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "PDF to TIFF",
        },
      ],
    },

    featuredSnippet: {
      question: "How do I convert PDF to TIFF online?",
      steps: [
        "Upload your PDF file to PDFo",
        "Wait for high-resolution TIFF conversion",
        "Download TIFF images individually or as a ZIP file",
        "Use for professional printing or legal archiving",
      ],
    },

    howItWorks: [
      "Upload your PDF document to our secure conversion platform",
      "Our system processes each page into a high-depth TIFF image format",
      "Wait for the conversion to finalize in your browser",
      "Download your archival-quality TIFF images as a single file or a ZIP folder",
    ],

    benefits: [
      "Lossless archival quality suitable for professional storage",
      "High-resolution rendering for sharp industrial printing",
      "Compatible with all major professional imaging software",
      "Secure SSL encrypted transfers with instant server deletion",
      "Works smoothly on desktop and mobile devices",
      "No account or email signup required",
    ],

    faqs: [
      {
        question: "Why should I convert PDF to TIFF instead of JPG?",
        answer:
          "TIFF is a lossless format often required for legal archiving and high-end commercial printing where every pixel counts. Unlike JPG, TIFF does not lose quality through compression.",
      },
      {
        question: "Does the TIFF file support multiple pages?",
        answer:
          "Our tool converts each PDF page into a high-quality TIFF. You can download them as a collection of images that maintain the sequence of your original document.",
      },
      {
        question: "Is this tool suitable for scanned legal documents?",
        answer:
          "Yes, PDF to TIFF is frequently used to prepare documents for e-filing and legal databases that require specific image formats for compliance.",
      },
      {
        question: "Is my data safe when using PDFo?",
        answer:
          "Yes. All file transfers are protected with SSL encryption, and files are automatically deleted from our servers after processing.",
      },
    ],

    comparisons: [
      {
        question: "PDFo vs other PDF to TIFF converters",
        answer:
          "PDFo offers free archival-quality PDF to TIFF conversion suitable for legal and professional use, while many tools compromise quality or require expensive licenses.",
        lastUpdated: "2026-01-30",
      },
    ],

    relatedTools: [
      { key: "pdf-to-png", name: "PDF to PNG", path: "/pdf-to-png" },
      { key: "pdf-to-jpg", name: "PDF to JPG", path: "/pdf-to-jpg" },
      { key: "pdf-to-word", name: "PDF to Word", path: "/pdf-to-word" },
    ],
  } as const;

export default pdfToTiffSEO;
