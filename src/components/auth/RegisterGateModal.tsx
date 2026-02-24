import { useNavigate } from "react-router-dom";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lock, UserPlus, LogIn, Sparkles } from "lucide-react";

interface RegisterGateModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Contextual message, e.g. "ver las fotos de este piso" */
    context?: string;
}

const RegisterGateModal = ({
    open,
    onOpenChange,
    context = "acceder a esta función",
}: RegisterGateModalProps) => {
    const navigate = useNavigate();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md border-0 shadow-2xl">
                {/* Decorative top gradient */}
                <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-lg bg-gradient-to-r from-primary via-system-blue to-primary" />

                <DialogHeader className="text-center pt-4">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <Lock className="h-7 w-7 text-primary" />
                    </div>
                    <DialogTitle className="text-xl font-bold">
                        Regístrate gratis
                    </DialogTitle>
                    <DialogDescription className="text-base text-muted-foreground mt-2">
                        Para <span className="font-medium text-foreground">{context}</span>, crea tu cuenta gratuita en Livix.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 pt-2">
                    {/* Benefits list */}
                    <div className="space-y-2 text-sm text-muted-foreground">
                        {[
                            "Acceso completo a fotos y detalles",
                            "Descuentos exclusivos para estudiantes",
                            "Encuentra tu compañero de piso ideal",
                            "Contacta directamente con propietarios",
                        ].map((benefit) => (
                            <div key={benefit} className="flex items-center gap-2">
                                <Sparkles className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                                <span>{benefit}</span>
                            </div>
                        ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="space-y-3 pt-2">
                        <Button
                            className="w-full h-11 text-base font-semibold"
                            onClick={() => {
                                onOpenChange(false);
                                navigate("/signup");
                            }}
                        >
                            <UserPlus className="h-4 w-4 mr-2" />
                            Crear cuenta gratis
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full h-11"
                            onClick={() => {
                                onOpenChange(false);
                                navigate("/login");
                            }}
                        >
                            <LogIn className="h-4 w-4 mr-2" />
                            Ya tengo cuenta
                        </Button>
                    </div>

                    <p className="text-center text-xs text-muted-foreground">
                        Es gratis y solo toma 30 segundos
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default RegisterGateModal;
