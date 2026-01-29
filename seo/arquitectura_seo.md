# Arquitectura SEO Livix Zaragoza

## 🔴 CRÍTICA AL KEYWORD PLANNER

### Problemas detectados en los datos

| Problema | Descripción | Impacto |
|----------|-------------|---------|
| **Volúmenes redondeados agresivamente** | Solo 3 niveles: 5000, 500, 50. No hay valores intermedios (1000, 2000, 100, 200...) | Difícil priorizar entre keywords del mismo bucket |
| **243 keywords con volumen 0** | 51% de tus keywords no tienen datos | No sabes si tienen búsquedas reales o no |
| **Sin datos granulares de long-tail** | Keywords específicas como "habitacion gastos incluidos zaragoza" aparecen sin datos | Perdemos oportunidades de contenido específico |
| **Competencia genérica** | Solo "Alta", "Media", "Baja" sin valores numéricos | No puedes calcular keyword difficulty real |
| **Sin CTR estimado orgánico** | Solo muestra datos de Ads, no SEO | El comportamiento orgánico puede ser muy diferente |
| **Sesgo hacia Ads** | Keyword Planner está diseñado para PPC, no SEO | Subestima keywords informacionales |

### Recomendación
Para un keyword research más preciso en el futuro, complementa con:
- **Ubersuggest** (gratis limitado) - Mejor para long-tail
- **Ahrefs/SEMrush** (de pago) - Keyword difficulty real
- **Google Search Console** (cuando tengas tráfico) - Datos reales

---

## 📊 RESUMEN DEL KEYWORD PLAN

```
Total keywords:        476
Con volumen > 0:       233 (49%)
Sin volumen:           243 (51%)
Volumen total:         43,150 búsquedas/mes

Distribución por volumen:
  5,000+:      3 keywords (cabezas)
  500-999:    37 keywords (cuerpo)  
  50-99:     193 keywords (cola larga)
```

### Top 10 Keywords por Volumen

| Vol | Competencia | Keyword |
|----:|-------------|---------|
| 5000 | Media | residencia estudiantes zaragoza |
| 5000 | Media | residencia zaragoza |
| 5000 | Media | residencias zaragoza |
| 500 | Baja | alojamiento unizar |
| 500 | Baja | alquiler piso estudiantes zaragoza |
| 500 | Baja | piso estudiantes zaragoza |
| 500 | Baja | colegio mayor zaragoza |
| 500 | Media | habitacion barata zaragoza |
| 500 | Media | pisos para estudiantes |
| 500 | Media | residencias de estudiantes en zaragoza |

---

## 🏗️ ARQUITECTURA SEO PROPUESTA

### Estructura de URLs

```
livix.es/
│
├── / (HOME)
│   └── Target: "alojamiento estudiantes zaragoza" + branding
│
├── /habitaciones/
│   ├── /habitaciones/zaragoza/                    → "habitaciones estudiantes zaragoza"
│   ├── /habitaciones/zaragoza/delicias/           → "habitacion delicias zaragoza"
│   ├── /habitaciones/zaragoza/actur/              → "habitacion actur estudiantes"
│   ├── /habitaciones/zaragoza/centro/             → "habitacion centro zaragoza"
│   └── /habitaciones/zaragoza/[barrio]/           → landing por barrio
│
├── /pisos/
│   ├── /pisos/zaragoza/                           → "pisos estudiantes zaragoza" (500 vol)
│   ├── /pisos/zaragoza/compartidos/               → "piso compartido estudiantes zaragoza"
│   └── /pisos/zaragoza/[barrio]/                  → landing por barrio
│
├── /residencias/
│   ├── /residencias/zaragoza/                     → "residencias estudiantes zaragoza" (5000 vol) ⭐
│   ├── /residencias/zaragoza/comparar/            → "residencia vs piso zaragoza"
│   └── /residencias/zaragoza/[nombre]/            → fichas de residencias
│
├── /colegios-mayores/
│   └── /colegios-mayores/zaragoza/                → "colegio mayor zaragoza" (500 vol)
│
├── /roommates/
│   ├── /roommates/                                → "busco compañero piso zaragoza"
│   └── /roommates/zaragoza/                       → feature page roommates
│
├── /campus/
│   ├── /campus/san-francisco/                     → "alojamiento campus san francisco"
│   └── /campus/rio-ebro/                          → "habitacion campus rio ebro"
│
├── /blog/
│   ├── /blog/guia-estudiante-zaragoza/            → "vivir en zaragoza estudiante"
│   ├── /blog/mejores-barrios-estudiantes/         → "mejores barrios estudiantes zaragoza"
│   ├── /blog/coste-vida-zaragoza/                 → "coste vida estudiante zaragoza"
│   ├── /blog/residencia-vs-piso/                  → "residencia o piso zaragoza"
│   └── /blog/evitar-estafas-alquiler/             → "estafas alquiler estudiantes"
│
└── /legal/
    ├── /legal/privacy/
    ├── /legal/terms/
    └── /legal/cookies/
```

---

## 📋 CLUSTERING DE KEYWORDS POR PÁGINA

### 1. HOME (/)
**Keyword principal:** alojamiento estudiantes zaragoza  
**Secundarias:**
- vivienda estudiantes zaragoza
- alquiler estudiantes zaragoza
- donde vivir estudiante zaragoza

---

### 2. /residencias/zaragoza/ ⭐ PÁGINA PRIORITARIA
**Keyword principal:** residencias estudiantes zaragoza (5000 vol)  
**Secundarias:**
- residencia zaragoza (5000)
- residencias zaragoza (5000)
- residencia universitaria zaragoza
- residencias universitarias zaragoza unizar
- residencias de estudiantes en zaragoza (500)
- residencias en zaragoza para estudiantes (500)
- residencias baratas zaragoza (500)
- mejores residencias zaragoza

