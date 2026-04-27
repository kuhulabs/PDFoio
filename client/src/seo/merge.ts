// Auto-split from the original seo.ts so each tool page only loads its
// own SEO payload (5–15KB) instead of the full 128KB monolith.
export const mergeSEO = {
    title: "Merge PDF Online – Combine Multiple PDF Files Instantly | PDFo",
    h1: "Merge PDF Files Online",

    metaDescription:
      "Combine multiple PDF files into one document quickly and securely. No email signup, no watermarks, and generous limits for everyday use. Free online PDF merger.",

    shortIntro:
      "Combine multiple PDF documents into a single, well-organized file in just a few clicks.",

    intro:
      "Merge PDF is a fast and reliable online tool designed to combine multiple PDF files into one organized document. Whether you're merging business reports, academic certificates, or scanned receipts, PDFo ensures your original quality, layout, and formatting remain intact.",

    keywords: [
      "merge pdf online free",
      "combine pdf files",
      "pdf merger",
      "merge pdf without email",
      "combine pdf files into one",
      "pdf joiner online",
      "join pdf documents",
      "concatenate pdf files",
    ],

    longTailKeywords: [
      "how to merge pdf files online",
      "merge multiple pdf into one",
      "combine pdf documents without losing quality",
      "merge pdf files on iphone",
      "merge pdf files on android",
    ],

    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "PDFo Merge PDF",
      description:
        "Free online PDF merger to combine multiple PDF files into one document securely.",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Web Browser",
      url: "https://pdfo.io/merge",
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
        "Merge multiple PDF files",
        "No watermarks",
        "Drag and drop interface",
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
          name: "Merge PDF",
        },
      ],
    },

    featuredSnippet: {
      question: "How do I merge PDF files online?",
      steps: [
        "Upload your PDF files to PDFo",
        "Arrange them in your preferred order using drag and drop",
        "Click 'Merge PDF' and download the combined file",
      ],
    },

    howItWorks: [
      "Upload or drag and drop the PDF files you want to merge",
      "Rearrange page thumbnails to set the correct order",
      "Click the 'Merge PDF' button to start processing",
      "Download your merged PDF file instantly",
    ],

    benefits: [
      "Secure SSL encryption for all uploads",
      "Automatic file deletion after processing",
      "Easy drag-and-drop reordering",
      "Preserves original text and image quality",
      "Works smoothly on desktop and mobile devices",
      "No account or email signup required",
    ],

    faqs: [
      {
        question: "How many PDF files can I merge?",
        answer:
          "You can merge multiple PDF files in one go. The tool is designed to support common personal and professional use cases efficiently.",
      },
      {
        question: "Is my data safe when using PDFo?",
        answer:
          "Yes. All file transfers are protected with SSL encryption, and files are automatically deleted from our servers after processing.",
      },
      {
        question: "Can I merge PDFs on my phone?",
        answer:
          "Yes. PDFo works perfectly in mobile browsers on both iPhone and Android. Simply upload, arrange, and merge your files.",
      },
      {
        question: "Can I merge password-protected PDFs?",
        answer:
          "If a PDF is protected, you’ll need to unlock it first using our Unlock PDF tool before merging.",
      },
      {
        question: "Will merging PDFs affect quality?",
        answer:
          "No. PDFo preserves the original resolution, text clarity, and formatting of all merged pages.",
      },
    ],

    comparisons: [
      {
        question: "PDFo vs paid PDF merger tools",
        answer:
          "PDFo allows you to merge PDFs online for free without watermarks or mandatory signups, while many traditional tools require a paid subscription for the same functionality.",
        lastUpdated: "2026-01-30",
      },
    ],

    relatedTools: [
      { key: "split", name: "Split PDF", path: "/split" },
      { key: "reorder", name: "Reorder Pages", path: "/reorder" },
      { key: "compress", name: "Compress PDF", path: "/compress" },
    ],
  } as const;

export default mergeSEO;
