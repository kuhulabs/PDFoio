/**
 * Single source of truth for page chunk loaders.
 *
 * Each entry maps a route path to the dynamic import that produces its
 * page module. App.tsx wraps these with `lazy()` for routing, and
 * `prefetchPage()` calls them ahead of time when a tool link is hovered
 * or focused — by the time the user clicks, the chunk is already
 * downloaded (and parsed) so navigation feels instant.
 */

export const pageLoaders = {
  "/": () => import("@/pages/Home"),
  "/about": () => import("@/pages/About"),
  "/contact": () => import("@/pages/Contact"),
  "/api": () => import("@/pages/ApiPage"),
  "/privacy": () => import("@/pages/Privacy"),
  "/terms": () => import("@/pages/Terms"),

  "/summarize": () => import("@/pages/AISummarizer"),

  "/merge": () => import("@/pages/MergePDF"),
  "/compress": () => import("@/pages/CompressPDF"),
  "/split": () => import("@/pages/SplitPDF"),
  "/rotate": () => import("@/pages/RotatePDF"),
  "/unlock": () => import("@/pages/UnlockPDF"),
  "/lock": () => import("@/pages/LockPDF"),
  "/watermark": () => import("@/pages/WatermarkPDF"),
  "/metadata": () => import("@/pages/EditMetadata"),
  "/page-numbers": () => import("@/pages/PageNumbers"),
  "/remove-blank-pages": () => import("@/pages/RemoveBlankPages"),
  "/delete-pages": () => import("@/pages/DeletePages"),
  "/reorder": () => import("@/pages/ReorderPages"),

  "/word-to-pdf": () => import("@/pages/WordToPDF"),
  "/excel-to-pdf": () => import("@/pages/ExcelToPDF"),
  "/png-to-pdf": () => import("@/pages/PNGToPDF"),
  "/images-to-pdf": () => import("@/pages/ImagesToPDF"),

  "/pdf-to-word": () => import("@/pages/PDFToWord"),
  "/pdf-to-excel": () => import("@/pages/PDFToExcel"),
  "/pdf-to-ppt": () => import("@/pages/PDFToPPT"),
  "/pdf-to-jpg": () => import("@/pages/PDFToJPG"),
  "/pdf-to-png": () => import("@/pages/PDFToPNG"),
  "/pdf-to-tiff": () => import("@/pages/PDFToTIFF"),
  "/pdf-to-txt": () => import("@/pages/PDFToTXT"),
  "/pdf-to-json": () => import("@/pages/PDFToJSON"),
} as const satisfies Record<string, () => Promise<unknown>>;

export type PagePath = keyof typeof pageLoaders;

const inflight = new Set<string>();

/**
 * Kick off the import for a route's chunk. Safe to call repeatedly —
 * each path is only fetched once. Failures are silently ignored so a
 * dropped prefetch never breaks the eventual real navigation (which
 * will retry through `lazy()`).
 */
export function prefetchPage(path: string): void {
  if (inflight.has(path)) return;
  const loader = (pageLoaders as Record<string, (() => Promise<unknown>) | undefined>)[path];
  if (!loader) return;
  inflight.add(path);
  loader().catch(() => {
    inflight.delete(path);
  });
}
