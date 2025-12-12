import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import {
    Sun, Moon, Sparkles, Volume2, VolumeX, Music,
    Cigarette, Dog, Wine, Users, UserCircle, GraduationCap,
    Euro, Heart, Check, ArrowRight, ArrowLeft, X, Home
} from 'lucide-react';
import { usePreferences, interestTags, defaultPreferences, UserPreferences } from '@/contexts/PreferencesContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface PreferencesQuestionnaireProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: () => void;
}

const TOTAL_STEPS = 5;

// Step 1: Sleep & Schedule
const SleepStep = ({
    value,
    onChange
}: {
    value: UserPreferences;
    onChange: (updates: Partial<UserPreferences>) => void;
}) => (
    <div className="space-y-6">
        <div className="text-center mb-6">
            <h3 className="text-xl font-bold mb-2">¿Cuándo duermes?</h3>
            <p className="text-muted-foreground text-sm">
                Esto nos ayuda a encontrar compañeros con horarios compatibles
            </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
            {[
                { value: 'madrugador', icon: Sun, label: 'Madrugador', desc: 'Duermo antes de las 23h' },
                { value: 'intermedio', icon: Sparkles, label: 'Normal', desc: 'Entre 23h y 00h' },
                { value: 'nocturno', icon: Moon, label: 'Noctámbulo', desc: 'Después de la 1h' }
            ].map((option) => (
                <button
                    key={option.value}
                    onClick={() => onChange({ sleepSchedule: option.value as any })}
                    className={cn(
                        "flex flex-col items-center p-4 rounded-xl border-2 transition-all",
                        value.sleepSchedule === option.value
                            ? "border-primary bg-primary/10"
                            : "border-muted hover:border-primary/50"
                    )}
                >
                    <option.icon className={cn(
                        "h-8 w-8 mb-2",
                        value.sleepSchedule === option.value ? "text-primary" : "text-muted-foreground"
                    )} />
                    <span className="font-medium text-sm">{option.label}</span>
                    <span className="text-xs text-muted-foreground text-center mt-1">{option.desc}</span>
                </button>
            ))}
        </div>
    </div>
);

// Step 2: Lifestyle
const LifestyleStep = ({
    value,
    onChange
}: {
    value: UserPreferences;
    onChange: (updates: Partial<UserPreferences>) => void;
}) => (
    <div className="space-y-6">
        <div className="text-center mb-6">
            <h3 className="text-xl font-bold mb-2">Tu estilo de vida</h3>
            <p className="text-muted-foreground text-sm">
                Cuéntanos cómo te gusta vivir
            </p>
        </div>

        {/* Cleanliness slider */}
        <div className="space-y-3">
            <Label className="flex items-center justify-between">
                <span>Nivel de orden</span>
                <Badge variant="outline">
                    {value.cleanlinessLevel === 1 && 'Muy relajado'}
                    {value.cleanlinessLevel === 2 && 'Relajado'}
                    {value.cleanlinessLevel === 3 && 'Normal'}
                    {value.cleanlinessLevel === 4 && 'Ordenado'}
                    {value.cleanlinessLevel === 5 && 'Muy ordenado'}
                </Badge>
            </Label>
            <Slider
                value={[value.cleanlinessLevel]}
                onValueChange={(v) => onChange({ cleanlinessLevel: v[0] as any })}
                min={1}
                max={5}
                step={1}
                className="py-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
                <span>Relajado</span>
                <span>Muy ordenado</span>
            </div>
        </div>

        {/* Noise level */}
        <div className="space-y-3">
            <Label>Ambiente en casa</Label>
            <div className="grid grid-cols-3 gap-2">
                {[
                    { value: 'silencioso', icon: VolumeX, label: 'Silencioso' },
                    { value: 'moderado', icon: Volume2, label: 'Normal' },
                    { value: 'social', icon: Music, label: 'Animado' }
                ].map((option) => (
                    <button
                        key={option.value}
                        onClick={() => onChange({ noiseLevel: option.value as any })}
                        className={cn(
                            "flex items-center justify-center gap-2 p-3 rounded-lg border transition-all",
                            value.noiseLevel === option.value
                                ? "border-primary bg-primary/10"
                                : "border-muted hover:border-primary/50"
                        )}
                    >
                        <option.icon className="h-4 w-4" />
                        <span className="text-sm">{option.label}</span>
                    </button>
                ))}
            </div>
        </div>

        {/* Quick toggles */}
        <div className="grid grid-cols-2 gap-3">
            {[
                { key: 'smokingAllowed', icon: Cigarette, label: 'Fumadores OK', color: 'text-orange-500' },
                { key: 'petsAllowed', icon: Dog, label: 'Mascotas OK', color: 'text-amber-600' },
                { key: 'alcoholAllowed', icon: Wine, label: 'Alcohol OK', color: 'text-purple-500' },
                { key: 'partiesAllowed', icon: Music, label: 'Fiestas OK', color: 'text-pink-500' }
            ].map((toggle) => (
                <button
                    key={toggle.key}
                    onClick={() => onChange({ [toggle.key]: !value[toggle.key as keyof UserPreferences] })}
                    className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border transition-all",
                        value[toggle.key as keyof UserPreferences]
                            ? "border-primary bg-primary/10"
                            : "border-muted"
                    )}
                >
                    <toggle.icon className={cn("h-5 w-5", toggle.color)} />
                    <span className="text-sm">{toggle.label}</span>
                    {value[toggle.key as keyof UserPreferences] && (
                        <Check className="h-4 w-4 text-primary ml-auto" />
                    )}
                </button>
            ))}
        </div>
    </div>
);

