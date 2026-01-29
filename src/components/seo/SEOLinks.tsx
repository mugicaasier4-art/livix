
import { Link } from "react-router-dom";
import { cities } from "@/data/seo/cities";
import { barrios } from "@/data/seo/barrios";

export const SEOLinks = () => {
    // Group links by city (currently only Zaragoza, but scalable)
    const stats = {
        cities: Object.keys(cities).length,
        barrios: Object.keys(barrios).length
    };

    return (
        <div className="border-t border-border mt-12 pt-12">
            <div className="container mx-auto px-4">
                <h4 className="font-semibold mb-6 flex items-center gap-2">
                    Explora Livix en Zaragoza
                    <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        {stats.barrios} Barrios
                    </span>
                </h4>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 text-sm">
                    {/* Alquiler General */}
                    <div className="space-y-3">
                        <h5 className="font-medium text-foreground/80">Alojamiento Zaragoza</h5>
                        <ul className="space-y-2">
                            <li><Link to="/residencias/zaragoza" className="text-muted-foreground hover:text-primary">Residencias de Estudiantes</Link></li>
                            <li><Link to="/habitaciones/zaragoza" className="text-muted-foreground hover:text-primary">Habitaciones en Alquiler</Link></li>
                            <li><Link to="/pisos/zaragoza" className="text-muted-foreground hover:text-primary">Pisos Completos</Link></li>
                            <li><Link to="/colegios-mayores/zaragoza" className="text-muted-foreground hover:text-primary">Colegios Mayores</Link></li>
                        </ul>
                    </div>

                    {/* Por Barrios (Habitaciones) */}
                    <div className="space-y-3">
                        <h5 className="font-medium text-foreground/80">Habitaciones por Barrio</h5>
                        <ul className="space-y-2">
                            {Object.values(barrios).slice(0, 5).map(b => (
                                <li key={b.slug}>
                                    <Link to={`/habitaciones/${b.city}/${b.slug}`} className="text-muted-foreground hover:text-primary">
                                        Habitaciones en {b.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Por Barrios (Pisos) */}
                    <div className="space-y-3">
                        <h5 className="font-medium text-foreground/80">Pisos por Barrio</h5>
                        <ul className="space-y-2">
                            {Object.values(barrios).slice(0, 5).map(b => (
                                <li key={b.slug}>
                                    <Link to={`/pisos/${b.city}/${b.slug}`} className="text-muted-foreground hover:text-primary">
                                        Pisos en {b.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
