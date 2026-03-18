import { z } from 'zod';

export const reviewSchema = z.object({
  listing_id: z.string().uuid('El ID del alojamiento no es válido'),
  landlord_id: z.string().uuid('El ID del propietario no es válido'),
  rating: z
    .number({
      required_error: 'La puntuación es obligatoria',
      invalid_type_error: 'La puntuación debe ser un número',
    })
    .int('La puntuación debe ser un número entero')
    .min(1, 'La puntuación mínima es 1')
    .max(5, 'La puntuación máxima es 5'),
  comment: z
    .string()
    .trim()
    .min(10, 'El comentario debe tener al menos 10 caracteres')
    .max(2000, 'El comentario no puede superar los 2000 caracteres'),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;
