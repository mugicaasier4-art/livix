import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Users, Plus, Loader2 } from "lucide-react";
import { useRoommateGroups } from "@/hooks/useRoommateGroups";
import GroupProfile from "./GroupProfile";
import { toast } from "sonner";

const CITIES = [
  "Zaragoza", "Madrid", "Barcelona", "Valencia", "Sevilla", "Bilbao",
  "Granada", "Salamanca", "Santiago de Compostela", "Malaga",
];

interface GroupSearchProps {
  city?: string;
  onCreateGroup?: () => void;
}

const GroupSearch = ({ city: initialCity, onCreateGroup }: GroupSearchProps) => {
  const { publicGroups, isLoading, fetchPublicGroups, applyToGroup } = useRoommateGroups();
  const [selectedCity, setSelectedCity] = useState(initialCity || "");
  const [selectedGroup, setSelectedGroup] = useState<(typeof publicGroups)[number] | null>(null);
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [applyMessage, setApplyMessage] = useState("");
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchPublicGroups(selectedCity || undefined);
  }, [selectedCity, fetchPublicGroups]);

  const handleApply = async () => {
    if (!selectedGroup) return;
    setApplying(true);
    try {
      await applyToGroup(selectedGroup.id, applyMessage);
      setShowApplyDialog(false);
      setApplyMessage("");
      setSelectedGroup(null);
    } catch {
      // Error handled in hook
    } finally {
      setApplying(false);
    }
  };

  const openApplyFlow = (group: (typeof publicGroups)[number]) => {
    setSelectedGroup(group);
    setShowApplyDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-black">Grupos buscando compis</h2>
          <p className="text-sm text-gray-500 mt-1">
            Encuentra un grupo y busca piso juntos
          </p>
        </div>
        {onCreateGroup && (
          <Button
            className="bg-[#5DB4EE] hover:bg-[#4a9fd8] text-white font-semibold"
            onClick={onCreateGroup}
          >
            <Plus className="w-4 h-4 mr-2" />
            Crear grupo
          </Button>
        )}
      </div>

      {/* City filter */}
      <div>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="w-full sm:w-64 h-11 rounded-md border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#5DB4EE] focus:border-transparent"
        >
          <option value="">Todas las ciudades</option>
          {CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-[#5DB4EE]" />
        </div>
      )}

      {/* Grid */}
      {!isLoading && publicGroups.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {publicGroups.map((group) => (
            <div
              key={group.id}
              onClick={() => setSelectedGroup(group)}
            >
              <GroupProfile
                group={group}
                members={group.members || []}
                compact
              />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && publicGroups.length === 0 && (
        <div className="text-center py-16 space-y-4">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg">
            No hay grupos buscando en {selectedCity || "esta ciudad"}.
          </p>
          <p className="text-gray-400 text-sm">Crea el tuyo!</p>
          {onCreateGroup && (
            <Button
              className="bg-[#5DB4EE] hover:bg-[#4a9fd8] text-white font-semibold"
              onClick={onCreateGroup}
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear grupo
            </Button>
          )}
        </div>
      )}

      {/* Full group view dialog */}
      <Dialog
        open={!!selectedGroup && !showApplyDialog}
        onOpenChange={(open) => {
          if (!open) setSelectedGroup(null);
        }}
      >
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          {selectedGroup && (
            <GroupProfile
              group={selectedGroup}
              members={selectedGroup.members || []}
              onApply={() => openApplyFlow(selectedGroup)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Apply dialog */}
      <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Solicitar unirse a {selectedGroup?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label htmlFor="apply-message">
                Presentate al grupo (opcional)
              </Label>
              <Textarea
                id="apply-message"
                value={applyMessage}
                onChange={(e) => setApplyMessage(e.target.value)}
                placeholder="Hola! Soy estudiante de... y busco piso en..."
                rows={4}
                className="mt-1"
              />
            </div>
            <Button
              className="w-full bg-[#5DB4EE] hover:bg-[#4a9fd8] text-white font-semibold"
              size="lg"
              onClick={handleApply}
              disabled={applying}
            >
              {applying ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Enviar solicitud
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GroupSearch;
