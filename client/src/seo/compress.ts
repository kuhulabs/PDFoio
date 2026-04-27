// Auto-split from the original seo.ts so each tool page only loads its
// own SEO payload (5–15KB) instead of the full 128KB monolith.
export const compressSEO = {
    title: "Compress PDF Online – Reduce PDF File Size Easily | PDFo",
    h1: "Compress PDF Online",

    metaDescription:
      "Reduce PDF file size quickly while preserving text clarity and layout. Ideal for sharing and email attachments. No signup, no watermarks.",

    shortIntro:
      "Make your PDF files smaller and easier to share without compromising readability.",

    intro:
      "Compress PDF by PDFo is a fast and reliable online tool that helps reduce PDF file size while maintaining clear text and readable images. By optimizing images and internal resources, PDFo makes your documents easier to upload, email, and store—perfect for everyday personal and professional use.",

    keywords: [
      "compress pdf online free",
      "reduce pdf file size",
      "pdf compressor",
      "shrink pdf",
      "make pdf smaller",
      "compress pdf for email",
      "reduce pdf size without losing quality",
      "compress pdf online",
    ],

    longTailKeywords: [
      "how to reduce pdf file size for email",
      "compress pdf for gmail attachment",
      "compress pdf without noticeable quality loss",
      "reduce large pdf file size online",
      "compress pdf on mobile",
    ],

    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "PDFo Compress PDF",
      description:
        "Free online PDF compression tool to reduce file size while preserving readability and layout.",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Web Browser",
      url: "https://pdfo.io/compress",
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
        "Reduce PDF file size",
        "Multiple compression levels",
        "Text clarity preservation",
        "Optimized for sharing and email",
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
          name: "Compress PDF",
        },
      ],
    },

    featuredSnippet: {
      question: "How do I compress a PDF online?",
      steps: [
        "Upload your PDF file to PDFo",
        "Choose a compression level based on your needs",
        "Click 'Compress PDF' and download the optimized file",
      ],
    },

    howItWorks: [
      "Upload the PDF file you want to compress from your device",
      "Select a compression level suited for sharing or storage",
      "Start compression with one click",
      "Download the optimized PDF file instantly",
    ],

    benefits: [
      "Reduced file size for faster uploads and downloads",
      "Preserves text clarity and document structure",
      "Suitable for email attachments and online forms",
      "Secure SSL-encrypted processing",
      "Works on desktop, tablet, and mobile devices",
      "No account or signup required",
    ],

    faqs: [
      {
        question: "Will compressing a PDF affect its quality?",
        answer:
          "Compression is designed to reduce file size while keeping text clear and pages readable. Minor image adjustments may occur depending on the selected level.",
      },
      {
        question: "Can I compress PDFs for email attachments?",
        answer:
          "Yes. Compressing your PDF makes it easier to share via email and upload to websites with size limits.",
      },
      {
        question: "Is there a limit to how many PDFs I can compress?",
        answer:
          "You can compress multiple PDF files for everyday personal and professional use without creating an account.",
      },
      {
        question: "Does PDFo work on mobile devices?",
        answer:
          "Yes. You can compress PDFs directly from your mobile browser on both iPhone and Android devices.",
      },
    ],

    comparisons: [
      {
        question: "PDFo vs paid PDF compression tools",
        answer:
          "PDFo allows you to compress PDFs online without watermarks or mandatory subscriptions, while many traditional tools require paid plans for similar features.",
        lastUpdated: "2026-01-30",
      },
    ],

    relatedTools: [
      { key: "merge", name: "Merge PDF", path: "/merge" },
      { key: "split", name: "Split PDF", path: "/split" },
      { key: "pdf-to-jpg", name: "PDF to JPG", path: "/pdf-to-jpg" },
    ],
  } as const;

export default compressSEO;
