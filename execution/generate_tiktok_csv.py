import csv
import os

def generate_csv():
    output_file = "tiktok_content_plan.csv"
    
    headers = [
        "ID", 
        "Título", 
        "Objetivo", 
        "Pilar", 
        "Visual (Lo que se ve)", 
        "Audio (Lo que se dice)", 
        "Texto en Pantalla", 
        "CTA"
    ]
    
    rows = [
        [
            "1",
            "El Gancho Global",
            "Viralidad general + Brand Awareness",
            "Housing Hacks",
            "(0-3s) Primer plano rompiendo papel o STOP con mano.\n(3-8s) P. Verde: Portal inmobiliario con precios caros.\n(8-15s) Scroll rápido app Livix.\n(15-20s) Selfie sonriendo con logo Livix.\n(20-25s) Clip rápido entrando a piso.",
            "(0-3s) Si eres estudiante y buscas piso en Zaragoza, PARA ahora mismo.\n(3-8s) Deja de mirar en portales que te cobran un mes de agencia por la cara.\n(8-15s) Existe una plataforma nacida en la Unizar donde hablas directo con propietarios.\n(15-20s) Se llama Livix, es gratis para ti, y sí, verificamos a los propietarios.\n(20-25s) Tu próximo piso está a dos clics. Link en la bio.",
            "🛑 STOP si buscas piso en ZGZ\n💸 ¿1 mes de agencia? NO gracias\n📱 Livix: Sin intermediarios\n✅ Propietarios Verificados\n🔗 Link en Bio",
            "Link en Bio para ver pisos"
        ],
        [
            "2",
            "Livix Club - Ahorro Real",
            "Registro de usuarios (Lead Magnet)",
            "Livix Club",
            "(0-3s) POV con café/copa.\n(3-10s) Montaje rápido logos: Oasis, Gyms, Copisterías.\n(10-15s) Pantalla: Sección Club en app.\n(15-20s) Selfie/Cierre guiño.",
            "(0-3s) ¿Sabías que por ser estudiante en Zaragoza tienes barra libre de descuentos?\n(3-10s) Gimnasio, copistería, y hasta la entrada a Oasis... todo más barato.\n(10-15s) Solo necesitas estar registrado en Livix Club. Es totalmente gratis.\n(15-20s) No pagues precio completo si no tienes que hacerlo. Únete ya.",
            "🤑 ¿Descuentos ocultos en ZGZ?\n🏋️‍♀️ Gimnasio / 🖨️ Copistería / 🎉 Oasis Club\n🎟️ Livix Club (GRATIS)\n🚀 Regístrate en 1 min",
            "Únete ya"
        ],
        [
            "3",
            "Barrio vs Barrio (Delicias vs Actur)",
            "SEO local y debate en comentarios",
            "Zaragoza Life",
            "(0-4s) Split screen: Delicias vs Grancasa.\n(4-10s) Foto Delicias (kebab/bar barato).\n(10-16s) Foto Actur (Tranvía/CC).\n(16-20s) Selfie interrogante.",
            "(0-4s) La eterna batalla de Zaragoza: ¿Vivir en Delicias o en el Actur?\n(4-10s) Delicias: Alquiler más barato, comida increíble, pero... edificios más viejos.\n(10-16s) Actur: Tranvía en la puerta, pisos nuevos, cerca del CPS... pero prepara la cartera.\n(16-20s) ¿Tú de qué team eres? ¿Team Ahorro o Team Comodidad? Te leo.",
            "🥊 Delicias VS Actur\n📉 Alquiler barato / 🏢 Pisos antiguos\n🚋 Tranvía + CPS / 📈 Más caro\n👇 ¿Team Ahorro o Comodidad?",
            "Comenta tu team"
        ],
        [
            "4",
            "El Piso Perfecto No Exis...",
            "Mostrar inventario de calidad",
            "Housing Hacks",
            "1. Salón luminoso.\n2. Detalle cocina.\n3. Habitación escritorio grande.\n4. Terraza/vistas.",
            "(Audio: Sonido viral 'This is perfect')",
            "El piso perfecto para estudiantes en Zaragoza NO exis... (Tachar NO)\nDisponible en Livix.",
            "Corre que vuela (Link en Bio)"
        ],
        [
            "5",
            "Landlord - Miedo al impago",
            "Atraer propietarios (B2B)",
            "Landlord POV",
            "(0-3s) Serio mirando a cámara.\n(3-10s) Gráfico: Estudiante + Check verificación.\n(10-16s) Dashboard Livix.\n(16-20s) Cierre directo.",
            "(0-3s) Propietario en Zaragoza: ¿Tu mayor miedo es que no te paguen?\n(3-10s) En Livix verificamos a cada estudiante. Sabemos que vienen a estudiar, no a dar problemas.\n(10-16s) Además, gestionas todo desde aquí. Contratos, chat, incidencias. Gratis los 2 primeros anuncios.\n(16-20s) Prueba Livix Propietarios. Alquila tranquilo.",
            "😨 ¿Miedo a impagos?\n✅ Estudiantes Verificados\n🆓 2 Anuncios GRATIS\n🏠 Sube tu piso hoy",
            "Sube tu piso hoy"
        ],
        [
            "6",
            "El Roommate Pesadilla",
            "Viralidad / Humor",
            "Housing Hacks",
            "POV actuado (mismo actor, peluca/gafas).\nEscena: 'Yo estudiando' vs 'Compañero de fiesta'.",
            "(0-5s) Audio trending o voz en off: 'Cuando te toca el compañero que...' \n(Cierre) En Livix puedes ver perfiles de roommates compatibles antes de firmar.",
            "Por esto necesitas elegir bien a tus compañeros...\nAhorra dramas.",
            "Busca roommate en Livix"
        ],
        [
            "7",
            "Tour Speedrun (Residencia)",
            "Promoción Partner",
            "Livix Club",
            "Cámara rápida (x2).\nRecorrido por: Recepción, Gym, Sala estudio, Habitación.",
            "(Voz muy rápida) 30 segundos para enseñarte la Residencia [Nombre]. Recepción 24h (check), Gimnasio propio (check), Sala de estudio (check), Habitaciones con baño (doble check). ¿Y lo mejor? Si reservas por Livix tienes descuento. ¡Boom!",
            "⏱️ 30s Tour\n✅ Gym\n✅ Estudio\n✅ Descuento Livix",
            "Reserva con descuento"
        ],
        [
            "8",
            "¿Qué entra con 300€ en Zaragoza?",
            "Educación de mercado",
            "Zaragoza Life",
            "3 opciones rápidas:\n1. Habitación top Delicias.\n2. Habitación media Centro.\n3. Habitación compartida Premium.",
            "Esto es lo que consigues con 300€ en Zaragoza... \nOpción 1... \nOpción 2... \nMoraleja: Busca bien y compara en Livix.",
            "💶 Presupuesto: 300€\n🔍 Opción 1\n🔍 Opción 2",
            "Compara en Livix"
        ],
        [
            "9",
            "Hack de Transporte",
            "Lifestyle / Valor",
            "Zaragoza Life",
            "Mostrando tarjeta Lazo o Abono.\nPlano del tranvía.",
            "Si eres nuevo en Zaragoza, no pagues cada viaje. Sácate la Tarjeta Lazo o el Abono 365 Joven y ahorra cientos de euros.",
            "🚌 Hack Transporte\n💳 Tarjeta Lazo / Abono 365\n💰 Ahorra €€€",
            "Más tips en @livix_es"
        ],
        [
            "10",
            "Day in the life (Unizar)",
            "Aspiracional",
            "Zaragoza Life",
            "Montaje estético: Café -> Clase -> Comida -> Estudio -> Gym.",
            "(Música Lo-Fi / Trending suave)\n(Texto en voz en off opcional): La vida que te espera en Zaragoza ✨",
            "📅 Day in the life: Unizar\n✨ Zaragoza Vibes",
            "Síguenos para más"
        ]
    ]

    with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(headers)
        writer.writerows(rows)
    
    print(f"CSV generado exitosamente: {os.path.abspath(output_file)}")

if __name__ == "__main__":
    generate_csv()
