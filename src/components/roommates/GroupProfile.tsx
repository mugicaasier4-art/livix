import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, GraduationCap, Users, Euro, UserPlus, Settings, Share2 } from "lucide-react";
import ShareButtons from "./ShareButtons";

interface GroupMemberDisplay {
  user_id: string;
  role: string;
  profile?: {
    name: string;
    avatar_url: string | null;
  };
}

interface GroupData {
  id: string;
  name: string;
  city: string;
  university: string | null;
  budget_min: number | null;
  budget_max: number | null;
  max_members: number;
  looking_for_count: number;
  description: string | null;
  preferred_zones: string[] | null;
}

interface GroupProfileProps {
  group: GroupData;
  members: GroupMemberDisplay[];
  onApply?: () => void;
  isOwnGroup?: boolean;
  onManage?: () => void;
  compact?: boolean;
}

const GroupProfile = ({ group, members, onApply, isOwnGroup = false, onManage, compact = false }: GroupProfileProps) => {
  const currentCount = members.length;
  const spotsLeft = group.max_members - currentCount;

  const budgetText =
    group.budget_min && group.budget_max
      ? `${group.budget_min} - ${group.budget_max} EUR/mes`
      : group.budget_min
        ? `Desde ${group.budget_min} EUR/mes`
        : group.budget_max
          ? `Hasta ${group.budget_max} EUR/mes`
          : null;

  const inviteUrl = typeof window !== "undefined"
    ? `${window.location.origin}/roommates/join/${group.id}`
    : "";

  if (compact) {
    return (
      <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between">
            <h3 className="font-bold text-black text-base truncate pr-2">{group.name}</h3>
            <Badge variant="secondary" className="shrink-0 text-xs">
              Buscan {spotsLeft}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {group.city}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {currentCount}/{group.max_members}
            </span>
          </div>

          {/* Member avatars */}
          <div className="flex -space-x-2">
            {members.slice(0, 5).map((member) => (
              <Avatar key={member.user_id} className="w-8 h-8 border-2 border-white">
                {member.profile?.avatar_url && (
                  <AvatarImage src={member.profile.avatar_url} />
                )}
                <AvatarFallback className="text-xs bg-[#5DB4EE]/10 text-[#5DB4EE]">
                  {(member.profile?.name || "U").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
            {members.length > 5 && (
              <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs text-gray-500 font-medium">
                +{members.length - 5}
              </div>
            )}
          </div>

          {budgetText && (
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Euro className="w-3.5 h-3.5" />
              {budgetText}
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  // Full view
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{group.name}</CardTitle>
            <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {group.city}
              </span>
              {group.university && (
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-4 h-4" />
                  {group.university}
                </span>
              )}
            </div>
          </div>
          <Badge className="bg-[#5DB4EE] text-white text-sm px-3 py-1">
            Buscan {spotsLeft} mas
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Members */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">
            <Users className="w-4 h-4 inline mr-1" />
            {currentCount}/{group.max_members} miembros
          </p>
          <div className="flex -space-x-3">
            {members.map((member) => (
              <div key={member.user_id} className="flex flex-col items-center">
                <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                  {member.profile?.avatar_url && (
                    <AvatarImage src={member.profile.avatar_url} />
                  )}
                  <AvatarFallback className="bg-[#5DB4EE]/10 text-[#5DB4EE] font-semibold">
                    {(member.profile?.name || "U").charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            ))}
            {/* Empty spots */}
            {Array.from({ length: spotsLeft }).map((_, i) => (
              <Avatar key={`empty-${i}`} className="w-12 h-12 border-2 border-dashed border-gray-300">
                <AvatarFallback className="bg-gray-50 text-gray-300">
                  <UserPlus className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          <div className="flex gap-2 mt-2 flex-wrap">
            {members.map((member) => (
              <span key={member.user_id} className="text-xs text-gray-500">
                {member.profile?.name || "Usuario"}
                {member.role === "admin" && (
                  <span className="text-[#5DB4EE] ml-1">(admin)</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Budget */}
        {budgetText && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Euro className="w-4 h-4" />
            <span>{budgetText}</span>
          </div>
        )}

        {/* Preferred zones */}
        {group.preferred_zones && group.preferred_zones.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {group.preferred_zones.map((zone) => (
              <Badge key={zone} variant="outline" className="text-xs">
                {zone}
              </Badge>
            ))}
          </div>
        )}

        {/* Description */}
        {group.description && (
          <p className="text-sm text-gray-600 leading-relaxed">{group.description}</p>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-2">
          {isOwnGroup ? (
            <>
              <ShareButtons
                title={`Grupo ${group.name} en Livix`}
                text={`Unete a nuestro grupo "${group.name}" para buscar piso juntos en ${group.city}!`}
                url={inviteUrl}
              />
              {onManage && (
                <Button variant="outline" onClick={onManage} className="w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  Gestionar grupo
                </Button>
              )}
            </>
          ) : (
            <Button
              className="w-full bg-[#5DB4EE] hover:bg-[#4a9fd8] text-white font-semibold"
              size="lg"
              onClick={onApply}
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Solicitar unirse
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupProfile;
