// Erasmus checklist data with persistent IDs
export interface ChecklistItem {
  id: string;
  label: string;
  description?: string;
}

export interface ChecklistSection {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export const erasmusChecklist: ChecklistSection[] = [
  {
    id: "before_arrival",
    title: "Antes de llegar",
    items: [
      {
        id: "health_insurance",
        label: "Seguro médico listo",
        description: "EHIC + seguro privado adicional recomendado"
      },
      {
        id: "docs_translated", 
        label: "Documentos preparados (ES/EN)",
        description: "Pasaporte, carta admisión, certificado notas, learning agreement"
      },
      {
        id: "book_visits",
        label: "3 visitas online agendadas", 
        description: "Reservar alojamiento temporal o visitas virtuales"
      },
      {
        id: "research_done",
        label: "Investigación de la ciudad completada",
        description: "Barrios, transporte, cultura local básica"
      }
    ]
  },
  {
    id: "first_week",
    title: "Primera semana",
    items: [
      {
        id: "sim_active",
        label: "SIM/eSIM activada",
        description: "Plan español con datos móviles (~15€/mes)"
      },
      {
        id: "transport_card",
        label: "Abono transporte",
        description: "Abono joven <26 años: ~27€/mes"
      },
      {
        id: "padron_appointment",
        label: "Cita empadronamiento",
        description: "Registro como residente en Plaza del Pilar"
      },
      {
        id: "nie_process",
        label: "NIE/TIE iniciado (no-UE)",
        description: "Solo estudiantes no-UE. Proceso 4-6 semanas"
      },
      {
        id: "bank_account",
        label: "Cuenta bancaria o alternativa",
        description: "ING, BBVA, Santander - cuentas gratuitas estudiantes"
      }
    ]
  },
  {
    id: "first_month", 
    title: "Primer mes",
    items: [
      {
        id: "signed_contract",
        label: "Contrato firmado",
        description: "Revisadas cláusulas, duración, fianza, gastos"
      },
      {
        id: "inventory_photos",
        label: "Inventario con fotos",
        description: "Documentar estado inicial del alojamiento"
      },
      {
        id: "university_enrollment",
        label: "Registro universitario completado",
        description: "Matrícula, carnet estudiante, asignaturas confirmadas"
      },
      {
        id: "health_setup",
        label: "Sistema sanitario configurado",
        description: "Médico de cabecera, centro de salud cercano"
      },
      {
        id: "join_esn",
        label: "Unirme a ESN/comunidad",
        description: "ESN events, clubs universitarios, intercambio idiomas"
      }
    ]
  }
];

// Message templates for different scenarios
export const messageTemplates = {
  contact_landlord_es: `¡Hola! Soy {nombre}, estudiante de {universidad/facultad}, Erasmus. Busco del {DD/MM/AAAA} al {DD/MM/AAAA}, presupuesto €{monto}/mes {todo incluido/sin gastos}, {amueblado/no}. ¿Se puede visitar? Puedo: {3 franjas horarias (Europa/Madrid)}. ¡Gracias!

Saludos,
{Tu nombre}`,

  contact_landlord_en: `Hi! I'm {name} from {university/faculty}, Erasmus student. I'm looking {DD/MM/YYYY → DD/MM/YYYY}, budget €{amount}/mo {all-in/excl.}, {furnished/not}. Possible visits: {3 time slots (Europe/Madrid)}. Thanks!

Best regards,
{Your name}`,

  request_english_contract: `Hello, I would like to request the rental contract in English as I am an international student. This would help me understand all terms clearly before signing. Thank you for your understanding.`,

  visit_confirmation_es: `Hola, confirmo la visita para el {día DD/MM} a las {HH:MM}h. ¿La dirección es {dirección completa}? ¿Hay algo específico que deba traer? Gracias.`,

  visit_confirmation_en: `Hello, I confirm the visit for {day DD/MM} at {HH:MM}. Is the address {full address}? Is there anything specific I should bring? Thanks.`
};