// Auto-split from the original seo.ts so each tool page only loads its
// own SEO payload (5–15KB) instead of the full 128KB monolith.
export const removeBlankPagesSEO = {
    title: "Remove Blank Pages - Automatically Clean Up Your PDF Online | PDFo",
    h1: "Remove Blank PDF Pages Instantly",

    metaDescription:
      "Automatically detect and remove empty pages from your PDF documents for free. Use AI to clean up scanned PDFs and save time. Fast, secure, and accurate.",

    shortIntro:
      "Professionally clean up your PDF by removing unnecessary and empty blank pages automatically.",

    intro:
      "The Remove Blank Pages tool by PDFo uses intelligent detection technology to identify and discard empty pages in your document. Perfect for cleaning up scanned documents where double-sided scanning often leaves unwanted blank sides, this tool saves you the manual effort of hunting through pages. Get a polished, professional document in just one click.",

    keywords: [
      "remove blank pages from pdf",
      "delete empty pages pdf online",
      "remove blank pages pdf free",
      "clean up scanned pdf",
      "auto remove blank pages",
      "pdf blank page remover",
      "delete white pages from pdf",
      "remove empty pdf pages",
    ],

    longTailKeywords: [
      "how to remove blank pages from pdf automatically",
      "delete all blank pages from scanned pdf",
      "remove empty pages from pdf online free",
      "automatically detect and remove blank pages",
      "clean up pdf after scanning",
    ],

    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "PDFo Remove Blank Pages",
      description:
        "Free online AI-powered tool to automatically detect and remove blank pages from PDF documents.",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Web Browser",
      url: "https://pdfo.io/remove-blank-pages",
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
        "AI-powered blank page detection",
        "Automatic empty page removal",
        "Preview before deletion",
        "Secure SSL encryption",
        "Perfect for scanned documents",
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
          name: "Remove Blank Pages",
        },
      ],
    },

    featuredSnippet: {
      question: "How do I remove blank pages from a PDF automatically?",
      steps: [
        "Upload your PDF file to PDFo",
        "AI automatically detects all blank pages",
        "Preview and confirm the pages to remove",
        "Click 'Remove Blank Pages' and download the cleaned PDF",
      ],
    },

    howItWorks: [
      "Upload your PDF document to our secure online server",
      "Our AI system automatically scans and identifies every blank page in the file",
      "Preview the detected pages and confirm which ones you want to discard",
      "Click 'Remove Blank Pages' and download your cleaned, compact PDF",
    ],

    benefits: [
      "Smart automatic detection of empty and nearly-blank pages",
      "Saves hours of manual checking and deleting",
      "Gives your scanned documents a professional, finished look",
      "Secure processing with 100% data privacy and SSL encryption",
      "Works perfectly with double-sided scanned documents",
      "No account or email signup required",
    ],

    faqs: [
      {
        question: "How does the tool detect blank pages?",
        answer:
          "Our AI analyzes the content density of each page. If a page contains no text or significant imagery, it is flagged as blank for your review.",
      },
      {
        question: "Can I choose to keep some blank pages?",
        answer:
          "Yes! After the auto-detection is complete, you can preview the results and uncheck any specific pages you want to keep in the document.",
      },
      {
        question: "Is this tool free for large scanned files?",
        answer:
          "Yes, PDFo provides professional-grade cleanup tools for free, making it ideal for large scanned reports and archives.",
      },
      {
        question: "Does it work with scanned documents?",
        answer:
          "Absolutely. This tool is specifically designed for scanned PDFs where double-sided scanning often creates unwanted blank pages.",
      },
      {
        question: "Will it remove pages with very little content?",
        answer:
          "The AI is smart enough to detect nearly-blank pages. You can review all detected pages before final removal to ensure accuracy.",
      },
    ],

    comparisons: [
      {
        question: "PDFo vs manual blank page removal",
        answer:
          "PDFo automatically detects and removes blank pages in seconds using AI, while manual removal requires you to scroll through every page and delete them one by one.",
        lastUpdated: "2026-01-30",
      },
    ],

    relatedTools: [
      { key: "delete-pages", name: "Delete Pages", path: "/delete-pages" },
      { key: "split", name: "Split PDF", path: "/split" },
      { key: "compress", name: "Compress PDF", path: "/compress" },
    ],
  } as const;

export default removeBlankPagesSEO;
