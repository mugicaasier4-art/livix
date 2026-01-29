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
                question: "¿Cuánto cuesta una habitación de estudiante en Zaragoza?",
                answer: "El precio medio oscila entre los 250€ y 400€ al año. Zonas como Delicias son más económicas (250€), mientras que el Centro o cerca de Plaza San Francisco pueden subir a 350-400€ con gastos incluidos."
            },
            {
                question: "¿Cuál es la mejor zona para vivir si estudio en UNIZAR?",
                answer: "Si estudias en el Campus San Francisco, la zona 'Universidad/Romareda' es ideal. Si vas al Campus Río Ebro (Ingenierías), el barrio del Actur es la opción más cómoda y moderna."
            },
            {
                question: "¿Es Zaragoza una ciudad cara para estudiantes?",
                answer: "No, en comparación con Madrid o Barcelona, Zaragoza es muy asequible. El abono transporte joven es barato y la cesta de la compra y el ocio tienen precios muy competitivos."
            }
        ]
    }
};
