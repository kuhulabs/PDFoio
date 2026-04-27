// Auto-split from the original seo.ts so each tool page only loads its
// own SEO payload (5–15KB) instead of the full 128KB monolith.
export const splitSEO = {
    title: "Split PDF Online – Extract Pages from PDF Instantly | PDFo",
    h1: "Split PDF Files Online",

    metaDescription:
      "Split PDF pages or extract specific page ranges quickly and securely. No signup, no watermarks, and smooth performance for everyday use. Free online PDF splitter.",

    shortIntro:
      "Easily split PDF files into individual pages or extract selected sections in just a few clicks.",

    intro:
      "Split PDF by PDFo is a fast and flexible online tool that helps you break large PDF documents into smaller, more manageable files. Whether you need to extract a single important page, split a document by page ranges, or separate every page into its own PDF, PDFo preserves the original layout and quality throughout the process.",

    keywords: [
      "split pdf online free",
      "extract pages from pdf",
      "pdf splitter",
      "separate pdf pages",
      "split pdf into multiple files",
      "pdf page extractor",
      "divide pdf online",
      "break pdf into pages",
    ],

    longTailKeywords: [
      "how to split pdf into separate pages",
      "extract specific pages from pdf",
      "split large pdf into smaller files",
      "split pdf by page range online",
      "split pdf on mac online",
    ],

    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "PDFo Split PDF",
      description:
        "Free online PDF splitter to extract pages or split PDF files into multiple documents securely.",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Web Browser",
      url: "https://pdfo.io/split",
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
        "Extract specific pages",
        "Split PDFs by page range",
        "Visual page preview",
        "ZIP or individual file download",
        "Secure processing",
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
          name: "Split PDF",
        },
      ],
    },

    featuredSnippet: {
      question: "How do I split a PDF online?",
      steps: [
        "Upload your PDF file to PDFo",
        "Select specific pages or define a page range",
        "Click 'Split PDF' and download the result",
      ],
    },

    howItWorks: [
      "Upload the PDF document you want to split from your device",
      "Select pages visually or enter a custom page range",
      "Preview your selection to confirm accuracy",
      "Click 'Split PDF' and download the extracted files",
    ],

    benefits: [
      "Precise page-level extraction without quality loss",
      "Visual page preview for accurate selection",
      "Download results as ZIP or individual PDFs",
      "Secure file handling with automatic deletion",
      "Works smoothly on desktop and mobile devices",
      "No account or signup required",
    ],

    faqs: [
      {
        question: "How can I extract specific pages from a PDF?",
        answer:
          "Upload your PDF, select the page thumbnails you want to keep, and click 'Split PDF'. You’ll receive a new file containing only those pages.",
      },
      {
        question: "Can I split a PDF into individual pages?",
        answer:
          "Yes. You can choose the option to split all pages, and each page will be saved as a separate PDF file.",
      },
      {
        question: "Can I split password-protected PDFs?",
        answer:
          "Protected PDFs must be unlocked first using our Unlock PDF tool before they can be split.",
      },
      {
        question: "Does splitting a PDF affect quality?",
        answer:
          "No. Splitting does not change the resolution, text clarity, or formatting of the original pages.",
      },
    ],

    comparisons: [
      {
        question: "PDFo vs other PDF splitting tools",
        answer:
          "PDFo lets you split PDFs online without watermarks or mandatory registration, while many tools limit free usage or require subscriptions.",
        lastUpdated: "2026-01-30",
      },
    ],

    relatedTools: [
      { key: "delete-pages", name: "Delete Pages", path: "/delete-pages" },
      { key: "merge", name: "Merge PDF", path: "/merge" },
      { key: "reorder", name: "Reorder Pages", path: "/reorder" },
    ],
  } as const;

export default splitSEO;
