import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboarding } from '@/hooks/useOnboarding';
import { supabase } from '@/integrations/supabase/client';
import { WelcomeModal } from './WelcomeModal';
import { OnboardingTour } from './OnboardingTour';

export const OnboardingProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { progress, isLoading, markTourComplete, markWelcomeViewed } = useOnboarding();
  const [showWelcome, setShowWelcome] = useState(false);
  const [runTour, setRunTour] = useState(false);
  const [tempRole, setTempRole] = useState<'student' | 'landlord' | null>(null);

  const effectiveRole = tempRole || (user?.role === 'landlord' ? 'landlord' : 'student');

  const handleRoleSelect = async (role: 'student' | 'landlord') => {
    if (!user) return;

    // Update role in DB
    const { error } = await supabase
      .from('user_roles')
      .upsert({ user_id: user.id, role: role });

    if (!error) {
      setTempRole(role);
    }
  };

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

    // If role changed, redirect to correct dashboard/onboarding immediately
    if (tempRole) {
      const targetPath = tempRole === 'landlord' ? '/ll/onboarding' : '/onboarding/student';
      window.location.href = targetPath;
      return;
    }

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
        userRole={effectiveRole}
        onRoleSelect={handleRoleSelect}
      />

      <OnboardingTour
        run={runTour}
        onFinish={handleTourFinish}
        userRole={effectiveRole}
      />
    </>
  );
};
