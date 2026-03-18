export interface BarrioSEO {
    slug: string;
    name: string;
    city: string;
    title: string;
    metaDescription: string;
    h1: string;
    introText: string;
    transport: string[];
    nearbyLandmarks: string[];
    avgPrice: string;
    studentRating: number; // 1-5
    longDescription?: string;
    faqs?: { question: string; answer: string }[];
}

export const barrios: Record<string, BarrioSEO> = {
    delicias: {
        slug: "delicias",
        name: "Delicias",
        city: "zaragoza",
        title: "Habitaciones en Delicias, Zaragoza | Alquiler Estudiantes - Livix",
        metaDescription: "Encuentra habitaciones para estudiantes en Delicias, Zaragoza. Zona céntrica con excelente transporte. Precios desde 200€/mes. ✓ Sin comisiones",
        h1: "Habitaciones para Estudiantes en Delicias, Zaragoza",
        introText: "Delicias es el barrio más poblado de Zaragoza y una de las mejores opciones para estudiantes. Su ubicación céntrica, excelentes conexiones de transporte y ambiente multicultural lo convierten en una zona muy demandada.",
        transport: [
            "Estación Delicias (AVE, Cercanías)",
            "Tranvía línea 1",
            "Autobuses 35, 38, 51"
        ],
        nearbyLandmarks: [
            "Centro Comercial Puerto Venecia (15 min)",
            "Campus San Francisco (20 min en tranvía)",
            "Centro histórico (10 min)"
        ],
        avgPrice: "250-350€/mes",
        studentRating: 4.2,
        longDescription: `
            <p>El barrio de <strong>Delicias</strong> es, sin duda, el corazón multicultural de Zaragoza. Para los estudiantes, representa la opción inteligente: precios muy competitivos a solo 10-15 minutos andando de la universidad.</p>
            <p>La Calle Delicias es una de las arterias comerciales más vivas de la ciudad, donde encontrarás desde supermercados hasta tiendas locales. Además, la cercanía a la Estación Intermodal hace que sea perfecto si planeas viajar los fines de semana.</p>
        `,
        faqs: [
            { question: "¿Es seguro el barrio de Delicias?", answer: "Sí, es un barrio obrero y familiar muy concurrido. Como en cualquier gran ciudad, hay zonas más tranquilas que otras, pero en general es muy popular entre estudiantes por su ambiente." },
            { question: "¿Qué tal está conectado con la universidad?", answer: "Excelente. El campus universitario está a un paseo o a pocas paradas de autobús (líneas 38, 42). Es una de las ubicaciones más estratégicas." }
        ]
    },

    actur: {
        slug: "actur",
        name: "Actur-Rey Fernando",
        city: "zaragoza",
        title: "Habitaciones en Actur, Zaragoza | Zona Universitaria - Livix",
        metaDescription: "Alquila habitación en Actur, Zaragoza. Barrio moderno cerca del Campus Río Ebro. Ideal para estudiantes de ingeniería. ✓ Verificados",
        h1: "Habitaciones para Estudiantes en Actur, Zaragoza",
        introText: "Actur-Rey Fernando es un barrio moderno al norte de Zaragoza, muy popular entre estudiantes de la EINA y facultades del Campus Río Ebro. Zona tranquila con todos los servicios.",
        transport: [
            "Tranvía línea 1 (Parque Goya)",
            "Autobuses 29, 30, 42",
            "Carril bici hasta Campus Río Ebro"
        ],
        nearbyLandmarks: [
            "Campus Río Ebro (10 min)",
            "Parque del Agua (5 min)",
            "Centro Comercial Grancasa (15 min)"
        ],
        avgPrice: "280-380€/mes",
        studentRating: 4.5,
        longDescription: `
            <p><strong>Actur</strong> (Actuaciones Urbanísticas Urgentes) es el barrio moderno por excelencia. Calles anchas, zonas verdes como el Parque del Agua y el centro comercial Grancasa definen esta zona.</p>
            <p>Es la "casa" de los ingenieros, ya que el Campus Río Ebro se encuentra en su extremo norte. Los pisos aquí son más nuevos, grandes y luminosos que en el centro.</p>
        `,
        faqs: [
            { question: "¿Es buena zona para estudiantes de ingeniería?", answer: "Es la mejor zona. Puedes ir andando o en bici al Campus Río Ebro en minutos. Casi todos los estudiantes de ingeniería eligen vivir aquí." }
        ]
    },

    centro: {
        slug: "centro",
        name: "Centro",
        city: "zaragoza",
        title: "Habitaciones en el Centro de Zaragoza | Casco Histórico - Livix",
        metaDescription: "Habitaciones para estudiantes en el centro de Zaragoza. Zona histórica, vida nocturna, cerca de todo. Alquiler desde 300€/mes.",
        h1: "Habitaciones para Estudiantes en el Centro de Zaragoza",
        introText: "El centro histórico de Zaragoza es perfecto para quienes buscan vida urbana. A pasos del Campus San Francisco y con toda la oferta cultural y de ocio de la ciudad.",
        transport: [
            "Tranvía (múltiples paradas)",
            "Todas las líneas de bus",
            "A pie a casi todo"
        ],
        nearbyLandmarks: [
            "Plaza del Pilar",
            "Campus San Francisco (5-10 min)",
            "El Tubo (zona de tapas)"
        ],
        avgPrice: "320-420€/mes",
        studentRating: 4.7,
        longDescription: `
            <h3>Vivir en el centro de Zaragoza como estudiante</h3>
            <p>El <strong>centro histórico de Zaragoza</strong> es el corazón de la ciudad y una de las zonas más deseadas por los estudiantes universitarios, especialmente por quienes buscan tenerlo todo a un paso. Aquí se concentra la mayor parte de la vida cultural, gastronómica y de ocio de la capital aragonesa. La emblemática <strong>Plaza del Pilar</strong>, con la Basílica del Pilar y la catedral de La Seo, marca el epicentro de un casco histórico lleno de historia y encanto. La <strong>Calle Alfonso</strong>, principal arteria comercial, conecta la plaza con el Paseo de la Independencia, ofreciendo tiendas, cafeterías y servicios a cada paso. Y a escasos metros se encuentra <strong>El Tubo</strong>, la zona de bares y tapas más famosa de Zaragoza, donde podrás disfrutar de la gastronomía local con tus compañeros de piso.</p>

            <h3>Transporte, universidades y servicios</h3>
            <p>Una de las grandes ventajas de vivir en el centro es la <strong>conexión de transporte</strong>: el tranvía cruza todo el casco urbano con paradas en Gran Vía e Independencia, y desde aquí parten prácticamente todas las líneas de autobús. Llegarás andando en 5-10 minutos al <strong>Campus San Francisco</strong>, donde se ubican las Facultades de Derecho, Filosofía y Letras, Economía y Educación. No necesitarás transporte para casi nada. Además, el Palacio de la Aljafería, sede de las Cortes de Aragón, se encuentra a pocos minutos a pie, completando un entorno de enorme riqueza patrimonial.</p>

            <h3>Vida nocturna y ambiente universitario</h3>
            <p>El centro ofrece la <strong>vida nocturna más animada</strong> de Zaragoza, con zonas como El Tubo, la calle Temple y la Plaza de San Felipe repletas de bares, pubs y locales de copas. Esto hace que sea la zona preferida por estudiantes Erasmus y universitarios que buscan combinar estudios con una experiencia social intensa. El precio medio de una habitación oscila entre <strong>350-500€/mes</strong>, algo superior al de otros barrios, pero la comodidad y el ahorro en transporte compensan la diferencia. Vivir en el centro de Zaragoza es elegir máxima comodidad y un entorno inigualable.</p>
        `,
        faqs: [
            { question: "¿Es caro vivir en el centro de Zaragoza como estudiante?", answer: "El centro es la zona más cara para alquilar en Zaragoza, con precios medios de 350-500€/mes por habitación. Sin embargo, al no necesitar transporte para ir a clase ni para salir, muchos estudiantes compensan ese sobrecoste ahorrando en abonos de bus o tranvía. También hay opciones más asequibles en calles secundarias o pisos interiores." },
            { question: "¿Qué ventajas tiene vivir en el centro para estudiantes?", answer: "Las ventajas son numerosas: proximidad al Campus San Francisco (5-10 min andando), acceso inmediato a todas las líneas de transporte público, cercanía a zonas de ocio como El Tubo y la Plaza del Pilar, supermercados, bibliotecas y servicios a tu alcance sin necesidad de desplazarte. Además, es la zona mejor conectada para explorar toda la ciudad." },
            { question: "¿Es seguro el centro de Zaragoza por la noche?", answer: "Sí, el centro de Zaragoza es una zona bastante segura incluso de noche. Al ser la zona con más actividad nocturna de la ciudad, siempre hay gente por la calle y establecimientos abiertos. Como en cualquier centro urbano, es recomendable tomar precauciones básicas, pero en general los estudiantes se sienten cómodos y seguros viviendo aquí." }
        ]
    },

    "las-fuentes": {
        slug: "las-fuentes",
        name: "Las Fuentes",
        city: "zaragoza",
        title: "Habitaciones en Las Fuentes, Zaragoza | Barrio Económico - Livix",
        metaDescription: "Encuentra habitaciones baratas en Las Fuentes, Zaragoza. Barrio tranquilo con buenos precios para estudiantes.",
        h1: "Habitaciones para Estudiantes en Las Fuentes, Zaragoza",
        introText: "Las Fuentes es un barrio tradicional de Zaragoza con precios más asequibles que el centro. Buenas conexiones y ambiente tranquilo para estudiar.",
        transport: [
            "Autobuses 22, 40, 44",
            "Cercanías (estación El Portillo cercana)"
        ],
        nearbyLandmarks: [
            "Parque de las Fuentes",
            "Centro (15 min en bus)"
        ],
        avgPrice: "200-300€/mes",
        studentRating: 3.8,
        longDescription: `
            <h3>Las Fuentes: alojamiento económico para estudiantes en Zaragoza</h3>
            <p><strong>Las Fuentes</strong> es un barrio residencial situado al este del centro de Zaragoza, junto al río Ebro. Es una de las opciones más económicas para los estudiantes que buscan alojamiento en la ciudad, con precios que lo sitúan entre los barrios más asequibles de la capital aragonesa. Las habitaciones en piso compartido se encuentran en un rango de <strong>200-300€/mes</strong>, cifras difíciles de igualar en zonas más céntricas. El barrio cuenta con un ambiente tranquilo y familiar, perfecto para quienes prefieren un entorno sosegado donde poder estudiar sin distracciones.</p>

            <h3>Servicios, transporte y vida cotidiana</h3>
            <p>Aunque Las Fuentes no es una zona céntrica, está <strong>bien conectado por autobús</strong> con líneas frecuentes (22, 40, 44) que te llevan al centro de Zaragoza en 10-15 minutos. El barrio dispone de todos los servicios que un estudiante necesita: supermercados, farmacias, comercios de proximidad y un <strong>mercado municipal</strong> donde comprar productos frescos a buen precio. El <strong>Parque de Las Fuentes</strong> ofrece zonas verdes amplias para pasear, hacer deporte o desconectar entre jornadas de estudio.</p>

            <h3>Un barrio multicultural con carácter propio</h3>
            <p>Las Fuentes destaca por su <strong>diversidad cultural</strong>, con una mezcla de vecinos de toda la vida y residentes de distintas nacionalidades que dan al barrio un carácter abierto y acogedor. Encontrarás tiendas de alimentación internacional, locales con cocina de diferentes países y un ambiente de barrio auténtico. Para los estudiantes con <strong>presupuesto ajustado</strong>, Las Fuentes representa una oportunidad excelente de vivir en Zaragoza sin comprometer la calidad de vida. La inversión en transporte (autobús urbano con bono joven) es mínima comparada con el ahorro en alquiler frente a otras zonas.</p>
        `,
        faqs: [
            { question: "¿Es Las Fuentes un buen barrio para estudiantes?", answer: "Sí, especialmente si buscas precios económicos y un entorno tranquilo para estudiar. Es uno de los barrios más asequibles de Zaragoza, con habitaciones desde 200€/mes. No tiene la vida nocturna del centro, pero precisamente esa tranquilidad es una ventaja para concentrarte en tus estudios." },
            { question: "¿Cómo es el transporte en Las Fuentes?", answer: "Las Fuentes cuenta con varias líneas de autobús (22, 40, 44) que conectan el barrio con el centro y las zonas universitarias en 10-15 minutos. La frecuencia es buena durante el día y aceptable por la noche. Con el bono joven de bus, el coste mensual de transporte es muy reducido." },
            { question: "¿Cuánto cuesta una habitación en Las Fuentes?", answer: "Las Fuentes es de los barrios más baratos de Zaragoza para alquilar. Una habitación en piso compartido cuesta entre 200-300€/mes, dependiendo del tamaño y estado del piso. Es habitual encontrar pisos completos de 3 habitaciones por 450-550€/mes, lo que permite repartir gastos entre compañeros." }
        ]
    },

    romareda: {
        slug: "romareda",
        name: "Romareda",
        city: "zaragoza",
        title: "Habitaciones en Romareda, Zaragoza | Zona Residencial - Livix",
        metaDescription: "Alquiler de habitaciones en Romareda, Zaragoza. Barrio residencial tranquilo, ideal para estudiantes que buscan calidad.",
        h1: "Habitaciones para Estudiantes en Romareda, Zaragoza",
        introText: "La Romareda es una zona residencial de calidad en Zaragoza. Tranquila, segura y con buenos servicios. Ideal para estudiantes que prefieren un ambiente más tranquilo.",
        transport: [
            "Autobuses 20, 30, 35",
            "Cerca de Gran Vía"
        ],
        nearbyLandmarks: [
            "Estadio de La Romareda",
            "Parque Grande (5 min)",
            "Campus San Francisco (15 min)"
        ],
        avgPrice: "300-400€/mes",
        studentRating: 4.3,
        longDescription: `
            <h3>Romareda: calidad de vida para estudiantes en Zaragoza</h3>
            <p><strong>Romareda</strong> es uno de los barrios residenciales más valorados de Zaragoza, situado en la zona sur de la ciudad. Conocido por albergar el <strong>estadio de La Romareda</strong>, sede del Real Zaragoza, este barrio combina tranquilidad, seguridad y una excelente calidad de vida. Sus calles amplias y bien cuidadas, junto a la cercanía al <strong>Parque Grande José Antonio Labordeta</strong> —el pulmón verde de la ciudad—, hacen de Romareda un entorno ideal para estudiantes que buscan un ambiente sosegado donde poder concentrarse en sus estudios sin renunciar a los servicios urbanos.</p>

            <h3>Conexión universitaria y transporte</h3>
            <p>Romareda está estratégicamente situado respecto al <strong>Campus San Francisco</strong>, donde se imparten grados de Derecho, Economía, Filosofía y Letras, y Educación. En apenas <strong>10-15 minutos a pie o en autobús</strong> (líneas 20, 30, 35) llegarás a tus clases. Para quienes estudian en el Campus Río Ebro (ingenierías), el trayecto en transporte público es de unos 25 minutos. La cercanía a <strong>Gran Vía</strong>, una de las principales avenidas de la ciudad, facilita el acceso a múltiples líneas de autobús y al tranvía, conectándote con cualquier punto de Zaragoza. Además, dispone de carril bici para quienes prefieran desplazarse de forma sostenible.</p>

            <h3>Vivir en Romareda: precios y entorno</h3>
            <p>Los precios de alquiler en Romareda se sitúan entre <strong>280-400€/mes</strong> por habitación en piso compartido, ligeramente por encima de la media pero justificados por la calidad de las viviendas y del entorno. El barrio cuenta con supermercados, farmacias, clínicas y una amplia oferta gastronómica. El <strong>Parque Grande</strong>, con sus jardines botánicos, fuentes y senderos, es el lugar perfecto para desconectar, hacer deporte o pasear entre horas de estudio. Romareda es, en definitiva, la elección perfecta para estudiantes que priorizan la tranquilidad y el bienestar sin alejarse del centro universitario.</p>
        `,
        faqs: [
            { question: "¿Merece la pena vivir en Romareda como estudiante?", answer: "Romareda ofrece una excelente calidad de vida con calles tranquilas, el Parque Grande José Antonio Labordeta a pocos pasos y buena conexión con el campus San Francisco en 10-15 minutos. Los precios son algo más altos (280-400€/mes) pero la zona lo compensa con seguridad, servicios y un entorno muy agradable para estudiar." },
            { question: "¿Romareda está cerca de la universidad?", answer: "Sí, el campus San Francisco (Derecho, Economía, Filosofía, Educación) está a 10-15 minutos a pie o en autobús. El campus Río Ebro queda a unos 25 minutos en transporte público. Además, la cercanía a Gran Vía garantiza una excelente conexión con toda la ciudad." },
            { question: "¿Cómo es el ambiente en Romareda?", answer: "Romareda es un barrio residencial tranquilo y seguro, de nivel medio-alto. No tiene la vida nocturna del centro, pero esa calma es ideal para el estudio. El Parque Grande, a pocos minutos, ofrece un entorno natural perfecto para desconectar entre clases." }
        ]
    },

    "san-jose": {
        slug: "san-jose",
        name: "San José",
        city: "zaragoza",
        title: "Habitaciones en San José, Zaragoza | Barrio Universitario - Livix",
        metaDescription: "Habitaciones para estudiantes en San José, Zaragoza. Muy cerca del Campus San Francisco. Precios competitivos.",
        h1: "Habitaciones para Estudiantes en San José, Zaragoza",
        introText: "San José es uno de los barrios preferidos por estudiantes de Veterinaria y Ciencias. Su proximidad al Campus San Francisco y precios razonables lo hacen muy popular.",
        transport: [
            "Autobuses 21, 28, 30",
            "A pie al Campus San Francisco"
        ],
        nearbyLandmarks: [
            "Campus San Francisco (5-10 min)",
            "Facultad de Veterinaria (10 min)",
            "Mercado de San José"
        ],
        avgPrice: "250-350€/mes",
        studentRating: 4.4,
        longDescription: `
            <h3>San José: barrio universitario con carácter propio</h3>
            <p><strong>San José</strong> es un barrio popular situado al sur del centro de Zaragoza, con un marcado <strong>ambiente tradicional</strong> que lo diferencia de otras zonas de la ciudad. Sus calles conservan el espíritu de barrio de toda la vida: comercios de proximidad, panaderías, bares locales y un trato cercano entre vecinos. Para los estudiantes, San José representa una de las opciones con mejor <strong>relación calidad-precio</strong> de Zaragoza, con habitaciones en piso compartido entre <strong>230-350€/mes</strong>. El barrio dispone de una amplia oferta de pisos compartidos, muchos de ellos reformados y bien equipados, lo que facilita encontrar alojamiento adaptado a distintos presupuestos.</p>

            <h3>Conexión directa con el Campus Río Ebro</h3>
            <p>Una de las grandes ventajas de San José es su <strong>proximidad al Campus Río Ebro</strong>, donde se imparten las ingenierías (EINA), lo que convierte al barrio en una opción especialmente atractiva para estudiantes de carreras técnicas. Además, el barrio cuenta con <strong>parada de tranvía</strong> (línea 1), que conecta directamente con el campus y con el centro de la ciudad en pocos minutos. Las líneas de autobús 21, 28 y 30 completan una red de transporte que permite moverse por toda Zaragoza sin complicaciones. Para quienes estudian en el Campus San Francisco, el trayecto es de apenas 5-10 minutos a pie, ya que San José limita directamente con esta zona universitaria.</p>

            <h3>Vida cotidiana y oferta para estudiantes</h3>
            <p>San José ofrece todo lo que un estudiante necesita para su día a día: supermercados, el <strong>Mercado de San José</strong> con productos frescos a buenos precios, farmacias, copisterías y locales de restauración económicos. El ambiente del barrio es <strong>tranquilo y seguro</strong>, ideal para estudiar entre semana, pero con la ventaja de tener el centro de Zaragoza y su oferta de ocio a un corto trayecto en tranvía. Es, sin duda, una de las mejores opciones para estudiantes de ingeniería y para quienes buscan un barrio con personalidad y precios accesibles en Zaragoza.</p>
        `,
        faqs: [
            { question: "¿San José es buen barrio para estudiantes de ingeniería?", answer: "Es una de las mejores opciones para estudiantes de ingeniería. San José está muy cerca del Campus Río Ebro, donde se imparten los grados de la EINA, con conexión directa en tranvía (línea 1). Además, los precios son muy accesibles (230-350€/mes), lo que lo convierte en la elección preferida por muchos futuros ingenieros." },
            { question: "¿Cómo es la vida en San José para estudiantes?", answer: "Es un barrio tranquilo con ambiente de barrio tradicional: comercios de proximidad, bares locales, mercado municipal y buena conexión con el centro vía tranvía. Ideal para quien busca calidad-precio y un entorno donde pueda estudiar con tranquilidad sin estar lejos del ambiente universitario." },
            { question: "¿Cuánto cuesta alquilar una habitación en San José?", answer: "El precio medio de una habitación en piso compartido en San José oscila entre 230-350€/mes, dependiendo del tamaño, estado del piso y cercanía al tranvía. Es una de las zonas con mejor relación calidad-precio de Zaragoza para estudiantes." }
        ]
    }
};

export const getBarrio = (slug: string): BarrioSEO | undefined => {
    return barrios[slug];
};

export const getBarriosByCity = (city: string): BarrioSEO[] => {
    return Object.values(barrios).filter(b => b.city === city);
};
