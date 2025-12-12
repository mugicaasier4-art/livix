// Google Maps API Configuration
// Esta es una clave pública (publishable) que es segura para usar en el cliente
// Debe estar restringida por dominio en Google Cloud Console para mayor seguridad

export const GOOGLE_MAPS_CONFIG = {
  // API key de Google Maps: usa .env en cliente (publicable y restringida por dominio)
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || import.meta.env.GOOGLE_MAPS_API_KEY || '',
  
  // Configuración predeterminada del mapa
  defaultCenter: {
    lat: 41.6561,
    lng: -0.8773,
  },
  
  // Estilos modernos estilo Airbnb para el mapa
  mapStyles: [
    {
      featureType: 'all',
      elementType: 'labels',
      stylers: [{ visibility: 'on' }],
    },
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'administrative',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#686868' }],
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#737373' }],
    },
    {
      featureType: 'landscape',
      elementType: 'geometry.fill',
      stylers: [{ color: '#f5f5f5' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#ffffff' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#d6d6d6' }, { weight: 1.5 }],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{ color: '#ffffff' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#b3b3b3' }, { weight: 1.5 }],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#C8E8F5' }],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#6BA5B8' }],
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [{ color: '#D4E7D6' }],
    },
    {
      featureType: 'transit',
      elementType: 'all',
      stylers: [{ visibility: 'off' }],
    },
  ],
};
