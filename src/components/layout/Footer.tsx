import { Link } from "react-router-dom";
import { Instagram, Twitter, Linkedin, Mail, MapPin } from "lucide-react";
import { SEOLinks } from "@/components/seo/SEOLinks";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const legalLinks = [
    { label: "Términos y Condiciones", to: "/legal/terms" },
    { label: "Política de Privacidad", to: "/legal/privacy" },
  ];

  const navigationLinks = [
    { label: "Explorar Pisos", to: "/explore" },
    { label: "Residencias", to: "/residences" },
    { label: "Livix Club", to: "/club" },
    { label: "Blog", to: "/blog" },
    { label: "Soporte", to: "/support" },
  ];

  const socialLinks = [
    { icon: Instagram, href: "https://instagram.com/livix.app", label: "Instagram" },
    { icon: Twitter, href: "https://twitter.com/livix_app", label: "Twitter" },
    { icon: Linkedin, href: "https://linkedin.com/company/livix", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-muted/50 border-t border-border mt-auto">
      {/* SEO Internal Linking Grid */}
      <SEOLinks />

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-foreground">LIVIX</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              La plataforma de alojamiento para estudiantes en Zaragoza.
              Encuentra tu piso, residencia o compañero de piso ideal.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Zaragoza, España</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Navegación</h4>
            <nav className="flex flex-col gap-2">
              {navigationLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Legal</h4>
            <nav className="flex flex-col gap-2">
              {legalLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Contacto</h4>
            <a
              href="mailto:info@livix.es"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail className="h-4 w-4" />
              info@livix.es
            </a>
            <div className="flex gap-4 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Livix. Todos los derechos reservados.
          </p>
          <p className="text-xs text-muted-foreground">
            Hecho con ❤️ para estudiantes en Zaragoza
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
