/**
 * Central chat store – persists messages in localStorage so they survive
 * page refreshes and are accessible from both the roommate search and
 * the /messages page.
 *
 * Uses a tiny pub/sub so React components can subscribe to changes.
 */

export interface ChatMessage {
    id: string;
    fromMe: boolean;
    text: string;
    timestamp: string; // ISO string for serialisation
}

export type ConversationType = 'roommate' | 'landlord';

export interface StoredConversation {
    /** Matches the MockRoommate id or a custom landlord id */
    participantId: string;
    type: ConversationType;
    messages: ChatMessage[];
    unreadCount: number;
}

const STORAGE_KEY = 'livix_chat_store';

// ─── internal state ────────────────────────────────────────
let _conversations: Record<string, StoredConversation> = {};
type Listener = () => void;
const _listeners = new Set<Listener>();

// ─── helpers ───────────────────────────────────────────────
function _persist() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(_conversations));
    } catch { /* quota exceeded – ignore silently */ }
}

function _notify() {
    _listeners.forEach((fn) => fn());
}

function _load() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            _conversations = JSON.parse(raw);
        }
    } catch {
        _conversations = {};
    }
}

// Initialise on import
_load();

// ─── public API ────────────────────────────────────────────

/** Subscribe to store changes (returns unsubscribe fn) */
export function subscribe(listener: Listener): () => void {
    _listeners.add(listener);
    return () => _listeners.delete(listener);
}

/** Get all conversations */
export function getAllConversations(): Record<string, StoredConversation> {
    return _conversations;
}

/** Get messages for a specific participant */
export function getMessages(participantId: string): ChatMessage[] {
    return _conversations[participantId]?.messages ?? [];
}

/** Get conversation type */
export function getConversationType(participantId: string): ConversationType | undefined {
    return _conversations[participantId]?.type;
}

/** Add a message to a conversation */
export function addMessage(
    participantId: string,
    text: string,
    fromMe: boolean,
    type: ConversationType = 'roommate'
): ChatMessage {
    const msg: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        fromMe,
        text,
        timestamp: new Date().toISOString(),
    };

    if (!_conversations[participantId]) {
        _conversations[participantId] = {
            participantId,
            type,
            messages: [],
            unreadCount: 0,
        };
    }

    _conversations[participantId].messages.push(msg);

    // If message is received (not from me), increment unread count
    if (!fromMe) {
        _conversations[participantId].unreadCount = (_conversations[participantId].unreadCount || 0) + 1;
    }
    _persist();
    _notify();
    return msg;
}

/** Mark a conversation as read */
export function markAsRead(participantId: string) {
    if (_conversations[participantId] && _conversations[participantId].unreadCount > 0) {
        _conversations[participantId].unreadCount = 0;
        _persist();
        _notify();
    }
}

/** Get total unread conversations count (chats with > 0 unread messages) */
export function getTotalUnreadCount(): number {
    return Object.values(_conversations).filter((c) => (c.unreadCount || 0) > 0).length;
}

/** Ensure a conversation entry exists (useful for creating empty convos) */
export function ensureConversation(
    participantId: string,
    type: ConversationType = 'roommate'
) {
    if (!_conversations[participantId]) {
        _conversations[participantId] = {
            participantId,
            type,
            messages: [],
            unreadCount: 0,
        };
        _persist();
        _notify();
    }
}

/** Count conversations with at least one message */
export function activeConversationCount(): number {
    return Object.values(_conversations).filter((c) => c.messages.length > 0).length;
}

/** Seed mock landlord conversations (called once on first load) */
export function seedLandlordConversations() {
    const alreadySeeded = localStorage.getItem('livix_chat_seeded');
    if (alreadySeeded) return;

    const landlordConversations: { id: string; type: ConversationType; messages: ChatMessage[]; unreadCount: number }[] = [
        {
            id: 'landlord-carlos-lopez',
            type: 'landlord',
            unreadCount: 0,
            messages: [
                {
                    id: 'lm-1',
                    fromMe: true,
                    text: 'Hola, estoy interesado en la habitación en Romareda. ¿Sigue disponible?',
                    timestamp: '2026-02-15T10:30:00Z',
                },
                {
                    id: 'lm-2',
                    fromMe: false,
                    text: 'Hola, sí, la habitación sigue disponible. El precio es 450€/mes con gastos incluidos. ¿Te gustaría hacer una visita?',
                    timestamp: '2026-02-15T11:15:00Z',
                },
                {
                    id: 'lm-3',
                    fromMe: true,
                    text: 'Sí, me encantaría visitarla. ¿Qué horarios tienes disponibles esta semana?',
                    timestamp: '2026-02-15T12:00:00Z',
                },
                {
                    id: 'lm-4',
                    fromMe: false,
                    text: 'Puedo enseñártela mañana a las 17:00 o el jueves a las 18:00. ¿Te viene bien alguno?',
                    timestamp: '2026-02-15T14:30:00Z',
                },
            ],
        },
        {
            id: 'landlord-inmobiliaria-garcia',
            type: 'landlord',
            unreadCount: 2,
            messages: [
                {
                    id: 'lm-5',
                    fromMe: true,
                    text: 'Buenos días, vi el estudio en Centro publicado en Livix. ¿Cuándo podría visitarlo?',
                    timestamp: '2026-02-10T09:00:00Z',
                },
                {
                    id: 'lm-6',
                    fromMe: false,
                    text: 'Buenos días. Sí, el estudio sigue disponible a 520€/mes. Podemos coordinar una visita esta semana.',
                    timestamp: '2026-02-10T10:45:00Z',
                },
            ],
        },
    ];

    for (const conv of landlordConversations) {
        _conversations[conv.id] = {
            participantId: conv.id,
            type: conv.type,
            messages: conv.messages,
            unreadCount: conv.unreadCount,
        };
    }

    _persist();
    _notify();
    localStorage.setItem('livix_chat_seeded', 'true');
}
