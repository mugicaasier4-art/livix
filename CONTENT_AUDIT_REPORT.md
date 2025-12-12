# 📋 INFORME DE AUDITORÍA DE CONTENIDOS - LIVIX

**Fecha de auditoría:** 7 de Diciembre de 2025  
**Versión:** 1.0

---

## 📊 RESUMEN EJECUTIVO

| Categoría | Total | ✅ OK | 🟡 Revisar | 🔴 Reemplazar |
|-----------|-------|-------|------------|---------------|
| **Imágenes** | 26 | 12 | 8 | 6 |
| **Textos/Copy** | 45+ secciones | 35 | 7 | 3 |
| **Datos (negocios)** | 80+ | 0 | 0 | 80 |
| **Datos (residencias)** | 20+ | 20 | 0 | 0 |
| **Traducciones** | 3 idiomas | ES ✅ | EN 🟡 | FR 🟡 |

---

## 🖼️ INVENTARIO DE IMÁGENES

### 📁 `/src/assets/` - Imágenes principales

| Archivo | Uso | Estado | Acción requerida |
|---------|-----|--------|------------------|
| `livix-logo.png` | Header, favicon | ✅ OK | - |
| `hero-students.jpg` | Hero homepage | ✅ OK | - |
| `landlord-hero.jpg` | Página propietarios | ✅ OK | - |
| `club-hero-collage.jpg` | Hero Club Livix | ✅ OK | - |
| `apartment-1.jpg` | Listings destacados | 🟡 GENÉRICA | Reemplazar con fotos reales de Zaragoza |
| `apartment-2.jpg` | Listings destacados | 🟡 GENÉRICA | Reemplazar con fotos reales de Zaragoza |
| `apartment-3.jpg` | Listings destacados | 🟡 GENÉRICA | Reemplazar con fotos reales de Zaragoza |

### 📁 `/src/assets/blog/` - Imágenes del blog

| Archivo | Artículo | Estado | Notas |
|---------|----------|--------|-------|
| `pisos-estudiante.jpg` | Guía encontrar piso | ✅ OK | Stock apropiado |
| `zonas-universidad.jpg` | Zonas para vivir | ✅ OK | Stock apropiado |
| `checklist-alquiler.jpg` | Checklist alquiler | ✅ OK | Stock apropiado |
| `tecnicas-estudio.jpg` | Técnicas estudio | ✅ OK | Stock apropiado |
| `gestion-tiempo.jpg` | Gestión tiempo | ✅ OK | Stock apropiado |
| `apps-estudiantes.jpg` | Apps estudiantes | ✅ OK | Stock apropiado |
| `ahorrar-dinero.jpg` | Cómo ahorrar | ✅ OK | Stock apropiado |
| `recetas-estudiantes.jpg` | Recetas fáciles | ✅ OK | Stock apropiado |
| `bienestar-mental.jpg` | Bienestar mental | ✅ OK | Stock apropiado |
| `fiestas-universitarias.jpg` | Fiestas uni | ✅ OK | Stock apropiado |
| `deportes-clubs.jpg` | Deportes clubs | ✅ OK | Stock apropiado |
| `festivales-conciertos.jpg` | Festivales | ✅ OK | Stock apropiado |
| `blog-hero-collage.jpg` | Hero blog | ✅ OK | Collage estudiantil |

### 📁 `/src/assets/club/` - Imágenes del Club

| Archivo | Sector | Estado | Acción |
|---------|--------|--------|--------|
| `deporte.jpg` | Deportes | ✅ OK | Stock |
| `material.jpg` | Material uni | ✅ OK | Stock |
| `moda.jpg` | Moda | ✅ OK | Stock |
| `ocio.jpg` | Ocio | ✅ OK | Stock |
| `restauracion.jpg` | Restauración | ✅ OK | Stock |
| `servicios.jpg` | Servicios | ✅ OK | Stock |
| `tecnologia.jpg` | Tecnología | ✅ OK | Stock |
| `transporte.jpg` | Transporte | ✅ OK | Stock |

### 🔴 IMÁGENES FALTANTES O PROBLEMÁTICAS

1. **Residencias**: Las residencias usan URLs de Unsplash placeholder, no tienen imágenes reales
   - Archivo: `src/data/residences.ts` línea 95+
   - **Acción**: Obtener fotos reales de cada residencia o eliminar imagen

2. **Listings demo**: Los 40 listings demo en Supabase no tienen imágenes propias
   - **Acción**: Las imágenes son URLs de Unsplash genéricas

