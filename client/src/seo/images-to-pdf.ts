// Auto-split from the original seo.ts so each tool page only loads its
// own SEO payload (5–15KB) instead of the full 128KB monolith.
export const imagesToPdfSEO = {
    title: "Images to PDF - Convert JPG, PNG & Photos to PDF Online | PDFo",
    h1: "Convert Images to PDF Online",

    metaDescription:
      "Convert your JPG, PNG, and other images into a single PDF document. Fast, free, and 100% secure image to PDF converter. Use from any device.",

    shortIntro:
      "Transform multiple photos into one professional PDF without losing quality.",

    intro:
      "PDFo's Images to PDF tool supports all major formats including JPG, PNG, TIFF, and BMP. Whether you need to convert college notes photos into an assignment or scanned receipts into a report, our tool does the job in seconds. It's mobile-friendly, so you can select photos directly from your phone and create PDFs.",

    keywords: [
      "images to pdf converter online free",
      "convert jpg to pdf",
      "convert photos to pdf",
      "image to pdf online",
      "multiple images to pdf",
      "jpg png to pdf",
      "photo to pdf converter",
      "pictures to pdf free",
    ],

    longTailKeywords: [
      "how to convert multiple images to pdf online free",
      "convert jpg and png to one pdf",
      "image to pdf converter for mobile",
      "convert photos to pdf without losing quality",
      "batch image to pdf converter",
    ],

    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "PDFo Images to PDF Converter",
      description:
        "Free online tool to convert JPG, PNG, TIFF, and BMP images into professional PDF documents.",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Web Browser",
      url: "https://pdfo.io/images-to-pdf",
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
        "Convert images to PDF",
        "Multi-format support",
        "Batch conversion",
        "High resolution output",
        "Mobile-friendly",
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
          name: "Images to PDF",
        },
      ],
    },

    featuredSnippet: {
      question: "How do I convert images to PDF online?",
      steps: [
        "Upload your images (JPG, PNG, etc.) to PDFo",
        "Drag thumbnails to arrange them in the correct sequence",
        "Adjust page size, orientation, and margins",
        "Click 'Convert to PDF' and download your file",
      ],
    },

    howItWorks: [
      "Upload your images (JPG, PNG, etc.)",
      "Drag thumbnails to set the correct sequence",
      "Adjust page size, orientation (Portrait/Landscape), and margins",
      "Click 'Convert to PDF' and download your file",
    ],

    benefits: [
      "Multi-format support: Combine JPG and PNG files together",
      "Batch conversion: Merge unlimited images into one document",
      "Privacy first: Your files are automatically deleted 1 hour after upload",
      "High resolution: Images maintain their original quality and clarity",
      "Works smoothly on desktop and mobile devices",
      "No account or email signup required",
    ],

    faqs: [
      {
        question: "Can I combine different image formats into one PDF?",
        answer:
          "Yes! You can upload JPG, PNG, and TIFF files together and merge them into a single PDF document.",
      },
      {
        question: "Will the image quality decrease after conversion?",
        answer:
          "Not at all. Our advanced engine keeps images pixel-perfect so your PDF looks professional and clear.",
      },
      {
        question: "How do I convert photos to PDF from mobile?",
        answer:
          "Simply open PDFo in your phone's browser, select photos from your gallery, and press the convert button. The process is fast and easy.",
      },
      {
        question: "Is my data safe when using PDFo?",
        answer:
          "Yes. All file transfers are protected with SSL encryption, and files are automatically deleted from our servers after processing.",
      },
    ],

    comparisons: [
      {
        question: "PDFo vs other image to PDF converters",
        answer:
          "PDFo offers free unlimited image to PDF conversion with multi-format support and no watermarks, while many tools limit the number of files or add branding.",
        lastUpdated: "2026-01-30",
      },
    ],

    relatedTools: [
      { key: "png-to-pdf", name: "PNG to PDF", path: "/png-to-pdf" },
      { key: "merge", name: "Merge PDF", path: "/merge" },
      { key: "compress", name: "Compress PDF", path: "/compress" },
    ],
  } as const;

export default imagesToPdfSEO;
