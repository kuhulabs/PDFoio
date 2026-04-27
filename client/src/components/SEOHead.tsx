import { Helmet } from "react-helmet-async";

interface FAQ {
  question: string;
  answer: string;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface ArticleData {
  publishedTime: string;
  modifiedTime?: string;
  author: string;
  section?: string;
  tags?: string[];
}

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  structuredData?: object;
  faqs?: FAQ[];
  breadcrumbs?: BreadcrumbItem[];
  articleData?: ArticleData;
  noIndex?: boolean;
  locale?: string;
}

// Site config
const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://pdfo.io';
const SITE_NAME = 'PDFo.io';
const DEFAULT_OG_IMAGE = '/og-image.jpg';

// Escape JSON-LD for security
function escapeJsonLd(data: object): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e');
}

export function SEOHead({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage = DEFAULT_OG_IMAGE,
  structuredData,
  faqs,
  breadcrumbs,
  articleData,
  noIndex = false,
  locale = 'en_US',
}: SEOHeadProps) {

  // Full URLs
  const fullCanonicalUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : SITE_URL);
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`;

  /* ---------- FAQ SCHEMA ---------- */
  const faqSchema = faqs && faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  } : null;

  /* ---------- BREADCRUMB SCHEMA ---------- */
  const breadcrumbSchema = breadcrumbs && breadcrumbs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  } : null;

  /* ---------- SOFTWARE APPLICATION SCHEMA ---------- */
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": SITE_NAME,
    "applicationCategory": "UtilitiesApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "operatingSystem": "Web Browser",
    "description": description,
    "url": fullCanonicalUrl,
  };

  return (
    <Helmet>
      {/* BASIC META */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={fullCanonicalUrl} />
      
      {/* LANGUAGE & LOCALE */}
      <html lang={locale.split('_')[0]} />
      <meta property="og:locale" content={locale} />

      {/* ROBOTS */}
      <meta
        name="robots"
        content={noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large"}
      />
      <meta name="googlebot" content={noIndex ? "noindex, nofollow" : "index, follow"} />

      {/* SECURITY */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />

      {/* OPEN GRAPH */}
      <meta property="og:type" content={articleData ? "article" : "website"} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />

      {/* ARTICLE META (if article) */}
      {articleData && (
        <>
          <meta property="article:published_time" content={articleData.publishedTime} />
          {articleData.modifiedTime && (
            <meta property="article:modified_time" content={articleData.modifiedTime} />
          )}
          <meta property="article:author" content={articleData.author} />
          {articleData.section && (
            <meta property="article:section" content={articleData.section} />
          )}
          {articleData.tags?.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* TWITTER */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />
      <meta name="twitter:image:alt" content={title} />

      {/* STRUCTURED DATA - Software Application */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: escapeJsonLd(softwareSchema),
        }}
      />

      {/* CUSTOM STRUCTURED DATA */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: escapeJsonLd(structuredData),
          }}
        />
      )}

      {/* FAQ SCHEMA */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: escapeJsonLd(faqSchema),
          }}
        />
      )}

      {/* BREADCRUMB SCHEMA */}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: escapeJsonLd(breadcrumbSchema),
          }}
        />
      )}
    </Helmet>
  );
}