import { describe, it, expect } from 'vitest';
import { detectSpam } from '@/utils/contentModeration';

describe('Content Moderation — detectSpam', () => {
  it('should not flag normal text', () => {
    expect(detectSpam('Estoy buscando piso cerca de la universidad')).toBe(false);
  });

  it('should not flag short text', () => {
    expect(detectSpam('Hola')).toBe(false);
  });

  it('should not flag empty text', () => {
    expect(detectSpam('')).toBe(false);
  });

  it('should flag text with too many URLs', () => {
    const spam = 'Visit https://a.com https://b.com https://c.com https://d.com now!';
    expect(detectSpam(spam)).toBe(true);
  });

  it('should not flag text with 3 or fewer URLs', () => {
    const ok = 'Check https://a.com and https://b.com or https://c.com';
    expect(detectSpam(ok)).toBe(false);
  });

  it('should flag ALL CAPS text over 20 chars', () => {
    expect(detectSpam('ESTO ES SPAM TOTAL COMPRA AHORA')).toBe(true);
  });

  it('should not flag short all-caps text', () => {
    expect(detectSpam('URGENTE')).toBe(false);
  });

  it('should flag text with repeated characters', () => {
    expect(detectSpam('Holaaaaaaaaaa que tal')).toBe(true);
  });

  it('should not flag text with few repeated characters', () => {
    expect(detectSpam('Holaaa que tal')).toBe(false);
  });
});