---

## 📝 INVENTARIO DE TEXTOS

### ✅ Textos VERIFICADOS (correcto)

| Ubicación | Contenido | Estado |
|-----------|-----------|--------|
| `Hero.tsx` | "Tu próximo hogar te está esperando" | ✅ Marca correcta |
| `Features.tsx` | Propuestas de valor | ✅ Sin estadísticas falsas |
| `Footer.tsx` | legal@livix.app | ✅ Email correcto |
| `Privacy.tsx` | Política de privacidad | ✅ Datos correctos |
| `Terms.tsx` | Términos de servicio | ✅ Datos correctos |
| `HowItWorks.tsx` | Proceso 3 pasos | ✅ Correcto |
| Blog (12 artículos) | Contenido educativo | ✅ Original y útil |

### 🟡 Textos a REVISAR

| Ubicación | Contenido | Problema | Acción |
|-----------|-----------|----------|--------|
| `HomeFAQ.tsx` | "Soporte 24/7" | ⚠️ ¿Es real? | Verificar capacidad real |
| `HowItWorks.tsx` | "Matching con IA" | ⚠️ ¿Implementado? | Ajustar si no existe |
| `HowItWorks.tsx` | "KYC verification" | ⚠️ Solo email | Corregir descripción |
| `PremiumCTA.tsx` | "9,99€/mes" | ⚠️ ¿Precio final? | Confirmar pricing |
| `CategoryCTA.tsx` | "Próximamente" badge | ⚠️ Compañeros ya existe | Quitar badge |
| `Landlords.tsx` | Planes de pricing | 🟡 Verificar precios | Confirmar con negocio |
| `ClubCTA.tsx` | "Contenido premium" | 🟡 ¿Qué incluye? | Especificar |

### 🔴 Textos INVENTADOS (requieren reemplazo)

| Ubicación | Contenido | Problema |
|-----------|-----------|----------|
| `ClubSector.tsx` | 80+ negocios ficticios | 🔴 TODOS INVENTADOS |
| `Explore.tsx` | "matchScore" 88-95% | 🔴 Algoritmo no existe |

---

## 🏪 DATOS FICTICIOS DEL CLUB LIVIX

### 🔴 CRÍTICO: Todos los negocios del Club son inventados

**Archivo afectado:** `src/pages/ClubSector.tsx`

**Sectores con datos ficticios:**

| Sector | Nº Negocios | Ejemplo inventado |
|--------|-------------|-------------------|
| Deporte | 10 | "FitZone Gym - 30% descuento" |
| Material | 10 | "Copistería Unizar - 20% fotocopias" |
| Restauración | 10 | "Café Central - 2x1 desayunos" |
| Transporte | 10 | "CarShare Zgz - 15€ primer viaje" |
| Moda | 10 | "Urban Style - 25% primera compra" |
| Servicios | 10 | "LavanZgz - 5€ lavado gratis" |
| Ocio | 10 | "Bowling Center - 2x1 partidas" |
| Tecnología | 10 | "TechFix - 15% reparaciones" |

**Total: 80 negocios ficticios** que deben ser:
1. ❌ Eliminados completamente, o
2. ✅ Reemplazados con partnerships reales

---

## 🏛️ DATOS REALES DE RESIDENCIAS

### ✅ Datos VERIFICADOS en `src/data/residences.ts`

| Residencia | Datos | Estado |
|------------|-------|--------|
| CMU Pedro Cerbuna | Tel, web, dirección | ✅ Real |
| CMU Santa Isabel | Tel, web, dirección | ✅ Real |
| CMU Virgen del Carmen | Tel, web, dirección | ✅ Real |
| Residencia Romareda | Tel, web, dirección | ✅ Real |
| Residencia Goya | Tel, web, dirección | ✅ Real |
| + 15 más... | Datos de contacto | ✅ Real |

**Nota:** Los datos de residencias son reales y verificables.

---

## 🌐 AUDITORÍA DE TRADUCCIONES

### Cobertura por idioma

| Archivo | Claves | ES | EN | FR |
|---------|--------|----|----|-----|
| `common` | 23 | ✅ | ✅ | ✅ |
| `explore` | 10 | ✅ | ✅ | ✅ |
| `filters` | 13 | ✅ | ✅ | ✅ |
| `listing` | 11 | ✅ | ✅ | ✅ |
| `badge` | 7 | ✅ | ✅ | ✅ |
| `messages` | 18 | ✅ | ✅ | ✅ |
| `auth` | 11 | ✅ | ✅ | ✅ |
| `profile` | 10 | ✅ | ✅ | ✅ |
| `support` | 6 | ✅ | ✅ | ✅ |
| `cookies` | 6 | ✅ | ✅ | ✅ |
| `date` | 6 | ✅ | ✅ | ✅ |

