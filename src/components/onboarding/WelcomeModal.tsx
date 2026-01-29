import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Home, Search, MessageCircle, CheckCircle } from 'lucide-react';

interface WelcomeModalProps {
  open: boolean;
  onClose: () => void;
  userRole: 'student' | 'landlord';
  onRoleSelect: (role: 'student' | 'landlord') => Promise<void>;
}

export const WelcomeModal = ({ open, onClose, userRole, onRoleSelect }: WelcomeModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSelectingRole, setIsSelectingRole] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleRoleSelection = async (role: 'student' | 'landlord') => {
    setIsUpdating(true);
    try {
      await onRoleSelect(role);
      setIsSelectingRole(false);
      setCurrentStep(0);
    } catch (error) {
      console.error('Error updating role:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const studentSteps = [
    {
      title: '¡Bienvenido a Livix!',
      description: 'Encuentra tu alojamiento perfecto para estudiar en Zaragoza.',
      icon: Home,
      tips: [
        'Explora miles de pisos cerca de tu universidad',
        'Filtra por precio, ubicación y servicios',
        'Lee reseñas de otros estudiantes',
        'Contacta directamente con propietarios',
      ],
    },
    {
      title: 'Tu perfil es importante',
      description: 'Un perfil completo aumenta tus posibilidades de conseguir piso.',
      icon: CheckCircle,
      tips: [
        'Añade una foto de perfil',
        'Completa tu información personal',
        'Indica tu universidad y fechas',
        'Los propietarios confían más en perfiles completos',
      ],
    },
    {
      title: 'Cómo funciona',
      description: 'El proceso es simple y directo.',
      icon: Search,
      tips: [
        '1. Busca pisos con nuestros filtros',
        '2. Guarda tus favoritos',
        '3. Envía solicitudes a propietarios',
        '4. Chatea y programa visitas',
      ],
    },
  ];

  const landlordSteps = [
    {
      title: '¡Bienvenido a Livix!',
      description: 'Publica tus propiedades y encuentra inquilinos estudiantes.',
      icon: Home,
      tips: [
        'Miles de estudiantes buscan alojamiento',
        'Panel de control completo',
        'Gestiona solicitudes fácilmente',
        'Chat directo con estudiantes',
      ],
    },
    {
      title: 'Crea tu primer anuncio',
      description: 'Un buen anuncio atrae más inquilinos.',
      icon: CheckCircle,
      tips: [
        'Añade fotos de calidad',
        'Describe todos los servicios',
        'Define precio y disponibilidad',
        'Responde rápido a las solicitudes',
      ],
    },
    {
      title: 'Gestiona tus propiedades',
      description: 'Todo desde un solo lugar.',
      icon: MessageCircle,
      tips: [
        'Ver y aprobar solicitudes',
        'Chat con estudiantes interesados',
        'Programa visitas',
        'Analiza el rendimiento de tus anuncios',
      ],
    },
  ];

  const steps = userRole === 'student' ? studentSteps : landlordSteps;
  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            {isSelectingRole ? (
              <>
                <Search className="w-8 h-8 text-primary" />
                ¿Cómo quieres usar Livix?
              </>
            ) : (
              <>
                <Icon className="w-8 h-8 text-primary" />
                {currentStepData.title}
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            {isSelectingRole
              ? "Selecciona tu perfil para personalizar tu experiencia"
              : currentStepData.description
            }
          </DialogDescription>
        </DialogHeader>

        {isSelectingRole ? (
          <div className="grid gap-4 py-4">
            <Card
              className="p-4 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group"
              onClick={() => handleRoleSelection('student')}
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Search className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Soy Estudiante</h3>
                  <p className="text-muted-foreground text-sm">Busco habitación o piso para compartir</p>
                </div>
              </div>
            </Card>

            <Card
              className="p-4 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group"
              onClick={() => handleRoleSelection('landlord')}
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-full bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                  <Home className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Soy Propietario</h3>
                  <p className="text-muted-foreground text-sm">Quiero alquilar mi propiedad (entera o por habitaciones)</p>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <>
            <Card className="p-6 bg-muted/50 border-0">
              <ul className="space-y-3">
                {currentStepData.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <div className="flex items-center justify-between pt-4">
              <div className="flex gap-1">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full transition-colors ${index === currentStep ? 'bg-primary' : 'bg-muted'
                      }`}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <Button variant="ghost" onClick={handleSkip}>
                  Saltar
                </Button>
                <Button onClick={handleNext}>
                  {currentStep < steps.length - 1 ? 'Siguiente' : 'Empezar'}
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
