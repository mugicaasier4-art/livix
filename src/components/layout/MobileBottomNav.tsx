import { Link, useLocation } from "react-router-dom";
import { Home, Search, Heart, MessageSquare, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { hapticLight } from "@/utils/haptics";

const navItems = [
  { href: "/", icon: Home, label: "Inicio" },
  { href: "/explore", icon: Search, label: "Explorar" },
  { href: "/favorites", icon: Heart, label: "Favoritos" },
  { href: "/messages", icon: MessageSquare, label: "Mensajes" },
  { href: "/profile", icon: User, label: "Perfil" },
];

const MobileBottomNav = () => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  // Don't show on login/signup pages
  if (["/login", "/signup", "/forgot-password", "/reset-password"].includes(location.pathname)) {
    return null;
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden pb-safe"
      aria-label="Navegación principal móvil"
    >
      <div className="flex items-center justify-around h-14">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = isActive(href);
          const needsAuth = ["/favorites", "/messages", "/profile"].includes(href);
          const targetHref = needsAuth && !user ? "/login" : href;

          return (
            <Link
              key={href}
              to={targetHref}
              onClick={hapticLight}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors",
                active ? "text-primary" : "text-muted-foreground"
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span className="text-[11px] font-medium leading-none">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
