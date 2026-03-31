// Ciudades disponibles en Livix
// Cada ciudad tiene coordenadas para centrar el mapa, descripción, y metadata

export interface City {
  id: string;           // slug único (ej: "zaragoza")
  name: string;         // nombre display (ej: "Zaragoza")
  region: string;       // comunidad autónoma
  coordinates: {
    lat: number;
    lng: number;
  };
  zoom: number;         // zoom del mapa al centrar en esta ciudad
  universities: string[]; // universidades principales
  description: string;  // descripción corta para el selector
  emoji: string;        // emoji representativo
  available: boolean;   // true = activa, false = "coming soon"
  blogSlug: string;     // categoría en el blog
}

export const CITIES: City[] = [
  {
    id: "zaragoza",
    name: "Zaragoza",
    region: "Aragón",
    coordinates: { lat: 41.6561, lng: -0.8773 },
    zoom: 13,
    universities: ["Universidad de Zaragoza", "Universidad San Jorge"],
    description: "+35.000 estudiantes · Sede central Livix",
    emoji: "🏛️",
    available: true,
    blogSlug: "zaragoza",
  },
  {
    id: "madrid",
    name: "Madrid",
    region: "Comunidad de Madrid",
    coordinates: { lat: 40.4168, lng: -3.7038 },
    zoom: 12,
    universities: ["Universidad Complutense", "UAM", "UC3M", "Rey Juan Carlos"],
    description: "+300.000 estudiantes · Capital",
    emoji: "🏙️",
    available: true,
    blogSlug: "madrid",
  },
  {
    id: "barcelona",
    name: "Barcelona",
    region: "Cataluña",
    coordinates: { lat: 41.3851, lng: 2.1734 },
    zoom: 13,
    universities: ["UB", "UAB", "UPC", "Pompeu Fabra"],
    description: "+250.000 estudiantes · Ciudad condal",
    emoji: "🌊",
    available: true,
    blogSlug: "barcelona",
  },
  {
    id: "sevilla",
    name: "Sevilla",
    region: "Andalucía",
    coordinates: { lat: 37.3891, lng: -5.9845 },
    zoom: 13,
    universities: ["Universidad de Sevilla", "Pablo de Olavide"],
    description: "+70.000 estudiantes · Erasmus top España",
    emoji: "🌸",
    available: true,
    blogSlug: "sevilla",
  },
  {
    id: "valencia",
    name: "Valencia",
    region: "Comunitat Valenciana",
    coordinates: { lat: 39.4699, lng: -0.3763 },
    zoom: 13,
    universities: ["Universitat de València", "UPV", "CEU"],
    description: "+100.000 estudiantes · Ciudad del Turia",
    emoji: "🍊",
    available: true,
    blogSlug: "valencia",
  },
  {
    id: "granada",
    name: "Granada",
    region: "Andalucía",
    coordinates: { lat: 37.1773, lng: -3.5986 },
    zoom: 14,
    universities: ["Universidad de Granada"],
    description: "+55.000 estudiantes · Ciudad universitaria por excelencia",
    emoji: "🍎",
    available: true,
    blogSlug: "granada",
  },
  {
    id: "malaga",
    name: "Málaga",
    region: "Andalucía",
    coordinates: { lat: 36.7213, lng: -4.4214 },
    zoom: 13,
    universities: ["Universidad de Málaga"],
    description: "+40.000 estudiantes · Sol y estudios",
    emoji: "☀️",
    available: true,
    blogSlug: "malaga",
  },
  {
    id: "salamanca",
    name: "Salamanca",
    region: "Castilla y León",
    coordinates: { lat: 40.9701, lng: -5.6635 },
    zoom: 14,
    universities: ["Universidad de Salamanca", "USAL"],
    description: "+30.000 estudiantes · La ciudad universitaria",
    emoji: "📚",
    available: true,
    blogSlug: "salamanca",
  },
  {
    id: "bilbao",
    name: "Bilbao",
    region: "País Vasco",
    coordinates: { lat: 43.263, lng: -2.935 },
    zoom: 13,
    universities: ["UPV/EHU", "Universidad de Deusto"],
    description: "+45.000 estudiantes · Euskadi",
    emoji: "🌁",
    available: true,
    blogSlug: "bilbao",
  },
  {
    id: "pamplona",
    name: "Pamplona",
    region: "Navarra",
    coordinates: { lat: 42.8169, lng: -1.644 },
    zoom: 14,
    universities: ["Universidad de Navarra", "UPNA"],
    description: "+25.000 estudiantes · Ciudad foral",
    emoji: "🐂",
    available: true,
    blogSlug: "pamplona",
  },
  {
    id: "logrono",
    name: "Logroño",
    region: "La Rioja",
    coordinates: { lat: 42.4627, lng: -2.445 },
    zoom: 14,
    universities: ["Universidad de La Rioja"],
    description: "+10.000 estudiantes · Rioja",
    emoji: "🍇",
    available: true,
    blogSlug: "logrono",
  },
  {
    id: "santiago",
    name: "Santiago de Compostela",
    region: "Galicia",
    coordinates: { lat: 42.8782, lng: -8.5448 },
    zoom: 14,
    universities: ["Universidade de Santiago de Compostela"],
    description: "+30.000 estudiantes · Camino y campus",
    emoji: "⭐",
    available: true,
    blogSlug: "santiago",
  },
];

// Ciudad por defecto (Zaragoza — sede central Livix)
export const DEFAULT_CITY_ID = "zaragoza";

// Busca una ciudad por id
export const getCityById = (id: string): City | undefined =>
  CITIES.find(c => c.id === id);

// Normaliza texto para comparación (sin tildes, minúsculas)
const normalize = (text: string) =>
  text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

// Busca una ciudad por nombre (fuzzy, sin tildes)
export const findCityByName = (name: string): City | undefined => {
  const q = normalize(name.trim());
  return CITIES.find(c => normalize(c.name).includes(q) || q.includes(normalize(c.id)));
};
