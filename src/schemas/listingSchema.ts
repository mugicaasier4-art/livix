import { z } from 'zod';

export const listingSchema = z.object({
  // Basic Info
  propertyType: z.string().min(1, 'Selecciona un tipo de propiedad'),
  availableRooms: z.number().min(1, 'Debe haber al menos 1 habitación').max(20),
  totalRooms: z.number().min(1, 'Debe haber al menos 1 habitación').max(50),
  bathrooms: z.number().min(1, 'Debe haber al menos 1 baño').max(20),
  
  // Location
  address: z.string().trim().min(5, 'Dirección requerida').max(500),
  neighborhood: z.string().optional(),
  city: z.string().min(1, 'Ciudad requerida').max(100),
  
  // Pricing & Availability
  basePrice: z.number().min(0, 'Precio debe ser mayor a 0').max(10000),
  deposit: z.number().min(0).max(50000),
  availableFrom: z.string().min(1, 'Fecha de disponibilidad requerida'),
  minimumStay: z.string().optional(),
  
  // Description
  title: z.string()
    .trim()
    .min(10, 'El título debe tener al menos 10 caracteres')
    .max(200, 'El título es demasiado largo'),
  description: z.string()
    .trim()
    .min(50, 'La descripción debe tener al menos 50 caracteres')
    .max(5000, 'La descripción es demasiado larga'),
});

export type ListingFormData = z.infer<typeof listingSchema>;
