import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboarding } from '@/hooks/useOnboarding';
import { WelcomeModal } from './WelcomeModal';
import { OnboardingTour } from './OnboardingTour';

export const OnboardingProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { progress, isLoading, markTourComplete, markWelcomeViewed } = useOnboarding();
  const [showWelcome, setShowWelcome] = useState(false);
  const [runTour, setRunTour] = useState(false);

  const userRole = user?.role === 'landlord' ? 'landlord' : 'student';

  useEffect(() => {
    if (!isLoading && progress && user) {
      // Show welcome modal on first visit
      if (!progress.has_viewed_welcome) {
        setShowWelcome(true);
      }
    }
  }, [isLoading, progress, user]);

  const handleWelcomeClose = () => {
    setShowWelcome(false);
    markWelcomeViewed();
    
    // Start tour after welcome modal if not completed
    if (progress && !progress.has_completed_tour) {
      setTimeout(() => setRunTour(true), 500);
    }
  };

  const handleTourFinish = () => {
    setRunTour(false);
    markTourComplete();
  };

  if (isLoading || !user) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      
      <WelcomeModal
        open={showWelcome}
        onClose={handleWelcomeClose}
        userRole={userRole}
      />

      <OnboardingTour
        run={runTour}
        onFinish={handleTourFinish}
        userRole={userRole}
      />
    </>
  );
};
