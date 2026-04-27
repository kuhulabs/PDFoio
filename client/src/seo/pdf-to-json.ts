// Auto-split from the original seo.ts so each tool page only loads its
// own SEO payload (5–15KB) instead of the full 128KB monolith.
export const pdfToJsonSEO = {
    title: "PDF to JSON - Convert PDF to Structured Data Online | PDFo",
    h1: "PDF to JSON Converter",

    metaDescription:
      "Extract text, layout, and structure from PDF to JSON format. Ideal for developers, data parsing, and automation. Secure and fast online tool.",

    shortIntro:
      "Convert static PDF content into developer-friendly, machine-readable JSON data.",

    intro:
      "The PDF to JSON tool by PDFo is a specialized utility designed for developers and data engineers. Instead of just extracting text, our parser analyzes the document structure, including coordinates and text blocks, and converts them into a clean JSON schema. This makes it effortless to integrate PDF content into web applications, databases, or automated data processing pipelines without manual scraping.",

    keywords: [
      "pdf to json converter online free",
      "convert pdf to json",
      "pdf to json online",
      "extract pdf data to json",
      "pdf parser json",
      "pdf to structured data",
      "pdf to json api",
      "pdf json extractor",
    ],

    longTailKeywords: [
      "how to convert pdf to json online free",
      "pdf to json converter for developers",
      "extract pdf structure to json",
      "pdf to json with coordinates",
      "parse pdf to json format",
    ],

    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "PDFo PDF to JSON Converter",
      description:
        "Free online tool to convert PDF documents into structured JSON data for developers and automation.",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Web Browser",
      url: "https://pdfo.io/pdf-to-json",
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
        "Convert PDF to JSON",
        "Structural metadata extraction",
        "Position coordinates",
        "Developer-friendly output",
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
          name: "PDF to JSON",
        },
      ],
    },

    featuredSnippet: {
      question: "How do I convert PDF to JSON online?",
      steps: [
        "Upload your PDF document to PDFo",
        "Wait for the structural analysis to complete",
        "Download your machine-readable JSON file",
        "Integrate the data into your project",
      ],
    },

    howItWorks: [
      "Upload the PDF document you need to parse into a data format",
      "Our system analyzes the document layers, text elements, and structural metadata",
      "The conversion engine maps the PDF content into a structured JSON array",
      "Download your machine-readable .json file and integrate it directly into your project",
    ],

    benefits: [
      "Developer-ready structured output for quick integration",
      "High precision parsing of text elements and positional data",
      "Saves time on building custom scrapers or manual data entry",
      "Secure API-like processing with 100% data privacy",
      "Works smoothly on desktop and mobile devices",
      "No account or email signup required",
    ],

    faqs: [
      {
        question: "Does the JSON output include page coordinates?",
        answer:
          "Yes, our tool extracts text along with structural metadata, making it easier to understand where elements were positioned in the original document.",
      },
      {
        question: "Can I use this for batch data processing?",
        answer:
          "Absolutely. Our engine is optimized for speed, allowing you to convert complex documents into JSON format in a matter of seconds.",
      },
      {
        question: "Is the JSON schema compatible with standard parsers?",
        answer:
          "Yes, the output follows standard JSON formatting, ensuring compatibility with any programming language like JavaScript, Python, or Java.",
      },
      {
        question: "Is my data safe when using PDFo?",
        answer:
          "Yes. All file transfers are protected with SSL encryption, and files are automatically deleted from our servers after processing.",
      },
    ],

    comparisons: [
      {
        question: "PDFo vs manual PDF parsing",
        answer:
          "PDFo automatically extracts structured JSON data from PDFs instantly, while manual parsing requires complex libraries and custom code development.",
        lastUpdated: "2026-01-30",
      },
    ],

    relatedTools: [
      { key: "pdf-to-txt", name: "PDF to TXT", path: "/pdf-to-txt" },
      { key: "pdf-to-excel", name: "PDF to Excel", path: "/pdf-to-excel" },
      { key: "metadata", name: "Edit Metadata", path: "/metadata" },
    ],
  } as const;

export default pdfToJsonSEO;
