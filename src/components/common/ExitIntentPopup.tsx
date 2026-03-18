import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Bell, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const ExitIntentPopup = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleExitIntent = useCallback((e: MouseEvent) => {
    // Only trigger when mouse leaves the top of the viewport
    if (e.clientY > 5) return;

    // Only show once per session
    const shown = sessionStorage.getItem("livix-exit-shown");
    if (shown) return;

    // Only for guests with 2+ page views
    const views = parseInt(sessionStorage.getItem("livix-page-views") || "0");
    if (views < 2) return;

    sessionStorage.setItem("livix-exit-shown", "true");
    setIsOpen(true);
  }, []);

  // Track page views
  useEffect(() => {
    const views = parseInt(sessionStorage.getItem("livix-page-views") || "0");
    sessionStorage.setItem("livix-page-views", String(views + 1));
  }, []);

  // Listen for exit intent (mouse leaving viewport top)
  useEffect(() => {
    if (user) return; // Don't show for logged-in users

    document.addEventListener("mouseout", handleExitIntent);
    return () => document.removeEventListener("mouseout", handleExitIntent);
  }, [user, handleExitIntent]);

  // Also trigger on visibility change (tab switch) for mobile
  useEffect(() => {
    if (user) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        const shown = sessionStorage.getItem("livix-exit-shown");
        const views = parseInt(sessionStorage.getItem("livix-page-views") || "0");
        if (!shown && views >= 2) {
          sessionStorage.setItem("livix-exit-shown", "true");
          setIsOpen(true);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [user]);

  if (user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            No te pierdas tu piso ideal
          </DialogTitle>
        </DialogHeader>
        <div className="text-center space-y-4 py-2">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Bell className="h-8 w-8 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">
            Crea tu cuenta gratis y recibe alertas cuando se publiquen pisos
            que encajen con lo que buscas. Sin spam, solo oportunidades.
          </p>
          <div className="space-y-2">
            <Link to="/signup" onClick={() => setIsOpen(false)}>
              <Button className="w-full" size="lg">
                Crear cuenta gratis
              </Button>
            </Link>
            <Link to="/explore" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" className="w-full" size="sm">
                Seguir explorando
              </Button>
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            Solo toma 30 segundos. Sin tarjeta de crédito.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExitIntentPopup;
