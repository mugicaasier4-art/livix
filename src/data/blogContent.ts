// Blog post content and images
import pisosEstudiante from "@/assets/blog/pisos-estudiante.jpg";
import zonasUniversidad from "@/assets/blog/zonas-universidad.jpg";
import checklistAlquiler from "@/assets/blog/checklist-alquiler.jpg";
import tecnicasEstudio from "@/assets/blog/tecnicas-estudio.jpg";
import gestionTiempo from "@/assets/blog/gestion-tiempo.jpg";
import appsEstudiantes from "@/assets/blog/apps-estudiantes.jpg";
import ahorrarDinero from "@/assets/blog/ahorrar-dinero.jpg";
import recetasEstudiantes from "@/assets/blog/recetas-estudiantes.jpg";
import bienestarMental from "@/assets/blog/bienestar-mental.jpg";
import fiestasUniversitarias from "@/assets/blog/fiestas-universitarias.jpg";
import deportesClubs from "@/assets/blog/deportes-clubs.jpg";
import festivalesConciertos from "@/assets/blog/festivales-conciertos.jpg";

export type BlogCategory = "all" | "pisos" | "estudiante" | "consejos" | "eventos" | "legalidad" | "becas";

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: BlogCategory;
  image: string;
  content: string;
  readTime: number;
}

export const blogPosts: BlogPost[] = [];

export const categories = [
  { id: "all" as BlogCategory, label: "Todo" },
  { id: "pisos" as BlogCategory, label: "Información Pisos" },
  { id: "legalidad" as BlogCategory, label: "Legalidad" },
  { id: "becas" as BlogCategory, label: "Becas y Ayudas" },
  { id: "estudiante" as BlogCategory, label: "Vida Universitaria" },
  { id: "consejos" as BlogCategory, label: "Consejos" },
  { id: "eventos" as BlogCategory, label: "Eventos" },
];
