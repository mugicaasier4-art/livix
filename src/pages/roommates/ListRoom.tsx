
import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
    Camera,
    MapPin,
    Euro,
    Maximize,
    Calendar as CalendarIcon,
    CheckCircle,
    ArrowRight,
    ArrowLeft,
    Upload,
    X,
    Sparkles,
    Home
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useListings } from "@/hooks/useListings";
import { cn } from "@/lib/utils";

const ListRoom = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { createListing, isLoading } = useListings();
    const [currentStep, setCurrentStep] = useState(1);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        // Step 1: Basics
        photos: [] as File[],
        photoPreviews: [] as string[],
        price: "",
        billsIncluded: false,
        address: "",
        city: "Zaragoza", // Default for now, maybe geolocation later

        // Step 2: Details
        sizeCategory: "normal" as "tiny" | "normal" | "big", // <10, 10-15, >15
        sizeM2: 12,
        description: "",
        availableFrom: new Date(),
        houseRules: [] as string[],
    });

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const newFiles = Array.from(files);
        const newPreviews = newFiles.map(file => URL.createObjectURL(file));

        setFormData(prev => ({
            ...prev,
            photos: [...prev.photos, ...newFiles],
            photoPreviews: [...prev.photoPreviews, ...newPreviews]
        }));
    };

    const removePhoto = (index: number) => {
        const newPhotos = [...formData.photos];
        const newPreviews = [...formData.photoPreviews];

        URL.revokeObjectURL(newPreviews[index]); // Cleanup
        newPhotos.splice(index, 1);
        newPreviews.splice(index, 1);

        setFormData(prev => ({
            ...prev,
            photos: newPhotos,
            photoPreviews: newPreviews
        }));
    };

    const handleNext = () => {
        if (currentStep === 1) {
            if (formData.photos.length === 0) {
                toast.error("Al menos una foto, por favor 🙏");
                return;
            }
            if (!formData.price || isNaN(Number(formData.price))) {
                toast.error("El precio importa 💸");
                return;
            }
            if (!formData.address) {
                toast.error("¿Dónde está el piso? 📍");
                return;
            }
            setCurrentStep(2);
        } else {
            // Finalize
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        if (!user) {
            toast.error("Necesitas iniciar sesión para publicar");
            // TODO: Save state to localStorage and redirect to login
            navigate(`/login?redirect=/publicar-habitacion`);
            return;
        }

        try {
            // Map simplified form to full listing structure
            // Note: This is a simplified submission. In a real scenario, we might want to ask more details later
            // or infer them.

            const title = `Habitación en ${formData.address}`; // Simple generated title

            await createListing({
                title: title,
                description: formData.description || `Habitación disponible en ${formData.address}.`,
                address: formData.address,
                city: formData.city,
                price: Number(formData.price),
                available_from: formData.availableFrom.toISOString(),
                property_type: 'room',
                images: formData.photos,
                utilities_included: formData.billsIncluded,
                room_area_sqm: formData.sizeM2,

                // Defaults for required fields in DB
                bedrooms: 1,
                bathrooms: 1,

                // Extended attributes could be added here
            });

            toast.success("¡Habitación publicada! 🎉");
            navigate("/ll/dashboard"); // Or to the listing page
        } catch (error) {
            console.error(error);
            toast.error("Algo salió mal al publicar");
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Simple Header */}
            <header className="border-b py-4 px-6 flex justify-between items-center bg-white sticky top-0 z-10">
                <Link to="/" className="font-bold text-xl text-primary font-outfit">livix</Link>
                <div className="text-sm font-medium text-muted-foreground">
                    Paso {currentStep} de 2
                </div>
            </header>

            <main className="flex-1 container max-w-lg mx-auto p-4 py-8">

                {/* STEP 1 */}
                {currentStep === 1 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight">Publica tu habitación</h1>
                            <p className="text-muted-foreground text-lg">Rápido, fácil y sin líos.</p>
                        </div>

                        {/* Photos */}
                        <div className="space-y-4">
                            <Label className="text-lg font-semibold flex items-center gap-2">
                                <Camera className="w-5 h-5 text-primary" />
                                Fotos de la habitación
                            </Label>

                            <div className="grid grid-cols-3 gap-3">
                                {formData.photoPreviews.map((src, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border group">
                                        <img src={src} alt="Preview" className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => removePhoto(idx)}
                                            className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}

                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="aspect-square rounded-xl border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                                >
                                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                                    <span className="text-xs text-muted-foreground font-medium">Añadir foto</span>
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    multiple
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                />
                            </div>
                            {formData.photos.length === 0 && (
                                <p className="text-sm text-amber-600">Sube al menos una foto para continuar.</p>
                            )}
                        </div>

                        {/* Price */}
                        <div className="space-y-4">
                            <Label className="text-lg font-semibold flex items-center gap-2">
                                <Euro className="w-5 h-5 text-primary" />
                                Precio mensual
                            </Label>
                            <div className="relative">
                                <Input
                                    type="number"
                                    placeholder="350"
                                    className="pl-9 text-lg h-12"
                                    value={formData.price}
                                    onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                />
                                <span className="absolute left-3 top-3 text-muted-foreground">€</span>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border">
                                <Label htmlFor="bills" className="cursor-pointer flex-1">
                                    <span className="font-medium block">¿Gastos incluidos?</span>
                                    <span className="text-sm text-muted-foreground">Luz, agua, internet...</span>
                                </Label>
                                <Switch
                                    id="bills"
                                    checked={formData.billsIncluded}
                                    onCheckedChange={checked => setFormData(prev => ({ ...prev, billsIncluded: checked }))}
                                />
                            </div>
                        </div>

                        {/* Location */}
                        <div className="space-y-4">
                            <Label className="text-lg font-semibold flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-primary" />
                                Ubicación
                            </Label>
                            <Input
                                placeholder="Calle y número aprox."
                                className="h-12 text-lg"
                                value={formData.address}
                                onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                            />
                            <p className="text-sm text-muted-foreground">
                                No mostraremos el número exacto hasta que confirmes la reserva.
                            </p>
                        </div>
                    </div>
                )}

                {/* STEP 2 */}
                {currentStep === 2 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                        <div className="text-center space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight">Detalles finales</h1>
                            <p className="text-muted-foreground text-lg">Vende tu habitación.</p>
                        </div>

                        {/* Size */}
                        <div className="space-y-4">
                            <Label className="text-lg font-semibold flex items-center gap-2">
                                <Maximize className="w-5 h-5 text-primary" />
                                Tamaño aprox.
                            </Label>

                            <div className="grid grid-cols-3 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, sizeCategory: 'tiny', sizeM2: 8 }))}
                                    className={cn(
                                        "p-4 rounded-xl border-2 transition-all text-center",
                                        formData.sizeCategory === 'tiny' ? "border-primary bg-primary/5" : "border-transparent bg-muted hover:bg-muted/80"
                                    )}
                                >
                                    <div className="text-2xl mb-1">🤏</div>
                                    <div className="font-medium">Pequeña</div>
                                    <div className="text-xs text-muted-foreground">~8 m²</div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, sizeCategory: 'normal', sizeM2: 12 }))}
                                    className={cn(
                                        "p-4 rounded-xl border-2 transition-all text-center",
                                        formData.sizeCategory === 'normal' ? "border-primary bg-primary/5" : "border-transparent bg-muted hover:bg-muted/80"
                                    )}
                                >
                                    <div className="text-2xl mb-1">👍</div>
                                    <div className="font-medium">Normal</div>
                                    <div className="text-xs text-muted-foreground">~12 m²</div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, sizeCategory: 'big', sizeM2: 18 }))}
                                    className={cn(
                                        "p-4 rounded-xl border-2 transition-all text-center",
                                        formData.sizeCategory === 'big' ? "border-primary bg-primary/5" : "border-transparent bg-muted hover:bg-muted/80"
                                    )}
                                >
                                    <div className="text-2xl mb-1">🏟️</div>
                                    <div className="font-medium">Grande</div>
                                    <div className="text-xs text-muted-foreground">~18 m²</div>
                                </button>
                            </div>

                            <div className="flex items-center gap-4 px-2">
                                <Slider
                                    value={[formData.sizeM2]}
                                    min={5}
                                    max={30}
                                    step={1}
                                    onValueChange={val => setFormData(prev => ({ ...prev, sizeM2: val[0] }))}
                                />
                                <span className="font-mono w-16 text-right">{formData.sizeM2} m²</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-4">
                            <Label className="text-lg font-semibold flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-primary" />
                                Descripción rápida
                            </Label>
                            <Textarea
                                placeholder="Busco alguien tranquilo, el piso es muy luminoso..."
                                className="min-h-[120px] text-base resize-none"
                                value={formData.description}
                                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            />
                        </div>

                        {/* Availability */}
                        <div className="space-y-4">
                            <Label className="text-lg font-semibold flex items-center gap-2">
                                <CalendarIcon className="w-5 h-5 text-primary" />
                                Disponible desde
                            </Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full h-12 justify-start text-left font-normal text-lg",
                                            !formData.availableFrom && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-5 w-5" />
                                        {formData.availableFrom ? format(formData.availableFrom, "PPP", { locale: es }) : <span>Selecciona fecha</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={formData.availableFrom}
                                        onSelect={date => date && setFormData(prev => ({ ...prev, availableFrom: date }))}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                    </div>
                )}

            </main>

            {/* Footer / Navigation */}
            <footer className="p-4 border-t bg-white sticky bottom-0">
                <div className="container max-w-lg mx-auto flex gap-4">
                    {currentStep > 1 && (
                        <Button variant="outline" size="lg" onClick={() => setCurrentStep(currentStep - 1)}>
                            Atrás
                        </Button>
                    )}
                    <Button
                        className="flex-1 text-lg font-bold"
                        size="lg"
                        onClick={handleNext}
                        disabled={isLoading}
                    >
                        {isLoading ? "Publicando..." : currentStep === 2 ? "Publicar ahora 🚀" : "Siguiente"}
                        {!isLoading && currentStep === 1 && <ArrowRight className="ml-2 w-5 h-5" />}
                    </Button>
                </div>
            </footer>
        </div>
    );
};

export default ListRoom;
