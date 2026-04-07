import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CitySEO } from "@/data/seo/cities";
import { CityInterestForm } from "./CityInterestForm";

interface EmptyCityLandingProps {
  cityData: CitySEO;
  citySlug: string;
  pageType: "habitaciones" | "pisos" | "residencias" | "colegios-mayores";
}

const PAGE_LABELS: Record<EmptyCityLandingProps["pageType"], string> = {
  habitaciones: "habitaciones",
  pisos: "pisos",
  residencias: "residencias",
  "colegios-mayores": "colegios mayores",
};

export const EmptyCityLanding = ({
  cityData,
  citySlug,
  pageType,
}: EmptyCityLandingProps) => {
  const pageLabel = PAGE_LABELS[pageType];

  const faqs =
    pageType === "pisos"
      ? cityData.faqsPisos ?? cityData.faqs
      : pageType === "residencias"
      ? cityData.faqsResidencias ?? cityData.faqs
      : pageType === "colegios-mayores"
      ? cityData.faqsColegiosMayores ?? cityData.faqs
      : cityData.faqs;

  return (
    <div className="bg-white min-h-screen font-[Poppins,sans-serif]">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#E8F5FD] to-white py-20 px-4">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <span className="inline-block text-sm font-semibold text-[#5DB4EE] uppercase tracking-widest mb-4">
            Proximamente
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-[#000] mb-4 leading-tight">
            {cityData.name}
          </h1>
          <p className="text-xl text-gray-500 mb-2">
            Proximamente en {cityData.name}
          </p>
          <p className="text-base text-gray-400 max-w-xl mx-auto">
            Estamos trabajando para traer los mejores {pageLabel} para
            estudiantes en {cityData.name}. Se el primero en saberlo.
          </p>
        </div>
      </section>

      {/* City Info Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Universities */}
          <Card className="border border-gray-100 shadow-sm rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
                Universidades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {cityData.universities.map((uni, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-[#5DB4EE] shrink-0" />
                    <span className="text-sm font-medium text-[#000]">{uni}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Average Price */}
          <Card className="border border-gray-100 shadow-sm rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
                Precio medio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-black text-[#5DB4EE]">
                {cityData.avgPrice}
              </p>
              <p className="text-sm text-gray-400 mt-1">por habitacion/mes</p>
            </CardContent>
          </Card>

          {/* Weather */}
          <Card className="border border-gray-100 shadow-sm rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
                Clima
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#000]">{cityData.weather}</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Waitlist Form */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
          <h2 className="text-xl font-bold text-[#000] mb-2 text-center">
            Avisame cuando haya alojamiento en {cityData.name}
          </h2>
          <p className="text-sm text-gray-400 text-center mb-6">
            Sin spam. Solo te escribimos cuando tengamos {pageLabel} disponibles.
          </p>
          <CityInterestForm citySlug={citySlug} cityName={cityData.name} />
        </div>
      </section>

      {/* Cross-links to active cities */}
      <section className="bg-[#F7FBFF] py-12 mt-8">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl font-bold text-[#000] mb-2">
            Mientras tanto, explora Zaragoza
          </h2>
          <p className="text-sm text-gray-400 mb-6 max-w-md mx-auto">
            Zaragoza ya esta en Livix. Mas de 35.000 estudiantes y cientos de
            alojamientos verificados.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/habitaciones/zaragoza">
              <Button
                variant="default"
                size="lg"
                className="bg-[#5DB4EE] hover:bg-[#4aa3df] text-white rounded-xl font-semibold"
              >
                Habitaciones en Zaragoza
              </Button>
            </Link>
            <Link to="/pisos/zaragoza">
              <Button
                variant="outline"
                size="lg"
                className="border-[#5DB4EE] text-[#5DB4EE] hover:bg-[#5DB4EE]/10 rounded-xl font-semibold"
              >
                Pisos en Zaragoza
              </Button>
            </Link>
            <Link to="/residencias/zaragoza">
              <Button
                variant="outline"
                size="lg"
                className="border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl font-semibold"
              >
                Residencias en Zaragoza
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs */}
      {faqs && faqs.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-[#000] mb-6">
              Preguntas frecuentes sobre {pageLabel} en {cityData.name}
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm"
                >
                  <h3 className="font-semibold text-[#000] mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-sm text-gray-500">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
