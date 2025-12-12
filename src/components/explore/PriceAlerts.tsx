import { useState, useEffect, useCallback } from 'react';
import { Bell, BellOff, TrendingDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface PriceAlert {
    listingId: string;
    listingTitle: string;
    originalPrice: number;
    targetPrice?: number;
    createdAt: string;
    enabled: boolean;
}

const ALERTS_STORAGE_KEY = 'livix_price_alerts';

export const usePriceAlerts = () => {
    const { user } = useAuth();
    const [alerts, setAlerts] = useState<PriceAlert[]>([]);

    // Load alerts from localStorage
    useEffect(() => {
        if (user) {
            const stored = localStorage.getItem(`${ALERTS_STORAGE_KEY}_${user.id}`);
            if (stored) {
                try {
                    setAlerts(JSON.parse(stored));
                } catch {
                    setAlerts([]);
                }
            }
        }
    }, [user]);

    // Save alerts to localStorage
    const saveAlerts = useCallback((newAlerts: PriceAlert[]) => {
        if (user) {
            localStorage.setItem(`${ALERTS_STORAGE_KEY}_${user.id}`, JSON.stringify(newAlerts));
        }
        setAlerts(newAlerts);
    }, [user]);

    const addAlert = useCallback((listingId: string, title: string, price: number) => {
        if (!user) {
            toast.error('Inicia sesión', {
                description: 'Debes iniciar sesión para crear alertas de precio'
            });
            return false;
        }

        const existing = alerts.find(a => a.listingId === listingId);
        if (existing) {
            toast.info('Alerta existente', {
                description: 'Ya tienes una alerta para este piso'
            });
            return false;
        }

        const newAlert: PriceAlert = {
            listingId,
            listingTitle: title,
            originalPrice: price,
            createdAt: new Date().toISOString(),
            enabled: true
        };

        saveAlerts([...alerts, newAlert]);
        toast.success('¡Alerta creada!', {
            description: `Te avisaremos si baja de ${price}€/mes`,
            icon: <Bell className="h-4 w-4" />
        });
        return true;
    }, [user, alerts, saveAlerts]);

    const removeAlert = useCallback((listingId: string) => {
        saveAlerts(alerts.filter(a => a.listingId !== listingId));
        toast.success('Alerta eliminada');
    }, [alerts, saveAlerts]);

    const toggleAlert = useCallback((listingId: string) => {
        saveAlerts(alerts.map(a =>
            a.listingId === listingId ? { ...a, enabled: !a.enabled } : a
        ));
    }, [alerts, saveAlerts]);

    const hasAlert = useCallback((listingId: string) => {
        return alerts.some(a => a.listingId === listingId);
    }, [alerts]);

    return {
        alerts,
        addAlert,
        removeAlert,
        toggleAlert,
        hasAlert
    };
};

// Button to add price alert on listing card
export const PriceAlertButton = ({
    listingId,
    title,
    price,
    variant = 'icon'
}: {
    listingId: string;
    title: string;
    price: number;
    variant?: 'icon' | 'full';
}) => {
    const { addAlert, removeAlert, hasAlert } = usePriceAlerts();
    const isActive = hasAlert(listingId);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isActive) {
            removeAlert(listingId);
        } else {
            addAlert(listingId, title, price);
        }
    };

    if (variant === 'icon') {
        return (
            <Button
                variant="outline"
                size="icon"
                onClick={handleClick}
                className={isActive ? 'bg-primary/10 border-primary text-primary' : ''}
                title={isActive ? 'Desactivar aviso de precio' : 'Avisarme si baja el precio'}
            >
                {isActive ? (
                    <Bell className="h-4 w-4 fill-current" />
                ) : (
                    <Bell className="h-4 w-4" />
                )}
            </Button>
        );
    }

    return (
        <Button
            variant={isActive ? 'default' : 'outline'}
            onClick={handleClick}
            className="gap-2 w-full"
        >
            {isActive ? (
                <>
                    <Bell className="h-4 w-4 fill-current" />
                    Te avisaremos si baja
                </>
            ) : (
                <>
                    <Bell className="h-4 w-4" />
                    Avísame si baja el precio
                </>
            )}
        </Button>
    );
};

// Manage all alerts dialog
export const PriceAlertsManager = () => {
    const { alerts, removeAlert, toggleAlert } = usePriceAlerts();
    const [isOpen, setIsOpen] = useState(false);

    if (alerts.length === 0) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 relative">
                    <Bell className="h-4 w-4" />
                    Alertas de precio
                    {alerts.filter(a => a.enabled).length > 0 && (
                        <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                            {alerts.filter(a => a.enabled).length}
                        </Badge>
                    )}
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-primary" />
                        Mis alertas de precio
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {alerts.map((alert) => (
                        <Card key={alert.listingId} className={!alert.enabled ? 'opacity-60' : ''}>
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-sm line-clamp-1">{alert.listingTitle}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="secondary" className="text-xs gap-1">
                                                <TrendingDown className="h-3 w-3" />
                                                Alertar bajo {alert.originalPrice}€
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={alert.enabled}
                                            onCheckedChange={() => toggleAlert(alert.listingId)}
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                            onClick={() => removeAlert(alert.listingId)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <p className="text-xs text-muted-foreground text-center mt-4">
                    Te enviaremos un email cuando algún precio baje
                </p>
            </DialogContent>
        </Dialog>
    );
};

export default PriceAlertButton;
