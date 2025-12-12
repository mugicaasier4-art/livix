import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, User, FileText, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const LandlordOnboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Personal Info
    phone: "",
    address: "",
    city: "Zaragoza",
    
    // Property Info
    propertyTypes: [] as string[],
    experience: "",
    languages: [] as string[],
    
    // Business Info
    propertyCount: "",
    targetTenants: [] as string[],
    additionalServices: [] as string[],
    bio: "",
    
    // Preferences
    responseTime: "",
    preferredContact: "",
    priceRange: "",
    
    // Legal
    acceptsTerms: false,
    acceptsDataProcessing: false
  });

  const steps = [
    {
      id: 0,
      title: "Información personal",
      description: "Cuéntanos un poco sobre ti",
      icon: User,
      progress: 20
    },
    {
      id: 1,
      title: "Tu experiencia",
      description: "¿Qué tipo de propiedades ofreces?",
      icon: Building2,
      progress: 40
    },
    {
      id: 2,
      title: "Tu negocio",
      description: "Ayúdanos a conocer mejor tu perfil",
      icon: FileText,
      progress: 60
    },
    {
      id: 3,
      title: "Preferencias",
      description: "Cómo te gusta trabajar",
      icon: CheckCircle,
      progress: 80
    },
    {
      id: 4,
      title: "Términos y condiciones",
      description: "Último paso para comenzar",
      icon: CheckCircle,
      progress: 100
    }
  ];

  const currentStepData = steps[currentStep];

  const handleNext = () => {
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

  const handleComplete = () => {
    toast.success("¡Bienvenido a Livix!", {
      description: "Tu perfil se ha configurado correctamente. Ya puedes comenzar a publicar tus propiedades."
    });
    navigate("/ll/create-listing");
  };

  const toggleArrayItem = (array: string[], item: string, field: string) => {
    const newArray = array.includes(item) 
      ? array.filter(i => i !== item)
      : [...array, item];
    setFormData({...formData, [field]: newArray});
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                ¡Hola! Cuéntanos sobre ti
              </h2>
              <p className="text-muted-foreground">
                Esta información nos ayuda a crear tu perfil profesional
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="phone">Teléfono de contacto</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+34 666 777 888"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  placeholder="Calle Mayor, 123"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="city">Ciudad</Label>
                <Select value={formData.city} onValueChange={(value) => setFormData({...formData, city: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Zaragoza">Zaragoza</SelectItem>
                    <SelectItem value="Madrid">Madrid</SelectItem>
                    <SelectItem value="Barcelona">Barcelona</SelectItem>
                    <SelectItem value="Valencia">Valencia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                ¿Qué tipo de propiedades ofreces?
              </h2>
              <p className="text-muted-foreground">
                Puedes seleccionar varios tipos
              </p>
            </div>
            
            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium">Tipos de propiedad</Label>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {[
                    "Habitaciones individuales",
                    "Habitaciones compartidas", 
                    "Apartamentos completos",
                    "Estudios",
                    "Pisos compartidos",
                    "Residencias"
                  ].map((type) => (
                    <Card 
                      key={type} 
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        formData.propertyTypes.includes(type) ? 'ring-2 ring-primary bg-primary/5' : ''
                      }`}
                      onClick={() => toggleArrayItem(formData.propertyTypes, type, 'propertyTypes')}
                    >
                      <CardContent className="p-4 text-center">
                        <p className="text-sm font-medium">{type}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="experience">¿Cuánta experiencia tienes como propietario?</Label>
                <Select value={formData.experience} onValueChange={(value) => setFormData({...formData, experience: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu experiencia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nuevo">Soy nuevo en esto</SelectItem>
                    <SelectItem value="1-2">1-2 años</SelectItem>
                    <SelectItem value="3-5">3-5 años</SelectItem>
                    <SelectItem value="5+">Más de 5 años</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-base font-medium">¿Qué idiomas hablas?</Label>
                <div className="flex flex-wrap gap-2 mt-3">
                  {["Español", "Inglés", "Francés", "Alemán", "Italiano", "Portugués"].map((lang) => (
                    <Badge
                      key={lang}
                      variant={formData.languages.includes(lang) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleArrayItem(formData.languages, lang, 'languages')}
                    >
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Cuéntanos sobre tu negocio
              </h2>
              <p className="text-muted-foreground">
                Esto nos ayuda a mostrarte a los inquilinos correctos
              </p>
            </div>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="propertyCount">¿Cuántas propiedades tienes disponibles?</Label>
                <Select value={formData.propertyCount} onValueChange={(value) => setFormData({...formData, propertyCount: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Número de propiedades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Solo 1 propiedad</SelectItem>
                    <SelectItem value="2-5">2-5 propiedades</SelectItem>
                    <SelectItem value="6-10">6-10 propiedades</SelectItem>
                    <SelectItem value="10+">Más de 10 propiedades</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-base font-medium">¿A quién te diriges principalmente?</Label>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {[
                    "Estudiantes locales",
                    "Estudiantes Erasmus",
                    "Jóvenes profesionales",
                    "Profesores/Investigadores",
                    "Cualquier perfil"
                  ].map((target) => (
                    <Card 
                      key={target} 
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        formData.targetTenants.includes(target) ? 'ring-2 ring-primary bg-primary/5' : ''
                      }`}
                      onClick={() => toggleArrayItem(formData.targetTenants, target, 'targetTenants')}
                    >
                      <CardContent className="p-3 text-center">
                        <p className="text-sm font-medium">{target}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="text-base font-medium">Servicios adicionales que ofreces</Label>
                <div className="flex flex-wrap gap-2 mt-3">
                  {[
                    "Limpieza incluida",
                    "Ropa de cama",
                    "Internet incluido",
                    "Todos los gastos incluidos",
                    "Parking",
                    "Lavandería",
                    "Servicios de traducción",
                    "Recepción de paquetes"
                  ].map((service) => (
                    <Badge
                      key={service}
                      variant={formData.additionalServices.includes(service) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleArrayItem(formData.additionalServices, service, 'additionalServices')}
                    >
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="bio">Descripción breve de tu perfil (opcional)</Label>
                <Textarea
                  id="bio"
                  placeholder="Ej: Propietario con 5 años de experiencia, especializado en estudiantes internacionales..."
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                ¿Cómo prefieres trabajar?
              </h2>
              <p className="text-muted-foreground">
                Configuremos tus preferencias de comunicación
              </p>
            </div>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="responseTime">¿En cuánto tiempo sueles responder?</Label>
                <Select value={formData.responseTime} onValueChange={(value) => setFormData({...formData, responseTime: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tiempo de respuesta típico" />
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
                <Label htmlFor="preferredContact">¿Cómo prefieres que te contacten?</Label>
                <Select value={formData.preferredContact} onValueChange={(value) => setFormData({...formData, preferredContact: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Método de contacto preferido" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="phone">Llamada telefónica</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="platform">A través de la plataforma</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="priceRange">Rango de precios de tus propiedades</Label>
                <Select value={formData.priceRange} onValueChange={(value) => setFormData({...formData, priceRange: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Rango de precios típico" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="200-350">200€ - 350€</SelectItem>
                    <SelectItem value="350-500">350€ - 500€</SelectItem>
                    <SelectItem value="500-700">500€ - 700€</SelectItem>
                    <SelectItem value="700+">Más de 700€</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                ¡Ya casi está!
              </h2>
              <p className="text-muted-foreground">
                Solo necesitamos que aceptes nuestros términos
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms"
                  checked={formData.acceptsTerms}
                  onCheckedChange={(checked) => setFormData({...formData, acceptsTerms: !!checked})}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="terms" className="text-sm font-medium">
                    Acepto los términos y condiciones
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    He leído y acepto los términos de uso de Livix
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="data"
                  checked={formData.acceptsDataProcessing}
                  onCheckedChange={(checked) => setFormData({...formData, acceptsDataProcessing: !!checked})}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="data" className="text-sm font-medium">
                    Acepto el tratamiento de mis datos
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Consiento el tratamiento de mis datos para la prestación del servicio
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h3 className="font-semibold text-primary mb-2">
                ¿Qué viene después?
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Publica tu primera propiedad en minutos</li>
                <li>• Recibe solicitudes de inquilinos verificados</li>
                <li>• Gestiona todo desde tu panel de control</li>
                <li>• Soporte en español e inglés</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData.phone && formData.address && formData.city;
      case 1:
        return formData.propertyTypes.length > 0 && formData.experience && formData.languages.length > 0;
      case 2:
        return formData.propertyCount && formData.targetTenants.length > 0;
      case 3:
        return formData.responseTime && formData.preferredContact && formData.priceRange;
      case 4:
        return formData.acceptsTerms && formData.acceptsDataProcessing;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <currentStepData.icon className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">
                  Paso {currentStep + 1} de {steps.length}
                </span>
              </div>
              <Badge variant="outline">
                {Math.round(currentStepData.progress)}% completado
              </Badge>
            </div>
            <Progress value={currentStepData.progress} className="mb-4" />
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                {currentStepData.title}
              </h1>
              <p className="text-muted-foreground">
                {currentStepData.description}
              </p>
            </div>
          </div>

          {/* Step Content */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
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
              disabled={!canProceed()}
              className="gap-2"
            >
              {currentStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandlordOnboarding;