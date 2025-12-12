// Data for Zaragoza universities and faculties
export interface Faculty {
  id: string;
  name: string;
  coords: {
    lat: number;
    lng: number;
  };
  shortName: string;
  campus: string;
}

export const campuses = [
  { id: 'san-francisco', name: 'Campus San Francisco', coords: { lat: 41.6397, lng: -0.8975 } },
  { id: 'rio-ebro', name: 'Campus Río Ebro', coords: { lat: 41.6836, lng: -0.8873 } },
  { id: 'veterinaria', name: 'Campus Veterinaria', coords: { lat: 41.6502, lng: -0.8943 } },
];

export const zaragozaFaculties: Faculty[] = [
  // Campus San Francisco
  {
    id: "ECON",
    name: "Facultad de Economía y Empresa",
    shortName: "Económicas",
    campus: 'san-francisco',
    coords: { lat: 41.6406, lng: -0.9018 }
  },
  {
    id: "MED",
    name: "Facultad de Medicina",
    shortName: "Medicina", 
    campus: 'san-francisco',
    coords: { lat: 41.6404, lng: -0.9015 }
  },
  {
    id: "FILO",
    name: "Facultad de Filosofía y Letras",
    shortName: "Filosofía",
    campus: 'san-francisco',
    coords: { lat: 41.6397, lng: -0.8975 }
  },
  {
    id: "DERE",
    name: "Facultad de Derecho",
    shortName: "Derecho",
    campus: 'san-francisco',
    coords: { lat: 41.6398, lng: -0.8982 }
  },
  {
    id: "CIEN",
    name: "Facultad de Ciencias", 
    shortName: "Ciencias",
    campus: 'san-francisco',
    coords: { lat: 41.6401, lng: -0.8979 }
  },
  {
    id: "EDU",
    name: "Facultad de Educación",
    shortName: "Educación",
    campus: 'san-francisco',
    coords: { lat: 41.6390, lng: -0.8968 }
  },
  // Campus Río Ebro
  {
    id: "EINA", 
    name: "Escuela de Ingeniería y Arquitectura",
    shortName: "EINA",
    campus: 'rio-ebro',
    coords: { lat: 41.6836, lng: -0.8873 }
  },
  {
    id: "CSHUM",
    name: "Centro Politécnico Superior",
    shortName: "CPS",
    campus: 'rio-ebro',
    coords: { lat: 41.6830, lng: -0.8880 }
  },
  // Veterinaria
  {
    id: "VET",
    name: "Facultad de Veterinaria",
    shortName: "Veterinaria",
    campus: 'veterinaria',
    coords: { lat: 41.6502, lng: -0.8943 }
  },
];

export const getFacultyById = (id: string): Faculty | undefined => {
  return zaragozaFaculties.find(faculty => faculty.id === id);
};

export const getFacultyByName = (name: string): Faculty | undefined => {
  return zaragozaFaculties.find(faculty => 
    faculty.name.toLowerCase().includes(name.toLowerCase()) ||
    faculty.shortName.toLowerCase().includes(name.toLowerCase())
  );
};

export const getFacultiesByCampus = (campusId: string): Faculty[] => {
  return zaragozaFaculties.filter(faculty => faculty.campus === campusId);
};
