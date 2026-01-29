"""
Generador de Keywords por Combinaciones para Livix Zaragoza
============================================================
Este script genera todas las combinaciones posibles de keywords
y las guarda en un archivo listo para Google Keyword Planner.

Uso: python keyword_generator.py
Output: keywords_combinaciones.txt (listo para pegar en Keyword Planner)
"""

import itertools
from pathlib import Path

# ============================================================
# CONFIGURACIÓN: Modifica estos arrays según necesites
# ============================================================

# Tipos de vivienda
TIPOS_VIVIENDA = [
    "habitacion",
    "piso",
    "alquiler",
    "alojamiento",
    "residencia",
    "cuarto",
    "apartamento",
    "estudio",
]

# Target/audiencia
TARGETS = [
    "estudiantes",
    "universitarios",
    "erasmus",
    "jovenes",
    "estudiante",
    "universitario",
]

# Ubicaciones principales
UBICACIONES = [
    "zaragoza",
    "unizar",
]

# Barrios de Zaragoza
BARRIOS = [
    "centro",
    "delicias",
    "actur",
    "las fuentes",
    "torrero",
    "san jose",
    "arrabal",
    "almozara",
    "romareda",
    "valdespartera",
    "parque goya",
    "casablanca",
    "miralbueno",
    "oliver",
    "la paz",
    "el tubo",
    "la magdalena",
    "san pablo",
    "miraflores",
    "ruiseñores",
    "montecanal",
]

# Campus y facultades
CAMPUS = [
    "campus san francisco",
    "campus rio ebro",
    "plaza san francisco",
    "paraninfo",
]

FACULTADES = [
    "medicina",
    "derecho",
    "veterinaria",
    "economia",
    "ingenieros",
    "arquitectura",
    "enfermeria",
    "filosofia",
    "fisioterapia",
    "ciencias",
    "telecomunicaciones",
    "politecnica",
]

# Modificadores de precio
MODIFICADORES_PRECIO = [
    "barato",
    "barata",
    "economico",
    "economica",
    "200 euros",
    "250 euros",
    "300 euros",
    "350 euros",
    "400 euros",
]

# Modificadores de servicios
MODIFICADORES_SERVICIOS = [
    "gastos incluidos",
    "wifi incluido",
    "amueblado",
    "amueblada",
    "con baño privado",
    "exterior",
    "luminosa",
    "sin aval",
]

# Temporalidad
TEMPORALIDAD = [
    "septiembre",
    "curso academico",
    "enero",
    "verano",
    "mes a mes",
    "corta estancia",
    "temporal",
]

# Acciones/verbos
ACCIONES = [
    "busco",
    "alquilar",
    "buscar",
    "encontrar",
]

# Roommates
ROOMMATES = [
    "compañero de piso",
    "roommate",
    "roomie",
    "compartir piso",
    "piso compartido",
]

# ============================================================
# GENERADOR DE COMBINACIONES
# ============================================================

