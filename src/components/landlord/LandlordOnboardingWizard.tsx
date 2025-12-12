import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
    Home, Camera, Euro, MapPin, Check, ArrowRight, ArrowLeft,
    Upload, Sparkles, Phone, User, Building2, CheckCircle2,
    HelpCircle, Lightbulb, Gift
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface LandlordOnboardingWizardProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: () => void;
}

const TOTAL_STEPS = 4;

// Tip component for elderly-friendly help
const Tip = ({ text }: { text: string }) => (
    <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
        <Lightbulb className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800 dark:text-amber-200">{text}</p>
    </div>
);

// Step 1: Basic info
const BasicInfoStep = ({
    data,
    onChange
}: {
    data: any;
    onChange: (updates: any) => void;
}) => (
    <div className="space-y-6">
        <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-2">¡Bienvenido!</h3>
            <p className="text-muted-foreground">
                Vamos a crear tu primer anuncio. Solo son 4 pasos.
            </p>
        </div>

        <Tip text="Este proceso solo toma 5 minutos. Puedes editarlo después." />

        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-medium">
                    ¿Cómo te llamas?
                </Label>
                <Input
                    id="name"
                    placeholder="Ej: María García"
                    value={data.name || ''}
                    onChange={(e) => onChange({ name: e.target.value })}
                    className="h-12 text-lg"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="phone" className="text-base font-medium">
                    Tu teléfono (para que te contacten)
                </Label>
                <Input
                    id="phone"
                    type="tel"
                    placeholder="Ej: 612 345 678"
                    value={data.phone || ''}
                    onChange={(e) => onChange({ phone: e.target.value })}
                    className="h-12 text-lg"
                />
                <p className="text-xs text-muted-foreground">
                    Solo lo verán los estudiantes interesados
                </p>
            </div>
        </div>
    </div>
);

// Step 2: Property info
const PropertyInfoStep = ({
    data,
    onChange
}: {
    data: any;
    onChange: (updates: any) => void;
}) => (
    <div className="space-y-6">
        <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Tu propiedad</h3>
            <p className="text-muted-foreground">
                Cuéntanos sobre el piso o habitación
            </p>
        </div>

        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="title" className="text-base font-medium">
                    Título del anuncio
                </Label>
                <Input
                    id="title"
                    placeholder="Ej: Habitación luminosa cerca de la universidad"
                    value={data.title || ''}
                    onChange={(e) => onChange({ title: e.target.value })}
                    className="h-12 text-lg"
                />
                <Tip text="Un buen título describe lo mejor del piso en pocas palabras" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="address" className="text-base font-medium">
                    Dirección
                </Label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        id="address"
                        placeholder="Ej: Calle Gran Vía 15, Zaragoza"
                        value={data.address || ''}
                        onChange={(e) => onChange({ address: e.target.value })}
                        className="h-12 text-lg pl-10"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="price" className="text-base font-medium">
                    Precio mensual
                </Label>
                <div className="relative">
                    <Euro className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        id="price"
                        type="number"
                        placeholder="350"
                        value={data.price || ''}
                        onChange={(e) => onChange({ price: e.target.value })}
                        className="h-12 text-lg pl-10"
                    />
                </div>
                <p className="text-xs text-muted-foreground">
                    El precio medio en Zaragoza es 300-450€/mes
                </p>
            </div>
        </div>
    </div>
);

// Step 3: Photos
const PhotosStep = ({
    data,
    onChange
}: {
    data: any;
    onChange: (updates: any) => void;
}) => (
    <div className="space-y-6">
        <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Añade fotos</h3>
            <p className="text-muted-foreground">
                Los anuncios con fotos reciben 10x más visitas
            </p>
        </div>

        <Tip text="Puedes hacer fotos con el móvil. Las mejores son con luz natural." />

        <div className="border-2 border-dashed border-muted rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
            <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                id="photo-upload"
                onChange={(e) => {
                    // Handle file upload
                    const files = Array.from(e.target.files || []);
                    onChange({ photos: [...(data.photos || []), ...files] });
                }}
            />
            <label htmlFor="photo-upload" className="cursor-pointer">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">Pulsa para añadir fotos</p>
                <p className="text-sm text-muted-foreground">
                    Puedes subir varias a la vez
                </p>
            </label>
        </div>

        {(data.photos?.length || 0) > 0 && (
            <div className="flex items-center gap-2 text-success">
                <CheckCircle2 className="h-5 w-5" />
                <span>{data.photos.length} foto(s) añadida(s)</span>
            </div>
        )}

        <Button variant="outline" className="w-full gap-2">
            <HelpCircle className="h-4 w-4" />
            Saltar por ahora (puedo añadir después)
        </Button>
    </div>
);

