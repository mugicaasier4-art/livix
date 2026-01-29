export interface ColegioMayorSEO {
    slug: string;
    name: string;
    city: string;
    type: "Mixto" | "Femenino" | "Masculino";
    address: string;
    description: string;
    facilities: string[];
}

export const colegiosMayores: Record<string, ColegioMayorSEO> = {
    "pedro-cerbuna": {
        slug: "pedro-cerbuna",
        name: "CMU Pedro Cerbuna",
        city: "zaragoza",
        type: "Mixto",
        address: "Campus San Francisco",
        description: "El Colegio Mayor Universitario Pedro Cerbuna es el más antiguo de la Universidad de Zaragoza. Ubicado en el mismo Campus San Francisco, ofrece un ambiente académico y cultural único.",
        facilities: ["Comedor", "Biblioteca", "Gimnasio", "Salas de estudio", "Teatro"]
    },
    "santa-isabel": {
        slug: "santa-isabel",
        name: "CMU Santa Isabel",
        city: "zaragoza",
        type: "Femenino",
        address: "C. Domingo Miral, s/n",
        description: "Colegio Mayor adscrito a la Universidad de Zaragoza, situado cerca del Campus San Francisco y del Hospital Clínico.",
        facilities: ["Habitaciones individuales", "Comedor", "Jardín"]
    },
    "ramon-pignatelli": {
        slug: "ramon-pignatelli",
        name: "Residencia Ramón Pignatelli",
        city: "zaragoza",
        type: "Mixto",
        address: "Calle de Jarque de Moncayo, 23",
        description: "Residencia moderna y funcional gestionada por la Diputación de Zaragoza. Ideal para estudiantes que buscan independencia y servicios.",
        facilities: ["Piscina", "Pistas deportivas", "Biblioteca", "Cafetería"]
    }
};
