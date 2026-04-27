// Auto-split from the original seo.ts so each tool page only loads its
// own SEO payload (5–15KB) instead of the full 128KB monolith.
export const pageNumbersSEO = {
    title: "Add Page Numbers to PDF - Number PDF Pages Online for Free | PDFo",
    h1: "Add PDF Page Numbers Online",

    metaDescription:
      "Add sequential page numbers to your PDF easily. Customize position, font style, and starting number. Professional PDF pagination tool for free.",

    shortIntro:
      "Professionally number your PDF pages with fully customizable positions, fonts, and styles.",

    intro:
      "The Add Page Numbers tool by PDFo helps you organize long documents, thesis papers, or legal files by adding clear, sequential numbering. Our flexible interface allows you to choose exactly where the numbers appear—top or bottom, left, right, or center—and customize the font to match your document's existing style. It's the simplest way to prepare documents for printing or professional submission.",

    keywords: [
      "add page numbers to pdf",
      "number pdf pages online",
      "pdf page numbering tool",
      "add page numbers pdf free",
      "insert page numbers in pdf",
      "pdf pagination online",
      "number pdf pages automatically",
      "add footer page numbers pdf",
    ],

    longTailKeywords: [
      "how to add page numbers to pdf online",
      "add custom page numbers to pdf free",
      "insert page numbers in pdf header footer",
      "add sequential page numbers to pdf",
      "number pdf pages starting from specific page",
    ],

    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "PDFo Add Page Numbers",
      description:
        "Free online tool to add customizable page numbers to PDF documents with full control over position, font, and style.",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Web Browser",
      url: "https://pdfo.io/page-numbers",
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
        "Customizable page number position",
        "Multiple font styles and sizes",
        "Header and footer placement",
        "Skip cover page option",
        "Batch numbering support",
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
          name: "Add Page Numbers",
        },
      ],
    },

    featuredSnippet: {
      question: "How do I add page numbers to a PDF online?",
      steps: [
        "Upload your PDF file to PDFo",
        "Select position (header/footer) and alignment (left/center/right)",
        "Choose font style, size, and starting page number",
        "Click 'Add Page Numbers' and download your numbered PDF",
      ],
    },

    howItWorks: [
      "Upload your PDF document from your device or cloud storage",
      "Select your preferred position (Header or Footer) and alignment (Left, Center, Right)",
      "Choose your font style, size, and define your starting page number",
      "Click 'Add Page Numbers' and download your perfectly numbered PDF file",
    ],

    benefits: [
      "Full control over font, size, and color to match your document",
      "Multiple positioning options including headers and footers",
      "Gives large documents a professional, academic, or legal look",
      "Supports batch numbering for high-speed document processing",
      "Works smoothly on desktop and mobile devices",
      "No account or email signup required",
    ],

    faqs: [
      {
        question: "Can I choose which page to start numbering from?",
        answer:
          "Yes, you can specify the starting number and also choose to skip the first page (like a cover page) if needed.",
      },
      {
        question: "Does this tool work with landscape and portrait pages?",
        answer:
          "Absolutely. Our tool intelligently detects page orientation and places the numbers consistently throughout the document.",
      },
      {
        question: "Will the page numbers cover my existing text?",
        answer:
          "You can adjust the margins and position to ensure the page numbers appear in the blank space of your document's header or footer.",
      },
      {
        question: "Can I customize the font and size of page numbers?",
        answer:
          "Yes. You have full control over font family, size, color, and style to ensure the page numbers match your document's design.",
      },
      {
        question: "Is my data safe when using PDFo?",
        answer:
          "Yes. All file transfers are protected with SSL encryption, and files are automatically deleted from our servers after processing.",
      },
    ],

    comparisons: [
      {
        question: "PDFo vs Adobe Acrobat for adding page numbers",
        answer:
          "PDFo allows you to add page numbers to PDFs online for free without installing expensive software like Adobe Acrobat, which requires a paid subscription.",
        lastUpdated: "2026-01-30",
      },
    ],

    relatedTools: [
      { key: "merge", name: "Merge PDF", path: "/merge" },
      { key: "watermark", name: "Watermark PDF", path: "/watermark" },
      { key: "metadata", name: "Edit Metadata", path: "/metadata" },
    ],
  } as const;

export default pageNumbersSEO;
