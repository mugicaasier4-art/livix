
import DOMPurify from 'dompurify';
import { Badge } from "@/components/ui/badge";
import { BarrioSEO } from "@/data/seo/barrios";
import { MapPin, Bus, Euro, GraduationCap } from "lucide-react";

const SANITIZE_CONFIG = {
  ALLOWED_TAGS: ['p', 'strong', 'em', 'ul', 'ol', 'li', 'a', 'h2', 'h3', 'h4', 'br', 'span'],
  ALLOWED_ATTR: ['href', 'title', 'target', 'rel', 'class']
};

interface BarrioContentProps {
    barrio: BarrioSEO;
}

export const BarrioContent = ({ barrio }: BarrioContentProps) => {
    return (
        <div className="mb-10 space-y-8">
            <header>
                <h1 className="text-3xl font-bold mb-4">{barrio.h1}</h1>
                {barrio.longDescription ? (
                    <div
                        className="text-lg text-muted-foreground max-w-3xl prose prose-neutral dark:prose-invert"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(barrio.longDescription, SANITIZE_CONFIG) }}
                    />
                ) : (
                    <p className="text-lg text-muted-foreground">{barrio.introText}</p>
                )}
            </header>

            <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-card border rounded-xl p-4 flex flex-col items-center text-center">
                    <Euro className="h-6 w-6 text-primary mb-2" />
                    <span className="text-sm text-muted-foreground">Precio Medio</span>
                    <span className="font-bold">{barrio.avgPrice}</span>
                </div>
                <div className="bg-card border rounded-xl p-4 flex flex-col items-center text-center">
                    <GraduationCap className="h-6 w-6 text-primary mb-2" />
                    <span className="text-sm text-muted-foreground">Vibe Estudiantil</span>
                    <div className="flex items-center gap-1">
                        <span className="font-bold">{barrio.studentRating}/5</span>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-muted/20 p-6 rounded-xl">
                    <h2 className="flex items-center gap-2 font-semibold mb-3 text-base">
                        <Bus className="h-5 w-5 text-primary" />
                        Transporte
                    </h2>
                    <ul className="space-y-2">
                        {barrio.transport.map((t, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                                {t}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-muted/20 p-6 rounded-xl">
                    <h2 className="flex items-center gap-2 font-semibold mb-3 text-base">
                        <MapPin className="h-5 w-5 text-primary" />
                        Cerca de aquí
                    </h2>
                    <ul className="space-y-2">
                        {barrio.nearbyLandmarks.map((l, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                                {l}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Barrio FAQs */}
            {barrio.faqs && barrio.faqs.length > 0 && (
                <section className="pt-4 border-t">
                    <h2 className="text-xl font-bold mb-4">Preguntas Frecuentes sobre {barrio.name}</h2>
                    <div className="grid gap-4">
                        {barrio.faqs.map((faq, i) => (
                            <div key={i}>
                                <h3 className="font-semibold text-foreground/90 mb-1 text-base">{faq.question}</h3>
                                <p className="text-sm text-muted-foreground">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};
