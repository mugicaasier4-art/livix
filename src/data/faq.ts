export interface FAQItem {
  id: string;
  category: 'cuenta' | 'busqueda' | 'solicitudes' | 'visitas' | 'pagos' | 'contratos' | 'erasmus' | 'privacidad';
  title_es: string;
  body_es: string;
  title_en: string;
  body_en: string;
  updated_at: string;
}

export const faqCategories = {
  cuenta: { es: 'Cuenta & Acceso', en: 'Account & Access' },
  busqueda: { es: 'Búsqueda de vivienda', en: 'Housing Search' },
  solicitudes: { es: 'Solicitudes & Visitas', en: 'Applications & Visits' },
  visitas: { es: 'Visitas', en: 'Visits' },
  pagos: { es: 'Pagos & Reservas', en: 'Payments & Reservations' },
  contratos: { es: 'Contratos', en: 'Contracts' },
  erasmus: { es: 'Erasmus', en: 'Erasmus' },
  privacidad: { es: 'Privacidad & Datos', en: 'Privacy & Data' }
};

export const faqItems: FAQItem[] = [
  // Cuenta & Acceso
  {
    id: 'account-create',
    category: 'cuenta',
    title_es: '¿Cómo creo una cuenta?',
    body_es: 'Haz clic en "Registrarse", elige si eres estudiante o propietario, completa tus datos y verifica tu email. Es gratis y toma menos de 2 minutos.',
    title_en: 'How do I create an account?',
    body_en: 'Click "Sign up", choose if you\'re a student or landlord, fill in your details and verify your email. It\'s free and takes less than 2 minutes.',
    updated_at: '2024-01-15'
  },
  {
    id: 'account-forgot-password',
    category: 'cuenta',
    title_es: '¿Olvidé mi contraseña?',
    body_es: 'En la página de login, haz clic en "¿Olvidaste tu contraseña?". Te enviaremos un enlace para restablecerla a tu email.',
    title_en: 'I forgot my password',
    body_en: 'On the login page, click "Forgot your password?". We\'ll send you a reset link to your email.',
    updated_at: '2024-01-15'
  },
  
  // Búsqueda de vivienda
  {
    id: 'search-filters',
    category: 'busqueda',
    title_es: '¿Cómo uso los filtros de búsqueda?',
    body_es: 'Usa los filtros para encontrar exactamente lo que buscas: precio, ubicación, tipo de vivienda, amenidades. Los estudiantes Erasmus pueden activar el filtro "Erasmus-friendly".',
    title_en: 'How do I use search filters?',
    body_en: 'Use filters to find exactly what you\'re looking for: price, location, housing type, amenities. Erasmus students can enable the "Erasmus-friendly" filter.',
    updated_at: '2024-01-15'
  },
  {
    id: 'search-erasmus-friendly',
    category: 'busqueda',
    title_es: '¿Qué significa "Erasmus-friendly"?',
    body_es: 'Son alojamientos con contratos flexibles (4-6 meses), gastos incluidos, amueblados y con contrato disponible en inglés.',
    title_en: 'What does "Erasmus-friendly" mean?',
    body_en: 'These are accommodations with flexible contracts (4-6 months), utilities included, furnished, and with contracts available in English.',
    updated_at: '2024-01-15'
  },

  // Solicitudes & Visitas
  {
    id: 'application-process',
    category: 'solicitudes',
    title_es: '¿Cómo funciona el proceso de solicitud?',
    body_es: '1) Encuentra un alojamiento 2) Envía tu solicitud con documentos 3) Espera la respuesta del propietario 4) Si te aprueban, puedes reservar.',
    title_en: 'How does the application process work?',
    body_en: '1) Find accommodation 2) Send your application with documents 3) Wait for landlord response 4) If approved, you can make a reservation.',
    updated_at: '2024-01-15'
  },
  {
    id: 'visit-schedule',
    category: 'visitas',
    title_es: '¿Cómo agendo una visita?',
    body_es: 'Desde el detalle del anuncio, haz clic en "Agendar visita". Puedes elegir entre visita presencial o virtual según lo que ofrezca el propietario.',
    title_en: 'How do I schedule a visit?',
    body_en: 'From the listing detail, click "Schedule visit". You can choose between in-person or virtual visits depending on what the landlord offers.',
    updated_at: '2024-01-15'
  },

  // Pagos & Reservas
  {
    id: 'payment-test-cards',
    category: 'pagos',
    title_es: '¿Qué tarjeta uso en modo prueba?',
    body_es: 'Para pagos de prueba, usa: 4242 4242 4242 4242, cualquier fecha futura y cualquier CVC de 3 dígitos.',
    title_en: 'What card do I use for test payments?',
    body_en: 'For test payments, use: 4242 4242 4242 4242, any future date and any 3-digit CVC.',
    updated_at: '2024-01-15'
  },
  {
    id: 'reservation-deposit',
    category: 'pagos',
    title_es: '¿Cuánto cuesta la reserva?',
    body_es: 'La reserva tiene un costo fijo de €100 que se descuenta del depósito final. Es reembolsable según las condiciones del propietario.',
    title_en: 'How much does the reservation cost?',
    body_en: 'The reservation has a fixed cost of €100 that is deducted from the final deposit. It\'s refundable according to the landlord\'s conditions.',
    updated_at: '2024-01-15'
  },

  // Contratos
  {
    id: 'contract-english',
    category: 'contratos',
    title_es: '¿Puedo tener el contrato en inglés?',
    body_es: 'Sí, los anuncios marcados con "Contrato EN" ofrecen contratos en inglés. También puedes pedirlo al propietario directamente.',
    title_en: 'Can I get the contract in English?',
    body_en: 'Yes, listings marked with "Contract EN" offer contracts in English. You can also request it directly from the landlord.',
    updated_at: '2024-01-15'
  },
  {
    id: 'contract-duration',
    category: 'contratos',
    title_es: '¿Puedo firmar por menos de un año?',
    body_es: 'Muchos propietarios ofrecen contratos por semestre (4-6 meses), especialmente para estudiantes Erasmus. Filtra por "Erasmus-friendly".',
    title_en: 'Can I sign for less than a year?',
    body_en: 'Many landlords offer semester contracts (4-6 months), especially for Erasmus students. Filter by "Erasmus-friendly".',
    updated_at: '2024-01-15'
  },

  // Erasmus
  {
    id: 'erasmus-requirements',
    category: 'erasmus',
    title_es: '¿Qué documentos necesito como estudiante Erasmus?',
    body_es: 'Carta de admisión, seguro médico, pasaporte/DNI, comprobante de ingresos o aval. Consulta nuestra guía completa en /erasmus/guide.',
    title_en: 'What documents do I need as an Erasmus student?',
    body_en: 'Admission letter, health insurance, passport/ID, proof of income or guarantor. Check our complete guide at /erasmus/guide.',
    updated_at: '2024-01-15'
  },
  {
    id: 'erasmus-flexible-exit',
    category: 'erasmus',
    title_es: '¿Puedo irme antes si se cancela mi intercambio?',
    body_es: 'Los contratos Erasmus-friendly incluyen cláusulas de salida flexible por causas académicas justificadas.',
    title_en: 'Can I leave early if my exchange is cancelled?',
    body_en: 'Erasmus-friendly contracts include flexible exit clauses for justified academic reasons.',
    updated_at: '2024-01-15'
  },

  // Privacidad & Datos
  {
    id: 'data-protection',
    category: 'privacidad',
    title_es: '¿Cómo protegen mis datos personales?',
    body_es: 'Cumplimos con GDPR. Solo usamos tus datos para brindarte el servicio. Puedes acceder, modificar o eliminar tus datos en cualquier momento.',
    title_en: 'How do you protect my personal data?',
    body_en: 'We comply with GDPR. We only use your data to provide the service. You can access, modify or delete your data at any time.',
    updated_at: '2024-01-15'
  },
  {
    id: 'data-deletion',
    category: 'privacidad',
    title_es: '¿Cómo elimino mi cuenta y datos?',
    body_es: 'Contactanos a través del centro de ayuda con el tema "Privacidad/GDPR" y procesaremos tu solicitud en 30 días.',
    title_en: 'How do I delete my account and data?',
    body_en: 'Contact us through the help center with the topic "Privacy/GDPR" and we\'ll process your request within 30 days.',
    updated_at: '2024-01-15'
  }
];