import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/contexts/I18nContext";
import { analytics } from "@/utils/analytics";
import { Users, Brain, Shield, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

interface ProfilingConsentProps {
    isOpen: boolean;
    onConsent: () => void;
    onDecline: () => void;
}

export const ProfilingConsent = ({ isOpen, onConsent, onDecline }: ProfilingConsentProps) => {
    const { language } = useI18n();
    const [understood, setUnderstood] = useState(false);

    const handleConsent = () => {
        analytics.track('profiling_consent_granted');
        onConsent();
    };

    const handleDecline = () => {
        analytics.track('profiling_consent_declined');
        onDecline();
    };

    return (
        <Dialog open={isOpen} onOpenChange={() => onDecline()}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-primary" />
                        {language === 'en'
                            ? 'Roommate Matching Consent'
                            : 'Consentimiento para Matching de Roommates'
                        }
                    </DialogTitle>
                    <DialogDescription>
                        {language === 'en'
                            ? 'Please read this information carefully before using our matching feature.'
                            : 'Por favor lee esta información antes de usar nuestra función de matching.'
                        }
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Information cards */}
                    <div className="space-y-3">
                        <div className="flex gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                            <Users className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                            <div className="text-sm">
                                <p className="font-medium text-blue-900 dark:text-blue-100">
                                    {language === 'en' ? 'How it works' : 'Cómo funciona'}
                                </p>
                                <p className="text-blue-800 dark:text-blue-200 mt-1">
                                    {language === 'en'
                                        ? 'We use your profile information (interests, budget, location preferences, lifestyle) to algorithmically suggest compatible roommates.'
                                        : 'Usamos tu información de perfil (intereses, presupuesto, preferencias de ubicación, estilo de vida) para sugerirte algorítmicamente roommates compatibles.'
                                    }
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                            <Shield className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                            <div className="text-sm">
                                <p className="font-medium text-green-900 dark:text-green-100">
                                    {language === 'en' ? 'Your rights' : 'Tus derechos'}
                                </p>
                                <p className="text-green-800 dark:text-green-200 mt-1">
                                    {language === 'en'
                                        ? 'You can withdraw consent at any time in Settings. The matching will not produce legally binding effects.'
                                        : 'Puedes retirar tu consentimiento en cualquier momento en Ajustes. El matching no produce efectos jurídicamente vinculantes.'
                                    }
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                            <div className="text-sm">
                                <p className="font-medium text-amber-900 dark:text-amber-100">
                                    {language === 'en' ? 'Legal basis (Art. 22 GDPR)' : 'Base legal (Art. 22 RGPD)'}
                                </p>
                                <p className="text-amber-800 dark:text-amber-200 mt-1">
                                    {language === 'en'
                                        ? 'This feature involves automated profiling. Your explicit consent is required under GDPR Article 22.'
                                        : 'Esta función implica profiling automatizado. Tu consentimiento explícito es requerido bajo el Artículo 22 del RGPD.'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Confirmation checkbox */}
                    <div className="flex items-start space-x-3 pt-2">
                        <Checkbox
                            id="understood"
                            checked={understood}
                            onCheckedChange={(checked) => setUnderstood(checked === true)}
                            className="mt-0.5"
                        />
                        <Label
                            htmlFor="understood"
                            className="text-sm font-normal cursor-pointer leading-tight"
                        >
                            {language === 'en'
                                ? 'I understand and consent to algorithmic profiling for roommate matching purposes. I can withdraw this consent at any time.'
                                : 'Entiendo y consiento el profiling algorítmico para fines de matching de roommates. Puedo retirar este consentimiento en cualquier momento.'
                            }
                        </Label>
                    </div>

                    <p className="text-xs text-muted-foreground">
                        {language === 'en' ? 'Read our ' : 'Lee nuestra '}
                        <Link to="/legal/privacy" className="text-primary hover:underline" target="_blank">
                            {language === 'en' ? 'Privacy Policy' : 'Política de Privacidad'}
                        </Link>
                        {language === 'en' ? ' for more details.' : ' para más detalles.'}
                    </p>
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button
                        variant="outline"
                        onClick={handleDecline}
                        className="w-full sm:w-auto"
                    >
                        {language === 'en' ? 'No, thanks' : 'No, gracias'}
                    </Button>
                    <Button
                        onClick={handleConsent}
                        disabled={!understood}
                        className="w-full sm:w-auto"
                    >
                        {language === 'en' ? 'Accept and Continue' : 'Aceptar y Continuar'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ProfilingConsent;
