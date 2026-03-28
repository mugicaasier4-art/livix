export interface University {
  name: string;
  shortName: string;
  domain: string;
  campuses: string[];
}

export interface UniversityCity {
  city: string;
  region: string;
  universities: University[];
  neighborhoods: string[];
}

export const SPANISH_UNIVERSITY_CITIES: UniversityCity[] = [
  // ─── TIER 1 ───────────────────────────────────────────────────────────
  {
    city: "Madrid",
    region: "Comunidad de Madrid",
    universities: [
      {
        name: "Universidad Complutense de Madrid",
        shortName: "UCM",
        domain: "ucm.es",
        campuses: ["Ciudad Universitaria", "Somosaguas"],
      },
      {
        name: "Universidad Autónoma de Madrid",
        shortName: "UAM",
        domain: "uam.es",
        campuses: ["Cantoblanco"],
      },
      {
        name: "Universidad Carlos III de Madrid",
        shortName: "UC3M",
        domain: "uc3m.es",
        campuses: ["Getafe", "Leganés", "Colmenarejo", "Puerta de Toledo"],
      },
      {
        name: "Universidad Politécnica de Madrid",
        shortName: "UPM",
        domain: "upm.es",
        campuses: ["Ciudad Universitaria", "Montegancedo", "Sur"],
      },
      {
        name: "Universidad Rey Juan Carlos",
        shortName: "URJC",
        domain: "urjc.es",
        campuses: ["Móstoles", "Fuenlabrada", "Alcorcón", "Vicálvaro", "Aranjuez"],
      },
      {
        name: "Universidad de Alcalá",
        shortName: "UAH",
        domain: "uah.es",
        campuses: ["Alcalá de Henares", "Guadalajara"],
      },
      {
        name: "Universidad Pontificia Comillas",
        shortName: "Comillas",
        domain: "comillas.edu",
        campuses: ["Alberto Aguilera", "Cantoblanco"],
      },
      {
        name: "Universidad CEU San Pablo",
        shortName: "CEU San Pablo",
        domain: "uspceu.com",
        campuses: ["Montepríncipe", "Moncloa"],
      },
      {
        name: "Universidad Antonio de Nebrija",
        shortName: "Nebrija",
        domain: "nebrija.com",
        campuses: ["La Berzosa", "Dehesa de la Villa", "Princesa"],
      },
      {
        name: "Universidad Nacional de Educación a Distancia",
        shortName: "UNED",
        domain: "uned.es",
        campuses: ["Ciudad Universitaria"],
      },
      {
        name: "Universidad Francisco de Vitoria",
        shortName: "UFV",
        domain: "ufv.es",
        campuses: ["Pozuelo de Alarcón"],
      },
      {
        name: "Universidad Europea de Madrid",
        shortName: "UEM",
        domain: "universidadeuropea.com",
        campuses: ["Villaviciosa de Odón", "Alcobendas"],
      },
    ],
    neighborhoods: [
      "Moncloa",
      "Argüelles",
      "Chamberí",
      "Malasaña",
      "Lavapiés",
      "La Latina",
      "Atocha",
      "Prosperidad",
    ],
  },
  {
    city: "Barcelona",
    region: "Cataluña",
    universities: [
      {
        name: "Universitat de Barcelona",
        shortName: "UB",
        domain: "ub.edu",
        campuses: ["Plaça Universitat", "Diagonal", "Bellvitge", "Mundet"],
      },
      {
        name: "Universitat Autònoma de Barcelona",
        shortName: "UAB",
        domain: "uab.cat",
        campuses: ["Bellaterra"],
      },
      {
        name: "Universitat Politècnica de Catalunya",
        shortName: "UPC",
        domain: "upc.edu",
        campuses: ["Nord", "Sud", "Terrassa", "Castelldefels", "Vilanova", "Manresa"],
      },
      {
        name: "Universitat Pompeu Fabra",
        shortName: "UPF",
        domain: "upf.edu",
        campuses: ["Ciutadella", "Poblenou", "Mar"],
      },
      {
        name: "Universitat Ramon Llull",
        shortName: "URL",
        domain: "url.edu",
        campuses: ["Esade", "IQS", "Blanquerna"],
      },
      {
        name: "Universitat Oberta de Catalunya",
        shortName: "UOC",
        domain: "uoc.edu",
        campuses: ["22@"],
      },
      {
        name: "Universitat Internacional de Catalunya",
        shortName: "UIC",
        domain: "uic.es",
        campuses: ["Sant Cugat", "Barcelona"],
      },
    ],
    neighborhoods: [
      "Eixample",
      "Gràcia",
      "Sants",
      "Les Corts",
      "El Born",
      "Poblenou",
      "Sant Gervasi",
      "Sarrià",
    ],
  },

  // ─── TIER 2 ───────────────────────────────────────────────────────────
  {
    city: "Valencia",
    region: "Comunidad Valenciana",
    universities: [
      {
        name: "Universitat de València",
        shortName: "UV",
        domain: "uv.es",
        campuses: ["Blasco Ibáñez", "Tarongers", "Burjassot-Paterna"],
      },
      {
        name: "Universitat Politècnica de València",
        shortName: "UPV",
        domain: "upv.es",
        campuses: ["Vera", "Alcoy", "Gandía"],
      },
      {
        name: "Universidad CEU Cardenal Herrera",
        shortName: "CEU UCH",
        domain: "uchceu.es",
        campuses: ["Alfara del Patriarca", "Castellón", "Elche"],
      },
    ],
    neighborhoods: [
      "Benimaclet",
      "Blasco Ibáñez",
      "Mestalla",
      "El Carmen",
      "Ruzafa",
      "Algirós",
    ],
  },
  {
    city: "Sevilla",
    region: "Andalucía",
    universities: [
      {
        name: "Universidad de Sevilla",
        shortName: "US",
        domain: "us.es",
        campuses: ["Reina Mercedes", "Ramón y Cajal", "Cartuja", "Pirotecnia"],
      },
      {
        name: "Universidad Pablo de Olavide",
        shortName: "UPO",
        domain: "upo.es",
        campuses: ["Dos Hermanas"],
      },
    ],
    neighborhoods: [
      "Triana",
      "Los Remedios",
      "Nervión",
      "Macarena",
      "Santa Cruz",
      "Reina Mercedes",
    ],
  },
  {
    city: "Zaragoza",
    region: "Aragón",
    universities: [
      {
        name: "Universidad de Zaragoza",
        shortName: "Unizar",
        domain: "unizar.es",
        campuses: ["Plaza San Francisco", "Río Ebro", "Campus Teruel", "Campus Huesca"],
      },
      {
        name: "Universidad San Jorge",
        shortName: "USJ",
        domain: "usj.es",
        campuses: ["Villanueva de Gállego"],
      },
    ],
    neighborhoods: [
      "Centro",
      "Delicias",
      "San José",
      "Romareda",
      "Actur",
      "Universidad",
      "Magdalena",
      "Casco Viejo",
    ],
  },
  {
    city: "Granada",
    region: "Andalucía",
    universities: [
      {
        name: "Universidad de Granada",
        shortName: "UGR",
        domain: "ugr.es",
        campuses: ["Fuentenueva", "Cartuja", "Centro", "Ciencias de la Salud", "Ceuta", "Melilla"],
      },
    ],
    neighborhoods: [
      "Centro",
      "Realejo",
      "Albaicín",
      "Fuentenueva",
      "Zaidín",
      "Ronda",
    ],
  },
  {
    city: "Salamanca",
    region: "Castilla y León",
    universities: [
      {
        name: "Universidad de Salamanca",
        shortName: "USAL",
        domain: "usal.es",
        campuses: ["Campus Histórico", "Campus Miguel de Unamuno", "Campus Ciudad Jardín"],
      },
      {
        name: "Universidad Pontificia de Salamanca",
        shortName: "UPSA",
        domain: "upsa.es",
        campuses: ["Campus Champagnat"],
      },
    ],
    neighborhoods: [
      "Centro",
      "Barrio del Oeste",
      "Garrido",
      "Prosperidad",
      "Chinchibarra",
      "Vidal",
    ],
  },
  {
    city: "Bilbao",
    region: "País Vasco",
    universities: [
      {
        name: "Universidad del País Vasco / Euskal Herriko Unibertsitatea",
        shortName: "UPV/EHU",
        domain: "ehu.eus",
        campuses: ["Leioa", "Sarriko", "Medicina"],
      },
      {
        name: "Universidad de Deusto",
        shortName: "Deusto",
        domain: "deusto.es",
        campuses: ["Bilbao", "San Sebastián"],
      },
    ],
    neighborhoods: [
      "Deusto",
      "Indautxu",
      "Casco Viejo",
      "San Ignacio",
      "Abando",
      "Santutxu",
    ],
  },
  {
    city: "Málaga",
    region: "Andalucía",
    universities: [
      {
        name: "Universidad de Málaga",
        shortName: "UMA",
        domain: "uma.es",
        campuses: ["Teatinos", "El Ejido"],
      },
    ],
    neighborhoods: [
      "Teatinos",
      "Centro",
      "El Palo",
      "La Malagueta",
      "Carranque",
      "Cruz de Humilladero",
    ],
  },
  {
    city: "Murcia",
    region: "Región de Murcia",
    universities: [
      {
        name: "Universidad de Murcia",
        shortName: "UM",
        domain: "um.es",
        campuses: ["Espinardo", "La Merced"],
      },
      {
        name: "Universidad Católica de Murcia",
        shortName: "UCAM",
        domain: "ucam.edu",
        campuses: ["Los Jerónimos"],
      },
    ],
    neighborhoods: [
      "Centro",
      "La Flota",
      "Espinardo",
      "El Carmen",
      "Vistalegre",
      "Santa María de Gracia",
    ],
  },

  // ─── TIER 3 ───────────────────────────────────────────────────────────
  {
    city: "Santiago de Compostela",
    region: "Galicia",
    universities: [
      {
        name: "Universidade de Santiago de Compostela",
        shortName: "USC",
        domain: "usc.gal",
        campuses: ["Campus Norte", "Campus Sur", "Campus Lugo"],
      },
    ],
    neighborhoods: [
      "Zona Vieja",
      "Ensanche",
      "Vista Alegre",
      "Fontiñas",
      "Santa Marta",
    ],
  },
  {
    city: "Valladolid",
    region: "Castilla y León",
    universities: [
      {
        name: "Universidad de Valladolid",
        shortName: "UVA",
        domain: "uva.es",
        campuses: ["Centro", "Miguel Delibes", "Río Esgueva", "Campus Segovia", "Campus Soria", "Campus Palencia"],
      },
    ],
    neighborhoods: [
      "Centro",
      "Parquesol",
      "Delicias",
      "La Rondilla",
      "Paseo Zorrilla",
      "Huerta del Rey",
    ],
  },
  {
    city: "A Coruña",
    region: "Galicia",
    universities: [
      {
        name: "Universidade da Coruña",
        shortName: "UDC",
        domain: "udc.es",
        campuses: ["Elviña", "Riazor", "Ferrol", "Oza"],
      },
    ],
    neighborhoods: [
      "Centro",
      "Riazor",
      "Los Rosales",
      "Monte Alto",
      "Elviña",
    ],
  },
  {
    city: "Alicante",
    region: "Comunidad Valenciana",
    universities: [
      {
        name: "Universidad de Alicante",
        shortName: "UA",
        domain: "ua.es",
        campuses: ["San Vicente del Raspeig"],
      },
    ],
    neighborhoods: [
      "Centro",
      "San Vicente del Raspeig",
      "Playa de San Juan",
      "Altozano",
      "Benalúa",
    ],
  },
  {
    city: "Córdoba",
    region: "Andalucía",
    universities: [
      {
        name: "Universidad de Córdoba",
        shortName: "UCO",
        domain: "uco.es",
        campuses: ["Rabanales", "Menéndez Pidal", "Centro"],
      },
    ],
    neighborhoods: [
      "Centro",
      "Ciudad Jardín",
      "Fátima",
      "Valdeolleros",
      "Zoco",
    ],
  },
  {
    city: "Cádiz",
    region: "Andalucía",
    universities: [
      {
        name: "Universidad de Cádiz",
        shortName: "UCA",
        domain: "uca.es",
        campuses: ["Cádiz", "Puerto Real", "Jerez", "Algeciras"],
      },
    ],
    neighborhoods: [
      "Centro",
      "La Viña",
      "Bahía Blanca",
      "Puntales",
      "Extramuros",
    ],
  },
  {
    city: "Pamplona",
    region: "Navarra",
    universities: [
      {
        name: "Universidad de Navarra",
        shortName: "UNAV",
        domain: "unav.edu",
        campuses: ["Pamplona", "San Sebastián", "Madrid"],
      },
      {
        name: "Universidad Pública de Navarra",
        shortName: "UPNA",
        domain: "unavarra.es",
        campuses: ["Arrosadía", "Tudela"],
      },
    ],
    neighborhoods: [
      "Casco Viejo",
      "Ensanche",
      "Iturrama",
      "San Juan",
      "Mendebaldea",
      "Ermitagaña",
    ],
  },
  {
    city: "Oviedo",
    region: "Asturias",
    universities: [
      {
        name: "Universidad de Oviedo",
        shortName: "UNIOVI",
        domain: "uniovi.es",
        campuses: ["El Cristo", "Llamaquique", "Mieres", "Gijón"],
      },
    ],
    neighborhoods: [
      "Centro",
      "El Cristo",
      "Llamaquique",
      "San Lázaro",
      "La Corredoria",
    ],
  },
  {
    city: "Santander",
    region: "Cantabria",
    universities: [
      {
        name: "Universidad de Cantabria",
        shortName: "UC",
        domain: "unican.es",
        campuses: ["Las Llamas", "Torrelavega"],
      },
      {
        name: "Universidad Europea del Atlántico",
        shortName: "UNEATLANTICO",
        domain: "uneatlantico.es",
        campuses: ["Santander"],
      },
    ],
    neighborhoods: [
      "Centro",
      "Sardinero",
      "Cuatro Caminos",
      "General Dávila",
      "Monte",
    ],
  },
  {
    city: "Palma de Mallorca",
    region: "Islas Baleares",
    universities: [
      {
        name: "Universitat de les Illes Balears",
        shortName: "UIB",
        domain: "uib.es",
        campuses: ["Ctra. Valldemossa"],
      },
    ],
    neighborhoods: [
      "Centro",
      "Santa Catalina",
      "El Molinar",
      "Son Espanyolet",
      "La Lonja",
    ],
  },
  {
    city: "Las Palmas de Gran Canaria",
    region: "Canarias",
    universities: [
      {
        name: "Universidad de Las Palmas de Gran Canaria",
        shortName: "ULPGC",
        domain: "ulpgc.es",
        campuses: ["Tafira", "San Cristóbal", "Obelisco"],
      },
    ],
    neighborhoods: [
      "Triana",
      "Vegueta",
      "Mesa y López",
      "Guanarteme",
      "Tafira",
    ],
  },
  {
    city: "San Cristóbal de La Laguna",
    region: "Canarias",
    universities: [
      {
        name: "Universidad de La Laguna",
        shortName: "ULL",
        domain: "ull.es",
        campuses: ["Central", "Guajara", "Anchieta"],
      },
    ],
    neighborhoods: [
      "Centro",
      "Gracia",
      "San Benito",
      "Geneto",
      "Guajara",
    ],
  },
  {
    city: "Castellón de la Plana",
    region: "Comunidad Valenciana",
    universities: [
      {
        name: "Universitat Jaume I",
        shortName: "UJI",
        domain: "uji.es",
        campuses: ["Riu Sec"],
      },
    ],
    neighborhoods: [
      "Centro",
      "Grao",
      "Fadrell",
      "Rafalafena",
      "Sequiol",
    ],
  },
  {
    city: "León",
    region: "Castilla y León",
    universities: [
      {
        name: "Universidad de León",
        shortName: "ULE",
        domain: "unileon.es",
        campuses: ["Vegazana", "Ponferrada"],
      },
    ],
    neighborhoods: [
      "Centro",
      "Eras de Renueva",
      "El Ejido",
      "San Mamés",
      "La Palomera",
    ],
  },
  {
    city: "Jaén",
    region: "Andalucía",
    universities: [
      {
        name: "Universidad de Jaén",
        shortName: "UJA",
        domain: "ujaen.es",
        campuses: ["Las Lagunillas", "Linares"],
      },
    ],
    neighborhoods: [
      "Centro",
      "Las Lagunillas",
      "El Bulevar",
      "Peñamefécit",
      "San Ildefonso",
    ],
  },
  {
    city: "Almería",
    region: "Andalucía",
    universities: [
      {
        name: "Universidad de Almería",
        shortName: "UAL",
        domain: "ual.es",
        campuses: ["La Cañada de San Urbano"],
      },
    ],
    neighborhoods: [
      "Centro",
      "Nueva Almería",
      "Oliveros",
      "Zapillo",
      "Altamira",
    ],
  },
  {
    city: "Huelva",
    region: "Andalucía",
    universities: [
      {
        name: "Universidad de Huelva",
        shortName: "UHU",
        domain: "uhu.es",
        campuses: ["El Carmen", "La Rábida"],
      },
    ],
    neighborhoods: [
      "Centro",
      "La Orden",
      "Isla Chica",
      "Molino de la Vega",
      "El Carmen",
    ],
  },
  {
    city: "Badajoz",
    region: "Extremadura",
    universities: [
      {
        name: "Universidad de Extremadura",
        shortName: "UNEX",
        domain: "unex.es",
        campuses: ["Badajoz", "Cáceres", "Mérida", "Plasencia"],
      },
    ],
    neighborhoods: [
      "Centro",
      "San Fernando",
      "El Progreso",
      "Valdepasillas",
      "Santa Marina",
    ],
  },
  {
    city: "Burgos",
    region: "Castilla y León",
    universities: [
      {
        name: "Universidad de Burgos",
        shortName: "UBU",
        domain: "ubu.es",
        campuses: ["San Amaro", "Río Vena", "Milanera"],
      },
    ],
    neighborhoods: [
      "Centro",
      "Gamonal",
      "San Pedro de la Fuente",
      "Capiscol",
      "Río Vena",
    ],
  },
  {
    city: "Girona",
    region: "Cataluña",
    universities: [
      {
        name: "Universitat de Girona",
        shortName: "UdG",
        domain: "udg.edu",
        campuses: ["Montilivi", "Barri Vell", "Centre"],
      },
    ],
    neighborhoods: [
      "Barri Vell",
      "Eixample",
      "Pedret",
      "Santa Eugènia",
      "Montilivi",
    ],
  },
  {
    city: "Lleida",
    region: "Cataluña",
    universities: [
      {
        name: "Universitat de Lleida",
        shortName: "UdL",
        domain: "udl.cat",
        campuses: ["Cappont", "Rectorat", "ETSEA"],
      },
    ],
    neighborhoods: [
      "Centre Històric",
      "Cappont",
      "Balàfia",
      "Pardinyes",
      "Secà de Sant Pere",
    ],
  },
  {
    city: "Tarragona",
    region: "Cataluña",
    universities: [
      {
        name: "Universitat Rovira i Virgili",
        shortName: "URV",
        domain: "urv.cat",
        campuses: ["Sescelades", "Catalunya", "Reus"],
      },
    ],
    neighborhoods: [
      "Part Alta",
      "Eixample",
      "Serrallo",
      "Sant Pere i Sant Pau",
      "Torreforta",
    ],
  },
  {
    city: "Vigo",
    region: "Galicia",
    universities: [
      {
        name: "Universidade de Vigo",
        shortName: "UVIGO",
        domain: "uvigo.gal",
        campuses: ["Lagoas-Marcosende", "Ourense", "Pontevedra"],
      },
    ],
    neighborhoods: [
      "Centro",
      "Coia",
      "Bouzas",
      "Navia",
      "Teis",
    ],
  },
  {
    city: "Logroño",
    region: "La Rioja",
    universities: [
      {
        name: "Universidad de La Rioja",
        shortName: "UNIRIOJA",
        domain: "unirioja.es",
        campuses: ["Campus Universitario"],
      },
    ],
    neighborhoods: [
      "Centro",
      "Cascajos",
      "El Cubo",
      "Madre de Dios",
      "Yagüe",
    ],
  },
  {
    city: "Ciudad Real",
    region: "Castilla-La Mancha",
    universities: [
      {
        name: "Universidad de Castilla-La Mancha",
        shortName: "UCLM",
        domain: "uclm.es",
        campuses: ["Ciudad Real", "Toledo", "Albacete", "Cuenca", "Talavera de la Reina"],
      },
    ],
    neighborhoods: [
      "Centro",
      "Puerta de Toledo",
      "El Pilar",
      "Larache",
      "Universidad",
    ],
  },
  {
    city: "Elche",
    region: "Comunidad Valenciana",
    universities: [
      {
        name: "Universidad Miguel Hernández",
        shortName: "UMH",
        domain: "umh.es",
        campuses: ["Elche", "Sant Joan d'Alacant", "Orihuela", "Altea"],
      },
    ],
    neighborhoods: [
      "Centro",
      "Altabix",
      "Carrús",
      "El Pla",
      "Palmerales",
    ],
  },
  {
    city: "Alcalá de Henares",
    region: "Comunidad de Madrid",
    universities: [
      {
        name: "Universidad de Alcalá",
        shortName: "UAH",
        domain: "uah.es",
        campuses: ["Histórico", "Científico-Tecnológico", "Guadalajara"],
      },
    ],
    neighborhoods: [
      "Centro",
      "Reyes Católicos",
      "Chorrillo",
      "Val",
      "Ensanche",
    ],
  },
  {
    city: "Getafe",
    region: "Comunidad de Madrid",
    universities: [
      {
        name: "Universidad Carlos III de Madrid",
        shortName: "UC3M",
        domain: "uc3m.es",
        campuses: ["Getafe"],
      },
    ],
    neighborhoods: [
      "Centro",
      "Buenavista",
      "Sector III",
      "El Rosón",
      "Las Margaritas",
    ],
  },
  {
    city: "Leganés",
    region: "Comunidad de Madrid",
    universities: [
      {
        name: "Universidad Carlos III de Madrid",
        shortName: "UC3M",
        domain: "uc3m.es",
        campuses: ["Leganés"],
      },
    ],
    neighborhoods: [
      "Centro",
      "Zarzaquemada",
      "San Nicasio",
      "Solagua",
      "La Fortuna",
    ],
  },
  {
    city: "Toledo",
    region: "Castilla-La Mancha",
    universities: [
      {
        name: "Universidad de Castilla-La Mancha",
        shortName: "UCLM",
        domain: "uclm.es",
        campuses: ["Fábrica de Armas", "Antigua Fábrica"],
      },
    ],
    neighborhoods: [
      "Casco Histórico",
      "Santa Bárbara",
      "Buenavista",
      "Palomarejos",
      "Azucaica",
    ],
  },
  {
    city: "Albacete",
    region: "Castilla-La Mancha",
    universities: [
      {
        name: "Universidad de Castilla-La Mancha",
        shortName: "UCLM",
        domain: "uclm.es",
        campuses: ["Campus Albacete"],
      },
    ],
    neighborhoods: [
      "Centro",
      "Villacerrada",
      "Industria",
      "Franciscanos",
      "San Pablo",
    ],
  },
];

export const getCitiesList = (): string[] =>
  SPANISH_UNIVERSITY_CITIES.map((c) => c.city).sort();

export const getUniversitiesByCity = (city: string): University[] => {
  const entry = SPANISH_UNIVERSITY_CITIES.find((c) => c.city === city);
  return entry?.universities || [];
};

export const getNeighborhoodsByCity = (city: string): string[] => {
  const entry = SPANISH_UNIVERSITY_CITIES.find((c) => c.city === city);
  return entry?.neighborhoods || [];
};

export const getUniversityByShortName = (shortName: string): University | undefined => {
  for (const city of SPANISH_UNIVERSITY_CITIES) {
    const uni = city.universities.find((u) => u.shortName === shortName);
    if (uni) return uni;
  }
  return undefined;
};

export const getCityByUniversity = (shortName: string): string | undefined => {
  for (const city of SPANISH_UNIVERSITY_CITIES) {
    if (city.universities.some((u) => u.shortName === shortName)) {
      return city.city;
    }
  }
  return undefined;
};
