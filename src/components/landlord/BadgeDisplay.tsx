import { Badge } from "@/components/ui/badge";
import { Zap, CheckCircle, Star, Clock } from "lucide-react";
import { useReputationBadges } from "@/hooks/useReputationBadges";

const badgeConfig: Record<string, { label: string; icon: React.ElementType; className: string }> = {
  fast_responder: {
    label: "Responde rápido",
    icon: Zap,
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  verified: {
    label: "Verificado",
    icon: CheckCircle,
    className: "bg-green-100 text-green-800 border-green-200",
  },
  top_rated: {
    label: "Mejor valorado",
    icon: Star,
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  experienced: {
    label: "Experimentado",
    icon: Clock,
    className: "bg-purple-100 text-purple-800 border-purple-200",
  },
};

interface BadgeDisplayProps {
  userId?: string;
}

const BadgeDisplay = ({ userId }: BadgeDisplayProps) => {
  const { badges, isLoading } = useReputationBadges(userId);

  if (isLoading || badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {badges.map((badge) => {
        const config = badgeConfig[badge.badge_type];
        if (!config) return null;

        const Icon = config.icon;
        return (
          <Badge
            key={badge.id}
            variant="outline"
            className={`text-xs gap-1 ${config.className}`}
          >
            <Icon className="h-3 w-3" />
            {config.label}
          </Badge>
        );
      })}
    </div>
  );
};

export default BadgeDisplay;
