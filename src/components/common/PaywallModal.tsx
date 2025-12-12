import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Crown, Zap, Star, Check } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { analytics } from '@/utils/analytics';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
  context: string;
  onUpgrade?: () => void;
}

const PaywallModal: React.FC<PaywallModalProps> = ({ 
  isOpen, 
  onClose, 
  feature, 
  context,
  onUpgrade 
}) => {
  const { t } = useI18n();

  React.useEffect(() => {
    if (isOpen) {
      analytics.trackPaywallViewed(feature, context);
    }
  }, [isOpen, feature, context]);

  const handleUpgrade = () => {
    analytics.trackPaywallAccepted(feature);
    onUpgrade?.();
    // Mock: Set premium status in localStorage
    localStorage.setItem('campus-room-premium', 'true');
    onClose();
  };

  const premiumFeatures = [
    {
      icon: <Zap className="h-5 w-5" />,
      title: 'Swipes ilimitados',
      description: 'Descubre todos los alojamientos sin límites'
    },
    {
      icon: <Star className="h-5 w-5" />,
      title: 'Acceso prioritario',
      description: 'Sé el primero en ver nuevos alojamientos'
    },
    {
      icon: <Check className="h-5 w-5" />,
      title: 'Filtros avanzados',
      description: 'Encuentra exactamente lo que buscas'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-center">
            <Crown className="h-6 w-6 text-premium" />
            {t('premium.title')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center text-muted-foreground">
            {feature === 'swipe_limit' && t('premium.swipe_limit')}
          </div>
          
          <div className="space-y-3">
            {premiumFeatures.map((feature, index) => (
              <Card key={index} className="p-3">
                <div className="flex items-start gap-3">
                  <div className="text-premium mt-0.5">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{feature.title}</h4>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="pt-4 space-y-2">
            <Button onClick={handleUpgrade} className="w-full bg-premium hover:bg-premium/90">
              <Crown className="h-4 w-4 mr-2" />
              {t('premium.unlock')}
            </Button>
            <Button variant="ghost" onClick={onClose} className="w-full">
              {t('common.cancel')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaywallModal;