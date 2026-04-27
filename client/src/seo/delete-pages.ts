// Auto-split from the original seo.ts so each tool page only loads its
// own SEO payload (5–15KB) instead of the full 128KB monolith.
export const deletePagesSEO = {
    title: "Delete PDF Pages - Remove Unwanted Pages from PDF Online | PDFo",
    h1: "Remove PDF Pages Online",

    metaDescription:
      "Easily remove unwanted or unnecessary pages from your PDF documents for free. Clean up, organize, and shrink your PDF files instantly. 100% secure.",

    shortIntro:
      "Remove unnecessary pages from your PDF in seconds to create a cleaner, more professional document.",

    intro:
      "The Delete PDF Pages tool by PDFo is the simplest way to remove clutter from your documents. Whether you need to delete sensitive information, remove blank pages, or simply shorten a report, our visual interface allows you to select exactly which pages to discard. Generate a clean, updated version of your document instantly without re-creating it from scratch.",

    keywords: [
      "delete pdf pages online free",
      "remove pages from pdf",
      "pdf page remover",
      "delete pdf pages without software",
      "remove unwanted pdf pages",
      "pdf page deleter online",
      "extract pages from pdf",
      "discard pdf pages",
    ],

    longTailKeywords: [
      "how to delete pages from pdf online",
      "remove specific pages from pdf free",
      "delete multiple pages from pdf at once",
      "remove pages from pdf without adobe",
      "delete pdf pages on mobile",
    ],

    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "PDFo Delete PDF Pages",
      description:
        "Free online PDF page deletion tool to remove unwanted pages from PDF documents securely.",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Web Browser",
      url: "https://pdfo.io/delete-pages",
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
        "Delete multiple PDF pages",
        "Visual page selection",
        "No watermarks",
        "Secure SSL encryption",
        "Automatic file deletion",
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
          name: "Delete PDF Pages",
        },
      ],
    },

    featuredSnippet: {
      question: "How do I delete pages from a PDF online?",
      steps: [
        "Upload your PDF file to PDFo",
        "Click on the page thumbnails you want to remove",
        "Click 'Delete Pages' and download the updated file",
      ],
    },

    howItWorks: [
      "Upload your PDF document from your computer or mobile device",
      "Click on the thumbnails of the specific pages you wish to remove",
      "Review your selection to ensure the remaining pages are correct",
      "Click 'Delete Pages' and download your cleaned-up PDF immediately",
    ],

    benefits: [
      "Simple visual selection for mistake-free page removal",
      "Reduce file size by discarding unnecessary content",
      "Instant processing directly in your web browser",
      "High-quality output that preserves original document formatting",
      "Works smoothly on desktop and mobile devices",
      "No account or email signup required",
    ],

    faqs: [
      {
        question: "Can I delete multiple pages at once from a PDF?",
        answer:
          "Yes, you can click on as many pages as you want in the grid view. Once you hit delete, all selected pages will be removed simultaneously.",
      },
      {
        question: "What happens if I delete a page by mistake?",
        answer:
          "As long as you haven't clicked 'Delete Pages', you can simply click the page thumbnail again to deselect it and keep it in the document.",
      },
      {
        question: "Is there a limit to how many pages I can remove?",
        answer:
          "There is no limit to how many pages you can delete, as long as at least one page remains in the final document.",
      },
      {
        question: "Is my data safe when using PDFo?",
        answer:
          "Yes. All file transfers are protected with SSL encryption, and files are automatically deleted from our servers after processing.",
      },
      {
        question: "Does deleting pages affect PDF quality?",
        answer:
          "No. PDFo preserves the original resolution, text clarity, and formatting of all remaining pages.",
      },
    ],

    comparisons: [
      {
        question: "PDFo vs paid PDF page deletion tools",
        answer:
          "PDFo allows you to delete PDF pages online for free without watermarks or mandatory signups, while many traditional tools require a paid subscription for the same functionality.",
        lastUpdated: "2026-01-30",
      },
    ],

    relatedTools: [
      { key: "split", name: "Split PDF", path: "/split" },
      { key: "merge", name: "Merge PDF", path: "/merge" },
      {
        key: "remove-blank-pages",
        name: "Remove Blank Pages",
        path: "/remove-blank-pages",
      },
    ],
  } as const;

export default deletePagesSEO;