// Step 3: Social
const SocialStep = ({
    value,
    onChange
}: {
    value: UserPreferences;
    onChange: (updates: Partial<UserPreferences>) => void;
}) => (
    <div className="space-y-6">
        <div className="text-center mb-6">
            <h3 className="text-xl font-bold mb-2">¿Cómo eres socialmente?</h3>
            <p className="text-muted-foreground text-sm">
                Buscamos a alguien compatible contigo
            </p>
        </div>

        {/* Social level */}
        <div className="space-y-3">
            <Label>Nivel social</Label>
            <div className="grid grid-cols-3 gap-3">
                {[
                    { value: 'introvertido', icon: UserCircle, label: 'Tranquilo', desc: 'Prefiero mi espacio' },
                    { value: 'ambivertido', icon: Users, label: 'Flexible', desc: 'Depende del día' },
                    { value: 'extrovertido', icon: Heart, label: 'Social', desc: 'Me encanta compartir' }
                ].map((option) => (
                    <button
                        key={option.value}
                        onClick={() => onChange({ socialLevel: option.value as any })}
                        className={cn(
                            "flex flex-col items-center p-4 rounded-xl border-2 transition-all",
                            value.socialLevel === option.value
                                ? "border-primary bg-primary/10"
                                : "border-muted hover:border-primary/50"
                        )}
                    >
                        <option.icon className={cn(
                            "h-6 w-6 mb-2",
                            value.socialLevel === option.value ? "text-primary" : "text-muted-foreground"
                        )} />
                        <span className="font-medium text-sm">{option.label}</span>
                        <span className="text-xs text-muted-foreground text-center">{option.desc}</span>
                    </button>
                ))}
            </div>
        </div>

        {/* Guests */}
        <div className="space-y-3">
            <Label>¿Traes invitados a casa?</Label>
            <RadioGroup
                value={value.guestsFrequency}
                onValueChange={(v) => onChange({ guestsFrequency: v as any })}
                className="grid grid-cols-3 gap-2"
            >
                {[
                    { value: 'nunca', label: 'Casi nunca' },
                    { value: 'ocasional', label: 'A veces' },
                    { value: 'frecuente', label: 'Bastante' }
                ].map((option) => (
                    <Label
                        key={option.value}
                        className={cn(
                            "flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all",
                            value.guestsFrequency === option.value
                                ? "border-primary bg-primary/10"
                                : "border-muted hover:border-primary/50"
                        )}
                    >
                        <RadioGroupItem value={option.value} className="sr-only" />
                        <span className="text-sm">{option.label}</span>
                    </Label>
                ))}
            </RadioGroup>
        </div>

        {/* Gender preference */}
        <div className="space-y-3">
            <Label>Prefiero vivir con</Label>
            <RadioGroup
                value={value.genderPreference}
                onValueChange={(v) => onChange({ genderPreference: v as any })}
                className="grid grid-cols-2 gap-2"
            >
                {[
                    { value: 'cualquiera', label: 'Me da igual' },
                    { value: 'solo_chicas', label: 'Solo chicas' },
                    { value: 'solo_chicos', label: 'Solo chicos' },
                    { value: 'mixto', label: 'Piso mixto' }
                ].map((option) => (
                    <Label
                        key={option.value}
                        className={cn(
                            "flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all",
                            value.genderPreference === option.value
                                ? "border-primary bg-primary/10"
                                : "border-muted hover:border-primary/50"
                        )}
                    >
                        <RadioGroupItem value={option.value} className="sr-only" />
                        <span className="text-sm">{option.label}</span>
                    </Label>
                ))}
            </RadioGroup>
        </div>
    </div>
);

