import { describe, it, expect } from 'vitest';
import { applicationSchema } from '@/schemas/applicationSchema';

describe('Application Schema Validation', () => {
  const validApplication = {
    listing_id: '550e8400-e29b-41d4-a716-446655440000',
    landlord_id: '550e8400-e29b-41d4-a716-446655440001',
    message: 'Estoy muy interesado en el alojamiento y tengo todas las referencias necesarias.',
    move_in_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    budget_eur: 450,
    is_erasmus: true,
  };

  it('should accept a valid application', () => {
    const result = applicationSchema.safeParse(validApplication);
    expect(result.success).toBe(true);
  });

  it('should reject applications with past move_in_date', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);

    const result = applicationSchema.safeParse({
      ...validApplication,
      move_in_date: pastDate.toISOString().split('T')[0],
    });
    expect(result.success).toBe(false);
  });

  it('should reject applications with negative budget', () => {
    const result = applicationSchema.safeParse({
      ...validApplication,
      budget_eur: -100,
    });
    expect(result.success).toBe(false);
  });

  it('should reject applications with zero budget', () => {
    const result = applicationSchema.safeParse({
      ...validApplication,
      budget_eur: 0,
    });
    expect(result.success).toBe(false);
  });

  it('should reject applications with budget over 5000', () => {
    const result = applicationSchema.safeParse({
      ...validApplication,
      budget_eur: 5001,
    });
    expect(result.success).toBe(false);
  });

  it('should reject applications with short message', () => {
    const result = applicationSchema.safeParse({
      ...validApplication,
      message: 'Hola',
    });
    expect(result.success).toBe(false);
  });

  it('should reject applications with invalid listing_id UUID', () => {
    const result = applicationSchema.safeParse({
      ...validApplication,
      listing_id: 'not-a-uuid',
    });
    expect(result.success).toBe(false);
  });

  it('should reject applications with invalid landlord_id UUID', () => {
    const result = applicationSchema.safeParse({
      ...validApplication,
      landlord_id: '123',
    });
    expect(result.success).toBe(false);
  });

  it('should accept applications without optional move_out_date', () => {
    const result = applicationSchema.safeParse({
      ...validApplication,
      move_out_date: undefined,
    });
    expect(result.success).toBe(true);
  });

  it('should accept applications without optional is_erasmus', () => {
    const { is_erasmus, ...withoutErasmus } = validApplication;
    const result = applicationSchema.safeParse(withoutErasmus);
    expect(result.success).toBe(true);
  });

  it('should reject applications with missing required fields', () => {
    const result = applicationSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
