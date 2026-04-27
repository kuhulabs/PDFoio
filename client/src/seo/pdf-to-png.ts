// Auto-split from the original seo.ts so each tool page only loads its
// own SEO payload (5–15KB) instead of the full 128KB monolith.
export const pdfToPngSEO = {
    title: "PDF to PNG - Convert PDF to PNG Online for Free | PDFo",
    h1: "Convert PDF to PNG Online",

    metaDescription:
      "Convert PDF pages to high-quality PNG images with transparency support. Lossless image conversion for free. Fast, secure, and no installation needed.",

    shortIntro:
      "Transform your PDF pages into lossless, high-quality PNG images with one click.",

    intro:
      "The PDF to PNG converter by PDFo is the ideal choice for designers and professionals who need high-fidelity image extraction. Unlike other formats, PNG offers lossless compression and supports transparency, ensuring that your document graphics, logos, and charts remain perfectly sharp. Our tool handles everything in the browser, providing you with high-resolution images ready for web development or graphic design.",

    keywords: [
      "pdf to png converter online free",
      "convert pdf to png",
      "pdf to png online",
      "pdf to png with transparency",
      "lossless pdf to png",
      "pdf pages to png",
      "pdf to png high quality",
      "pdf to transparent png",
    ],

    longTailKeywords: [
      "how to convert pdf to png online free",
      "convert pdf to png with transparent background",
      "pdf to png converter without losing quality",
      "convert multi-page pdf to png",
      "pdf to png for graphic design",
    ],

    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "PDFo PDF to PNG Converter",
      description:
        "Free online PDF to PNG converter with transparency support for lossless image conversion.",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Web Browser",
      url: "https://pdfo.io/pdf-to-png",
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
        "Convert PDF to PNG",
        "Lossless quality",
        "Transparency support",
        "High-resolution output",
        "Batch conversion",
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
          name: "PDF to PNG",
        },
      ],
    },

    featuredSnippet: {
      question: "How do I convert PDF to PNG online?",
      steps: [
        "Upload your PDF file to PDFo",
        "Wait for the lossless conversion to complete",
        "Download PNG images individually or as a ZIP file",
        "Use your transparent PNG images for design projects",
      ],
    },

    howItWorks: [
      "Upload your PDF file to our secure conversion platform",
      "Our tool processes each page to extract them into high-quality PNG format",
      "Preview the converted images once the process is complete",
      "Download your PNG files individually or as a single organized ZIP archive",
    ],

    benefits: [
      "Lossless quality conversion—no blur or pixelation",
      "Support for transparent backgrounds (ideal for logos and icons)",
      "Lightning-fast processing directly in your web browser",
      "Secure SSL encrypted transfers with automatic file deletion",
      "Works smoothly on desktop and mobile devices",
      "No account or email signup required",
    ],

    faqs: [
      {
        question: "Why should I choose PNG over JPG for my PDF images?",
        answer:
          "PNG is a lossless format, meaning it doesn't lose quality every time it is saved. It also supports transparency, which is essential if you want to use PDF elements in design projects.",
      },
      {
        question: "Does the converter handle transparent backgrounds?",
        answer:
          "Yes, if your PDF has a transparent background, our converter will preserve that transparency in the resulting PNG files.",
      },
      {
        question: "Is there a limit to how many pages I can convert to PNG?",
        answer:
          "You can convert standard PDF documents for free. Every page will be turned into a separate high-resolution PNG image.",
      },
      {
        question: "Is my data safe when using PDFo?",
        answer:
          "Yes. All file transfers are protected with SSL encryption, and files are automatically deleted from our servers after processing.",
      },
    ],

    comparisons: [
      {
        question: "PDFo vs other PDF to PNG converters",
        answer:
          "PDFo offers free lossless PDF to PNG conversion with transparency support and no watermarks, while many tools compromise quality or require subscriptions.",
        lastUpdated: "2026-01-30",
      },
    ],

    relatedTools: [
      { key: "pdf-to-jpg", name: "PDF to JPG", path: "/pdf-to-jpg" },
      { key: "images-to-pdf", name: "Images to PDF", path: "/images-to-pdf" },
      { key: "pdf-to-tiff", name: "PDF to TIFF", path: "/pdf-to-tiff" },
    ],
  } as const;

export default pdfToPngSEO;
