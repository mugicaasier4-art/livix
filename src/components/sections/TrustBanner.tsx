import { Shield, CheckCircle, Lock, GraduationCap } from "lucide-react";

const trustItems = [
  {
    icon: GraduationCap,
    text: "Alojamientos cerca de UNIZAR y San Jorge",
  },
  {
    icon: CheckCircle,
    text: "Pisos verificados manualmente",
  },
  {
    icon: Lock,
    text: "Datos cifrados (GDPR)",
  },
  {
    icon: Shield,
    text: "Plataforma 100% segura",
  },
];

const TrustBanner = () => {
  return (
    <section className="py-6 bg-muted/30 border-y border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {trustItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <item.icon className="h-4 w-4 text-primary flex-shrink-0" />
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBanner;
