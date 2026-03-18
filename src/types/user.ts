/**
 * Centralized User / Auth types for Livix.
 * Source of truth:
 *   - profiles table: src/integrations/supabase/types.ts (tables.profiles.Row)
 *   - role: user_roles table (role column)
 *   - App-level User shape: src/contexts/AuthContext.tsx
 */

/**
 * Roles available in the platform.
 * Stored in the `user_roles` table (role column).
 */
export type UserRole = 'student' | 'landlord' | 'admin';

/**
 * Lightweight user representation used throughout the app (AuthContext).
 * Combines data from `profiles` + `user_roles` tables.
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

/**
 * Full profile row from the `profiles` Supabase table.
 * Use this type when fetching/updating profile data directly.
 */
export interface Profile {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  avatar_url: string | null;
  bio: string | null;
  is_verified: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

/** Data that can be updated in a user's profile. */
export interface UpdateProfileData {
  name?: string;
  phone?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
}
