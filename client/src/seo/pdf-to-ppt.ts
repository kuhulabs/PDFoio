// Auto-split from the original seo.ts so each tool page only loads its
// own SEO payload (5–15KB) instead of the full 128KB monolith.
export const pdfToPptSEO = {
    title:
      "PDF to PPT Converter - Convert PDF to PowerPoint Slides Online | PDFo",
    h1: "Convert PDF to PowerPoint (PPTX)",
    metaDescription:
      "Easily convert your PDF pages back into editable PowerPoint (PPTX) slides. High-quality conversion that preserves layouts and images for free. No signup required.",
    shortIntro:
      "Transform your static PDF documents back into dynamic, editable PowerPoint presentations.",
    intro:
      "The PDF to PPT converter by PDFo is the perfect solution for recovering lost presentation files or making last-minute changes to a PDF report. Our tool intelligently turns each PDF page into a PowerPoint slide, maintaining the original layout, images, and text positioning. This allows you to regain full editing control over your slides in Microsoft PowerPoint or Google Slides.",
    howItWorks: [
      "Upload your PDF presentation from your computer or mobile device.",
      "Our AI engine processes the document and creates a slide-based structure.",
      "The conversion engine generates a high-quality PPTX file in seconds.",
      "Download your editable PowerPoint presentation and start customizing.",
    ],
    benefits: [
      "Fully editable text, shapes, and images in the resulting slides",
      "Preserves presentation flow and original document layout",
      "High-fidelity conversion suitable for professional meetings",
      "Fast processing with no software installation or registration needed",
    ],
    faqs: [
      {
        question: "Can I edit the converted PowerPoint slides?",
        answer:
          "Yes, the resulting PPTX file is fully editable. You can modify the text, resize images, and change the slide theme just like a normal PowerPoint file.",
      },
      {
        question: "Will my images lose quality during conversion?",
        answer:
          "No, our tool extracts images at their original resolution to ensure your presentation looks professional and sharp.",
      },
      {
        question: "Does this work for scanned presentations?",
        answer:
          "Yes, our built-in OCR technology can recognize text in scanned pages and convert them into editable content on your PowerPoint slides.",
      },
    ],
    relatedTools: [
      { name: "PDF to Word", path: "/pdf-to-word" },
      { name: "Merge PDF", path: "/merge" },
      { name: "Compress PDF", path: "/compress" },
    ],
  } as const;

export default pdfToPptSEO;
