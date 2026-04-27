// Auto-split from the original seo.ts so each tool page only loads its
// own SEO payload (5–15KB) instead of the full 128KB monolith.
export const pdfToWordSEO = {
    title: "PDF to Word Converter - Convert PDF to Editable DOCX Online | PDFo",
    h1: "Convert PDF to Word Online",

    metaDescription:
      "Easily convert PDF to editable Word (DOCX) files with high accuracy. Our OCR technology preserves your original layout and formatting for free. No signup needed.",

    shortIntro:
      "Transform your PDF documents into fully editable Microsoft Word files in seconds.",

    intro:
      "Our PDF to Word converter uses advanced AI-driven layout reconstruction to ensure that your DOCX file looks exactly like your original PDF. Unlike basic converters, PDFo preserves your tables, columns, and font styles, making it effortless to edit your content. With integrated OCR (Optical Character Recognition), even scanned PDFs can be converted into selectable and editable text documents.",

    keywords: [
      "pdf to word converter online free",
      "convert pdf to docx",
      "pdf to word online",
      "pdf to editable word",
      "pdf to doc converter",
      "convert pdf to microsoft word",
      "pdf to word with ocr",
      "pdf to word free",
    ],

    longTailKeywords: [
      "how to convert pdf to word online free",
      "convert scanned pdf to editable word",
      "pdf to word converter without losing formatting",
      "convert pdf to word on mobile",
      "pdf to docx converter free online",
    ],

    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "PDFo PDF to Word Converter",
      description:
        "Free online PDF to Word converter with OCR technology to convert PDF files to editable DOCX documents.",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Web Browser",
      url: "https://pdfo.io/pdf-to-word",
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
        "Convert PDF to DOCX",
        "OCR for scanned PDFs",
        "Layout preservation",
        "Table structure retention",
        "Batch conversion support",
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
          name: "PDF to Word",
        },
      ],
    },

    featuredSnippet: {
      question: "How do I convert PDF to Word online?",
      steps: [
        "Upload your PDF file to PDFo",
        "Wait for OCR and layout analysis to complete",
        "Click 'Download' to get your editable DOCX file",
        "Open in Microsoft Word or Google Docs to edit",
      ],
    },

    howItWorks: [
      "Upload the PDF document you want to convert from your computer or mobile",
      "Our system analyzes the structure and uses OCR to extract the text and images",
      "Wait a few seconds for the 'Conversion Complete' status to appear",
      "Download your high-quality, fully editable Microsoft Word (DOCX) document",
    ],

    benefits: [
      "Industry-leading layout and table structure preservation",
      "Converts scanned PDFs into editable text using OCR technology",
      "No registration or email required for instant conversion",
      "100% secure processing with automatic file deletion",
      "Works smoothly on desktop and mobile devices",
      "No account or email signup required",
    ],

    faqs: [
      {
        question: "Can I edit the Word document after conversion?",
        answer:
          "Yes, the resulting DOCX file is fully editable in Microsoft Word, Google Docs, and LibreOffice, allowing you to change text, images, and formatting.",
      },
      {
        question: "Does this work for scanned PDF documents?",
        answer:
          "Absolutely. Our converter includes OCR technology that recognizes text within images and scans, turning them into editable characters.",
      },
      {
        question: "Is my original document formatting kept intact?",
        answer:
          "We use smart layout detection to ensure that your fonts, alignments, and tables stay as close to the original as possible.",
      },
      {
        question: "Is my data safe when using PDFo?",
        answer:
          "Yes. All file transfers are protected with SSL encryption, and files are automatically deleted from our servers after processing.",
      },
    ],

    comparisons: [
      {
        question: "PDFo vs paid PDF to Word converters",
        answer:
          "PDFo offers free PDF to Word conversion with OCR and layout preservation, while many tools require expensive subscriptions for similar features.",
        lastUpdated: "2026-01-30",
      },
    ],

    relatedTools: [
      { key: "pdf-to-excel", name: "PDF to Excel", path: "/pdf-to-excel" },
      { key: "pdf-to-jpg", name: "PDF to JPG", path: "/pdf-to-jpg" },
      { key: "word-to-pdf", name: "Word to PDF", path: "/word-to-pdf" },
    ],
  } as const;

export default pdfToWordSEO;
