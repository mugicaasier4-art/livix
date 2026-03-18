/**
 * File validation utilities for uploads.
 * Validates MIME type and file size before uploading to Supabase Storage.
 */

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_DOC_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const ALLOWED_ATTACHMENT_TYPES = [
  'application/pdf',
  'image/jpeg', 'image/png', 'image/webp', 'image/gif',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

// Magic byte signatures for validating actual file content
const MAGIC_BYTES: Record<string, number[][]> = {
  'image/jpeg': [[0xFF, 0xD8, 0xFF]],
  'image/png': [[0x89, 0x50, 0x4E, 0x47]],
  'image/webp': [[0x52, 0x49, 0x46, 0x46]], // RIFF header
  'image/gif': [[0x47, 0x49, 0x46, 0x38]], // GIF8
};

/**
 * Validates actual file content by checking magic bytes.
 * Prevents MIME type spoofing (e.g. renaming .exe to .jpg).
 */
export async function validateFileContent(file: File): Promise<boolean> {
  const header = await file.slice(0, 12).arrayBuffer();
  const bytes = new Uint8Array(header);

  const allowedSignatures = MAGIC_BYTES[file.type];
  if (!allowedSignatures) return false;

  return allowedSignatures.some(signature =>
    signature.every((byte, index) => bytes[index] === byte)
  );
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_DOC_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024; // 10MB

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Validates an image file (listings, avatars).
 * Returns error message or null if valid.
 */
export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return `Tipo de archivo no permitido: ${file.type}. Solo se permiten: JPEG, PNG, WebP, GIF.`;
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return `El archivo es demasiado grande (${formatSize(file.size)}). Máximo: ${formatSize(MAX_IMAGE_SIZE)}.`;
  }
  return null;
}

/**
 * Validates a document file (DNI, matrícula, etc.).
 * Returns error message or null if valid.
 */
export function validateDocFile(file: File): string | null {
  if (!ALLOWED_DOC_TYPES.includes(file.type)) {
    return `Tipo de archivo no permitido: ${file.type}. Solo se permiten: PDF, JPEG, PNG.`;
  }
  if (file.size > MAX_DOC_SIZE) {
    return `El archivo es demasiado grande (${formatSize(file.size)}). Máximo: ${formatSize(MAX_DOC_SIZE)}.`;
  }
  return null;
}

/**
 * Validates a message attachment.
 * Returns error message or null if valid.
 */
export function validateAttachment(file: File): string | null {
  if (!ALLOWED_ATTACHMENT_TYPES.includes(file.type)) {
    return `Tipo de archivo no permitido: ${file.type}. Solo se permiten: imágenes, PDF, documentos de texto.`;
  }
  if (file.size > MAX_ATTACHMENT_SIZE) {
    return `El archivo es demasiado grande (${formatSize(file.size)}). Máximo: ${formatSize(MAX_ATTACHMENT_SIZE)}.`;
  }
  return null;
}
