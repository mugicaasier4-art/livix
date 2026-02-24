import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    Sparkles, PartyPopper, SprayCan, BookOpen, Users, Volume2,
    ArrowRight, ArrowLeft, Camera, GraduationCap, User, ImagePlus
} from "lucide-react";
import { type LifeGraphData } from "@/data/mockRoommates";
import { cn } from "@/lib/utils";

export const LIFE_PROFILE_KEY = "livix_life_profile";

export interface UserBasicInfo {
    name: string;
    age: string;
    studies: string;
    university: string;
    bio: string;
    photoUrl: string;
    hobbies: string[];
}

export interface FullUserProfile {
    basicInfo: UserBasicInfo;
    lifeGraph: LifeGraphData;
}

export function getSavedLifeProfile(): LifeGraphData | null {
    try {
        const data = localStorage.getItem(LIFE_PROFILE_KEY);
        if (!data) return null;
        const parsed = JSON.parse(data) as FullUserProfile | LifeGraphData;
        // Support new format (FullUserProfile) and legacy format (LifeGraphData)
        if ("lifeGraph" in parsed) {
            return parsed.lifeGraph;
        }
        if (
            typeof (parsed as LifeGraphData).limpieza === "number" &&
            typeof (parsed as LifeGraphData).fiesta === "number"
        ) {
            return parsed as LifeGraphData;
        }
        return null;
    } catch {
        return null;
    }
}

export function getSavedFullProfile(): FullUserProfile | null {
    try {
        const data = localStorage.getItem(LIFE_PROFILE_KEY);
        if (!data) return null;
        const parsed = JSON.parse(data);
        if ("lifeGraph" in parsed && "basicInfo" in parsed) {
            return parsed as FullUserProfile;
        }
        return null;
    } catch {
        return null;
    }
}

interface CreateLifeProfileProps {
    onComplete: (profile: LifeGraphData) => void;
}

// ── Available hobbies to choose from ──
const HOBBY_OPTIONS = [
    "🎮 Videojuegos",
    "⚽ Fútbol",
    "🎵 Música",
    "📖 Lectura",
    "🎨 Arte",
    "🍳 Cocinar",
    "🏃 Running",
    "💪 Gym",
    "📸 Fotografía",
    "✈️ Viajar",
    "🎬 Cine / Series",
    "🧘 Yoga",
    "🏀 Baloncesto",
    "🎭 Teatro",
    "🌍 Voluntariado",
    "🧗 Escalada",
    "🎸 Tocar instrumento",
    "🐾 Animales",
    "🏊 Natación",
    "🛹 Skate",
    "💻 Programación",
    "📱 Redes Sociales",
    "🍺 Craft Beer",
    "🎲 Juegos de mesa",
];

// ── Slider config for Step 2 ──
const sliderConfig: {
    key: keyof LifeGraphData;
    label: string;
    emoji: string;
    icon: typeof PartyPopper;
    description: string;
    lowLabel: string;
    highLabel: string;
    color: string;
}[] = [
        {
            key: "fiesta",
            label: "Fiesta",
            emoji: "🎉",
            icon: PartyPopper,
            description: "¿Cuánto te gusta salir de fiesta?",
            lowLabel: "Nada",
            highLabel: "Mucho",
            color: "text-pink-500",
        },
        {
            key: "limpieza",
            label: "Limpieza",
            emoji: "🧹",
            icon: SprayCan,
            description: "¿Cuál es tu nivel de limpieza?",
            lowLabel: "Relajado",
            highLabel: "Impecable",
            color: "text-emerald-500",
        },
        {
            key: "estudios",
            label: "Estudios en casa",
            emoji: "📚",
            icon: BookOpen,
            description: "¿Cuánto estudias en casa?",
            lowLabel: "Poco",
            highLabel: "Todo el día",
            color: "text-blue-500",
        },
        {
            key: "visitas",
            label: "Visitas",
            emoji: "👥",
            icon: Users,
            description: "¿Cuántas visitas sueles tener?",
            lowLabel: "Ninguna",
            highLabel: "Muchas",
            color: "text-amber-500",
        },
        {
            key: "ruido",
            label: "Ruido",
            emoji: "🔊",
            icon: Volume2,
            description: "¿Cuánto ruido sueles generar?",
            lowLabel: "Silencio",
            highLabel: "Mucho",
            color: "text-purple-500",
        },
    ];

