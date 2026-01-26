import type { Express, Request } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import multer from "multer";
import fs from "fs";
import path from "path";
import { spawn } from "child_process";

/* =======================
   CONFIG
   ======================= */

const OUTPUT_DIR = path.resolve("output");
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/* =======================
   MULTER
   ======================= */

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

/* =======================
   GHOSTSCRIPT PRESETS
   ======================= */

const PRESETS: Record<string, string> = {
  low: "/printer",
  medium: "/ebook",
  high: "/screen",
};

/* =======================
   COMPRESS PDF
   ======================= */

async function compressPdf(
  input: string,
  output: string,
  level: string,
): Promise<void> {
  const preset = PRESETS[level] || PRESETS.medium;

  const args = [
    "-sDEVICE=pdfwrite",
    "-dSAFER",
    "-dCompatibilityLevel=1.4",
    `-dPDFSETTINGS=${preset}`,
    "-dNOPAUSE",
    "-dBATCH",
    "-dQUIET",
    `-sOutputFile=${output}`,
    input,
  ];

  return new Promise((resolve, reject) => {
    const gs = spawn("gs", args);

    let stderr = "";
    gs.stderr.on("data", (d) => (stderr += d.toString()));

    gs.on("close", (code) => {
      if (code !== 0) {
        console.error("Ghostscript compress error:", stderr);
        reject(new Error(stderr));
      } else {
        resolve();
      }
    });
  });
}

/* =======================
   LOCK PDF (AES-256)
   ======================= */

async function lockPdf(
  input: string,
  output: string,
  password: string,
): Promise<void> {
  const args = [
    "-sDEVICE=pdfwrite",
    "-dSAFER",
    "-dCompatibilityLevel=1.7",
    "-dNOPAUSE",
    "-dBATCH",
    "-dQUIET",

    `-sUserPassword=${password}`,
    `-sOwnerPassword=${password}`,
    "-dPermissions=-4",

    `-sOutputFile=${output}`,
    input,
  ];

  return new Promise((resolve, reject) => {
    const gs = spawn("gs", args);

    let stderr = "";
    gs.stderr.on("data", (d) => (stderr += d.toString()));

    gs.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(stderr || "Ghostscript failed"));
      } else {
        resolve();
      }
    });
  });
}

/* =======================
   UNLOCK PDF
   ======================= */

function isValidPdf(filePath: string): boolean {
  try {
    const data = fs.readFileSync(filePath, "utf8");

    // Real PDF must contain page objects
    if (!data.includes("/Type /Page")) return false;

    const stats = fs.statSync(filePath);
    if (stats.size < 2048) return false;

    return true;
  } catch {
    return false;
  }
}

