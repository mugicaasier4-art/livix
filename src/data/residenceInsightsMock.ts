// Mock data service for the premium residences dashboard
// This simulates the data that would come from the analytics tables

export interface ResidenceInsights {
    // Basic info
    residenceId: string;
    residenceName: string;

    // KPI metrics (top of dashboard)
    kpis: {
        searchesInZone: { value: number; change: number; period: string };
        interestedStudents: { value: number; change: number };
        rankingPosition: { position: number; total: number };
        clickThroughRate: { value: number; marketAvg: number };
    };

    // Demand analysis
    demandByFaculty: { faculty: string; searches: number; percentage: number }[];
    demandByMonth: { month: string; searches: number; applications: number }[];
    demandByDayOfWeek: { day: string; searches: number }[];
    demandByHour: { hour: number; searches: number }[];

    // Price intelligence
    priceComparison: {
        yourPrice: number;
        marketAvg: number;
        marketMedian: number;
        cheapest: number;
        mostExpensive: number;
        percentile: number;
    };
    competitorPrices: { name: string; price: number; difference: number }[];
    priceHistory: { date: string; yourPrice: number; marketAvg: number }[];

    // Audience insights
    audienceAgeDistribution: { range: string; percentage: number }[];
    audienceGenderDistribution: { gender: string; percentage: number }[];
    audienceNationalityTop: { nationality: string; percentage: number }[];
    audienceBudgetRanges: { range: string; percentage: number }[];

    // Amenities analysis
    amenitiesMostSearched: { amenity: string; searchPercent: number; youHave: boolean }[];
    amenitiesGapAnalysis: { amenity: string; demandPercent: number; competitorsWithIt: number }[];

    // Behavior insights
    avgTimeOnPage: number; // seconds
    scrollDepth: number; // percentage
    galleryClickRate: number;
    mapClickRate: number;
    contactClickRate: number;

    // Conversion funnel
    conversionFunnel: {
        impressions: number;
        views: number;
        contacts: number;
        applications: number;
        conversionRate: number;
    };

    // Comparison intel
    timesCompared: number;
    comparedWith: { name: string; times: number; winRate: number }[];
    winsVsLosses: { wins: number; losses: number };

    // Search intent data
    searchQueries: { query: string; count: number }[];
    filtersUsed: { filter: string; percentage: number }[];

    // Student profiles interested
    studentProfiles: {
        cleanlinessPreference: { level: string; percentage: number }[];
        noisePreference: { level: string; percentage: number }[];
        socialPreference: { level: string; percentage: number }[];
        sleepSchedule: { type: string; percentage: number }[];
    };

    // Traffic sources
    trafficSources: { source: string; visits: number; percentage: number }[];

    // Device breakdown
    deviceBreakdown: { device: string; percentage: number }[];

    // Peak activity
    peakSearchDays: { date: string; searches: number; event?: string }[];
    peakApplicationPeriods: { period: string; applications: number }[];

    // Competitive positioning
    competitiveScore: number; // 0-100
    strengthsVsCompetitors: string[];
    weaknessesVsCompetitors: string[];

    // Erasmus specific
    erasmusInterest: {
        percentage: number;
        topCountries: { country: string; students: number }[];
        preferredDuration: { months: string; percentage: number }[];
    };
}

