export interface CityConfig {
  slug: string;
  name: string;
  isActive: boolean;
  mapCenter: { lat: number; lng: number };
  defaultZoom: number;
  studentPopulation: number;
}

export const cityConfigs: Record<string, CityConfig> = {
  zaragoza: {
    slug: "zaragoza",
    name: "Zaragoza",
    isActive: true,
    mapCenter: { lat: 41.6561, lng: -0.8773 },
    defaultZoom: 13,
    studentPopulation: 35000,
  },
  madrid: {
    slug: "madrid",
    name: "Madrid",
    isActive: false,
    mapCenter: { lat: 40.4168, lng: -3.7038 },
    defaultZoom: 12,
    studentPopulation: 300000,
  },
  barcelona: {
    slug: "barcelona",
    name: "Barcelona",
    isActive: false,
    mapCenter: { lat: 41.3874, lng: 2.1686 },
    defaultZoom: 12,
    studentPopulation: 220000,
  },
  valencia: {
    slug: "valencia",
    name: "Valencia",
    isActive: false,
    mapCenter: { lat: 39.4699, lng: -0.3763 },
    defaultZoom: 13,
    studentPopulation: 90000,
  },
  sevilla: {
    slug: "sevilla",
    name: "Sevilla",
    isActive: false,
    mapCenter: { lat: 37.3891, lng: -5.9845 },
    defaultZoom: 13,
    studentPopulation: 75000,
  },
  granada: {
    slug: "granada",
    name: "Granada",
    isActive: false,
    mapCenter: { lat: 37.1773, lng: -3.5986 },
    defaultZoom: 14,
    studentPopulation: 60000,
  },
  salamanca: {
    slug: "salamanca",
    name: "Salamanca",
    isActive: false,
    mapCenter: { lat: 40.9701, lng: -5.6635 },
    defaultZoom: 14,
    studentPopulation: 30000,
  },
  "santiago-de-compostela": {
    slug: "santiago-de-compostela",
    name: "Santiago de Compostela",
    isActive: false,
    mapCenter: { lat: 42.8782, lng: -8.5448 },
    defaultZoom: 14,
    studentPopulation: 25000,
  },
  malaga: {
    slug: "malaga",
    name: "Malaga",
    isActive: false,
    mapCenter: { lat: 36.7213, lng: -4.4214 },
    defaultZoom: 13,
    studentPopulation: 40000,
  },
  bilbao: {
    slug: "bilbao",
    name: "Bilbao",
    isActive: false,
    mapCenter: { lat: 43.2630, lng: -2.9350 },
    defaultZoom: 13,
    studentPopulation: 45000,
  },
  pamplona: {
    slug: "pamplona",
    name: "Pamplona",
    isActive: false,
    mapCenter: { lat: 42.8125, lng: -1.6458 },
    defaultZoom: 14,
    studentPopulation: 20000,
  },
  logrono: {
    slug: "logrono",
    name: "Logrono",
    isActive: false,
    mapCenter: { lat: 42.4627, lng: -2.4445 },
    defaultZoom: 14,
    studentPopulation: 8000,
  },
};

export const getActiveCities = (): CityConfig[] =>
  Object.values(cityConfigs).filter((c) => c.isActive);

export const getAllCities = (): CityConfig[] => Object.values(cityConfigs);

export const getCityConfig = (slug: string): CityConfig | undefined =>
  cityConfigs[slug];
