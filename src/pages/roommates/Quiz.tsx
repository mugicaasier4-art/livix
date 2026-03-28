import Layout from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import PersonalityQuiz from "@/components/roommates/PersonalityQuiz";
import { useNavigate } from "react-router-dom";

const RoommateQuiz = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <SEOHead
        title="Test de Compatibilidad de Piso | Livix"
        description="Descubre que tipo de companero de piso eres con nuestro test de 8 preguntas. Comparte tu resultado y encuentra tu compi ideal."
        canonical="https://livix.es/roommates/quiz"
      />
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-lg">
          <PersonalityQuiz
            onComplete={(type, scores) => {
              navigate('/roommates/app');
            }}
          />
        </div>
      </div>
    </Layout>
  );
};

export default RoommateQuiz;
