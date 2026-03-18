import { z } from 'zod';

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede superar los 100 caracteres'),
  phone: z
    .string()
    .trim()
    .refine(
      (val) => {
        if (!val || val === '') return true;
        const cleaned = val.replace(/[\s\-\.]/g, '');
        return /^(\+34|0034|34)?[6789]\d{8}$/.test(cleaned);
      },
      'Introduce un número de teléfono español válido (ej: +34 612 345 678)'
    )
    .optional()
    .or(z.literal('')),
  bio: z
    .string()
    .max(500, 'La biografía no puede superar los 500 caracteres')
    .optional(),
  avatar_url: z.string().url('La URL del avatar no es válida').optional().or(z.literal('')),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
