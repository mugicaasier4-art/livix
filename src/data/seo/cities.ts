export interface CitySEO {
    slug: string;
    name: string;
    title: string;
    metaDescription: string;
    h1: string;
    introText: string;
    longDescription: string;
    universities: string[];
    avgPrice: string;
    weather: string;
    faqs: { question: string; answer: string }[];
    faqsPisos?: { question: string; answer: string }[];
    faqsResidencias?: { question: string; answer: string }[];
    faqsColegiosMayores?: { question: string; answer: string }[];
}

export const cities: Record<string, CitySEO> = {
    zaragoza: {
        slug: "zaragoza",
        name: "Zaragoza",
        title: "Alquiler de Habitaciones y Pisos para Estudiantes en Zaragoza | Livix",
        metaDescription: "Encuentra tu alojamiento ideal en Zaragoza. Pisos compartidos, residencias y habitaciones cerca de la Universidad de Zaragoza y Universidad San Jorge. ✓ 100% Online",
        h1: "Alojamiento para Estudiantes en Zaragoza",
        introText: "Zaragoza es una de las mejores ciudades universitarias de España. Con más de 30.000 estudiantes, ofrece un ambiente vibrante, precios asequibles y una excelente calidad de vida.",
        universities: [
            "Universidad de Zaragoza (Unizar)",
            "Universidad San Jorge (USJ)"
        ],
        avgPrice: "300-450€",
        weather: "Inviernos fríos y ventosos (Cierzo), veranos calurosos.",
        longDescription: `
            <p>Zaragoza se ha consolidado como uno de los destinos universitarios más atractivos de España. Su ubicación estratégica entre Madrid y Barcelona, sumada a un coste de vida asequible, atrae cada año a miles de estudiantes nacionales e internacionales.</p>
            
            <h3>¿Por qué elegir Zaragoza para estudiar?</h3>
            <p>La capital aragonesa ofrece el equilibrio perfecto: es lo suficientemente grande para tener de todo (cultura, ocio nocturno, grandes eventos) pero lo suficientemente manejable para ir andando o en bici a casi todas partes. La red de tranvía y autobuses conecta eficientemente el Campus San Francisco, el Campus Río Ebro y el centro de la ciudad.</p>
            
            <h3>Alojamiento Universitario: ¿Piso o Residencia?</h3>
            <p>La oferta es variada. Las <strong>residencias universitarias</strong> en Zaragoza suelen incluir pensión completa y limpieza, ideal para el primer año. Sin embargo, la opción más popular sigue siendo <strong>compartir piso</strong>, especialmente en zonas como Zona Universidad, Delicias o el Centro, donde por unos 300€ puedes encontrar habitaciones de gran calidad.</p>
        `,
        faqs: [
            {
                question: "¿Cuánto cuesta el alojamiento para estudiantes en Zaragoza?",
                answer: "Entre 200€ y 500€/mes según la zona y el tipo de alojamiento. Barrios como Delicias o Las Fuentes ofrecen los precios más bajos (200-300€), mientras que el Centro o Romareda son más caros (350-500€)."
            },
            {
                question: "¿Cuáles son los mejores barrios para estudiantes en Zaragoza?",
                answer: "Los más populares son Delicias (céntrico y económico), Actur (moderno y bien comunicado), Centro (todo a mano pero más caro), Romareda (tranquilo, cerca del campus) y San José (ideal para ingenierías, cerca de Río Ebro)."
            },
            {
                question: "¿Cómo es el transporte público en Zaragoza para estudiantes?",
                answer: "Zaragoza tiene tranvía, autobuses urbanos y un sistema de bicicletas públicas (Bizi). El abono joven cuesta unos 30€/mes. La ciudad es compacta y muchos estudiantes se mueven en bici o a pie."
            },
            {
                question: "¿Zaragoza es una buena ciudad para estudiantes?",
                answer: "Excelente. Tiene más de 35.000 estudiantes, un coste de vida un 40% inferior a Madrid o Barcelona, y una oferta cultural y de ocio muy completa. La Universidad de Zaragoza está entre las mejores de España."
            },
            {
                question: "¿Cuándo empieza la temporada de alquiler para estudiantes?",
                answer: "La búsqueda se intensifica entre junio y septiembre. Recomendamos empezar a buscar en mayo-junio para tener más opciones. En Livix puedes reservar tu alojamiento con antelación de forma segura."
            },
            {
                question: "¿Es seguro alquilar piso como estudiante en Zaragoza?",
                answer: "Sí, especialmente si usas plataformas verificadas como Livix. Recomendamos siempre firmar contrato, no pagar sin visitar y verificar al propietario. En Livix todos los alojamientos están verificados."
            }
        ],
        faqsPisos: [
            {
                question: "¿Cuánto cuesta alquilar un piso completo para estudiantes en Zaragoza?",
                answer: "Un piso de 3-4 habitaciones cuesta entre 600€ y 900€/mes en total, unos 200-300€ por persona compartiendo gastos."
            },
            {
                question: "¿Es mejor alquilar un piso entero o una habitación?",
                answer: "Un piso compartido suele ser más económico y ofrece más libertad. Una habitación es más cómoda de gestionar y con menos compromisos."
            },
            {
                question: "¿Qué incluye el alquiler de un piso de estudiantes?",
                answer: "Generalmente el alquiler base. Agua, luz, gas e internet suelen ser aparte (50-80€/mes por persona). Algunos pisos en Livix ofrecen todo incluido."
            }
        ],
        faqsResidencias: [
            {
                question: "¿Cuánto cuesta una residencia universitaria en Zaragoza?",
                answer: "Entre 500€ y 900€/mes, normalmente con pensión completa, limpieza y servicios incluidos."
            },
            {
                question: "¿Qué ventajas tiene una residencia frente a un piso?",
                answer: "Todo incluido (comida, limpieza, wifi, actividades), ambiente social, seguridad y cercanía al campus. Ideal para primer año o Erasmus."
            },
            {
                question: "¿Cuándo hay que reservar plaza en una residencia?",
                answer: "Lo ideal es entre marzo y junio para el curso siguiente. Las plazas se agotan rápido en residencias cercanas al campus."
            }
        ],
        faqsColegiosMayores: [
            {
                question: "¿Cuál es la diferencia entre colegio mayor y residencia?",
                answer: "Los colegios mayores están adscritos a la universidad con programa cultural y formativo obligatorio. Las residencias son más independientes."
            },
            {
                question: "¿Cuánto cuesta un colegio mayor en Zaragoza?",
                answer: "Entre 600€ y 1.000€/mes, incluyendo pensión completa y actividades culturales."
            }
        ]
    }
};
