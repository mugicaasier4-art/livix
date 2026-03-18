/**
 * Centralized Message / Conversation types for Livix.
 * Source of truth: src/integrations/supabase/types.ts
 *   - tables.messages.Row
 *   - tables.conversations.Row
 */

/** Optional attachment stored as JSON in the messages table. */
export interface MessageAttachment {
  name: string;
  url: string;
  type: string;
  size: number;
}

/**
 * Mirrors messages.Row from the Supabase schema.
 * `attachments` is stored as JSON in the DB; it is typed here
 * as a structured array for convenience.
 */
export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean | null;
  created_at: string | null;
  attachments?: MessageAttachment[];
}

/**
 * Mirrors conversations.Row from the Supabase schema.
 * The optional nested fields (participant_1, participant_2, listing,
 * unread_count, last_message) are populated by JOIN queries in
 * useMessages.ts and are not part of the raw DB row.
 */
export interface Conversation {
  id: string;
  participant_1_id: string;
  participant_2_id: string;
  listing_id: string | null;
  last_message_at: string | null;
  is_archived_by_1: boolean | null;
  is_archived_by_2: boolean | null;
  is_muted_by_1: boolean | null;
  is_muted_by_2: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  // Joined / computed fields
  participant_1?: {
    id: string;
    name: string;
    avatar_url: string | null;
  };
  participant_2?: {
    id: string;
    name: string;
    avatar_url: string | null;
  };
  listing?: {
    id: string;
    title: string;
    images: string[];
  };
  unread_count?: number;
  last_message?: Message;
}

/** Payload to send a new message. */
export interface SendMessageData {
  conversation_id: string;
  content: string;
  files?: File[];
}
