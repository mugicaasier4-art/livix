import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Sparkles, PartyPopper, SprayCan, BookOpen, Users, Volume2, ArrowRight } from "lucide-react";
import { type LifeGraphData } from "@/data/mockRoommates";
import { cn } from "@/lib/utils";

export const LIFE_PROFILE_KEY = "livix_life_profile";

export function getSavedLifeProfile(): LifeGraphData | null {
    try {
        const data = localStorage.getItem(LIFE_PROFILE_KEY);
        if (!data) return null;
        const parsed = JSON.parse(data);
        if (
            typeof parsed.limpieza === "number" &&
            typeof parsed.fiesta === "number" &&
            typeof parsed.estudios === "number" &&
            typeof parsed.visitas === "number" &&
            typeof parsed.ruido === "number"
        ) {
            return parsed as LifeGraphData;
        }
        return null;
    } catch {
        return null;
    }
}

interface CreateLifeProfileProps {
    onComplete: (profile: LifeGraphData) => void;
}

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
            label: "Estudios",
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
    const [values, setValues] = useState<LifeGraphData>({
        fiesta: 3,
        limpieza: 3,
        estudios: 3,
        visitas: 3,
        ruido: 3,
    });

    const handleSave = () => {
        localStorage.setItem(LIFE_PROFILE_KEY, JSON.stringify(values));
        onComplete(values);
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-lg">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-primary via-blue-500 to-purple-500 flex items-center justify-center shadow-xl shadow-primary/20">
                        <Sparkles className="h-9 w-9 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-foreground mb-2">
                        Crea tu perfil de convivencia
                    </h1>
                    <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                        Antes de explorar perfiles, cuéntanos cómo eres para encontrar compañeros compatibles contigo.
                    </p>
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
                                        {values[s.key]}
                                    </span>
                                </div>
                                <div className="px-1">
                                    <Slider
                                        value={[values[s.key]]}
                                        min={1}
                                        max={5}
                                        step={1}
                                        onValueChange={(val) =>
                                            setValues((prev) => ({ ...prev, [s.key]: val[0] }))
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
                        <LifeGraphPreview data={values} size={220} />
                    </div>
                    <div className="grid grid-cols-5 gap-1 mt-3">
                        {(["limpieza", "fiesta", "estudios", "visitas", "ruido"] as (keyof LifeGraphData)[]).map((key) => (
                            <div key={key} className="text-center">
                                <p className="text-[10px] font-bold text-muted-foreground capitalize">{key}</p>
                                <p className="text-lg font-black text-primary">{values[key]}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-8 text-center">
                    <Button
                        size="lg"
                        onClick={handleSave}
                        className="w-full h-14 rounded-2xl font-bold text-base shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                    >
                        Guardar y explorar perfiles
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <p className="text-xs text-muted-foreground mt-3">
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
