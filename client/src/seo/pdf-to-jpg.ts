// Auto-split from the original seo.ts so each tool page only loads its
// own SEO payload (5–15KB) instead of the full 128KB monolith.
export const pdfToJpgSEO = {
    title: "PDF to JPG - Convert PDF Pages to High-Quality Images | PDFo",
    h1: "Convert PDF to JPG Online",

    metaDescription:
      "Easily convert every PDF page into a high-quality JPG image for free. Fast image extraction with high resolution. No signup or installation required.",

    shortIntro:
      "Transform your PDF document pages into high-resolution JPG images in just one click.",

    intro:
      "The PDF to JPG converter by PDFo is the fastest way to turn your document pages into visual content. Whether you need to share a document on social media, use a PDF page in a blog post, or extract high-quality photos from a report, our tool provides crystal-clear JPG outputs. We ensure every detail is preserved with high DPI resolution, making your documents web-ready instantly.",

    keywords: [
      "pdf to jpg converter online free",
      "convert pdf to jpeg",
      "pdf to jpg online",
      "pdf to image converter",
      "extract images from pdf",
      "pdf pages to jpg",
      "pdf to jpg high quality",
      "pdf to picture converter",
    ],

    longTailKeywords: [
      "how to convert pdf to jpg online free",
      "convert pdf pages to jpg images",
      "pdf to jpg converter without losing quality",
      "convert multi-page pdf to jpg",
      "pdf to jpg converter for mobile",
    ],

    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "PDFo PDF to JPG Converter",
      description:
        "Free online PDF to JPG converter to transform PDF pages into high-quality JPEG images.",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Web Browser",
      url: "https://pdfo.io/pdf-to-jpg",
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
        "Convert PDF to JPG",
        "High-resolution output",
        "Multi-page conversion",
        "ZIP download option",
        "Fast processing",
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
          name: "PDF to JPG",
        },
      ],
    },

    featuredSnippet: {
      question: "How do I convert PDF to JPG online?",
      steps: [
        "Upload your PDF file to PDFo",
        "Wait for the conversion to complete",
        "Download individual JPG images or as a ZIP file",
        "Use your images for web, social media, or presentations",
      ],
    },

    howItWorks: [
      "Upload the PDF document you wish to convert from your device",
      "Our system processes the document and converts each page into an individual JPG image",
      "Wait for the extraction to finish (usually takes only a few seconds)",
      "Download your images as individual files or as a single organized ZIP folder",
    ],

    benefits: [
      "High-resolution image output for sharp and clear visuals",
      "Lightning-fast extraction even for large, multi-page PDFs",
      "Secure and private—all images are deleted after 1 hour",
      "Completely free to use with no hidden watermarks",
      "Works smoothly on desktop and mobile devices",
      "No account or email signup required",
    ],

    faqs: [
      {
        question: "What is the quality of the output JPG images?",
        answer:
          "Our converter provides high-definition images that preserve the clarity of the original text and graphics from your PDF pages.",
      },
      {
        question: "Can I convert a multi-page PDF at once?",
        answer:
          "Yes, our tool converts every single page of your PDF into an individual JPG. You can download all of them together in a convenient ZIP file.",
      },
      {
        question: "Is there a limit to the number of pages I can convert?",
        answer:
          "You can convert standard documents for free. For extremely large books or files, our high-speed processor ensures the task is completed efficiently.",
      },
      {
        question: "Is my data safe when using PDFo?",
        answer:
          "Yes. All file transfers are protected with SSL encryption, and files are automatically deleted from our servers after processing.",
      },
    ],

    comparisons: [
      {
        question: "PDFo vs other PDF to JPG converters",
        answer:
          "PDFo offers free high-quality PDF to JPG conversion with no watermarks or file limits, while many tools add watermarks or require subscriptions.",
        lastUpdated: "2026-01-30",
      },
    ],

    relatedTools: [
      { key: "pdf-to-png", name: "PDF to PNG", path: "/pdf-to-png" },
      { key: "images-to-pdf", name: "Images to PDF", path: "/images-to-pdf" },
      { key: "pdf-to-tiff", name: "PDF to TIFF", path: "/pdf-to-tiff" },
    ],
  } as const;

export default pdfToJpgSEO;
