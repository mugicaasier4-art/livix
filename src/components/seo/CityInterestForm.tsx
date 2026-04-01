import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CityInterestFormProps {
  citySlug: string;
  cityName: string;
}

type UserType = "estudiante" | "propietario";

export const CityInterestForm = ({ citySlug, cityName }: CityInterestFormProps) => {
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState<UserType | "">("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");
  const { toast } = useToast();

  const validateEmail = (value: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");

    if (!validateEmail(email)) {
      setEmailError("Introduce un email valido.");
      return;
    }

    if (!userType) {
      toast({
        title: "Selecciona un tipo de usuario",
        description: "Indica si eres estudiante o propietario.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await (supabase as any)
        .from("city_interest_waitlist")
        .insert({ email, city_slug: citySlug, user_type: userType });

      if (error) throw error;

      setSubmitted(true);
    } catch (err) {
      toast({
        title: "Error al registrarse",
        description: "Algo ha fallado. Intentalo de nuevo en un momento.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-[#5DB4EE]/10 border border-[#5DB4EE]/30 rounded-2xl p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-[#5DB4EE] flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-[#000] mb-2">Listo</h3>
        <p className="text-gray-600">
          Te avisaremos cuando Livix llegue a {cityName}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="city-interest-email" className="text-sm font-medium text-[#000]">
          Email
        </Label>
        <Input
          id="city-interest-email"
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) setEmailError("");
          }}
          required
          disabled={isLoading}
          className="border-gray-200 focus:border-[#5DB4EE] focus:ring-[#5DB4EE]"
        />
        {emailError && (
          <p className="text-sm text-red-500">{emailError}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="city-interest-type" className="text-sm font-medium text-[#000]">
          Soy...
        </Label>
        <Select
          value={userType}
          onValueChange={(value) => setUserType(value as UserType)}
          disabled={isLoading}
        >
          <SelectTrigger
            id="city-interest-type"
            className="border-gray-200 focus:border-[#5DB4EE] focus:ring-[#5DB4EE]"
          >
            <SelectValue placeholder="Selecciona una opcion" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="estudiante">Estudiante</SelectItem>
            <SelectItem value="propietario">Propietario</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#5DB4EE] hover:bg-[#4aa3df] text-white font-semibold py-3 rounded-xl"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            Enviando...
          </span>
        ) : (
          "Avisarme"
        )}
      </Button>
    </form>
  );
};
