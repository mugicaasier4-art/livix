import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllCities, getActiveCities } from "@/data/seo/cityConfig";
import { cities as citySEO } from "@/data/seo/cities";

const Cities = () => {
  const allCities = getAllCities();
  const activeCitySlugs = new Set(getActiveCities().map((c) => c.slug));

  // Active cities first, then coming soon
  const sortedCities = [...allCities].sort((a, b) => {
    if (a.isActive === b.isActive) return 0;
    return a.isActive ? -1 : 1;
  });

  return (
    <Layout>
      <SEOHead
        title="Ciudades Universitarias en España | Livix"
        description="Encuentra alojamiento para estudiantes en las principales ciudades universitarias de España. Zaragoza, Madrid, Barcelona, Valencia y más."
        canonicalUrl="https://livix.es/ciudades"
      />

      <main className="min-h-screen bg-white font-poppins">
        <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-black mb-3">
              Ciudades Universitarias
            </h1>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl">
              Alojamiento para estudiantes en las principales ciudades universitarias de España.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sortedCities.map((city) => {
              const seo = citySEO[city.slug];
              const isActive = activeCitySlugs.has(city.slug);

              return (
                <Link
                  key={city.slug}
                  to={`/habitaciones/${city.slug}`}
                  className="group block"
                >
                  <Card className="h-full border border-gray-200 hover:border-[#5DB4EE] hover:shadow-md transition-all duration-200 bg-white">
                    <CardContent className="p-5">
                      {/* City name + badge */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <h2 className="text-lg font-semibold text-black group-hover:text-[#5DB4EE] transition-colors">
                          {city.name}
                        </h2>
                        {isActive ? (
                          <Badge
                            className="shrink-0 bg-green-100 text-green-700 border-green-200 text-xs font-medium"
                            variant="outline"
                          >
                            Activa
                          </Badge>
                        ) : (
                          <Badge
                            className="shrink-0 bg-gray-100 text-gray-500 border-gray-200 text-xs font-medium"
                            variant="outline"
                          >
                            Próximamente
                          </Badge>
                        )}
                      </div>

                      {/* Universities */}
                      {seo?.universities && seo.universities.length > 0 && (
                        <ul className="mb-3 space-y-0.5">
                          {seo.universities.slice(0, 3).map((uni) => (
                            <li key={uni} className="text-sm text-gray-600 truncate">
                              {uni}
                            </li>
                          ))}
                          {seo.universities.length > 3 && (
                            <li className="text-sm text-gray-400">
                              +{seo.universities.length - 3} más
                            </li>
                          )}
                        </ul>
                      )}

                      {/* Avg price */}
                      {seo?.avgPrice && (
                        <div className="flex items-center gap-1.5 mt-auto pt-2 border-t border-gray-100">
                          <span className="text-xs text-gray-400">Precio medio</span>
                          <span className="text-sm font-semibold text-[#5DB4EE]">
                            {seo.avgPrice}/mes
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Cities;
