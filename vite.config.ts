import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    target: "es2020",
    minify: "esbuild",
    cssMinify: true,
    sourcemap: false,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1500,
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("tesseract.js")) return "tesseract-vendor";
            if (id.includes("pdfjs-dist")) return "pdfjs-vendor";
            if (id.includes("pdf-lib")) return "pdflib-vendor";
            if (id.includes("xlsx")) return "xlsx-vendor";
            if (id.includes("jszip")) return "jszip-vendor";
            if (id.includes("pptxgenjs")) return "pptx-vendor";
            if (id.includes("mammoth")) return "mammoth-vendor";
            if (id.includes("@dnd-kit")) return "dnd-vendor";
            if (id.includes("@radix-ui") || id.includes("lucide-react")) return "ui-vendor";
            if (id.includes("react") || id.includes("wouter") || id.includes("@tanstack")) return "react-vendor";
          }
          const seoMatch = id.match(/[\\/]client[\\/]src[\\/]seo[\\/]([^\\/]+)\.ts$/);
          if (seoMatch) {
            return `seo-${seoMatch[1]}`;
          }
        },
      },
    },
  },
  optimizeDeps: {
    exclude: ["tesseract.js"],
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
