import { z } from 'zod';

export const applicationSchema = z.object({
  listing_id: z.string().uuid('El ID del alojamiento no es válido'),
  landlord_id: z.string().uuid('El ID del propietario no es válido'),
  message: z
    .string()
    .min(20, 'El mensaje debe tener al menos 20 caracteres')
    .max(1000, 'El mensaje no puede superar los 1000 caracteres'),
  move_in_date: z
    .string()
    .min(1, 'La fecha de entrada es obligatoria')
    .refine(
      (dateStr) => !isNaN(new Date(dateStr).getTime()),
      'La fecha no es válida'
    )
    .refine(
      (dateStr) => {
        const date = new Date(dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
      },
      'La fecha de entrada debe ser hoy o una fecha futura'
    ),
  move_out_date: z
    .string()
    .optional()
    .refine(
      (dateStr) => {
        if (!dateStr) return true;
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
      },
      'La fecha de salida debe ser válida y futura'
    ),
  budget_eur: z
    .number({
      required_error: 'El presupuesto es obligatorio',
      invalid_type_error: 'El presupuesto debe ser un número',
    })
    .positive('El presupuesto debe ser mayor que 0')
    .max(5000, 'El presupuesto no puede superar los 5.000 €'),
  is_erasmus: z.boolean().optional(),
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;
