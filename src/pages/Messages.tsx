import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, MessageSquare, ArrowLeft, Send, Users, Home,
  CheckCircle2, Building2, Loader2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Header from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';
// ─── Real Supabase messaging hook ────────────────────────────
import { useMessages, type Conversation, type Message } from '@/hooks/useMessages';

// ─── Filter type ────────────────────────────────────────────
// NOTE: Supabase conversations don't have a "type" field; we display all as
// landlord/tenant conversations since that is the primary flow.
// The old chatStore localStorage mock has been replaced by useMessages.
type FilterTab = 'all' | 'unread';

// ─── Helpers ────────────────────────────────────────────────

/**
 * Returns the "other" participant profile from a Supabase Conversation,
 * relative to the currently logged-in user.
 */
function getOtherParticipant(conv: Conversation, currentUserId: string) {
  const isParticipant1 = conv.participant_1_id === currentUserId;
  return isParticipant1 ? conv.participant_2 : conv.participant_1;
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
//  MESSAGES PAGE — powered by useMessages (Supabase real-time)
// ═════════════════════════════════════════════════════════════
const Messages = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // ─── Supabase-backed messaging state ────────────────────
  const {
    conversations,
    activeConversation: activeConversationId,
    setActiveConversation,
    messages,
    isLoading,
    sendMessage,
    isUserOnline,
  } = useMessages();

  // ─── Local UI state ──────────────────────────────────────
  const [filter, setFilter] = useState<FilterTab>('all');
  const [searchQ, setSearchQ] = useState('');
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll when messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-focus input when a conversation is selected
  useEffect(() => {
    if (activeConversationId) inputRef.current?.focus();
  }, [activeConversationId]);

  // ─── Derived data ────────────────────────────────────────
  const filteredConvs = conversations.filter((c) => {
    if (filter === 'unread' && !(c.unread_count && c.unread_count > 0)) return false;
    if (searchQ) {
      const q = searchQ.toLowerCase();
      const other = user ? getOtherParticipant(c, user.id) : null;
      const listingTitle = c.listing?.title ?? '';
      return (
        (other?.name ?? '').toLowerCase().includes(q) ||
        listingTitle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const activeConv = conversations.find((c) => c.id === activeConversationId) ?? null;
  const totalUnread = conversations.reduce((sum, c) => sum + (c.unread_count ?? 0), 0);
  const unreadCount = conversations.filter((c) => (c.unread_count ?? 0) > 0).length;

  // ─── Send handler ────────────────────────────────────────
  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || !activeConversationId) return;
    setInputValue('');
    try {
      await sendMessage(activeConversationId, text);
    } catch {
      // sendMessage already shows toast on error
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/60 via-background to-indigo-50/40">
      <Header />

      <div className="h-[calc(100dvh-64px)] flex flex-col">
        {/* ── Split pane container ── */}
        <div className="flex-1 flex overflow-hidden w-full bg-background">

          {/* ═══ LEFT PANE: Conversations list ═══ */}
          <div className={cn(
            "w-full md:w-96 flex-shrink-0 flex flex-col border-r border-border/30 bg-white",
            activeConversationId && "hidden md:flex"
          )}>
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-primary via-blue-500 to-blue-600">
              <div className="flex items-center justify-between mb-3">
                <h1 className="text-xl font-black text-white">Mis mensajes</h1>
                <div className="flex gap-2">
                  {totalUnread > 0 && (
                    <Badge className="bg-red-500 text-white border-0 text-xs animate-pulse">
                      {totalUnread} nuevos
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
                { key: 'unread' as const, label: 'No leídos', icon: Building2, count: unreadCount },
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
              {isLoading && conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-primary/50 mb-3" />
                  <p className="text-sm text-muted-foreground">Cargando conversaciones...</p>
                </div>
              ) : filteredConvs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <MessageSquare className="w-8 h-8 text-primary/50" />
                  </div>
                  <h3 className="font-bold text-foreground mb-1">Sin conversaciones</h3>
                  <p className="text-sm text-muted-foreground max-w-[280px] leading-relaxed">
                    {filter === 'all'
                      ? 'Contacta a un propietario desde la ficha de un piso para iniciar una conversación.'
                      : 'No tienes mensajes sin leer.'}
                  </p>
                  <Button
                    className="mt-6 rounded-full"
                    onClick={() => navigate('/explore')}
                  >
                    Buscar alojamiento
                  </Button>
                </div>
              ) : (
                filteredConvs.map((c) => {
                  const other = user ? getOtherParticipant(c, user.id) : null;
                  const lastMsg = c.last_message;
                  const isActive = activeConversationId === c.id;
                  const isFromMe = lastMsg?.sender_id === user?.id;
                  const isOnline = other ? isUserOnline(other.id) : false;

                  return (
                    <button
                      key={c.id}
                      onClick={() => setActiveConversation(c.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/30 transition-all text-left border-b border-border/15",
                        isActive && "bg-primary/5 border-l-[3px] border-l-primary"
                      )}
                    >
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/10 shadow-sm bg-muted flex items-center justify-center">
                          {other?.avatar_url ? (
                            <img
                              src={other.avatar_url}
                              alt={other.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              decoding="async"
                              width={48}
                              height={48}
                            />
                          ) : (
                            <span className="text-lg font-bold text-primary/60">
                              {(other?.name ?? '?')[0].toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className={cn(
                          "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white",
                          isOnline ? "bg-green-400" : "bg-gray-300"
                        )} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <h4 className="font-bold text-sm text-foreground truncate">
                              {other?.name ?? 'Usuario desconocido'}
                            </h4>
                            {c.listing && (
                              <Badge className="text-[9px] px-1.5 py-0 h-[16px] border-0 flex-shrink-0 bg-amber-100 text-amber-700">
                                <Building2 className="w-2.5 h-2.5 mr-0.5" /> Piso
                              </Badge>
                            )}
                          </div>
                          {lastMsg && (
                            <span className="text-[10px] text-muted-foreground flex-shrink-0">
                              {formatDateLabel(lastMsg.created_at)}
                            </span>
                          )}
                        </div>
                        {lastMsg && (
                          <p className="text-xs text-muted-foreground truncate">
                            {isFromMe ? 'Tú: ' : ''}
                            {lastMsg.content}
                          </p>
                        )}
                        {c.listing && (
                          <p className="text-[10px] text-primary/60 truncate mt-0.5">
                            {c.listing.title}
                          </p>
                        )}
                      </div>

                      {/* Unread badge */}
                      {(c.unread_count ?? 0) > 0 && (
                        <Badge className="bg-red-500 text-white border-0 text-[10px] flex-shrink-0 h-5 w-5 flex items-center justify-center rounded-full">
                          {c.unread_count}
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
            !activeConversationId && "hidden md:flex"
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
                    Aquí aparecen tus chats con propietarios e inquilinos.
                  </p>
                </div>
              </div>
            ) : (() => {
              const other = user ? getOtherParticipant(activeConv, user.id) : null;
              const isOnline = other ? isUserOnline(other.id) : false;
              return (
                <>
                  {/* ── Chat header ── */}
                  <div className="px-5 py-4 flex items-center gap-4 border-b bg-gradient-to-r from-primary via-blue-500 to-blue-600">
                    {/* Back button (mobile) */}
                    <button
                      onClick={() => setActiveConversation(null)}
                      className="md:hidden w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5 text-white" />
                    </button>

                    <div className="relative flex-shrink-0">
                      <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white/80 bg-white/20 flex items-center justify-center">
                        {other?.avatar_url ? (
                          <img
                            src={other.avatar_url}
                            alt={other.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            decoding="async"
                            width={44}
                            height={44}
                          />
                        ) : (
                          <span className="text-base font-bold text-white">
                            {(other?.name ?? '?')[0].toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className={cn(
                        "absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-blue-500",
                        isOnline ? "bg-green-400" : "bg-gray-300"
                      )} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-base leading-tight truncate">
                          {other?.name ?? 'Usuario'}
                        </h3>
                        <Badge className="text-[9px] border-0 bg-white/20 text-white">
                          {activeConv.listing ? 'Propietario' : 'Contacto'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-white/70 text-xs">
                        {activeConv.listing ? (
                          <>
                            <Home className="w-3 h-3" />
                            <span className="truncate">{activeConv.listing.title}</span>
                          </>
                        ) : (
                          <>
                            <Users className="w-3 h-3" />
                            <span>{isOnline ? 'En línea' : 'Desconectado'}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ── Messages ── */}
                  <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-gradient-to-b from-blue-50/20 to-background"
                  >
                    {isLoading && messages.length === 0 && (
                      <div className="flex justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-primary/50" />
                      </div>
                    )}

                    {!isLoading && messages.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-full text-center py-10">
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4 shadow-md">
                          <MessageSquare className="w-8 h-8 text-primary/50" />
                        </div>
                        <h4 className="font-bold text-foreground text-lg mb-1">
                          {other?.name ?? 'Usuario'}
                        </h4>
                        <p className="text-muted-foreground text-sm max-w-[250px] leading-relaxed">
                          ¡Empieza una conversación! Cuéntale sobre ti y lo que buscas.
                        </p>
                      </div>
                    )}

                    {messages.map((msg: Message) => {
                      const fromMe = msg.sender_id === user?.id;
                      return (
                        <div
                          key={msg.id}
                          className={cn(
                            "flex",
                            fromMe ? "justify-end" : "justify-start"
                          )}
                        >
                          <div
                            className={cn(
                              "max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm",
                              fromMe
                                ? "bg-primary text-white rounded-br-md"
                                : "bg-white text-foreground border border-border/30 rounded-bl-md"
                            )}
                          >
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                            <span
                              className={cn(
                                "text-[10px] mt-1 block text-right",
                                fromMe
                                  ? "text-white/60"
                                  : "text-muted-foreground/60"
                              )}
                            >
                              {formatTime(msg.created_at)}
                              {fromMe && msg.is_read && (
                                <CheckCircle2 className="inline w-3 h-3 ml-1 text-white/60" />
                              )}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* ── Input bar ── */}
                  <div className="px-4 py-3 bg-white border-t border-border/30">
                    <div className="flex items-center gap-2">
                      <Input
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={`Mensaje para ${other?.name ?? 'el usuario'}...`}
                        className="flex-1 h-11 rounded-full bg-muted/40 border-0 px-4 text-sm focus-visible:ring-primary/20"
                      />
                      <Button
                        size="icon"
                        className="h-11 w-11 rounded-full bg-primary hover:bg-primary/90 shadow-md shadow-primary/20 transition-all active:scale-95"
                        onClick={handleSend}
                        disabled={!inputValue.trim() || isLoading}
                      >
                        <Send className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Messages;