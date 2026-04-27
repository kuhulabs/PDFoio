// Auto-split from the original seo.ts so each tool page only loads its
// own SEO payload (5–15KB) instead of the full 128KB monolith.
export const excelToPdfSEO = {
    title: "Excel to PDF - Convert XLSX to PDF Online for Free | PDFo",
    h1: "Convert Excel to PDF Online",

    metaDescription:
      "Convert Excel spreadsheets (XLS/XLSX) to professional PDF documents online. Preserve table formatting, cell styles, and layouts for free. Fast and secure.",

    shortIntro:
      "Transform your complex Excel spreadsheets into clean, universally-readable PDF reports in seconds.",

    intro:
      "The Excel to PDF converter by PDFo is optimized to maintain the integrity of your data. When you share an Excel file, the layout can change depending on the viewer's software version; our tool locks your data into a fixed PDF format, ensuring that tables, charts, and cell formatting remain exactly as you designed them. It's the perfect way to share financial reports, invoices, and data models professionally.",

    keywords: [
      "excel to pdf converter online free",
      "convert xlsx to pdf",
      "excel to pdf online",
      "xls to pdf converter",
      "spreadsheet to pdf",
      "convert excel file to pdf",
      "excel table to pdf",
      "xlsx to pdf free",
    ],

    longTailKeywords: [
      "how to convert excel to pdf online free",
      "convert excel spreadsheet to pdf without losing formatting",
      "excel to pdf converter for invoices",
      "convert xlsx to pdf on mobile",
      "excel to pdf without microsoft office",
    ],

    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "PDFo Excel to PDF Converter",
      description:
        "Free online Excel to PDF converter to transform XLS and XLSX spreadsheets into professional PDF documents.",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Web Browser",
      url: "https://pdfo.io/excel-to-pdf",
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
        "Convert Excel to PDF",
        "Preserve table formatting",
        "Support XLS and XLSX",
        "Chart preservation",
        "Multi-sheet support",
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
          name: "Excel to PDF",
        },
      ],
    },

    featuredSnippet: {
      question: "How do I convert Excel to PDF online?",
      steps: [
        "Upload your Excel file (XLS or XLSX) to PDFo",
        "Wait for the conversion to process",
        "Download your PDF with preserved table formatting",
        "Share your professional PDF report",
      ],
    },

    howItWorks: [
      "Upload your Microsoft Excel file (.xls or .xlsx) to our secure platform",
      "Our system analyzes the workbook, worksheets, and grid layout",
      "The conversion engine renders your data into high-quality PDF pages",
      "Download your professional PDF report, ready for printing or email sharing",
    ],

    benefits: [
      "Accurate table and chart preservation for data integrity",
      "Automatic fit-to-page rendering for professional layout",
      "No Microsoft Excel installation or subscription required",
      "Secure SSL encrypted transfers with instant file deletion",
      "Works smoothly on desktop and mobile devices",
      "No account or email signup required",
    ],

    faqs: [
      {
        question: "Will my Excel formulas be visible in the PDF?",
        answer:
          "No, the PDF will show only the results and calculated values of your formulas, just as they appear on your screen, maintaining your data's privacy.",
      },
      {
        question: "Can I convert an entire workbook with multiple sheets?",
        answer:
          "Yes, our converter processes the active sheets and can turn your entire multi-sheet workbook into a single, organized PDF file.",
      },
      {
        question: "How do I prevent my tables from being cut off in the PDF?",
        answer:
          "Our tool automatically attempts to fit your data to the page width. For best results, ensure your 'Print Area' is set correctly in the original Excel file.",
      },
      {
        question: "Is my data safe when using PDFo?",
        answer:
          "Yes. All file transfers are protected with SSL encryption, and files are automatically deleted from our servers after processing.",
      },
    ],

    comparisons: [
      {
        question: "PDFo vs Microsoft Excel's built-in PDF export",
        answer:
          "PDFo offers free online Excel to PDF conversion without requiring Microsoft Office installation, while Excel's export requires a licensed copy of MS Office.",
        lastUpdated: "2026-01-30",
      },
    ],

    relatedTools: [
      { key: "word-to-pdf", name: "Word to PDF", path: "/word-to-pdf" },
      { key: "pdf-to-excel", name: "PDF to Excel", path: "/pdf-to-excel" },
      { key: "merge", name: "Merge PDF", path: "/merge" },
    ],
  } as const;

export default excelToPdfSEO;
