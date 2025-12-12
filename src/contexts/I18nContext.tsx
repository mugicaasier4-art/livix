import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'es' | 'en';

interface Translations {
  [key: string]: {
    es: string;
    en: string;
  };
}

const translations: Translations = {
  // Common
  'common.loading': { es: 'Cargando...', en: 'Loading...' },
  'common.error': { es: 'Error', en: 'Error' },
  'common.retry': { es: 'Reintentar', en: 'Retry' },
  'common.cancel': { es: 'Cancelar', en: 'Cancel' },
  'common.apply': { es: 'Aplicar', en: 'Apply' },
  'common.clear': { es: 'Limpiar', en: 'Clear' },
  'common.save': { es: 'Guardar', en: 'Save' },
  'common.share': { es: 'Compartir', en: 'Share' },
  
  // Explore page
  'explore.title': { es: 'Explora alojamientos', en: 'Explore accommodations' },
  'explore.search.placeholder': { es: 'Buscar por ubicación, universidad...', en: 'Search by location, university...' },
  'explore.results': { es: 'alojamientos encontrados', en: 'accommodations found' },
  'explore.load_more': { es: 'Cargar más resultados', en: 'Load more results' },
  'explore.filters': { es: 'Filtros', en: 'Filters' },
  'explore.sort': { es: 'Ordenar', en: 'Sort' },
  'explore.faculty': { es: 'Facultad', en: 'Faculty' },
  'explore.view.list': { es: 'Lista', en: 'List' },
  'explore.view.map': { es: 'Mapa', en: 'Map' },
  'explore.view.swipe': { es: 'Swipe', en: 'Swipe' },
  
  // Filters
  'filters.price_range': { es: 'Rango de precio', en: 'Price range' },
  'filters.erasmus_friendly': { es: 'Erasmus-friendly', en: 'Erasmus-friendly' },
  'filters.all_inclusive': { es: 'Todo incluido', en: 'All inclusive' },
  'filters.furnished': { es: 'Amueblado', en: 'Furnished' },
  'filters.english_contract': { es: 'Contrato en inglés', en: 'English contract' },
  'filters.flexible_deposit': { es: 'Depósito flexible', en: 'Flexible deposit' },
  'filters.verified_only': { es: 'Solo verificados', en: 'Verified only' },
  'filters.duration': { es: 'Duración', en: 'Duration' },
  'filters.roommates': { es: 'Compañeros', en: 'Roommates' },
  'filters.amenities': { es: 'Comodidades', en: 'Amenities' },
  
  // Listing detail
  'listing.back': { es: 'Volver a resultados', en: 'Back to results' },
  'listing.apply': { es: 'Solicitar', en: 'Apply' },
  'listing.schedule_visit': { es: 'Agendar visita', en: 'Schedule visit' },
  'listing.description': { es: 'Descripción', en: 'Description' },
  'listing.details': { es: 'Detalles', en: 'Details' },
  'listing.location': { es: 'Ubicación', en: 'Location' },
  'listing.roommates': { es: 'Compañeros de piso', en: 'Roommates' },
  'listing.requirements': { es: 'Documentación requerida', en: 'Required documentation' },
  'listing.similar': { es: 'Similares', en: 'Similar' },
  
  // Badges
  'badge.erasmus_friendly': { es: 'Erasmus-friendly', en: 'Erasmus-friendly' },
  'badge.all_inclusive': { es: 'Todo incluido', en: 'All inclusive' },
  'badge.furnished': { es: 'Amueblado', en: 'Furnished' },
  'badge.verified': { es: 'Verificado', en: 'Verified' },
  'badge.english_contract': { es: 'Contrato EN', en: 'English contract' },
  
  // Premium
  'premium.title': { es: 'Funciones Premium', en: 'Premium Features' },
  'premium.unlock': { es: 'Desbloquear Premium', en: 'Unlock Premium' },
  'premium.swipe_limit': { es: 'Has alcanzado el límite diario de swipes', en: "You've reached your daily swipe limit" },
  
  // Empty states
  'empty.no_results': { es: 'No se encontraron resultados', en: 'No results found' },
  'empty.try_different': { es: 'Intenta con otros filtros', en: 'Try different filters' },
  'empty.remove_erasmus': { es: 'Quitar filtro Erasmus', en: 'Remove Erasmus filter' },

  // Messages
  'messages.title': { es: 'Mensajes', en: 'Messages' },
  'messages.search_placeholder': { es: 'Buscar conversaciones...', en: 'Search conversations...' },
  'messages.empty_title': { es: 'Sin conversaciones', en: 'No conversations' },
  'messages.empty_description': { es: 'No encontramos conversaciones. Prueba escribir desde un anuncio.', en: 'No conversations found. Try messaging from a listing.' },
  'messages.typing': { es: 'está escribiendo...', en: 'is typing...' },
  'messages.seen': { es: 'Visto', en: 'Seen' },
  'messages.sent': { es: 'Enviado', en: 'Sent' },
  'messages.sending': { es: 'Enviando...', en: 'Sending...' },
  'messages.attach': { es: 'Adjuntar', en: 'Attach' },
  'messages.templates': { es: 'Plantillas', en: 'Templates' },
  'messages.schedule_visit': { es: 'Agendar visita', en: 'Schedule visit' },
  'messages.view_application': { es: 'Ver solicitud', en: 'View application' },
  'messages.request_docs': { es: 'Pedir documentos', en: 'Request documents' },
  'messages.archive': { es: 'Archivar', en: 'Archive' },
  'messages.mute': { es: 'Silenciar', en: 'Mute' },
  'messages.report': { es: 'Reportar', en: 'Report' },
  'messages.view_listing': { es: 'Ver anuncio', en: 'View listing' },
  'messages.char_count': { es: 'caracteres restantes', en: 'characters remaining' },

  // Support
  'support.title': { es: '¿En qué podemos ayudarte?', en: 'How can we help you?' },
  'support.search_placeholder': { es: 'Buscar: depósito, contrato, Erasmus...', en: 'Search: deposit, contract, Erasmus...' },
  'support.no_results': { es: 'No encontramos resultados. Prueba otra palabra.', en: 'No results found. Try another word.' },
  'support.no_faqs': { es: 'No hay preguntas disponibles.', en: 'No FAQs available.' },
  'support.contact_us': { es: 'Contactanos', en: 'Contact us' },
  'support.still_need_help': { es: '¿Sigue tu duda?', en: 'Still need help?' },
  'support.contact_title': { es: '¿No encontraste lo que buscabas?', en: "Didn't find what you were looking for?" },
  'support.contact_description': { es: 'Nuestro equipo está aquí para ayudarte', en: 'Our team is here to help you' },
  'support.open_ticket': { es: 'Abrir un ticket', en: 'Open a ticket' },
  'support.email_us': { es: 'Escribirnos por correo', en: 'Email us' },
  'support.erasmus_guide': { es: 'Guía Erasmus', en: 'Erasmus Guide' },
  'support.submit_title': { es: 'Crear ticket de soporte', en: 'Create support ticket' },
  'support.submit_description': { es: 'Cuéntanos tu consulta y te ayudaremos en 24-48h', en: 'Tell us your question and we\'ll help you in 24-48h' },
  'support.success_title': { es: '¡Recibimos tu consulta!', en: 'We received your inquiry!' },
  'support.success_description': { es: 'Te vamos a responder en 24-48h (hábiles, Europe/Madrid)', en: 'We\'ll respond within 24-48h (business hours, Europe/Madrid)' },
  'support.what_next': { es: '¿Qué sigue?', en: 'What\'s next?' },
  'support.back_to_help': { es: 'Volver al Centro de ayuda', en: 'Back to Help Center' },
  'support.categories.account': { es: 'Cuenta & Acceso', en: 'Account & Access' },
  'support.categories.search': { es: 'Búsqueda de vivienda', en: 'Housing search' },
  'support.categories.applications': { es: 'Solicitudes & Visitas', en: 'Applications & Visits' },
  'support.categories.payments': { es: 'Pagos & Reservas', en: 'Payments & Bookings' },
  'support.categories.contracts': { es: 'Contratos', en: 'Contracts' },
  'support.categories.erasmus': { es: 'Erasmus', en: 'Erasmus' },
  'support.categories.landlords': { es: 'Propietarios/Inmobiliarias', en: 'Landlords/Agencies' },
  'support.categories.privacy': { es: 'Privacidad & Datos (GDPR)', en: 'Privacy & Data (GDPR)' },
  'support.empty': { es: 'No encontramos resultados para tu búsqueda.', en: 'No results found for your search.' },
  'support.empty.suggest': { es: 'Prueba con otras palabras clave o consulta nuestras categorías.', en: 'Try different keywords or browse our categories.' },

  // Cookies
  'cookies.banner_title': { es: 'Usamos cookies', en: 'We use cookies' },
  'cookies.banner_description': { es: 'Usamos cookies para mejorar tu experiencia. Puedes aceptarlas o elegir tus preferencias.', en: 'We use cookies to improve your experience. You can accept them or choose your preferences.' },
  'cookies.accept_all': { es: 'Aceptar todas', en: 'Accept all' },
  'cookies.reject_all': { es: 'Rechazar todas', en: 'Reject all' },
  'cookies.configure': { es: 'Configurar', en: 'Configure' },
  'cookies.learn_more': { es: 'Más info', en: 'Learn more' },
  'cookies.settings_title': { es: 'Configuración de cookies', en: 'Cookie settings' },
  'cookies.essential_title': { es: 'Cookies esenciales', en: 'Essential cookies' },
  'cookies.essential_desc': { es: 'Necesarias para el funcionamiento básico del sitio', en: 'Necessary for basic site functionality' },
  'cookies.analytics_title': { es: 'Cookies analíticas', en: 'Analytics cookies' },
  'cookies.analytics_desc': { es: 'Nos ayudan a entender cómo usas el sitio', en: 'Help us understand how you use the site' },
  'cookies.marketing_title': { es: 'Cookies de marketing', en: 'Marketing cookies' },
  'cookies.marketing_desc': { es: 'Usadas para personalizar anuncios y contenido', en: 'Used to personalize ads and content' },
  'cookies.save_preferences': { es: 'Guardar preferencias', en: 'Save preferences' },
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('es');

  useEffect(() => {
    // Detect browser language
    const browserLang = navigator.language.toLowerCase();
    const detectedLang = browserLang.startsWith('en') ? 'en' : 'es';
    
    // Check localStorage for saved preference
    const savedLang = localStorage.getItem('campus-room-lang') as Language;
    
    setLanguage(savedLang || detectedLang);
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('campus-room-lang', lang);
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[language] || translation.es || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
};