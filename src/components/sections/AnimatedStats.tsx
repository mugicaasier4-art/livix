import { Card, CardContent } from "@/components/ui/card";
import { AnimatedCounter } from "@/components/ui/AnimatedElements";
import { Home, Users, Clock, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const AnimatedStats = () => {
    const [listingCount, setListingCount] = useState<number>(0);
    const [studentCount, setStudentCount] = useState<number>(0);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [listingsResult, studentsResult] = await Promise.all([
                    supabase.from('listings').select('*', { count: 'exact', head: true }),
                    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
                ]);
                setListingCount(listingsResult.count || 0);
                setStudentCount(studentsResult.count || 0);
            } catch {
                // Fallback to 0 if query fails
            }
        };
        fetchStats();
    }, []);

    const stats = [
        {
            icon: Home,
            value: listingCount || 0,
            suffix: "",
            label: "Pisos publicados en Zaragoza",
            color: "text-primary"
        },
        {
            icon: Users,
            value: studentCount || 0,
            suffix: "",
            label: "Estudiantes registrados",
            color: "text-success"
        },
        {
            icon: Clock,
            value: 24,
            suffix: "h",
            label: "Respuesta media del propietario",
            color: "text-warning"
        },
        {
            icon: Shield,
            value: 100,
            suffix: "%",
            label: "Anuncios revisados manualmente",
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
