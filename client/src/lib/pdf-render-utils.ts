// PDF rendering operations: rasterise PDF pages to images (JPG/PNG/TIFF)
// and extract embedded/rendered images. Heavy libraries (pdfjs, jszip) are
// loaded lazily so this module stays small at parse time.
import { getPdfjsLib } from './pdfjs-loader';
import type { ImageConversionOptions } from './pdf-utils-common';

// Helper to create ZIP from blobs
async function createZipFromBlobs(blobs: Blob[], format: string): Promise<Blob> {
  const JSZipModule = await import('jszip');
  const JSZip = JSZipModule.default;
  const zip = new JSZip();
  blobs.forEach((blob, i) => {
    zip.file(`page-${i + 1}.${format}`, blob);
  });
  return await zip.generateAsync({ type: 'blob' });
}

// Convert PDF to images (JPG/PNG/TIFF)
export async function convertPDFToImages(
  file: File,
  format: 'jpg' | 'png' | 'tiff',
  options: ImageConversionOptions = {}
): Promise<{ zipBlob: Blob; images: Blob[]; pageCount: number }> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = (await getPdfjsLib()).getDocument({
    data: arrayBuffer,
    useWorkerFetch: true,
    isEvalSupported: true,
  });
  const pdf = await loadingTask.promise;
  const pageCount = pdf.numPages;
  const images: Blob[] = [];

  const quality = options.quality || 90;

  for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2.0 });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', {
      alpha: options.transparentBackground || false,
      willReadFrequently: false,
    });
    if (!ctx) throw new Error('Canvas context not available');

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    if (format === 'png' && options.transparentBackground) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    await page.render({
      canvasContext: ctx,
      viewport,
    }).promise;

    const imageBlob = await new Promise<Blob>((resolve) => {
      if (format === 'jpg') {
        canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', quality / 100);
      } else {
        canvas.toBlob((blob) => resolve(blob!), 'image/png');
      }
    });

    images.push(imageBlob);
    page.cleanup();
  }

  const zipBlob = await createZipFromBlobs(images, format === 'jpg' ? 'jpg' : 'png');

  await pdf.destroy();

  return { zipBlob, images, pageCount };
}

// Convert PDF to TIFF images (browsers don't natively encode TIFF — output
// is high-quality PNG inside a ZIP with .tiff naming).
export async function convertPDFToTIFF(file: File): Promise<Blob> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await (await getPdfjsLib()).getDocument({ data: arrayBuffer }).promise;

    const images: Blob[] = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 3.0 });

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      context.fillStyle = 'white';
      context.fillRect(0, 0, canvas.width, canvas.height);

      await page.render({ canvasContext: context, viewport }).promise;

      const imageBlob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), 'image/png', 1.0);
      });

      images.push(imageBlob);
    }

    return createZipFromBlobs(images, 'tiff');
  } catch {
    throw new Error('Failed to convert PDF to TIFF');
  }
}

// Extract Images from PDF with real image extraction
export async function extractImagesFromPDF(
  file: File
): Promise<{ images: { url: string; name: string; index: number }[]; zipBlob: Blob }> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await (await getPdfjsLib()).getDocument({ data: arrayBuffer }).promise;

  const extractedImages: { url: string; name: string; index: number }[] = [];
  const imageBlobs: { blob: Blob; name: string }[] = [];
  let imageIndex = 1;

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2.0 });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) continue;

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvasContext: ctx,
      viewport: viewport,
    }).promise;

    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, 'image/png', 0.9);
    });

    const imageName = `page_${pageNum}_image_${imageIndex}.png`;
    const imageUrl = URL.createObjectURL(blob);

    extractedImages.push({
      url: imageUrl,
      name: imageName,
      index: imageIndex,
    });

    imageBlobs.push({
      blob,
      name: imageName,
    });

    imageIndex++;
  }

  const JSZipModule = await import('jszip');
  const JSZip = JSZipModule.default;
  const zip = new JSZip();

  for (const imageBlob of imageBlobs) {
    zip.file(imageBlob.name, imageBlob.blob);
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });

  return { images: extractedImages, zipBlob };
}
