import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { NotificationsDropdown } from "./NotificationsDropdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Menu, ChevronDown, X, Heart, User, Settings, UserCircle, Home, MessageSquare, BedDouble } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import livixLogo from "@/assets/livix-logo.png";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Main items always visible on tablet+
  const mainNavItems = [
    { href: "/explore?tipo=pisos", label: "Pisos" },
    { href: "/roommates", label: "Compañeros" },
    { href: "/residences", label: "Residencias" },
    { href: "/club", label: "Club" },
  ];

  // Desktop navigation items (visible only on lg+)
  const desktopNavItems = [
    { href: "/blog", label: "Blog" },
    { href: "/landlords", label: "Propietarios" },
  ];

  // Items in dropdown "Más" on desktop
  const dropdownItemsDesktop = [
    { href: "/how-it-works", label: "Cómo Funciona" },
    { href: "/support", label: "FAQ" },
  ];

  // Items in dropdown on tablet (includes everything not in mainNavItems)
  const dropdownItemsTablet = [
    { href: "/landlords", label: "Propietarios" },
    { href: "/blog", label: "Blog" },
    { href: "/how-it-works", label: "Cómo Funciona" },
    { href: "/support", label: "FAQ" },
  ];

  const isActive = (path: string) => {
    // Handle paths with query params
    if (path.includes('?')) {
      const [pathname, search] = path.split('?');
      if (location.pathname !== pathname) return false;
      const params = new URLSearchParams(search);
      const currentParams = new URLSearchParams(location.search);
      for (const [key, value] of params.entries()) {
        if (currentParams.get(key) !== value) return false;
      }
      return true;
    }
    return location.pathname === path;
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Sesión cerrada', {
        description: 'Has cerrado sesión correctamente',
        duration: 2000,
      });
      navigate('/');
    } catch (error) {
      toast.error('Error al cerrar sesión', {
        description: 'Hubo un problema al cerrar tu sesión',
        duration: 3000,
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white-pure/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - Text on all devices */}
          <Link to="/" className="flex items-center">
            <span className="font-poppins font-bold text-2xl text-primary">LIVIX</span>
          </Link>

          {/* Tablet+ Navigation - Main items always visible */}
          <nav className="hidden md:flex items-center space-x-6">
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive(item.href) ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}

            {/* Desktop - Show all desktop nav items */}
            <div className="hidden lg:flex items-center space-x-6">
              {desktopNavItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    isActive(item.href) ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            
            {/* Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1">
                  Más
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="z-50 bg-background border border-border shadow-lg">
                {/* Tablet: Show all items except mainNavItems */}
                {dropdownItemsTablet.map((item) => (
                  <DropdownMenuItem key={item.href} asChild className="lg:hidden">
                    <Link to={item.href} className="w-full">
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
                {/* Desktop: Show only "Más" items */}
                {dropdownItemsDesktop.map((item) => (
                  <DropdownMenuItem key={item.href} asChild className="hidden lg:block">
                    <Link to={item.href} className="w-full">
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Auth Section - Visible on tablet+ */}
          <div className="hidden md:flex items-center space-x-2">
            {user && <NotificationsDropdown />}
            {user ? (
              <DropdownMenu data-tour="profile-menu">
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{user.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 z-50 bg-background border border-border shadow-lg">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="w-full cursor-pointer">
                      <UserCircle className="h-4 w-4 mr-2" />
                      Mi Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/favorites" className="w-full cursor-pointer">
                      <Heart className="h-4 w-4 mr-2" />
                      Favoritos
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile#mis-anuncios" className="w-full cursor-pointer">
                      <BedDouble className="h-4 w-4 mr-2" />
                      Mis Habitaciones
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/bookings" className="w-full cursor-pointer">
                      <User className="h-4 w-4 mr-2" />
                      Mis Reservas
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/messages" className="w-full cursor-pointer">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Mensajes
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {user.role === 'landlord' && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/ll/dashboard" className="w-full cursor-pointer">
                          <Settings className="h-4 w-4 mr-2" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/ll/listings" className="w-full cursor-pointer">
                          <Home className="h-4 w-4 mr-2" />
                          Mis Anuncios
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  {user.role === 'student' && (
                    <DropdownMenuItem asChild>
                      <Link to="/student/dashboard" className="w-full cursor-pointer">
                        <Settings className="h-4 w-4 mr-2" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {user.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin/dashboard" className="w-full cursor-pointer">
                        <Settings className="h-4 w-4 mr-2" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="w-full cursor-pointer">
                      <Settings className="h-4 w-4 mr-2" />
                      Configuración
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    Salir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Iniciar sesión
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">
                    Registrarse
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown - Apple Style */}
      <div
        className={cn(
          "md:hidden fixed left-0 right-0 bg-white-pure border-b shadow-elevated overflow-hidden transition-all duration-300 ease-out z-40",
          mobileMenuOpen 
            ? "top-16 max-h-[calc(100vh-4rem)] opacity-100" 
            : "top-16 max-h-0 opacity-0"
        )}
      >
        <nav className="container mx-auto px-6 py-6 space-y-1">
          {[...mainNavItems, ...desktopNavItems].map((item, index) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "block py-3 text-lg font-medium transition-colors",
                isActive(item.href) 
                  ? "text-primary" 
                  : "text-foreground hover:text-primary"
              )}
              style={{
                animation: mobileMenuOpen 
                  ? `fade-in 0.3s ease-out ${index * 0.05}s both` 
                  : 'none'
              }}
            >
              {item.label}
            </Link>
          ))}
          
          <div className="h-px bg-border my-4" />
          
          {dropdownItemsDesktop.map((item, index) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-3 text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
              style={{
                animation: mobileMenuOpen 
                  ? `fade-in 0.3s ease-out ${(mainNavItems.length + desktopNavItems.length + index) * 0.05}s both` 
                  : 'none'
              }}
            >
              {item.label}
            </Link>
          ))}

          <div className="h-px bg-border my-4" />

          {user ? (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground py-2">
                Hola, {user.name}
              </p>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 text-lg font-medium text-foreground hover:text-primary transition-colors"
              >
                Mi Perfil
              </Link>
              <Link
                to="/favorites"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 text-lg font-medium text-foreground hover:text-primary transition-colors"
              >
                Favoritos
              </Link>
              <Link
                to="/profile#mis-anuncios"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 text-lg font-medium text-foreground hover:text-primary transition-colors"
              >
                Mis Habitaciones
              </Link>
              <Link
                to="/bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 text-lg font-medium text-foreground hover:text-primary transition-colors"
              >
                Mis Reservas
              </Link>
              <Link
                to="/messages"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 text-lg font-medium text-foreground hover:text-primary transition-colors"
              >
                Mensajes
              </Link>
              {user.role === 'landlord' && (
                <>
                  <Link
                    to="/ll/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 text-lg font-medium text-foreground hover:text-primary transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/ll/listings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 text-lg font-medium text-foreground hover:text-primary transition-colors"
                  >
                    Mis Anuncios
                  </Link>
                </>
              )}
              {user.role === 'student' && (
                <Link
                  to="/student/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 text-lg font-medium text-foreground hover:text-primary transition-colors"
                >
                  Mi Dashboard
                </Link>
              )}
              {user.role === 'admin' && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 text-lg font-medium text-foreground hover:text-primary transition-colors"
                >
                  Admin Panel
                </Link>
              )}
              <Link
                to="/settings"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 text-lg font-medium text-foreground hover:text-primary transition-colors"
              >
                Configuración
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center py-3 text-lg font-medium text-destructive hover:text-destructive/80 transition-colors"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Salir
              </button>
            </div>
          ) : (
            <div className="flex gap-3 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1"
              >
                <Button variant="outline" className="w-full">
                  Iniciar sesión
                </Button>
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1"
              >
                <Button className="w-full">
                  Registrarse
                </Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;