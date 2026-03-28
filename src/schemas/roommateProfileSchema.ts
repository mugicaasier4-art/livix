import { z } from 'zod';

export const roommateProfileSchema = z
  .object({
    // Basic info
    bio: z
      .string()
      .trim()
      .min(20, 'La descripcion debe tener al menos 20 caracteres')
      .max(500, 'La descripcion no puede superar los 500 caracteres'),
    faculty: z.string().min(1, 'La facultad es obligatoria'),
    year: z.string().min(1, 'El ano de estudios es obligatorio'),
    age: z
      .number()
      .int('La edad debe ser un numero entero')
      .min(16, 'La edad minima es 16 anos')
      .max(99, 'Introduce una edad valida')
      .optional()
      .nullable(),

    // Location (national)
    city: z.string().min(1, 'La ciudad es obligatoria'),
    university: z.string().optional().nullable(),
    campus: z.string().optional().nullable(),
    preferred_location: z.string().min(1, 'La zona preferida es obligatoria'),

    // Budget
    budget_min: z
      .number({
        required_error: 'El presupuesto minimo es obligatorio',
        invalid_type_error: 'El presupuesto minimo debe ser un numero',
      })
      .positive('El presupuesto minimo debe ser mayor que 0')
      .max(5000, 'El presupuesto minimo no puede superar los 5.000 EUR'),
    budget_max: z
      .number({
        required_error: 'El presupuesto maximo es obligatorio',
        invalid_type_error: 'El presupuesto maximo debe ser un numero',
      })
      .positive('El presupuesto maximo debe ser mayor que 0')
      .max(5000, 'El presupuesto maximo no puede superar los 5.000 EUR'),

    // Dates
    move_date: z
      .string()
      .min(1, 'La fecha de mudanza es obligatoria')
      .refine(
        (date) => new Date(date) > new Date(),
        'La fecha de mudanza debe ser una fecha futura'
      ),

    // Deal-breakers
    gender_preference: z
      .enum(['any', 'male', 'female', 'mixed'], {
        errorMap: () => ({ message: 'Preferencia de genero no valida' }),
      })
      .optional()
      .nullable(),
    smoking_allowed: z.boolean().optional().nullable(),
    pets_allowed: z.boolean().optional().nullable(),

    // Scoring dimensions (Tier 2 - weight 3)
    sleep_time: z
      .number()
      .int()
      .min(0)
      .max(23)
      .optional()
      .nullable(),
    cleanliness: z
      .number()
      .int()
      .min(1)
      .max(5)
      .optional()
      .nullable(),
    noise_tolerance: z
      .number()
      .int()
      .min(1)
      .max(5)
      .optional()
      .nullable(),
    guest_frequency: z
      .number()
      .int()
      .min(1)
      .max(5)
      .optional()
      .nullable(),

    // Scoring dimensions (Tier 3 - weight 2)
    intro_extro: z
      .number()
      .int()
      .min(1)
      .max(5)
      .optional()
      .nullable(),
    study_place: z
      .enum(['home', 'library', 'cafe', 'mixed'])
      .optional()
      .nullable(),
    cooking: z
      .number()
      .int()
      .min(1)
      .max(5)
      .optional()
      .nullable(),
    expense_sharing: z
      .enum(['separate', 'basics', 'everything'])
      .optional()
      .nullable(),

    // Nice-to-haves
    party_frequency: z
      .number()
      .int()
      .min(1)
      .max(5)
      .optional()
      .nullable(),
    hobbies: z.array(z.string()).optional().nullable(),
    interests: z.array(z.string()).optional().nullable(),
    languages: z.array(z.string()).optional().nullable(),
  })
  .refine((data) => data.budget_min <= data.budget_max, {
    message: 'El presupuesto minimo no puede ser mayor que el maximo',
    path: ['budget_min'],
  });

export type RoommateProfileFormData = z.infer<typeof roommateProfileSchema>;
