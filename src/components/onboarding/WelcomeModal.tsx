import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Home, Search, MessageCircle, CheckCircle } from 'lucide-react';

interface WelcomeModalProps {
  open: boolean;
  onClose: () => void;
  userRole: 'student' | 'landlord';
}

export const WelcomeModal = ({ open, onClose, userRole }: WelcomeModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);

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
            <Icon className="w-8 h-8 text-primary" />
            {currentStepData.title}
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            {currentStepData.description}
          </DialogDescription>
        </DialogHeader>

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
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === currentStep ? 'bg-primary' : 'bg-muted'
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
      </DialogContent>
    </Dialog>
  );
};
