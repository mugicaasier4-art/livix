import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/contexts/I18nContext";
import { analytics } from "@/utils/analytics";
import { CookieSettings } from "./CookieSettings";

interface CookieConsent {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
}

const CONSENT_KEY = 'cr_consent';

export const CookieBanner = () => {
  const { t } = useI18n();
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      setShowBanner(true);
      analytics.track('cookies_banner_shown');
    }
  }, []);

  const saveConsent = (consent: Omit<CookieConsent, 'updatedAt'>) => {
    const consentData: CookieConsent = {
      ...consent,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consentData));
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleAcceptAll = () => {
    saveConsent({
      essential: true,
      analytics: true,
      marketing: true
    });
    analytics.track('cookies_accept_all');
  };

  const handleRejectAll = () => {
    saveConsent({
      essential: true,
      analytics: false,
      marketing: false
    });
    analytics.track('cookies_reject_all');
  };

  const handleOpenSettings = () => {
    setShowSettings(true);
    analytics.track('cookies_open_settings');
  };

  if (!showBanner) return null;

  return (
    <>
      <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md">
        <Card className="p-4 shadow-lg border-border bg-background">
          <div className="space-y-4">
            <div className="text-sm">
              <p className="font-medium mb-2">
                {t('cookies.banner_title')}
              </p>
              <p className="text-muted-foreground">
                {t('cookies.banner_description')}
              </p>
            </div>
            
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button 
                onClick={handleAcceptAll}
                size="sm" 
                className="flex-1"
              >
                {t('cookies.accept_all')}
              </Button>
              <Button 
                onClick={handleRejectAll}
                variant="outline" 
                size="sm" 
                className="flex-1"
              >
                {t('cookies.reject_all')}
              </Button>
            </div>
            
            <div className="flex justify-between items-center text-xs">
              <button
                onClick={handleOpenSettings}
                className="text-primary hover:underline"
              >
                {t('cookies.configure')}
              </button>
              <Link 
                to="/legal/privacy" 
                className="text-muted-foreground hover:text-foreground hover:underline"
              >
                {t('cookies.learn_more')}
              </Link>
            </div>
          </div>
        </Card>
      </div>

      {showSettings && (
        <CookieSettings 
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          onSave={saveConsent}
        />
      )}
    </>
  );
};