> ⚠️ Esta página debe ser tu PRIORIDAD #1. Tiene el mayor volumen de búsquedas.

---

### 3. /pisos/zaragoza/
**Keyword principal:** pisos estudiantes zaragoza (500 vol)  
**Secundarias:**
- piso estudiantes zaragoza (500)
- alquiler piso estudiantes zaragoza (500)
- pisos de estudiantes zaragoza (500)
- pisos para estudiantes (500)
- pisos unizar (500)
- alquiler pisos para estudiantes zaragoza

---

### 4. /habitaciones/zaragoza/
**Keyword principal:** habitaciones estudiantes zaragoza  
**Secundarias:**
- habitacion estudiante (500)
- habitacion barata zaragoza (500)
- habitacion de estudiante (500)
- alquiler habitaciones estudiantes (500)
- alquiler de habitaciones para estudiantes en zaragoza (500)
- habitaciones de alquiler en zaragoza baratas (500)

---

### 5. /colegios-mayores/zaragoza/
**Keyword principal:** colegio mayor zaragoza (500 vol)  
**Secundarias:**
- colegios mayores zaragoza
- cmu virgen del carmen zaragoza (500)
- colegio mayor pedro cerbuna zaragoza
- colegio mayor unizar

---

### 6. /roommates/ (Feature page)
**Keyword principal:** busco compañero piso zaragoza  
**Secundarias:**
- roommate zaragoza (50)
- compartir piso estudiantes zaragoza
- busco roomie zaragoza
- compañero piso zaragoza

---

### 7. Landings por BARRIO (/habitaciones/zaragoza/[barrio]/)

| Barrio | URL | Keyword Target |
|--------|-----|----------------|
| Delicias | /habitaciones/zaragoza/delicias/ | habitacion delicias zaragoza |
| Actur | /habitaciones/zaragoza/actur/ | habitacion actur estudiantes |
| Centro | /habitaciones/zaragoza/centro/ | habitacion centro zaragoza |
| Las Fuentes | /habitaciones/zaragoza/las-fuentes/ | habitacion las fuentes zaragoza |
| Romareda | /habitaciones/zaragoza/romareda/ | habitacion romareda estudiantes |
| San José | /habitaciones/zaragoza/san-jose/ | alquiler habitacion san jose zaragoza (50 vol) |

---

### 8. Landings por CAMPUS (/campus/[campus]/)

| Campus | URL | Keyword Target |
|--------|-----|----------------|
| San Francisco | /campus/san-francisco/ | habitacion campus san francisco |
| Río Ebro | /campus/rio-ebro/ | habitacion campus rio ebro |

---

### 9. BLOG - Contenido Informacional

| URL | Keyword Target | Tipo |
|-----|----------------|------|
| /blog/guia-estudiante-zaragoza/ | vivir zaragoza estudiante | Guía completa |
| /blog/mejores-barrios-estudiantes/ | mejores barrios estudiantes zaragoza (50) | Listicle |
| /blog/coste-vida-zaragoza/ | coste vida estudiante zaragoza | Info |
| /blog/residencia-vs-piso/ | que es mejor residencia o piso (50) | Comparativa |
| /blog/evitar-estafas-alquiler/ | estafas alquiler estudiantes | Guía |
| /blog/como-alquilar-habitacion/ | consejos alquilar piso zaragoza | Tutorial |

---

## 🔗 ESTRATEGIA DE INTERNAL LINKING

```
                    HOME
                     │
        ┌────────────┼────────────┐
        │            │            │
   /residencias  /pisos     /habitaciones
        │            │            │
        └────────────┼────────────┘
                     │
              (cross-links)
                     │
        ┌────────────┼────────────┐
        │            │            │
   /campus      /roommates     /blog
```

### Reglas de linking:
1. **Desde HOME** → Link a las 3 categorías principales (residencias, pisos, habitaciones)
2. **Desde categorías** → Link cruzado entre ellas + link a blog relevante
3. **Desde blog** → Link a categorías/landings relacionadas
4. **Desde landings barrio** → Link a otras landings de barrios cercanos

---

## 📈 PRIORIDAD DE IMPLEMENTACIÓN

### Fase 1: Quick Wins (Páginas de alto volumen)
1. ✅ `/residencias/zaragoza/` - 5000 vol, PRIORIDAD MÁXIMA
2. ✅ `/pisos/zaragoza/` - 500 vol
3. ✅ `/habitaciones/zaragoza/` - 500 vol
4. ✅ `/colegios-mayores/zaragoza/` - 500 vol

### Fase 2: Landings por barrio
5. `/habitaciones/zaragoza/delicias/`
6. `/habitaciones/zaragoza/actur/`
7. `/habitaciones/zaragoza/centro/`
8. (etc... 6 barrios principales)

### Fase 3: Contenido Blog
9. Guía estudiante Zaragoza
10. Mejores barrios
11. Coste de vida
12. Residencia vs piso

### Fase 4: Landings campus + roommates
13. `/campus/san-francisco/`
14. `/campus/rio-ebro/`
15. `/roommates/` feature page

---

## 🔧 NEXT STEPS TÉCNICOS

1. **Crear páginas** con la estructura propuesta
2. **Optimizar meta tags**: Title con keyword principal, meta description con CTA
3. **Schema markup**: LocalBusiness, RealEstateListing
4. **Contenido**: Mínimo 800 palabras por landing de categoría
5. **Internal links**: Implementar la estrategia de linking
6. **Sitemap**: Generar sitemap.xml con todas las URLs
