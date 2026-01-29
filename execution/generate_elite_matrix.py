import csv
import os

def generate_elite_matrix():
    output_file = "livix_elite_90day_matrix.csv"
    
    headers = ["Día", "Semana", "Fase", "Pilar", "Tema / Ángulo", "Objetivo / KPI", "Tipo de Vídeo"]
    
    phases = [
        {"name": "Discovery", "days": range(1, 31)},
        {"name": "Authority", "days": range(31, 61)},
        {"name": "Acquisition", "days": range(61, 91)}
    ]
    
    rows = []
    
    # Simple logic to generate the 90-day cycle
    pillars = ["Housing Hacks", "Livix Club", "Zaragoza Life", "Relatable/Humor", "Product/Tour", "Landlord POV"]
    
    for day in range(1, 91):
        semana = (day - 1) // 7 + 1
        
        # Determine Phase
        if day <= 30:
            phase = "1: Discovery (Viral)"
        elif day <= 60:
            phase = "2: Authority (Value)"
        else:
            phase = "3: Acquisition (Convert)"
            
        # Rotate Pillars (custom logic for each phase)
        if phase.startswith("1"):
            # More viral/life content
            p_rotation = ["Zaragoza Life", "Relatable/Humor", "Housing Hacks", "Zaragoza Life", "Relatable/Humor", "Livix Club", "Zaragoza Life"]
        elif phase.startswith("2"):
            # More educational/authority content
            p_rotation = ["Housing Hacks", "Housing Hacks", "Livix Club", "Zaragoza Life", "Housing Hacks", "Livix Club", "Landlord POV"]
        else:
            # More product/conversion content
            p_rotation = ["Product/Tour", "Livix Club", "Housing Hacks", "Product/Tour", "Livix Club", "Landlord POV", "UGC/Testimonial"]
            
        pilar = p_rotation[(day - 1) % 7]
        
        # Basic themes for example (in a real scenario, this would be 90 unique lines)
        themes = {
            "Housing Hacks": "Hack de alquiler / Contratos / Estafas",
            "Livix Club": "Descuento destacado / Ahorro estudiante",
            "Zaragoza Life": "Guía de Barrio / Transporte / Ocio",
            "Relatable/Humor": "Dramas de estudiante / Memes locales",
            "Product/Tour": "Tour de piso premium / Review App",
            "Landlord POV": "Rentabilidad / Seguridad para propietarios",
            "UGC/Testimonial": "Historia de éxito de usuario real"
        }
        
        rows.append([
            day,
            semana,
            phase,
            pilar,
            themes.get(pilar, "Contenido variado"),
            "Alcance" if day <= 30 else "Engagement" if day <= 60 else "Conversión",
            "Reel / TikTok Vertical"
        ])

    with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(headers)
        writer.writerows(rows)
    
    print(f"Elite Matrix generada: {os.path.abspath(output_file)}")

if __name__ == "__main__":
    generate_elite_matrix()
