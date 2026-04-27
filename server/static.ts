import express, { type Express, type Response } from "express";
import fs from "fs";
import path from "path";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(
    express.static(distPath, {
      etag: true,
      lastModified: true,
      setHeaders: (res: Response, filePath: string) => {
        // Vite emits hashed filenames into /assets/. Those are immutable —
        // a content change produces a new filename — so they can be cached
        // forever by the browser and any intermediary CDN.
        if (filePath.includes(`${path.sep}assets${path.sep}`)) {
          res.setHeader(
            "Cache-Control",
            `public, max-age=${ONE_YEAR_SECONDS}, immutable`,
          );
          return;
        }

        const ext = path.extname(filePath).toLowerCase();

        // index.html is the entry point — never cache it, otherwise users
        // get stuck on an old shell that references deleted asset hashes.
        if (ext === ".html") {
          res.setHeader(
            "Cache-Control",
            "no-cache, no-store, must-revalidate",
          );
          return;
        }

        // Other static files in /public (favicons, manifest, og-image,
        // robots, sitemap…) — cache for a day, allow revalidation.
        res.setHeader("Cache-Control", "public, max-age=86400");
      },
    }),
  );

  // SPA fallback — always send a fresh index.html so the user picks up
  // the latest hashed asset references after a deploy.
  app.use("/{*path}", (_req, res) => {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
