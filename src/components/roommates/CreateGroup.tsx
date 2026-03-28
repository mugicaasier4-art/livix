import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Users, Check } from "lucide-react";
import { useRoommateGroups, type CreateGroupData } from "@/hooks/useRoommateGroups";
import ShareButtons from "./ShareButtons";

const CITIES = [
  "Zaragoza", "Madrid", "Barcelona", "Valencia", "Sevilla", "Bilbao",
  "Granada", "Salamanca", "Santiago de Compostela", "Malaga",
];

interface CreateGroupProps {
  onCreated?: (groupId: string) => void;
}

const CreateGroup = ({ onCreated }: CreateGroupProps) => {
  const { createGroup, generateInviteLink } = useRoommateGroups();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdGroupId, setCreatedGroupId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    city: "Zaragoza",
    university: "",
    currentMembers: 1,
    lookingFor: 1,
    budgetMin: "",
    budgetMax: "",
    zones: "",
    description: "",
  });

  const updateField = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.city) return;

    setIsSubmitting(true);
    try {
      const data: CreateGroupData = {
        name: form.name.trim(),
        city: form.city,
        university: form.university.trim() || undefined,
        max_members: form.currentMembers + form.lookingFor,
        looking_for_count: form.lookingFor,
        budget_min: form.budgetMin ? Number(form.budgetMin) : undefined,
        budget_max: form.budgetMax ? Number(form.budgetMax) : undefined,
        preferred_zones: form.zones
          ? form.zones.split(",").map((z) => z.trim()).filter(Boolean)
          : undefined,
        description: form.description.trim() || undefined,
      };

      const group = await createGroup(data);
      setCreatedGroupId(group.id);
      onCreated?.(group.id);
    } catch {
      // Error handled in hook
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success screen
  if (createdGroupId) {
    const inviteUrl = generateInviteLink(createdGroupId);
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-8 pb-6 flex flex-col items-center text-center gap-5">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-black">Grupo creado!</h3>
            <p className="text-sm text-gray-500 mt-1">
              Comparte el enlace con tus amigos para que se unan.
            </p>
          </div>
          <ShareButtons
            title={`Grupo ${form.name} en Livix`}
            text={`Unete a mi grupo "${form.name}" para buscar piso juntos en ${form.city}!`}
            url={inviteUrl}
          />
        </CardContent>
      </Card>
    );
  }

  // Form
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Users className="w-5 h-5 text-[#5DB4EE]" />
          Crear grupo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <Label htmlFor="group-name">Nombre del grupo *</Label>
            <Input
              id="group-name"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Los buscapisos, Erasmus 2026..."
              required
              className="mt-1"
            />
          </div>

          {/* City */}
          <div>
            <Label htmlFor="group-city">Ciudad *</Label>
            <select
              id="group-city"
              value={form.city}
              onChange={(e) => updateField("city", e.target.value)}
              className="w-full h-11 mt-1 rounded-md border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#5DB4EE] focus:border-transparent"
              required
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* University */}
          <div>
            <Label htmlFor="group-uni">Universidad (opcional)</Label>
            <Input
              id="group-uni"
              value={form.university}
              onChange={(e) => updateField("university", e.target.value)}
              placeholder="Universidad de Zaragoza"
              className="mt-1"
            />
          </div>

          {/* Members count */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="current-members">Cuantos sois</Label>
              <Input
                id="current-members"
                type="number"
                min={1}
                max={5}
                value={form.currentMembers}
                onChange={(e) => updateField("currentMembers", Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="looking-for">Cuantos mas buscais</Label>
              <Input
                id="looking-for"
                type="number"
                min={1}
                max={4}
                value={form.lookingFor}
                onChange={(e) => updateField("lookingFor", Number(e.target.value))}
                className="mt-1"
              />
            </div>
          </div>

          {/* Budget */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="budget-min">Presupuesto min (EUR)</Label>
              <Input
                id="budget-min"
                type="number"
                min={0}
                value={form.budgetMin}
                onChange={(e) => updateField("budgetMin", e.target.value)}
                placeholder="200"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="budget-max">Presupuesto max (EUR)</Label>
              <Input
                id="budget-max"
                type="number"
                min={0}
                value={form.budgetMax}
                onChange={(e) => updateField("budgetMax", e.target.value)}
                placeholder="500"
                className="mt-1"
              />
            </div>
          </div>

          {/* Zones */}
          <div>
            <Label htmlFor="zones">Zonas preferidas (separadas por coma)</Label>
            <Input
              id="zones"
              value={form.zones}
              onChange={(e) => updateField("zones", e.target.value)}
              placeholder="Centro, Delicias, San Jose"
              className="mt-1"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="group-desc">Descripcion</Label>
            <Textarea
              id="group-desc"
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Somos 2 estudiantes de ingenieria buscando un piso de 3 habitaciones..."
              rows={3}
              className="mt-1"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#5DB4EE] hover:bg-[#4a9fd8] text-white font-semibold"
            size="lg"
            disabled={isSubmitting || !form.name.trim()}
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            Crear grupo
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateGroup;
