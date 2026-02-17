import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, MessageSquare, ArrowLeft, Send, Users, Home,
    CheckCircle2, GraduationCap, Building2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Header from '@/components/layout/Header';
import {
    getAllConversations,
    getMessages,
    addMessage,
    subscribe,
    seedLandlordConversations,
    markAsRead,
    getTotalUnreadCount,
    type ChatMessage,
    type StoredConversation,
    type ConversationType,
} from '@/stores/chatStore';
import { mockRoommates, type MockRoommate } from '@/data/mockRoommates';

// ─── Landlord "profiles" for the demo ───────────────────────
interface LandlordProfile {
    id: string;
    name: string;
    image: string;
    listing: string;
    price: string;
    neighborhood: string;
}

const landlordProfiles: Record<string, LandlordProfile> = {
    'landlord-carlos-lopez': {
        id: 'landlord-carlos-lopez',
        name: 'Carlos López',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
        listing: 'Habitación luminosa en Romareda',
        price: '450€/mes',
        neighborhood: 'Romareda',
    },
    'landlord-inmobiliaria-garcia': {
        id: 'landlord-inmobiliaria-garcia',
        name: 'Inmobiliaria García',
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
        listing: 'Estudio moderno Centro',
        price: '520€/mes',
        neighborhood: 'Centro',
    },
};

// ─── Filter type ────────────────────────────────────────────
type FilterTab = 'all' | 'roommate' | 'landlord';

// ─── Helpers ────────────────────────────────────────────────
function getDisplayInfo(conv: StoredConversation) {
    if (conv.type === 'roommate') {
        const profile = mockRoommates.find((r) => r.id === conv.participantId);
        if (!profile) return null;
        return {
            name: `${profile.name}, ${profile.age}`,
            image: profile.image,
            subtitle: profile.studies,
            type: 'roommate' as const,
            verified: profile.verified,
            profile,
        };
    }
    const lp = landlordProfiles[conv.participantId];
    if (!lp) return null;
    return {
        name: lp.name,
        image: lp.image,
        subtitle: `${lp.listing} • ${lp.neighborhood} • ${lp.price}`,
        type: 'landlord' as const,
        verified: true,
        landlord: lp,
    };
}

function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
    });
}

