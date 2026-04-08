export interface BarrioPropietarioSEO {
  slug: string;
  name: string;
  city: string;
  title: string;
  metaDescription: string;
  h1: string;
  demandText: string;
  avgRent: string;
  avgRentRoom: string;
  occupancyRate: string;
  nearbyUnis: string[];
  studentDemand: string;
  whyRentHere: string;
  faqs: { question: string; answer: string }[];
}

export const barriosPropietarios: Record<string, BarrioPropietarioSEO> = {
  delicias: {
    slug: "delicias",
    name: "Delicias",
    city: "zaragoza",
    title: "Alquilar piso a estudiantes en Delicias, Zaragoza | Livix",
    metaDescription:
      "Tienes un piso en Delicias? Alquilalo a estudiantes universitarios verificados. Sin comisiones, te buscamos inquilino. Demanda alta en la zona.",
    h1: "Alquilar tu piso a estudiantes en Delicias, Zaragoza",
    demandText:
      "Delicias es el barrio mas demandado por estudiantes en Zaragoza. Su proximidad al tranvia, precios accesibles y ambiente multicultural atraen a cientos de universitarios cada septiembre.",
    avgRent: "550-750€/mes",
    avgRentRoom: "250-350€/mes",
    occupancyRate: "94%",
    nearbyUnis: [
      "Campus San Francisco (20 min en tranvia)",
      "Campus Rio Ebro (25 min en bus)",
    ],
    studentDemand: "Muy alta — zona mas buscada por precio/ubicacion",
    whyRentHere: `
      <p><strong>Delicias</strong> concentra la mayor demanda de alojamiento estudiantil de Zaragoza. Con mas de 35.000 estudiantes en la ciudad y un mercado donde la oferta no cubre la demanda, un piso en Delicias se alquila en dias.</p>
      <p>La conexion directa por tranvia con ambos campus y los precios accesibles hacen que los estudiantes prioricen esta zona. Alquilar por habitaciones genera un <strong>30-40% mas de rentabilidad</strong> que alquilar el piso completo: 3 habitaciones a 300€ = 900€/mes frente a 650€ por piso completo.</p>
    `,
    faqs: [
      {
        question: "Cuanto puedo cobrar por mi piso en Delicias?",
        answer:
          "Un piso completo de 3 habitaciones en Delicias se alquila entre 550-750€/mes. Si alquilas por habitaciones, el rango es 250-350€ por habitacion, lo que genera mayor rentabilidad total (750-1.050€/mes por un piso de 3 hab).",
      },
      {
        question: "Cuanto tarda en alquilarse un piso en Delicias?",
        answer:
          "Delicias es la zona con mayor demanda estudiantil. Un piso bien publicado y a precio de mercado se alquila en 1-2 semanas de media, especialmente en temporada alta (junio-septiembre).",
      },
      {
        question: "Que tipo de contrato debo hacer?",
        answer:
          "Para estudiantes, lo mas habitual es un contrato de temporada (10-12 meses, de septiembre a junio/julio). No esta sujeto a la duracion minima de 5 anos de la LAU y recuperas el piso al final del curso.",
      },
    ],
  },

  centro: {
    slug: "centro",
    name: "Centro",
    city: "zaragoza",
    title: "Alquilar piso a estudiantes en el Centro de Zaragoza | Livix",
    metaDescription:
      "Alquila tu piso del centro de Zaragoza a estudiantes verificados. Maxima demanda, precios premium. Sin comisiones con Livix.",
    h1: "Alquilar tu piso a estudiantes en el Centro de Zaragoza",
    demandText:
      "El centro historico es la zona premium para alojamiento estudiantil. La proximidad al Campus San Francisco y la vida universitaria generan una demanda constante durante todo el curso.",
    avgRent: "650-900€/mes",
    avgRentRoom: "320-420€/mes",
    occupancyRate: "97%",
    nearbyUnis: [
      "Campus San Francisco (5-10 min a pie)",
      "Facultad de Derecho, Economia, Filosofia",
    ],
    studentDemand: "Maxima — zona favorita de Erasmus y estudiantes nacionales",
    whyRentHere: `
      <p>El <strong>centro de Zaragoza</strong> es la ubicacion mas valorada por estudiantes, especialmente Erasmus. Con el Campus San Francisco a 5 minutos andando y toda la oferta cultural y de ocio, los pisos del centro tienen la tasa de ocupacion mas alta de la ciudad.</p>
      <p>Los precios de alquiler son los mas altos de Zaragoza, lo que significa <strong>mayor rentabilidad para el propietario</strong>. Un piso de 3 habitaciones genera facilmente 960-1.260€/mes alquilando por habitacion.</p>
    `,
    faqs: [
      {
        question: "Cuanto puedo cobrar en el centro de Zaragoza?",
        answer:
          "El centro es la zona mas cara. Un piso completo de 3 hab se alquila por 650-900€/mes. Por habitaciones: 320-420€ cada una (960-1.260€/mes total). Los Erasmus con becas de 400-600€/mes suelen buscar habitacion individual.",
      },
      {
        question: "Se alquila todo el ano o solo en curso?",
        answer:
          "La demanda principal es septiembre-junio, pero el centro tiene demanda durante todo el ano por turismo y movilidad academica. Muchos propietarios alquilan julio-agosto como apartamento vacacional.",
      },
      {
        question: "Merece la pena alquilar a Erasmus?",
        answer:
          "Si. Los Erasmus suelen tener beca (cobro seguro), estancias de 5-10 meses y son muy activos buscando alojamiento en el centro. Livix verifica su matricula universitaria antes de ponerles en contacto contigo.",
      },
    ],
  },

  "san-jose": {
    slug: "san-jose",
    name: "San Jose",
    city: "zaragoza",
    title: "Alquilar piso a estudiantes en San Jose, Zaragoza | Livix",
    metaDescription:
      "Piso en San Jose? Alquilalo a estudiantes de ingenieria verificados. Alta demanda cerca del Campus Rio Ebro. Livix te busca inquilino gratis.",
    h1: "Alquilar tu piso a estudiantes en San Jose, Zaragoza",
    demandText:
      "San Jose es el barrio preferido por estudiantes de ingenieria por su cercanía al Campus Rio Ebro y conexion directa por tranvia. Demanda estable todo el curso academico.",
    avgRent: "500-700€/mes",
    avgRentRoom: "230-350€/mes",
    occupancyRate: "92%",
    nearbyUnis: [
      "Campus Rio Ebro / EINA (5-10 min en tranvia)",
      "Campus San Francisco (5-10 min a pie)",
    ],
    studentDemand: "Alta — referencia para estudiantes de ingenieria",
    whyRentHere: `
      <p><strong>San Jose</strong> es el barrio de los ingenieros. La EINA (Escuela de Ingenieria y Arquitectura) en el Campus Rio Ebro esta a minutos en tranvia, y casi todos los estudiantes de carreras tecnicas buscan aqui.</p>
      <p>Los precios son competitivos respecto al centro, pero la demanda es igual de fuerte. Un piso de 3 habitaciones genera <strong>690-1.050€/mes</strong> alquilando por habitacion. La estabilidad del inquilino ingeniero (carreras de 4-5 anos) significa menos rotacion.</p>
    `,
    faqs: [
      {
        question: "Que perfil de estudiante busca piso en San Jose?",
        answer:
          "Principalmente estudiantes de ingenieria (EINA), arquitectura y ciencias. Suelen ser estudiantes de carreras largas (4-5 anos), lo que significa inquilinos mas estables con menos rotacion anual.",
      },
      {
        question: "Cuanto puedo cobrar en San Jose?",
        answer:
          "Piso completo de 3 hab: 500-700€/mes. Por habitacion: 230-350€ cada una. San Jose ofrece buena relacion calidad-precio tanto para el estudiante como para el propietario.",
      },
      {
        question: "Hay demanda fuera de temporada?",
        answer:
          "La demanda principal es septiembre-junio, pero los estudiantes de ingenieria con TFG o practicas suelen quedarse en verano. Es habitual mantener ocupacion 10-11 meses al ano.",
      },
    ],
  },

  actur: {
    slug: "actur",
    name: "Actur",
    city: "zaragoza",
    title: "Alquilar piso a estudiantes en Actur, Zaragoza | Livix",
    metaDescription:
      "Alquila tu piso del Actur a estudiantes del Campus Rio Ebro. Barrio moderno, alta demanda. Livix te busca inquilino verificado gratis.",
    h1: "Alquilar tu piso a estudiantes en Actur, Zaragoza",
    demandText:
      "Actur-Rey Fernando es un barrio moderno con gran demanda estudiantil. Su proximidad al Campus Rio Ebro y la linea de tranvia lo convierten en zona premium para estudiantes de ingenieria.",
    avgRent: "600-800€/mes",
    avgRentRoom: "280-380€/mes",
    occupancyRate: "93%",
    nearbyUnis: [
      "Campus Rio Ebro (10 min a pie/bici)",
      "EINA — Ingenieria y Arquitectura",
    ],
    studentDemand: "Alta — barrio moderno favorito de ingenieros",
    whyRentHere: `
      <p>El <strong>Actur</strong> es la zona residencial moderna de Zaragoza y la favorita de los estudiantes de ingenieria que prefieren pisos nuevos y bien equipados. El Campus Rio Ebro esta literalmente al lado, accesible a pie o en bici en 10 minutos.</p>
      <p>Los pisos en Actur suelen ser mas nuevos, grandes y luminosos que en otras zonas, lo que permite cobrar un <strong>precio premium</strong>. 3 habitaciones a 330€ = 990€/mes. La calidad del barrio atrae a estudiantes con mayor poder adquisitivo.</p>
    `,
    faqs: [
      {
        question: "Cuanto puedo cobrar en Actur?",
        answer:
          "Actur tiene precios ligeramente por encima de la media. Piso completo: 600-800€/mes. Por habitacion: 280-380€. Los pisos nuevos y bien amueblados pueden alcanzar el rango alto facilmente.",
      },
      {
        question: "Que ventaja tiene Actur frente a otros barrios?",
        answer:
          "Pisos mas modernos y grandes, cercanía directa al Campus Rio Ebro, zona tranquila con todos los servicios (Grancasa, Parque del Agua). Los estudiantes de ingenieria con presupuesto algo mayor eligen Actur.",
      },
      {
        question: "Es buena inversion alquilar a estudiantes en Actur?",
        answer:
          "Si. La combinacion de alta demanda, pisos de calidad y estudiantes de carreras largas (5 anos) genera rentabilidad estable. La tasa de ocupacion supera el 93% durante el curso.",
      },
    ],
  },

  universidad: {
    slug: "universidad",
    name: "Universidad / Campus",
    city: "zaragoza",
    title:
      "Alquilar piso a estudiantes en zona Universidad, Zaragoza | Livix",
    metaDescription:
      "Piso en zona Universidad de Zaragoza? Maxima demanda estudiantil. Livix te conecta con inquilinos verificados gratis. Sin comisiones.",
    h1: "Alquilar tu piso a estudiantes en la zona Universidad de Zaragoza",
    demandText:
      "La zona Universidad engloba el entorno inmediato del Campus San Francisco — la ubicacion con mayor densidad de estudiantes de toda Zaragoza. Los pisos aqui se alquilan antes que en ninguna otra zona.",
    avgRent: "600-850€/mes",
    avgRentRoom: "300-400€/mes",
    occupancyRate: "98%",
    nearbyUnis: [
      "Campus San Francisco (0-5 min a pie)",
      "Derecho, Economia, Educacion, Filosofia",
    ],
    studentDemand: "Maxima — primera opcion para cualquier estudiante",
    whyRentHere: `
      <p>La <strong>zona Universidad</strong> es el epicentro del alojamiento estudiantil en Zaragoza. Con el Campus San Francisco literalmente en la puerta, cualquier piso aqui tiene demanda garantizada. La tasa de ocupacion del 98% habla por si sola.</p>
      <p>Es la zona con <strong>menor tiempo de alquiler</strong>: un piso bien publicado se alquila en dias, no semanas. Los precios son altos y justificados por la ubicacion. Alquilar por habitacion maximiza la rentabilidad: 3 hab x 350€ = 1.050€/mes.</p>
    `,
    faqs: [
      {
        question: "Cuanto puedo cobrar en zona Universidad?",
        answer:
          "Es una de las zonas mas caras. Piso completo: 600-850€/mes. Por habitacion: 300-400€ (900-1.200€/mes por piso de 3 hab). La proximidad al campus justifica el premium.",
      },
      {
        question: "Cuanto tarda en alquilarse?",
        answer:
          "Es la zona mas rapida. Un piso publicado en junio-julio se alquila en 3-7 dias de media. En septiembre, la demanda de ultima hora absorbe lo que quede inmediatamente.",
      },
      {
        question: "Hay riesgo de que se quede vacio?",
        answer:
          "Minimo. La tasa de ocupacion en zona Universidad supera el 98% durante el curso. Incluso en verano, muchos estudiantes mantienen el piso para no perderlo de cara al siguiente ano.",
      },
    ],
  },
};

export const getBarrioPropietario = (
  slug: string
): BarrioPropietarioSEO | undefined => {
  return barriosPropietarios[slug];
};

export const getAllBarriosPropietarios = (): BarrioPropietarioSEO[] => {
  return Object.values(barriosPropietarios);
};
