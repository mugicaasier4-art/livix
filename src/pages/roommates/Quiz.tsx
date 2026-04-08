import Layout from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import PersonalityQuiz from "@/components/roommates/PersonalityQuiz";
import { useNavigate, useSearchParams } from "react-router-dom";

const RoommateQuiz = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromOnboarding = searchParams.get('from') === 'onboarding';

  return (
    <Layout>
      <SEOHead
        title="Test de Compatibilidad de Piso | Livix"
        description="Descubre que tipo de companero de piso eres con nuestro test de 8 preguntas. Comparte tu resultado y encuentra tu compi ideal."
        canonical="https://livix.es/roommates/quiz"
      />
      {fromOnboarding && (
        <div className="bg-[#5DB4EE]/10 border-b border-[#5DB4EE]/20 text-center py-2 text-sm text-[#5DB4EE] font-medium">
          Ultimo paso: descubre tu personalidad como companero de piso
        </div>
      )}
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-lg">
          <PersonalityQuiz
            onComplete={(type, scores) => {
              navigate(fromOnboarding ? '/student/dashboard' : '/roommates/app');
            }}
          />
        </div>
      </div>
    </Layout>
  );
};

export default RoommateQuiz;