const CreateLifeProfile = ({ onComplete }: CreateLifeProfileProps) => {
    const [step, setStep] = useState<1 | 2>(1);

    // Step 1: Basic Info
    const [basicInfo, setBasicInfo] = useState<UserBasicInfo>({
        name: "",
        age: "",
        studies: "",
        university: "",
        bio: "",
        photoUrl: "",
        hobbies: [],
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Step 2: Life Graph
    const [lifeGraph, setLifeGraph] = useState<LifeGraphData>({
        fiesta: 3,
        limpieza: 3,
        estudios: 3,
        visitas: 3,
        ruido: 3,
    });

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const result = ev.target?.result as string;
            setBasicInfo((prev) => ({ ...prev, photoUrl: result }));
        };
        reader.readAsDataURL(file);
    };

    const toggleHobby = (hobby: string) => {
        setBasicInfo((prev) => ({
            ...prev,
            hobbies: prev.hobbies.includes(hobby)
                ? prev.hobbies.filter((h) => h !== hobby)
                : [...prev.hobbies, hobby],
        }));
    };

    const isStep1Valid =
        basicInfo.name.trim() !== "" &&
        basicInfo.age.trim() !== "" &&
        basicInfo.studies.trim() !== "" &&
        basicInfo.hobbies.length >= 2;

    const handleSave = () => {
        const fullProfile: FullUserProfile = {
            basicInfo,
            lifeGraph,
        };
        localStorage.setItem(LIFE_PROFILE_KEY, JSON.stringify(fullProfile));
        onComplete(lifeGraph);
    };

    // ─────────────────────────────────────────
    //  Step 1: Basic Info
    // ─────────────────────────────────────────
    if (step === 1) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
                <div className="w-full max-w-lg">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-primary via-blue-500 to-purple-500 flex items-center justify-center shadow-xl shadow-primary/20">
                            <User className="h-9 w-9 text-white" />
                        </div>
                        <h1 className="text-3xl font-black text-foreground mb-2">
                            Crea tu perfil
                        </h1>
                        <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                            Cuéntanos sobre ti para que otros compañeros te conozcan
                        </p>
                        {/* Step indicator */}
                        <div className="flex items-center justify-center gap-3 mt-5">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">1</div>
                                <span className="text-sm font-semibold text-primary">Tu info</span>
                            </div>
                            <div className="w-8 h-px bg-border" />
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground text-sm font-bold flex items-center justify-center">2</div>
                                <span className="text-sm text-muted-foreground">Convivencia</span>
                            </div>
                        </div>
                    </div>

                    {/* Card */}
                    <div className="bg-white rounded-[2rem] shadow-xl shadow-primary/5 border border-border/40 p-8 space-y-6">

                        {/* Photo Upload */}
                        <div className="flex flex-col items-center">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className={cn(
                                    "w-28 h-28 rounded-full overflow-hidden border-4 transition-all duration-300 flex items-center justify-center group",
                                    basicInfo.photoUrl
                                        ? "border-primary/30 hover:border-primary/60"
                                        : "border-dashed border-border hover:border-primary/40 bg-muted/30 hover:bg-primary/5"
                                )}
                            >
                                {basicInfo.photoUrl ? (
                                    <img
                                        src={basicInfo.photoUrl}
                                        alt="Tu foto"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center gap-1 text-muted-foreground group-hover:text-primary transition-colors">
                                        <ImagePlus className="w-7 h-7" />
                                        <span className="text-[10px] font-semibold">Tu foto</span>
                                    </div>
                                )}
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handlePhotoUpload}
                            />
                            <p className="text-[11px] text-muted-foreground mt-2">
                                {basicInfo.photoUrl ? "Pulsa para cambiar" : "Sube una foto de perfil (opcional)"}
                            </p>
                        </div>

                        {/* Name + Age row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-bold flex items-center gap-1.5">
                                    <User className="w-3.5 h-3.5 text-primary" />
                                    Nombre *
                                </Label>
                                <Input
                                    placeholder="Tu nombre"
                                    value={basicInfo.name}
                                    onChange={(e) => setBasicInfo(prev => ({ ...prev, name: e.target.value }))}
                                    className="rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-bold flex items-center gap-1.5">
                                    🎂 Edad *
                                </Label>
                                <Input
                                    type="number"
                                    placeholder="18"
                                    min={16}
                                    max={40}
                                    value={basicInfo.age}
                                    onChange={(e) => setBasicInfo(prev => ({ ...prev, age: e.target.value }))}
                                    className="rounded-xl"
                                />
                            </div>
                        </div>

                        {/* Studies + University */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-bold flex items-center gap-1.5">
                                    <GraduationCap className="w-3.5 h-3.5 text-primary" />
                                    ¿Qué estudias? *
                                </Label>
                                <Input
                                    placeholder="Ej: Ingeniería Informática"
                                    value={basicInfo.studies}
                                    onChange={(e) => setBasicInfo(prev => ({ ...prev, studies: e.target.value }))}
                                    className="rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-bold flex items-center gap-1.5">
                                    🏫 Universidad
                                </Label>
                                <Input
                                    placeholder="Ej: UNIZAR"
                                    value={basicInfo.university}
                                    onChange={(e) => setBasicInfo(prev => ({ ...prev, university: e.target.value }))}
                                    className="rounded-xl"
                                />
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="space-y-2">
                            <Label className="text-sm font-bold flex items-center gap-1.5">
                                💬 Sobre ti
                            </Label>
                            <Textarea
                                placeholder="Cuéntanos algo sobre ti... ¿Qué tipo de compañero/a eres?"
                                value={basicInfo.bio}
                                onChange={(e) => setBasicInfo(prev => ({ ...prev, bio: e.target.value }))}
                                className="rounded-xl resize-none min-h-[80px]"
                                maxLength={300}
                            />
                            <p className="text-[10px] text-muted-foreground text-right">{basicInfo.bio.length}/300</p>
                        </div>

                        {/* Hobbies */}
                        <div className="space-y-3">
                            <Label className="text-sm font-bold flex items-center gap-1.5">
                                ❤️ Tus hobbies e intereses *
                                <span className="text-xs font-normal text-muted-foreground">(mín. 2)</span>
                            </Label>
                            <div className="flex flex-wrap gap-2">
                                {HOBBY_OPTIONS.map((hobby) => (
                                    <button
                                        key={hobby}
                                        type="button"
                                        onClick={() => toggleHobby(hobby)}
                                        className={cn(
                                            "text-xs font-medium px-3 py-2 rounded-full border transition-all duration-200",
                                            basicInfo.hobbies.includes(hobby)
                                                ? "bg-primary text-white border-primary shadow-md shadow-primary/20 scale-105"
                                                : "bg-muted/30 text-foreground border-border/40 hover:border-primary/30 hover:bg-primary/5"
                                        )}
                                    >
                                        {hobby}
                                    </button>
                                ))}
                            </div>
                            {basicInfo.hobbies.length > 0 && (
                                <p className="text-xs text-primary font-medium">
                                    {basicInfo.hobbies.length} seleccionado{basicInfo.hobbies.length !== 1 ? "s" : ""}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-8 text-center">
                        <Button
                            size="lg"
                            onClick={() => setStep(2)}
                            disabled={!isStep1Valid}
                            className="w-full h-14 rounded-2xl font-bold text-base shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            Siguiente: Estilo de convivencia
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        {!isStep1Valid && (
                            <p className="text-xs text-muted-foreground mt-3">
                                Completa nombre, edad, estudios y elige al menos 2 hobbies
                            </p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // ─────────────────────────────────────────
    //  Step 2: Life Graph Sliders
    // ─────────────────────────────────────────
    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-lg">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-primary via-blue-500 to-purple-500 flex items-center justify-center shadow-xl shadow-primary/20">
                        <Sparkles className="h-9 w-9 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-foreground mb-2">
                        Tu estilo de convivencia
                    </h1>
                    <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                        Ajusta los niveles para encontrar compañeros compatibles contigo
                    </p>
                    {/* Step indicator */}
                    <div className="flex items-center justify-center gap-3 mt-5">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-green-500 text-white text-sm font-bold flex items-center justify-center">✓</div>
                            <span className="text-sm text-green-600 font-semibold">Tu info</span>
                        </div>
                        <div className="w-8 h-px bg-primary" />
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">2</div>
                            <span className="text-sm font-semibold text-primary">Convivencia</span>
                        </div>
                    </div>
                </div>

                {/* Sliders Card */}
                <div className="bg-white rounded-[2rem] shadow-xl shadow-primary/5 border border-border/40 p-8 space-y-7">
                    {sliderConfig.map((s) => {
                        const Icon = s.icon;
                        return (
                            <div key={s.key} className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className={cn("p-2 rounded-xl bg-muted/50", s.color)}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1">
                                        <Label className="text-sm font-bold text-foreground flex items-center gap-1.5">
                                            {s.emoji} {s.label}
                                        </Label>
                                        <p className="text-xs text-muted-foreground">{s.description}</p>
                                    </div>
                                    <span className="text-sm font-black text-primary bg-primary/10 px-3 py-1 rounded-full min-w-[44px] text-center">
                                        {lifeGraph[s.key]}
                                    </span>
                                </div>
                                <div className="px-1">
                                    <Slider
                                        value={[lifeGraph[s.key]]}
                                        min={1}
                                        max={5}
                                        step={1}
                                        onValueChange={(val) =>
                                            setLifeGraph((prev) => ({ ...prev, [s.key]: val[0] }))
                                        }
                                        className="py-1"
                                    />
                                    <div className="flex justify-between mt-1">
                                        <span className="text-[10px] text-muted-foreground/60">{s.lowLabel}</span>
                                        <span className="text-[10px] text-muted-foreground/60">{s.highLabel}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Radar Preview */}
                <div className="mt-6 bg-white rounded-[2rem] shadow-lg shadow-primary/5 border border-border/30 p-6">
                    <h3 className="text-sm font-bold text-foreground mb-1 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        Tu Gráfico de Vida
                    </h3>
                    <p className="text-[10px] text-muted-foreground mb-3">Así te verán otros usuarios</p>
                    <div className="flex justify-center">
                        <LifeGraphPreview data={lifeGraph} size={220} />
                    </div>
                    <div className="grid grid-cols-5 gap-1 mt-3">
                        {(["limpieza", "fiesta", "estudios", "visitas", "ruido"] as (keyof LifeGraphData)[]).map((key) => (
                            <div key={key} className="text-center">
                                <p className="text-[10px] font-bold text-muted-foreground capitalize">{key}</p>
                                <p className="text-lg font-black text-primary">{lifeGraph[key]}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTAs */}
                <div className="mt-8 space-y-3">
                    <Button
                        size="lg"
                        onClick={handleSave}
                        className="w-full h-14 rounded-2xl font-bold text-base shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                    >
                        Guardar y explorar perfiles
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => setStep(1)}
                        className="w-full rounded-2xl text-sm"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver a tu información
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                        Podrás cambiar estos valores más adelante desde los filtros
                    </p>
                </div>
            </div>
        </div>
    );
};

/** Inline radar chart for the preview (self-contained, uses canvas) */
function LifeGraphPreview({ data, size = 220 }: { data: LifeGraphData; size?: number }) {
    const canvasRef = (canvas: HTMLCanvasElement | null) => {
        if (!canvas) return;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = size * dpr;
        canvas.height = size * dpr;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, size, size);

        const keys: (keyof LifeGraphData)[] = ["limpieza", "fiesta", "estudios", "visitas", "ruido"];
        const labels = ["🧹", "🎉", "📚", "👥", "🔊"];
        const values = keys.map((k) => data[k]);
        const numAxes = keys.length;
        const cx = size / 2;
        const cy = size / 2;
        const maxR = size / 2 - 30;
        const maxVal = 5;
        const angleStep = (2 * Math.PI) / numAxes;
        const startAngle = -Math.PI / 2;

        // Rings
        for (let ring = 1; ring <= 5; ring++) {
            const r = (ring / maxVal) * maxR;
            ctx.beginPath();
            for (let i = 0; i <= numAxes; i++) {
                const angle = startAngle + angleStep * (i % numAxes);
                const x = cx + r * Math.cos(angle);
                const y = cy + r * Math.sin(angle);
                i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.strokeStyle = ring === maxVal ? "rgba(59, 130, 246, 0.15)" : "rgba(148, 163, 184, 0.12)";
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Axes
        for (let i = 0; i < numAxes; i++) {
            const angle = startAngle + angleStep * i;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + maxR * Math.cos(angle), cy + maxR * Math.sin(angle));
            ctx.strokeStyle = "rgba(148, 163, 184, 0.15)";
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
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
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

        // Labels (emoji)
        ctx.font = "16px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        for (let i = 0; i < numAxes; i++) {
            const angle = startAngle + angleStep * i;
            const labelR = maxR + 18;
            const x = cx + labelR * Math.cos(angle);
            const y = cy + labelR * Math.sin(angle);
            ctx.fillText(labels[i], x, y);
        }
    };

    return (
        <canvas
            ref={canvasRef}
            style={{ width: size, height: size }}
            className="mx-auto"
        />
    );
}

export default CreateLifeProfile;
