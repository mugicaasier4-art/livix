import { describe, it, expect } from 'vitest';
import { validateImageFile, validateDocFile, validateAttachment } from '@/utils/fileValidation';

function createMockFile(name: string, size: number, type: string): File {
  const buffer = new ArrayBuffer(size);
  return new File([buffer], name, { type });
}

describe('File Validation — validateImageFile', () => {
  it('should accept valid JPEG images', () => {
    const file = createMockFile('photo.jpg', 1024 * 1024, 'image/jpeg');
    expect(validateImageFile(file)).toBeNull();
  });

  it('should accept valid PNG images', () => {
    const file = createMockFile('photo.png', 2 * 1024 * 1024, 'image/png');
    expect(validateImageFile(file)).toBeNull();
  });

  it('should accept valid WebP images', () => {
    const file = createMockFile('photo.webp', 500 * 1024, 'image/webp');
    expect(validateImageFile(file)).toBeNull();
  });

  it('should reject non-image files', () => {
    const file = createMockFile('doc.pdf', 1024, 'application/pdf');
    expect(validateImageFile(file)).toContain('Tipo de archivo no permitido');
  });

  it('should reject executable files', () => {
    const file = createMockFile('virus.exe', 1024, 'application/x-msdownload');
    expect(validateImageFile(file)).toContain('Tipo de archivo no permitido');
  });

  it('should reject images over 5MB', () => {
    const file = createMockFile('huge.jpg', 6 * 1024 * 1024, 'image/jpeg');
    expect(validateImageFile(file)).toContain('demasiado grande');
  });

  it('should accept images exactly at 5MB', () => {
    const file = createMockFile('max.jpg', 5 * 1024 * 1024, 'image/jpeg');
    expect(validateImageFile(file)).toBeNull();
  });
});

describe('File Validation — validateDocFile', () => {
  it('should accept PDF documents', () => {
    const file = createMockFile('dni.pdf', 2 * 1024 * 1024, 'application/pdf');
    expect(validateDocFile(file)).toBeNull();
  });

  it('should accept JPEG scans', () => {
    const file = createMockFile('matricula.jpg', 1024 * 1024, 'image/jpeg');
    expect(validateDocFile(file)).toBeNull();
  });

  it('should reject Word documents', () => {
    const file = createMockFile('doc.docx', 1024, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    expect(validateDocFile(file)).toContain('Tipo de archivo no permitido');
  });

  it('should reject documents over 10MB', () => {
    const file = createMockFile('huge.pdf', 11 * 1024 * 1024, 'application/pdf');
    expect(validateDocFile(file)).toContain('demasiado grande');
  });
});

describe('File Validation — validateAttachment', () => {
  it('should accept PDF attachments', () => {
    const file = createMockFile('contract.pdf', 1024 * 1024, 'application/pdf');
    expect(validateAttachment(file)).toBeNull();
  });

  it('should accept text files', () => {
    const file = createMockFile('notes.txt', 1024, 'text/plain');
    expect(validateAttachment(file)).toBeNull();
  });

  it('should accept Word documents as attachments', () => {
    const file = createMockFile('lease.docx', 1024 * 1024, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    expect(validateAttachment(file)).toBeNull();
  });

  it('should reject HTML files', () => {
    const file = createMockFile('page.html', 1024, 'text/html');
    expect(validateAttachment(file)).toContain('Tipo de archivo no permitido');
  });

  it('should reject attachments over 10MB', () => {
    const file = createMockFile('big.pdf', 11 * 1024 * 1024, 'application/pdf');
    expect(validateAttachment(file)).toContain('demasiado grande');
  });
});
