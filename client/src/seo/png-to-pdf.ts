// Auto-split from the original seo.ts so each tool page only loads its
// own SEO payload (5–15KB) instead of the full 128KB monolith.
export const pngToPdfSEO = {
    title: "PNG to PDF - Convert PNG Images to PDF Online for Free | PDFo",
    h1: "Convert PNG to PDF Online",

    metaDescription:
      "Convert PNG images to PDF without losing quality. Supports transparency and batch conversion to merge multiple PNGs into one document. Fast and secure.",

    shortIntro:
      "Transform your PNG photos and designs into high-quality professional PDF documents.",

    intro:
      "PNG format is known for its lossless quality and transparency support. PDFo's PNG to PDF converter ensures that your designs, logos, or screenshots maintain their clarity even after conversion to PDF. You can upload multiple PNG files, reorder them, and save them into a single organized PDF file.",

    keywords: [
      "png to pdf converter online free",
      "convert png to pdf",
      "png to pdf online",
      "png image to pdf",
      "png to pdf with transparency",
      "batch png to pdf",
      "multiple png to pdf",
      "png to pdf free",
    ],

    longTailKeywords: [
      "how to convert png to pdf online free",
      "convert multiple png images to one pdf",
      "png to pdf converter without losing quality",
      "convert png to pdf on mobile",
      "png to pdf with transparent background",
    ],

    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "PDFo PNG to PDF Converter",
      description:
        "Free online PNG to PDF converter with transparency support and batch conversion capabilities.",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Web Browser",
      url: "https://pdfo.io/png-to-pdf",
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
        "Convert PNG to PDF",
        "Lossless quality",
        "Transparency support",
        "Batch conversion",
        "Drag and drop reordering",
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
          name: "PNG to PDF",
        },
      ],
    },

    featuredSnippet: {
      question: "How do I convert PNG to PDF online?",
      steps: [
        "Upload your PNG images to PDFo",
        "Reorder images using drag and drop if needed",
        "Set page orientation and margins",
        "Click 'Convert' and download your PDF",
      ],
    },

    howItWorks: [
      "Upload your PNG images",
      "Reorder images as needed using drag and drop",
      "Set page orientation and margins",
      "Click the 'Convert' button and download your PDF",
    ],

    benefits: [
      "Lossless conversion: Preserves PNG's original clarity and pixels",
      "Transparency support: Cleanly handles transparent backgrounds",
      "Batch processing: Merge multiple images into one PDF",
      "Fast & private: Browser-based conversion that's 100% secure",
      "Works smoothly on desktop and mobile devices",
      "No account or email signup required",
    ],

    faqs: [
      {
        question: "Is PNG to PDF conversion free?",
        answer:
          "Yes, you can convert as many PNG images to PDF as you want completely free on PDFo.",
      },
      {
        question: "Will my transparent PNG images lose their background?",
        answer:
          "No, our tool supports transparency. The background will appear clean and professional in the PDF.",
      },
      {
        question: "How many PNG images can I upload at once?",
        answer:
          "You can upload multiple images at once and bundle them into a single document. This is perfect for creating portfolios.",
      },
      {
        question: "Is my data safe when using PDFo?",
        answer:
          "Yes. All file transfers are protected with SSL encryption, and files are automatically deleted from our servers after processing.",
      },
    ],

    comparisons: [
      {
        question: "PDFo vs other PNG to PDF converters",
        answer:
          "PDFo offers free PNG to PDF conversion with transparency support and unlimited batch conversion, while many tools add watermarks or limit the number of files.",
        lastUpdated: "2026-01-30",
      },
    ],

    relatedTools: [
      { key: "images-to-pdf", name: "Images to PDF", path: "/images-to-pdf" },
      { key: "pdf-to-png", name: "PDF to PNG", path: "/pdf-to-png" },
      { key: "merge", name: "Merge PDF", path: "/merge" },
    ],
  } as const;

export default pngToPdfSEO;
