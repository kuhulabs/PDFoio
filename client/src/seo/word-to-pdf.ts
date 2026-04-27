// Auto-split from the original seo.ts so each tool page only loads its
// own SEO payload (5–15KB) instead of the full 128KB monolith.
export const wordToPdfSEO = {
    title: "Word to PDF Converter - Convert DOCX to PDF Online for Free | PDFo",
    h1: "Convert Word to PDF Online",

    metaDescription:
      "Convert Microsoft Word (DOC/DOCX) files to high-quality PDF format accurately. Preserves original formatting, fonts, and layouts. Fast, secure, and free.",

    shortIntro:
      "Make your Word documents universal and professional by converting them to PDF in one click.",

    intro:
      "The Word to PDF converter by PDFo is designed to ensure your documents look identical on every device. When you share a Word file, fonts and layouts can shift; our tool locks your formatting in by converting DOC and DOCX files to the industry-standard PDF format. Whether it's a resume, a formal report, or a creative project, we guarantee pixel-perfect layout preservation and high-fidelity output.",

    keywords: [
      "word to pdf converter online free",
      "convert docx to pdf",
      "word to pdf online",
      "doc to pdf converter",
      "microsoft word to pdf",
      "convert word document to pdf",
      "docx to pdf free",
      "word file to pdf",
    ],

    longTailKeywords: [
      "how to convert word to pdf online free",
      "convert word document to pdf without losing formatting",
      "word to pdf converter for resume",
      "convert docx to pdf on mobile",
      "word to pdf without microsoft office",
    ],

    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "PDFo Word to PDF Converter",
      description:
        "Free online Word to PDF converter to transform DOC and DOCX files into professional PDF documents.",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Web Browser",
      url: "https://pdfo.io/word-to-pdf",
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
        "Convert Word to PDF",
        "Preserve formatting",
        "Support DOC and DOCX",
        "Font preservation",
        "Fast conversion",
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
          name: "Word to PDF",
        },
      ],
    },

    featuredSnippet: {
      question: "How do I convert Word to PDF online?",
      steps: [
        "Upload your Word file (DOC or DOCX) to PDFo",
        "Wait for the conversion to process",
        "Download your PDF with preserved formatting",
        "Share or print your professional PDF document",
      ],
    },

    howItWorks: [
      "Upload your Microsoft Word file (.doc or .docx) from your device",
      "Our system processes the document, handling all fonts, images, and alignments",
      "Wait a few seconds for the high-fidelity conversion to finish",
      "Download your professional PDF document, ready for sharing or printing",
    ],

    benefits: [
      "Pixel-perfect layout retention—no shifted text or images",
      "Complete font preservation even for custom document styles",
      "Fastest conversion speed without the need for MS Office",
      "Secure SSL encrypted transfers with instant server deletion",
      "Works smoothly on desktop and mobile devices",
      "No account or email signup required",
    ],

    faqs: [
      {
        question: "Will my Word document formatting change after conversion?",
        answer:
          "No, our advanced converter is built to respect your margins, font styles, and image placements, ensuring the PDF looks exactly like your Word file.",
      },
      {
        question: "Does it support both .doc and .docx formats?",
        answer:
          "Yes, PDFo supports older Word formats (.doc) as well as the modern XML-based format (.docx).",
      },
      {
        question: "Is there a limit to the file size I can convert?",
        answer:
          "You can convert standard business and academic documents for free. Our engine handles large reports and manuscripts efficiently.",
      },
      {
        question: "Is my data safe when using PDFo?",
        answer:
          "Yes. All file transfers are protected with SSL encryption, and files are automatically deleted from our servers after processing.",
      },
    ],

    comparisons: [
      {
        question: "PDFo vs Microsoft Word's built-in PDF export",
        answer:
          "PDFo offers free online Word to PDF conversion without requiring Microsoft Office installation, while Word's export requires a licensed copy of MS Office.",
        lastUpdated: "2026-01-30",
      },
    ],

    relatedTools: [
      { key: "excel-to-pdf", name: "Excel to PDF", path: "/excel-to-pdf" },
      { key: "merge", name: "Merge PDF", path: "/merge" },
      { key: "pdf-to-word", name: "PDF to Word", path: "/pdf-to-word" },
    ],
  } as const;

export default wordToPdfSEO;
