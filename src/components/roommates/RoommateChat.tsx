import { useState, useRef, useEffect } from "react";
import { MockRoommate } from "@/data/mockRoommates";
import {
    ArrowLeft,
    Send,
    CheckCircle2,
    GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
    getMessages,
    addMessage,
    markAsRead,
    subscribe,
    activeConversationCount,
    type ChatMessage,
} from "@/stores/chatStore";

export type { ChatMessage };

interface RoommateChatProps {
    profile: MockRoommate;
    onBack: () => void;
}

const RoommateChat = ({ profile, onBack }: RoommateChatProps) => {
    const [messages, setMessages] = useState<ChatMessage[]>(
        getMessages(profile.id)
    );
    const [inputValue, setInputValue] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Subscribe to store changes (e.g. if another view adds messages)
    useEffect(() => {
        markAsRead(profile.id);
        const unsub = subscribe(() => {
            setMessages(getMessages(profile.id));
        });
        return unsub;
    }, [profile.id]);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Auto-focus input
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const sendMessage = () => {
        const text = inputValue.trim();
        if (!text) return;

        addMessage(profile.id, text, true, 'roommate');
        setInputValue("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const formatTime = (iso: string) => {
        return new Date(iso).toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="flex flex-col h-[85vh] max-h-[700px] bg-background rounded-[2rem] overflow-hidden border shadow-2xl">
            {/* ── Header ── */}
            <div className="bg-gradient-to-r from-primary via-blue-500 to-blue-600 px-5 py-4 flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-white" />
                </button>

                <div className="relative flex-shrink-0">
                    <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white/80">
                        <img
                            src={profile.image}
                            alt={profile.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-blue-500" />
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-base leading-tight truncate">
                        {profile.name}, {profile.age}
                    </h3>
                    <div className="flex items-center gap-1 text-white/70 text-xs">
                        <GraduationCap className="w-3 h-3" />
                        <span className="truncate">{profile.studies}</span>
                        {profile.verified && (
                            <CheckCircle2 className="w-3 h-3 text-white/90 ml-1" />
                        )}
                    </div>
                </div>
            </div>

            {/* ── Messages area ── */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-gradient-to-b from-blue-50/30 to-background"
            >
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center py-10">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-primary/10 mb-4 shadow-md">
                            <img
                                src={profile.image}
                                alt={profile.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h4 className="font-bold text-foreground text-lg mb-1">
                            {profile.name}
                        </h4>
                        <p className="text-muted-foreground text-sm max-w-[250px] leading-relaxed">
                            ¡Empieza una conversación con {profile.name}! Cuéntale
                            sobre ti y lo que buscas.
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
                            <p>{msg.text}</p>
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
                        placeholder={`Mensaje para ${profile.name}...`}
                        className="flex-1 h-11 rounded-full bg-muted/40 border-0 px-4 text-sm focus-visible:ring-primary/20"
                    />
                    <Button
                        size="icon"
                        className="h-11 w-11 rounded-full bg-primary hover:bg-primary/90 shadow-md shadow-primary/20 transition-all active:scale-95"
                        onClick={sendMessage}
                        disabled={!inputValue.trim()}
                    >
                        <Send className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default RoommateChat;

// ──────────────────────────────────────────────
//  Conversations List helpers
// ──────────────────────────────────────────────
export interface ConversationSummary {
    profileId: string;
    profile: MockRoommate;
    lastMessage: ChatMessage | null;
    messageCount: number;
    unreadCount: number;
}

export { activeConversationCount as getActiveCount };

export const getConversations = (
    profiles: MockRoommate[]
): ConversationSummary[] => {
    const allConvs = getAllConversations();
    return Object.entries(allConvs)
        .filter(([, conv]) => conv.messages.length > 0 && conv.type === 'roommate')
        .map(([participantId, conv]) => {
            const profile = profiles.find((p) => p.id === participantId);
            if (!profile) return null;
            const msgs = conv.messages;
            return {
                profileId: participantId,
                profile,
                lastMessage: msgs[msgs.length - 1] || null,
                messageCount: msgs.length,
                unreadCount: conv.unreadCount || 0,
            };
        })
        .filter(Boolean) as ConversationSummary[];
};

// Re-export for backwards compat
import { getAllConversations } from "@/stores/chatStore";
