import * as pdfjsLib from "pdfjs-dist";
import { generatePDFThumbnail } from "./pdfThumbnails";
import { initializePDFJS } from "./pdf-worker-config";

interface ThumbnailOptions {
  scale?: number;
  format?: "jpeg" | "png";
  quality?: number;
  useOffscreenCanvas?: boolean;
}

interface CacheEntry<T> {
  value: T;
  size: number;
  expiresAt: number;
}

class LRUCache<T> {
  private store = new Map<string, CacheEntry<T>>();
  constructor(
    private maxEntries: number,
    private ttlMs: number,
  ) {}

  get(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    this.store.delete(key);
    this.store.set(key, entry);
    return entry.value;
  }

  set(key: string, value: T, size = 1): void {
    if (this.store.has(key)) this.store.delete(key);
    this.store.set(key, {
      value,
      size,
      expiresAt: Date.now() + this.ttlMs,
    });
    while (this.store.size > this.maxEntries) {
      const oldestKey = this.store.keys().next().value;
      if (oldestKey === undefined) break;
      this.store.delete(oldestKey);
    }
  }

  clear(): void {
    this.store.clear();
  }

  get count(): number {
    return this.store.size;
  }
}

const fileFingerprint = (file: File, extra = ""): string =>
  `${file.name}::${file.size}::${file.lastModified}::${extra}`;

const THUMBNAIL_TTL_MS = 10 * 60 * 1000;
const THUMBNAIL_MAX_ENTRIES = 50;

const OPERATION_TTL_MS = 5 * 60 * 1000;
const OPERATION_MAX_ENTRIES = 100;

const thumbnailCache = new LRUCache<string>(
  THUMBNAIL_MAX_ENTRIES,
  THUMBNAIL_TTL_MS,
);
const operationCache = new LRUCache<unknown>(
  OPERATION_MAX_ENTRIES,
  OPERATION_TTL_MS,
);
const inflightOperations = new Map<string, Promise<unknown>>();

export class PDFPerformanceOptimizer {
  static async generateOptimizedThumbnail(
    file: File,
    options: ThumbnailOptions = {},
  ): Promise<string> {
    const cacheKey = fileFingerprint(
      file,
      `s${options.scale ?? 1}q${options.quality ?? "d"}f${options.format ?? "webp"}`,
    );

    const cached = thumbnailCache.get(cacheKey);
    if (cached) return cached;

    const thumbnail = await generatePDFThumbnail(file, 1);
    if (!thumbnail.thumbnailUrl) {
      throw new Error(thumbnail.error || "Failed to generate thumbnail");
    }

    thumbnailCache.set(cacheKey, thumbnail.thumbnailUrl);
    return thumbnail.thumbnailUrl;
  }

  static async processWithMemoryManagement<T>(
    operation: () => Promise<T>,
  ): Promise<T> {
    try {
      return await operation();
    } finally {
      if (typeof window !== "undefined" && "gc" in window) {
        try {
          (window as unknown as { gc?: () => void }).gc?.();
        } catch {
          /* gc not exposed — ignore */
        }
      }
    }
  }

  static async cacheOperation<T>(
    key: string,
    operation: () => Promise<T>,
  ): Promise<T> {
    const cached = operationCache.get(key) as T | undefined;
    if (cached !== undefined) return cached;

    const inflight = inflightOperations.get(key) as Promise<T> | undefined;
    if (inflight) return inflight;

    const promise = (async () => {
      try {
        const result = await operation();
        operationCache.set(key, result);
        return result;
      } finally {
        inflightOperations.delete(key);
      }
    })();

    inflightOperations.set(key, promise);
    return promise;
  }

  static clearCaches(): void {
    thumbnailCache.clear();
    operationCache.clear();
    inflightOperations.clear();
  }

  static getCacheStats() {
    return {
      thumbnails: thumbnailCache.count,
      operations: operationCache.count,
      inflight: inflightOperations.size,
    };
  }

  static async initializeOptimizedWorker() {
    initializePDFJS();
    return pdfjsLib;
  }
}
