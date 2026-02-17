
import { useState, useEffect, useRef, useCallback } from "react";
import { MockRoommate, mockRoommates, myLifeGraph, calculateCompatibility, type LifeGraphData } from "@/data/mockRoommates";
import {
    Search,
    MapPin,
    ArrowLeft,
    Calendar,
    Cigarette,
    CheckCircle2,
    SlidersHorizontal,
    Sun,
    Moon,
    Sparkles,
    MessageCircle,
    Heart,
    X,
    GraduationCap,
    PawPrint,
    Home,
    Inbox,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import { cn } from "@/lib/utils";
import { toast } from "sonner";
import RoommateChat, { getConversations, type ConversationSummary } from "./RoommateChat";
import { subscribe as subscribeChatStore } from "@/stores/chatStore";

interface RoommateSearchGridProps {
    onBack: () => void;
}

// ──────────────────────────────────────────────
//  Radar / Life Graph Component (Canvas) – scale 1-5
// ──────────────────────────────────────────────
interface LifeGraphProps {
    data: LifeGraphData;
    size?: number;
}

const LifeGraph = ({ data, size = 220 }: LifeGraphProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = size * dpr;
        canvas.height = size * dpr;
        ctx.scale(dpr, dpr);

        const cx = size / 2;
        const cy = size / 2;
        const maxR = size / 2 - 28;

        const labels = ["Limpieza", "Ruido", "Visitas", "Estudios", "Fiesta"];
        const values = [data.limpieza, data.ruido, data.visitas, data.estudios, data.fiesta];
        const numAxes = labels.length;
        const angleStep = (Math.PI * 2) / numAxes;
        const startAngle = -Math.PI / 2;
        const maxVal = 5;

        ctx.clearRect(0, 0, size, size);

        // Grid rings
        for (let level = 1; level <= maxVal; level++) {
            const r = (maxR / maxVal) * level;
            ctx.beginPath();
            for (let i = 0; i <= numAxes; i++) {
                const angle = startAngle + angleStep * i;
                const x = cx + r * Math.cos(angle);
                const y = cy + r * Math.sin(angle);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.strokeStyle = "rgba(148,163,184,0.18)";
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Axis lines
        for (let i = 0; i < numAxes; i++) {
            const angle = startAngle + angleStep * i;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + maxR * Math.cos(angle), cy + maxR * Math.sin(angle));
            ctx.strokeStyle = "rgba(148,163,184,0.12)";
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Data polygon
        ctx.beginPath();
        for (let i = 0; i <= numAxes; i++) {
            const idx = i % numAxes;
            const angle = startAngle + angleStep * idx;
            const val = values[idx] / maxVal;
            const r = val * maxR;
            const x = cx + r * Math.cos(angle);
            const y = cy + r * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = "rgba(59, 130, 246, 0.15)";
        ctx.fill();
        ctx.strokeStyle = "rgba(59, 130, 246, 0.6)";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Data points
        for (let i = 0; i < numAxes; i++) {
            const angle = startAngle + angleStep * i;
            const val = values[i] / maxVal;
            const r = val * maxR;
            const x = cx + r * Math.cos(angle);
            const y = cy + r * Math.sin(angle);
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fillStyle = "rgb(59, 130, 246)";
            ctx.fill();
        }

        // Labels
        ctx.font = "bold 11px Inter, system-ui, -apple-system, sans-serif";
        ctx.fillStyle = "rgb(100, 116, 139)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        for (let i = 0; i < numAxes; i++) {
            const angle = startAngle + angleStep * i;
            const labelR = maxR + 18;
            const x = cx + labelR * Math.cos(angle);
            const y = cy + labelR * Math.sin(angle);
            ctx.fillText(labels[i], x, y);
        }
    }, [data, size]);

    return (
        <canvas
            ref={canvasRef}
            style={{ width: size, height: size }}
            className="mx-auto"
        />
    );
};

// ──────────────────────────────────────────────
//  Profile Card Component
// ──────────────────────────────────────────────

interface ProfileCardProps {
    profile: MockRoommate;
    compatibility: number;
    isLiked: boolean;
    onLike: (id: string) => void;
    onClick: () => void;
}

const ProfileCard = ({ profile, compatibility, isLiked, onLike, onClick }: ProfileCardProps) => {
    return (
        <div
            onClick={onClick}
            className={cn(
                "group relative bg-white rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden",
                "hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-0.5",
                "border-border/40 hover:border-primary/30"
            )}
        >
            {/* Compatibility badge */}
            {compatibility >= 80 && (
                <div className="absolute top-3 right-12 z-10">
                    <Badge className="bg-green-500/90 text-white border-0 text-[10px] font-bold px-2 py-0.5 shadow-sm backdrop-blur-sm">
                        {compatibility}% Compatible
                    </Badge>
                </div>
            )}

            {/* ❤️ Heart button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onLike(profile.id);
                }}
                className={cn(
                    "absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm",
                    isLiked
                        ? "bg-red-500 text-white scale-110 shadow-red-200"
                        : "bg-white/90 text-muted-foreground hover:text-red-500 hover:bg-red-50 hover:shadow-md"
                )}
            >
                <Heart
                    className={cn(
                        "transition-all duration-300",
                        isLiked ? "fill-white" : "fill-none"
                    )}
                    style={{ width: 18, height: 18 }}
                />
            </button>

            <div className="p-5">
                {/* Top section: Avatar + Name */}
                <div className="flex items-center gap-4 mb-3">
                    <div className="relative flex-shrink-0">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-[3px] border-primary/20 group-hover:border-primary/40 transition-colors duration-300">
                            <img
                                src={profile.image}
                                alt={profile.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
                        {profile.verified && (
                            <div className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center border-2 border-white">
                                <CheckCircle2 className="w-3 h-3 text-white" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-foreground leading-tight">
                            {profile.name}, <span className="font-normal text-muted-foreground">{profile.age}</span>
                        </h3>
                    </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                    {profile.tags.map((tag, i) => (
                        <Badge
                            key={i}
                            variant="secondary"
                            className={cn(
                                "text-[11px] font-semibold px-2.5 py-0.5 rounded-full border-0",
                                i === 0 ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                            )}
                        >
                            {tag}
                        </Badge>
                    ))}
                </div>


                {/* Bio preview */}
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3">
                    {profile.bio}
                </p>

                {/* Info rows (no budget) */}
                <div className="space-y-1.5 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground/60 flex-shrink-0" />
                        <span className="truncate text-xs">{profile.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground/60 flex-shrink-0" />
                        <span className="text-xs">{profile.moveDate}</span>
                    </div>
                </div>
            </div>

            {/* Like indicator */}
            {
                isLiked && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10">
                        <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2.5 py-1 rounded-full border border-red-100 animate-in fade-in zoom-in duration-300">
                            ❤️ Match enviado
                        </span>
                    </div>
                )
            }
        </div >
    );
};


// ──────────────────────────────────────────────
//  Profile Detail Modal – full profile with spider chart
// ──────────────────────────────────────────────

interface ProfileDetailProps {
    profile: MockRoommate;
    compatibility: number;
    isLiked: boolean;
    onLike: (id: string) => void;
    onClose: () => void;
    onMessage: (profile: MockRoommate) => void;
}

const ProfileDetail = ({ profile, compatibility, isLiked, onLike, onClose, onMessage }: ProfileDetailProps) => {
    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-lg max-h-[92vh] overflow-y-auto p-0 gap-0 rounded-[2rem] border-none shadow-2xl">
                {/* ── Header: gradient + circular avatar ── */}
                <div className="relative bg-gradient-to-br from-primary via-blue-500 to-blue-600 pt-10 pb-8 flex flex-col items-center">

                    {/* Compatibility badge */}
                    <div className="absolute top-4 left-4 flex items-center gap-2 flex-wrap">
                        <Badge className={cn(
                            "border-0 text-xs font-bold shadow-md",
                            compatibility >= 80
                                ? "bg-green-500 text-white"
                                : compatibility >= 60
                                    ? "bg-amber-500 text-white"
                                    : "bg-gray-500 text-white"
                        )}>
                            {compatibility}% Compatible
                        </Badge>
                        {profile.verified && (
                            <Badge className="bg-primary text-white border-0 text-[10px] font-bold gap-1 shadow-md">
                                <CheckCircle2 className="w-3 h-3" />
                                Verificado
                            </Badge>
                        )}
                    </div>

                    {/* Circular avatar */}
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/90 shadow-xl ring-4 ring-white/20">
                            <img
                                src={profile.image}
                                alt={profile.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Online indicator */}
                        <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-400 rounded-full border-[3px] border-white" />
                    </div>

                    {/* Name + studies centered below avatar */}
                    <h2 className="mt-4 text-2xl font-black text-white drop-shadow-sm">
                        {profile.name}, {profile.age}
                    </h2>
                    <div className="flex items-center gap-1.5 mt-1 text-white/80">
                        <GraduationCap className="w-4 h-4" />
                        <span className="text-sm font-medium">{profile.studies} · {profile.university}</span>
                    </div>

                    {/* Tags – inside header */}
                    <div className="flex flex-wrap gap-2 justify-center mt-4 px-6">
                        {profile.tags.map((tag, i) => (
                            <Badge
                                key={i}
                                className={cn(
                                    "text-xs font-semibold px-3 py-1 rounded-full border-0 shadow-sm",
                                    i === 0
                                        ? "bg-white/90 text-red-600"
                                        : "bg-white/90 text-blue-600"
                                )}
                            >
                                {tag}
                            </Badge>
                        ))}
                        <Badge
                            className={cn(
                                "text-xs font-medium px-3 py-1 rounded-full gap-1 border-0 shadow-sm",
                                profile.smoking === "No fumador"
                                    ? "bg-white/90 text-green-700"
                                    : profile.smoking === "Fumador"
                                        ? "bg-white/90 text-orange-700"
                                        : "bg-white/90 text-yellow-700"
                            )}
                        >
                            <Cigarette className="w-3 h-3" />
                            {profile.smoking}
                        </Badge>
                        <Badge className="text-xs font-medium px-3 py-1 rounded-full gap-1 border-0 shadow-sm bg-white/90 text-purple-700">
                            <PawPrint className="w-3 h-3" />
                            {profile.pets}
                        </Badge>
                    </div>

                    {/* Bottom fade from blue to white */}
                    <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-b from-transparent to-white" />
                </div>

                {/* ── Content below ── */}
                <div className="px-7 py-6 space-y-6">

                    {/* Bio */}
                    <div className="bg-muted/20 rounded-2xl p-5 border border-border/10">
                        <h3 className="text-sm font-bold text-foreground mb-2">Sobre mí</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {profile.bio}
                        </p>
                    </div>

                    {/* Details row */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-3 p-3.5 bg-muted/30 rounded-2xl border border-border/10">
                            <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                <MapPin className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Zona</p>
                                <p className="font-bold text-sm">{profile.location}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3.5 bg-muted/30 rounded-2xl border border-border/10">
                            <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                <Calendar className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Mudanza</p>
                                <p className="font-bold text-sm">{profile.moveDate}</p>
                            </div>
                        </div>
                    </div>

                    {/* ── Spider chart ── */}
                    <div>
                        <h3 className="text-sm font-bold text-foreground mb-1 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-primary" />
                            Gráfico de Vida
                        </h3>
                        <p className="text-[10px] text-muted-foreground mb-3">(Escala del 1 al 5)</p>
                        <div className="bg-muted/20 rounded-2xl p-4 border border-border/10">
                            <LifeGraph data={profile.lifeGraph} size={220} />
                        </div>
                        {/* Legend values */}
                        <div className="grid grid-cols-5 gap-1 mt-3">
                            {(["limpieza", "fiesta", "estudios", "visitas", "ruido"] as (keyof LifeGraphData)[]).map(key => (
                                <div key={key} className="text-center">
                                    <p className="text-[10px] font-bold text-muted-foreground capitalize">{key}</p>
                                    <p className="text-lg font-black text-primary">{profile.lifeGraph[key]}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Interests */}
                    <div>
                        <h3 className="text-sm font-bold text-foreground mb-2">Intereses</h3>
                        <div className="flex flex-wrap gap-2">
                            {profile.interests.map((interest, i) => (
                                <Badge
                                    key={i}
                                    variant="outline"
                                    className="text-xs bg-primary/5 text-primary border-primary/15 hover:bg-primary/10 px-3 py-1"
                                >
                                    {interest}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-2 flex gap-3">
                        <Button
                            className={cn(
                                "flex-1 h-13 rounded-2xl font-bold text-sm transition-all active:scale-[0.97]",
                                isLiked
                                    ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200"
                                    : "shadow-lg shadow-primary/20"
                            )}
                            onClick={() => onLike(profile.id)}
                        >
                            <Heart className={cn("w-5 h-5 mr-2", isLiked && "fill-white")} />
                            {isLiked ? "Match enviado ❤️" : "Conectar"}
                        </Button>
                        <Button
                            variant="outline"
                            className="flex-1 h-13 rounded-2xl font-bold text-sm border-primary/20 text-primary hover:bg-primary/5 transition-all active:scale-[0.97]"
                            onClick={() => { onClose(); onMessage(profile); }}
                        >
                            <MessageCircle className="w-5 h-5 mr-2" />
                            Enviar mensaje
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};


// ──────────────────────────────────────────────
//  Main Component
// ──────────────────────────────────────────────

const RoommateSearchGrid = ({ onBack }: RoommateSearchGridProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredProfiles, setFilteredProfiles] = useState<(MockRoommate & { _compat: number })[]>([]);
    const [openProfile, setOpenProfile] = useState<MockRoommate | null>(null);
    const [likedProfiles, setLikedProfiles] = useState<Set<string>>(new Set());

    // Messaging state
    const [chatProfile, setChatProfile] = useState<MockRoommate | null>(null);
    const [showConversations, setShowConversations] = useState(false);
    const [conversationsList, setConversationsList] = useState<ConversationSummary[]>([]);

    const refreshConversations = useCallback(() => {
        setConversationsList(getConversations(mockRoommates));
    }, []);

    useEffect(() => {
        refreshConversations();
        // Subscribe to chatStore so badge/list updates in real time
        const unsub = subscribeChatStore(() => refreshConversations());
        return unsub;
    }, [refreshConversations]);

    const handleOpenChat = useCallback((profile: MockRoommate) => {
        setChatProfile(profile);
        setShowConversations(false);
    }, []);

    // Filters
    const [selectedZones, setSelectedZones] = useState<string[]>([]);
    const [verifiedOnly, setVerifiedOnly] = useState(false);
    const [cleanlinessLevel, setCleanlinessLevel] = useState([3]);
    const [biorhythm, setBiorhythm] = useState([3]);

    // ── Calculate compatibility + sort + filter ──
    useEffect(() => {
        let result = mockRoommates.map(p => ({
            ...p,
            _compat: calculateCompatibility(myLifeGraph, p.lifeGraph),
        }));

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(
                (p) =>
                    p.name.toLowerCase().includes(term) ||
                    p.studies.toLowerCase().includes(term) ||
                    p.location.toLowerCase().includes(term) ||
                    p.university.toLowerCase().includes(term) ||
                    p.tags.some(t => t.toLowerCase().includes(term))
            );
        }

        if (selectedZones.length > 0) {
            result = result.filter(p =>
                selectedZones.some(zone =>
                    p.location.toLowerCase().includes(zone.toLowerCase())
                )
            );
        }

        if (verifiedOnly) {
            result = result.filter(p => p.verified);
        }

        // Sort by compatibility (most similar spider first)
        result.sort((a, b) => b._compat - a._compat);

        setFilteredProfiles(result);
    }, [searchTerm, selectedZones, verifiedOnly, cleanlinessLevel, biorhythm]);

    const handleLike = useCallback((id: string) => {
        setLikedProfiles(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
                toast.info("Like retirado");
            } else {
                next.add(id);
                const profile = mockRoommates.find(p => p.id === id);
                toast.success(`¡Match enviado a ${profile?.name}!`, {
                    description: "Te notificaremos si hay match mutuo ❤️",
                });
            }
            return next;
        });
    }, []);

    const toggleZone = (zone: string) => {
        setSelectedZones(prev =>
            prev.includes(zone)
                ? prev.filter(z => z !== zone)
                : [...prev, zone]
        );
    };

    const getCompat = (profileId: string): number => {
        return filteredProfiles.find(p => p.id === profileId)?._compat ?? 0;
    };

    return (
        <>
            <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
                {/* Top Bar */}
                <div className="sticky top-[64px] z-30 bg-white/80 backdrop-blur-xl border-b border-border/30 px-4 py-3">
                    <div className="container mx-auto flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onBack}
                            className="flex items-center gap-2 hover:bg-primary/10 hover:text-primary transition-colors rounded-full"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span className="hidden sm:inline font-medium text-xs">Volver</span>
                        </Button>

                        <div className="relative flex-1 max-w-xl mx-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por nombre, estudios o zona..."
                                className="pl-10 bg-muted/40 border-none focus-visible:ring-1 focus-visible:ring-primary/30 h-10 rounded-full text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => { refreshConversations(); setShowConversations(true); setChatProfile(null); }}
                            className="relative flex items-center gap-2 hover:bg-primary/10 hover:text-primary transition-colors rounded-full"
                        >
                            <Inbox className="h-4 w-4" />
                            <span className="hidden sm:inline font-medium text-xs">Mis mensajes</span>
                            {conversationsList.filter((c) => c.unreadCount > 0).length > 0 && (
                                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1 animate-pulse">
                                    {conversationsList.filter((c) => c.unreadCount > 0).length}
                                </span>
                            )}
                        </Button>

                        <div className="text-right hidden md:block">
                            <h1 className="text-sm font-bold text-foreground">Buscar Compañero</h1>
                            <p className="text-[10px] text-muted-foreground font-medium">
                                {filteredProfiles.length} perfiles • ordenados por compatibilidad
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Chat View ── */}
                {chatProfile && (
                    <div className="container mx-auto px-4 py-8 max-w-lg">
                        <RoommateChat
                            profile={chatProfile}
                            onBack={() => { setChatProfile(null); refreshConversations(); }}
                        />
                    </div>
                )}

                {/* ── Conversations List ── */}
                {showConversations && !chatProfile && (
                    <div className="container mx-auto px-4 py-8 max-w-2xl">
                        <div className="bg-white rounded-[2rem] shadow-xl border overflow-hidden">
                            <div className="bg-gradient-to-r from-primary via-blue-500 to-blue-600 px-6 py-5">
                                <h2 className="text-xl font-black text-white">Mis mensajes</h2>
                                <p className="text-white/70 text-sm mt-0.5">
                                    {conversationsList.length === 0 ? "No tienes conversaciones todavía" : `${conversationsList.length} conversación${conversationsList.length !== 1 ? "es" : ""}`}
                                </p>
                            </div>

                            {conversationsList.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                        <MessageCircle className="w-8 h-8 text-primary/50" />
                                    </div>
                                    <h3 className="font-bold text-foreground mb-1">Sin conversaciones</h3>
                                    <p className="text-sm text-muted-foreground max-w-[280px] leading-relaxed">
                                        Abre el perfil de un compañero y pulsa &quot;Enviar mensaje&quot; para iniciar una conversación.
                                    </p>
                                    <Button
                                        className="mt-6 rounded-full"
                                        onClick={() => setShowConversations(false)}
                                    >
                                        Buscar compañeros
                                    </Button>
                                </div>
                            ) : (
                                <div className="divide-y divide-border/30">
                                    {conversationsList.map((conv) => (
                                        <button
                                            key={conv.profileId}
                                            onClick={() => handleOpenChat(conv.profile)}
                                            className="w-full flex items-center gap-4 px-6 py-4 hover:bg-muted/30 transition-colors text-left"
                                        >
                                            <div className="relative flex-shrink-0">
                                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/10">
                                                    <img
                                                        src={conv.profile.image}
                                                        alt={conv.profile.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2">
                                                    <h4 className="font-bold text-sm text-foreground truncate">
                                                        {conv.profile.name}, {conv.profile.age}
                                                    </h4>
                                                    {conv.lastMessage && (
                                                        <span className="text-[10px] text-muted-foreground flex-shrink-0">
                                                            {new Date(conv.lastMessage.timestamp).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                                                        </span>
                                                    )}
                                                </div>
                                                {conv.lastMessage && (
                                                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                                                        {conv.lastMessage.fromMe ? "Tú: " : ""}
                                                        {conv.lastMessage.text}
                                                    </p>
                                                )}
                                            </div>
                                            {conv.unreadCount > 0 ? (
                                                <Badge className="bg-red-500 text-white border-0 text-[10px] h-5 w-5 flex items-center justify-center rounded-full">
                                                    {conv.unreadCount}
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-primary/10 text-primary border-0 text-[10px]">
                                                    {conv.messageCount}
                                                </Badge>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-center mt-6">
                            <Button
                                variant="outline"
                                className="rounded-full"
                                onClick={() => setShowConversations(false)}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Volver a perfiles
                            </Button>
                        </div>
                    </div>
                )}

                {/* ── Normal Grid View ── */}
                {!chatProfile && !showConversations && (
                    <div className="container mx-auto px-4 py-8">
                        <div className="flex gap-8">
                            {/* ── Left Sidebar: Filtros ── */}
                            <aside className="w-72 flex-shrink-0 hidden lg:block">
                                <div className="sticky top-[140px] space-y-6">
                                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-border/30">
                                        <h2 className="font-bold text-base text-foreground mb-6 flex items-center gap-2">
                                            <SlidersHorizontal className="w-4 h-4 text-primary" />
                                            Filtros Inteligentes
                                        </h2>

                                        <div className="space-y-7">
                                            {/* Zone Tags */}
                                            <div className="space-y-3">
                                                <Label className="text-sm font-semibold text-foreground">
                                                    Zona Deseada
                                                </Label>
                                                <p className="text-xs text-muted-foreground -mt-1">
                                                    (e.g., Delicias, Universidad, Centro)
                                                </p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {["Delicias", "Actur", "Universidad", "Centro"].map(zone => (
                                                        <button
                                                            key={zone}
                                                            onClick={() => toggleZone(zone)}
                                                            className={cn(
                                                                "text-xs font-medium px-3 py-1.5 rounded-full border transition-colors",
                                                                selectedZones.includes(zone)
                                                                    ? "bg-primary text-white border-primary"
                                                                    : "bg-muted/40 text-foreground border-border/40 hover:border-primary/30"
                                                            )}
                                                        >
                                                            {zone}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Verified Toggle */}
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <Label className="text-sm font-semibold text-foreground">
                                                            Solo Verificados
                                                        </Label>
                                                        <p className="text-xs text-muted-foreground">
                                                            (con tick azul)
                                                        </p>
                                                    </div>
                                                    <Switch
                                                        checked={verifiedOnly}
                                                        onCheckedChange={setVerifiedOnly}
                                                    />
                                                </div>
                                            </div>

                                            {/* Cleanliness Level */}
                                            <div className="space-y-3">
                                                <Label className="text-sm font-semibold text-foreground">
                                                    Nivel de Limpieza
                                                </Label>
                                                <p className="text-xs text-muted-foreground -mt-1">
                                                    (Relajado - Estándar - Maniático)
                                                </p>
                                                <div className="flex items-center gap-3">
                                                    <SlidersHorizontal className="w-4 h-4 text-muted-foreground/50 flex-shrink-0" />
                                                    <Slider
                                                        min={1}
                                                        max={5}
                                                        step={1}
                                                        value={cleanlinessLevel}
                                                        onValueChange={setCleanlinessLevel}
                                                        className="py-1"
                                                    />
                                                    <Sparkles className="w-4 h-4 text-muted-foreground/50 flex-shrink-0" />
                                                </div>
                                            </div>

                                            {/* Biorhythm */}
                                            <div className="space-y-3">
                                                <Label className="text-sm font-semibold text-foreground">
                                                    Biorritmos
                                                </Label>
                                                <p className="text-xs text-muted-foreground -mt-1">
                                                    (Madrugador - Nocturno)
                                                </p>
                                                <div className="flex items-center gap-3">
                                                    <Sun className="w-4 h-4 text-amber-400 flex-shrink-0" />
                                                    <Slider
                                                        min={1}
                                                        max={5}
                                                        step={1}
                                                        value={biorhythm}
                                                        onValueChange={setBiorhythm}
                                                        className="py-1"
                                                    />
                                                    <Moon className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Liked count */}
                                    {likedProfiles.size > 0 && (
                                        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-center">
                                            <div className="flex items-center justify-center gap-2 text-red-600">
                                                <Heart className="w-4 h-4 fill-red-500" />
                                                <span className="font-bold text-sm">{likedProfiles.size} likes enviados</span>
                                            </div>
                                            <p className="text-[10px] text-red-400 mt-1">Esperando match mutuo</p>
                                        </div>
                                    )}
                                </div>
                            </aside>

                            {/* ── Center: Profile Cards Grid ── */}
                            <main className="flex-1 min-w-0">
                                <div className="mb-6 flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-bold text-foreground">
                                            Perfiles
                                        </h2>
                                        <p className="text-[11px] text-muted-foreground">
                                            Ordenados por compatibilidad con tu perfil ✨
                                        </p>
                                    </div>
                                    <span className="text-xs text-muted-foreground font-medium">
                                        {filteredProfiles.length} resultados
                                    </span>
                                </div>

                                {filteredProfiles.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-32 bg-white rounded-2xl border border-dashed border-border/50 text-center px-4">
                                        <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-6">
                                            <Search className="h-10 w-10 text-muted-foreground/30" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">No hay coincidencias</h3>
                                        <p className="text-muted-foreground max-w-xs mx-auto text-sm leading-relaxed">
                                            Intenta ajustar los filtros para encontrar otros perfiles.
                                        </p>
                                        <Button
                                            variant="outline"
                                            className="mt-8 rounded-full px-8"
                                            onClick={() => {
                                                setSearchTerm("");
                                                setSelectedZones([]);
                                                setVerifiedOnly(false);
                                                setCleanlinessLevel([3]);
                                                setBiorhythm([3]);
                                            }}
                                        >
                                            Limpiar filtros
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                                        {filteredProfiles.map((profile) => (
                                            <ProfileCard
                                                key={profile.id}
                                                profile={profile}
                                                compatibility={profile._compat}
                                                isLiked={likedProfiles.has(profile.id)}
                                                onLike={handleLike}
                                                onClick={() => setOpenProfile(profile)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </main>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Profile Detail Modal ── */}
            {openProfile && (
                <ProfileDetail
                    profile={openProfile}
                    compatibility={getCompat(openProfile.id)}
                    isLiked={likedProfiles.has(openProfile.id)}
                    onLike={handleLike}
                    onClose={() => setOpenProfile(null)}
                    onMessage={handleOpenChat}
                />
            )}
        </>
    );
};

export default RoommateSearchGrid;