// Step 4: Complete
const CompleteStep = ({ data }: { data: any }) => {
    const freeListingsRemaining = 2; // This would come from user data

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-10 w-10 text-success" />
                </div>
                <h3 className="text-2xl font-bold mb-2">¡Casi listo!</h3>
                <p className="text-muted-foreground">
                    Tu anuncio está preparado para publicar
                </p>
            </div>

            {/* Preview card */}
            <Card className="border-2 border-primary/20">
                <CardContent className="p-4">
                    <div className="flex gap-4">
                        <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                            {data.photos?.length > 0 ? (
                                <img
                                    src={URL.createObjectURL(data.photos[0])}
                                    alt="Preview"
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            ) : (
                                <Camera className="h-8 w-8 text-muted-foreground" />
                            )}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold line-clamp-1">{data.title || 'Mi anuncio'}</h4>
                            <p className="text-sm text-muted-foreground">{data.address || 'Zaragoza'}</p>
                            <p className="text-xl font-bold text-primary mt-1">
                                {data.price ? `€${data.price}/mes` : 'Precio por definir'}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Freemium info */}
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                        <Gift className="h-8 w-8 text-primary" />
                        <div>
                            <p className="font-semibold">¡Este anuncio es GRATIS!</p>
                            <p className="text-sm text-muted-foreground">
                                Te quedan {freeListingsRemaining} anuncios gratuitos
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-2 text-center">
                <p className="text-sm text-muted-foreground">
                    Al publicar, aceptas nuestros términos de servicio
                </p>
            </div>
        </div>
    );
};

export const LandlordOnboardingWizard = ({
    isOpen,
    onClose,
    onComplete
}: LandlordOnboardingWizardProps) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<any>({});
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleChange = (updates: any) => {
        setFormData((prev: any) => ({ ...prev, ...updates }));
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

    const handlePublish = async () => {
        // Save listing logic here
        toast.success('¡Anuncio publicado!', {
            description: 'Los estudiantes ya pueden verlo',
            duration: 5000
        });

        // Mark onboarding as complete
        localStorage.setItem(`livix_landlord_onboarding_${user?.id}`, 'complete');

        onComplete();

        // Navigate to dashboard
        navigate('/landlord/dashboard');
    };

    const canProceed = () => {
        switch (step) {
            case 1:
                return formData.name?.length > 2;
            case 2:
                return formData.title?.length > 5 && formData.address?.length > 5 && formData.price > 0;
            case 3:
                return true; // Photos are optional
            case 4:
                return true;
            default:
                return true;
        }
    };

    const progress = (step / TOTAL_STEPS) * 100;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-primary" />
                            Publicar anuncio
                        </DialogTitle>
                        <Badge variant="outline" className="text-xs">
                            Paso {step} de {TOTAL_STEPS}
                        </Badge>
                    </div>
                    <Progress value={progress} className="h-2 mt-4" />
                </DialogHeader>

                <div className="py-4">
                    {step === 1 && <BasicInfoStep data={formData} onChange={handleChange} />}
                    {step === 2 && <PropertyInfoStep data={formData} onChange={handleChange} />}
                    {step === 3 && <PhotosStep data={formData} onChange={handleChange} />}
                    {step === 4 && <CompleteStep data={formData} />}
                </div>

                <div className="flex gap-3 pt-4 border-t">
                    {step > 1 ? (
                        <Button variant="outline" onClick={handleBack} className="flex-1 h-12 text-base">
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            Atrás
                        </Button>
                    ) : (
                        <Button variant="ghost" onClick={onClose} className="flex-1 h-12 text-base">
                            Cancelar
                        </Button>
                    )}

                    {step < TOTAL_STEPS ? (
                        <Button
                            onClick={handleNext}
                            className="flex-1 h-12 text-base"
                            disabled={!canProceed()}
                        >
                            Siguiente
                            <ArrowRight className="h-5 w-5 ml-2" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handlePublish}
                            className="flex-1 h-12 text-base bg-success hover:bg-success/90"
                            disabled={!canProceed()}
                        >
                            <Check className="h-5 w-5 mr-2" />
                            Publicar GRATIS
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default LandlordOnboardingWizard;
