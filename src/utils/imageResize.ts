/**
 * Client-side image resizing before upload.
 * Reduces bandwidth and storage costs while maintaining quality.
 */

interface ResizeOptions {
  maxWidth: number;
  maxHeight: number;
  quality: number;
  outputType?: 'image/jpeg' | 'image/webp';
}

const DEFAULT_OPTIONS: ResizeOptions = {
  maxWidth: 1200,
  maxHeight: 1200,
  quality: 0.85,
  outputType: 'image/jpeg',
};

const THUMBNAIL_OPTIONS: ResizeOptions = {
  maxWidth: 400,
  maxHeight: 400,
  quality: 0.75,
  outputType: 'image/jpeg',
};

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('No se pudo cargar la imagen'));
    img.src = URL.createObjectURL(file);
  });
}

function resizeWithCanvas(
  img: HTMLImageElement,
  options: ResizeOptions
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const { maxWidth, maxHeight, quality, outputType } = options;

    let { width, height } = img;

    // Only downscale, never upscale
    if (width <= maxWidth && height <= maxHeight) {
      // Convert to blob even if no resize needed (for format conversion)
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas context not available'));
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('Blob conversion failed'))),
        outputType,
        quality
      );
      return;
    }

    // Calculate new dimensions maintaining aspect ratio
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return reject(new Error('Canvas context not available'));

    // Use high-quality interpolation
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, width, height);

    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Blob conversion failed'))),
      outputType,
      quality
    );
  });
}

/**
 * Resize an image file to max 1200px width/height.
 * Returns a new File object with the resized image.
 */
export async function resizeImage(
  file: File,
  options: Partial<ResizeOptions> = {}
): Promise<File> {
  // Skip non-image files
  if (!file.type.startsWith('image/')) return file;
  // Skip GIFs (animated) and SVGs (vector)
  if (file.type === 'image/gif' || file.type === 'image/svg+xml') return file;

  const opts = { ...DEFAULT_OPTIONS, ...options };
  const img = await loadImage(file);

  try {
    const blob = await resizeWithCanvas(img, opts);
    const ext = opts.outputType === 'image/webp' ? 'webp' : 'jpg';
    const name = file.name.replace(/\.[^.]+$/, `.${ext}`);
    return new File([blob], name, { type: opts.outputType });
  } finally {
    URL.revokeObjectURL(img.src);
  }
}

/**
 * Generate a thumbnail (400px max) from an image file.
 */
export async function generateThumbnail(
  file: File,
  options: Partial<ResizeOptions> = {}
): Promise<File> {
  if (!file.type.startsWith('image/')) return file;
  if (file.type === 'image/gif' || file.type === 'image/svg+xml') return file;

  const opts = { ...THUMBNAIL_OPTIONS, ...options };
  const img = await loadImage(file);

  try {
    const blob = await resizeWithCanvas(img, opts);
    const ext = opts.outputType === 'image/webp' ? 'webp' : 'jpg';
    const name = file.name.replace(/\.[^.]+$/, `-thumb.${ext}`);
    return new File([blob], name, { type: opts.outputType });
  } finally {
    URL.revokeObjectURL(img.src);
  }
}
