import { Card, CardContent } from "@/components/ui/card";
import { AnimatedCounter } from "@/components/ui/AnimatedElements";
import { Home, Users, Star, TrendingUp } from "lucide-react";

const AnimatedStats = () => {
    const stats = [
        {
            icon: Home,
            value: 150,
            suffix: "+",
            label: "Pisos verificados",
            color: "text-primary"
        },
        {
            icon: Users,
            value: 500,
            suffix: "+",
            label: "Estudiantes activos",
            color: "text-success"
        },
        {
            icon: Star,
            value: 97,
            suffix: "%",
            label: "Satisfacción",
            color: "text-warning"
        },
        {
            icon: TrendingUp,
            value: 24,
            suffix: "h",
            label: "Tiempo medio de respuesta",
            color: "text-premium"
        }
    ];

    return (
        <section className="py-12 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {stats.map((stat, index) => (
                        <Card
                            key={index}
                            className="card-premium border-0 bg-background/80 backdrop-blur-sm"
                        >
                            <CardContent className="p-6 text-center">
                                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-3`}>
                                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                </div>
                                <div className="text-3xl font-bold text-foreground mb-1">
                                    <AnimatedCounter
                                        end={stat.value}
                                        suffix={stat.suffix}
                                        duration={1500}
                                    />
                                </div>
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AnimatedStats;
