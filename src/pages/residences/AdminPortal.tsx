import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    TrendingUp, TrendingDown, Users, Search, Eye, MessageCircle,
    BarChart3, PieChart, Target, Zap, Award, MapPin, Euro, Clock,
    Smartphone, Monitor, Globe, GraduationCap, Building2, ArrowRight,
    Check, X, AlertTriangle, Lightbulb, Download, Calendar, Filter,
    ChevronDown, ChevronUp, Star, Heart, Scale, Share2, ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateMockInsights } from '@/data/residenceInsightsMock';

// KPI Card Component
const KPICard = ({
    title,
    value,
    subtitle,
    change,
    icon: Icon,
    highlight = false
}: {
    title: string;
    value: string | number;
    subtitle?: string;
    change?: number;
    icon: any;
    highlight?: boolean;
}) => (
    <Card className={cn(
        "transition-all hover:shadow-md",
        highlight && "ring-2 ring-primary/20 bg-primary/5"
    )}>
        <CardContent className="p-6">
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{title}</p>
                    <p className="text-3xl font-bold">{value}</p>
                    {subtitle && (
                        <p className="text-xs text-muted-foreground">{subtitle}</p>
                    )}
                    {change !== undefined && (
                        <div className={cn(
                            "flex items-center gap-1 text-sm font-medium",
                            change >= 0 ? "text-success" : "text-destructive"
                        )}>
                            {change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                            {change >= 0 ? '+' : ''}{change}% vs mes anterior
                        </div>
                    )}
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                </div>
            </div>
        </CardContent>
    </Card>
);

// Bar Chart Component (simple CSS bars)
const SimpleBarChart = ({
    data,
    valueKey,
    labelKey,
    color = 'bg-primary'
}: {
    data: any[];
    valueKey: string;
    labelKey: string;
    color?: string;
}) => {
    const maxValue = Math.max(...data.map(d => d[valueKey]));

    return (
        <div className="space-y-3">
            {data.map((item, idx) => (
                <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{item[labelKey]}</span>
                        <span className="font-medium">{item[valueKey].toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                            className={cn("h-full rounded-full transition-all", color)}
                            style={{ width: `${(item[valueKey] / maxValue) * 100}%` }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

// Donut Chart Component (CSS)
const SimpleDonutChart = ({
    data,
    valueKey,
    labelKey
}: {
    data: any[];
    valueKey: string;
    labelKey: string;
}) => {
    const colors = ['bg-primary', 'bg-blue-400', 'bg-blue-300', 'bg-blue-200', 'bg-blue-100'];
    const total = data.reduce((sum, item) => sum + item[valueKey], 0);

    return (
        <div className="flex items-center gap-6">
            <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {data.reduce((acc, item, idx) => {
                        const percentage = (item[valueKey] / total) * 100;
                        const previousPercentage = acc.offset;
                        const strokeDasharray = `${percentage} ${100 - percentage}`;
                        const strokeDashoffset = -previousPercentage;

                        acc.elements.push(
                            <circle
                                key={idx}
                                cx="50"
                                cy="50"
                                r="40"
                                fill="none"
                                strokeWidth="12"
                                className={cn(
                                    "transition-all",
                                    idx === 0 ? "stroke-primary" :
                                        idx === 1 ? "stroke-blue-400" :
                                            idx === 2 ? "stroke-blue-300" :
                                                idx === 3 ? "stroke-blue-200" : "stroke-blue-100"
                                )}
                                strokeDasharray={strokeDasharray}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                            />
                        );
                        acc.offset += percentage;
                        return acc;
                    }, { elements: [] as JSX.Element[], offset: 0 }).elements}
                </svg>
            </div>
            <div className="space-y-2">
                {data.slice(0, 5).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                        <div className={cn("w-3 h-3 rounded-full", colors[idx])} />
                        <span className="text-muted-foreground">{item[labelKey]}</span>
                        <span className="font-medium ml-auto">{item[valueKey]}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Funnel Chart Component
const FunnelChart = ({ funnel }: { funnel: any }) => {
    const steps = [
        { label: 'Impresiones', value: funnel.impressions, icon: Eye },
        { label: 'Visitas', value: funnel.views, icon: Search },
        { label: 'Contactos', value: funnel.contacts, icon: MessageCircle },
        { label: 'Solicitudes', value: funnel.applications, icon: Check },
    ];

    const maxValue = steps[0].value;

    return (
        <div className="space-y-4">
            {steps.map((step, idx) => (
                <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <step.icon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{step.label}</span>
                        </div>
                        <span className="font-medium">{step.value.toLocaleString()}</span>
                    </div>
                    <div className="h-8 bg-muted rounded-lg overflow-hidden flex items-center justify-center relative">
                        <div
                            className="absolute left-0 top-0 h-full bg-primary/20 rounded-lg"
                            style={{ width: `${(step.value / maxValue) * 100}%` }}
                        />
                        {idx < steps.length - 1 && (
                            <span className="relative text-xs text-muted-foreground">
                                {((steps[idx + 1].value / step.value) * 100).toFixed(1)}% →
                            </span>
                        )}
                    </div>
                </div>
            ))}
            <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Tasa de conversión total</span>
                    <Badge variant="outline" className="bg-success/10 text-success">
                        {funnel.conversionRate}%
                    </Badge>
                </div>
            </div>
        </div>
    );
};

const ResidencesDashboard = () => {
    const data = generateMockInsights();
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

    const toggleSection = (section: string) => {
        const newSet = new Set(expandedSections);
        if (newSet.has(section)) {
            newSet.delete(section);
        } else {
            newSet.add(section);
        }
        setExpandedSections(newSet);
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                                <Building2 className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">Centro de Datos de Mercado</h1>
                                <p className="text-sm text-muted-foreground">{data.residenceName}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" size="sm" className="gap-2">
                                <Calendar className="h-4 w-4" />
                                Últimos 30 días
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Download className="h-4 w-4" />
                                Exportar
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-8 space-y-8">

                {/* ============================================================ */}
                {/* SECTION 1: KPIs - Always visible at top */}
                {/* ============================================================ */}
                <section>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <KPICard
                            title="Búsquedas en tu zona"
                            value={data.kpis.searchesInZone.value.toLocaleString()}
                            subtitle={data.kpis.searchesInZone.period}
                            change={data.kpis.searchesInZone.change}
                            icon={Search}
                            highlight
                        />
                        <KPICard
                            title="Estudiantes interesados"
                            value={data.kpis.interestedStudents.value}
                            change={data.kpis.interestedStudents.change}
                            icon={Users}
                        />
                        <KPICard
                            title="Tu posición"
                            value={`#${data.kpis.rankingPosition.position}`}
                            subtitle={`de ${data.kpis.rankingPosition.total} residencias`}
                            icon={Award}
                        />
                        <KPICard
                            title="Click-through rate"
                            value={`${data.kpis.clickThroughRate.value}%`}
                            subtitle={`Media del mercado: ${data.kpis.clickThroughRate.marketAvg}%`}
                            icon={Target}
                        />
                    </div>
                </section>

                {/* ============================================================ */}
                {/* SECTION 2: Demand Overview */}
                {/* ============================================================ */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <GraduationCap className="h-5 w-5" />
                                Demanda por Facultad
                            </CardTitle>
                            <CardDescription>
                                De qué carreras vienen los estudiantes que te buscan
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <SimpleBarChart
                                data={data.demandByFaculty}
                                valueKey="searches"
                                labelKey="faculty"
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" />
                                Tendencia Mensual
                            </CardTitle>
                            <CardDescription>
                                Cómo cambia la demanda a lo largo del año
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <SimpleBarChart
                                data={data.demandByMonth}
                                valueKey="searches"
                                labelKey="month"
                                color="bg-blue-500"
                            />
                        </CardContent>
                    </Card>
                </section>

                {/* ============================================================ */}
                {/* SECTION 3: Price Intelligence */}
                {/* ============================================================ */}
                <section>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Euro className="h-5 w-5" />
                                Inteligencia de Precios
                            </CardTitle>
                            <CardDescription>
                                Cómo te posicionas frente a la competencia
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Price positioning */}
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                                <div className="p-4 bg-muted/50 rounded-lg">
                                    <p className="text-2xl font-bold text-primary">€{data.priceComparison.yourPrice}</p>
                                    <p className="text-xs text-muted-foreground">Tu precio</p>
                                </div>
                                <div className="p-4 bg-muted/30 rounded-lg">
                                    <p className="text-2xl font-bold">€{data.priceComparison.marketAvg}</p>
                                    <p className="text-xs text-muted-foreground">Media mercado</p>
                                </div>
                                <div className="p-4 bg-muted/30 rounded-lg">
                                    <p className="text-2xl font-bold">€{data.priceComparison.marketMedian}</p>
                                    <p className="text-xs text-muted-foreground">Mediana</p>
                                </div>
                                <div className="p-4 bg-muted/30 rounded-lg">
                                    <p className="text-2xl font-bold text-success">€{data.priceComparison.cheapest}</p>
                                    <p className="text-xs text-muted-foreground">Más barato</p>
                                </div>
                                <div className="p-4 bg-muted/30 rounded-lg">
                                    <p className="text-2xl font-bold text-destructive">€{data.priceComparison.mostExpensive}</p>
                                    <p className="text-xs text-muted-foreground">Más caro</p>
                                </div>
                            </div>

                            {/* Competitor comparison */}
                            <div className="space-y-3">
                                <h4 className="font-medium">Comparativa con competidores</h4>
                                {data.competitorPrices.map((comp, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                        <span className="text-sm">{comp.name}</span>
                                        <div className="flex items-center gap-4">
                                            <span className="font-medium">€{comp.price}</span>
                                            <Badge variant={comp.difference > 0 ? "destructive" : "secondary"}>
                                                {comp.difference > 0 ? '+' : ''}{comp.difference}€
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* ============================================================ */}
                {/* SECTION 4: Conversion Funnel */}
                {/* ============================================================ */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="h-5 w-5" />
                                Embudo de Conversión
                            </CardTitle>
                            <CardDescription>
                                De impresión a solicitud
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FunnelChart funnel={data.conversionFunnel} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Scale className="h-5 w-5" />
                                Comparaciones
                            </CardTitle>
                            <CardDescription>
                                Contra quién te comparan y cuántas veces ganas
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-success">{data.winsVsLosses.wins}</p>
                                    <p className="text-xs text-muted-foreground">Victorias</p>
                                </div>
                                <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden flex">
                                    <div
                                        className="bg-success h-full"
                                        style={{ width: `${(data.winsVsLosses.wins / (data.winsVsLosses.wins + data.winsVsLosses.losses)) * 100}%` }}
                                    />
                                    <div className="bg-destructive/50 h-full flex-1" />
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-muted-foreground">{data.winsVsLosses.losses}</p>
                                    <p className="text-xs text-muted-foreground">Derrotas</p>
                                </div>
                            </div>

                            <Separator />

                            {data.comparedWith.slice(0, 4).map((comp, idx) => (
                                <div key={idx} className="flex items-center justify-between">
                                    <span className="text-sm">{comp.name}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground">{comp.times} veces</span>
                                        <Badge variant={comp.winRate >= 50 ? "default" : "secondary"}>
                                            {comp.winRate}% wins
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </section>

                {/* ============================================================ */}
                {/* SECTION 5: Audience Insights */}
                {/* ============================================================ */}
                <section>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Perfil de tu Audiencia
                            </CardTitle>
                            <CardDescription>
                                Quiénes son los estudiantes que te buscan
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div>
                                    <h4 className="font-medium mb-3">Edad</h4>
                                    <SimpleDonutChart
                                        data={data.audienceAgeDistribution}
                                        valueKey="percentage"
                                        labelKey="range"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-medium mb-3">Género</h4>
                                    <SimpleDonutChart
                                        data={data.audienceGenderDistribution}
                                        valueKey="percentage"
                                        labelKey="gender"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-medium mb-3">Nacionalidad</h4>
                                    <SimpleBarChart
                                        data={data.audienceNationalityTop.slice(0, 5)}
                                        valueKey="percentage"
                                        labelKey="nationality"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-medium mb-3">Presupuesto</h4>
                                    <SimpleBarChart
                                        data={data.audienceBudgetRanges}
                                        valueKey="percentage"
                                        labelKey="range"
                                        color="bg-success"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* ============================================================ */}
                {/* SECTION 6: Amenities Analysis */}
                {/* ============================================================ */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Zap className="h-5 w-5" />
                                Amenities Más Buscados
                            </CardTitle>
                            <CardDescription>
                                Qué buscan los estudiantes y qué tienes tú
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {data.amenitiesMostSearched.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                                    <div className="flex items-center gap-3">
                                        {item.youHave ? (
                                            <Check className="h-4 w-4 text-success" />
                                        ) : (
                                            <X className="h-4 w-4 text-destructive" />
                                        )}
                                        <span className="text-sm">{item.amenity}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className={cn("h-full rounded-full", item.youHave ? "bg-success" : "bg-destructive")}
                                                style={{ width: `${item.searchPercent}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-muted-foreground w-10">{item.searchPercent}%</span>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="border-amber-200 bg-amber-50/30 dark:bg-amber-950/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-amber-700">
                                <Lightbulb className="h-5 w-5" />
                                Oportunidades de Mejora
                            </CardTitle>
                            <CardDescription>
                                Amenities que no tienes pero tienen alta demanda
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {data.amenitiesGapAnalysis.map((gap, idx) => (
                                <div key={idx} className="p-4 bg-background rounded-lg border">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium">{gap.amenity}</span>
                                        <Badge variant="outline" className="text-amber-700">
                                            {gap.demandPercent}% demanda
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {gap.competitorsWithIt} de tus competidores ya lo tienen
                                    </p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </section>

                {/* ============================================================ */}
                {/* SECTION 7: Student Preferences Deep Dive */}
                {/* ============================================================ */}
                <section>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Heart className="h-5 w-5" />
                                Preferencias de Convivencia
                            </CardTitle>
                            <CardDescription>
                                Cómo son los estudiantes que te buscan
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div>
                                    <h4 className="font-medium mb-3">Orden/Limpieza</h4>
                                    {data.studentProfiles.cleanlinessPreference.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between py-1">
                                            <span className="text-xs text-muted-foreground">{item.level}</span>
                                            <span className="text-xs font-medium">{item.percentage}%</span>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <h4 className="font-medium mb-3">Nivel de Ruido</h4>
                                    {data.studentProfiles.noisePreference.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between py-1">
                                            <span className="text-xs text-muted-foreground">{item.level}</span>
                                            <span className="text-xs font-medium">{item.percentage}%</span>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <h4 className="font-medium mb-3">Perfil Social</h4>
                                    {data.studentProfiles.socialPreference.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between py-1">
                                            <span className="text-xs text-muted-foreground">{item.level}</span>
                                            <span className="text-xs font-medium">{item.percentage}%</span>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <h4 className="font-medium mb-3">Horario Sueño</h4>
                                    {data.studentProfiles.sleepSchedule.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between py-1">
                                            <span className="text-xs text-muted-foreground">{item.type}</span>
                                            <span className="text-xs font-medium">{item.percentage}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* ============================================================ */}
                {/* SECTION 8: Traffic & Devices */}
                {/* ============================================================ */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="h-5 w-5" />
                                Fuentes de Tráfico
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <SimpleBarChart
                                data={data.trafficSources}
                                valueKey="percentage"
                                labelKey="source"
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Smartphone className="h-5 w-5" />
                                Dispositivos
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <SimpleDonutChart
                                data={data.deviceBreakdown}
                                valueKey="percentage"
                                labelKey="device"
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                Engagement
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Tiempo en página</span>
                                <span className="font-medium">{Math.floor(data.avgTimeOnPage / 60)}:{(data.avgTimeOnPage % 60).toString().padStart(2, '0')} min</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Scroll depth</span>
                                <span className="font-medium">{data.scrollDepth}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Click en galería</span>
                                <span className="font-medium">{data.galleryClickRate}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Click en mapa</span>
                                <span className="font-medium">{data.mapClickRate}%</span>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* ============================================================ */}
                {/* SECTION 9: Erasmus Specific */}
                {/* ============================================================ */}
                <section>
                    <Card className="border-blue-200 bg-blue-50/30 dark:bg-blue-950/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-blue-700">
                                <Globe className="h-5 w-5" />
                                Interés Erasmus
                            </CardTitle>
                            <CardDescription>
                                {data.erasmusInterest.percentage}% de tu audiencia son estudiantes Erasmus
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-medium mb-3">Países de origen</h4>
                                    {data.erasmusInterest.topCountries.map((country, idx) => (
                                        <div key={idx} className="flex items-center justify-between py-2">
                                            <span className="text-sm">{country.country}</span>
                                            <Badge variant="outline">{country.students} estudiantes</Badge>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <h4 className="font-medium mb-3">Duración preferida</h4>
                                    {data.erasmusInterest.preferredDuration.map((dur, idx) => (
                                        <div key={idx} className="flex items-center justify-between py-2">
                                            <span className="text-sm">{dur.months}</span>
                                            <span className="font-medium">{dur.percentage}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* ============================================================ */}
                {/* SECTION 10: Competitive Positioning */}
                {/* ============================================================ */}
                <section>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Award className="h-5 w-5" />
                                Tu Posición Competitiva
                            </CardTitle>
                            <CardDescription>
                                Score general: {data.competitiveScore}/100
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-6">
                                <Progress value={data.competitiveScore} className="h-4" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <h4 className="font-medium text-success flex items-center gap-2">
                                        <Check className="h-4 w-4" />
                                        Tus Fortalezas
                                    </h4>
                                    {data.strengthsVsCompetitors.map((strength, idx) => (
                                        <div key={idx} className="flex items-start gap-2 text-sm">
                                            <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                                            <span>{strength}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-3">
                                    <h4 className="font-medium text-amber-600 flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4" />
                                        Áreas de Mejora
                                    </h4>
                                    {data.weaknessesVsCompetitors.map((weakness, idx) => (
                                        <div key={idx} className="flex items-start gap-2 text-sm">
                                            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                                            <span>{weakness}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* ============================================================ */}
                {/* SECTION 11: Search Queries */}
                {/* ============================================================ */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Search className="h-5 w-5" />
                                Búsquedas que Te Encuentran
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {data.searchQueries.map((query, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                                    <code className="text-sm">"{query.query}"</code>
                                    <Badge variant="outline">{query.count}</Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Filter className="h-5 w-5" />
                                Filtros Más Usados
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <SimpleBarChart
                                data={data.filtersUsed}
                                valueKey="percentage"
                                labelKey="filter"
                                color="bg-violet-500"
                            />
                        </CardContent>
                    </Card>
                </section>

                {/* ============================================================ */}
                {/* SECTION 12: Peak Activity */}
                {/* ============================================================ */}
                <section>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Picos de Actividad
                            </CardTitle>
                            <CardDescription>
                                Cuándo hay más búsquedas y solicitudes
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <h4 className="font-medium">Días con más búsquedas</h4>
                                {data.peakSearchDays.map((day, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <span className="font-medium">{day.date}</span>
                                            {day.event && (
                                                <Badge variant="secondary" className="text-xs">
                                                    {day.event}
                                                </Badge>
                                            )}
                                        </div>
                                        <span className="font-bold text-primary">{day.searches} búsquedas</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Footer */}
                <footer className="text-center py-8 text-sm text-muted-foreground">
                    <p>Dashboard exclusivo para partners premium de Livix</p>
                    <p className="mt-1">Datos actualizados en tiempo real</p>
                </footer>

            </main>
        </div>
    );
};

export default ResidencesDashboard;