// Generate realistic mock data
export const generateMockInsights = (residenceId: string = 'res-nodis'): ResidenceInsights => {
    return {
        residenceId,
        residenceName: 'Residencia Nodis Zaragoza',

        kpis: {
            searchesInZone: { value: 1247, change: 18, period: 'vs mes anterior' },
            interestedStudents: { value: 342, change: 12 },
            rankingPosition: { position: 3, total: 12 },
            clickThroughRate: { value: 8.4, marketAvg: 5.2 },
        },

        demandByFaculty: [
            { faculty: 'Medicina', searches: 312, percentage: 25 },
            { faculty: 'Ingeniería', searches: 287, percentage: 23 },
            { faculty: 'Derecho', searches: 199, percentage: 16 },
            { faculty: 'Empresariales', searches: 175, percentage: 14 },
            { faculty: 'Ciencias', searches: 137, percentage: 11 },
            { faculty: 'Filosofía y Letras', searches: 87, percentage: 7 },
            { faculty: 'Otros', searches: 50, percentage: 4 },
        ],

        demandByMonth: [
            { month: 'Ene', searches: 420, applications: 28 },
            { month: 'Feb', searches: 580, applications: 45 },
            { month: 'Mar', searches: 390, applications: 22 },
            { month: 'Abr', searches: 310, applications: 18 },
            { month: 'May', searches: 450, applications: 35 },
            { month: 'Jun', searches: 890, applications: 72 },
            { month: 'Jul', searches: 1420, applications: 124 },
            { month: 'Ago', searches: 2100, applications: 189 },
            { month: 'Sep', searches: 1650, applications: 145 },
            { month: 'Oct', searches: 540, applications: 38 },
            { month: 'Nov', searches: 380, applications: 25 },
            { month: 'Dic', searches: 290, applications: 15 },
        ],

        demandByDayOfWeek: [
            { day: 'Lun', searches: 189 },
            { day: 'Mar', searches: 212 },
            { day: 'Mié', searches: 198 },
            { day: 'Jue', searches: 176 },
            { day: 'Vie', searches: 145 },
            { day: 'Sáb', searches: 167 },
            { day: 'Dom', searches: 160 },
        ],

        demandByHour: Array.from({ length: 24 }, (_, hour) => ({
            hour,
            searches: hour >= 9 && hour <= 22
                ? Math.floor(50 + Math.random() * 100 * (hour >= 18 && hour <= 21 ? 2 : 1))
                : Math.floor(10 + Math.random() * 30)
        })),

        priceComparison: {
            yourPrice: 547,
            marketAvg: 485,
            marketMedian: 460,
            cheapest: 320,
            mostExpensive: 890,
            percentile: 72,
        },

        competitorPrices: [
            { name: 'Residencia Universitas', price: 393, difference: -154 },
            { name: 'Colegio Mayor Miraflores', price: 620, difference: 73 },
            { name: 'Residencia Goya', price: 520, difference: -27 },
            { name: 'Campus Living', price: 580, difference: 33 },
            { name: 'Student Factory', price: 450, difference: -97 },
        ],

        priceHistory: Array.from({ length: 12 }, (_, i) => ({
            date: new Date(2024, i, 1).toLocaleDateString('es-ES', { month: 'short' }),
            yourPrice: 547 + Math.floor((Math.random() - 0.5) * 20),
            marketAvg: 475 + Math.floor((Math.random() - 0.5) * 30),
        })),

        audienceAgeDistribution: [
            { range: '17-19', percentage: 28 },
            { range: '20-22', percentage: 42 },
            { range: '23-25', percentage: 22 },
            { range: '26-30', percentage: 6 },
            { range: '30+', percentage: 2 },
        ],

        audienceGenderDistribution: [
            { gender: 'Mujeres', percentage: 54 },
            { gender: 'Hombres', percentage: 44 },
            { gender: 'No especificado', percentage: 2 },
        ],

        audienceNationalityTop: [
            { nationality: 'España', percentage: 68 },
            { nationality: 'Francia', percentage: 8 },
            { nationality: 'Italia', percentage: 6 },
            { nationality: 'Alemania', percentage: 5 },
            { nationality: 'Portugal', percentage: 4 },
            { nationality: 'México', percentage: 3 },
            { nationality: 'Colombia', percentage: 2 },
            { nationality: 'Otros', percentage: 4 },
        ],

        audienceBudgetRanges: [
            { range: '200-300€', percentage: 15 },
            { range: '301-400€', percentage: 28 },
            { range: '401-500€', percentage: 32 },
            { range: '501-600€', percentage: 18 },
            { range: '600+€', percentage: 7 },
        ],

        amenitiesMostSearched: [
            { amenity: 'WiFi incluido', searchPercent: 94, youHave: true },
            { amenity: 'Gimnasio', searchPercent: 78, youHave: true },
            { amenity: 'Lavandería', searchPercent: 72, youHave: true },
            { amenity: 'Cocina', searchPercent: 68, youHave: true },
            { amenity: 'Sala de estudio', searchPercent: 65, youHave: true },
            { amenity: 'Aire acondicionado', searchPercent: 58, youHave: false },
            { amenity: 'Parking', searchPercent: 45, youHave: true },
            { amenity: 'Piscina', searchPercent: 32, youHave: false },
            { amenity: 'Terraza', searchPercent: 28, youHave: true },
            { amenity: 'Cine/Gaming', searchPercent: 22, youHave: false },
        ],

        amenitiesGapAnalysis: [
            { amenity: 'Aire acondicionado', demandPercent: 58, competitorsWithIt: 4 },
            { amenity: 'Piscina', demandPercent: 32, competitorsWithIt: 2 },
            { amenity: 'Sala gaming', demandPercent: 22, competitorsWithIt: 1 },
        ],

        avgTimeOnPage: 127,
        scrollDepth: 72,
        galleryClickRate: 68,
        mapClickRate: 45,
        contactClickRate: 12,

        conversionFunnel: {
            impressions: 4520,
            views: 1247,
            contacts: 156,
            applications: 89,
            conversionRate: 7.1,
        },

        timesCompared: 234,
        comparedWith: [
            { name: 'Residencia Universitas', times: 87, winRate: 62 },
            { name: 'Colegio Mayor Miraflores', times: 65, winRate: 71 },
            { name: 'Campus Living', times: 52, winRate: 54 },
            { name: 'Student Factory', times: 30, winRate: 67 },
        ],
        winsVsLosses: { wins: 148, losses: 86 },

        searchQueries: [
            { query: 'residencia zaragoza', count: 324 },
            { query: 'piso estudiantes medicina', count: 187 },
            { query: 'habitación cerca universidad', count: 156 },
            { query: 'alojamiento erasmus zaragoza', count: 134 },
            { query: 'residencia universitaria gimnasio', count: 98 },
            { query: 'estudio individual zaragoza', count: 76 },
        ],

        filtersUsed: [
            { filter: 'Precio máximo', percentage: 78 },
            { filter: 'Cerca de facultad', percentage: 65 },
            { filter: 'WiFi incluido', percentage: 52 },
            { filter: 'Gastos incluidos', percentage: 48 },
            { filter: 'Verificado', percentage: 42 },
            { filter: 'Habitación individual', percentage: 38 },
        ],

        studentProfiles: {
            cleanlinessPreference: [
                { level: 'Muy ordenado (5)', percentage: 18 },
                { level: 'Ordenado (4)', percentage: 35 },
                { level: 'Normal (3)', percentage: 32 },
                { level: 'Relajado (2)', percentage: 12 },
                { level: 'Muy relajado (1)', percentage: 3 },
            ],
            noisePreference: [
                { level: 'Silencioso', percentage: 42 },
                { level: 'Moderado', percentage: 45 },
                { level: 'Animado', percentage: 13 },
            ],
            socialPreference: [
                { level: 'Introvertido', percentage: 28 },
                { level: 'Ambivertido', percentage: 52 },
                { level: 'Extrovertido', percentage: 20 },
            ],
            sleepSchedule: [
                { type: 'Madrugador', percentage: 22 },
                { type: 'Normal', percentage: 54 },
                { type: 'Noctámbulo', percentage: 24 },
            ],
        },

        trafficSources: [
            { source: 'Google Búsqueda', visits: 456, percentage: 37 },
            { source: 'Directo', visits: 287, percentage: 23 },
            { source: 'Instagram', visits: 198, percentage: 16 },
            { source: 'Recomendación', visits: 156, percentage: 13 },
            { source: 'Facebook', visits: 87, percentage: 7 },
            { source: 'Otros', visits: 63, percentage: 5 },
        ],

        deviceBreakdown: [
            { device: 'Móvil', percentage: 68 },
            { device: 'Escritorio', percentage: 28 },
            { device: 'Tablet', percentage: 4 },
        ],

        peakSearchDays: [
            { date: '15 Ago', searches: 312, event: 'Inicio selectividad' },
            { date: '1 Sep', searches: 287, event: 'Vuelta al cole' },
            { date: '10 Jul', searches: 245, event: 'Fin exámenes' },
            { date: '20 Ago', searches: 234 },
            { date: '5 Sep', searches: 212 },
        ],

        peakApplicationPeriods: [
            { period: 'Julio-Agosto', applications: 313 },
            { period: 'Febrero', applications: 89 },
            { period: 'Junio', applications: 72 },
        ],

        competitiveScore: 78,
        strengthsVsCompetitors: [
            'Mejor ubicación (7 min de UNIZAR)',
            'Gimnasio incluido (solo 4/12 lo tienen)',
            'Valoración más alta (4.8 vs 4.2 media)',
            'Mejor engagement en galería (+23% clicks)',
        ],
        weaknessesVsCompetitors: [
            'Precio 13% sobre la media',
            'Sin aire acondicionado (58% lo busca)',
            'Sin sala gaming (demanda creciente)',
        ],

        erasmusInterest: {
            percentage: 24,
            topCountries: [
                { country: 'Francia', students: 45 },
                { country: 'Italia', students: 38 },
                { country: 'Alemania', students: 32 },
                { country: 'Portugal', students: 21 },
                { country: 'Polonia', students: 18 },
            ],
            preferredDuration: [
                { months: '4-6 meses', percentage: 52 },
                { months: '9-10 meses', percentage: 38 },
                { months: '12 meses', percentage: 10 },
            ],
        },
    };
};

export default generateMockInsights;