function formatDateLabel(iso: string) {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

// ═════════════════════════════════════════════════════════════
//  TEST MESSAGES PAGE (Full Width)
// ═════════════════════════════════════════════════════════════
const TestMessages = () => {
    const navigate = useNavigate();

    // Seed landlord demo data on first load
    useEffect(() => {
        seedLandlordConversations();
    }, []);

    // ─── State ──────────────────────────────────────────────
    const [conversations, setConversations] = useState<
        { id: string; conv: StoredConversation; display: NonNullable<ReturnType<typeof getDisplayInfo>> }[]
    >([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [filter, setFilter] = useState<FilterTab>('all');
    const [searchQ, setSearchQ] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Load conversations from store
    const refreshConvs = () => {
        const raw = getAllConversations();
        const list = Object.entries(raw)
            .map(([id, conv]) => {
                const display = getDisplayInfo(conv);
                if (!display || conv.messages.length === 0) return null;
                return { id, conv, display };
            })
            .filter(Boolean) as typeof conversations;

        // Sort by latest message timestamp (newest first)
        list.sort((a, b) => {
            const aLast = a.conv.messages[a.conv.messages.length - 1]?.timestamp ?? '';
            const bLast = b.conv.messages[b.conv.messages.length - 1]?.timestamp ?? '';
            return bLast.localeCompare(aLast);
        });

        setConversations(list);
    };

    useEffect(() => {
        refreshConvs();
        const unsub = subscribe(() => refreshConvs());
        return unsub;
    }, []);

    // Update messages when active conversation changes
    useEffect(() => {
        if (activeId) {
            setMessages(getMessages(activeId));
        } else {
            setMessages([]);
        }
    }, [activeId]);

    // Subscribe to new messages in active conversation
    useEffect(() => {
        if (!activeId) return;
        const unsub = subscribe(() => {
            setMessages(getMessages(activeId));
        });
        return unsub;
    }, [activeId]);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Auto-focus input on active change
    useEffect(() => {
        if (activeId) inputRef.current?.focus();
    }, [activeId]);

    // Filter & search
    const filteredConvs = conversations.filter((c) => {
        if (filter !== 'all' && c.conv.type !== filter) return false;
        if (searchQ) {
            const q = searchQ.toLowerCase();
            return (
                c.display.name.toLowerCase().includes(q) ||
                c.display.subtitle.toLowerCase().includes(q)
            );
        }
        return true;
    });

    const activeConv = conversations.find((c) => c.id === activeId);

    // Send
    const handleSend = () => {
        const text = inputValue.trim();
        if (!text || !activeId || !activeConv) return;
        addMessage(activeId, text, true, activeConv.conv.type);
        setInputValue('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Counts for tabs
    const roommateCount = conversations.filter((c) => c.conv.type === 'roommate').length;
    const landlordCount = conversations.filter((c) => c.conv.type === 'landlord').length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50/60 via-background to-indigo-50/40">
            <Header />

            <div className="h-[calc(100dvh-64px)] flex flex-col pt-16">
                {/* ── Split pane container ── */}
                <div className="flex-1 flex overflow-hidden w-full bg-background">

                    {/* ═══ LEFT PANE: Conversations list ═══ */}
                    <div className={cn(
                        "w-full md:w-96 flex-shrink-0 flex flex-col border-r border-border/30 bg-white",
                        activeId && "hidden md:flex"
                    )}>
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-primary via-blue-500 to-blue-600">
                            <div className="flex items-center justify-between mb-3">
                                <h1 className="text-xl font-black text-white">Mis mensajes</h1>
                                <div className="flex gap-2">
                                    {getTotalUnreadCount() > 0 && (
                                        <Badge className="bg-red-500 text-white border-0 text-xs animate-pulse">
                                            {getTotalUnreadCount()} nuevos
                                        </Badge>
                                    )}
                                    <Badge className="bg-white/20 text-white border-0 text-xs">
                                        {conversations.length} chats
                                    </Badge>
                                </div>
                            </div>

                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 pointer-events-none" />
                                <Input
                                    placeholder="Buscar conversación..."
                                    value={searchQ}
                                    onChange={(e) => setSearchQ(e.target.value)}
                                    className="pl-10 h-10 rounded-full bg-white/15 border-0 text-white placeholder:text-white/50 focus-visible:ring-white/30 text-sm"
                                />
                            </div>
                        </div>

                        {/* Filter tabs */}
                        <div className="flex border-b border-border/30 bg-muted/20">
                            {([
                                { key: 'all' as const, label: 'Todos', icon: MessageSquare, count: conversations.length },
                                { key: 'roommate' as const, label: 'Compañeros', icon: Users, count: roommateCount },
                                { key: 'landlord' as const, label: 'Propietarios', icon: Building2, count: landlordCount },
                            ]).map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setFilter(tab.key)}
                                    className={cn(
                                        "flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-all border-b-2",
                                        filter === tab.key
                                            ? "border-primary text-primary bg-primary/5"
                                            : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                                    )}
                                >
                                    <tab.icon className="h-3.5 w-3.5" />
                                    {tab.label}
                                    {tab.count > 0 && (
                                        <span className={cn(
                                            "min-w-[18px] h-[18px] rounded-full text-[10px] font-bold flex items-center justify-center px-1",
                                            filter === tab.key ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                                        )}>
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Conversation items */}
                        <div className="flex-1 overflow-y-auto">
                            {filteredConvs.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                        <MessageSquare className="w-8 h-8 text-primary/50" />
                                    </div>
                                    <h3 className="font-bold text-foreground mb-1">Sin conversaciones</h3>
                                    <p className="text-sm text-muted-foreground max-w-[280px] leading-relaxed">
                                        {filter === 'all'
                                            ? 'Envía un mensaje desde el perfil de un compañero o la ficha de un piso para empezar.'
                                            : filter === 'roommate'
                                                ? 'No tienes chats con compañeros todavía. Busca compañeros y envía un mensaje.'
                                                : 'No tienes chats con propietarios todavía. Contacta un propietario desde la ficha de un piso.'}
                                    </p>
                                    <Button
                                        className="mt-6 rounded-full"
                                        onClick={() => navigate('/roommates/search')}
                                    >
                                        Buscar compañeros
                                    </Button>
                                </div>
                            ) : (
                                filteredConvs.map((c) => {
                                    const lastMsg = c.conv.messages[c.conv.messages.length - 1];
                                    const isActive = activeId === c.id;

                                    return (
                                        <button
                                            key={c.id}
                                            onClick={() => {
                                                setActiveId(c.id);
                                                markAsRead(c.id);
                                            }}
                                            className={cn(
                                                "w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/30 transition-all text-left border-b border-border/15",
                                                isActive && "bg-primary/5 border-l-[3px] border-l-primary"
                                            )}
                                        >
                                            {/* Avatar */}
                                            <div className="relative flex-shrink-0">
                                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/10 shadow-sm">
                                                    <img
                                                        src={c.display.image}
                                                        alt={c.display.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2 mb-0.5">
                                                    <div className="flex items-center gap-1.5 min-w-0">
                                                        <h4 className="font-bold text-sm text-foreground truncate">
                                                            {c.display.name}
                                                        </h4>
                                                        <Badge
                                                            className={cn(
                                                                "text-[9px] px-1.5 py-0 h-[16px] border-0 flex-shrink-0",
                                                                c.conv.type === 'roommate'
                                                                    ? "bg-blue-100 text-blue-700"
                                                                    : "bg-amber-100 text-amber-700"
                                                            )}
                                                        >
                                                            {c.conv.type === 'roommate' ? (
                                                                <><Users className="w-2.5 h-2.5 mr-0.5" /> Compañero</>
                                                            ) : (
                                                                <><Building2 className="w-2.5 h-2.5 mr-0.5" /> Propietario</>
                                                            )}
                                                        </Badge>
                                                    </div>
                                                    {lastMsg && (
                                                        <span className="text-[10px] text-muted-foreground flex-shrink-0">
                                                            {formatDateLabel(lastMsg.timestamp)}
                                                        </span>
                                                    )}
                                                </div>
                                                {lastMsg && (
                                                    <p className="text-xs text-muted-foreground truncate">
                                                        {lastMsg.fromMe ? 'Tú: ' : ''}
                                                        {lastMsg.text}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Message count badge - Only show if unread > 0 */}
                                            {c.conv.unreadCount > 0 && (
                                                <Badge className="bg-red-500 text-white border-0 text-[10px] flex-shrink-0 h-5 w-5 flex items-center justify-center rounded-full">
                                                    {c.conv.unreadCount}
                                                </Badge>
                                            )}
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* ═══ RIGHT PANE: Active chat ═══ */}
                    <div className={cn(
                        "flex-1 flex flex-col",
                        !activeId && "hidden md:flex"
                    )}>
                        {!activeConv ? (
                            /* Empty state */
                            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50/30 to-indigo-50/20">
                                <div className="text-center px-6">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-blue-500/10 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-primary/5">
                                        <MessageSquare className="w-10 h-10 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Tus mensajes</h3>
                                    <p className="text-muted-foreground max-w-sm leading-relaxed text-sm">
                                        Selecciona una conversación de la lista para ver los mensajes.
                                        Aquí aparecen tus chats con compañeros de piso y propietarios.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* ── Chat header ── */}
                                <div className={cn(
                                    "px-5 py-4 flex items-center gap-4 border-b",
                                    activeConv.conv.type === 'roommate'
                                        ? "bg-gradient-to-r from-primary via-blue-500 to-blue-600"
                                        : "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600"
                                )}>
                                    {/* Back button (mobile) */}
                                    <button
                                        onClick={() => setActiveId(null)}
                                        className="md:hidden w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                                    >
                                        <ArrowLeft className="w-5 h-5 text-white" />
                                    </button>

                                    <div className="relative flex-shrink-0">
                                        <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white/80">
                                            <img
                                                src={activeConv.display.image}
                                                alt={activeConv.display.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-blue-500" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-white text-base leading-tight truncate">
                                                {activeConv.display.name}
                                            </h3>
                                            <Badge className={cn(
                                                "text-[9px] border-0",
                                                activeConv.conv.type === 'roommate'
                                                    ? "bg-white/20 text-white"
                                                    : "bg-white/20 text-white"
                                            )}>
                                                {activeConv.conv.type === 'roommate' ? 'Compañero' : 'Propietario'}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-1 text-white/70 text-xs">
                                            {activeConv.conv.type === 'roommate' ? (
                                                <>
                                                    <GraduationCap className="w-3 h-3" />
                                                    <span className="truncate">{activeConv.display.subtitle}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Home className="w-3 h-3" />
                                                    <span className="truncate">{activeConv.display.subtitle}</span>
                                                </>
                                            )}
                                            {activeConv.display.verified && (
                                                <CheckCircle2 className="w-3 h-3 text-white/90 ml-1" />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* ── Messages ── */}
                                <div
                                    ref={scrollRef}
                                    className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-gradient-to-b from-blue-50/20 to-background"
                                >
                                    {messages.length === 0 && (
                                        <div className="flex flex-col items-center justify-center h-full text-center py-10">
                                            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-primary/10 mb-4 shadow-md">
                                                <img
                                                    src={activeConv.display.image}
                                                    alt={activeConv.display.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <h4 className="font-bold text-foreground text-lg mb-1">
                                                {activeConv.display.name}
                                            </h4>
                                            <p className="text-muted-foreground text-sm max-w-[250px] leading-relaxed">
                                                ¡Empieza una conversación! Cuéntale sobre ti y lo que buscas.
                                            </p>
                                        </div>
                                    )}

                                    {messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={cn(
                                                "flex",
                                                msg.fromMe ? "justify-end" : "justify-start"
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    "max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm",
                                                    msg.fromMe
                                                        ? "bg-primary text-white rounded-br-md"
                                                        : "bg-white text-foreground border border-border/30 rounded-bl-md"
                                                )}
                                            >
                                                <p className="whitespace-pre-wrap">{msg.text}</p>
                                                <span
                                                    className={cn(
                                                        "text-[10px] mt-1 block text-right",
                                                        msg.fromMe
                                                            ? "text-white/60"
                                                            : "text-muted-foreground/60"
                                                    )}
                                                >
                                                    {formatTime(msg.timestamp)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* ── Input bar ── */}
                                <div className="px-4 py-3 bg-white border-t border-border/30">
                                    <div className="flex items-center gap-2">
                                        <Input
                                            ref={inputRef}
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            placeholder={`Mensaje para ${activeConv.display.name}...`}
                                            className="flex-1 h-11 rounded-full bg-muted/40 border-0 px-4 text-sm focus-visible:ring-primary/20"
                                        />
                                        <Button
                                            size="icon"
                                            className="h-11 w-11 rounded-full bg-primary hover:bg-primary/90 shadow-md shadow-primary/20 transition-all active:scale-95"
                                            onClick={handleSend}
                                            disabled={!inputValue.trim()}
                                        >
                                            <Send className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default TestMessages;
