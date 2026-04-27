// Auto-split from the original seo.ts so each tool page only loads its
// own SEO payload (5–15KB) instead of the full 128KB monolith.
export const watermarkSEO = {
    title: "Watermark PDF - Add Text or Image Watermarks to PDF Online | PDFo",
    h1: "Add Watermark to PDF Online",

    metaDescription:
      "Protect your PDF files with custom text or image watermarks. Adjust transparency, position, and rotation for professional document security. 100% free.",

    shortIntro:
      "Protect your intellectual property or brand your documents with fully customizable watermarks.",

    intro:
      "The Watermark PDF tool by PDFo allows you to add a layer of professional protection to your files. Whether you need to stamp a 'CONFIDENTIAL' warning, a copyright notice, or your company's transparent logo, our tool gives you full control. You can precisely place watermarks, adjust their opacity, and apply them to all pages or specific sections in seconds.",

    keywords: [
      "watermark pdf online free",
      "add watermark to pdf",
      "pdf watermark tool",
      "add logo to pdf",
      "watermark pdf with text",
      "add image watermark pdf",
      "pdf watermark maker",
      "protect pdf with watermark",
    ],

    longTailKeywords: [
      "how to add watermark to pdf online",
      "add transparent watermark to pdf free",
      "watermark pdf with company logo",
      "add confidential watermark to pdf",
      "add custom text watermark to pdf",
    ],

    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "PDFo Watermark PDF",
      description:
        "Free online tool to add customizable text or image watermarks to PDF documents for protection and branding.",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Web Browser",
      url: "https://pdfo.io/watermark",
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
        "Text and image watermarks",
        "Adjustable transparency and opacity",
        "Custom position and rotation",
        "Apply to all or specific pages",
        "Real-time preview",
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
          name: "Watermark PDF",
        },
      ],
    },

    featuredSnippet: {
      question: "How do I add a watermark to a PDF online?",
      steps: [
        "Upload your PDF file to PDFo",
        "Choose text or image watermark and upload/type your content",
        "Customize position, opacity, rotation, and font settings",
        "Click 'Add Watermark' and download your protected PDF",
      ],
    },

    howItWorks: [
      "Upload your PDF document to our secure online portal",
      "Choose between a 'Text' watermark (like 'DRAFT') or upload an 'Image' (like your logo)",
      "Customize the font, size, rotation, opacity, and position on the page",
      "Click 'Add Watermark' and download your newly protected PDF document",
    ],

    benefits: [
      "Instant brand protection for sensitive business documents",
      "Anti-copying security with semi-transparent text overlays",
      "Easy positioning tools with real-time visual adjustments",
      "Support for high-quality transparent PNG and JPEG image formats",
      "Works smoothly on desktop and mobile devices",
      "No account or email signup required",
    ],

    faqs: [
      {
        question: "Can I remove a watermark after adding it?",
        answer:
          "Our tool applies the watermark permanently to the PDF file for security. We recommend keeping a backup of your original file before applying the watermark.",
      },
      {
        question: "How do I make my logo watermark transparent?",
        answer:
          "When you upload an image, you can use our 'Opacity' slider to make it as faint or as bold as you like, ensuring it doesn't obstruct the document content.",
      },
      {
        question: "Can I choose which pages to watermark?",
        answer:
          "Yes, you have the option to apply your watermark to the entire document or select a specific range of pages.",
      },
      {
        question: "What image formats are supported for watermarks?",
        answer:
          "You can upload watermark images in PNG, JPEG, or JPG formats. PNG is recommended for logos with transparent backgrounds.",
      },
      {
        question: "Is my data safe when using PDFo?",
        answer:
          "Yes. All file transfers are protected with SSL encryption, and files are automatically deleted from our servers after processing.",
      },
    ],

    comparisons: [
      {
        question: "PDFo vs paid watermarking tools",
        answer:
          "PDFo allows you to add professional watermarks to PDFs online for free with full customization options, while many tools require expensive subscriptions for similar features.",
        lastUpdated: "2026-01-30",
      },
    ],

    relatedTools: [
      { key: "lock", name: "Lock PDF", path: "/lock" },
      { key: "page-numbers", name: "Add Page Numbers", path: "/page-numbers" },
      { key: "metadata", name: "Edit Metadata", path: "/metadata" },
    ],
  } as const;

export default watermarkSEO;