async function isPermissionOnlyPdf(filePath: string): Promise<boolean> {
  return new Promise((resolve) => {
    const qpdf = spawn("qpdf", ["--show-encryption", filePath]);

    let output = "";
    qpdf.stdout.on("data", (d) => (output += d.toString()));

    qpdf.on("close", () => {
      // If user password is empty but encryption exists → permissions only
      if (
        output.includes("user password:") &&
        (output.includes("user password: ") || output.includes("user password: ''"))
      ) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

async function verifyPdfPassword(
  input: string,
  password: string,
): Promise<boolean> {
  return new Promise((resolve) => {
    const qpdf = spawn("qpdf", ["--password=" + password, "--check", input]);

    qpdf.on("close", (code) => {
      resolve(code === 0);
    });
  });
}

async function unlockPdf(
  input: string,
  output: string,
  password: string,
): Promise<void> {
  const args = [
    "-sDEVICE=pdfwrite",
    "-dSAFER",
    "-dCompatibilityLevel=1.7",
    "-dNOPAUSE",
    "-dBATCH",
    "-dQUIET",
    `-sPDFPassword=${password}`,
    `-sOutputFile=${output}`,
    input,
  ];

  return new Promise((resolve, reject) => {
    const gs = spawn("gs", args);

    let stderr = "";

    gs.stderr.on("data", (d) => {
      stderr += d.toString();
    });

    gs.on("close", (code) => {
      if (
        code !== 0 ||
        stderr.toLowerCase().includes("password") ||
        stderr.toLowerCase().includes("error")
      ) {
        return reject(new Error("Incorrect password"));
      }

      resolve();
    });
  });
}

/* =======================
   ROUTES
   ======================= */

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  /* ---------- LOCK PDF ---------- */
  app.post(
    "/api/pdf/lock",
    upload.single("file"),
    async (req: Request, res) => {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const inputPath = path.resolve(req.file.path);
      const outputPath = path.join(OUTPUT_DIR, `locked-${Date.now()}.pdf`);
      const password = String(req.body.password || "");

      if (password.length < 3) {
        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
        return res.status(400).json({ error: "Password too short" });
      }

      try {
        await lockPdf(inputPath, outputPath, password);

        res.download(outputPath, "locked.pdf", () => {
          if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
          if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        });
      } catch (err) {
        console.error("Lock error:", err);
        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
        res.status(500).json({
          error: err instanceof Error ? err.message : "PDF encryption failed",
        });
      }
    },
  );

  /* ---------- UNLOCK PDF ---------- */
  app.post(
    "/api/pdf/unlock",
    upload.single("pdf"),
    async (req: Request, res) => {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const inputPath = path.resolve(req.file.path);
      const outputPath = path.join(OUTPUT_DIR, `unlocked-${Date.now()}.pdf`);
      const password = String(req.body.password || "");

      try {
        // 🚫 CASE 1: Permissions-only PDF
        if (await isPermissionOnlyPdf(inputPath)) {
          throw new Error("PERMISSIONS_ONLY");
        }

        // 🔐 CASE 2: Real password-protected PDF
        const isValid = await verifyPdfPassword(inputPath, password);
        if (!isValid) {
          throw new Error("WRONG_PASSWORD");
        }

        // 🔓 STEP 2: UNLOCK WITH GHOSTSCRIPT
        await unlockPdf(inputPath, outputPath, password);

        res.download(outputPath, "unlocked.pdf", () => {
          fs.existsSync(inputPath) && fs.unlinkSync(inputPath);
          fs.existsSync(outputPath) && fs.unlinkSync(outputPath);
        });
      } catch (err: any) {
        fs.existsSync(inputPath) && fs.unlinkSync(inputPath);
        fs.existsSync(outputPath) && fs.unlinkSync(outputPath);

        if (err.message === "PERMISSIONS_ONLY") {
          return res.status(400).json({
            error:
              "This PDF does not require a password to open. It only has editing restrictions.",
          });
        }

        return res.status(401).json({
          error: "Unable to open PDF. The password may be incorrect.",
        });
      }
    },
  );

  /* ---------- COMPRESS PDF ---------- */
  app.post(
    "/api/compress-pdf",
    upload.single("file"),
    async (req: Request, res) => {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const inputPath = path.resolve(req.file.path);
      const outputPath = path.join(OUTPUT_DIR, `${Date.now()}-compressed.pdf`);

      try {
        const level = String(req.body.level || "medium");
        await compressPdf(inputPath, outputPath, level);

        res.download(outputPath, "compressed.pdf", () => {
          if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
          if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        });
      } catch (err) {
        console.error("Compression error:", err);
        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
        res.status(500).json({
          error: err instanceof Error ? err.message : "Compression failed",
        });
      }
    },
  );

  /* ---------- NEWSLETTER ---------- */
  app.post(api.newsletter.subscribe.path, async (req, res) => {
    try {
      const input = api.newsletter.subscribe.input.parse(req.body);

      const existing = await storage.getSubscriberByEmail(input.email);
      if (existing) {
        return res.status(409).json({ message: "Email already subscribed" });
      }

      const subscriber = await storage.createSubscriber(input);
      res.status(201).json(subscriber);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }
      throw err;
    }
  });

  return httpServer;
}
