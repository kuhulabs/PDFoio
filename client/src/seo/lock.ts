// Auto-split from the original seo.ts so each tool page only loads its
// own SEO payload (5–15KB) instead of the full 128KB monolith.
export const lockSEO = {
    title: "Lock PDF - Password Protect PDF Online with AES-256 | PDFo",
    h1: "Protect PDF with Password Online",

    metaDescription:
      "Secure your PDF files with military-grade AES-256 encryption. Add a password to prevent unauthorized viewing, printing, or copying. 100% secure and free.",

    shortIntro:
      "Ensure your sensitive documents stay private with professional-level PDF encryption.",

    intro:
      "The Lock PDF tool by PDFo provides industry-standard security for your most sensitive files. Whether you are sharing legal contracts, financial statements, or personal records, our tool uses high-level AES-256 encryption to harden your document against unauthorized access. You can set a master password to restrict who can open the file and prevent others from printing or copying your content.",

    keywords: [
      "lock pdf online free",
      "password protect pdf",
      "encrypt pdf online",
      "secure pdf with password",
      "pdf encryption tool",
      "add password to pdf",
      "protect pdf online",
      "aes-256 pdf encryption",
    ],

    longTailKeywords: [
      "how to password protect pdf online free",
      "lock pdf with aes-256 encryption",
      "add password to pdf without software",
      "encrypt pdf to prevent copying",
      "secure pdf for sharing online",
    ],

    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "PDFo Lock PDF",
      description:
        "Free online tool to password protect PDFs with AES-256 encryption and prevent unauthorized access.",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Web Browser",
      url: "https://pdfo.io/lock",
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
        "AES-256 encryption",
        "Password protection",
        "Prevent printing",
        "Prevent copying",
        "Secure file sharing",
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
          name: "Lock PDF",
        },
      ],
    },

    featuredSnippet: {
      question: "How do I password protect a PDF online?",
      steps: [
        "Upload your PDF file to PDFo",
        "Enter a strong password for encryption",
        "Wait for AES-256 encryption to be applied",
        "Download your password-protected PDF",
      ],
    },

    howItWorks: [
      "Upload the PDF document you wish to secure to our encrypted server",
      "Enter a strong, unique password to lock your file",
      "Our system applies professional-grade encryption to the entire document structure",
      "Download your secure, password-protected PDF and share it with confidence",
    ],

    benefits: [
      "Military-grade AES-256 encryption for maximum data protection",
      "Prevents unauthorized viewing, printing, and text copying",
      "Fully customizable password settings for individual files",
      "Secure end-to-end processing with immediate file deletion",
      "Works smoothly on desktop and mobile devices",
      "No account or email signup required",
    ],

    faqs: [
      {
        question: "How strong is the encryption used by PDFo?",
        answer:
          "We use AES-256 bit encryption, which is the same standard used by governments and banks worldwide to protect highly sensitive data.",
      },
      {
        question: "Can I choose to restrict printing but allow viewing?",
        answer:
          "Yes, by adding a password, you apply a layer of security that locks the document permissions, making it harder for unauthorized users to print or modify your work.",
      },
      {
        question: "What happens if I forget the password I set?",
        answer:
          "For security and privacy reasons, we do not store your passwords. We recommend keeping your password in a secure place, as the file cannot be opened without it.",
      },
      {
        question: "Is my data safe when using PDFo?",
        answer:
          "Yes. All file transfers are protected with SSL encryption, and files are automatically deleted from our servers after processing.",
      },
    ],

    comparisons: [
      {
        question: "PDFo vs paid PDF encryption tools",
        answer:
          "PDFo offers free AES-256 PDF encryption online, while many professional tools require expensive subscriptions for the same level of security.",
        lastUpdated: "2026-01-30",
      },
    ],

    relatedTools: [
      { key: "unlock", name: "Unlock PDF", path: "/unlock" },
      { key: "watermark", name: "Watermark PDF", path: "/watermark" },
      { key: "metadata", name: "Edit Metadata", path: "/metadata" },
    ],
  } as const;

export default lockSEO;
