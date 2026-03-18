import { z } from 'zod';

export const roommateProfileSchema = z
  .object({
    bio: z
      .string()
      .trim()
      .min(20, 'La descripción debe tener al menos 20 caracteres')
      .max(500, 'La descripción no puede superar los 500 caracteres'),
    faculty: z.string().min(1, 'La facultad es obligatoria'),
    year: z.string().min(1, 'El año de estudios es obligatorio'),
    budget_min: z
      .number({
        required_error: 'El presupuesto mínimo es obligatorio',
        invalid_type_error: 'El presupuesto mínimo debe ser un número',
      })
      .positive('El presupuesto mínimo debe ser mayor que 0')
      .max(5000, 'El presupuesto mínimo no puede superar los 5.000 €'),
    budget_max: z
      .number({
        required_error: 'El presupuesto máximo es obligatorio',
        invalid_type_error: 'El presupuesto máximo debe ser un número',
      })
      .positive('El presupuesto máximo debe ser mayor que 0')
      .max(5000, 'El presupuesto máximo no puede superar los 5.000 €'),
    preferred_location: z
      .string()
      .min(1, 'La zona preferida es obligatoria'),
    move_date: z
      .string()
      .min(1, 'La fecha de mudanza es obligatoria')
      .refine(
        (date) => new Date(date) > new Date(),
        'La fecha de mudanza debe ser una fecha futura'
      ),
    age: z
      .number()
      .int('La edad debe ser un número entero')
      .min(16, 'La edad mínima es 16 años')
      .max(99, 'Introduce una edad válida')
      .optional()
      .nullable(),
    gender_preference: z
      .enum(['any', 'male', 'female', 'mixed'], {
        errorMap: () => ({ message: 'Preferencia de género no válida' }),
      })
      .optional()
      .nullable(),
    pets_allowed: z.boolean().optional().nullable(),
    smoking_allowed: z.boolean().optional().nullable(),
    interests: z.array(z.string()).optional().nullable(),
    lifestyle_preferences: z.record(z.unknown()).optional().nullable(),
  })
  .refine(
    (data) => data.budget_min <= data.budget_max,
    {
      message: 'El presupuesto mínimo no puede ser mayor que el máximo',
      path: ['budget_min'],
    }
  );

export type RoommateProfileFormData = z.infer<typeof roommateProfileSchema>;
