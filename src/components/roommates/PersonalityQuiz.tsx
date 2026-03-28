import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Leaf, Users, Eye, UtensilsCrossed, Moon, Scale, ArrowLeft, ArrowRight } from "lucide-react";
import ShareButtons from "./ShareButtons";

// --- Types & Constants ---

type ArchetypeKey = "zen" | "social" | "ghost" | "chef" | "owl" | "balanced";
type Dimension = "order" | "social" | "independence" | "night" | "cooking";

const ARCHETYPES: Record<ArchetypeKey, { name: string; description: string; color: string; icon: string }> = {
  zen: { name: "El Zen", description: "Orden, silencio, rutina. Tu piso es un templo.", color: "#10B981", icon: "Leaf" },
  social: { name: "El Social", description: "Puertas abiertas, cenas grupales, la vida es una fiesta.", color: "#F59E0B", icon: "Users" },
  ghost: { name: "El Fantasma", description: "Existes pero nadie te ve. Perfil bajo, maxima independencia.", color: "#6366F1", icon: "Eye" },
  chef: { name: "El Cocinitas", description: "El frigo es tu canvas. Bonus si tu compi tambien cocina.", color: "#EF4444", icon: "UtensilsCrossed" },
  owl: { name: "El Buho", description: "Vives de noche. Netflix a las 3am es tu prime time.", color: "#8B5CF6", icon: "Moon" },
  balanced: { name: "El Equilibrado", description: "Un poco de todo. Flexible y adaptable.", color: "#5DB4EE", icon: "Scale" },
};

const ICON_MAP: Record<string, React.ElementType> = {
  Leaf, Users, Eye, UtensilsCrossed, Moon, Scale,
};

interface QuizOption {
  label: string;
  scores: Partial<Record<Dimension, number>>;
}

interface QuizQuestion {
  id: number;
  question: string;
  type: "cards" | "slider";
  options?: QuizOption[];
  sliderConfig?: {
    min: number;
    max: number;
    step: number;
    labels: string[];
    dimension: Dimension;
    mapValue: (val: number) => Partial<Record<Dimension, number>>;
  };
}

const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Es viernes por la noche, que haces?",
    type: "cards",
    options: [
      { label: "Cena tranquila y peli en casa", scores: { order: 2, independence: 1 } },
      { label: "Preparar cena para los compis", scores: { social: 2, cooking: 1 } },
      { label: "Salir de fiesta hasta las tantas", scores: { social: 2, night: 2 } },
      { label: "En mi cuarto con cascos, mi mundo", scores: { independence: 2, order: 1 } },
    ],
  },
  {
    id: 2,
    question: "Tu nivel de orden...",
    type: "slider",
    sliderConfig: {
      min: 1,
      max: 5,
      step: 1,
      labels: ["Caos total", "Algo desordenado", "Normal", "Bastante ordenado", "Marie Kondo"],
      dimension: "order",
      mapValue: (val: number) => ({ order: val }),
    },
  },
  {
    id: 3,
    question: "Invitados en casa...",
    type: "cards",
    options: [
      { label: "Cuantos mas mejor, puertas abiertas!", scores: { social: 3 } },
      { label: "De vez en cuando, con aviso previo", scores: { social: 1, order: 1 } },
      { label: "Prefiero que no vengan, es mi espacio", scores: { independence: 2, order: 1 } },
    ],
  },
  {
    id: 4,
    question: "A que hora te duermes?",
    type: "slider",
    sliderConfig: {
      min: 0,
      max: 5,
      step: 1,
      labels: ["22:00", "23:00", "00:00", "01:00", "02:00", "03:00"],
      dimension: "night",
      mapValue: (val: number) => ({ night: val }),
    },
  },
  {
    id: 5,
    question: "Cocinar es...",
    type: "cards",
    options: [
      { label: "Mi hobby favorito, cocino para todos", scores: { cooking: 3, social: 1 } },
      { label: "Me apaño, pero no es lo mio", scores: { cooking: 1 } },
      { label: "Deliveroo y listo, siguiente pregunta", scores: { independence: 1 } },
    ],
  },
  {
    id: 6,
    question: "En examenes necesito...",
    type: "cards",
    options: [
      { label: "Silencio absoluto, ni una mosca", scores: { order: 2, independence: 1 } },
      { label: "Estudiar en grupo mola mas", scores: { social: 2 } },
      { label: "Me da igual, me concentro con ruido", scores: { independence: 1 } },
    ],
  },
  {
    id: 7,
    question: "Compartir comida del frigo?",
    type: "cards",
    options: [
      { label: "Lo mio es de todos y viceversa", scores: { social: 2, cooking: 1 } },
      { label: "Cada uno su estante, respeto mutuo", scores: { order: 2 } },
      { label: "Me da igual mientras no toquen mi chocolate", scores: { independence: 1 } },
    ],
  },
  {
    id: 8,
    question: "Musica en casa?",
    type: "cards",
    options: [
      { label: "Altavoz en el salon, vibe de fondo siempre", scores: { social: 2, night: 1 } },
      { label: "Con cascos, no molesto ni me molestan", scores: { independence: 2 } },
      { label: "Prefiero silencio, me relaja", scores: { order: 2 } },
    ],
  },
];