def generate_combinations():
    keywords = set()
    
    # Patrón 1: [tipo] [target] [ubicacion]
    # Ejemplo: "habitacion estudiantes zaragoza"
    for tipo, target, ubicacion in itertools.product(TIPOS_VIVIENDA, TARGETS, UBICACIONES):
        keywords.add(f"{tipo} {target} {ubicacion}")
        keywords.add(f"{tipo} {ubicacion} {target}")
    
    # Patrón 2: [tipo] [barrio] [ubicacion]
    # Ejemplo: "piso delicias zaragoza"
    for tipo, barrio in itertools.product(TIPOS_VIVIENDA[:4], BARRIOS):
        keywords.add(f"{tipo} {barrio} zaragoza")
        keywords.add(f"{tipo} zaragoza {barrio}")
        keywords.add(f"{tipo} {barrio} estudiantes")
    
    # Patrón 3: [tipo] cerca [campus/facultad]
    # Ejemplo: "habitacion cerca campus san francisco"
    for tipo, campus in itertools.product(TIPOS_VIVIENDA[:4], CAMPUS):
        keywords.add(f"{tipo} {campus}")
        keywords.add(f"{tipo} cerca {campus}")
    
    for tipo, facultad in itertools.product(TIPOS_VIVIENDA[:4], FACULTADES):
        keywords.add(f"{tipo} {facultad} zaragoza")
        keywords.add(f"{tipo} {facultad} unizar")
        keywords.add(f"{tipo} cerca {facultad} zaragoza")
    
    # Patrón 4: [tipo] [modificador_precio] [ubicacion]
    # Ejemplo: "habitacion barata zaragoza"
    for tipo, precio in itertools.product(TIPOS_VIVIENDA[:4], MODIFICADORES_PRECIO):
        keywords.add(f"{tipo} {precio} zaragoza")
        keywords.add(f"{tipo} zaragoza {precio}")
        keywords.add(f"{tipo} {precio} estudiantes zaragoza")
    
    # Patrón 5: [tipo] [servicio] [ubicacion]
    # Ejemplo: "habitacion gastos incluidos zaragoza"
    for tipo, servicio in itertools.product(TIPOS_VIVIENDA[:4], MODIFICADORES_SERVICIOS):
        keywords.add(f"{tipo} {servicio} zaragoza")
        keywords.add(f"{tipo} zaragoza {servicio}")
    
    # Patrón 6: [tipo] [temporalidad] [ubicacion]
    # Ejemplo: "piso septiembre zaragoza"
    for tipo, temp in itertools.product(TIPOS_VIVIENDA[:4], TEMPORALIDAD):
        keywords.add(f"{tipo} {temp} zaragoza")
        keywords.add(f"alquiler {tipo} {temp} zaragoza")
    
    # Patrón 7: [accion] [tipo] [ubicacion]
    # Ejemplo: "busco habitacion zaragoza"
    for accion, tipo in itertools.product(ACCIONES, TIPOS_VIVIENDA[:4]):
        keywords.add(f"{accion} {tipo} zaragoza")
        keywords.add(f"{accion} {tipo} estudiantes zaragoza")
    
    # Patrón 8: Roommates
    # Ejemplo: "busco compañero de piso zaragoza"
    for accion, roommate in itertools.product(ACCIONES, ROOMMATES):
        keywords.add(f"{accion} {roommate} zaragoza")
    
    for roommate in ROOMMATES:
        keywords.add(f"{roommate} zaragoza")
        keywords.add(f"{roommate} estudiantes zaragoza")
        keywords.add(f"{roommate} zaragoza estudiantes")
    
    # Patrón 9: Preguntas informacionales
    preguntas = [
        "donde vivir en zaragoza estudiante",
        "mejores barrios zaragoza estudiantes",
        "cuanto cuesta habitacion zaragoza",
        "cuanto cuesta vivir en zaragoza",
        "mejores zonas estudiantes zaragoza",
        "vida universitaria zaragoza",
        "coste vida estudiante zaragoza",
        "presupuesto estudiante zaragoza",
        "barrios seguros zaragoza",
        "transporte publico zaragoza universidad",
        "como llegar campus rio ebro",
        "como llegar campus san francisco",
        "residencia o piso zaragoza",
        "que es mejor residencia o piso",
        "ventajas piso compartido",
        "ventajas residencia universitaria",
        "consejos alquilar piso zaragoza",
        "errores alquilar habitacion",
        "estafas alquiler estudiantes",
        "como evitar estafa alquiler",
    ]
    keywords.update(preguntas)
    
    # Patrón 10: Internacional/Erasmus
    erasmus_keywords = [
        "erasmus zaragoza alojamiento",
        "erasmus zaragoza housing",
        "student housing zaragoza",
        "room for rent zaragoza",
        "flat share zaragoza",
        "accommodation zaragoza university",
        "student apartment zaragoza",
        "cheap room zaragoza",
        "furnished room zaragoza",
        "international students zaragoza",
        "exchange student zaragoza",
        "semester abroad zaragoza",
        "study abroad zaragoza accommodation",
    ]
    keywords.update(erasmus_keywords)
    
    # Patrón 11: Competidores
    competidores = [
        "idealista habitaciones zaragoza",
        "fotocasa pisos estudiantes zaragoza",
        "milanuncios habitacion zaragoza",
        "badi zaragoza",
        "spotahome zaragoza",
        "uniplaces zaragoza",
        "housinganywhere zaragoza",
        "alternativa idealista",
        "mejor que badi",
        "app pisos estudiantes",
    ]
    keywords.update(competidores)
    
    return sorted(keywords)

def main():
    print("🔍 Generando combinaciones de keywords...")
    keywords = generate_combinations()
    
    # Guardar en archivo
    output_file = Path(__file__).parent / "keywords_combinaciones.txt"
    with open(output_file, 'w', encoding='utf-8') as f:
        for kw in keywords:
            f.write(kw + '\n')
    
    print(f"✅ Generadas {len(keywords)} keywords únicas")
    print(f"📁 Guardadas en: {output_file}")
    print(f"\n📋 Ahora puedes copiar el contenido y pegarlo en Google Keyword Planner")
    print(f"   Ir a: https://ads.google.com/aw/keywordplanner/ideas/new")
    print(f"   → 'Get search volume and forecasts'")
    print(f"   → Pegar todas las keywords")

if __name__ == "__main__":
    main()
