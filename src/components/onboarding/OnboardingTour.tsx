import { useEffect, useState } from 'react';
import Joyride, { Step, CallBackProps, STATUS } from 'react-joyride';
import { useLocation } from 'react-router-dom';

interface OnboardingTourProps {
  run: boolean;
  onFinish: () => void;
  userRole: 'student' | 'landlord';
}

export const OnboardingTour = ({ run, onFinish, userRole }: OnboardingTourProps) => {
  const location = useLocation();
  const [stepIndex, setStepIndex] = useState(0);

  const studentSteps: Step[] = [
    {
      target: 'body',
      content: '¡Empecemos con un tour rápido! Te mostraremos cómo encontrar tu piso ideal.',
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '[data-tour="search-bar"]',
      content: 'Usa la barra de búsqueda para encontrar pisos por ubicación o cerca de tu universidad.',
      disableBeacon: true,
    },
    {
      target: '[data-tour="filters"]',
      content: 'Filtra por precio, número de habitaciones, servicios y más.',
      disableBeacon: true,
    },
    {
      target: '[data-tour="view-toggle"]',
      content: 'Cambia entre vista de lista, mapa o tarjetas deslizables.',
      disableBeacon: true,
    },
    {
      target: '[data-tour="listing-card"]',
      content: 'Haz clic en cualquier piso para ver todos los detalles, fotos y ubicación.',
      disableBeacon: true,
    },
    {
      target: '[data-tour="profile-menu"]',
      content: 'Aquí puedes acceder a tu perfil, favoritos, solicitudes y configuración.',
      disableBeacon: true,
    },
  ];

  const landlordSteps: Step[] = [
    {
      target: 'body',
      content: '¡Bienvenido! Te mostraremos cómo gestionar tus propiedades y solicitudes.',
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '[data-tour="dashboard-nav"]',
      content: 'Aquí está tu panel de control con todas tus estadísticas.',
      disableBeacon: true,
    },
    {
      target: '[data-tour="create-listing"]',
      content: 'Haz clic aquí para crear tu primer anuncio. ¡Es rápido y fácil!',
      disableBeacon: true,
    },
    {
      target: '[data-tour="my-listings"]',
      content: 'Gestiona todos tus anuncios desde aquí. Edita, pausa o elimina propiedades.',
      disableBeacon: true,
    },
    {
      target: '[data-tour="applications"]',
      content: 'Revisa las solicitudes de los estudiantes y responde rápidamente.',
      disableBeacon: true,
    },
    {
      target: '[data-tour="profile-menu"]',
      content: 'Accede a tus mensajes, configuración y analíticas desde aquí.',
      disableBeacon: true,
    },
  ];

  const steps = userRole === 'student' ? studentSteps : landlordSteps;

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, index, type } = data;
    
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status as any)) {
      onFinish();
    }

    if (type === 'step:after') {
      setStepIndex(index + 1);
    }
  };

  useEffect(() => {
    setStepIndex(0);
  }, [location.pathname]);

  return (
    <Joyride
      steps={steps}
      run={run}
      stepIndex={stepIndex}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      locale={{
        back: 'Atrás',
        close: 'Cerrar',
        last: 'Finalizar',
        next: 'Siguiente',
        skip: 'Saltar',
      }}
      styles={{
        options: {
          primaryColor: 'hsl(var(--primary))',
          textColor: 'hsl(var(--foreground))',
          backgroundColor: 'hsl(var(--background))',
          overlayColor: 'rgba(0, 0, 0, 0.5)',
          arrowColor: 'hsl(var(--background))',
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: 8,
          padding: 20,
        },
        buttonNext: {
          backgroundColor: 'hsl(var(--primary))',
          borderRadius: 6,
          padding: '8px 16px',
        },
        buttonBack: {
          color: 'hsl(var(--muted-foreground))',
          marginRight: 10,
        },
        buttonSkip: {
          color: 'hsl(var(--muted-foreground))',
        },
      }}
    />
  );
};
