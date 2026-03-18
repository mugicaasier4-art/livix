/**
 * Centralized Application types for Livix.
 * Source of truth: src/integrations/supabase/types.ts (tables.applications.Row)
 *
 * NOTE: src/data/applications.ts contains a richer mock Application interface
 * with nested relations (student, listing, timeline, docs, visits).
 * That interface is kept for UI mock data. Import from this file when
 * interacting with Supabase.
 */

/**
 * All valid statuses for an application in the Supabase `applications` table.
 * The DB stores status as a plain string; this union type enforces allowed values
 * at the TypeScript layer.
 */
export type ApplicationStatus =
  | 'enviada'
  | 'preaprobada'
  | 'pendiente_docs'
  | 'aprobada'
  | 'rechazada'
  | 'cancelada_estudiante'
  | 'expirada';

/** Mirrors applications.Row from the Supabase schema exactly. */
export interface Application {
  id: string;
  student_id: string;
  landlord_id: string;
  listing_id: string;
  /** Cast from DB string to ApplicationStatus. */
  status: ApplicationStatus;
  message: string;
  move_in_date: string;
  move_out_date: string | null;
  budget_eur: number;
  student_name: string;
  student_email: string;
  student_phone: string | null;
  is_erasmus: boolean | null;
  rejection_reason: string | null;
  paid_reservation: boolean | null;
  created_at: string;
  updated_at: string;
}

/** Payload used when submitting a new application. */
export interface CreateApplicationData {
  listing_id: string;
  landlord_id: string;
  message: string;
  move_in_date: string;
  move_out_date?: string;
  budget_eur: number;
  is_erasmus?: boolean;
}
