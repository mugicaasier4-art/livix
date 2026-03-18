import DOMPurify from 'dompurify';

/**
 * Sanitizes user input by stripping all HTML tags.
 * Prevents XSS from stored user content.
 */
export function sanitizeUserInput(text: string): string {
  return DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
}

/**
 * Basic spam detection heuristics.
 * Returns true if the text appears to be spam.
 */
export function detectSpam(text: string): boolean {
  if (!text || text.length < 5) return false;

  // Excessive URLs (more than 3)
  const urlCount = (text.match(/https?:\/\//g) || []).length;
  if (urlCount > 3) return true;

  // All caps (more than 20 chars)
  if (text.length > 20 && text === text.toUpperCase()) return true;

  // Repeated characters (e.g. "aaaaaa")
  if (/(.)\1{9,}/.test(text)) return true;

  return false;
}
