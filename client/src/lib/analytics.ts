// Analytics — GA4 via GTM dataLayer + fallback direct gtag
// Events fire in production only; dev gets console.log

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// Push event to GTM dataLayer
function pushEvent(eventName: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...params });
}

// ── Page View ─────────────────────────────────────────────────────────────
export function trackPageView(path: string, title: string) {
  if (import.meta.env.DEV) {
    console.log('[Analytics] page_view:', path, title);
    return;
  }
  pushEvent('page_view', { page_path: path, page_title: title });
}

// ── Tool Opened ───────────────────────────────────────────────────────────
export function trackToolOpen(toolName: string) {
  if (import.meta.env.DEV) {
    console.log('[Analytics] tool_open:', toolName);
    return;
  }
  pushEvent('tool_open', { tool_name: toolName });
}

// ── File Uploaded ─────────────────────────────────────────────────────────
export function trackFileUpload(toolName: string, fileCount: number, totalSizeMB: number) {
  if (import.meta.env.DEV) {
    console.log('[Analytics] file_upload:', toolName, fileCount, totalSizeMB + 'MB');
    return;
  }
  pushEvent('file_upload', {
    tool_name: toolName,
    file_count: fileCount,
    total_size_mb: Math.round(totalSizeMB * 10) / 10,
  });
}

// ── Tool Success ──────────────────────────────────────────────────────────
export function trackToolSuccess(toolName: string, fileCount: number) {
  if (import.meta.env.DEV) {
    console.log('[Analytics] tool_success:', toolName, fileCount);
    return;
  }
  pushEvent('tool_success', { tool_name: toolName, file_count: fileCount });
}

// ── Tool Error ────────────────────────────────────────────────────────────
export function trackToolError(toolName: string, errorMessage: string) {
  if (import.meta.env.DEV) {
    console.log('[Analytics] tool_error:', toolName, errorMessage);
    return;
  }
  pushEvent('tool_error', { tool_name: toolName, error_message: errorMessage });
}

// ── File Downloaded ───────────────────────────────────────────────────────
export function trackDownload(toolName: string, fileName: string) {
  if (import.meta.env.DEV) {
    console.log('[Analytics] file_download:', toolName, fileName);
    return;
  }
  pushEvent('file_download', { tool_name: toolName, file_name: fileName });
}

// ── Backward compatible — purane trackToolUsage calls kaam karte rahe ────
export const trackToolUsage = async (
  name: string,
  _category: string,
  count: number,
) => {
  trackToolSuccess(name, count);
};
