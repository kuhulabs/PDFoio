// Auto-split from the original seo.ts so each tool page only loads its
// own SEO payload (5–15KB) instead of the full 128KB monolith.
export const unlockSEO = {
    title: "Unlock PDF - Remove Password & PDF Restrictions Online | PDFo",
    h1: "Unlock Protected PDF Online",

    metaDescription:
      "Remove password security, printing, and copying restrictions from PDF files online. Decrypt your PDFs instantly for free. Fast, secure, and easy to use.",

    shortIntro:
      "Instantly remove PDF passwords and gain full access to view, print, or edit your files.",

    intro:
      "The Unlock PDF tool by PDFo is designed to help you regain control over your secured documents. Whether you have an owner-protected file that prevents printing and copying or a password-protected PDF that you can no longer open, our decryption engine can strip away those restrictions in seconds. Regain the ability to edit and share your files without any technical hassle.",

    keywords: [
      "unlock pdf online free",
      "remove pdf password",
      "decrypt pdf online",
      "unlock protected pdf",
      "remove pdf restrictions",
      "pdf password remover",
      "unlock pdf without password",
      "pdf decryption tool",
    ],

    longTailKeywords: [
      "how to unlock pdf online free",
      "remove password from pdf without knowing password",
      "unlock pdf for printing and editing",
      "decrypt password protected pdf online",
      "remove pdf owner password online",
    ],

    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "PDFo Unlock PDF",
      description:
        "Free online tool to unlock password-protected PDFs and remove printing, copying, and editing restrictions.",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Web Browser",
      url: "https://pdfo.io/unlock",
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
        "Remove PDF passwords",
        "Unlock printing restrictions",
        "Remove copying restrictions",
        "Decrypt encrypted PDFs",
        "Fast processing",
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
          name: "Unlock PDF",
        },
      ],
    },

    featuredSnippet: {
      question: "How do I unlock a password-protected PDF online?",
      steps: [
        "Upload your password-protected PDF to PDFo",
        "Enter the password if required for decryption",
        "Wait for the unlocking process to complete",
        "Download your unlocked PDF with full access",
      ],
    },

    howItWorks: [
      "Upload the password-protected or restricted PDF document from your device",
      "If the file has a strong User Password, enter it to authorize the decryption",
      "Our system processes the file to remove all security permissions and encryption",
      "Download your fully unlocked PDF file and use it without any further restrictions",
    ],

    benefits: [
      "Remove printing, copying, and editing restrictions instantly",
      "Easy access to secured documents without needing a permanent password",
      "High success rate in decrypting various PDF encryption standards",
      "Secure SSL processing—your passwords and files are never stored",
      "Works smoothly on desktop and mobile devices",
      "No account or email signup required",
    ],

    faqs: [
      {
        question: "Can I unlock a PDF if I don't know the user password?",
        answer:
          "If the PDF is protected with a strong 'Open Password,' you must provide it once to unlock the file. However, our tool can often remove 'Owner Passwords' (which restrict printing/copying) without needing the password.",
      },
      {
        question: "Is it legal to unlock a PDF document?",
        answer:
          "You should only unlock files for which you have the legal right or ownership. PDFo is a tool for users to access their own secured documents or those they are authorized to use.",
      },
      {
        question: "Will the content of my PDF be safe during decryption?",
        answer:
          "Yes, your file is processed via a secure connection and is automatically deleted from our servers once the unlocking process is complete.",
      },
      {
        question: "Is my data safe when using PDFo?",
        answer:
          "Yes. All file transfers are protected with SSL encryption, and files are automatically deleted from our servers after processing.",
      },
    ],

    comparisons: [
      {
        question: "PDFo vs desktop PDF unlockers",
        answer:
          "PDFo allows you to unlock PDFs online for free without installing software, while desktop tools often require expensive licenses or complex installations.",
        lastUpdated: "2026-01-30",
      },
    ],

    relatedTools: [
      { key: "lock", name: "Lock PDF", path: "/lock" },
      { key: "merge", name: "Merge PDF", path: "/merge" },
      { key: "metadata", name: "Edit Metadata", path: "/metadata" },
    ],
  } as const;

export default unlockSEO;
