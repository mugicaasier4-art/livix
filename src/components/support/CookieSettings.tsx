import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/contexts/I18nContext";
import { analytics } from "@/utils/analytics";

interface CookieSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (consent: { essential: boolean; analytics: boolean; marketing: boolean }) => void;
}

export const CookieSettings = ({ isOpen, onClose, onSave }: CookieSettingsProps) => {
  const { t } = useI18n();
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [marketing, setMarketing] = useState(false);

  const handleSave = () => {
    onSave({
      essential: true,
      analytics: analyticsEnabled,
      marketing
    });
    analytics.track('cookies_pref_saved', { analytics_enabled: analyticsEnabled, marketing_enabled: marketing });
  };

  const handleAcceptAll = () => {
    setAnalyticsEnabled(true);
    setMarketing(true);
    onSave({
      essential: true,
      analytics: true,
      marketing: true
    });
    analytics.track('cookies_accept_all', { source: 'settings' });
  };

  const handleRejectAll = () => {
    setAnalyticsEnabled(false);
    setMarketing(false);
    onSave({
      essential: true,
      analytics: false,
      marketing: false
    });
    analytics.track('cookies_reject_all', { source: 'settings' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {t('cookies.settings_title')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-4">
            {/* Essential Cookies */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="font-medium">
                  {t('cookies.essential_title')}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t('cookies.essential_desc')}
                </p>
              </div>
              <Switch 
                checked={true} 
                disabled 
                aria-label="Cookies esenciales (siempre activas)"
              />
            </div>

            {/* Analytics Cookies */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="font-medium">
                  {t('cookies.analytics_title')}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t('cookies.analytics_desc')}
                </p>
              </div>
              <Switch 
                checked={analyticsEnabled} 
                onCheckedChange={setAnalyticsEnabled}
                aria-label="Cookies analíticas"
              />
            </div>

            {/* Marketing Cookies */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="font-medium">
                  {t('cookies.marketing_title')}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t('cookies.marketing_desc')}
                </p>
              </div>
              <Switch 
                checked={marketing} 
                onCheckedChange={setMarketing}
                aria-label="Cookies de marketing"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={handleSave} className="flex-1">
              {t('cookies.save_preferences')}
            </Button>
            <Button 
              onClick={handleAcceptAll} 
              variant="outline" 
              className="flex-1"
            >
              {t('cookies.accept_all')}
            </Button>
          </div>
          
          <Button 
            onClick={handleRejectAll} 
            variant="ghost" 
            className="w-full"
          >
            {t('cookies.reject_all')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};