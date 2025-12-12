import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { z } from 'zod';
import { 
  Home, 
  Camera, 
  Users, 
  MapPin, 
  Euro, 
  Calendar,
  Wifi,
  Car,
  Utensils,
  Tv,
  WashingMachine,
  AirVent,
  Bed,
  Bath,
  ArrowRight, 
  ArrowLeft,
  Upload,
  X,
  CheckCircle,
  Loader2,
  Sparkles,
  Eye,
  TrendingUp
} from "lucide-react";
import { toast } from "sonner";
import { useListings } from "@/hooks/useListings";
import { usePremium } from "@/hooks/usePremium";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { compressImage, validateImageFile, formatFileSize } from "@/utils/imageCompression";
import PaywallModal from "@/components/common/PaywallModal";
import { Crown } from "lucide-react";

// Photo metadata
interface PhotoMetadata {
  url: string;
  label: string;
}

// Room details per room
interface RoomDetail {
  price: number;
  type: string;
  features: string[];
  photoId: string; // Reference to photo by label
}

const CreateListing = () => {
  const navigate = useNavigate();
  const { createListing, isLoading, uploadProgress } = useListings();
  const { isPremium, isLoading: isPremiumLoading, upgradeToPremium } = usePremium();
  const { user } = useAuth();
  const { updateProfile } = useProfile();
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadedPhotos, setUploadedPhotos] = useState<PhotoMetadata[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [userPhone, setUserPhone] = useState<string | null>(null);
  const [contactPhone, setContactPhone] = useState("");
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_IMAGES = 10;
  const MAX_IMAGE_SIZE_MB = 5;

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      uploadedPhotos.forEach(photo => URL.revokeObjectURL(photo.url));
    };
  }, [uploadedPhotos]);

  // Fetch user phone on mount
  useEffect(() => {
    const fetchUserPhone = async () => {
      if (!user?.id) return;
      
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('phone')
          .eq('id', user.id)
          .maybeSingle();
        
        if (profile?.phone) {
          setUserPhone(profile.phone);
          setContactPhone(profile.phone);
        }
      } catch (error) {
        console.error('Error fetching user phone:', error);
      }
    };
    
    fetchUserPhone();
  }, [user?.id]);
  
  const [formData, setFormData] = useState({
    // Basic Info
    propertyType: "",
    availableRooms: 1,
    totalRooms: 1,
    bathrooms: 1,
    
    // Location
    address: "",
    neighborhood: "",
    city: "Zaragoza",
    nearUniversity: [] as string[],
    transportAccess: [] as string[],
    
    // Photos
    photos: [] as File[],
    
    // Target Audience
    targetProfile: [] as string[],
    erasmusFriendly: false,
    languages: [] as string[],
    
    // Amenities & Features
    propertyAmenities: [] as string[],
    roomAmenities: [] as string[],
    appliances: [] as string[],
    
    // Nearby Places
    nearbyPlaces: [] as string[],
    walkingDistance: [] as string[],
    
    // Room Details (individual per room)
    rooms: [] as RoomDetail[],
    
    // Pricing & Availability
    basePrice: 0,
    utilitiesIncluded: false,
    deposit: 0,
    minimumStay: "",
    availableFrom: "",
    
    // Description
    title: "",
    description: "",
    houseRules: [] as string[],
    
    // Contact & Policies
    responseTime: "",
    viewingPolicy: "",
    contractLanguage: [] as string[],
    flexibleDeposit: false,
    
    // New fields - Phase 2
    smokingAllowed: false,
    genderPreference: "any",
    areaSqm: 0,
    roomAreaSqm: 0
  });

  // Initialize rooms array when availableRooms changes
  const updateRoomsArray = (numRooms: number) => {
    const currentRooms = formData.rooms;
    const newRooms: RoomDetail[] = [];
    
    for (let i = 0; i < numRooms; i++) {
      newRooms.push(currentRooms[i] || {
        price: 0,
        type: "",
        features: [],
        photoId: ""
      });
    }
    
    setFormData({...formData, rooms: newRooms, availableRooms: numRooms});
  };

  // Initialize rooms array on mount
  useEffect(() => {
    if (formData.rooms.length === 0 && formData.availableRooms > 0) {
      updateRoomsArray(formData.availableRooms);
    }
  }, []);

  const steps = [
    {
      id: 0,
      title: "Ubicación y tipo",
      subtitle: "¿Qué ofreces y dónde está?",
      icon: MapPin,
      progress: 20
    },
    {
      id: 1,
      title: "Fotos",
      subtitle: "Muestra tu espacio",
      icon: Camera,
      progress: 40
    },
    {
      id: 2,
      title: "Detalles y comodidades",
      subtitle: "Características y equipamiento",
      icon: Home,
      progress: 60
    },
    {
      id: 3,
      title: "Habitaciones y condiciones",
      subtitle: "Precios y disponibilidad",
      icon: Euro,
      progress: 80
    },
    {
      id: 4,
      title: "Finalizar y publicar",
      subtitle: "Última revisión",
      icon: CheckCircle,
      progress: 100
    }
  ];

  const currentStepData = steps[currentStep];

  const handleNext = () => {
    if (!validateStep()) return;
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateStep = (): boolean => {
    const step = currentStep;
    
    // Step 0: Location and Type
    if (step === 0) {
      if (!formData.propertyType) {
        toast.error("Error", { description: "Selecciona un tipo de propiedad" });
        return false;
      }
      if (!formData.address || formData.address.trim().length < 5) {
        toast.error("Error", { description: "Ingresa una dirección válida (mínimo 5 caracteres)" });
        return false;
      }
      if (!formData.city || formData.city.trim().length === 0) {
        toast.error("Error", { description: "Selecciona una ciudad" });
        return false;
      }
    }
    
    // Step 1: Photos (minimum 3 photos required)
    if (step === 1) {
      if (uploadedPhotos.length < 3) {
        toast.error("Error", { description: "Debes subir al menos 3 fotos" });
        return false;
      }
    }
    
    // Step 2: Details and amenities (optional, no validation needed)
    
    // Step 3: Rooms and Pricing
    if (step === 3) {
      if (formData.rooms.length === 0 || formData.rooms.some(room => room.price <= 0 || !room.type)) {
        toast.error("Error", { description: "Completa precio y tipo para cada habitación" });
        return false;
      }
      if (formData.deposit < 0) {
        toast.error("Error", { description: "La fianza no puede ser negativa" });
        return false;
      }
      if (!formData.availableFrom) {
        toast.error("Error", { description: "Selecciona una fecha de disponibilidad" });
        return false;
      }
      if (!formData.minimumStay) {
        toast.error("Error", { description: "Selecciona la estancia mínima" });
        return false;
      }
    }
    
    // Step 4: Description and Contact
    if (step === 4) {
      const wordCount = formData.title.trim().split(/\s+/).filter(w => w).length;
      if (!formData.title || formData.title.trim().length < 5) {
        toast.error("Error", { description: "El título no puede estar vacío" });
        return false;
      }
      
      // Premium users can have custom titles (unlimited words, up to 200 chars)
      // Free users are limited to 6 words and 100 chars
      if (!isPremium) {
        if (wordCount > 6) {
          toast.error("Error", { description: "Los usuarios gratuitos tienen un límite de 6 palabras. Actualiza a Premium para títulos personalizados." });
          setShowPaywall(true);
          return false;
        }
        if (formData.title.trim().length > 100) {
          toast.error("Error", { description: "Los usuarios gratuitos tienen un límite de 100 caracteres. Actualiza a Premium para títulos más largos." });
          setShowPaywall(true);
          return false;
        }
      } else {
        if (formData.title.trim().length > 200) {
          toast.error("Error", { description: "El título no puede exceder 200 caracteres" });
          return false;
        }
      }
      
      if (!formData.description || formData.description.trim().length < 50) {
        toast.error("Error", { description: "La descripción debe tener al menos 50 caracteres" });
        return false;
      }
      if (formData.description.trim().length > 5000) {
        toast.error("Error", { description: "La descripción no puede exceder 5000 caracteres" });
        return false;
      }
      
      // Phone validation - required only if user doesn't have one
      if (!userPhone && (!contactPhone || contactPhone.trim().length < 9)) {
        toast.error("Error", { description: "Por favor ingresa tu número de teléfono de contacto" });
        return false;
      }
      
      if (!formData.responseTime) {
        toast.error("Error", { description: "Selecciona tu tiempo de respuesta típico" });
        return false;
      }
      
      if (!formData.viewingPolicy) {
        toast.error("Error", { description: "Selecciona tu política de visitas" });
        return false;
      }
      
      if (formData.contractLanguage.length === 0) {
        toast.error("Error", { description: "Selecciona al menos un idioma para contratos" });
        return false;
      }
    }
    
    return true;
  };

  const handleComplete = async () => {
    if (!validateStep()) return;
    
    try {
      // If user doesn't have phone, update profile with contact phone
      if (!userPhone && contactPhone.trim()) {
        await updateProfile({ phone: contactPhone.trim() });
      }
      
      // Map property types to database format
      const propertyTypeMap: Record<string, string> = {
        "habitacion-individual": "room",
        "habitacion-compartida": "room",
        "apartamento-completo": "apartment",
        "estudio": "studio",
        "residencia": "residence"
      };

      // Calculate average price from rooms
      const avgPrice = formData.rooms.length > 0 
        ? formData.rooms.reduce((sum, room) => sum + room.price, 0) / formData.rooms.length
        : formData.basePrice;

      // Use uploaded photos
      const allPhotos = [...formData.photos];

      // Build rooms_config JSONB with detailed room info
      const roomsConfig = formData.rooms.map((room, index) => ({
        roomNumber: index + 1,
        price: room.price,
        type: room.type,
        features: room.features,
        photoLabel: room.photoId
      }));

      await createListing({
        title: formData.title.trim(),
        description: formData.description.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        price: avgPrice,
        available_from: formData.availableFrom,
        property_type: propertyTypeMap[formData.propertyType] || 'apartment',
        bedrooms: formData.totalRooms,
        bathrooms: formData.bathrooms,
        is_furnished: formData.propertyAmenities.includes('Amueblado'),
        has_wifi: formData.appliances.includes('WiFi'),
        has_parking: formData.propertyAmenities.includes('Parking'),
        has_washing_machine: formData.appliances.includes('Lavadora'),
        has_ac: formData.appliances.includes('Aire acondicionado'),
        has_heating: formData.appliances.includes('Calefacción'),
        utilities_included: formData.utilitiesIncluded,
        min_stay_months: formData.minimumStay ? parseInt(formData.minimumStay) : null,
        max_occupants: formData.availableRooms,
        images: allPhotos,
        // Previously missing fields - now mapped correctly
        smoking_allowed: formData.smokingAllowed,
        gender_preference: formData.genderPreference,
        area_sqm: formData.areaSqm > 0 ? formData.areaSqm : null,
        room_area_sqm: formData.roomAreaSqm > 0 ? formData.roomAreaSqm : null,
        rooms_config: roomsConfig
      });
      
      navigate("/ll/dashboard");
    } catch (error) {
      console.error('Error creating listing:', error);
      toast.error("Error", { 
        description: error instanceof Error ? error.message : "No se pudo crear el listado"
      });
    }
  };

  const handleGenerateTitle = () => {
    setIsGeneratingTitle(true);
    
    setTimeout(() => {
      const propertyTypeLabel = formData.propertyType === "room" ? "Habitación" 
        : formData.propertyType === "apartment" ? "Piso"
        : formData.propertyType === "studio" ? "Estudio"
        : "Habitación";
      
      const avgPrice = formData.rooms.length > 0 
        ? Math.round(formData.rooms.reduce((sum, room) => sum + room.price, 0) / formData.rooms.length)
        : 0;
      
      const generatedTitle = `${propertyTypeLabel} en ${formData.neighborhood || formData.city} | ${avgPrice}€/mes`;
      
      setFormData({...formData, title: generatedTitle});
      setIsGeneratingTitle(false);
      toast.success("Título generado automáticamente");
    }, 800);
  };

  const handleGenerateDescription = () => {
    setIsGeneratingDescription(true);
    
    setTimeout(() => {
      const propertyTypeLabel = formData.propertyType === "room" ? "habitación" 
        : formData.propertyType === "apartment" ? "piso"
        : formData.propertyType === "studio" ? "estudio"
        : "vivienda";
      
      const avgPrice = formData.rooms.length > 0 
        ? Math.round(formData.rooms.reduce((sum, room) => sum + room.price, 0) / formData.rooms.length)
        : 0;
      
      const features = [];
      if (formData.propertyAmenities.includes("WiFi")) features.push("WiFi de alta velocidad");
      if (formData.propertyAmenities.includes("Calefacción")) features.push("Calefacción");
      if (formData.propertyAmenities.includes("Aire acondicionado")) features.push("Aire acondicionado");
      if (formData.appliances.includes("Lavadora")) features.push("Lavadora");
      if (formData.propertyAmenities.includes("Parking")) features.push("Plaza de garaje");
      
      const featuresText = features.length > 0 
        ? features.slice(0, 3).map(f => `✅ ${f}`).join('\n')
        : "✅ Totalmente equipado\n✅ Listo para entrar a vivir";
      
      const description = `¡Oportunidad en ${formData.city}! 🎓 Se alquila ${propertyTypeLabel} en la zona de ${formData.neighborhood || formData.city}, ideal para estudiantes.
Por solo ${avgPrice}€ al mes, disfrutarás de una vivienda totalmente equipada y lista para entrar a vivir.

Características destacadas:
${featuresText}
✅ Ambiente tranquilo y propicio para el estudio

La ubicación es inmejorable, cerca de transporte público y zonas de ocio.
¡No pierdas esta oportunidad! Contacta ahora para organizar una visita.`;
      
      setFormData({...formData, description});
      setIsGeneratingDescription(false);
      toast.success("Descripción generada automáticamente");
    }, 1500);
  };

  const toggleArrayItem = (array: string[], item: string, field: string) => {
    const newArray = array.includes(item) 
      ? array.filter(i => i !== item)
      : [...array, item];
    setFormData({...formData, [field]: newArray});
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Check if adding these files exceeds the limit
    if (uploadedPhotos.length + files.length > MAX_IMAGES) {
      toast.error('Límite excedido', {
        description: `Solo puedes subir un máximo de ${MAX_IMAGES} fotos`
      });
      return;
    }

    setIsCompressing(true);
    const newFiles: File[] = [];
    const newPreviews: PhotoMetadata[] = [];

    try {
      for (const file of Array.from(files)) {
        // Validate file
        const validation = validateImageFile(file, MAX_IMAGE_SIZE_MB);
        if (!validation.valid) {
          toast.error('Error de validación', {
            description: `${file.name}: ${validation.error}`
          });
          continue;
        }

        // Compress image
        const compressedFile = await compressImage(file, MAX_IMAGE_SIZE_MB);
        newFiles.push(compressedFile);
        
        // Create PhotoMetadata with default label
        newPreviews.push({
          url: URL.createObjectURL(compressedFile),
          label: "Salón/Común"
        });
      }

      if (newFiles.length > 0) {
        setUploadedPhotos([...uploadedPhotos, ...newPreviews]);
        setFormData({...formData, photos: [...formData.photos, ...newFiles]});
        
        toast.success('Fotos añadidas', {
          description: `${newFiles.length} foto${newFiles.length > 1 ? 's' : ''} lista${newFiles.length > 1 ? 's' : ''} para subir`
        });
      }
    } catch (error) {
      toast.error('Error al procesar imágenes', {
        description: 'No se pudieron procesar algunas imágenes'
      });
    } finally {
      setIsCompressing(false);
      // Reset input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const removePhoto = (index: number) => {
    // Revoke the blob URL to free memory
    URL.revokeObjectURL(uploadedPhotos[index].url);
    
    setUploadedPhotos(uploadedPhotos.filter((_, i) => i !== index));
    setFormData({...formData, photos: formData.photos.filter((_, i) => i !== index)});
    
    toast.success('Foto eliminada', {
      description: 'La foto se ha eliminado correctamente'
    });
  };

  const updatePhotoLabel = (index: number, label: string) => {
    const newPhotos = [...uploadedPhotos];
    newPhotos[index].label = label;
    setUploadedPhotos(newPhotos);
  };

  const copyRoomConfigToAll = () => {
    if (formData.rooms.length === 0) return;
    
    const firstRoom = formData.rooms[0];
    const newRooms = formData.rooms.map((room, index) => ({
      ...room,
      price: firstRoom.price,
      type: firstRoom.type,
      // Keep individual photoId
    }));
    
    setFormData({...formData, rooms: newRooms});
    toast.success('Configuración copiada', {
      description: 'Precio y tipo copiados a todas las habitaciones'
    });
  };

  // Calculate listing strength score
  const listingStrength = useMemo(() => {
    let score = 0;
    let feedback = "";
    
    // +10% for complete address
    if (formData.address && formData.city) {
      score += 10;
    }
    
    // +30% for at least 5 photos (strong incentive)
    if (uploadedPhotos.length >= 5) {
      score += 30;
    } else if (uploadedPhotos.length > 0) {
      feedback = "Añade más fotos para destacar";
    }
    
    // +20% for good description
    if (formData.description.length >= 150) {
      score += 20;
    }
    
    // +20% for amenities completion
    const hasAmenities = formData.propertyAmenities.length > 0 || formData.appliances.length > 0;
    if (hasAmenities) {
      score += 20;
    }
    
    // +20% for all rooms priced
    const allRoomsPriced = formData.rooms.length > 0 && formData.rooms.every(room => room.price > 0 && room.type);
    if (allRoomsPriced) {
      score += 20;
    }
    
    // Determine feedback based on score
    if (score >= 81) {
      feedback = "¡Tu piso volará! 🚀";
    } else if (score >= 41) {
      feedback = "¡Casi listo! Revisa los detalles";
    } else if (!feedback) {
      feedback = "Añade más fotos para destacar";
    }
    
    return { score, feedback };
  }, [formData, uploadedPhotos]);

  const renderStepContent = () => {
    switch (currentStep) {
      // STEP 0: Location and Type (combines old steps 0 and 1)
      case 0:
        return (
          <div className="space-y-8">
            {/* Property Type Selection */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Tipo de propiedad
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { value: "habitacion-individual", label: "Habitación individual", desc: "Habitación privada en piso compartido" },
                  { value: "habitacion-compartida", label: "Habitación compartida", desc: "Habitación compartida" },
                  { value: "apartamento-completo", label: "Apartamento completo", desc: "Piso entero" },
                  { value: "estudio", label: "Estudio", desc: "Espacio con cocina y baño" },
                  { value: "residencia", label: "Residencia", desc: "Habitación en residencia estudiantil" }
                ].map((type) => (
                  <Card 
                    key={type.value}
                    className={`cursor-pointer transition-all border ${
                      formData.propertyType === type.value ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setFormData({...formData, propertyType: type.value})}
                  >
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-1">{type.label}</h4>
                      <p className="text-xs text-muted-foreground">{type.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Property Configuration */}
            {formData.propertyType && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-sm">Hab. disponibles</Label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.availableRooms}
                      onChange={(e) => updateRoomsArray(parseInt(e.target.value) || 1)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Total habitaciones</Label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.totalRooms}
                      onChange={(e) => setFormData({...formData, totalRooms: parseInt(e.target.value) || 1})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Baños</Label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({...formData, bathrooms: parseInt(e.target.value) || 1})}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm">Área total (m²)</Label>
                    <Input
                      type="number"
                      min="20"
                      placeholder="80"
                      value={formData.areaSqm || ""}
                      onChange={(e) => setFormData({...formData, areaSqm: parseInt(e.target.value) || 0})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Área habitación (m²)</Label>
                    <Input
                      type="number"
                      min="8"
                      placeholder="12"
                      value={formData.roomAreaSqm || ""}
                      onChange={(e) => setFormData({...formData, roomAreaSqm: parseInt(e.target.value) || 0})}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            )}

            <Separator />

            {/* Location */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Ubicación
              </h3>
              
              <div>
                <Label htmlFor="address" className="text-sm">Dirección completa</Label>
                <Input
                  id="address"
                  placeholder="Calle de la Libertad, 25"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="mt-1"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="neighborhood" className="text-sm">Barrio/Zona</Label>
                  <Select value={formData.neighborhood} onValueChange={(value) => setFormData({...formData, neighborhood: value})}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="centro">Centro Histórico</SelectItem>
                      <SelectItem value="universidad">Universidad</SelectItem>
                      <SelectItem value="romareda">Romareda</SelectItem>
                      <SelectItem value="actur">Actur</SelectItem>
                      <SelectItem value="delicias">Delicias</SelectItem>
                      <SelectItem value="san-francisco">San Francisco</SelectItem>
                      <SelectItem value="oliver">Oliver</SelectItem>
                      <SelectItem value="las-fuentes">Las Fuentes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="city" className="text-sm">Ciudad</Label>
                  <Select value={formData.city} onValueChange={(value) => setFormData({...formData, city: value})}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Zaragoza">Zaragoza</SelectItem>
                      <SelectItem value="Madrid">Madrid</SelectItem>
                      <SelectItem value="Barcelona">Barcelona</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        );

      // STEP 1: Photos (keeps old step 2)
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground">
                {uploadedPhotos.length} / {MAX_IMAGES} fotos • Máximo {MAX_IMAGE_SIZE_MB}MB por imagen
              </p>
            </div>
            
            {/* Upload Area - Made larger and more prominent */}
            <div className="border-2 border-dashed border-primary/30 rounded-xl p-12 text-center bg-primary/5 hover:bg-primary/10 transition-colors">
              <Upload className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Arrastra tus fotos aquí</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                O haz clic para seleccionar archivos (JPG, PNG, WEBP)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handlePhotoUpload}
                className="hidden"
                disabled={isCompressing || uploadedPhotos.length >= MAX_IMAGES}
              />
              <Button 
                size="lg"
                onClick={() => fileInputRef.current?.click()}
                disabled={isCompressing || uploadedPhotos.length >= MAX_IMAGES}
              >
                {isCompressing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : uploadedPhotos.length >= MAX_IMAGES ? (
                  `Máximo ${MAX_IMAGES} fotos alcanzado`
                ) : (
                  'Seleccionar fotos'
                )}
              </Button>
            </div>
            
            {/* Photo Preview with Labels */}
            {uploadedPhotos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {uploadedPhotos.map((photo, index) => (
                  <div key={index} className="space-y-2">
                    <div className="relative group">
                      <img
                        src={photo.url}
                        alt={`Foto ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <button
                          onClick={() => removePhoto(index)}
                          className="bg-destructive text-destructive-foreground rounded-full p-2 hover:bg-destructive/90"
                          disabled={isCompressing}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <Select 
                      value={photo.label} 
                      onValueChange={(value) => updatePhotoLabel(index, value)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Salón/Común">Salón/Común</SelectItem>
                        <SelectItem value="Cocina">Cocina</SelectItem>
                        <SelectItem value="Baño">Baño</SelectItem>
                        <SelectItem value="Habitación 1">Habitación 1</SelectItem>
                        <SelectItem value="Habitación 2">Habitación 2</SelectItem>
                        <SelectItem value="Habitación 3">Habitación 3</SelectItem>
                        <SelectItem value="Habitación 4">Habitación 4</SelectItem>
                        <SelectItem value="Exterior">Exterior</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            )}
            
            {/* Photo Tips */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-sm">
              <p className="font-medium mb-2">💡 Consejos:</p>
              <ul className="text-muted-foreground space-y-1">
                <li>• Mínimo 3 fotos requeridas, ideal 5-8 fotos</li>
                <li>• Muestra habitación, cocina, baño y zonas comunes</li>
                <li>• Usa buena luz natural</li>
                <li>• Mantén los espacios ordenados</li>
              </ul>
            </div>
          </div>
        );

      // STEP 2: Details and Amenities (combines old steps 3, 4, 6, 10)
      case 2:
        return (
          <div className="space-y-6">
            <Accordion type="multiple" defaultValue={["tenant", "features"]} className="w-full">
              {/* Section A: Tenant Profile */}
              <AccordionItem value="tenant">
                <AccordionTrigger className="text-base font-semibold">
                  Perfil de Inquilino
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div>
                    <Label className="text-sm">¿A quién va dirigido?</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {[
                        "Estudiantes locales",
                        "Estudiantes Erasmus",
                        "Jóvenes profesionales",
                        "Postgrado/Investigadores"
                      ].map((profile) => (
                        <Badge
                          key={profile}
                          variant={formData.targetProfile.includes(profile) ? "default" : "outline"}
                          className="cursor-pointer justify-center py-2 text-xs"
                          onClick={() => toggleArrayItem(formData.targetProfile, profile, 'targetProfile')}
                        >
                          {profile}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="erasmus"
                      checked={formData.erasmusFriendly}
                      onCheckedChange={(checked) => setFormData({...formData, erasmusFriendly: !!checked})}
                    />
                    <Label htmlFor="erasmus" className="text-sm">
                      Erasmus-friendly (contratos flexibles, inglés)
                    </Label>
                  </div>
                  
                  {formData.erasmusFriendly && (
                    <div>
                      <Label className="text-sm">Idiomas</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {["Español", "Inglés", "Francés", "Alemán"].map((lang) => (
                          <Badge
                            key={lang}
                            variant={formData.languages.includes(lang) ? "default" : "outline"}
                            className="cursor-pointer text-xs"
                            onClick={() => toggleArrayItem(formData.languages, lang, 'languages')}
                          >
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>

              {/* Section B: Property Features */}
              <AccordionItem value="features">
                <AccordionTrigger className="text-base font-semibold">
                  Características del Piso
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div>
                    <Label className="text-sm">Características principales</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {[
                        "Amueblado",
                        "WiFi",
                        "Parking",
                        "Balcón/Terraza",
                        "Ascensor",
                        "Exterior/Luminoso"
                      ].map((feature) => (
                        <Badge
                          key={feature}
                          variant={formData.propertyAmenities.includes(feature) ? "default" : "outline"}
                          className="cursor-pointer justify-center py-2 text-xs"
                          onClick={() => toggleArrayItem(formData.propertyAmenities, feature, 'propertyAmenities')}
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm">Equipamiento de habitación</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {[
                        "Cama",
                        "Escritorio",
                        "Armario",
                        "Estanterías",
                        "Ventana exterior",
                        "Cerradura propia"
                      ].map((amenity) => (
                        <Badge
                          key={amenity}
                          variant={formData.roomAmenities.includes(amenity) ? "default" : "outline"}
                          className="cursor-pointer justify-center py-2 text-xs"
                          onClick={() => toggleArrayItem(formData.roomAmenities, amenity, 'roomAmenities')}
                        >
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Section C: Appliances */}
              <AccordionItem value="appliances">
                <AccordionTrigger className="text-base font-semibold">
                  Electrodomésticos
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div>
                    <Label className="text-sm">Cocina</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {["Frigorífico", "Horno", "Microondas", "Lavavajillas", "Vitrocerámica"].map((app) => (
                        <Badge
                          key={app}
                          variant={formData.appliances.includes(app) ? "default" : "outline"}
                          className="cursor-pointer justify-center py-2 text-xs"
                          onClick={() => toggleArrayItem(formData.appliances, app, 'appliances')}
                        >
                          {app}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm">Otros</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {["Lavadora", "Secadora", "Televisión", "Aire acondicionado", "Calefacción"].map((app) => (
                        <Badge
                          key={app}
                          variant={formData.appliances.includes(app) ? "default" : "outline"}
                          className="cursor-pointer justify-center py-2 text-xs"
                          onClick={() => toggleArrayItem(formData.appliances, app, 'appliances')}
                        >
                          {app}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Section D: House Rules */}
              <AccordionItem value="rules">
                <AccordionTrigger className="text-base font-semibold">
                  Normas de la Casa
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    {[
                      "No se permite fumar",
                      "No se permiten mascotas",
                      "No se permiten fiestas",
                      "Horario de silencio 22:00-08:00",
                      "Limpieza por turnos"
                    ].map((rule) => (
                      <div key={rule} className="flex items-center space-x-2">
                        <Checkbox
                          id={rule}
                          checked={formData.houseRules.includes(rule)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({...formData, houseRules: [...formData.houseRules, rule]});
                            } else {
                              setFormData({...formData, houseRules: formData.houseRules.filter(r => r !== rule)});
                            }
                          }}
                        />
                        <Label htmlFor={rule} className="text-sm">
                          {rule}
                        </Label>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-sm mb-2 block">Preferencias</Label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="smoking"
                          checked={formData.smokingAllowed}
                          onCheckedChange={(checked) => setFormData({...formData, smokingAllowed: !!checked})}
                        />
                        <Label htmlFor="smoking" className="text-sm">
                          Permitir fumar en interior
                        </Label>
                      </div>

                      <div>
                        <Label className="text-sm">Preferencia de género</Label>
                        <Select value={formData.genderPreference} onValueChange={(value) => setFormData({...formData, genderPreference: value})}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="any">Sin preferencia</SelectItem>
                            <SelectItem value="male">Solo hombres</SelectItem>
                            <SelectItem value="female">Solo mujeres</SelectItem>
                            <SelectItem value="mixed">Mixto</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        );

      // STEP 3: Rooms and Pricing (combines old steps 7 and 8)
      case 3:
        return (
          <div className="space-y-6">
            {/* Rooms Configuration - Compact Table */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Configuración de habitaciones
                </h3>
                {formData.rooms.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={copyRoomConfigToAll}
                    className="text-xs"
                  >
                    📋 Copiar datos de Habitación 1 a todas
                  </Button>
                )}
              </div>

              {/* Compact Table */}
              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr className="border-b">
                        <th className="text-left p-3 text-sm font-medium">Habitación</th>
                        <th className="text-left p-3 text-sm font-medium">Tipo</th>
                        <th className="text-left p-3 text-sm font-medium">Precio (€)</th>
                        <th className="text-left p-3 text-sm font-medium">Foto</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.rooms.map((room, index) => (
                        <tr key={index} className="border-b last:border-b-0 hover:bg-muted/30">
                          <td className="p-3">
                            <span className="font-medium text-sm">Habitación {index + 1}</span>
                          </td>
                          <td className="p-3">
                            <Select 
                              value={room.type} 
                              onValueChange={(value) => {
                                const newRooms = [...formData.rooms];
                                newRooms[index].type = value;
                                setFormData({...formData, rooms: newRooms});
                              }}
                            >
                              <SelectTrigger className="h-9 text-sm">
                                <SelectValue placeholder="Tipo" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="small">Pequeña ({'<'} 10m²)</SelectItem>
                                <SelectItem value="standard">Estándar (10-15m²)</SelectItem>
                                <SelectItem value="large">Grande ({'>'} 15m²)</SelectItem>
                                <SelectItem value="shared">Compartida</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="p-3">
                            <Input
                              type="number"
                              placeholder="350"
                              value={room.price || ""}
                              onChange={(e) => {
                                const newRooms = [...formData.rooms];
                                newRooms[index].price = parseInt(e.target.value) || 0;
                                setFormData({...formData, rooms: newRooms});
                              }}
                              className="h-9 text-sm w-28"
                            />
                          </td>
                          <td className="p-3">
                            <Select 
                              value={room.photoId} 
                              onValueChange={(value) => {
                                const newRooms = [...formData.rooms];
                                newRooms[index].photoId = value;
                                setFormData({...formData, rooms: newRooms});
                              }}
                            >
                              <SelectTrigger className="h-9 text-sm w-40">
                                <SelectValue placeholder="Seleccionar" />
                              </SelectTrigger>
                              <SelectContent>
                                {uploadedPhotos
                                  .filter(p => p.label.includes("Habitación") || p.label === "Salón/Común")
                                  .map((photo, photoIndex) => (
                                    <SelectItem key={photoIndex} value={photo.label}>
                                      {photo.label}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Optional Features Section */}
              <div className="mt-4 space-y-2">
                <Label className="text-sm">Características incluidas en todas las habitaciones</Label>
                <div className="flex flex-wrap gap-2">
                  {["Cama individual", "Cama doble", "Escritorio", "Armario", "Ventana exterior"].map((feature) => {
                    const isSelected = formData.rooms[0]?.features.includes(feature);
                    return (
                      <Badge
                        key={feature}
                        variant={isSelected ? "default" : "outline"}
                        className="cursor-pointer text-xs"
                        onClick={() => {
                          const newRooms = formData.rooms.map(room => ({
                            ...room,
                            features: isSelected 
                              ? room.features.filter(f => f !== feature)
                              : [...room.features, feature]
                          }));
                          setFormData({...formData, rooms: newRooms});
                        }}
                      >
                        {feature}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </div>

            <Separator />

            {/* Global Pricing Conditions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Condiciones económicas
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="deposit" className="text-sm">Fianza (€)</Label>
                  <Input
                    id="deposit"
                    type="number"
                    placeholder="350"
                    value={formData.deposit || ""}
                    onChange={(e) => setFormData({...formData, deposit: parseInt(e.target.value) || 0})}
                    className="mt-1"
                  />
                </div>
                
                <div className="flex items-center space-x-2 pt-6">
                  <Checkbox
                    id="utilities"
                    checked={formData.utilitiesIncluded}
                    onCheckedChange={(checked) => setFormData({...formData, utilitiesIncluded: !!checked})}
                  />
                  <Label htmlFor="utilities" className="text-sm">
                    Gastos incluidos
                  </Label>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minimumStay" className="text-sm">Estancia mínima</Label>
                  <Select value={formData.minimumStay} onValueChange={(value) => setFormData({...formData, minimumStay: value})}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 mes</SelectItem>
                      <SelectItem value="3">3 meses</SelectItem>
                      <SelectItem value="4">4 meses</SelectItem>
                      <SelectItem value="6">6 meses</SelectItem>
                      <SelectItem value="9">9 meses</SelectItem>
                      <SelectItem value="12">12 meses</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="availableFrom" className="text-sm">Disponible desde</Label>
                  <Input
                    id="availableFrom"
                    type="date"
                    value={formData.availableFrom}
                    onChange={(e) => setFormData({...formData, availableFrom: e.target.value})}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      // STEP 4: Finalize and Publish (combines old steps 9 and 11)
      case 4:
        return (
          <div className="space-y-6">
            {/* Title and Description */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="title" className="text-sm flex items-center gap-2">
                    Título del anuncio <span className="text-destructive">*</span>
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleGenerateTitle}
                    disabled={isGeneratingTitle}
                    className="text-xs h-7"
                  >
                    {isGeneratingTitle ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        Generando...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3 w-3 mr-1" />
                        Sugerir título
                      </>
                    )}
                  </Button>
                </div>
                <Input
                  id="title"
                  placeholder="Habitación luminosa cerca Universidad"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="mt-1"
                />
                {!isPremium && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Máximo 6 palabras / 100 caracteres
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="description" className="text-sm">Descripción</Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGenerateDescription}
                  disabled={isGeneratingDescription}
                  className="w-full mt-2 mb-2"
                >
                  {isGeneratingDescription ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Redactando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generar descripción con IA
                    </>
                  )}
                </Button>
                <Textarea
                  id="description"
                  placeholder="Describe tu propiedad: ambiente, compañeros actuales, qué la hace especial..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={6}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Mínimo 50 caracteres
                </p>
              </div>
            </div>

            <Separator />

            {/* Contact Phone - only if user doesn't have one */}
            {!userPhone && (
              <div>
                <Label htmlFor="contactPhone" className="text-sm flex items-center gap-2">
                  Teléfono de contacto <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  placeholder="+34 612 345 678"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Para verificar el anuncio y que los estudiantes puedan contactarte
                </p>
              </div>
            )}

            {/* Contact Preferences */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold">Preferencias de contacto</h3>
              
              <div>
                <Label htmlFor="responseTime" className="text-sm">Tiempo de respuesta</Label>
                <Select value={formData.responseTime} onValueChange={(value) => setFormData({...formData, responseTime: value})}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="< 1h">Menos de 1 hora</SelectItem>
                    <SelectItem value="1-4h">1-4 horas</SelectItem>
                    <SelectItem value="4-24h">4-24 horas</SelectItem>
                    <SelectItem value="1-2d">1-2 días</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="viewingPolicy" className="text-sm">Política de visitas</Label>
                <Select value={formData.viewingPolicy} onValueChange={(value) => setFormData({...formData, viewingPolicy: value})}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Visitas inmediatas</SelectItem>
                    <SelectItem value="scheduled">Visitas programadas</SelectItem>
                    <SelectItem value="virtual">Visitas virtuales</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm">Idiomas para contratos</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {["Español", "Inglés", "Francés"].map((lang) => (
                    <Badge
                      key={lang}
                      variant={formData.contractLanguage.includes(lang) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleArrayItem(formData.contractLanguage, lang, 'contractLanguage')}
                    >
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Success Message */}
            <div className="bg-success/10 border border-success/20 rounded-lg p-6 mt-6">
              <h3 className="font-semibold text-success mb-2 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                ¡Listo para publicar!
              </h3>
              <p className="text-sm text-muted-foreground">
                Al publicar, tu anuncio se mostrará inmediatamente a estudiantes interesados
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: // Location and Type
        return formData.propertyType !== "" && formData.address && formData.city;
      case 1: // Photos
        return uploadedPhotos.length >= 3;
      case 2: // Details and amenities (optional)
        return true;
      case 3: // Rooms and Pricing
        return formData.rooms.length > 0 && formData.rooms.every(room => room.price > 0 && room.type) && formData.deposit >= 0 && formData.minimumStay && formData.availableFrom;
      case 4: // Description and Contact
        const phoneValid = userPhone || (contactPhone.trim().length >= 9);
        return formData.title && formData.description && phoneValid && formData.responseTime && formData.viewingPolicy && formData.contractLanguage.length > 0;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header with Preview Button */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Subir Piso</h1>
              <p className="text-sm text-muted-foreground">Completa tu anuncio paso a paso</p>
            </div>
            
            {/* Preview Button */}
            <Dialog open={showPreview} onOpenChange={setShowPreview}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Eye className="h-4 w-4" />
                  Ver cómo queda
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm">
                <DialogHeader>
                  <DialogTitle>Vista previa móvil</DialogTitle>
                </DialogHeader>
                
                {/* Mobile Preview Card */}
                <div className="bg-muted/30 rounded-lg p-4">
                  <Card className="overflow-hidden">
                    {uploadedPhotos.length > 0 ? (
                      <div className="relative h-48">
                        <img 
                          src={uploadedPhotos[0].url} 
                          alt="Vista previa del anuncio" 
                          className="w-full h-full object-cover"
                        />
                        <Badge className="absolute top-2 right-2 bg-background/90 backdrop-blur">
                          {uploadedPhotos.length} fotos
                        </Badge>
                      </div>
                    ) : (
                      <div className="h-48 bg-muted flex items-center justify-center">
                        <Camera className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-base line-clamp-2">
                            {formData.title || "Tu título aquí"}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {formData.neighborhood || formData.city || "Ubicación"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary">
                            {formData.rooms.length > 0 
                              ? `${Math.round(formData.rooms.reduce((sum, r) => sum + r.price, 0) / formData.rooms.length)}€`
                              : "0€"
                            }
                          </p>
                          <p className="text-xs text-muted-foreground">/mes</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {formData.propertyAmenities.includes("WiFi") && (
                          <Badge variant="secondary" className="text-xs">
                            <Wifi className="h-3 w-3 mr-1" /> WiFi
                          </Badge>
                        )}
                        {formData.propertyAmenities.includes("Parking") && (
                          <Badge variant="secondary" className="text-xs">
                            <Car className="h-3 w-3 mr-1" /> Parking
                          </Badge>
                        )}
                        {formData.propertyAmenities.includes("Aire acondicionado") && (
                          <Badge variant="secondary" className="text-xs">
                            <AirVent className="h-3 w-3 mr-1" /> A/C
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {formData.description || "Tu descripción aparecerá aquí..."}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Listing Strength Indicator */}
          <div className="mb-6">
            <Card className={`border-2 ${
              listingStrength.score >= 81 ? 'border-green-500/50 bg-green-50/50 dark:bg-green-950/20' :
              listingStrength.score >= 41 ? 'border-yellow-500/50 bg-yellow-50/50 dark:bg-yellow-950/20' :
              'border-red-500/50 bg-red-50/50 dark:bg-red-950/20'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className={`h-5 w-5 ${
                      listingStrength.score >= 81 ? 'text-green-600' :
                      listingStrength.score >= 41 ? 'text-yellow-600' :
                      'text-red-600'
                    }`} />
                    <span className="font-semibold text-sm">Fuerza del anuncio</span>
                  </div>
                  <span className={`text-2xl font-bold ${
                    listingStrength.score >= 81 ? 'text-green-600' :
                    listingStrength.score >= 41 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {listingStrength.score}%
                  </span>
                </div>
                
                <Progress 
                  value={listingStrength.score} 
                  className={`h-2 mb-2 ${
                    listingStrength.score >= 81 ? '[&>div]:bg-green-600' :
                    listingStrength.score >= 41 ? '[&>div]:bg-yellow-600' :
                    '[&>div]:bg-red-600'
                  }`}
                />
                
                <p className="text-sm text-muted-foreground">
                  {listingStrength.feedback}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Progress Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <currentStepData.icon className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">
                  Paso {currentStep + 1} de {steps.length}
                </span>
              </div>
              <Badge variant="outline" className="text-xs">
                {Math.round(currentStepData.progress)}% completado
              </Badge>
            </div>
            <Progress value={currentStepData.progress} className="mb-4 h-2" />
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {currentStepData.title}
              </h2>
              <p className="text-muted-foreground text-sm">
                {currentStepData.subtitle}
              </p>
            </div>
          </div>

          {/* Step Content */}
          <Card className="border shadow-sm">
            <CardContent className="p-6 md:p-8">
              {isLoading && uploadProgress > 0 && (
                <div className="mb-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subiendo fotos...</span>
                    <span className="font-medium">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}
              {renderStepContent()}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Anterior
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!canProceed() || isLoading || isCompressing}
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {uploadProgress > 0 ? `Subiendo ${uploadProgress}%...` : 'Creando...'}
                </>
              ) : currentStep === steps.length - 1 ? (
                'Publicar anuncio'
              ) : (
                'Continuar'
              )}
              {!isLoading && !isCompressing && <ArrowRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Paywall Modal for Premium Features */}
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        feature="Títulos Personalizados"
        context="listing_creation"
        onUpgrade={async () => {
          try {
            await upgradeToPremium();
            toast.success("¡Bienvenido a Premium!", {
              description: "Ahora puedes usar títulos personalizados ilimitados"
            });
            setShowPaywall(false);
          } catch (error) {
            toast.error("Error", {
              description: "No se pudo actualizar a Premium. Intenta de nuevo."
            });
          }
        }}
      />
    </div>
  );
};

export default CreateListing;
