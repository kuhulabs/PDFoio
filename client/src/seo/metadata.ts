// Auto-split from the original seo.ts so each tool page only loads its
// own SEO payload (5–15KB) instead of the full 128KB monolith.
export const metadataSEO = {
    title: "Edit PDF Metadata - Change PDF Properties Online for Free | PDFo",
    h1: "Edit PDF Metadata & Properties",

    metaDescription:
      "Change the title, author, subject, and keywords of your PDF files. Update internal document properties for better organization and SEO. Fast and secure.",

    shortIntro:
      "Easily update or remove the internal hidden information of your PDF documents.",

    intro:
      "The Edit PDF Metadata tool by PDFo gives you full control over the hidden properties of your files. Metadata is essential for document indexing and professional presentation; it determines how your file appears in search results and file explorers. Whether you need to standardize your company's document properties, update an old author name, or improve your PDF's SEO, our tool makes it simple and fast.",

    keywords: [
      "edit pdf metadata online",
      "change pdf properties",
      "pdf metadata editor",
      "update pdf title author",
      "edit pdf document properties",
      "change pdf info",
      "pdf metadata remover",
      "edit pdf details",
    ],

    longTailKeywords: [
      "how to edit pdf metadata online free",
      "change pdf author and title online",
      "remove metadata from pdf for privacy",
      "update pdf document properties online",
      "edit pdf file information",
    ],

    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "PDFo Edit PDF Metadata",
      description:
        "Free online tool to edit and update PDF metadata including title, author, subject, and keywords for better organization and SEO.",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Web Browser",
      url: "https://pdfo.io/metadata",
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
        "Edit PDF title and author",
        "Update subject and keywords",
        "Remove metadata for privacy",
        "SEO optimization",
        "Batch metadata editing",
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
          name: "Edit Metadata",
        },
      ],
    },

    featuredSnippet: {
      question: "How do I edit PDF metadata online?",
      steps: [
        "Upload your PDF file to PDFo",
        "Update the title, author, subject, and keywords fields",
        "Review the new properties",
        "Click 'Apply Changes' and download your updated PDF",
      ],
    },

    howItWorks: [
      "Upload the PDF document you wish to edit from your device",
      "Update the form fields including Title, Author, Subject, and Keywords",
      "Review the new properties to ensure all internal information is correct",
      "Click 'Apply Changes' and download your PDF with updated metadata",
    ],

    benefits: [
      "Improved document organization and professional appearance",
      "SEO-friendly PDFs that rank better in search results",
      "Privacy cleanup by removing personal info from document properties",
      "Standardize properties across multiple business documents",
      "Works smoothly on desktop and mobile devices",
      "No account or email signup required",
    ],

    faqs: [
      {
        question: "Why should I edit PDF metadata?",
        answer:
          "Editing metadata ensures that when people find your file online or in a folder, they see the correct Title and Author rather than a random file name. It also helps with SEO and professional branding.",
      },
      {
        question: "Does changing metadata affect the content of the PDF?",
        answer:
          "No, changing metadata only updates the internal properties (tags) of the file. Your text, images, and layout remain exactly the same.",
      },
      {
        question: "Can I remove metadata for privacy reasons?",
        answer:
          "Yes! You can clear the fields to remove the original creator's name or the software used to create the PDF, which is a great way to protect your privacy before sharing files.",
      },
      {
        question: "Is my data safe when using PDFo?",
        answer:
          "Yes. All file transfers are protected with SSL encryption, and files are automatically deleted from our servers after processing.",
      },
    ],

    comparisons: [
      {
        question: "PDFo vs desktop PDF metadata editors",
        answer:
          "PDFo allows you to edit PDF metadata online for free without installing software, while desktop tools often require expensive licenses or complex installations.",
        lastUpdated: "2026-01-30",
      },
    ],

    relatedTools: [
      { key: "merge", name: "Merge PDF", path: "/merge" },
      { key: "compress", name: "Compress PDF", path: "/compress" },
      { key: "lock", name: "Lock PDF", path: "/lock" },
    ],
  } as const;

export default metadataSEO;
