import pandas as pd
import os

def generate_ultimate_sheet():
    output_file = "LIVIX_TIKTOK_MASTER_PLAN_COMPLETE.xlsx"
    downloads_path = os.path.expanduser("~/Desktop")
    final_destination = os.path.join(downloads_path, output_file)

    headers = ["DIA", "FASE", "PILAR", "HOOK (El Gancho)", "VISUAL (Producción Detallada)", "AUDIO (Voz en off)", "TEXTO EN PANTALLA", "CTA", "GOAL / KPI"]

    # 90 unique content ideas with personalized visuals
    content_library = [
        # --- MES 1: DISCOVERY (Días 1-30) ---
        {"pilar": "Zaragoza Life", "hook": "3 zonas de Zaragoza donde NO deberías vivir si eres estudiante.", "visual": "Mapa animado de ZGZ (tipo Google Maps) con zonas marcadas en rojo. Transiciones rápidas entre fotos de calles de esas zonas. Cara de 'yikes' del host.", "audio": "Estas son las 3 zonas que yo evitaría si fuera nuevo en Zaragoza...", "text": "🚫 Zonas a evitar", "cta": "Sígueme para más tips de ZGZ"},
        {"pilar": "Housing Hacks", "hook": "Cómo detectar un piso estafa en 10 segundos.", "visual": "Pantalla verde con un anuncio FALSO de Idealista/Milanuncios. Zoom in a los red flags (fotos genéricas, precio demasiado bajo, pide pagos por adelantado).", "audio": "Si ves ESTO en un anuncio, sal corriendo...", "text": "🚨 Red Flag #1", "cta": "Guarda este vídeo"},
        {"pilar": "Relatable/Humor", "hook": "POV: Buscas piso en septiembre y solo quedan zulos a 500€.", "visual": "El host con cara de desesperación mirando el móvil. Montaje rápido de pisos horribles (fotos reales de listings cutre). Transición a piso bonito de Livix.", "audio": "(Sin voz, solo música trending dramática, luego cambia a música happy)", "text": "Septiembre be like... 😭 → 😍", "cta": "Hay esperanza (Link en Bio)"},
        {"pilar": "Livix Club", "hook": "Tu carnet de estudiante vale ORO en Zaragoza.", "visual": "POV sacando el carnet de la cartera en cámara lenta. Montaje rápido: mostrando el carnet en un gym, en Oasis, en una copistería. Cada vez aparece un '✅ Descuento' en pantalla.", "audio": "Gimnasio: descuento. Oasis: entrada gratis. Copistería: 20% off...", "text": "🎫 Tu carnet = €€€", "cta": "Regístrate en Livix Club"},
        {"pilar": "Zaragoza Life", "hook": "El truco del transporte que te ahorra 400€/año.", "visual": "Plano de una bizi o del tranvía pasando. Mostrar la Tarjeta Ciudadana o la app del bus. Gráfico animado simple mostrando el ahorro.", "audio": "Si pagas cada viaje individual, estás tirando el dinero...", "text": "💳 Tarjeta Lazo / Abono Joven", "cta": "Más hacks en mi perfil"},
        {"pilar": "Relatable/Humor", "hook": "Tipos de compañeros de piso (¿cuál te ha tocado?).", "visual": "El host actuando 4 personajes distintos (cambio de gorra/gafas): El fiestero, el marrano, el fantasma, el perfecto. Quick cuts entre cada uno.", "audio": "(Voz en off describiendo cada tipo con humor)", "text": "Tipo 1: El Fiestero 🎉", "cta": "Etiqueta a tu roommate"},
        {"pilar": "Zaragoza Life", "hook": "5 sitios baratos para comer cerca del campus.", "visual": "Montaje tipo food tour: planos cerrados de menús del día, pinchos, bocatas. Mostrar fachadas de los bares/restaurantes con nombre en texto.", "audio": "Menú por 9€, pincho de tortilla a 2€...", "text": "🍽️ [Nombre del bar] - 9€ menú", "cta": "¿Cuál es tu favorito?"},
        {"pilar": "Housing Hacks", "hook": "Lo primero que debes revisar al entrar a un piso.", "visual": "POV entrando a un piso (grabar con móvil en mano). Zoom dramático a: enchufes, ventanas (condensación), grifos (presión agua), armarios (humedad).", "audio": "Antes de decir 'me lo quedo', revisa ESTO...", "text": "✅ Enchufes ✅ Ventanas ✅ Agua", "cta": "Guarda para tu próxima visita"},
        {"pilar": "Livix Club", "hook": "Cómo entrar gratis a Oasis este jueves.", "visual": "Clip de gente bailando en una discoteca (stock o propio). Pantalla de la sección 'Club' en Livix con el descuento de Oasis destacado. Host guiñando el ojo.", "audio": "Jueves universitario y tú sin pasta? No pasa nada...", "text": "🎉 Oasis GRATIS con Livix", "cta": "Link en Bio"},
        {"pilar": "Relatable/Humor", "hook": "Expectativa vs Realidad de vivir solo.", "visual": "Split screen. Izq: Clips aesthetic de cocinar, limpiar, yoga. Der: Clips de caos (platos sucios, ropa por el suelo, cenar cereales a las 11pm).", "audio": "(Música trending, sin voz)", "text": "Lo que pensaba... vs Lo que es", "cta": "🤣 Comenta tu realidad"},

        {"pilar": "Housing Hacks", "hook": "El contrato de alquiler tiene esta cláusula trampa.", "visual": "Primer plano de manos firmando un contrato. Zoom dramático a un párrafo específico (inventado) con highlighter digital en rojo.", "audio": "Si tu contrato dice ESTO en el punto 7...", "text": "⚠️ Cláusula 7: Penalizaciones", "cta": "Lee SIEMPRE el contrato"},
        {"pilar": "Zaragoza Life", "hook": "Delicias vs Actur: ¿dónde vivir?", "visual": "Split screen con título. Izq: Fotos/clips de Delicias (kebabs, ambiente multicultural, edificios antiguos). Der: Fotos/clips del Actur (Grancasa, tranvía, pisos nuevos).", "audio": "Delicias: barato pero viejo. Actur: moderno pero caro...", "text": "🥊 Team Delicias vs Team Actur", "cta": "Comenta tu team"},
        {"pilar": "Livix Club", "hook": "El gym más barato de Zaragoza ahora es aún más barato.", "visual": "Plano de alguien entrenando (pesas, cinta). Mostrar logo del gym partner. Pantalla con el descuento de Livix Club.", "audio": "Si pagas más de X€ al mes por el gym, te están timando...", "text": "🏋️ [Gym Partner] -30% con Livix", "cta": "Regístrate gratis"},
        {"pilar": "Relatable/Humor", "hook": "Cuando llegas nuevo a Zaragoza y no conoces a nadie.", "visual": "POV de alguien solo en un banco del campus. Transición a montaje de conocer gente en fiestas, clases, etc. (clips animados o stock).", "audio": "(Música triste → música happy)", "text": "Mes 1: 😔 → Mes 3: 🥳", "cta": "Zaragoza te espera"},
        {"pilar": "Housing Hacks", "hook": "Cómo recuperar tu fianza al 100%.", "visual": "Animación simple de dinero volviendo a una cartera. Luego, checklist visual en pantalla (fotos al entrar, limpieza, comunicación escrita...).", "audio": "Haz ESTO el primer día y el último...", "text": "📸 Fotos = Pruebas", "cta": "Guarda este post"},
        {"pilar": "Zaragoza Life", "hook": "Los mejores planes gratis en Zaragoza para este finde.", "visual": "Montaje rápido de sitios: Parque Grande, Zaragoza Activa, exposiciones gratuitas, La Aljafería (gratis domingos). Texto con nombre y día de apertura.", "audio": "No tienes que gastar dinero para pasarlo bien...", "text": "🆓 Plan 1: Parque Grande", "cta": "¿Añadirías alguno?"},
        {"pilar": "Livix Club", "hook": "Copias e impresiones para la uni casi gratis.", "visual": "Plano de una impresora sacando folios. Mostrar la pantalla/logo de la copistería partner. Mostrar el descuento en pantalla.", "audio": "Deja de arruinarte en fotocopias...", "text": "🖨️ -20% en [Copistería]", "cta": "Link en bio para registrarte"},
        {"pilar": "Relatable/Humor", "hook": "Lo que tu madre piensa que haces vs lo que realmente haces.", "visual": "Split screen con humor. Izq: Clips de alguien estudiando, comiendo sano, llamando a los padres. Der: Clips de fiestas, kebabs, y maratones de Netflix.", "audio": "(Sin voz, música viral)", "text": "Mi madre: 👩‍⚕️ / Yo: 🥴", "cta": "Etiqueta a tu madre 😂"},
        {"pilar": "Housing Hacks", "hook": "El kit de supervivencia para tu primer piso.", "visual": "Plano cenital de una maleta abriéndose. Se van colocando objetos uno a uno: botiquín, herramientas básicas, productos de limpieza, sábanas extra.", "audio": "Cosas que ojalá alguien me hubiera dicho que trajera...", "text": "🧰 Kit Esencial: 1. Botiquín...", "cta": "Guarda esta lista"},
        {"pilar": "Zaragoza Life", "hook": "El secreto mejor guardado del Pilar.", "visual": "Clips de las Fiestas del Pilar (gente, peñas, fuegos artificiales). Mostrar un tip local (ej: mejor hora para ver la ofrenda, churrerías escondidas).", "audio": "Si vienes al Pilar y no haces ESTO, te lo pierdes...", "text": "🎆 Tip Local #1", "cta": "Más tips en mi perfil"},

        {"pilar": "Livix Club", "hook": "Descuento en la lavandería que no conocías.", "visual": "Plano de una máquina de lavandería (self-service). Mostrar logo de la lavandería partner. Descuento en pantalla.", "audio": "Lavar la ropa ya no te costará un ojo de la cara...", "text": "🧺 -15% en [Lavandería]", "cta": "Activa tu Club"},
        {"pilar": "Relatable/Humor", "hook": "Fases de un estudiante durante el cuatrimestre.", "visual": "El host actuando 4 fases: Septiembre (motivado), Octubre (cansado), Noviembre (perdido), Diciembre (zombie). Cambios de ropa/actitud rápidos.", "audio": "(Voz en off narrando cada fase con humor)", "text": "Fase 1: Voy a por el Notable 💪", "cta": "¿En qué fase estás?"},
        {"pilar": "Housing Hacks", "hook": "Preguntas que DEBES hacer antes de alquilar.", "visual": "Escena de una visita a un piso. El host 'actuando' de visitante, haciendo preguntas. Texto en pantalla con cada pregunta.", "audio": "Pregunta 1: ¿Qué incluyen los gastos?...", "text": "❓ P1: ¿Gastos incluidos?", "cta": "Apunta estas preguntas"},
        {"pilar": "Zaragoza Life", "hook": "El café más instagrameable de Zaragoza.", "visual": "Tour estético de una cafetería trendy: planos de latte art, decoración, gente trabajando. Mostrar nombre y ubicación.", "audio": "Si buscas un sitio para estudiar con estilo...", "text": "☕ [Nombre Café] - Calle X", "cta": "¿Cuál es tu favorito?"},
        {"pilar": "Livix Club", "hook": "Comida a domicilio más barata de lo que crees.", "visual": "Plano de alguien abriendo una caja de comida a domicilio. Mostrar logo de partner de delivery si lo hay, o idea de comparación de precios.", "audio": "Un truco para ahorrar en cada pedido...", "text": "🍕 Ahorra X€ por pedido", "cta": "Activa descuentos"},
        {"pilar": "Relatable/Humor", "hook": "El grupo de WhatsApp de compañeros de piso be like.", "visual": "Pantalla de un chat de WhatsApp (ficticio) con mensajes típicos: '¿Quién ha dejado esto así?', 'Falta papel', 'Yo pago después'.", "audio": "(Lectura dramática de los mensajes)", "text": "💬 'Alguien ha dejado su pelo en la ducha...'", "cta": "Comparte con tu grupo 😂"},
        {"pilar": "Housing Hacks", "hook": "Los gastos ocultos que nadie te cuenta.", "visual": "Animación o lista visual: Comunidad, basuras, agua/luz si no está incluida, seguro, internet... Con iconos y cifras aproximadas.", "audio": "El precio del alquiler no es lo único que pagarás...", "text": "💡 Gasto Oculto #1: Comunidad 30€/mes", "cta": "Pregunta SIEMPRE"},
        {"pilar": "Zaragoza Life", "hook": "Dónde aparcar la bici sin que te la roben.", "visual": "Mapa o fotos de zonas seguras para aparcar bici en ZGZ (cerca de campus, parkings vigilados). Mostrar un candado fuerte.", "audio": "Si dejas la bici en estos sitios sin candado, dile adiós...", "text": "🔓 Zona Segura: Parking X", "cta": "¿Te han robado alguna vez?"},
        {"pilar": "Livix Club", "hook": "Corte de pelo de estudiante por menos de 10€.", "visual": "Plano de alguien en una peluquería. Mostrar logo de peluquería partner. Precio 'antes/después' con el descuento.", "audio": "No hace falta que parezcas un pulpo para ahorrar...", "text": "✂️ Corte 9€ en [Peluquería]", "cta": "Más descuentos en Livix Club"},
        {"pilar": "Relatable/Humor", "hook": "Cosas que descubres la primera semana en un piso compartido.", "visual": "Montaje rápido de 'descubrimientos': el agua caliente tarda 5 minutos, la WiFi no llega al cuarto, el vecino de arriba tiene un elefante...", "audio": "(Voz en off con tono de sorpresa/resignación)", "text": "Día 1: 'La ducha tarda en calentar...'", "cta": "¿Qué descubriste tú?"},

        # --- MES 2: AUTHORITY (Días 31-60) ---
        {"pilar": "Housing Hacks", "hook": "He analizado 50 contratos de alquiler. Esto es lo que aprendí.", "visual": "Plano cenital de una mesa con contratos impresos y un café. El host subrayando cláusulas. Gráficos de 'Cláusulas más comunes'.", "audio": "Después de revisar decenas de contratos...", "text": "📊 Lo más común: Cláusula de permanencia", "cta": "Siempre revisa antes de firmar"},
        {"pilar": "Authority Deep-dive", "hook": "Así es como Livix verifica a los propietarios.", "visual": "Behind-the-scenes del 'proceso' de verificación (mockup o real): pantallas de admin, checks de documentos, llamadas. Cara de confianza del host.", "audio": "No publicamos cualquier piso...", "text": "✅ Paso 1: Verificación de identidad...", "cta": "Seguridad real"},
        {"pilar": "Livix Club", "hook": "El partner de Livix Club que más ahorro te da.", "visual": "Podio visual (1°, 2°, 3°) con logos de partners y el ahorro estimado anual de cada uno.", "audio": "¿Cuánto crees que puedes ahorrar al año?...", "text": "🥇 [Partner 1]: 150€/año ahorrados", "cta": "Activa todos los descuentos"},
        {"pilar": "Zaragoza Life", "hook": "Guía definitiva del barrio del Centro.", "visual": "Tour por el Centro: Plaza del Pilar, El Tubo, calle Alfonso. Texto con pros (ambiente, cercanía) y contras (ruido, precio).", "audio": "Si quieres vivir donde pasa todo...", "text": "📍 Centro: Pros & Contras", "cta": "¿Preferirías vivir aquí?"},
        {"pilar": "Housing Hacks", "hook": "Cuánto cuesta REALMENTE vivir en Zaragoza.", "visual": "Gráfico circular animado o lista visual desglosando: Alquiler (250-400€), comida (150-200€), transporte (30€), ocio (100€)...", "audio": "Desglose realista para un estudiante medio...", "text": "💶 Total estimado: 550-700€/mes", "cta": "Planifica bien tu presupuesto"},
        {"pilar": "Behind-the-scenes", "hook": "Un día en la vida del equipo de Livix.", "visual": "Vlog estilo: llegada a la oficina (o coworking), reuniones, café, revisando listings, respondiendo usuarios. Música chill.", "audio": "(Música de fondo, narración opcional)", "text": "9:00 → Café y emails...", "cta": "Esto hacemos por ti cada día"},
        {"pilar": "Authority Deep-dive", "hook": "Por qué el 80% de estudiantes busca mal.", "visual": "Datos en pantalla (tipo encuesta ficticia o real): 'El 80% solo mira el precio', 'El 60% no pregunta por gastos'... Gráficos simples.", "audio": "El error más común es...", "text": "📉 Error #1: Solo mirar el precio", "cta": "Busca con cabeza"},
        {"pilar": "Livix Club", "hook": "Cómo funciona Livix Club (explicación rápida).", "visual": "Screencast rápido de la app/web: Registro → Ver descuentos → Mostrar en el local → ¡Listo! Flechas y highlights.", "audio": "Es más fácil de lo que crees...", "text": "1️⃣ Regístrate → 2️⃣ Muestra el QR → 3️⃣ Ahorra", "cta": "En 2 minutos activo"},
        {"pilar": "Zaragoza Life", "hook": "El ranking de bibliotecas para estudiar en ZGZ.", "visual": "Montaje de bibliotecas: Paraninfo, María Moliner, públicas... Con 'puntuación' de silencio, enchufes, ambiente.", "audio": "Si necesitas silencio absoluto, ve a esta...", "text": "📚 #1 para silencio: [Biblioteca X]", "cta": "¿Tu favorita?"},
        {"pilar": "Housing Hacks", "hook": "Qué hacer si tu casero no te devuelve la fianza.", "visual": "Escena 'dramatizada' de recibir un 'no' del casero. Luego, lista de pasos legales: Burofax, demanda pequeñas reclamaciones, OCU...", "audio": "No te quedes de brazos cruzados...", "text": "⚖️ Paso 1: Burofax certificado", "cta": "Conoce tus derechos"},

        {"pilar": "Livix Club", "hook": "Restaurante con menú universitario a 7€.", "visual": "Food porn: platos del menú, el local, gente comiendo. Mostrar precio y ubicación.", "audio": "Primero, segundo, postre y bebida por 7€...", "text": "🍽️ [Restaurante] - 7€ menú completo", "cta": "Activa en Livix Club"},
        {"pilar": "Behind-the-scenes", "hook": "Cómo añadimos un nuevo piso a Livix.", "visual": "Proceso paso a paso (mockup): Propietario contacta → Verificamos → Fotos profesionales → Publicamos. Flechas y checks.", "audio": "Cada piso pasa por este filtro...", "text": "🏠 Calidad garantizada", "cta": "¿Tienes un piso? Contacta"},
        {"pilar": "Zaragoza Life", "hook": "El barrio infravalorado de Zaragoza.", "visual": "Tour por un barrio menos conocido (ej: La Magdalena, San José): mezcla de viejo y nuevo, bares locales, arte urbano.", "audio": "Nadie habla de este barrio, pero...", "text": "💎 Barrio escondido: [Nombre]", "cta": "¿Lo conocías?"},
        {"pilar": "Authority Deep-dive", "hook": "La métrica que usamos para saber si un piso es bueno.", "visual": "Pantalla de un 'dashboard' (mockup) con métricas: precio/m², valoraciones, tiempo de respuesta del propietario.", "audio": "No es solo el precio...", "text": "📏 Métrica clave: €/m²", "cta": "Busca con datos"},
        {"pilar": "Housing Hacks", "hook": "Cómo negociar el precio del alquiler (y que funcione).", "visual": "Escena actuada de una 'negociación'. Subtítulos con las frases clave a usar. Gestos de éxito al final.", "audio": "Di exactamente esto...", "text": "🗣️ 'He visto otros pisos similares por...'", "cta": "Practica antes de ir"},
        {"pilar": "Livix Club", "hook": "El mejor plan para una cita barata en ZGZ.", "visual": "Montaje de un 'date' económico: paseo por el Ebro, café en un sitio con descuento Livix, pintxos en el Tubo.", "audio": "Impresionar sin arruinarte...", "text": "❤️ Plan 1: Paseo Ebro → Café [X]", "cta": "Más ideas en mi perfil"},
        {"pilar": "Behind-the-scenes", "hook": "El feedback que más nos repiten los usuarios.", "visual": "Pantalla de 'reseñas' o comentarios (reales o ficticios) de usuarios. Leerlos en voz alta.", "audio": "'Encontré piso en 3 días', 'Los descuentos son geniales'...", "text": "⭐ 'Encontré piso en 3 días'", "cta": "Pruébalo tú"},
        {"pilar": "Zaragoza Life", "hook": "Eventos universitarios que no te puedes perder.", "visual": "Montaje de eventos: fiestas de facultad, torneos deportivos, charlas. Fechas y nombres en pantalla.", "audio": "Apunta estas fechas...", "text": "📅 [Evento] - [Fecha]", "cta": "Sígueme para no perderte nada"},
        {"pilar": "Housing Hacks", "hook": "El error que te hace perder el piso perfecto.", "visual": "Dramatización: alguien viendo un piso bueno, diciendo 'me lo pienso', y al día siguiente ya está pillado. Cara de frustración.", "audio": "Si te gusta, actúa RÁPIDO...", "text": "❌ No digas: 'Me lo pienso'", "cta": "Decide con cabeza, pero rápido"},
        {"pilar": "Authority Deep-dive", "hook": "Livix vs. Idealista: diferencias reales.", "visual": "Tabla comparativa visual: Livix (verificados, Club, chat directo) vs. Idealista (más volumen, menos filtros). Sin ser agresivo.", "audio": "No es que uno sea 'mejor'...", "text": "🆚 Livix: Verificación | Idealista: Volumen", "cta": "Elige lo que necesitas"},

        # --- MES 3: ACQUISITION (Días 61-90) ---
        {"pilar": "Product/Tour", "hook": "El piso de la semana: 350€ en Delicias.", "visual": "Tour completo del piso: entrada, salón, cocina, habitaciones, vistas. Datos clave en pantalla (m², gastos incluidos, cerca de...).", "audio": "Mira lo que hemos encontrado esta semana...", "text": "🏠 350€/mes | 50m² | Gastos incl.", "cta": "Link en Bio - Ref: [ID]"},
        {"pilar": "Livix Club", "hook": "Cuánto has ahorrado este mes con Livix Club.", "visual": "Pantalla de 'resumen de ahorro' (mockup): Gym -30€, Copistería -10€, Ocio -20€... Total: 60€. Reacción de sorpresa.", "audio": "Si has usado todos los descuentos...", "text": "💰 Ahorro mensual: ~60€", "cta": "¿Ya estás dentro?"},
        {"pilar": "Conversion Loop", "hook": "Última habitación disponible en esta zona.", "visual": "Pantalla de la app con el listing y un banner de 'URGENTE' o 'Última!'. Tour rápido del piso.", "audio": "Esto vuela en días, no semanas...", "text": "⚡ ÚLTIMA - [Barrio]", "cta": "No te quedes sin ella"},
        {"pilar": "Product/Tour", "hook": "Habitación con vistas al Ebro por 280€.", "visual": "Tour de la habitación y el piso. Plano especial de las vistas al río. Datos clave.", "audio": "Despertarte con esto cada mañana...", "text": "🌊 280€/mes | Vistas al Ebro", "cta": "Reserva tu visita"},
        {"pilar": "UGC/Testimonial", "hook": "Encontré piso en 48 horas (historia real).", "visual": "Vídeo del usuario (o el host narrando sobre fotos) contando su experiencia: el estrés inicial, encontrar Livix, el happy ending.", "audio": "(Voz del usuario o narración)", "text": "⏱️ '48h y tenía las llaves'", "cta": "Tu historia puede ser igual"},
        {"pilar": "Landlord POV", "hook": "Propietario en Zaragoza: así llenas tu piso en 7 días.", "visual": "Plano serio, profesional. Pantalla de la sección de Propietarios de Livix. Datos de tiempo medio de alquiler.", "audio": "Deja de tener el piso vacío...", "text": "🔑 Tiempo medio: 7 días", "cta": "Publica gratis tu primer anuncio"},
        {"pilar": "Conversion Loop", "hook": "El piso que todos quieren (y por qué tú deberías verlo).", "visual": "Montaje de un piso 'estrella': muy luminoso, cocina equipada, terraza. Reacciones de 'wow'.", "audio": "Este es el tipo de piso que desaparece en horas...", "text": "⭐ Top Pick de la semana", "cta": "Míralo antes de que sea tarde"},
        {"pilar": "Livix Club", "hook": "Nuevo partner: [Marca/Local].", "visual": "Anuncio estilo 'bienvenida': logo del nuevo partner, qué ofrecen, el descuento. Celebración.", "audio": "Damos la bienvenida a...", "text": "🎉 Nuevo: [Partner] -25%", "cta": "Ya disponible en tu Club"},
        {"pilar": "Product/Tour", "hook": "Piso reformado para 3 estudiantes: 400€/habitación.", "visual": "Tour de un piso grande y moderno para compartir: zonas comunes, cada habitación, baños. Ambiente de amigos.", "audio": "Para venir con tu grupo de amigos...", "text": "👯 3 habitaciones | Reformado 2024", "cta": "Ideal para grupos"},
        {"pilar": "UGC/Testimonial", "hook": "Lo que este propietario piensa de Livix.", "visual": "Entrevista breve (o cita en pantalla) de un propietario satisfecho. Imágenes de su piso.", "audio": "'Antes tardaba meses, ahora semanas'", "text": "👤 [Nombre del propietario]", "cta": "¿Tienes un piso? Habla con nosotros"},

        {"pilar": "Landlord POV", "hook": "El error que cometen los propietarios novatos.", "visual": "Escena actuada de un propietario 'haciendo las cosas mal': fotos oscuras, precio inflado, no responder. Luego, cómo hacerlo bien.", "audio": "Si haces esto, no alquilarás nunca...", "text": "❌ Error #1: Fotos con el móvil sucio", "cta": "Te enseñamos a hacerlo bien"},
        {"pilar": "Conversion Loop", "hook": "Solo quedan 5 pisos en esta zona.", "visual": "Mapa de la zona con 5 pins parpadeando. Sensación de urgencia. Clips rápidos de los 5 pisos.", "audio": "Si esta es tu zona, date prisa...", "text": "🗺️ [Zona]: Solo 5 disponibles", "cta": "Filtra ahora en Livix"},
        {"pilar": "Product/Tour", "hook": "Estudio perfecto para estudiar (y vivir).", "visual": "Tour de un estudio pequeño pero muy funcional: zona de trabajo, cama murphy o sofá-cama, cocina americana. Ambiente de productividad.", "audio": "Para los lobos solitarios...", "text": "🐺 Estudio 25m² | 320€", "cta": "Independencia total"},
        {"pilar": "UGC/Testimonial", "hook": "De Erasmus a residente fijo gracias a Livix.", "visual": "Historia de un estudiante internacional que vino de Erasmus y decidió quedarse. Su viaje buscando piso.", "audio": "(Narración emotiva)", "text": "🌍 De [País] a Zaragoza para siempre", "cta": "Tu nuevo hogar te espera"},
        {"pilar": "Livix Club", "hook": "Resumen: todo lo que puedes conseguir gratis.", "visual": "Lista rápida visual de TODOS los descuentos/beneficios del Club. Muchos logos e iconos. Efecto de 'lluvia de descuentos'.", "audio": "Todo esto, por 0€...", "text": "🎁 Gym + Copistería + Ocio + ...", "cta": "Activa tu Club hoy"},
        {"pilar": "Landlord POV", "hook": "Cuánto puedes ganar alquilando tu piso a estudiantes.", "visual": "Calculadora visual: Alquiler medio ZGZ x 12 meses - gastos = rentabilidad. Números claros.", "audio": "Si tienes un piso vacío...", "text": "💸 Rentabilidad: [X]€/año neto", "cta": "Publica y empieza a ganar"},
        {"pilar": "Conversion Loop", "hook": "El checklist antes de reservar un piso.", "visual": "Lista animada tipo 'to-do' que se va marcando: Visita hecha ✅, Contrato revisado ✅, Gastos claros ✅, Referencias pedidas ✅.", "audio": "Antes de decir 'sí, lo quiero'...", "text": "✅ Paso Final: Revisa todo", "cta": "Ahora sí, a por él"},
        {"pilar": "Product/Tour", "hook": "El piso más solicitado de este mes.", "visual": "Tour 'de lujo' del piso más visto/solicitado. Datos de cuántas visitas ha tenido. Efecto de 'popular'.", "audio": "Este piso ha tenido X solicitudes en una semana...", "text": "🔥 [X] solicitudes esta semana", "cta": "¿Serás tú el elegido?"},
        {"pilar": "UGC/Testimonial", "hook": "Por qué recomiendo Livix a todo el mundo.", "visual": "Compilación de clips cortos de varios usuarios diciendo una frase positiva sobre Livix.", "audio": "(Voces reales de usuarios)", "text": "❤️ 'Fácil', 'Rápido', 'Seguro'", "cta": "Únete a la comunidad"},
        {"pilar": "Conversion Loop", "hook": "Link en Bio: Tu próximo piso te espera.", "visual": "Montaje final épico: los mejores clips de pisos, gente feliz, el logo de Livix. Música inspiracional.", "audio": "Deja de buscar. Empieza a vivir.", "text": "🔗 LINK EN BIO 👆", "cta": "Encuentra tu hogar hoy"}
    ]

    rows = []
    for i, c in enumerate(content_library):
        day = i + 1
        if day <= 30: phase = "1: DISCOVERY (Viral)"
        elif day <= 60: phase = "2: AUTHORITY (Trust)"
        else: phase = "3: ACQUISITION (Convert)"
        
        kpi = "Views" if day <= 30 else "Engagement" if day <= 60 else "Conversión"
        
        rows.append([day, phase, c["pilar"], c["hook"], c["visual"], c["audio"], c["text"], c["cta"], kpi])

    df_matrix = pd.DataFrame(rows, columns=headers)

    # Roadmap & SOP sheets
    roadmap = [
        ["Mes 1", "Discovery (Viral Loops)", "80% Viral / 20% Valor", "Reproducciones / Seguidores"],
        ["Mes 2", "Authority (Value Stacking)", "60% Valor / 30% Viral / 10% Prod", "Engagement (Saves/Shares)"],
        ["Mes 3", "Acquisition (Conversion)", "40% Producto / 40% Valor / 20% Viral", "Descargas App / Registros"]
    ]
    df_roadmap = pd.DataFrame(roadmap, columns=["Periodo", "Fase", "Mix", "KPI"])

    sop = [
        ["Iluminación", "Key Light + Rim Light", "Suave 45° + Contra color marca"],
        ["Cámara", "4K 60fps", "Siempre lente trasera, exposición -10%"],
        ["Audio", "Micro Lavalier o 2º móvil", "Audio limpio > todo"],
        ["Edición", "Regla 2 segundos", "Cambio visual cada 2s"],
        ["Captions", "Bold, 1-2 palabras resaltadas", "Amarillo o color de marca"]
    ]
    df_sop = pd.DataFrame(sop, columns=["Categoría", "Elemento", "Especificación"])

    with pd.ExcelWriter(output_file, engine='openpyxl') as writer:
        df_matrix.to_excel(writer, index=False, sheet_name='🗓️ Plan 90 Días')
        df_roadmap.to_excel(writer, index=False, sheet_name='🚀 Estrategia')
        df_sop.to_excel(writer, index=False, sheet_name='🎬 Producción SOP')

        from openpyxl.styles import Font, PatternFill, Alignment
        workbook = writer.book
        for sheet in workbook.worksheets:
            header_font = Font(bold=True, color="FFFFFF")
            header_fill = PatternFill(start_color="000000", end_color="000000", fill_type="solid")
            for cell in sheet[1]:
                cell.font = header_font
                cell.fill = header_fill
                cell.alignment = Alignment(horizontal="center", wrap_text=True)
            for col in sheet.columns:
                max_len = max(len(str(c.value or "")[:60]) for c in col)
                sheet.column_dimensions[col[0].column_letter].width = min(max_len + 2, 60)

    import shutil
    if os.path.exists(final_destination):
        os.remove(final_destination)
    shutil.move(output_file, final_destination)
    print(f"Master Plan COMPLETO en: {final_destination}")

if __name__ == "__main__":
    generate_ultimate_sheet()