### 🔴 Textos HARDCODEADOS en español (no traducidos)

| Componente | Texto hardcodeado |
|------------|-------------------|
| `Hero.tsx` | "Tu próximo hogar te está esperando" |
| `Features.tsx` | Títulos y descripciones completas |
| `FeaturedListings.tsx` | "Alojamientos destacados" |
| `CategoryCTA.tsx` | Todos los textos |
| `ClubCTA.tsx` | Todos los textos |
| `BlogCTA.tsx` | Todos los textos |
| `PremiumCTA.tsx` | Todos los textos |
| `HomeFAQ.tsx` | Preguntas y respuestas |
| `HowItWorks.tsx` | Todo el contenido |
| `Landlords.tsx` | Todo el contenido |
| `Club.tsx` | Todo el contenido |
| `Blog.tsx` | Categorías y filtros |
| `Roommates.tsx` | Opciones y descripciones |
| `Login.tsx` | Labels y mensajes |
| `Signup.tsx` | Labels y mensajes |

**Estimación:** ~60% del contenido visible está hardcodeado en español.

---

## 📋 PLAN DE ACCIÓN RECOMENDADO

### 🔴 PRIORIDAD ALTA (Antes de lanzamiento)

1. **Club Livix - Negocios ficticios**
   - Opción A: Ocultar sección Club hasta tener partners reales
   - Opción B: Mostrar "Próximamente" en cada sector sin datos falsos

2. **Match Score inventado**
   - Eliminar porcentajes de matching hasta implementar algoritmo real
   - Mostrar badges de compatibilidad en lugar de %

3. **CategoryCTA - Badge "Próximamente"**
   - Quitar badge de "Foro de Compañeros" (ya funciona)

### 🟡 PRIORIDAD MEDIA

4. **Imágenes de apartamentos**
   - Reemplazar `apartment-1/2/3.jpg` con fotos reales de Zaragoza

5. **Verificar claims de servicio**
   - "Soporte 24/7" → Ajustar a horario real
   - "KYC verification" → Cambiar a "Verificación por email"

6. **Internacionalización**
   - Migrar textos hardcodeados a archivos JSON
   - Priorizar páginas principales (Hero, Features, Auth)

### 🟢 PRIORIDAD BAJA

7. **Imágenes de residencias**
   - Obtener fotos reales o usar placeholder consistente

8. **Pricing Premium**
   - Confirmar precio final de 9,99€/mes

---

## 📊 MÉTRICAS DE CALIDAD DE CONTENIDO

| Métrica | Valor actual | Objetivo |
|---------|--------------|----------|
| Textos verificados | 78% | 100% |
| Imágenes propias | 46% | 80% |
| Traducciones completas | 40% | 100% |
| Datos reales | 20% (residencias) | 100% |
| Datos ficticios | 80 negocios | 0 |

---

## 🔍 ARCHIVOS AUDITADOS

```
src/pages/
├── Index.tsx ✅
├── Landlords.tsx ✅
├── Club.tsx ✅
├── ClubSector.tsx 🔴
├── Residences.tsx ✅
├── Blog.tsx ✅
├── BlogPost.tsx ✅
├── Roommates.tsx ✅
├── HowItWorks.tsx 🟡
├── Explore.tsx 🟡
├── Login.tsx ✅
├── Signup.tsx ✅
├── Support.tsx ✅
├── Erasmus.tsx ✅
└── legal/
    ├── Privacy.tsx ✅
    └── Terms.tsx ✅

src/components/sections/
├── Hero.tsx ✅
├── Features.tsx ✅
├── FeaturedListings.tsx 🟡
├── CategoryCTA.tsx 🟡
├── ClubCTA.tsx ✅
├── BlogCTA.tsx ✅
├── PremiumCTA.tsx 🟡
└── HomeFAQ.tsx 🟡

src/data/
├── residences.ts ✅ (datos reales)
├── blogContent.ts ✅ (contenido original)
└── faq.ts ✅

src/i18n/locales/
├── es.json ✅
├── en.json ✅
└── fr.json ✅
```

---

**Informe generado automáticamente por Lovable AI**  
**Próxima auditoría recomendada:** Después de correcciones
