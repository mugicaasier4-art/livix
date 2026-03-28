import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  MapPin,
  Home,
  Users,
  Check,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRoommateProfiles } from "@/hooks/useRoommateProfiles";
import { useAuth } from "@/contexts/AuthContext";

// ── Backwards compatibility exports ──
export const LIFE_PROFILE_KEY = "livix_life_profile";

export function getSavedLifeProfile(): any | null {
  try {
    const data = localStorage.getItem(LIFE_PROFILE_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function getSavedFullProfile(): any | null {
  return getSavedLifeProfile();
}

// ── Constants ──
const CITIES = [
  "Zaragoza", "Madrid", "Barcelona", "Valencia", "Sevilla", "Granada",
  "Salamanca", "Bilbao", "Santiago", "Malaga", "Murcia", "Valladolid",
  "Coruna", "Alicante", "Cordoba", "Cadiz", "Pamplona", "Oviedo",
  "Santander", "Palma de Mallorca", "Otra",
];

const YEAR_OPTIONS = ["1", "2", "3", "4", "Master", "Doctorado", "Erasmus"];

const GENDER_OPTIONS = [
  { value: "any", label: "Indiferente" },
  { value: "male", label: "Chicos" },
  { value: "female", label: "Chicas" },
  { value: "mixed", label: "Mixto" },
];

const STUDY_PLACE_OPTIONS = [
  { value: "home", label: "En casa" },
  { value: "library", label: "Biblioteca" },
  { value: "cafe", label: "Cafeteria" },
  { value: "mixed", label: "Mixto" },
];

const EXPENSE_OPTIONS = [
  { value: "separate", label: "Cada uno lo suyo" },
  { value: "basics", label: "Compartir basicos" },
  { value: "all", label: "Compartir todo" },
];

const HOBBY_OPTIONS = [
  "Videojuegos", "Futbol", "Musica", "Lectura", "Arte", "Cocinar",
  "Running", "Gym", "Fotografia", "Viajar", "Cine / Series", "Yoga",
  "Baloncesto", "Teatro", "Voluntariado", "Escalada", "Tocar instrumento",
  "Animales", "Natacion", "Skate", "Programacion", "Redes Sociales",
  "Craft Beer", "Juegos de mesa",
];

const LANGUAGE_OPTIONS = [
  "Espanol", "Ingles", "Frances", "Aleman", "Italiano", "Portugues", "Otro",
];

// ── Types ──
interface FormData {
  city: string;
  university: string;
  faculty: string;
  year: string;
  age: string;
  budgetMin: number;
  budgetMax: number;
  zone: string;
  moveDate: string;
  genderPref: string;
  smokingOk: boolean;
  petsOk: boolean;
  sleepTime: number;
  cleanliness: number;
  noiseTolerance: number;
  guestFrequency: number;
  introExtro: number;
  studyPlace: string;
  cooking: number;
  expenseSharing: string;
  partyFrequency: number;
  bio: string;
  hobbies: string[];
  languages: string[];
}

interface CreateLifeProfileProps {
  onComplete: (profile: any) => void;
}

// ── Helpers ──
function formatSleepTime(val: number): string {
  const hour = val > 23 ? val - 24 : val;
  return `${hour.toString().padStart(2, "0")}:00`;
}

function calculateCompleteness(fd: FormData): number {
  let filled = 0;
  const total = 18;
  if (fd.city) filled++;
  if (fd.university) filled++;
  if (fd.faculty) filled++;
  if (fd.year) filled++;
  if (fd.age) filled++;
  if (fd.budgetMin > 0 || fd.budgetMax > 0) filled++;
  if (fd.zone) filled++;
  if (fd.moveDate) filled++;
  if (fd.genderPref) filled++;
  if (fd.bio.length >= 20) filled++;
  if (fd.hobbies.length >= 1) filled++;
  if (fd.languages.length >= 1) filled++;
  // sliders always have a value so count them
  filled += 7; // sleep, cleanliness, noise, guest, introExtro, cooking, party
  if (fd.studyPlace) filled++;
  if (fd.expenseSharing) filled++;
  return Math.round((filled / (total + 2)) * 100);
}

// ── Component ──
const CreateLifeProfile = ({ onComplete }: CreateLifeProfileProps) => {
  const { myProfile, createProfile, updateProfile } = useRoommateProfiles();
  const { user } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    city: "",
    university: "",
    faculty: "",
    year: "",
    age: "",
    budgetMin: 200,
    budgetMax: 600,
    zone: "",
    moveDate: "",
    genderPref: "any",
    smokingOk: false,
    petsOk: false,
    sleepTime: 23,
    cleanliness: 3,
    noiseTolerance: 3,
    guestFrequency: 3,
    introExtro: 3,
    studyPlace: "mixed",
    cooking: 3,
    expenseSharing: "basics",
    partyFrequency: 3,
    bio: "",
    hobbies: [],
    languages: [],
  });

  // Pre-fill from existing Supabase profile
  useEffect(() => {
    if (myProfile) {
      setFormData({
        city: myProfile.city || "",
        university: myProfile.university || "",
        faculty: myProfile.faculty || "",
        year: myProfile.year || "",
        age: myProfile.age ? String(myProfile.age) : "",
        budgetMin: myProfile.budget_min || 200,
        budgetMax: myProfile.budget_max || 600,
        zone: myProfile.preferred_location || "",
        moveDate: myProfile.move_date || "",
        genderPref: myProfile.gender_preference || "any",
        smokingOk: myProfile.smoking_allowed ?? false,
        petsOk: myProfile.pets_allowed ?? false,
        sleepTime: myProfile.sleep_time !== null && myProfile.sleep_time !== undefined
          ? (myProfile.sleep_time < 4 ? myProfile.sleep_time + 24 : myProfile.sleep_time)
          : 23,
        cleanliness: myProfile.cleanliness ?? 3,
        noiseTolerance: myProfile.noise_tolerance ?? 3,
        guestFrequency: myProfile.guest_frequency ?? 3,
        introExtro: myProfile.intro_extro ?? 3,
        studyPlace: myProfile.study_place || "mixed",
        cooking: myProfile.cooking ?? 3,
        expenseSharing: myProfile.expense_sharing || "basics",
        partyFrequency: myProfile.party_frequency ?? 3,
        bio: myProfile.bio || "",
        hobbies: myProfile.hobbies || myProfile.interests || [],
        languages: myProfile.languages || [],
      });
    }
  }, [myProfile]);

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleArrayItem = (key: "hobbies" | "languages", item: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key].includes(item)
        ? prev[key].filter((i) => i !== item)
        : [...prev[key], item],
    }));
  };

  // ── Validation ──
  const isStep1Valid =
    formData.city !== "" &&
    formData.faculty.trim() !== "" &&
    formData.year !== "" &&
    formData.age.trim() !== "";

  const isStep4Valid = formData.bio.length >= 20 && formData.hobbies.length >= 2;

  // ── Submit ──
  const handleSubmit = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const profileData = {
        city: formData.city,
        university: formData.university,
        faculty: formData.faculty,
        year: formData.year,
        age: formData.age ? Number(formData.age) : null,
        bio: formData.bio,
        preferred_location: formData.zone,
        budget_min: formData.budgetMin,
        budget_max: formData.budgetMax,
        move_date: formData.moveDate || null,
        gender_preference: formData.genderPref,
        smoking_allowed: formData.smokingOk,
        pets_allowed: formData.petsOk,
        sleep_time: formData.sleepTime > 23 ? formData.sleepTime - 24 : formData.sleepTime,
        cleanliness: formData.cleanliness,
        noise_tolerance: formData.noiseTolerance,
        guest_frequency: formData.guestFrequency,
        intro_extro: formData.introExtro,
        study_place: formData.studyPlace,
        cooking: formData.cooking,
        expense_sharing: formData.expenseSharing,
        party_frequency: formData.partyFrequency,
        hobbies: formData.hobbies,
        interests: formData.hobbies,
        languages: formData.languages,
        is_active: true,
        profile_completeness: calculateCompleteness(formData),
      };

      if (myProfile) {
        await updateProfile(profileData);
      } else {
        await createProfile(profileData as any);
      }

      localStorage.setItem(LIFE_PROFILE_KEY, JSON.stringify(profileData));
      onComplete(profileData);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setSaving(false);
    }
  };

  // ── Step indicator ──
  const STEPS = [
    { num: 1, label: "Ciudad" },
    { num: 2, label: "Piso ideal" },
    { num: 3, label: "Convivencia" },
    { num: 4, label: "Sobre ti" },
  ];

  const StepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        {STEPS.map((s, i) => (
          <div key={s.num} className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5">
              <div
                className={cn(
                  "w-8 h-8 rounded-full text-sm font-bold flex items-center justify-center transition-colors",
                  step === s.num
                    ? "bg-primary text-white"
                    : step > s.num
                      ? "bg-green-500 text-white"
                      : "bg-muted text-muted-foreground"
                )}
              >
                {step > s.num ? <Check className="w-4 h-4" /> : s.num}
              </div>
              <span
                className={cn(
                  "text-xs font-semibold hidden sm:inline",
                  step === s.num
                    ? "text-primary"
                    : step > s.num
                      ? "text-green-600"
                      : "text-muted-foreground"
                )}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "w-6 sm:w-10 h-px",
                  step > s.num ? "bg-green-500" : "bg-border"
                )}
              />
            )}
          </div>
        ))}
      </div>
      {/* Progress bar */}
      <div className="mt-4 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );

  // ── Navigation buttons ──
  const NavButtons = ({
    canNext = true,
    nextLabel = "Siguiente",
    onNext,
    showBack = true,
    isSubmit = false,
  }: {
    canNext?: boolean;
    nextLabel?: string;
    onNext: () => void;
    showBack?: boolean;
    isSubmit?: boolean;
  }) => (
    <div className="mt-8 space-y-3">
      <Button
        size="lg"
        onClick={onNext}
        disabled={!canNext || saving}
        className="w-full h-14 rounded-2xl font-bold text-base shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50"
      >
        {saving ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Guardando...
          </>
        ) : (
          <>
            {nextLabel}
            {!isSubmit && <ArrowRight className="ml-2 h-5 w-5" />}
          </>
        )}
      </Button>
      {showBack && (
        <Button
          variant="ghost"
          onClick={() => setStep((s) => (s > 1 ? ((s - 1) as any) : s))}
          className="w-full rounded-2xl text-sm"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Anterior
        </Button>
      )}
    </div>
  );

  // ── Slider row helper ──
  const SliderRow = ({
    label,
    description,
    value,
    onChange,
    min = 1,
    max = 5,
    lowLabel,
    highLabel,
    displayValue,
  }: {
    label: string;
    description: string;
    value: number;
    onChange: (v: number) => void;
    min?: number;
    max?: number;
    lowLabel: string;
    highLabel: string;
    displayValue?: string;
  }) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-bold text-foreground">{label}</Label>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <span className="text-sm font-black text-primary bg-primary/10 px-3 py-1 rounded-full min-w-[44px] text-center">
          {displayValue ?? value}
        </span>
      </div>
      <div className="px-1">
        <Slider
          value={[value]}
          min={min}
          max={max}
          step={1}
          onValueChange={(val) => onChange(val[0])}
          className="py-1"
        />
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-muted-foreground/60">{lowLabel}</span>
          <span className="text-[10px] text-muted-foreground/60">{highLabel}</span>
        </div>
      </div>
    </div>
  );

  // ── Bool toggle helper ──
  const BoolToggle = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: boolean;
    onChange: (v: boolean) => void;
  }) => (
    <div className="space-y-2">
      <Label className="text-sm font-bold">{label}</Label>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={cn(
            "flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all",
            value
              ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
              : "bg-muted/30 text-foreground border-border/40 hover:border-primary/30"
          )}
        >
          Si
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={cn(
            "flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all",
            !value
              ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
              : "bg-muted/30 text-foreground border-border/40 hover:border-primary/30"
          )}
        >
          No
        </button>
      </div>
    </div>
  );

  // ─────────────────────────────────────
  //  RENDER
  // ─────────────────────────────────────
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-primary via-blue-500 to-purple-500 flex items-center justify-center shadow-xl shadow-primary/20">
            {step === 1 && <MapPin className="h-9 w-9 text-white" />}
            {step === 2 && <Home className="h-9 w-9 text-white" />}
            {step === 3 && <Users className="h-9 w-9 text-white" />}
            {step === 4 && <GraduationCap className="h-9 w-9 text-white" />}
          </div>
          <h1 className="text-3xl font-black text-foreground mb-2">
            {step === 1 && "Ciudad y estudios"}
            {step === 2 && "Tu piso ideal"}
            {step === 3 && "Estilo de convivencia"}
            {step === 4 && "Sobre ti"}
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
            {step === 1 && "Donde estudias y que haces"}
            {step === 2 && "Que buscas en tu proximo piso"}
            {step === 3 && "Como es tu dia a dia en casa"}
            {step === 4 && "Cuentanos mas para que te conozcan"}
          </p>
        </div>

        <StepIndicator />

        {/* ── Step 1: Ciudad y estudios ── */}
        {step === 1 && (
          <>
            <div className="bg-white rounded-[2rem] shadow-xl shadow-primary/5 border border-border/40 p-8 space-y-5">
              {/* Ciudad */}
              <div className="space-y-2">
                <Label className="text-sm font-bold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  Ciudad *
                </Label>
                <Select value={formData.city} onValueChange={(v) => updateField("city", v)}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Selecciona tu ciudad" />
                  </SelectTrigger>
                  <SelectContent>
                    {CITIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Universidad */}
              <div className="space-y-2">
                <Label className="text-sm font-bold flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-primary" />
                  Universidad
                </Label>
                <Input
                  placeholder="Ej: Universidad de Zaragoza"
                  value={formData.university}
                  onChange={(e) => updateField("university", e.target.value)}
                  className="rounded-xl"
                />
              </div>

              {/* Facultad */}
              <div className="space-y-2">
                <Label className="text-sm font-bold">Que estudias / Facultad *</Label>
                <Input
                  placeholder="Ej: Ingenieria Informatica"
                  value={formData.faculty}
                  onChange={(e) => updateField("faculty", e.target.value)}
                  className="rounded-xl"
                />
              </div>

              {/* Ano + Edad */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-bold">Ano de estudios *</Label>
                  <Select value={formData.year} onValueChange={(v) => updateField("year", v)}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Ano" />
                    </SelectTrigger>
                    <SelectContent>
                      {YEAR_OPTIONS.map((y) => (
                        <SelectItem key={y} value={y}>{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold">Edad *</Label>
                  <Input
                    type="number"
                    placeholder="20"
                    min={16}
                    max={40}
                    value={formData.age}
                    onChange={(e) => updateField("age", e.target.value)}
                    className="rounded-xl"
                  />
                </div>
              </div>
            </div>

            <NavButtons
              canNext={isStep1Valid}
              nextLabel="Siguiente: Tu piso ideal"
              onNext={() => setStep(2)}
              showBack={false}
            />
            {!isStep1Valid && (
              <p className="text-xs text-muted-foreground text-center mt-3">
                Completa ciudad, facultad, ano y edad para continuar
              </p>
            )}
          </>
        )}

        {/* ── Step 2: Tu piso ideal ── */}
        {step === 2 && (
          <>
            <div className="bg-white rounded-[2rem] shadow-xl shadow-primary/5 border border-border/40 p-8 space-y-5">
              {/* Presupuesto */}
              <div className="space-y-2">
                <Label className="text-sm font-bold">Presupuesto mensual (EUR)</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-xs text-muted-foreground">Minimo</span>
                    <Input
                      type="number"
                      min={150}
                      max={1500}
                      value={formData.budgetMin}
                      onChange={(e) => updateField("budgetMin", Number(e.target.value))}
                      className="rounded-xl"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Maximo</span>
                    <Input
                      type="number"
                      min={150}
                      max={1500}
                      value={formData.budgetMax}
                      onChange={(e) => updateField("budgetMax", Number(e.target.value))}
                      className="rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Zona */}
              <div className="space-y-2">
                <Label className="text-sm font-bold">Zona preferida</Label>
                <Input
                  placeholder="Ej: Centro, Delicias, San Jose..."
                  value={formData.zone}
                  onChange={(e) => updateField("zone", e.target.value)}
                  className="rounded-xl"
                />
              </div>

              {/* Fecha mudanza */}
              <div className="space-y-2">
                <Label className="text-sm font-bold">Fecha de mudanza</Label>
                <Input
                  type="date"
                  value={formData.moveDate}
                  onChange={(e) => updateField("moveDate", e.target.value)}
                  className="rounded-xl"
                />
              </div>

              {/* Genero */}
              <div className="space-y-2">
                <Label className="text-sm font-bold">Preferencia genero companero</Label>
                <Select
                  value={formData.genderPref}
                  onValueChange={(v) => updateField("genderPref", v)}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GENDER_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Fumador + Mascotas */}
              <div className="grid grid-cols-2 gap-4">
                <BoolToggle
                  label="Fumador OK?"
                  value={formData.smokingOk}
                  onChange={(v) => updateField("smokingOk", v)}
                />
                <BoolToggle
                  label="Mascotas OK?"
                  value={formData.petsOk}
                  onChange={(v) => updateField("petsOk", v)}
                />
              </div>
            </div>

            <NavButtons
              nextLabel="Siguiente: Convivencia"
              onNext={() => setStep(3)}
            />
          </>
        )}

        {/* ── Step 3: Estilo de convivencia ── */}
        {step === 3 && (
          <>
            <div className="bg-white rounded-[2rem] shadow-xl shadow-primary/5 border border-border/40 p-8 space-y-7">
              {/* Hora de dormir */}
              <SliderRow
                label="Hora de dormir"
                description="A que hora sueles irte a dormir?"
                value={formData.sleepTime}
                onChange={(v) => updateField("sleepTime", v)}
                min={21}
                max={27}
                lowLabel="21:00"
                highLabel="03:00"
                displayValue={formatSleepTime(formData.sleepTime)}
              />

              {/* Limpieza */}
              <SliderRow
                label="Limpieza"
                description="Cual es tu nivel de limpieza?"
                value={formData.cleanliness}
                onChange={(v) => updateField("cleanliness", v)}
                lowLabel="Relajado"
                highLabel="Impecable"
              />

              {/* Ruido */}
              <SliderRow
                label="Ruido tolerable"
                description="Cuanto ruido toleras en casa?"
                value={formData.noiseTolerance}
                onChange={(v) => updateField("noiseTolerance", v)}
                lowLabel="Silencio total"
                highLabel="No me importa"
              />

              {/* Invitados */}
              <SliderRow
                label="Frecuencia de invitados"
                description="Cuantas veces traes gente a casa?"
                value={formData.guestFrequency}
                onChange={(v) => updateField("guestFrequency", v)}
                lowLabel="Nunca"
                highLabel="Constantemente"
              />

              {/* Intro/Extro */}
              <SliderRow
                label="Introversion / Extroversion"
                description="Como te defines socialmente?"
                value={formData.introExtro}
                onChange={(v) => updateField("introExtro", v)}
                lowLabel="Muy introvertido"
                highLabel="Muy extrovertido"
              />

              {/* Donde estudias */}
              <div className="space-y-2">
                <Label className="text-sm font-bold">Donde estudias</Label>
                <Select
                  value={formData.studyPlace}
                  onValueChange={(v) => updateField("studyPlace", v)}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STUDY_PLACE_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Cocinar */}
              <SliderRow
                label="Cocinar"
                description="Con que frecuencia cocinas?"
                value={formData.cooking}
                onChange={(v) => updateField("cooking", v)}
                lowLabel="Nunca cocino"
                highLabel="Chef diario"
              />

              {/* Gastos compartidos */}
              <div className="space-y-2">
                <Label className="text-sm font-bold">Gastos compartidos</Label>
                <Select
                  value={formData.expenseSharing}
                  onValueChange={(v) => updateField("expenseSharing", v)}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPENSE_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Fiestas */}
              <SliderRow
                label="Fiestas"
                description="Con que frecuencia haces o vas a fiestas?"
                value={formData.partyFrequency}
                onChange={(v) => updateField("partyFrequency", v)}
                lowLabel="Nunca"
                highLabel="Cada fin de semana"
              />
            </div>

            <NavButtons
              nextLabel="Siguiente: Sobre ti"
              onNext={() => setStep(4)}
            />
          </>
        )}

        {/* ── Step 4: Sobre ti ── */}
        {step === 4 && (
          <>
            <div className="bg-white rounded-[2rem] shadow-xl shadow-primary/5 border border-border/40 p-8 space-y-6">
              {/* Bio */}
              <div className="space-y-2">
                <Label className="text-sm font-bold">Sobre ti *</Label>
                <Textarea
                  placeholder="Cuentanos algo sobre ti... que tipo de companero/a eres? (min. 20 caracteres)"
                  value={formData.bio}
                  onChange={(e) => updateField("bio", e.target.value)}
                  className="rounded-xl resize-none min-h-[120px]"
                  maxLength={500}
                />
                <p
                  className={cn(
                    "text-[10px] text-right",
                    formData.bio.length < 20
                      ? "text-red-400"
                      : "text-muted-foreground"
                  )}
                >
                  {formData.bio.length}/500
                  {formData.bio.length < 20 && ` (min. 20)`}
                </p>
              </div>

              {/* Hobbies */}
              <div className="space-y-3">
                <Label className="text-sm font-bold">
                  Tus hobbies e intereses *
                  <span className="text-xs font-normal text-muted-foreground ml-1">(min. 2)</span>
                </Label>
                <div className="flex flex-wrap gap-2">
                  {HOBBY_OPTIONS.map((hobby) => (
                    <button
                      key={hobby}
                      type="button"
                      onClick={() => toggleArrayItem("hobbies", hobby)}
                      className={cn(
                        "text-xs font-medium px-3 py-2 rounded-full border transition-all duration-200",
                        formData.hobbies.includes(hobby)
                          ? "bg-primary text-white border-primary shadow-md shadow-primary/20 scale-105"
                          : "bg-muted/30 text-foreground border-border/40 hover:border-primary/30 hover:bg-primary/5"
                      )}
                    >
                      {hobby}
                    </button>
                  ))}
                </div>
                {formData.hobbies.length > 0 && (
                  <p className="text-xs text-primary font-medium">
                    {formData.hobbies.length} seleccionado{formData.hobbies.length !== 1 ? "s" : ""}
                  </p>
                )}
              </div>

              {/* Idiomas */}
              <div className="space-y-3">
                <Label className="text-sm font-bold">Idiomas</Label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => toggleArrayItem("languages", lang)}
                      className={cn(
                        "text-xs font-medium px-3 py-2 rounded-full border transition-all duration-200",
                        formData.languages.includes(lang)
                          ? "bg-primary text-white border-primary shadow-md shadow-primary/20 scale-105"
                          : "bg-muted/30 text-foreground border-border/40 hover:border-primary/30 hover:bg-primary/5"
                      )}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <NavButtons
              canNext={isStep4Valid}
              nextLabel={myProfile ? "Actualizar perfil" : "Guardar y explorar perfiles"}
              onNext={handleSubmit}
              isSubmit
            />
            {!isStep4Valid && (
              <p className="text-xs text-muted-foreground text-center mt-3">
                Escribe al menos 20 caracteres de bio y elige 2+ hobbies
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CreateLifeProfile;
