// Auto-split from the original seo.ts so each tool page only loads its
// own SEO payload (5–15KB) instead of the full 128KB monolith.
export const pdfToTxtSEO = {
    title: "PDF to TXT - Extract Plain Text from PDF Online for Free | PDFo",
    h1: "Extract Text from PDF Online",

    metaDescription:
      "Quickly extract all text content from your PDF files into a clean, plain TXT file. Free online tool to convert PDF to Text with high accuracy. No signup required.",

    shortIntro:
      "Convert your PDF documents into simple, plain text files in seconds for easy editing and data reuse.",

    intro:
      "The PDF to TXT converter by PDFo is the most efficient way to strip formatting and extract raw text from your documents. Whether you need to repurpose content for a blog post, clean up data for a coding project, or simply copy large amounts of text without the hassle of PDF formatting, our tool provides a clean, unformatted TXT output. It works instantly in your browser, maintaining the reading order and character accuracy.",

    keywords: [
      "pdf to txt converter online free",
      "extract text from pdf",
      "pdf to text online",
      "convert pdf to txt",
      "pdf text extractor",
      "pdf to plain text",
      "pdf to txt free",
      "extract pdf content",
    ],

    longTailKeywords: [
      "how to extract text from pdf online free",
      "convert pdf to plain text file",
      "pdf to txt converter with ocr",
      "extract text from scanned pdf",
      "pdf to txt without formatting",
    ],

    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "PDFo PDF to TXT Converter",
      description:
        "Free online tool to extract plain text from PDF files with high accuracy and OCR support.",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Web Browser",
      url: "https://pdfo.io/pdf-to-txt",
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
        "Extract text from PDF",
        "OCR support",
        "Clean plain text output",
        "Fast extraction",
        "No character limits",
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
          name: "PDF to TXT",
        },
      ],
    },

    featuredSnippet: {
      question: "How do I extract text from a PDF online?",
      steps: [
        "Upload your PDF document to PDFo",
        "Wait for the text extraction to complete",
        "Download your clean TXT file",
        "Use the text content anywhere you need",
      ],
    },

    howItWorks: [
      "Upload the PDF document you wish to convert to plain text",
      "Our extraction engine scans the document to identify and pull all text characters",
      "The tool removes images and layout formatting to provide a clean output",
      "Download your new .txt file and use the content anywhere",
    ],

    benefits: [
      "Lightning-fast extraction speed even for large documents",
      "Clean, unformatted plain text output ready for any editor",
      "Developer-friendly format for data parsing and scripts",
      "Completely free with secure, private file processing",
      "Works smoothly on desktop and mobile devices",
      "No account or email signup required",
    ],

    faqs: [
      {
        question: "Does the text extraction maintain the document layout?",
        answer:
          "PDF to TXT is designed to extract raw content. While it follows the reading order of your document, it removes images, columns, and fonts to give you a clean, plain text file.",
      },
      {
        question: "Can I extract text from a scanned PDF?",
        answer:
          "Yes, our tool uses integrated OCR technology to recognize and extract text even from scanned images or non-selectable PDF documents.",
      },
      {
        question: "Is there a character limit for the conversion?",
        answer:
          "No, you can convert long-form documents like eBooks, reports, and legal transcripts into text files without any hidden limits.",
      },
      {
        question: "Is my data safe when using PDFo?",
        answer:
          "Yes. All file transfers are protected with SSL encryption, and files are automatically deleted from our servers after processing.",
      },
    ],

    comparisons: [
      {
        question: "PDFo vs copy-paste from PDF",
        answer:
          "PDFo extracts clean, properly formatted text from entire PDFs instantly, while manual copy-paste often breaks formatting and requires multiple selections.",
        lastUpdated: "2026-01-30",
      },
    ],

    relatedTools: [
      { key: "pdf-to-word", name: "PDF to Word", path: "/pdf-to-word" },
      { key: "pdf-to-json", name: "PDF to JSON", path: "/pdf-to-json" },
      { key: "summarize", name: "Summarize PDF", path: "/summarize" },
    ],
  } as const;

export default pdfToTxtSEO;
