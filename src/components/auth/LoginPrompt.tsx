import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { X, Home } from "lucide-react";

const PROMPT_SESSION_KEY = "livix_login_prompt_shown";
const DELAY_MS = 30_000;

const LoginPrompt = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Don't show if already authenticated or still loading
    if (isLoading || user) return;

    // Only once per browser session
    if (sessionStorage.getItem(PROMPT_SESSION_KEY)) return;

    const timer = setTimeout(() => {
      setVisible(true);
      sessionStorage.setItem(PROMPT_SESSION_KEY, "1");
    }, DELAY_MS);

    return () => clearTimeout(timer);
  }, [user, isLoading]);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="login-prompt-title"
      aria-modal="false"
      className="fixed bottom-20 right-4 md:bottom-6 z-50 max-w-sm w-[calc(100vw-2rem)] bg-background border border-border rounded-2xl shadow-2xl p-5 animate-in slide-in-from-bottom-4 duration-300"
    >
      {/* Close button */}
      <button
        onClick={() => setVisible(false)}
        className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Cerrar"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Icon */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <Home className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p id="login-prompt-title" className="font-semibold text-foreground text-sm">
            Encuentra tu piso más rápido
          </p>
          <p className="text-xs text-muted-foreground">
            Guarda favoritos y contacta propietarios
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          size="sm"
          className="flex-1 text-xs"
          onClick={() => {
            setVisible(false);
            navigate("/login");
          }}
        >
          Iniciar sesión
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1 text-xs"
          onClick={() => {
            setVisible(false);
            navigate("/signup");
          }}
        >
          Crear cuenta gratis
        </Button>
      </div>
    </div>
  );
};

export default LoginPrompt;
