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
    },
    granada: {
        slug: "granada",
        name: "Granada",
        title: "Alquiler de Habitaciones y Pisos para Estudiantes en Granada | Livix",
        metaDescription: "Encuentra tu alojamiento ideal en Granada. Pisos compartidos, residencias y colegios mayores cerca de la Universidad de Granada. ✓ 100% Online",
        h1: "Alojamiento para Estudiantes en Granada",
        introText: "Granada es una de las ciudades universitarias más vibrantes de España. Con más de 50.000 estudiantes y una vida cultural excepcional, ofrece alojamiento variado a precios competitivos.",
        longDescription: "Granada combina historia, cultura y vida universitaria de primer nivel. La Universidad de Granada (UGR), una de las más antiguas de España, concentra sus campus entre el centro histórico y las zonas de Fuentenueva y Cartuja. El barrio del Albaicín, el Sacromonte y la zona universitaria ofrecen opciones de alojamiento para todos los perfiles y presupuestos.",
        universities: [
            "Universidad de Granada (UGR)"
        ],
        avgPrice: "300-500€",
        weather: "Mediterráneo continental — veranos calurosos, inviernos fríos. Nieve en Sierra Nevada cercana.",
        faqs: [
            {
                question: "¿Cuándo buscar alojamiento en Granada?",
                answer: "Lo ideal es entre mayo y julio para el curso siguiente. Granada tiene mucha demanda en septiembre, así que anticiparse es clave."
            },
            {
                question: "¿Qué barrios son mejores para estudiantes en Granada?",
                answer: "Fuentenueva y Cartuja son los más cercanos al campus. El centro histórico es céntrico pero algo más caro. El Zaidín ofrece precios muy asequibles."
            }
        ],
        faqsResidencias: [
            {
                question: "¿Cuánto cuesta una residencia universitaria en Granada?",
                answer: "Entre 600€ y 900€/mes en residencias privadas. Las residencias adscritas a la UGR tienen precios más económicos, desde 650€/mes."
            },
            {
                question: "¿Qué residencias están cerca del Campus de Fuentenueva?",
                answer: "El CM Albayzín, Livensa Living Fuentenueva y varias privadas como Xior o RESA están a pocos minutos del campus principal de la UGR."
            },
            {
                question: "¿Cuándo hay que reservar plaza en una residencia de Granada?",
                answer: "Entre febrero y mayo para el curso siguiente. Las plazas en residencias adscrit a la UGR se solicitan a través de la propia universidad."
            }
        ],
        faqsColegiosMayores: [
            {
                question: "¿Cuántos colegios mayores hay en Granada?",
                answer: "Granada cuenta con más de 10 colegios mayores, algunos de los más históricos de España, como el Real CM San Bartolomé y Santiago, fundado en 1649."
            },
            {
                question: "¿Cuánto cuesta un colegio mayor en Granada?",
                answer: "Entre 650€ y 800€/mes con pensión completa incluida. El CM Cardenal Cisneros, con 196 plazas, destaca por su excelente relación calidad-precio desde 666€/mes."
            }
        ]
    },
    malaga: {
        slug: "malaga",
        name: "Málaga",
        title: "Alquiler de Habitaciones y Pisos para Estudiantes en Málaga | Livix",
        metaDescription: "Encuentra tu alojamiento ideal en Málaga. Pisos compartidos, residencias universitarias y colegios mayores cerca de la Universidad de Málaga. ✓ 100% Online",
        h1: "Alojamiento para Estudiantes en Málaga",
        introText: "Málaga es una ciudad universitaria en pleno auge. Con más de 40.000 estudiantes en la UMA y un clima envidiable, combina calidad académica con la mejor vida estudiantil del sur.",
        longDescription: "La Universidad de Málaga (UMA) concentra la mayor parte de sus facultades en el Campus Teatinos, al noroeste de la ciudad. El Campus El Ejido, más céntrico, alberga algunas facultades de letras. Málaga tiene una oferta creciente de residencias privadas modernas alrededor de Campus Teatinos, junto a colegios mayores y residencias universitarias tradicionales más económicas.",
        universities: [
            "Universidad de Málaga (UMA)",
            "Universidad Francisco de Vitoria — Campus UAX Málaga"
        ],
        avgPrice: "350-600€",
        weather: "Mediterráneo — el mejor clima de España. Más de 300 días de sol al año.",
        faqs: [
            {
                question: "¿Cuándo buscar alojamiento en Málaga?",
                answer: "Entre mayo y julio para el curso siguiente. Málaga tiene mucha demanda en verano por turismo y estudiantes, así que anticiparse es clave."
            },
            {
                question: "¿Qué zona es mejor para vivir cerca de la UMA?",
                answer: "Campus Teatinos y alrededores (Puerto de la Torre, Portada Alta) son las zonas con más residencias. El centro está bien conectado pero más alejado del campus principal."
            }
        ],
        faqsResidencias: [
            {
                question: "¿Cuánto cuesta una residencia universitaria en Málaga?",
                answer: "Las residencias públicas de la UMA van desde 153€/mes (subvencionadas por renta familiar). Las privadas modernas van de 518€ a 931€/mes según servicios."
            },
            {
                question: "¿Qué residencias están en Campus Teatinos?",
                answer: "La mayoría: Xior Teatinos, Xior Atalaya, Resa Campus, micampus, ALFIL, Rustomas, Balcón del Romeral y StepHouse Parménides. Es el hub residencial de la UMA."
            },
            {
                question: "¿Cuándo hay que reservar plaza en Málaga?",
                answer: "Las privadas admiten reservas con meses de antelación. Para las de la UMA, el proceso oficial abre normalmente en primavera. Recomendamos reservar antes de julio."
            }
        ],
        faqsColegiosMayores: [
            {
                question: "¿Hay colegios mayores en Málaga?",
                answer: "Sí. El CM Arunda es el principal colegio mayor femenino de Málaga, gestionado por Obra Social Unicaja con 99 plazas desde 385€/mes."
            },
            {
                question: "¿Cuál es la diferencia entre un colegio mayor y una residencia en Málaga?",
                answer: "Los colegios mayores tienen programa formativo y cultural propio, adscripción universitaria y precios más económicos. Las residencias privadas ofrecen más independencia y mejores instalaciones."
            }
        ]
    }
};