// --- Archetype calculation ---

function computeArchetype(scores: Record<Dimension, number>): ArchetypeKey {
  const { order, social, independence, night, cooking } = scores;

  if (order >= 8 && social <= 4 && independence >= 3) return "zen";
  if (social >= 8) return "social";
  if (independence >= 7 && social <= 3) return "ghost";
  if (cooking >= 5) return "chef";
  if (night >= 7) return "owl";
  return "balanced";
}

// --- Component ---

interface PersonalityQuizProps {
  onComplete?: (type: string, scores: Record<string, number>) => void;
}

const PersonalityQuiz = ({ onComplete }: PersonalityQuizProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, Partial<Record<Dimension, number>>>>({});
  const [sliderValues, setSliderValues] = useState<Record<number, number>>({});
  const [result, setResult] = useState<ArchetypeKey | null>(null);
  const [transitioning, setTransitioning] = useState(false);

  const totalSteps = QUESTIONS.length;
  const question = QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const transitionTo = useCallback((action: () => void) => {
    setTransitioning(true);
    setTimeout(() => {
      action();
      setTransitioning(false);
    }, 200);
  }, []);

  const handleCardSelect = (questionId: number, option: QuizOption) => {
    const newAnswers = { ...answers, [questionId]: option.scores };
    setAnswers(newAnswers);

    // Auto-advance after short delay
    setTimeout(() => {
      if (currentStep < totalSteps - 1) {
        transitionTo(() => setCurrentStep((s) => s + 1));
      } else {
        finishQuiz(newAnswers);
      }
    }, 300);
  };

  const handleSliderConfirm = () => {
    const config = question.sliderConfig!;
    const val = sliderValues[question.id] ?? config.min;
    const newAnswers = { ...answers, [question.id]: config.mapValue(val) };
    setAnswers(newAnswers);

    if (currentStep < totalSteps - 1) {
      transitionTo(() => setCurrentStep((s) => s + 1));
    } else {
      finishQuiz(newAnswers);
    }
  };

  const finishQuiz = (allAnswers: Record<number, Partial<Record<Dimension, number>>>) => {
    const totals: Record<Dimension, number> = { order: 0, social: 0, independence: 0, night: 0, cooking: 0 };
    Object.values(allAnswers).forEach((scores) => {
      (Object.entries(scores) as [Dimension, number][]).forEach(([dim, val]) => {
        totals[dim] += val;
      });
    });

    const archetype = computeArchetype(totals);
    setResult(archetype);
    onComplete?.(archetype, totals);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      transitionTo(() => setCurrentStep((s) => s - 1));
    }
  };

  // --- Result Screen ---
  if (result) {
    const arch = ARCHETYPES[result];
    const IconComp = ICON_MAP[arch.icon] || Scale;
    const shareUrl = typeof window !== "undefined"
      ? `${window.location.origin}/roommates/quiz?result=${result}`
      : "";
    const shareText = `Soy "${arch.name}" segun el test de compis de Livix! Descubre que tipo de compi de piso eres:`;

    return (
      <div className="max-w-md mx-auto px-4 py-8 flex flex-col items-center text-center gap-6">
        <div
          className="w-28 h-28 rounded-full flex items-center justify-center"
          style={{ backgroundColor: arch.color + "20" }}
        >
          <IconComp className="w-14 h-14" style={{ color: arch.color }} />
        </div>

        <div>
          <h2 className="text-3xl font-bold" style={{ color: arch.color }}>
            {arch.name}
          </h2>
          <p className="text-gray-600 mt-2 text-lg">{arch.description}</p>
        </div>

        <ShareButtons
          title={`Soy ${arch.name} - Test Livix`}
          text={shareText}
          url={shareUrl}
        />

        <Button
          className="w-full bg-[#5DB4EE] hover:bg-[#4a9fd8] text-white font-semibold mt-2"
          size="lg"
          onClick={() => {
            if (onComplete) return; // Already called
            window.location.href = "/roommates/app";
          }}
        >
          Crear perfil en Livix
        </Button>

        <button
          onClick={() => {
            setResult(null);
            setCurrentStep(0);
            setAnswers({});
            setSliderValues({});
          }}
          className="text-sm text-gray-400 hover:text-gray-600 underline"
        >
          Repetir test
        </button>
      </div>
    );
  }

  // --- Quiz Screen ---
  return (
    <div className="max-w-md mx-auto px-4 py-6">
      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-100 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-[#5DB4EE] rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question */}
      <div
        className={`transition-all duration-200 ${
          transitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
        }`}
      >
        <p className="text-sm text-gray-400 mb-1 font-medium">
          {currentStep + 1} / {totalSteps}
        </p>
        <h2 className="text-xl font-bold text-black mb-6">{question.question}</h2>

        {/* Card options */}
        {question.type === "cards" && question.options && (
          <div className="flex flex-col gap-3">
            {question.options.map((option, idx) => {
              const isSelected =
                answers[question.id] &&
                JSON.stringify(answers[question.id]) === JSON.stringify(option.scores);
              return (
                <Card
                  key={idx}
                  className={`p-4 cursor-pointer transition-all duration-200 border-2 active:scale-[0.98] ${
                    isSelected
                      ? "border-[#5DB4EE] bg-[#5DB4EE]/5 shadow-md"
                      : "border-gray-200 hover:border-[#5DB4EE]/50 hover:shadow-sm"
                  }`}
                  onClick={() => handleCardSelect(question.id, option)}
                >
                  <p className="text-base font-medium text-black">{option.label}</p>
                </Card>
              );
            })}
          </div>
        )}

        {/* Slider */}
        {question.type === "slider" && question.sliderConfig && (
          <div className="space-y-6">
            <Slider
              min={question.sliderConfig.min}
              max={question.sliderConfig.max}
              step={question.sliderConfig.step}
              value={[sliderValues[question.id] ?? Math.floor((question.sliderConfig.min + question.sliderConfig.max) / 2)]}
              onValueChange={(val) =>
                setSliderValues((prev) => ({ ...prev, [question.id]: val[0] }))
              }
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{question.sliderConfig.labels[0]}</span>
              <span>{question.sliderConfig.labels[question.sliderConfig.labels.length - 1]}</span>
            </div>
            <p className="text-center text-lg font-semibold text-[#5DB4EE]">
              {question.sliderConfig.labels[
                (sliderValues[question.id] ?? Math.floor((question.sliderConfig.min + question.sliderConfig.max) / 2)) -
                  question.sliderConfig.min
              ]}
            </p>
            <Button
              className="w-full bg-[#5DB4EE] hover:bg-[#4a9fd8] text-white font-semibold"
              size="lg"
              onClick={handleSliderConfirm}
            >
              Siguiente
            </Button>
          </div>
        )}
      </div>

      {/* Navigation */}
      {currentStep > 0 && (
        <button
          onClick={handleBack}
          className="mt-6 flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600"
        >
          <ArrowLeft className="w-4 h-4" />
          Atras
        </button>
      )}
    </div>
  );
};

export default PersonalityQuiz;
