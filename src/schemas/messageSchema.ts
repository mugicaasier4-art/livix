import { z } from 'zod';

export const messageSchema = z.object({
  content: z
    .string()
    .min(1, 'El mensaje no puede estar vacío')
    .max(2000, 'Máximo 2000 caracteres')
    .refine(
      (s) => s.trim().length > 0,
      'El mensaje no puede contener solo espacios en blanco'
    ),
  conversation_id: z.string().uuid('El ID de conversación no es válido'),
});

export type MessageFormData = z.infer<typeof messageSchema>;