// Step 4: Budget
const BudgetStep = ({
    value,
    onChange
}: {
    value: UserPreferences;
    onChange: (updates: Partial<UserPreferences>) => void;
}) => (
    <div className="space-y-6">
        <div className="text-center mb-6">
            <h3 className="text-xl font-bold mb-2">Tu presupuesto</h3>
            <p className="text-muted-foreground text-sm">
                ¿Cuánto quieres gastar al mes?
            </p>
        </div>

        <div className="bg-primary/10 rounded-2xl p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
                <Euro className="h-6 w-6 text-primary" />
                <span className="text-3xl font-bold text-primary">
                    {value.budgetMin}€ - {value.budgetMax}€
                </span>
            </div>
            <p className="text-sm text-muted-foreground">al mes</p>
        </div>

        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Mínimo: {value.budgetMin}€</Label>
                <Slider
                    value={[value.budgetMin]}
                    onValueChange={(v) => onChange({ budgetMin: Math.min(v[0], value.budgetMax - 50) })}
                    min={150}
                    max={800}
                    step={25}
                />
            </div>

            <div className="space-y-2">
                <Label>Máximo: {value.budgetMax}€</Label>
                <Slider
                    value={[value.budgetMax]}
                    onValueChange={(v) => onChange({ budgetMax: Math.max(v[0], value.budgetMin + 50) })}
                    min={200}
                    max={1200}
                    step={25}
                />
            </div>
        </div>

        <div className="flex justify-between text-xs text-muted-foreground">
            <span>150€</span>
            <span>600€</span>
            <span>1200€</span>
        </div>
    </div>
);

// Step 5: Interests
const InterestsStep = ({
    value,
    onChange
}: {
    value: UserPreferences;
    onChange: (updates: Partial<UserPreferences>) => void;
}) => {
    const toggleInterest = (interest: string) => {
        const current = value.interests || [];
        const updated = current.includes(interest)
            ? current.filter(i => i !== interest)
            : [...current, interest];
        onChange({ interests: updated });
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">Tus intereses</h3>
                <p className="text-muted-foreground text-sm">
                    Selecciona al menos 3 para encontrar gente afín
                </p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
                {interestTags.map((interest) => (
                    <button
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium transition-all",
                            value.interests?.includes(interest)
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted hover:bg-muted/80"
                        )}
                    >
                        {interest}
                    </button>
                ))}
            </div>

            {(value.interests?.length || 0) < 3 && (
                <p className="text-center text-sm text-amber-600">
                    Selecciona al menos {3 - (value.interests?.length || 0)} más
                </p>
            )}
        </div>
    );
};

export const PreferencesQuestionnaire = ({
    isOpen,
    onClose,
    onComplete
}: PreferencesQuestionnaireProps) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<UserPreferences>(defaultPreferences);
    const { savePreferences } = usePreferences();
    const { user } = useAuth();

    const handleChange = (updates: Partial<UserPreferences>) => {
        setFormData(prev => ({ ...prev, ...updates }));
    };

    const handleNext = () => {
        if (step < TOTAL_STEPS) {
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleComplete = async () => {
        await savePreferences(formData);
        localStorage.setItem(`livix_questionnaire_shown_${user?.id || 'guest'}`, 'true');
        toast.success('¡Preferencias guardadas!', {
            description: 'Ahora verás pisos más compatibles contigo'
        });
        onComplete();
    };

    const canProceed = () => {
        if (step === 5) {
            return (formData.interests?.length || 0) >= 3;
        }
        return true;
    };

    const progress = (step / TOTAL_STEPS) * 100;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="flex items-center gap-2">
                            <Home className="h-5 w-5 text-primary" />
                            Encuentra tu match
                        </DialogTitle>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <Progress value={progress} className="h-2 mt-4" />
                    <p className="text-xs text-muted-foreground text-center mt-2">
                        Paso {step} de {TOTAL_STEPS}
                    </p>
                </DialogHeader>

                <div className="py-4">
                    {step === 1 && <SleepStep value={formData} onChange={handleChange} />}
                    {step === 2 && <LifestyleStep value={formData} onChange={handleChange} />}
                    {step === 3 && <SocialStep value={formData} onChange={handleChange} />}
                    {step === 4 && <BudgetStep value={formData} onChange={handleChange} />}
                    {step === 5 && <InterestsStep value={formData} onChange={handleChange} />}
                </div>

                <div className="flex gap-3 pt-4 border-t">
                    {step > 1 ? (
                        <Button variant="outline" onClick={handleBack} className="flex-1">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Atrás
                        </Button>
                    ) : (
                        <Button variant="ghost" onClick={onClose} className="flex-1">
                            Ahora no
                        </Button>
                    )}

                    {step < TOTAL_STEPS ? (
                        <Button onClick={handleNext} className="flex-1" disabled={!canProceed()}>
                            Siguiente
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    ) : (
                        <Button onClick={handleComplete} className="flex-1" disabled={!canProceed()}>
                            <Check className="h-4 w-4 mr-2" />
                            ¡Listo!
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PreferencesQuestionnaire;
