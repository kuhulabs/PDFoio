// Auto-split from the original seo.ts so each tool page only loads its
// own SEO payload (5–15KB) instead of the full 128KB monolith.
export const rotateSEO = {
    title: "Rotate PDF Online – Fix PDF Page Orientation Instantly | PDFo",
    h1: "Rotate PDF Pages Online",

    metaDescription:
      "Rotate PDF pages permanently to fix sideways or upside-down documents. Supports individual or all pages. No signup, no watermarks.",

    shortIntro:
      "Fix sideways or upside-down PDF pages and save the correct orientation permanently.",

    intro:
      "Rotate PDF by PDFo is a simple and reliable online tool that helps you correct page orientation issues in PDF documents. Whether a scan is sideways or pages are upside down, you can rotate individual pages or the entire document by common angles. All changes are saved directly into the PDF, ensuring the file displays correctly on every device.",

    keywords: [
      "rotate pdf online free",
      "rotate pdf pages",
      "fix pdf orientation",
      "rotate pdf permanently",
      "turn pdf pages",
      "rotate pdf clockwise",
      "flip pdf pages",
      "rotate scanned pdf",
    ],

    longTailKeywords: [
      "how to rotate pdf pages permanently",
      "rotate single page in pdf online",
      "fix upside down pdf online",
      "rotate pdf 90 degrees online",
      "rotate pdf on mac online",
    ],

    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "PDFo Rotate PDF",
      description:
        "Free online PDF rotation tool to permanently fix page orientation issues.",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Web Browser",
      url: "https://pdfo.io/rotate",
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
        "Permanent PDF rotation",
        "Rotate individual or all pages",
        "Multiple rotation angles",
        "Real-time page preview",
        "No quality loss",
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
          name: "Rotate PDF",
        },
      ],
    },

    featuredSnippet: {
      question: "How do I permanently rotate a PDF online?",
      steps: [
        "Upload your PDF file to PDFo",
        "Rotate pages by the required angle",
        "Save changes and download the updated PDF",
      ],
    },

    howItWorks: [
      "Upload your PDF file from desktop or mobile",
      "Rotate individual pages or the entire document using on-screen controls",
      "Preview the new orientation before saving",
      "Download the corrected PDF with permanent rotation applied",
    ],

    benefits: [
      "Rotation is saved permanently in the PDF file",
      "Real-time thumbnail preview for accurate adjustments",
      "Supports rotating single pages or entire documents",
      "Preserves original quality and file size",
      "Works smoothly on desktop and mobile browsers",
      "No account or signup required",
    ],

    faqs: [
      {
        question: "Is PDF rotation saved permanently?",
        answer:
          "Yes. Once you save and download the file, the new orientation is permanently embedded in the PDF.",
      },
      {
        question: "Can I rotate only one page in a PDF?",
        answer:
          "Yes. You can select and rotate individual pages without affecting the rest of the document.",
      },
      {
        question: "Does rotating a PDF affect quality?",
        answer:
          "No. Rotation only changes page orientation and does not impact text clarity, images, or file size.",
      },
      {
        question: "Is it safe to rotate PDFs online with PDFo?",
        answer:
          "Yes. Files are processed securely and automatically deleted after processing.",
      },
    ],

    relatedTools: [
      { key: "merge", name: "Merge PDF", path: "/merge" },
      { key: "split", name: "Split PDF", path: "/split" },
      { key: "reorder", name: "Reorder Pages", path: "/reorder" },
    ],
  } as const;

export default rotateSEO;
