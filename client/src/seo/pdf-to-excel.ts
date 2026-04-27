// Auto-split from the original seo.ts so each tool page only loads its
// own SEO payload (5–15KB) instead of the full 128KB monolith.
export const pdfToExcelSEO = {
    title: "PDF to Excel Converter - Extract PDF Tables to XLSX Online | PDFo",
    h1: "Convert PDF to Excel Online",

    metaDescription:
      "Extract tables and data from PDF to Excel (XLSX) spreadsheets with high accuracy. Convert rows and columns perfectly for free. Fast, secure, and no signup.",

    shortIntro:
      "Instantly turn your PDF tables into structured Excel spreadsheets for seamless data analysis.",

    intro:
      "The PDF to Excel converter by PDFo is specifically designed to recognize and extract tabular data with extreme precision. Stop wasting time with manual data entry; our tool identifies rows and columns within your PDF and maps them directly into an editable XLSX file. Whether it's financial statements, invoices, or research data, you get a clean spreadsheet ready for formulas and pivot tables.",

    keywords: [
      "pdf to excel converter online free",
      "convert pdf to xlsx",
      "pdf to excel online",
      "extract tables from pdf",
      "pdf to spreadsheet",
      "convert pdf table to excel",
      "pdf to excel with ocr",
      "pdf data extraction",
    ],

    longTailKeywords: [
      "how to convert pdf to excel online free",
      "extract pdf tables to excel spreadsheet",
      "convert scanned pdf to excel",
      "pdf to excel converter without losing formatting",
      "convert pdf invoice to excel",
    ],

    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "PDFo PDF to Excel Converter",
      description:
        "Free online PDF to Excel converter to extract tables and data from PDF files to XLSX spreadsheets.",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Web Browser",
      url: "https://pdfo.io/pdf-to-excel",
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
        "Extract PDF tables to Excel",
        "OCR for scanned PDFs",
        "Preserve table structure",
        "Multiple table extraction",
        "XLSX format support",
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
          name: "PDF to Excel",
        },
      ],
    },

    featuredSnippet: {
      question: "How do I convert PDF to Excel online?",
      steps: [
        "Upload your PDF file containing tables to PDFo",
        "Wait for table detection and data extraction",
        "Click 'Download' to get your XLSX file",
        "Open in Excel or Google Sheets to analyze data",
      ],
    },

    howItWorks: [
      "Upload the PDF document containing the tables you wish to convert",
      "Our intelligent engine identifies the table structures and extracts the data",
      "The conversion process formats the data into a high-quality spreadsheet",
      "Download your new Microsoft Excel (XLSX) file and start your analysis",
    ],

    benefits: [
      "Highly accurate extraction of complex table structures",
      "Saves hours of manual typing and data entry errors",
      "Ready-to-use XLSX files compatible with Excel and Google Sheets",
      "Secure and private processing with automatic server cleanup",
      "Works smoothly on desktop and mobile devices",
      "No account or email signup required",
    ],

    faqs: [
      {
        question: "Will the formatting of my tables be preserved?",
        answer:
          "Yes, our converter is optimized to detect borders and cell structures, ensuring that your rows and columns stay aligned exactly as they appear in the PDF.",
      },
      {
        question: "Can I convert multiple tables from a single PDF?",
        answer:
          "Absolutely. Our tool scans the entire document and will extract all detected tables into a single Excel workbook.",
      },
      {
        question: "Does this work for scanned PDF invoices or reports?",
        answer:
          "Yes, our integrated OCR technology can read and extract tabular data even from scanned images and non-selectable PDF files.",
      },
      {
        question: "Is my data safe when using PDFo?",
        answer:
          "Yes. All file transfers are protected with SSL encryption, and files are automatically deleted from our servers after processing.",
      },
    ],

    comparisons: [
      {
        question: "PDFo vs paid PDF to Excel converters",
        answer:
          "PDFo offers free PDF to Excel conversion with accurate table extraction and OCR, while many tools require expensive subscriptions for similar features.",
        lastUpdated: "2026-01-30",
      },
    ],

    relatedTools: [
      { key: "pdf-to-word", name: "PDF to Word", path: "/pdf-to-word" },
      { key: "pdf-to-json", name: "PDF to JSON", path: "/pdf-to-json" },
      { key: "excel-to-pdf", name: "Excel to PDF", path: "/excel-to-pdf" },
    ],
  } as const;

export default pdfToExcelSEO;
