// Auto-split from the original seo.ts so each tool page only loads its
// own SEO payload (5–15KB) instead of the full 128KB monolith.
export const reorderSEO = {
    title: "Reorder PDF Pages Online – Rearrange PDF Pages Easily | PDFo",
    h1: "Rearrange PDF Pages Online",

    metaDescription:
      "Reorder PDF pages using a simple drag-and-drop interface. Rearrange page sequence quickly while preserving original quality. No signup required.",

    shortIntro:
      "Rearrange and organize PDF pages exactly the way you need with an intuitive drag-and-drop tool.",

    intro:
      "Reorder PDF Pages by PDFo gives you full control over the flow of your document. Using a visual thumbnail interface, you can easily rearrange pages in scanned documents, presentations, or reports. Simply drag and drop pages into the correct order and save the updated PDF without affecting quality or formatting.",

    keywords: [
      "reorder pdf pages online",
      "rearrange pdf pages",
      "sort pdf pages",
      "change pdf page order",
      "reorganize pdf pages",
      "pdf page organizer",
      "shuffle pdf pages",
      "move pdf pages",
    ],

    longTailKeywords: [
      "how to reorder pages in pdf online",
      "rearrange pdf pages without software",
      "change order of pages in pdf",
      "drag and drop pdf page organizer",
      "reorder pdf pages on mac",
    ],

    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "PDFo Reorder PDF Pages",
      description:
        "Free online PDF page reordering tool to rearrange page sequence without quality loss.",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Web Browser",
      url: "https://pdfo.io/reorder",
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
        "Drag-and-drop page reordering",
        "Visual page thumbnails",
        "Real-time preview",
        "Preserves original quality",
        "Mobile-friendly interface",
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
          name: "Reorder PDF",
        },
      ],
    },

    featuredSnippet: {
      question: "How do I rearrange pages in a PDF online?",
      steps: [
        "Upload your PDF file to PDFo",
        "Drag and drop page thumbnails to set the desired order",
        "Save changes and download the reordered PDF",
      ],
    },

    howItWorks: [
      "Upload your PDF document from your computer or mobile device",
      "Drag and drop page thumbnails into the correct sequence",
      "Preview the new page order before saving",
      "Download your reorganized PDF file instantly",
    ],

    benefits: [
      "Simple drag-and-drop page organization",
      "Live visual preview before saving changes",
      "Reorders pages without affecting content or quality",
      "Secure processing with automatic file deletion",
      "Works on desktop and mobile browsers",
      "No account or signup required",
    ],

    faqs: [
      {
        question: "Does reordering pages affect PDF quality?",
        answer:
          "No. Reordering only changes the page sequence. Text, images, formatting, and file size remain unchanged.",
      },
      {
        question: "Can I reorder PDF pages on my phone?",
        answer:
          "Yes. PDFo works in mobile browsers on both iPhone and Android with touch-friendly controls.",
      },
      {
        question: "Is it safe to upload PDFs for reordering?",
        answer:
          "Yes. Files are processed securely and deleted automatically after processing.",
      },
    ],

    comparisons: [
      {
        question: "PDFo vs desktop PDF software",
        answer:
          "PDFo lets you reorder PDF pages online without installing software, while many desktop tools require paid licenses.",
        lastUpdated: "2026-01-30",
      },
    ],

    relatedTools: [
      { key: "merge", name: "Merge PDF", path: "/merge" },
      { key: "delete-pages", name: "Delete Pages", path: "/delete-pages" },
      { key: "split", name: "Split PDF", path: "/split" },
    ],
  } as const;

export default reorderSEO;
