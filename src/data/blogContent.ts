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

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Guía completa para encontrar piso de estudiante en Zaragoza",
    excerpt: "Todo lo que necesitas saber para encontrar el alojamiento perfecto durante tus estudios universitarios.",
    date: "2024-03-15",
    author: "Equipo Livix",
    category: "pisos",
    image: pisosEstudiante,
    readTime: 8,
    content: `## Introducción

Encontrar piso como estudiante en Zaragoza puede parecer una tarea abrumadora, especialmente si es tu primera vez viviendo fuera de casa. Esta guía te ayudará a navegar el proceso paso a paso.

## ¿Cuándo empezar a buscar?

Lo ideal es comenzar la búsqueda **2-3 meses antes** de la fecha de entrada. Los mejores pisos se alquilan rápido, especialmente en zonas cercanas a la universidad.

### Temporadas de alta demanda:
- **Julio-Septiembre**: Mayor competencia por pisos
- **Enero-Febrero**: Segunda oleada de búsquedas
- **Abril-Mayo**: Mejor momento para negociar precios

## Zonas recomendadas para estudiantes

### Centro histórico
El corazón de Zaragoza ofrece excelente vida nocturna y cultural, aunque los precios son más elevados. Ideal si valoras estar cerca de todo.

### San José
Zona residencial con buenas conexiones de transporte. Precios más asequibles y ambiente tranquilo perfecto para estudiar.

### Delicias
El barrio más multicultural de Zaragoza. Excelente relación calidad-precio y muy buena conexión con el centro.

### Actur
Zona moderna con amplias avenidas. Cerca del campus del Actur y con buenos servicios.

## Presupuesto orientativo

| Tipo de alojamiento | Precio mensual |
|---------------------|----------------|
| Habitación en piso compartido | 250€ - 400€ |
| Estudio pequeño | 400€ - 550€ |
| Piso completo (1 hab) | 500€ - 700€ |

## Documentos necesarios

1. **DNI o NIE** vigente
2. **Contrato de trabajo o beca** (o aval de los padres)
3. **Última nómina** o justificante de ingresos
4. **Referencias** de anteriores arrendadores (si las tienes)

## Consejos finales

- Nunca pagues sin ver el piso en persona
- Lee detenidamente el contrato antes de firmar
- Haz fotos del estado del piso al entrar
- Guarda todos los recibos y comunicaciones

Con paciencia y siguiendo estos consejos, encontrarás el piso perfecto para tu etapa universitaria en Zaragoza.`
  },
  {
    id: 2,
    title: "Las mejores zonas para vivir cerca de la Universidad de Zaragoza",
    excerpt: "Descubre los barrios más populares entre estudiantes y sus ventajas.",
    date: "2024-03-12",
    author: "Laura Pérez",
    category: "pisos",
    image: zonasUniversidad,
    readTime: 6,
    content: `## Los mejores barrios para estudiantes

Zaragoza cuenta con varios campus universitarios, y elegir dónde vivir dependerá de tu facultad y estilo de vida.

## Campus San Francisco

El campus histórico de la Universidad de Zaragoza está en pleno centro. Las mejores zonas cercanas son:

### El Casco Antiguo
- **Distancia**: 5-10 minutos andando
- **Ambiente**: Bohemio, cultural, vida nocturna
- **Precio medio**: 300-400€/habitación

### La Magdalena
- **Distancia**: 10-15 minutos andando
- **Ambiente**: Tranquilo pero céntrico
- **Precio medio**: 280-350€/habitación

## Campus Río Ebro

El campus de ingenierías y ciencias está algo más alejado del centro.

### Actur-Rey Fernando
- **Distancia**: 15 minutos en tranvía
- **Ambiente**: Moderno, residencial
- **Precio medio**: 250-320€/habitación

### Parque Goya
- **Distancia**: 10 minutos en bus
- **Ambiente**: Zona nueva, joven
- **Precio medio**: 270-350€/habitación

## Transporte público

Zaragoza cuenta con excelente transporte público:
- **Tranvía**: Conecta los principales campus
- **Bus urbano**: Amplia red de líneas
- **Bizi Zaragoza**: Sistema de bicicletas compartidas

## Nuestra recomendación

Si estudias en San Francisco, el Centro o la Magdalena son ideales. Para Río Ebro, considera Actur o zonas con buena conexión de tranvía.`
  },
  {
    id: 3,
    title: "Checklist: Qué revisar antes de alquilar una habitación",
    excerpt: "Lista completa de aspectos importantes a verificar antes de firmar un contrato de alquiler.",
    date: "2024-03-08",
    author: "David Ruiz",
    category: "pisos",
    image: checklistAlquiler,
    readTime: 5,
    content: `## Tu checklist definitivo

Antes de firmar cualquier contrato, asegúrate de revisar todos estos puntos.

## Durante la visita

### Estado general
- Paredes sin humedades ni grietas
- Ventanas que cierran correctamente
- Persianas en buen estado
- Suelo sin desperfectos importantes

### Instalaciones
- Enchufes funcionando
- Luces encendiendo correctamente
- Calefacción operativa
- Aire acondicionado (si lo tiene)
- Agua caliente disponible

### Cocina
- Electrodomésticos funcionando
- Vitrocerámica/fuegos en buen estado
- Frigorífico enfriando correctamente
- Campana extractora operativa

### Baño
- Grifos sin fugas
- Inodoro funcionando
- Ducha con presión adecuada
- Ventilación suficiente

## Sobre el contrato

### Debe incluir:
- Duración del contrato
- Precio mensual claro
- Qué gastos están incluidos
- Importe de la fianza
- Condiciones de rescisión

### Evita contratos que:
- Exijan más de 2 meses de fianza
- No especifiquen claramente los gastos
- Tengan cláusulas de permanencia abusivas
- No permitan subarrendar la habitación

## Señales de alerta

⚠️ **Desconfía si:**
- Te piden dinero antes de ver el piso
- El precio es demasiado bajo
- El propietario tiene prisa por firmar
- No te dan copia del contrato`
  },
  {
    id: 4,
    title: "Cómo aprobar tus exámenes: Técnicas de estudio efectivas",
    excerpt: "Métodos probados para estudiar mejor y conseguir mejores resultados académicos.",
    date: "2024-03-10",
    author: "María García",
    category: "estudiante",
    image: tecnicasEstudio,
    readTime: 7,
    content: `## Estudiar mejor, no más

La clave del éxito académico no está en las horas que dedicas, sino en cómo las aprovechas.

## Técnica Pomodoro

Una de las técnicas más efectivas para mantener la concentración:

1. **25 minutos** de estudio intenso
2. **5 minutos** de descanso
3. Cada 4 pomodoros, descanso de **15-30 minutos**

### Por qué funciona
- Mantiene la mente fresca
- Reduce la fatiga mental
- Aumenta la productividad

## Active Recall

En lugar de releer, **ponte a prueba**:

- Cierra el libro e intenta recordar
- Usa flashcards (físicas o apps como Anki)
- Explica el tema en voz alta
- Hazte preguntas sobre el material

## Spaced Repetition

Distribuye el estudio en el tiempo:

| Repaso | Cuándo |
|--------|--------|
| 1º | Mismo día |
| 2º | Al día siguiente |
| 3º | A la semana |
| 4º | Al mes |

## El entorno perfecto para estudiar

- **Iluminación**: Natural o luz blanca
- **Temperatura**: 20-22°C ideal
- **Ruido**: Silencio o ruido blanco
- **Móvil**: En otra habitación o modo avión

## Antes del examen

- **Noche anterior**: Repaso ligero, dormir bien
- **Día del examen**: Desayuno completo, llegar con tiempo
- **Durante**: Lee todo primero, empieza por lo fácil

Recuerda: la consistencia supera a la intensidad.`
  },
  {
    id: 5,
    title: "Gestión del tiempo: Equilibra estudios y vida social",
    excerpt: "Consejos prácticos para organizar tu agenda y disfrutar de la vida universitaria.",
    date: "2024-03-06",
    author: "Ana Torres",
    category: "estudiante",
    image: gestionTiempo,
    readTime: 6,
    content: `## El arte del equilibrio

La universidad no es solo estudiar. Aprender a equilibrar responsabilidades y diversión es una habilidad para toda la vida.

## Planificación semanal

Dedica **30 minutos el domingo** a planificar tu semana:

1. Lista todas las tareas y compromisos
2. Asigna tiempo a cada actividad
3. Incluye tiempo para ti
4. Deja margen para imprevistos

## Bloques de tiempo

Agrupa actividades similares:

- **Mañanas**: Clases y estudio intenso
- **Tardes**: Trabajo en grupo, actividades
- **Noches**: Descanso, vida social

## Los "ladrones" de tiempo

Identifica y limita:
- Redes sociales (usa temporizadores)
- Netflix sin control
- Conversaciones improductivas
- Perfeccionismo excesivo

## Decir "no" sin culpa

No puedes hacerlo todo. Aprende a:
- Priorizar lo importante
- Rechazar compromisos que no aportan
- Delegar cuando sea posible

## Herramientas útiles

- **Google Calendar**: Para citas y eventos
- **Notion**: Para notas y proyectos
- **Forest**: Para evitar distracciones
- **Todoist**: Para listas de tareas`
  },
  {
    id: 6,
    title: "10 apps imprescindibles para estudiantes",
    excerpt: "Las mejores aplicaciones móviles que todo estudiante debería tener instaladas.",
    date: "2024-03-03",
    author: "Javier Sánchez",
    category: "estudiante",
    image: appsEstudiantes,
    readTime: 5,
    content: `## Apps que cambiarán tu vida universitaria

Aprovecha la tecnología para estudiar mejor y organizarte.

## Productividad

### 1. Notion
La app todo-en-uno para notas, proyectos y bases de datos.
- ✅ Gratis para estudiantes
- ✅ Plantillas para apuntes
- ✅ Sincronización en la nube

### 2. Forest
Mantén el foco plantando árboles virtuales.
- 🌳 Gamificación del estudio
- 📵 Bloquea distracciones
- 🌍 Planta árboles reales

### 3. Todoist
Gestión de tareas sencilla y potente.
- ✅ Integración con calendario
- ✅ Proyectos compartidos
- ✅ Recordatorios inteligentes

## Estudio

### 4. Anki
Flashcards con repetición espaciada.
- 🧠 Memorización científica
- 📚 Mazos compartidos
- 📱 Sincroniza entre dispositivos

### 5. Quizlet
Crea y comparte sets de estudio.
- 🎮 Modos de juego
- 👥 Colaboración
- 🌐 Millones de sets públicos

## Finanzas

### 6. Splitwise
Para dividir gastos con compañeros de piso.
- 💰 Seguimiento de deudas
- 📊 Resumen de gastos
- 🏠 Grupos de piso

## Utilidades

### 7. CamScanner
Escanea documentos con el móvil.
- 📄 OCR incluido
- ☁️ Sincronización
- 📧 Compartir fácil

### 8. Tranvía Zaragoza
La app oficial del transporte.
- 🚊 Horarios en tiempo real
- 🗺️ Planificador de rutas
- 💳 Recarga de tarjeta`
  },
  {
    id: 7,
    title: "Cómo ahorrar dinero siendo estudiante",
    excerpt: "Trucos y consejos para estirar tu presupuesto mensual sin renunciar a nada importante.",
    date: "2024-03-05",
    author: "Carlos Martínez",
    category: "consejos",
    image: ahorrarDinero,
    readTime: 6,
    content: `## Vive bien gastando menos

Ser estudiante no significa vivir en la miseria. Con estos trucos, estirarás tu presupuesto al máximo.

## El presupuesto mensual ideal

| Categoría | % del presupuesto |
|-----------|-------------------|
| Alquiler | 40-50% |
| Alimentación | 20-25% |
| Transporte | 10% |
| Ocio | 10-15% |
| Ahorro | 5-10% |

## Alimentación

### Compra inteligente
- **Mercadona**: Buenos precios en básicos
- **Lidl**: Ofertas semanales
- **Mercados locales**: Fruta y verdura barata

### Trucos de cocina
- Cocina en batch el domingo
- Aprovecha las ofertas de "próximo a caducar"
- Lleva tupper a la facultad

## Transporte

- **Bono joven**: Transporte público con descuento
- **Bizi Zaragoza**: Bici gratis con abono anual
- **Compartir coche**: Para viajes a casa

## Ocio

### Gratis o casi gratis
- Museos: Gratis el primer domingo del mes
- Cine: Días del espectador
- Eventos universitarios: Conferencias, conciertos

### Descuentos de estudiante
- Spotify: 50% descuento
- Amazon Prime: Precio reducido
- Adobe: Packs educativos

## El truco de los 30 días

Antes de una compra no esencial:
1. Anótala en una lista
2. Espera 30 días
3. Si aún la quieres, cómprala

## Apps para ahorrar

- **Too Good To Go**: Comida de restaurantes con descuento
- **Wallapop**: Compra y vende segunda mano
- **Groupon**: Ofertas en ocio y restaurantes`
  },
  {
    id: 8,
    title: "Recetas rápidas y económicas para estudiantes",
    excerpt: "Platos fáciles de preparar que no arruinarán tu presupuesto ni tu tiempo.",
    date: "2024-03-01",
    author: "Elena Rodríguez",
    category: "consejos",
    image: recetasEstudiantes,
    readTime: 7,
    content: `## Cocina fácil y barata

No necesitas ser chef para comer bien. Estas recetas son perfectas para principiantes.

## Básicos en tu despensa

- Arroz, pasta, legumbres
- Aceite de oliva
- Sal, pimienta, ajo
- Huevos
- Tomate frito
- Atún en lata

## Recetas de 15 minutos

### Pasta al ajillo
- Pasta cocida
- 2 dientes de ajo laminados
- Aceite de oliva, guindilla
- Perejil (opcional)

### Tortilla de patatas exprés
- 3 huevos
- 2 patatas medianas (microondas 5 min)
- Sal
- Aceite para freír

### Arroz tres delicias
- Arroz del día anterior
- Huevo revuelto
- Guisantes congelados
- Jamón york picado

## Trucos de supervivencia

1. **Congela por raciones**: Descongela solo lo que vayas a comer
2. **Un plato = una comida**: Ahorra en vajilla y tiempo
3. **El huevo lo salva todo**: Añádelo a cualquier plato
4. **Salsas caseras**: Más baratas y sanas que las compradas

## Menú semanal tipo

| Día | Comida | Cena |
|-----|--------|------|
| Lunes | Lentejas | Tortilla + ensalada |
| Martes | Pasta boloñesa | Sándwich + fruta |
| Miércoles | Lentejas | Revuelto de verduras |
| Jueves | Arroz con pollo | Pizza casera |
| Viernes | Pasta carbonara | ¡Te lo has ganado! |`
  },
  {
    id: 9,
    title: "Guía de bienestar mental para universitarios",
    excerpt: "Cómo cuidar tu salud mental durante la etapa universitaria y gestionar el estrés.",
    date: "2024-02-28",
    author: "Dr. Pablo Jiménez",
    category: "consejos",
    image: bienestarMental,
    readTime: 8,
    content: `## Tu salud mental importa

La universidad puede ser estresante. Aprender a cuidarte es tan importante como aprobar.

## Señales de alerta

Presta atención si experimentas:
- Ansiedad constante
- Dificultad para dormir
- Pérdida de interés en actividades
- Aislamiento social
- Cambios en el apetito

## Técnicas de gestión del estrés

### Respiración 4-7-8
1. Inhala 4 segundos
2. Mantén 7 segundos
3. Exhala 8 segundos
4. Repite 4 veces

### Mindfulness básico
- 5 minutos al día
- Enfócate en la respiración
- Observa sin juzgar
- Apps: Headspace, Calm

### Journaling
- Escribe tus pensamientos
- Sin filtro ni autocensura
- 10 minutos antes de dormir
- Ayuda a procesar emociones

## Hábitos saludables

### Sueño
- 7-8 horas mínimo
- Horario regular
- Nada de pantallas antes de dormir

### Ejercicio
- 30 min, 3 veces por semana
- Caminar cuenta
- El ejercicio reduce ansiedad

### Alimentación
- Evita exceso de cafeína
- Hidrátate bien
- Comidas regulares

## Cuándo pedir ayuda

Es **normal y valiente** pedir ayuda. Recursos disponibles:

- **Servicio de Psicología de la Universidad**: Gratuito para estudiantes
- **Teléfono de la Esperanza**: 717 003 717

## Construye tu red de apoyo

- Mantén contacto con familia
- Cultiva amistades
- Participa en actividades
- No te aísles

Recuerda: pedir ayuda no es debilidad, es inteligencia.`
  },
  {
    id: 10,
    title: "Fiestas universitarias: Calendario de eventos en Zaragoza",
    excerpt: "Los mejores eventos y fiestas para estudiantes durante este semestre.",
    date: "2024-02-25",
    author: "Sara Fernández",
    category: "eventos",
    image: fiestasUniversitarias,
    readTime: 5,
    content: `## No te pierdas nada

Zaragoza tiene una vida nocturna vibrante. Aquí tienes el calendario de eventos imprescindibles.

## Fiestas universitarias clásicas

### Jueves universitario
- **Cuándo**: Todos los jueves
- **Dónde**: Zona El Tubo y El Rollo
- **Precio**: Entrada libre + consumición

### San Pepe (19 marzo)
- La fiesta grande de los universitarios
- Conciertos en el campus
- Ambiente increíble

### Pilares (octubre)
- Fiestas de la ciudad
- Conciertos gratuitos
- Ambiente increíble

## Locales populares

### Para empezar la noche
- **El Tubo**: Bares de tapas y copas
- **La Zona**: Terrazas y ambiente

### Para bailar
- **Supernova**: Indie y alternativo
- **La Casa del Loco**: Rock y punk
- **Oasis**: Comercial y reggaetón

## Consejos de seguridad

### Antes de salir
- Come bien
- Deja el móvil cargado
- Avisa a alguien de tus planes

### Durante la noche
- No aceptes bebidas de extraños
- Mantente con tu grupo
- Controla lo que bebes

### Para volver
- Taxi: 976 757 575
- Búhos: Buses nocturnos
- Uber/Cabify disponibles

## Calendario semestral

| Mes | Evento destacado |
|-----|------------------|
| Septiembre | Bienvenida universitaria |
| Octubre | Pilares |
| Noviembre | Halloween universitario |
| Diciembre | Fiestas de Navidad |
| Febrero | Carnavales |
| Marzo | San Pepe |`
  },
  {
    id: 11,
    title: "Deportes y actividades: Únete a clubs universitarios",
    excerpt: "Descubre los diferentes clubs deportivos y de ocio disponibles en la universidad.",
    date: "2024-02-20",
    author: "Miguel Ángel López",
    category: "eventos",
    image: deportesClubs,
    readTime: 6,
    content: `## Más que estudiar

La universidad ofrece mucho más que clases. Descubre cómo aprovechar al máximo tu experiencia.

## Deportes en la Universidad de Zaragoza

### Instalaciones disponibles
- Pabellón deportivo
- Piscina cubierta
- Pistas de tenis y pádel
- Gimnasio universitario

### Deportes de equipo
- Fútbol sala
- Baloncesto
- Voleibol
- Rugby
- Handball

### Deportes individuales
- Natación
- Atletismo
- Tenis
- Artes marciales
- Fitness

## Cómo apuntarte

1. Visita el SAE (Servicio de Actividades Extracurriculares)
2. Consulta disponibilidad
3. Paga la cuota (muy reducida)
4. ¡Empieza a entrenar!

### Precios orientativos
- Gimnasio: 60€/año
- Actividades dirigidas: 30-50€/cuatrimestre
- Competiciones: Incluido en matrícula

## Clubs y asociaciones

### Culturales
- Teatro universitario
- Tuna y grupos musicales
- Debate y oratoria
- Fotografía

### Sociales
- Voluntariado
- Medio ambiente
- Cooperación internacional
- Derechos humanos

## Beneficios de participar

- 🤝 Conocer gente nueva
- 💪 Mejorar tu salud
- 📝 Créditos ECTS (algunas actividades)
- 📄 Puntos para CV`
  },
  {
    id: 12,
    title: "Festivales y conciertos en Zaragoza para estudiantes",
    excerpt: "No te pierdas los mejores eventos culturales con descuentos para estudiantes.",
    date: "2024-02-15",
    author: "Andrea Gómez",
    category: "eventos",
    image: festivalesConciertos,
    readTime: 5,
    content: `## Cultura para todos los bolsillos

Zaragoza es una ciudad cultural con eventos para todos los gustos. Y con carné de estudiante, ¡más barato!

## Festivales imprescindibles

### Pirineos Sur (julio)
- Festival en un pantano
- Músicas del mundo
- Descuento estudiantes: 20%

### Vive Latino (junio)
- Música latina y urbana
- En el recinto Expo
- Abonos desde 40€

### Festival de Jazz (noviembre)
- Auditorio de Zaragoza
- Artistas internacionales
- Entradas estudiante: 50%

## Conciertos durante el curso

### Salas pequeñas
- **Las Armas**: Indie y alternativo
- **La Casa del Loco**: Rock
- **Sala Oasis**: Urbano
- Entradas: 10-20€

### Grandes eventos
- Auditorio
- Pabellón Príncipe Felipe
- Plaza del Pilar (gratuitos)

## Descuentos con carné

| Venue | Descuento |
|-------|-----------|
| Teatro Principal | 50% |
| Filmoteca | Entrada reducida |
| Museos | Gratis/reducido |
| Cines | Día del espectador |

## Agenda cultural gratuita

- **Domingos**: Museos gratis
- **Jueves**: Cine en versión original
- **Verano**: Cine al aire libre
- **Pilares**: Conciertos gratuitos`
  },
  {
    id: 13,
    title: "Guía legal del alquiler: Derechos y obligaciones del inquilino",
    excerpt: "Todo lo que necesitas saber sobre contratos de alquiler, fianzas y tus derechos como estudiante inquilino.",
    date: "2024-03-20",
    author: "Abogado Juan Pérez",
    category: "legalidad",
    image: checklistAlquiler,
    readTime: 10,
    content: `## Conoce tus derechos

Como inquilino, la ley te protege. Conocer tus derechos es fundamental para evitar abusos.

## La Ley de Arrendamientos Urbanos (LAU)

Es la ley que regula todos los alquileres de vivienda en España.

### Duración del contrato
- **Mínimo legal**: 5 años (particulares) / 7 años (empresas)
- Puedes irte antes con 30 días de preaviso (tras 6 meses)
- Penalización máxima: 1 mes por año restante

### La fianza
- **Máximo legal**: 2 meses de renta
- Debe depositarse en el organismo oficial (IBAVI en Aragón)
- Devolución: 30 días tras entrega de llaves

## Tus derechos como inquilino

### Vivienda en condiciones
- Habitabilidad garantizada
- Reparaciones estructurales: las paga el propietario
- Suministros funcionando

### Privacidad
- El propietario NO puede entrar sin tu permiso
- Visitas solo con aviso previo y consentimiento
- Tu correspondencia es privada

### Renovación
- Derecho a renovar hasta 5/7 años
- No pueden echarte sin causa justificada
- Preaviso mínimo de 4 meses para no renovar

## Obligaciones del inquilino

- Pagar la renta puntualmente
- Cuidar la vivienda
- Permitir reparaciones necesarias
- Respetar normas de convivencia
- Avisar de desperfectos

## Cláusulas abusivas (ilegales)

⚠️ **Son nulas aunque las firmes:**
- Fianza superior a 2 meses
- Prohibir tener mascotas (depende)
- Renunciar a derechos irrenunciables
- Obligar a abandonar por venta

## Recursos útiles

- OCU: Organización de Consumidores
- FACUA: Defensa del consumidor
- Oficina de Vivienda del Ayuntamiento`
  },
  {
    id: 14,
    title: "Cómo reclamar tu fianza: Pasos y plazos legales",
    excerpt: "Guía completa sobre el proceso de devolución de fianza y qué hacer si el propietario no la devuelve.",
    date: "2024-03-18",
    author: "Equipo Legal Livix",
    category: "legalidad",
    image: pisosEstudiante,
    readTime: 7,
    content: `## Recupera tu dinero

La fianza es tuya. Si has cuidado el piso, debes recuperarla íntegramente.

## El proceso normal

### Al entregar las llaves
1. Haz fotos del estado final
2. Firma un acta de entrega
3. Entrega las llaves contra recibo
4. Solicita fecha de devolución

### Plazos legales
- **Máximo 30 días** desde la entrega
- Si hay desperfectos, debe justificarlos
- Intereses si se retrasa

## Deducciones legítimas

El propietario SÍ puede descontar:

- Daños causados por el inquilino
- Rentas impagadas
- Suministros pendientes
- Limpieza extraordinaria (si dejaste sucio)

### NO puede descontar:

- Desgaste normal por uso
- Pintura por el paso del tiempo
- Reparaciones de mantenimiento
- Averías de electrodomésticos por uso

## Si no te devuelven la fianza

### Paso 1: Requerimiento escrito
Envía un burofax indicando:
- Fecha de entrega de llaves
- Cantidad a devolver
- Plazo de 15 días
- Advertencia de acciones legales

### Paso 2: Reclamación extrajudicial
- Oficina de consumo
- Mediación municipal
- Asociaciones de inquilinos

### Paso 3: Vía judicial
- Demanda verbal (hasta 6.000€)
- No necesitas abogado (hasta 2.000€)
- Incluye intereses y costas

## Prevención: Documenta todo

- Fotos al entrar Y al salir
- Inventario firmado
- Comunicaciones por escrito
- Recibos de todos los pagos`
  },
  {
    id: 15,
    title: "Contratos de alquiler: Qué debe incluir y qué evitar",
    excerpt: "Cláusulas importantes, cláusulas abusivas y consejos para firmar tu contrato con seguridad.",
    date: "2024-03-16",
    author: "Laura Sánchez",
    category: "legalidad",
    image: zonasUniversidad,
    readTime: 8,
    content: `## El contrato perfecto

Un buen contrato te protege. Aprende a identificar las cláusulas importantes y las problemáticas.

## Contenido obligatorio

Todo contrato debe incluir:

### Identificación de las partes
- Nombre completo y DNI del propietario
- Nombre completo y DNI del inquilino
- Datos de contacto de ambos

### Descripción del inmueble
- Dirección completa
- Referencia catastral
- Metros cuadrados
- Mobiliario incluido (inventario)

### Condiciones económicas
- Renta mensual
- Forma de pago
- Actualización anual (IPC)
- Fianza depositada

### Duración
- Fecha de inicio
- Duración pactada
- Condiciones de prórroga
- Preaviso para no renovar

## Cláusulas recomendables

### Para el inquilino
- Derecho de tanteo en caso de venta
- Subrogación del contrato
- Posibilidad de subarrendar habitaciones
- Plazo para comunicar desperfectos

### Para ambas partes
- Procedimiento para reparaciones
- Reparto de gastos claro
- Forma de comunicaciones
- Inventario detallado adjunto

## Cláusulas abusivas

⚠️ **Aunque las firmes, son nulas:**

### Económicas
- Fianza superior a 2 meses
- Penalizaciones desproporcionadas
- Obligación de pagar reparaciones estructurales

### De duración
- Renunciar al plazo mínimo legal
- Permanencia obligatoria superior a 6 meses
- Desahucio exprés sin procedimiento

## Antes de firmar

### Checklist
- He leído todo el contrato
- Entiendo todas las cláusulas
- Tengo copia del DNI del propietario
- He visto el piso en persona
- Tengo fotos del estado actual
- El inventario es correcto
- Sé cómo se actualizará la renta`
  },
  {
    id: 16,
    title: "Becas MEC 2024-2025: Requisitos y cómo solicitarlas",
    excerpt: "Guía actualizada sobre las becas del Ministerio de Educación, requisitos, plazos y documentación necesaria.",
    date: "2024-03-22",
    author: "Departamento de Becas",
    category: "becas",
    image: gestionTiempo,
    readTime: 9,
    content: `## Todo sobre las becas MEC

Las becas del Ministerio de Educación son la principal ayuda para estudiantes universitarios en España.

## Tipos de ayuda

### Cuantía fija
- Renta: 1.700€
- Residencia: 2.500€
- Excelencia académica: 50-125€

### Cuantía variable
- Según nota y renta
- Mínimo: 60€
- Sin máximo establecido

### Matrícula
- Cobertura total o parcial
- Incluye tasas administrativas

## Requisitos económicos

### Umbrales de renta familiar (2024-2025)

| Miembros | Umbral 1 | Umbral 2 | Umbral 3 |
|----------|----------|----------|----------|
| 1 | 8.871€ | 14.112€ | 15.279€ |
| 2 | 13.307€ | 24.089€ | 26.096€ |
| 3 | 17.743€ | 32.697€ | 35.407€ |
| 4 | 22.178€ | 38.831€ | 42.041€ |

## Requisitos académicos

### Nuevo ingreso
- No hay requisito de nota
- Matriculado de al menos 60 créditos

### Resto de cursos
- Aprobar al menos 50% de créditos
- Nota media mínima: 5,0

### Másteres
- Nota del grado: mínimo 6,5
- Matricularse de mínimo 60 créditos

## Cómo solicitarla

### Paso 1: Prepara la documentación
- DNI/NIE vigente
- Datos bancarios
- Renta familiar (Hacienda)
- Matrícula universidad

### Paso 2: Solicitud online
1. Accede a sede.educacion.gob.es
2. Identifícate con Cl@ve
3. Completa el formulario
4. Revisa y envía

## Plazos 2024-2025

| Fase | Fecha |
|------|-------|
| Apertura solicitudes | Marzo 2024 |
| Fin solicitudes | Mayo 2024 |
| Resolución provisional | Octubre 2024 |
| Alegaciones | 10 días |
| Resolución definitiva | Noviembre 2024 |
| Pago | Diciembre 2024 |

## Errores comunes

❌ **Evita:**
- Solicitar fuera de plazo
- Datos bancarios incorrectos
- No responder requerimientos
- Olvidar adjuntar documentos
- Declaración de renta incompleta`
  },
  {
    id: 17,
    title: "Ayudas al alquiler para estudiantes en Aragón",
    excerpt: "Todas las ayudas y subvenciones disponibles para estudiantes que alquilan vivienda en Zaragoza.",
    date: "2024-03-19",
    author: "Equipo Livix",
    category: "becas",
    image: ahorrarDinero,
    readTime: 6,
    content: `## Ayudas para tu alquiler

Además de las becas MEC, existen ayudas específicas para alquiler en Aragón.

## Bono Alquiler Joven

### Requisitos
- Edad: 18-35 años
- Ingresos máximos: 3x IPREM (25.200€/año)
- Alquiler máximo: 600€/mes
- Contrato de alquiler vigente

### Cuantía
- **250€/mes** durante 2 años
- Compatible con otras ayudas

### Cómo solicitarlo
1. Sede electrónica de Aragón
2. Documentación requerida
3. Resolución en 3 meses

## Ayudas del Gobierno de Aragón

### Plan de Vivienda
- Para jóvenes y familias
- Hasta 40% del alquiler
- Convocatoria anual

### Requisitos generales
- Empadronamiento en Aragón
- No superar umbrales de renta
- Vivienda habitual y permanente

## Ayudas municipales de Zaragoza

### Zaragoza Vivienda
- Bolsa de alquiler social
- Mediación con propietarios
- Ayudas de emergencia

### Oficina Municipal
- Asesoramiento gratuito
- Gestión de ayudas
- Mediación en conflictos

## Compatibilidades

| Ayuda | Compatible con... |
|-------|-------------------|
| Bono Alquiler Joven | Beca MEC residencia |
| Ayuda Aragón | Bono Alquiler Joven |
| Beca MEC residencia | Ayudas municipales |

## Documentación general

- DNI/NIE
- Empadronamiento
- Contrato de alquiler
- Declaración de renta
- Justificante de matrícula
- Certificado bancario`
  },
  {
    id: 18,
    title: "Programas Erasmus+: Cómo solicitar y maximizar tu beca",
    excerpt: "Consejos para conseguir financiación para tu experiencia Erasmus y gestionar tu presupuesto.",
    date: "2024-03-14",
    author: "Oficina Erasmus",
    category: "becas",
    image: appsEstudiantes,
    readTime: 7,
    content: `## Tu aventura Erasmus

El programa Erasmus+ es una oportunidad única. Aquí tienes todo lo que necesitas saber sobre la financiación.

## Tipos de movilidad

### Estudios
- 3-12 meses en universidad europea
- Créditos convalidables
- Beca mensual

### Prácticas
- 2-12 meses en empresa
- Experiencia profesional
- Beca ligeramente superior

## Cuantías 2024-2025

### Por país de destino

| Grupo | Países | Estudios | Prácticas |
|-------|--------|----------|-----------|
| 1 | Dinamarca, Finlandia, Irlanda, Noruega, Suecia | 350€ | 500€ |
| 2 | Alemania, Austria, Bélgica, Francia, Italia, Países Bajos | 300€ | 450€ |
| 3 | Bulgaria, Croacia, Polonia, República Checa, Rumanía | 250€ | 400€ |

### Complementos
- Discapacidad: +250€/mes
- Situación socioeconómica desfavorable: +250€/mes

## Proceso de solicitud

### Paso 1: Informarte
- Oficina de Relaciones Internacionales
- Plazos de tu universidad
- Destinos disponibles

### Paso 2: Requisitos previos
- Nivel de idioma (B1-B2 según destino)
- Expediente académico
- 60 créditos superados

### Paso 3: Solicitud
- Formulario online
- Carta de motivación
- Certificado de idioma
- Expediente académico

## Maximiza tu beca

### Antes de ir
- Busca alojamiento con tiempo
- Compara opciones de transporte
- Abre cuenta bancaria sin comisiones

### Durante la estancia
- Cocina en casa
- Aprovecha descuentos de estudiante
- Viaja en temporada baja
- Usa transporte público

### Ayudas complementarias

| Ayuda | Cuantía | Requisitos |
|-------|---------|------------|
| Beca MEC Erasmus | Variable | Umbral de renta |
| Gobierno de Aragón | 200€/mes | Residencia en Aragón |
| Santander | Variable | Convocatoria propia |`
  }
];

export const categories = [
  { id: "all" as BlogCategory, label: "Todo" },
  { id: "pisos" as BlogCategory, label: "Información Pisos" },
  { id: "legalidad" as BlogCategory, label: "Legalidad" },
  { id: "becas" as BlogCategory, label: "Becas y Ayudas" },
  { id: "estudiante" as BlogCategory, label: "Vida Universitaria" },
  { id: "consejos" as BlogCategory, label: "Consejos" },
  { id: "eventos" as BlogCategory, label: "Eventos" },
];
