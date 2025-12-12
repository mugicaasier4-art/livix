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
import { Slider } from "@/components/ui/slider";
import { 
  User, 
  GraduationCap, 
  Clock, 
  Users, 
  Home,
  Heart,
  Moon,
  Sun,
  Music,
  Coffee,
  BookOpen,
  Gamepad2,
  Wine,
  Cigarette,
  PawPrint,
  Car,
  Euro,
  Calendar,
  MapPin,
  CheckCircle,
  ArrowRight, 
  ArrowLeft,
  Globe,
  Flag,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useRoommateProfiles } from "@/hooks/useRoommateProfiles";

const StudentOnboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createProfile } = useRoommateProfiles();
  const [currentStep, setCurrentStep] = useState(0);
  const [isErasmus, setIsErasmus] = useState<boolean | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    // Basic Info
    isErasmus: false,
    age: 20,
    gender: "",
    nationality: "",
    homeCountry: "",
    
    // Academic Info
    university: "",
    faculty: "",
    studyLevel: "",
    studyProgram: "",
    academicYear: "",
    
    // Erasmus Specific
    arrivalDate: "",
    departureDate: "",
    previousErasmus: false,
    spanishLevel: "",
    
    // Lifestyle & Preferences
    sleepSchedule: "",
    socialLevel: [5], // 1-10 scale
    studyHabits: "",
    cleanlinessLevel: [7], // 1-10 scale
    noiseLevel: [5], // 1-10 scale
    
    // Interests & Hobbies
    interests: [] as string[],
    sports: [] as string[],
    music: [] as string[],
    
    // Living Preferences
    roomType: "",
    budgetRange: [200, 500] as [number, number],
    location: [] as string[],
    
    // Roommate Preferences
    roommateGender: "",
    roommateAge: [18, 30] as [number, number],
    roommateNationality: "",
    internationalFriendly: false,
    
    // Lifestyle Compatibility
    smoking: "",
    drinking: "",
    pets: "",
    parties: "",
    guests: "",
    
    // Practical Info
    languages: [] as string[],
    dietaryRestrictions: [] as string[],
    hasGuarantor: false,
    needsContract: "",
    
    // Bio
    bio: "",
    dealBreakers: [] as string[],
    
    // Contact Preferences
    preferredContact: "",
    responseTime: "",
    
    // Final
    acceptsTerms: false,
    acceptsMatching: false
  });

  // Dynamic steps based on Erasmus status
  const getSteps = () => {
    const baseSteps = [
      { 
        id: 0, 
        title: "¿Eres estudiante Erasmus?", 
        subtitle: "Esto nos ayuda a personalizar tu experiencia",
        icon: Globe, 
        progress: 7
      },
      { 
        id: 1, 
        title: "Información personal", 
        subtitle: "Cuéntanos sobre ti",
        icon: User, 
        progress: 14
      },
      { 
        id: 2, 
        title: "Información académica", 
        subtitle: "¿Qué y dónde estudias?",
        icon: GraduationCap, 
        progress: 21
      }
    ];

    if (isErasmus) {
      baseSteps.push({
        id: 3,
        title: "Detalles Erasmus",
        subtitle: "Fechas y experiencia internacional",
        icon: Flag,
        progress: 28
      });
    }

    baseSteps.push(
      { 
        id: isErasmus ? 4 : 3, 
        title: "Tu estilo de vida", 
        subtitle: "Horarios y hábitos diarios",
        icon: Clock, 
        progress: isErasmus ? 35 : 28
      },
      { 
        id: isErasmus ? 5 : 4, 
        title: "Intereses y hobbies", 
        subtitle: "¿Qué te gusta hacer?",
        icon: Heart, 
        progress: isErasmus ? 42 : 35
      },
      { 
        id: isErasmus ? 6 : 5, 
        title: "Preferencias de alojamiento", 
        subtitle: "Tu espacio ideal",
        icon: Home, 
        progress: isErasmus ? 49 : 42
      },
      { 
        id: isErasmus ? 7 : 6, 
        title: "Compañero/a ideal", 
        subtitle: "¿Con quién te gustaría vivir?",
        icon: Users, 
        progress: isErasmus ? 56 : 49
      },
      { 
        id: isErasmus ? 8 : 7, 
        title: "Compatibilidad de estilo de vida", 
        subtitle: "Hábitos importantes",
        icon: Heart, 
        progress: isErasmus ? 63 : 56
      },
      { 
        id: isErasmus ? 9 : 8, 
        title: "Información práctica", 
        subtitle: "Idiomas y documentación",
        icon: BookOpen, 
        progress: isErasmus ? 70 : 63
      },
      { 
        id: isErasmus ? 10 : 9, 
        title: "Preséntate", 
        subtitle: "Cuéntanos más sobre ti",
        icon: User, 
        progress: isErasmus ? 84 : 77
      },
      { 
        id: isErasmus ? 11 : 10, 
        title: "Preferencias de contacto", 
        subtitle: "¿Cómo prefieres comunicarte?",
        icon: Users, 
        progress: isErasmus ? 91 : 84
      },
      { 
        id: isErasmus ? 12 : 11, 
        title: "¡Ya casi está!", 
        subtitle: "Términos y condiciones",
        icon: CheckCircle, 
        progress: 100
      }
    );

    return baseSteps;
  };

  const steps = getSteps();
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

  const handleComplete = async () => {
    if (!user) {
      toast.error("Error de autenticación", {
        description: "Debes iniciar sesión para completar el onboarding"
      });
      navigate("/login");
      return;
    }

    setIsSaving(true);
    
    try {
      // Build lifestyle_preferences JSONB with all "Vibe Check" data
      const lifestylePreferences = {
        sleepSchedule: formData.sleepSchedule,
        socialLevel: formData.socialLevel[0],
        studyHabits: formData.studyHabits,
        cleanlinessLevel: formData.cleanlinessLevel[0],
        noiseLevel: formData.noiseLevel[0],
        drinking: formData.drinking,
        parties: formData.parties,
        guests: formData.guests,
        roommateAge: formData.roommateAge,
        roommateNationality: formData.roommateNationality,
        internationalFriendly: formData.internationalFriendly,
        languages: formData.languages,
        dietaryRestrictions: formData.dietaryRestrictions,
        dealBreakers: formData.dealBreakers,
        sports: formData.sports,
        music: formData.music,
        // Additional context
        university: formData.university,
        studyLevel: formData.studyLevel,
        studyProgram: formData.studyProgram,
        nationality: formData.nationality,
        homeCountry: formData.homeCountry,
        gender: formData.gender,
        preferredContact: formData.preferredContact,
        responseTime: formData.responseTime,
        roomType: formData.roomType,
        // Erasmus specific
        isErasmus: formData.isErasmus,
        spanishLevel: formData.spanishLevel,
        previousErasmus: formData.previousErasmus,
        departureDate: formData.departureDate
      };

      // Map form data to roommate profile structure
      const profileData = {
        faculty: formData.faculty,
        year: formData.academicYear,
        bio: formData.bio,
        interests: formData.interests,
        budget_min: formData.budgetRange[0],
        budget_max: formData.budgetRange[1],
        move_date: isErasmus ? formData.arrivalDate : new Date().toISOString().split('T')[0],
        preferred_location: formData.location.join(', '),
        is_active: true,
        age: formData.age,
        gender_preference: formData.roommateGender || 'any',
        smoking_allowed: formData.smoking === 'yes' || formData.smoking === 'social',
        pets_allowed: formData.pets === 'have' || formData.pets === 'love' || formData.pets === 'like',
        lifestyle_preferences: lifestylePreferences
      };

      await createProfile(profileData);
      
      toast.success("¡Perfil completado!", {
        description: isErasmus 
          ? "Te ayudaremos a encontrar el alojamiento perfecto para tu Erasmus"
          : "Comenzaremos a buscar compañeros y alojamientos compatibles contigo"
      });
      
      navigate("/roommates");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Error al guardar el perfil", {
        description: "Por favor, inténtalo de nuevo"
      });
    } finally {
      setIsSaving(false);
    }
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
              <h2 className="text-3xl font-bold text-foreground mb-4">
                ¡Bienvenido a Livix! 👋
              </h2>
              <p className="text-lg text-muted-foreground">
                Para ofrecerte la mejor experiencia, necesitamos saber...
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card 
                className={`cursor-pointer transition-all hover:shadow-lg border-2 ${
                  isErasmus === true ? 'border-primary bg-primary/5' : 'border-border'
                }`}
                onClick={() => {
                  setIsErasmus(true);
                  setFormData({...formData, isErasmus: true});
                }}
              >
                <CardContent className="p-8 text-center">
                  <Globe className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Soy estudiante Erasmus
                  </h3>
                  <p className="text-muted-foreground">
                    Vengo de otro país para estudiar en España
                  </p>
                </CardContent>
              </Card>
              
              <Card 
                className={`cursor-pointer transition-all hover:shadow-lg border-2 ${
                  isErasmus === false ? 'border-primary bg-primary/5' : 'border-border'
                }`}
                onClick={() => {
                  setIsErasmus(false);
                  setFormData({...formData, isErasmus: false});
                }}
              >
                <CardContent className="p-8 text-center">
                  <Flag className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Soy estudiante local
                  </h3>
                  <p className="text-muted-foreground">
                    Estudio en España y busco alojamiento
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {isErasmus !== null && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-6">
                <p className="text-sm text-muted-foreground">
                  {isErasmus 
                    ? "Perfecto! Te ayudaremos con contratos flexibles, propietarios que hablan inglés y todo lo necesario para tu experiencia Erasmus."
                    : "Genial! Te conectaremos con compañeros compatibles y alojamientos que se ajusten a tu perfil y presupuesto."
                  }
                </p>
              </div>
            )}
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Cuéntanos sobre ti
              </h2>
              <p className="text-muted-foreground">
                Esta información nos ayuda a hacer mejores matches
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Edad</Label>
                  <Input
                    id="age"
                    type="number"
                    min="17"
                    max="35"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: parseInt(e.target.value) || 20})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="gender">Género</Label>
                  <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu género" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mujer">Mujer</SelectItem>
                      <SelectItem value="hombre">Hombre</SelectItem>
                      <SelectItem value="no-binario">No binario</SelectItem>
                      <SelectItem value="prefiero-no-decir">Prefiero no decir</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {isErasmus ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nationality">Nacionalidad</Label>
                    <Input
                      id="nationality"
                      placeholder="Ej: Italiana, Francesa, Alemana..."
                      value={formData.nationality}
                      onChange={(e) => setFormData({...formData, nationality: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="homeCountry">País de origen</Label>
                    <Input
                      id="homeCountry"
                      placeholder="Ej: Italia, Francia, Alemania..."
                      value={formData.homeCountry}
                      onChange={(e) => setFormData({...formData, homeCountry: e.target.value})}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <Label htmlFor="nationality">¿De dónde eres?</Label>
                  <Input
                    id="nationality"
                    placeholder="Ej: Madrid, Barcelona, Valencia..."
                    value={formData.nationality}
                    onChange={(e) => setFormData({...formData, nationality: e.target.value})}
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Información académica
              </h2>
              <p className="text-muted-foreground">
                {isErasmus 
                  ? "¿Dónde vas a estudiar en España?"
                  : "¿Qué y dónde estudias?"
                }
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="university">Universidad</Label>
                  <Select value={formData.university} onValueChange={(value) => setFormData({...formData, university: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu universidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unizar">Universidad de Zaragoza</SelectItem>
                      <SelectItem value="usj">Universidad San Jorge</SelectItem>
                      <SelectItem value="ucm">Universidad Complutense Madrid</SelectItem>
                      <SelectItem value="uam">Universidad Autónoma Madrid</SelectItem>
                      <SelectItem value="ub">Universidad de Barcelona</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="faculty">Facultad/Escuela</Label>
                  <Select value={formData.faculty} onValueChange={(value) => setFormData({...formData, faculty: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tu facultad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="derecho">Derecho</SelectItem>
                      <SelectItem value="ciencias">Ciencias</SelectItem>
                      <SelectItem value="filosofia">Filosofía y Letras</SelectItem>
                      <SelectItem value="medicina">Medicina</SelectItem>
                      <SelectItem value="ingenieria">Ingeniería</SelectItem>
                      <SelectItem value="economia">Economía y Empresa</SelectItem>
                      <SelectItem value="educacion">Educación</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="studyLevel">Nivel de estudios</Label>
                  <Select value={formData.studyLevel} onValueChange={(value) => setFormData({...formData, studyLevel: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Nivel de estudios" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grado">Grado/Licenciatura</SelectItem>
                      <SelectItem value="master">Máster</SelectItem>
                      <SelectItem value="doctorado">Doctorado</SelectItem>
                      <SelectItem value="fp">Formación Profesional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="academicYear">Curso académico</Label>
                  <Select value={formData.academicYear} onValueChange={(value) => setFormData({...formData, academicYear: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="¿En qué curso estás?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Primer curso</SelectItem>
                      <SelectItem value="2">Segundo curso</SelectItem>
                      <SelectItem value="3">Tercer curso</SelectItem>
                      <SelectItem value="4">Cuarto curso</SelectItem>
                      <SelectItem value="5">Quinto curso</SelectItem>
                      <SelectItem value="master">Máster</SelectItem>
                      <SelectItem value="doctorado">Doctorado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="studyProgram">Carrera/Programa</Label>
                <Input
                  id="studyProgram"
                  placeholder="Ej: Psicología, Ingeniería Informática, ADE..."
                  value={formData.studyProgram}
                  onChange={(e) => setFormData({...formData, studyProgram: e.target.value})}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        // Erasmus-specific step OR lifestyle step for local students
        if (isErasmus) {
          return (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Detalles de tu Erasmus
                </h2>
                <p className="text-muted-foreground">
                  Fechas y experiencia internacional
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="arrivalDate">Fecha de llegada</Label>
                    <Input
                      id="arrivalDate"
                      type="date"
                      value={formData.arrivalDate}
                      onChange={(e) => setFormData({...formData, arrivalDate: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="departureDate">Fecha de salida</Label>
                    <Input
                      id="departureDate"
                      type="date"
                      value={formData.departureDate}
                      onChange={(e) => setFormData({...formData, departureDate: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="spanishLevel">¿Qué nivel de español tienes?</Label>
                  <Select value={formData.spanishLevel} onValueChange={(value) => setFormData({...formData, spanishLevel: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tu nivel de español" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Principiante (A1-A2)</SelectItem>
                      <SelectItem value="intermediate">Intermedio (B1-B2)</SelectItem>
                      <SelectItem value="advanced">Avanzado (C1-C2)</SelectItem>
                      <SelectItem value="native">Nativo/Bilingüe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="previousErasmus"
                    checked={formData.previousErasmus}
                    onCheckedChange={(checked) => setFormData({...formData, previousErasmus: !!checked})}
                  />
                  <div>
                    <Label htmlFor="previousErasmus" className="text-base font-medium">
                      ¿Has hecho Erasmus antes?
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Nos ayuda a saber tu nivel de experiencia internacional
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        } else {
          // Fall through to lifestyle step for local students
          return renderLifestyleStep();
        }

      case 4:
        // This is lifestyle step for Erasmus students
        if (isErasmus) {
          return renderLifestyleStep();
        } else {
          // This is interests step for local students
          return renderInterestsStep();
        }

      case 5:
        // This is interests step for Erasmus students
        if (isErasmus) {
          return renderInterestsStep();
        } else {
          // This is housing preferences for local students
          return renderHousingPreferencesStep();
        }

      case 6:
        // Housing preferences for Erasmus
        if (isErasmus) {
          return renderHousingPreferencesStep();
        } else {
          // Roommate preferences for local students
          return renderRoommatePreferencesStep();
        }

      case 7:
        // Roommate preferences for Erasmus
        if (isErasmus) {
          return renderRoommatePreferencesStep();
        } else {
          // Lifestyle compatibility for local students
          return renderLifestyleCompatibilityStep();
        }

      case 8:
        // Lifestyle compatibility for Erasmus
        if (isErasmus) {
          return renderLifestyleCompatibilityStep();
        } else {
          // Practical info for local students
          return renderPracticalInfoStep();
        }

      case 9:
        // Practical info for Erasmus
        if (isErasmus) {
          return renderPracticalInfoStep();
        } else {
          // Bio step for local students
          return renderBioStep();
        }

      case 10:
        // Bio step for Erasmus
        if (isErasmus) {
          return renderBioStep();
        } else {
          // Contact preferences for local students
          return renderContactPreferencesStep();
        }

      case 11:
        // Contact preferences for Erasmus
        if (isErasmus) {
          return renderContactPreferencesStep();
        } else {
          // Terms for local students
          return renderTermsStep();
        }

      case 12:
        // Terms for Erasmus (final step)
        return renderTermsStep();

      default:
        return null;
    }
  };

  const renderLifestyleStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Tu estilo de vida
        </h2>
        <p className="text-muted-foreground">
          Horarios y hábitos diarios para hacer mejor matching
        </p>
      </div>
      
      <div className="space-y-6">
        <div>
          <Label htmlFor="sleepSchedule">¿Cuál es tu horario de sueño?</Label>
          <Select value={formData.sleepSchedule} onValueChange={(value) => setFormData({...formData, sleepSchedule: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Tu horario típico" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="early-bird">Madrugador (duermo 22:00-23:00, despierto 6:00-7:00)</SelectItem>
              <SelectItem value="normal">Normal (duermo 23:00-24:00, despierto 7:00-8:00)</SelectItem>
              <SelectItem value="night-owl">Noctámbulo (duermo 00:00-2:00, despierto 8:00-10:00)</SelectItem>
              <SelectItem value="very-late">Muy tarde (duermo después 2:00, despierto después 10:00)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="text-base font-medium">¿Qué tan sociable eres?</Label>
          <div className="mt-3">
            <Slider
              value={formData.socialLevel}
              onValueChange={(value) => setFormData({...formData, socialLevel: value})}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Muy introvertido</span>
              <span className="font-medium">{formData.socialLevel[0]}/10</span>
              <span>Muy extrovertido</span>
            </div>
          </div>
        </div>
        
        <div>
          <Label htmlFor="studyHabits">¿Cómo prefieres estudiar?</Label>
          <Select value={formData.studyHabits} onValueChange={(value) => setFormData({...formData, studyHabits: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Tus hábitos de estudio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="silent">En completo silencio</SelectItem>
              <SelectItem value="quiet">Con poco ruido de fondo</SelectItem>
              <SelectItem value="music">Con música</SelectItem>
              <SelectItem value="social">Me gusta estudiar en grupo</SelectItem>
              <SelectItem value="library">Prefiero bibliotecas/fuera de casa</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="text-base font-medium">¿Qué tan ordenado/a eres?</Label>
          <div className="mt-3">
            <Slider
              value={formData.cleanlinessLevel}
              onValueChange={(value) => setFormData({...formData, cleanlinessLevel: value})}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Muy desordenado</span>
              <span className="font-medium">{formData.cleanlinessLevel[0]}/10</span>
              <span>Muy ordenado</span>
            </div>
          </div>
        </div>
        
        <div>
          <Label className="text-base font-medium">Nivel de ruido que generas</Label>
          <div className="mt-3">
            <Slider
              value={formData.noiseLevel}
              onValueChange={(value) => setFormData({...formData, noiseLevel: value})}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Muy silencioso</span>
              <span className="font-medium">{formData.noiseLevel[0]}/10</span>
              <span>Muy ruidoso</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInterestsStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Intereses y hobbies
        </h2>
        <p className="text-muted-foreground">
          ¿Qué te gusta hacer en tu tiempo libre?
        </p>
      </div>
      
      <div className="space-y-6">
        <div>
          <Label className="text-base font-medium">Intereses principales</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
            {[
              { icon: BookOpen, label: "Leer" },
              { icon: Music, label: "Música" },
              { icon: Gamepad2, label: "Videojuegos" },
              { icon: Coffee, label: "Cafeterías" },
              { icon: Wine, label: "Vida nocturna" },
              { icon: Heart, label: "Cocinar" }
            ].map((interest) => (
              <Card 
                key={interest.label}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  formData.interests.includes(interest.label) ? 'ring-2 ring-primary bg-primary/5' : ''
                }`}
                onClick={() => toggleArrayItem(formData.interests, interest.label, 'interests')}
              >
                <CardContent className="p-4 text-center">
                  <interest.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs font-medium">{interest.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <div>
          <Label className="text-base font-medium">Deportes que practicas</Label>
          <div className="flex flex-wrap gap-2 mt-3">
            {[
              "Fútbol", "Baloncesto", "Tenis", "Natación", "Gimnasio", 
              "Running", "Yoga", "Escalada", "Ciclismo", "Ninguno"
            ].map((sport) => (
              <Badge
                key={sport}
                variant={formData.sports.includes(sport) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleArrayItem(formData.sports, sport, 'sports')}
              >
                {sport}
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <Label className="text-base font-medium">Géneros musicales favoritos</Label>
          <div className="flex flex-wrap gap-2 mt-3">
            {[
              "Pop", "Rock", "Hip-hop", "Electrónica", "Indie", 
              "Reggaeton", "Jazz", "Clásica", "Flamenco", "Todos"
            ].map((genre) => (
              <Badge
                key={genre}
                variant={formData.music.includes(genre) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleArrayItem(formData.music, genre, 'music')}
              >
                {genre}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderHousingPreferencesStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Preferencias de alojamiento
        </h2>
        <p className="text-muted-foreground">
          Tu espacio ideal
        </p>
      </div>
      
      <div className="space-y-6">
        <div>
          <Label htmlFor="roomType">Tipo de habitación preferida</Label>
          <Select value={formData.roomType} onValueChange={(value) => setFormData({...formData, roomType: value})}>
            <SelectTrigger>
              <SelectValue placeholder="¿Qué tipo de habitación buscas?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="individual">Habitación individual</SelectItem>
              <SelectItem value="shared">Habitación compartida</SelectItem>
              <SelectItem value="studio">Estudio completo</SelectItem>
              <SelectItem value="apartment">Apartamento entero</SelectItem>
              <SelectItem value="any">Cualquiera</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="text-base font-medium">Presupuesto mensual (€)</Label>
          <div className="mt-3">
            <Slider
              value={formData.budgetRange}
              onValueChange={(value) => setFormData({...formData, budgetRange: value as [number, number]})}
              max={800}
              min={150}
              step={25}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>150€</span>
              <span className="font-medium">{formData.budgetRange[0]}€ - {formData.budgetRange[1]}€</span>
              <span>800€</span>
            </div>
          </div>
        </div>
        
        <div>
          <Label className="text-base font-medium">Zonas preferidas</Label>
          <div className="grid grid-cols-2 gap-2 mt-3">
            {[
              "Centro Histórico",
              "Universidad", 
              "Romareda",
              "Actur",
              "Delicias",
              "San Francisco",
              "Oliver",
              "Las Fuentes"
            ].map((location) => (
              <Badge
                key={location}
                variant={formData.location.includes(location) ? "default" : "outline"}
                className="cursor-pointer justify-center py-2"
                onClick={() => toggleArrayItem(formData.location, location, 'location')}
              >
                {location}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderRoommatePreferencesStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Tu compañero/a ideal
        </h2>
        <p className="text-muted-foreground">
          ¿Con quién te gustaría vivir?
        </p>
      </div>
      
      <div className="space-y-6">
        <div>
          <Label htmlFor="roommateGender">Preferencia de género</Label>
          <Select value={formData.roommateGender} onValueChange={(value) => setFormData({...formData, roommateGender: value})}>
            <SelectTrigger>
              <SelectValue placeholder="¿Tienes preferencia?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">No tengo preferencia</SelectItem>
              <SelectItem value="same">Mismo género que yo</SelectItem>
              <SelectItem value="female">Solo mujeres</SelectItem>
              <SelectItem value="male">Solo hombres</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="text-base font-medium">Rango de edad preferido</Label>
          <div className="mt-3">
            <Slider
              value={formData.roommateAge}
              onValueChange={(value) => setFormData({...formData, roommateAge: value as [number, number]})}
              max={35}
              min={17}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>17 años</span>
              <span className="font-medium">{formData.roommateAge[0]} - {formData.roommateAge[1]} años</span>
              <span>35 años</span>
            </div>
          </div>
        </div>
        
        <div>
          <Label htmlFor="roommateNationality">Preferencia de nacionalidad</Label>
          <Select value={formData.roommateNationality} onValueChange={(value) => setFormData({...formData, roommateNationality: value})}>
            <SelectTrigger>
              <SelectValue placeholder="¿Tienes preferencia?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">No tengo preferencia</SelectItem>
              <SelectItem value="spanish">Españoles</SelectItem>
              <SelectItem value="international">Internacionales</SelectItem>
              <SelectItem value="mixed">Mezcla de nacionalidades</SelectItem>
              <SelectItem value="same-country">De mi mismo país</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {isErasmus && (
          <div className="flex items-center space-x-3">
            <Checkbox
              id="internationalFriendly"
              checked={formData.internationalFriendly}
              onCheckedChange={(checked) => setFormData({...formData, internationalFriendly: !!checked})}
            />
            <div>
              <Label htmlFor="internationalFriendly" className="text-base font-medium">
                Busco ambiente internacional
              </Label>
              <p className="text-sm text-muted-foreground">
                Prefiero vivir con otros estudiantes Erasmus o internacionales
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderLifestyleCompatibilityStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Compatibilidad de estilo de vida
        </h2>
        <p className="text-muted-foreground">
          Hábitos importantes para la convivencia
        </p>
      </div>
      
      <div className="space-y-6">
        <div>
          <Label htmlFor="smoking">¿Fumas?</Label>
          <Select value={formData.smoking} onValueChange={(value) => setFormData({...formData, smoking: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Tu relación con el tabaco" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no">No fumo</SelectItem>
              <SelectItem value="social">Solo socialmente</SelectItem>
              <SelectItem value="yes">Sí, regularmente</SelectItem>
              <SelectItem value="ok-with-smokers">No fumo pero no me molesta</SelectItem>
              <SelectItem value="no-smokers">No fumo y prefiero no fumadores</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="drinking">¿Bebes alcohol?</Label>
          <Select value={formData.drinking} onValueChange={(value) => setFormData({...formData, drinking: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Tu relación con el alcohol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no">No bebo</SelectItem>
              <SelectItem value="social">Solo socialmente</SelectItem>
              <SelectItem value="weekends">Fines de semana</SelectItem>
              <SelectItem value="regular">Regularmente</SelectItem>
              <SelectItem value="party">Me gusta la fiesta</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="parties">¿Te gustan las fiestas en casa?</Label>
          <Select value={formData.parties} onValueChange={(value) => setFormData({...formData, parties: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Tu actitud hacia las fiestas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="love">Me encantan</SelectItem>
              <SelectItem value="sometimes">Ocasionalmente está bien</SelectItem>
              <SelectItem value="small">Solo reuniones pequeñas</SelectItem>
              <SelectItem value="no">Prefiero no tenerlas</SelectItem>
              <SelectItem value="hate">No me gustan nada</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="guests">¿Con qué frecuencia invitas gente?</Label>
          <Select value={formData.guests} onValueChange={(value) => setFormData({...formData, guests: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Frecuencia de visitas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="never">Casi nunca</SelectItem>
              <SelectItem value="rarely">Muy raramente</SelectItem>
              <SelectItem value="sometimes">A veces</SelectItem>
              <SelectItem value="often">Con frecuencia</SelectItem>
              <SelectItem value="always">Siempre hay gente</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="pets">¿Tienes mascotas o te gustan?</Label>
          <Select value={formData.pets} onValueChange={(value) => setFormData({...formData, pets: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Tu relación con las mascotas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="have">Tengo mascotas</SelectItem>
              <SelectItem value="love">Me encantan</SelectItem>
              <SelectItem value="like">Me gustan</SelectItem>
              <SelectItem value="neutral">Neutral</SelectItem>
              <SelectItem value="allergic">Soy alérgico/a</SelectItem>
              <SelectItem value="no">No me gustan</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderPracticalInfoStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Información práctica
        </h2>
        <p className="text-muted-foreground">
          Idiomas y aspectos legales
        </p>
      </div>
      
      <div className="space-y-6">
        <div>
          <Label className="text-base font-medium">¿Qué idiomas hablas?</Label>
          <div className="flex flex-wrap gap-2 mt-3">
            {["Español", "Inglés", "Francés", "Alemán", "Italiano", "Portugués", "Árabe", "Chino"].map((lang) => (
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
        
        <div>
          <Label className="text-base font-medium">Restricciones dietéticas/alimentarias</Label>
          <div className="flex flex-wrap gap-2 mt-3">
            {[
              "Ninguna", "Vegetariano", "Vegano", "Sin gluten", 
              "Halal", "Kosher", "Intolerancia lactosa", "Alergias"
            ].map((diet) => (
              <Badge
                key={diet}
                variant={formData.dietaryRestrictions.includes(diet) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleArrayItem(formData.dietaryRestrictions, diet, 'dietaryRestrictions')}
              >
                {diet}
              </Badge>
            ))}
          </div>
        </div>
        
        {!isErasmus && (
          <div className="flex items-center space-x-3">
            <Checkbox
              id="hasGuarantor"
              checked={formData.hasGuarantor}
              onCheckedChange={(checked) => setFormData({...formData, hasGuarantor: !!checked})}
            />
            <div>
              <Label htmlFor="hasGuarantor" className="text-base font-medium">
                Tengo aval/garantía para contratos
              </Label>
              <p className="text-sm text-muted-foreground">
                Padres, familiares o empresa que pueden avalar el contrato
              </p>
            </div>
          </div>
        )}
        
        <div>
          <Label htmlFor="needsContract">Tipo de contrato que necesitas</Label>
          <Select value={formData.needsContract} onValueChange={(value) => setFormData({...formData, needsContract: value})}>
            <SelectTrigger>
              <SelectValue placeholder="¿Qué tipo de contrato buscas?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="flexible">Flexible (mes a mes)</SelectItem>
              <SelectItem value="semester">Por semestre (4-6 meses)</SelectItem>
              <SelectItem value="academic">Curso académico (9-10 meses)</SelectItem>
              <SelectItem value="annual">Anual (12 meses)</SelectItem>
              <SelectItem value="any">Cualquiera</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderBioStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Preséntate
        </h2>
        <p className="text-muted-foreground">
          Cuéntanos más sobre ti para conectar mejor
        </p>
      </div>
      
      <div className="space-y-6">
        <div>
          <Label htmlFor="bio">Descripción personal</Label>
          <Textarea
            id="bio"
            placeholder={isErasmus 
              ? "Ej: Soy italiana, estudio Psicología y me encanta conocer gente nueva. Busco un ambiente internacional y relajado..."
              : "Ej: Estudio ADE en la Universidad de Zaragoza. Me gusta hacer deporte, salir con amigos y cocinar..."
            }
            value={formData.bio}
            onChange={(e) => setFormData({...formData, bio: e.target.value})}
            rows={4}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Describe tu personalidad, qué buscas en la experiencia de vivir con otros
          </p>
        </div>
        
        <div>
          <Label className="text-base font-medium">Deal breakers (cosas que no puedes tolerar)</Label>
          <div className="space-y-2 mt-3">
            {[
              "Mucho desorden",
              "Ruido por las noches",
              "Mascotas",
              "Fumar en casa",
              "Fiestas frecuentes",
              "Invitados sin avisar",
              "No respetar espacios comunes",
              "Diferentes horarios extremos"
            ].map((dealBreaker) => (
              <div key={dealBreaker} className="flex items-center space-x-3">
                <Checkbox
                  id={dealBreaker}
                  checked={formData.dealBreakers.includes(dealBreaker)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFormData({...formData, dealBreakers: [...formData.dealBreakers, dealBreaker]});
                    } else {
                      setFormData({...formData, dealBreakers: formData.dealBreakers.filter(d => d !== dealBreaker)});
                    }
                  }}
                />
                <Label htmlFor={dealBreaker} className="text-sm">
                  {dealBreaker}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderContactPreferencesStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Preferencias de contacto
        </h2>
        <p className="text-muted-foreground">
          ¿Cómo prefieres comunicarte?
        </p>
      </div>
      
      <div className="space-y-6">
        <div>
          <Label htmlFor="preferredContact">Método de contacto preferido</Label>
          <Select value={formData.preferredContact} onValueChange={(value) => setFormData({...formData, preferredContact: value})}>
            <SelectTrigger>
              <SelectValue placeholder="¿Cómo prefieres que te contacten?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
              <SelectItem value="telegram">Telegram</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="phone">Llamada telefónica</SelectItem>
              <SelectItem value="platform">A través de la plataforma</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="responseTime">¿En cuánto tiempo sueles responder?</Label>
          <Select value={formData.responseTime} onValueChange={(value) => setFormData({...formData, responseTime: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Tu tiempo de respuesta típico" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediately">Inmediatamente</SelectItem>
              <SelectItem value="1-2h">1-2 horas</SelectItem>
              <SelectItem value="same-day">El mismo día</SelectItem>
              <SelectItem value="1-2d">1-2 días</SelectItem>
              <SelectItem value="varies">Depende del momento</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderTermsStep = () => (
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
            id="matching"
            checked={formData.acceptsMatching}
            onCheckedChange={(checked) => setFormData({...formData, acceptsMatching: !!checked})}
          />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="matching" className="text-sm font-medium">
              Acepto el sistema de matching
            </Label>
            <p className="text-xs text-muted-foreground">
              Permito que mis datos se usen para encontrar compañeros y alojamientos compatibles
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
        <h3 className="font-semibold text-primary mb-3 flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          ¿Qué viene después?
        </h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Te mostraremos alojamientos perfectos para tu perfil</li>
          <li>• Conectaremos contigo compañeros compatibles</li>
          <li>• Recibirás notificaciones de nuevas oportunidades</li>
          <li>• {isErasmus ? 'Tendrás soporte especializado para Erasmus' : 'Accederás a todas las funciones de la plataforma'}</li>
        </ul>
      </div>
    </div>
  );

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return isErasmus !== null;
      case 1:
        return formData.age && formData.gender && formData.nationality;
      case 2:
        return formData.university && formData.faculty && formData.studyLevel && formData.studyProgram;
      case 3:
        if (isErasmus) {
          return formData.arrivalDate && formData.departureDate && formData.spanishLevel;
        } else {
          // This is lifestyle step for local students
          return formData.sleepSchedule && formData.studyHabits;
        }
      case 4:
        if (isErasmus) {
          return formData.sleepSchedule && formData.studyHabits;
        } else {
          return formData.interests.length > 0;
        }
      case 5:
        if (isErasmus) {
          return formData.interests.length > 0;
        } else {
          return formData.roomType && formData.location.length > 0;
        }
      case 6:
        if (isErasmus) {
          return formData.roomType && formData.location.length > 0;
        } else {
          return formData.roommateGender;
        }
      case 7:
        if (isErasmus) {
          return formData.roommateGender;
        } else {
          return formData.smoking && formData.drinking && formData.parties;
        }
      case 8:
        if (isErasmus) {
          return formData.smoking && formData.drinking && formData.parties;
        } else {
          return formData.languages.length > 0;
        }
      case 9:
        if (isErasmus) {
          return formData.languages.length > 0;
        } else {
          return formData.bio.length > 0;
        }
      case 10:
        if (isErasmus) {
          return formData.bio.length > 0;
        } else {
          return formData.preferredContact && formData.responseTime;
        }
      case 11:
        if (isErasmus) {
          return formData.preferredContact && formData.responseTime;
        } else {
          return formData.acceptsTerms && formData.acceptsMatching;
        }
      case 12:
        return formData.acceptsTerms && formData.acceptsMatching;
      default:
        return true;
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
                {currentStepData.subtitle}
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
              disabled={!canProceed() || isSaving}
              className="gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  {currentStep === steps.length - 1 ? 'Completar perfil' : 'Siguiente'}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentOnboarding;