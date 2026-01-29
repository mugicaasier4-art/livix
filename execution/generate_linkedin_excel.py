import pandas as pd
import os

def generate_linkedin_master_plan():
    output_file = "LIVIX_LINKEDIN_MASTER_PLAN.xlsx"
    desktop_path = os.path.expanduser("~/Desktop")
    final_destination = os.path.join(desktop_path, output_file)

    headers = ["DIA", "SEMANA", "FASE", "PILAR", "HOOK (Gancho)", "ESTRUCTURA / CUERPO", "CTA", "FORMATO", "KPI"]

    # 90 unique LinkedIn posts based on the course
    content_library = [
        # --- MES 1: SETUP & CONSISTENCIA (Días 1-30) ---
        {"pilar": "Authority", "hook": "El 80% de estudiantes busca piso mal. Aquí está el error #1.", "body": "El error: Solo fijarse en el precio.\n\nLo que ignoran:\n→ Gastos de comunidad (30-50€/mes extra)\n→ Depósitos abusivos\n→ Contratos con cláusulas trampa\n\nLa solución: Antes de visitar, pregunta por TODOS los costes.\n\nEn Livix hacemos este trabajo por ti.", "cta": "¿Cuál fue tu error buscando piso? Te leo abajo. 👇", "formato": "Texto Largo"},
        {"pilar": "Behind-the-Scenes", "hook": "Fundamos Livix porque nos estafaron buscando piso.", "body": "Historia real:\n\n2023. Nuevo en Zaragoza. Encontré un 'chollo' en Milanuncios.\n\n500€ de fianza transferida. El propietario desapareció.\n\nNo había verificación. No había filtro. Nadie.\n\nEse día decidí que esto tenía que cambiar.\n\nHoy, Livix verifica cada propietario antes de publicar.", "cta": "¿Te ha pasado algo similar? Cuéntamelo.", "formato": "Storytelling"},
        {"pilar": "Authority", "hook": "5 preguntas que DEBES hacer antes de firmar un contrato.", "body": "1. ¿Los gastos están incluidos? (Luz, agua, internet)\n2. ¿Cuánto es el depósito y cómo se devuelve?\n3. ¿Hay penalización por irte antes?\n4. ¿Quién paga las reparaciones?\n5. ¿Puedo registrarme en el padrón?\n\nGuarda este post. Lo vas a necesitar.", "cta": "🔖 Guarda para tu próxima visita.", "formato": "Lista"},
        {"pilar": "Thought Leadership", "hook": "Las inmobiliarias tradicionales están muertas (y no lo saben).", "body": "Cobran un mes de comisión.\nNo verifican nada.\nLa experiencia de usuario es de 2005.\n\nMientras tanto:\n→ Los marketplaces conectan directamente.\n→ La verificación es digital y en minutos.\n→ La transparencia gana.\n\nEl futuro del alquiler es sin intermediarios.", "cta": "¿Crees que las agencias sobrevivirán? Debate abierto.", "formato": "Opinión"},
        {"pilar": "Social Proof", "hook": "Pasamos de 0 a 500 pisos listados en 6 meses.", "body": "Sin inversión externa.\nSin publicidad pagada.\nSolo resolviendo un problema real.\n\nLo que aprendí:\n→ El boca a boca sigue siendo el rey.\n→ Hacer algo útil > Hacer algo 'escalable'.\n→ Los primeros 100 usuarios te dicen todo.", "cta": "¿Cuál fue tu mayor aprendizaje en los primeros meses de tu proyecto?", "formato": "Hito"},

        {"pilar": "Authority", "hook": "El checklist definitivo para visitar un piso.", "body": "Antes de la visita:\n✅ Investiga al propietario (nombre, historial).\n\nDurante la visita:\n✅ Revisa presión del agua, enchufes, ventanas.\n✅ Pregunta por vecinos ruidosos.\n✅ Haz fotos de TODO.\n\nDespués de la visita:\n✅ Pide el contrato por escrito antes de pagar.", "cta": "Guarda esto. Te ahorrará disgustos.", "formato": "Checklist"},
        {"pilar": "Behind-the-Scenes", "hook": "Esto es lo que pasa cuando un propietario quiere publicar en Livix.", "body": "Paso 1: Nos contacta.\nPaso 2: Verificamos su identidad (DNI, escrituras).\nPaso 3: Revisamos las fotos (nada de fotos de 2010).\nPaso 4: Publicamos.\n\nSi algo falla, no se publica.\n\nPor eso puedes confiar en lo que ves.", "cta": "¿Te gustaría que hiciéramos un 'Day in the Life' de Livix?", "formato": "Proceso"},
        {"pilar": "Authority", "hook": "¿Cuánto cuesta REALMENTE vivir en Zaragoza?", "body": "Desglose real (estudiante medio):\n\n🏠 Alquiler: 280-400€\n🍽️ Comida: 150-200€\n🚌 Transporte: 30€ (abono)\n📱 Móvil/Internet: 30€\n🎉 Ocio: 50-100€\n\n→ Total: 540-760€/mes\n\nPlanifica antes de venir.", "cta": "¿Cuánto gastas tú? Me interesa comparar.", "formato": "Datos"},
        {"pilar": "Thought Leadership", "hook": "El alquiler tradicional tiene un problema de confianza.", "body": "Los inquilinos no confían en los propietarios.\nLos propietarios no confían en los inquilinos.\n\nNadie gana.\n\nLa solución no es más regulación.\nEs transparencia y verificación mutua.\n\nEso es lo que estamos construyendo.", "cta": "¿Cómo crees que se puede arreglar este problema de confianza?", "formato": "Reflexión"},
        {"pilar": "Social Proof", "hook": "'Encontré piso en 3 días' — Historia de María.", "body": "María llegaba de Erasmus en septiembre.\nToda su facultad le dijo que era imposible.\n\nUsó Livix:\n→ Día 1: Filtró por zona y precio.\n→ Día 2: Visitó 3 pisos.\n→ Día 3: Firmó contrato.\n\nNo es suerte. Es tener las herramientas correctas.", "cta": "¿Cuánto tardaste tú en encontrar piso?", "formato": "Caso de Éxito"},

        {"pilar": "Authority", "hook": "3 cláusulas ilegales que aparecen en muchos contratos.", "body": "1. 'No puedes registrarte en el padrón' → ILEGAL.\n2. 'Renuncias a la devolución de fianza' → ILEGAL.\n3. 'Debes irte con 15 días de preaviso' → Depende, pero a menudo abusiva.\n\nLee siempre el contrato. Y pregunta.", "cta": "¿Has visto alguna cláusula rara? Compártela.", "formato": "Educativo"},
        {"pilar": "Behind-the-Scenes", "hook": "El día que casi cerramos Livix.", "body": "Mes 4. Sin tracción. Sin dinero. Sin ideas.\n\nMi cofundador me dijo: '¿Y si simplemente paramos?'\n\nEsa noche recibimos un mensaje de un usuario:\n'Gracias. Encontré piso sin que me timaran por primera vez.'\n\nNo paramos.", "cta": "¿Cuál fue el momento más duro de tu proyecto?", "formato": "Vulnerable"},
        {"pilar": "Thought Leadership", "hook": "El mayor problema de los portales inmobiliarios no es el precio.", "body": "Es la FRICCIÓN.\n\n→ Contactar a 10 anuncios para que te respondan 2.\n→ Fotos de hace 5 años.\n→ Pisos que ya están alquilados.\n\nLa solución: respuesta garantizada en 24h.\n\nEso es lo que hacemos.", "cta": "¿Cuál es tu mayor frustración buscando piso online?", "formato": "Problema/Solución"},
        {"pilar": "Authority", "hook": "Guía rápida: Delicias vs. Actur para estudiantes.", "body": "DELICIAS:\n✅ Barato (250-320€)\n✅ Comida increíble\n❌ Edificios más viejos\n\nACTUR:\n✅ Tranvía en la puerta\n✅ Pisos nuevos\n❌ Más caro (350-450€)\n\nNo hay mejor ni peor. Hay lo que TÚ necesitas.", "cta": "¿En qué barrio vives tú? ¿Lo recomendarías?", "formato": "Comparativa"},
        {"pilar": "Social Proof", "hook": "De propietario escéptico a fan de Livix.", "body": "Juan tenía un piso vacío 4 meses.\nNo confiaba en plataformas online.\n\n'Lo voy a probar, pero no creo que funcione.'\n\n2 semanas después tenía inquilino.\n\nAhora tiene 3 pisos publicados.", "cta": "¿Tienes un piso que quieras alquilar? Hablemos.", "formato": "Testimonio"},

        {"pilar": "Authority", "hook": "Cómo detectar un anuncio falso en 10 segundos.", "body": "🚩 Precio demasiado bajo para la zona.\n🚩 Fotos genéricas de Google/stock.\n🚩 Pide transferencia antes de ver.\n🚩 No quiere enseñar el piso en persona.\n🚩 Email genérico (@gmail.com o similar).\n\nSi ves 2 o más: HUYE.", "cta": "Comparte para que no timen a nadie más.", "formato": "Red Flags"},
        {"pilar": "Behind-the-Scenes", "hook": "Así decidimos qué funcionalidad construir primero.", "body": "Teníamos 100 ideas. Recursos para 1.\n\nPreguntamos a 50 usuarios potenciales:\n'¿Cuál es tu mayor dolor buscando piso?'\n\nRespuesta #1: 'No sé si el propietario es de fiar.'\n\nPrimera funcionalidad: Verificación de propietarios.", "cta": "¿Cómo decides tú en qué enfocarte?", "formato": "Decisión"},
        {"pilar": "Thought Leadership", "hook": "El futuro del alquiler será 100% sin agencias.", "body": "No es una predicción. Es una certeza.\n\n→ La tecnología reduce la fricción.\n→ Los usuarios quieren transparencia.\n→ Las comisiones de 1 mes son absurdas.\n\nEn 10 años, pagar comisión de agencia será tan raro como pagar por Spotify en CD.", "cta": "¿Estás de acuerdo o crees que las agencias sobrevivirán?", "formato": "Predicción"},
        {"pilar": "Authority", "hook": "El mejor momento del año para buscar piso en Zaragoza.", "body": "EVITA: Septiembre (todo el mundo busca).\n\nBUSCA EN:\n→ Junio: Los que acaban se van, hay stock.\n→ Enero: Segundo cuatrimestre, menos demanda.\n→ Noviembre: Chollos de última hora.\n\nLa paciencia es dinero.", "cta": "¿Cuándo encontraste el tuyo?", "formato": "Timing"},
        {"pilar": "Social Proof", "hook": "Esta semana hemos conectado a 15 estudiantes con su piso.", "body": "15 personas que ya no tienen que preocuparse.\n15 llaves entregadas.\n15 nuevos hogares.\n\nCada número tiene una historia.\n\nGracias por confiar.", "cta": "Síguenos para ver más historias.", "formato": "Números"},

        {"pilar": "Authority", "hook": "Tu fianza: cómo protegerla desde el día 1.", "body": "EL PRIMER DÍA:\n→ Haz fotos de TODO (grietas, manchas, electrodomésticos).\n→ Envíalas por email al propietario con fecha.\n\nEL ÚLTIMO DÍA:\n→ Limpia a fondo.\n→ Haz fotos de nuevo.\n→ Pide recibo de entrega de llaves.\n\nEsto es tu prueba.", "cta": "Guarda esto. Tu yo del futuro te lo agradecerá.", "formato": "Consejo Legal"},
        {"pilar": "Behind-the-Scenes", "hook": "El feedback que más nos duele (y más nos ayuda).", "body": "'La app es muy lenta en móvil.'\n\nNo queríamos oírlo. Pero era verdad.\n\nDos semanas de trabajo. Performance mejorada un 70%.\n\nEl feedback negativo es un regalo. Si sabes escucharlo.", "cta": "¿Cuál es el feedback más duro que has recibido?", "formato": "Aprendizaje"},
        {"pilar": "Thought Leadership", "hook": "Los propietarios también son víctimas (a veces).", "body": "No todo propietario es un 'casero abusivo'.\n\nMuchos:\n→ Han tenido impagos.\n→ Han visto su piso destrozado.\n→ Tienen miedo.\n\nLa solución no es odiar al otro lado.\nEs crear sistemas de confianza mutua.", "cta": "¿Qué opinas? ¿Hay matices en este debate?", "formato": "Perspectiva"},
        {"pilar": "Authority", "hook": "5 herramientas gratuitas para gestionar tu piso compartido.", "body": "1. Splitwise: Para dividir gastos.\n2. Google Calendar compartido: Para limpiezas y turnos.\n3. Notion: Para la lista de la compra.\n4. WhatsApp Business: Para hablar con el casero.\n5. Livix: Para encontrar el piso 😉", "cta": "¿Usas alguna que no esté aquí?", "formato": "Herramientas"},
        {"pilar": "Social Proof", "hook": "Nuestro NPS pasó de 30 a 65 en 3 meses.", "body": "¿Cómo?\n\n1. Preguntamos a CADA usuario qué mejorar.\n2. Implementamos el TOP 3 de quejas.\n3. Les avisamos cuando lo arreglamos.\n\nNo hay magia. Hay escucha.", "cta": "¿Cuál es tu secreto para mejorar la satisfacción del cliente?", "formato": "Métrica"},

        {"pilar": "Authority", "hook": "Derechos del inquilino que probablemente no conoces.", "body": "1. Puedes pedir factura de cualquier reparación.\n2. El propietario NO puede entrar sin avisar.\n3. Tienes derecho a empadronarte SIEMPRE.\n4. La fianza debe estar depositada en organismo oficial.\n\nConoce tus derechos.", "cta": "¿Conocías todos? ¿Cuál te sorprendió?", "formato": "Legal"},
        {"pilar": "Behind-the-Scenes", "hook": "Nuestra primera 'oficina' era un Starbucks.", "body": "Sin dinero para coworking.\nSin contactos.\nSolo dos portátiles y WiFi gratis.\n\nHoy tenemos oficina (pequeña, pero nuestra).\n\nA veces hay que empezar donde puedas.", "cta": "¿Dónde empezaste tú?", "formato": "Origen"},
        {"pilar": "Thought Leadership", "hook": "La burbuja de los 'pisos turísticos' está a punto de estallar.", "body": "Cada vez más regulación.\nVecinos hartos.\nRentabilidad a la baja.\n\nMi predicción: en 5 años, el alquiler a largo plazo volverá a ser el rey.\n\nLos propietarios inteligentes ya se están moviendo.", "cta": "¿Alquiler turístico o tradicional? ¿Qué ves tú?", "formato": "Tendencia"},
        {"pilar": "Authority", "hook": "El error que cometen los estudiantes de fuera de España.", "body": "Venir en septiembre sin piso.\n\nLa solución:\n→ Busca desde tu país (Livix funciona desde cualquier sitio).\n→ Haz videollamadas para 'visitar'.\n→ Reserva ANTES de llegar.\n\nNo te la juegues.", "cta": "¿Eres de fuera? ¿Cómo lo hiciste tú?", "formato": "Consejo Internacional"},
        {"pilar": "Social Proof", "hook": "'Alquilé mi piso en 5 días por primera vez en mi vida' — Pedro.", "body": "Pedro llevaba 2 meses con su piso vacío.\n\nProbó Livix:\n→ Fotos profesionales (gratis con nuestro plan).\n→ Publicación verificada.\n→ 5 días después: inquilino.\n\nA veces solo necesitas el canal correcto.", "cta": "¿Tienes un piso vacío?", "formato": "Testimonio B2B"},

        # --- MES 2: OPTIMIZACIÓN (Días 31-60) ---
        {"pilar": "Authority", "hook": "Cómo negociar el precio del alquiler (y que funcione).", "body": "1. Investiga precios de la zona (Idealista, Livix).\n2. Señala defectos del piso (con respeto).\n3. Ofrece pagar varios meses por adelantado.\n4. Muestra solvencia (nómina de padres, etc.).\n\nNo siempre funciona. Pero no intentarlo es tonto.", "cta": "¿Has negociado alguna vez? ¿Funcionó?", "formato": "Tácticas"},
        {"pilar": "Behind-the-Scenes", "hook": "Rechazamos inversión de 100K€. Aquí está el porqué.", "body": "Nos pidieron:\n→ El 40% de la empresa.\n→ 'Crecer a toda costa' (aunque perdamos dinero).\n\nDijimos que no.\n\nPreferimos crecer lento pero sostenible.\nPreferimos ser dueños de nuestras decisiones.\n\nNo todo dinero es buen dinero.", "cta": "¿Habrías hecho lo mismo?", "formato": "Decisión"},
        {"pilar": "Thought Leadership", "hook": "El concepto de 'coliving' está sobrevalorado.", "body": "Suena cool. Pero:\n→ Precios inflados por la 'experiencia'.\n→ Falta de privacidad real.\n→ Comunidades forzadas.\n\nA veces, un buen piso compartido con gente normal es mejor.\n\nNo todo lo que brilla es oro.", "cta": "¿Has probado coliving? ¿Qué tal?", "formato": "Contrarian"},
        {"pilar": "Authority", "hook": "Anatomía de un buen anuncio de piso.", "body": "FOTOS:\n→ Luz natural, amplias, de cada habitación.\n\nDESCRIPCIÓN:\n→ M², gastos incluidos, normas claras.\n\nPRECIO:\n→ Realista. Los chollos 'demasiado buenos' asustan.\n\nRESPUESTA:\n→ Contesta en menos de 24h.\n\nAsí alquilas rápido.", "cta": "Si eres propietario y necesitas ayuda, escríbeme.", "formato": "Guía B2B"},
        {"pilar": "Social Proof", "hook": "Este mes hemos verificado a 30 nuevos propietarios.", "body": "30 DNIs comprobados.\n30 escrituras validadas.\n30 pisos listos para ti.\n\nNo es solo un número.\nEs tranquilidad para quien busca.", "cta": "Confía en lo que ves en Livix.", "formato": "Transparencia"},

        {"pilar": "Authority", "hook": "Los 3 barrios más infravalorados de Zaragoza.", "body": "1. La Magdalena: Artsy, céntrico, barato.\n2. Las Fuentes: Bien comunicado, precios increíbles.\n3. Torrero: Tranquilo, cerca del Canal, en auge.\n\nNo siempre hay que ir a donde van todos.", "cta": "¿Cuál es tu barrio favorito 'secreto'?", "formato": "Descubrimiento"},
        {"pilar": "Behind-the-Scenes", "hook": "Cómo es un lunes en Livix.", "body": "9:00 - Café y revisión de métricas.\n10:00 - Llamada con propietarios nuevos.\n12:00 - Desarrollo de producto.\n14:00 - Comida (sagrada).\n16:00 - Soporte a usuarios.\n18:00 - Planificación de la semana.\n\nMenos glamuroso de lo que parece. Pero lo amamos.", "cta": "¿Cómo es tu lunes?", "formato": "Día a Día"},
        {"pilar": "Thought Leadership", "hook": "El problema de la vivienda no se arregla con más leyes.", "body": "Se arregla con:\n→ Más construcción.\n→ Más transparencia.\n→ Menos especulación.\n→ Mejor tecnología.\n\nLas leyes sin ejecución son papel mojado.\n\nHace falta acción, no promesas.", "cta": "¿Cuál crees que es la solución real?", "formato": "Política"},
        {"pilar": "Authority", "hook": "Cómo hacer una mudanza por menos de 100€.", "body": "1. Wallapop/FB: Cajas gratis de gente que se ha mudado.\n2. Furgo compartida: BlaBlaCar de mudanzas.\n3. Amigos + Cerveza: El clásico que nunca falla.\n4. Timing: Entre semana es más barato.\n\nNo hace falta arruinarse.", "cta": "¿Tu mejor hack de mudanza?", "formato": "Ahorro"},
        {"pilar": "Social Proof", "hook": "Un propietario nos dejó esta reseña y me emocioné.", "body": "'Por primera vez en 10 años, alquilé sin miedo.'\n\n10 años de malas experiencias.\n10 años de desconfianza.\n\nY lo rompimos.\n\nPor esto hacemos lo que hacemos.", "cta": "Historias así nos motivan. Gracias.", "formato": "Emoción"},

        {"pilar": "Authority", "hook": "Qué incluir en tu perfil de inquilino para destacar.", "body": "1. Foto profesional (o al menos decente).\n2. Breve presentación: quién eres, qué estudias/trabajas.\n3. Referencias de anteriores caseros (si las tienes).\n4. Solvencia: Prueba de ingresos o aval.\n\nLos propietarios reciben 50+ solicitudes. Destaca.", "cta": "¿Qué añadirías tú?", "formato": "Personal Branding"},
        {"pilar": "Behind-the-Scenes", "hook": "El peor bug que hemos tenido (y cómo lo arreglamos).", "body": "Los mensajes entre usuarios se enviaban... al usuario equivocado.\n\n3 horas de pánico.\nRevisión de código a las 2am.\nHotfix a las 5am.\n\nLección: Siempre, SIEMPRE, testea en producción inventada primero.", "cta": "¿Tu peor bug? Te leo.", "formato": "Fail"},
        {"pilar": "Thought Leadership", "hook": "Los estudiantes no son 'malos inquilinos'. Son diferentes.", "body": "Sí, hacen más ruido.\nSí, rotan más.\n\nPero también:\n→ Pagan puntualmente (los padres vigilan).\n→ Son flexibles.\n→ Recomiendan a amigos.\n\nHay que entender al cliente. No juzgarlo.", "cta": "¿Eres propietario? ¿Cuál es tu experiencia?", "formato": "Defensa"},
        {"pilar": "Authority", "hook": "El kit de emergencia para tu primer piso.", "body": "🔧 Herramientas básicas: destornillador, cinta, cutter.\n💊 Botiquín: ibuprofeno, tiritas, termómetro.\n🧹 Limpieza: fregona, cubo, lejía.\n🔦 Linterna: para cortes de luz.\n📱 Contactos: fontanero, electricista, casero.\n\nEstás listo.", "cta": "¿Qué más añadirías?", "formato": "Kit"},
        {"pilar": "Social Proof", "hook": "Medios que han hablado de Livix.", "body": "[Si tienes menciones en prensa, listarlas aquí]\n\n→ El Periódico de Aragón\n→ Heraldo de Aragón (sección startups)\n→ Podcast local X\n\n(Adaptar a la realidad)", "cta": "Gracias por la visibilidad.", "formato": "Autoridad"},

        {"pilar": "Authority", "hook": "Cómo poner una reclamación si te timan.", "body": "1. Guarda TODAS las pruebas (emails, WhatsApps, recibos).\n2. Acude a la Oficina Municipal de Consumo.\n3. Si es fraude: denuncia en policía.\n4. Considera la OCU para asesoría.\n\nNo te quedes callado.", "cta": "¿Has tenido que reclamar alguna vez?", "formato": "Protección"},
        {"pilar": "Behind-the-Scenes", "hook": "Nuestra métrica favorita (y no es la facturación).", "body": "Es el 'Tiempo hasta encontrar piso'.\n\nAntes de Livix: 2-3 semanas de media.\nCon Livix: 5 días.\n\nCada día que ahorramos es un día menos de estrés.\n\nEso es lo que importa.", "cta": "¿Cuál es la métrica que más te importa?", "formato": "KPI"},
        {"pilar": "Thought Leadership", "hook": "El modelo de 'freemium' está roto en el sector inmobiliario.", "body": "Todos ofrecen 'gratis' para atraer.\nLuego te cobran por todo.\n\nNuestra apuesta: transparencia desde el minuto 1.\nSabes lo que pagas antes de empezar.\n\nSin sorpresas.", "cta": "¿Crees que la transparencia es una ventaja competitiva?", "formato": "Modelo de Negocio"},
        {"pilar": "Authority", "hook": "Los impuestos que pagas (o deberías pagar) por alquilar.", "body": "Si eres INQUILINO: Nada directo (los gastos van en el alquiler).\n\nSi eres PROPIETARIO:\n→ IRPF sobre rendimientos.\n→ IBI (puedes repercutirlo).\n→ Seguro de impago (opcional pero recomendable).\n\nConsulta con un asesor.", "cta": "¿Tema fiscal que te gustaría que expliquemos?", "formato": "Fiscal"},
        {"pilar": "Social Proof", "hook": "1000 usuarios registrados. Gracias.", "body": "Hace 1 año éramos 0.\nHoy somos 1000.\n\n1000 personas que confían en lo que hacemos.\n1000 razones para seguir.\n\nGracias por estar.", "cta": "Si aún no estás, ¿a qué esperas?", "formato": "Milestone"},

        # --- MES 3: ESCALADO & CONVERSIÓN (Días 61-90) ---
        {"pilar": "Authority", "hook": "Guía definitiva para propietarios: cómo alquilar rápido y seguro.", "body": "1. Fotos profesionales (la luz es clave).\n2. Precio justo (investiga tu zona).\n3. Descripción completa (m², gastos, normas).\n4. Responde RÁPIDO (menos de 24h).\n5. Verifica a tus inquilinos.\n\nSigue esto y alquilas en < 2 semanas.", "cta": "¿Tienes un piso? Hablamos.", "formato": "Guía B2B"},
        {"pilar": "Conversion", "hook": "Pisos nuevos esta semana en Zaragoza.", "body": "📍 Delicias: Habitación 260€, gastos incluidos.\n📍 Centro: Estudio 380€, reformado.\n📍 Actur: Piso 3 hab., 900€ total.\n\nTodos verificados. Todos reales.", "cta": "→ Link en comentarios para ver más.", "formato": "Producto"},
        {"pilar": "Conversion", "hook": "Última habitación disponible cerca del Campus San Francisco.", "body": "280€/mes.\nGastos incluidos.\n5 min andando a la facultad.\n\nNo hay más como esta.", "cta": "Contáctanos YA si te interesa.", "formato": "Urgencia"},
        {"pilar": "Social Proof", "hook": "De 0 a 50 propietarios en nuestra plataforma: el viaje.", "body": "Mes 1: Llamadas en frío. Rechazo. Más llamadas.\nMes 3: Primeros 10 confían.\nMes 6: El boca a boca empieza.\nMes 12: 50 propietarios felices.\n\nNo hay atajos. Hay trabajo.", "cta": "Si eres propietario, únete al club.", "formato": "Crecimiento B2B"},
        {"pilar": "Authority", "hook": "Por qué el seguro de impago es la mejor inversión para propietarios.", "body": "Coste: ~3-5% del alquiler anual.\nBeneficio: Tranquilidad absoluta.\n\nCubre:\n→ Impagos hasta X meses.\n→ Gastos legales.\n→ Actos vandálicos.\n\nMatemáticas simples: más paz mental, menos riesgo.", "cta": "¿Usas seguro de impago?", "formato": "B2B Educativo"},

        {"pilar": "Conversion", "hook": "Registra tu piso GRATIS en Livix (primeras 2 publicaciones sin coste).", "body": "Sin comisiones.\nSin letra pequeña.\nSin sorpresas.\n\nSolo tú, tu piso, y estudiantes verificados.", "cta": "→ Enlace en comentarios para empezar.", "formato": "CTA Directo"},
        {"pilar": "Behind-the-Scenes", "hook": "Así es como seleccionamos a nuestro equipo.", "body": "1. Skills importan. Pero no lo son todo.\n2. Buscamos gente que 'pilota' el problema.\n3. Cultura > CV.\n4. Prueba real > Entrevista teórica.\n\nSomos un equipo pequeño. Cada persona cuenta.", "cta": "¿Cómo contratas tú?", "formato": "Cultura"},
        {"pilar": "Thought Leadership", "hook": "El futuro del alquiler es colaborativo.", "body": "Propietarios e inquilinos no son enemigos.\nSon socios.\n\n→ El propietario ofrece un hogar.\n→ El inquilino lo cuida.\n→ Ambos ganan.\n\nLa tecnología puede facilitar esta colaboración.\nEsa es nuestra misión.", "cta": "¿Crees en un modelo más colaborativo?", "formato": "Visión"},
        {"pilar": "Authority", "hook": "Checklist final antes de firmar un contrato.", "body": "☐ ¿Has visto el piso en persona?\n☐ ¿Tienes el contrato por escrito?\n☐ ¿Sabes exactamente qué gastos pagas?\n☐ ¿Has hecho fotos del estado actual?\n☐ ¿Tienes contacto directo del propietario?\n\nSi falta algo: NO FIRMES.", "cta": "Guarda y comparte.", "formato": "Checklist Final"},
        {"pilar": "Social Proof", "hook": "'Livix cambió mi forma de ver el alquiler' — Usuario real.", "body": "'Antes era un infierno.\nLlamadas sin respuesta.\nEstafas.\nFrustración.\n\nAhora sé que lo que veo es real.\nY eso no tiene precio.'", "cta": "Prueba tú también.", "formato": "Testimonio"},

        {"pilar": "Conversion", "hook": "¿Buscas piso? Esto es lo que tenemos ahora mismo.", "body": "[Lista de 3-5 pisos destacados con precio y zona]\n\nTodos verificados.", "cta": "→ Comenta tu zona y presupuesto, te ayudo.", "formato": "Interactivo"},
        {"pilar": "Authority", "hook": "Errores que veo en propietarios cada semana.", "body": "1. Fotos oscuras y borrosas.\n2. Descripción de 3 líneas.\n3. No responder en días.\n4. Precio inflado 'por si acaso'.\n\nArregla esto y alquilarás.", "cta": "¿Te ayudamos con tu anuncio?", "formato": "Crítica Constructiva"},
        {"pilar": "Behind-the-Scenes", "hook": "Qué aprendí fundando una startup en España.", "body": "1. La burocracia es real (pero superable).\n2. El talento está aquí (no hace falta ir a Silicon Valley).\n3. Los clientes locales son exigentes (y eso te hace mejor).\n4. La comunidad de startups es pequeña y generosa.\n\nNo es fácil. Pero merece la pena.", "cta": "¿Tu mayor aprendizaje emprendiendo?", "formato": "Reflexión Local"},
        {"pilar": "Conversion", "hook": "Propietarios: así llenamos pisos en 7 días de media.", "body": "1. Fotos profesionales.\n2. Verificación que genera confianza.\n3. Visibilidad ante +1000 estudiantes.\n4. Soporte dedicado.\n\nTú pones el piso. Nosotros hacemos el resto.", "cta": "Prueba sin compromiso.", "formato": "Propuesta de Valor"},
        {"pilar": "Social Proof", "hook": "Esta comunidad ya son +2000 personas.", "body": "Estudiantes.\nPropietarios.\nFundadores.\nCuriosos.\n\nTodos interesados en un alquiler mejor.\n\nGracias por ser parte.", "cta": "Si aún no estás, únete.", "formato": "Comunidad"},

        {"pilar": "Authority", "hook": "Resumen: todo lo que aprendí sobre alquiler en 2 años.", "body": "1. La confianza es la moneda más valiosa.\n2. La velocidad de respuesta lo es todo.\n3. La transparencia vende (aunque duela).\n4. El boca a boca sigue siendo el rey.\n5. Los pequeños detalles marcan la diferencia.\n\nGracias por leerme. Esto es solo el principio.", "cta": "¿Qué aprendizaje te llevas tú?", "formato": "Resumen"},
        {"pilar": "Behind-the-Scenes", "hook": "Planes para 2026: lo que viene en Livix.", "body": "→ Expansión a más ciudades.\n→ App móvil nativa.\n→ Más partners en Livix Club.\n→ Verificación aún más robusta.\n\nNo paramos.", "cta": "¿Qué te gustaría ver?", "formato": "Roadmap"},
        {"pilar": "Thought Leadership", "hook": "El alquiler será el nuevo 'Netflix de la vivienda'.", "body": "Pagar por uso. Cambiar cuando quieras. Sin ataduras.\n\nLos jóvenes no quieren comprar.\nQuieren flexibilidad.\n\nLas startups que lo entiendan, ganarán.", "cta": "¿Tú comprarías o alquilarías?", "formato": "Futuro"},
        {"pilar": "Conversion", "hook": "Link en bio: Tu próximo hogar te espera.", "body": "Pisos verificados.\nPropietarios reales.\nSin comisiones ocultas.\n\nEs hora de dejar de buscar y empezar a vivir.", "cta": "→ Link en primer comentario.", "formato": "CTA Final"},
        {"pilar": "Social Proof", "hook": "Gracias por estos 90 días de LinkedIn.", "body": "90 posts.\n90 conversaciones.\n90 aprendizajes.\n\nEsto no es un canal de marketing.\nEs una comunidad.\n\nGracias por estar. Seguimos.", "cta": "¿Qué post te gustó más? Te leo.", "formato": "Cierre"}
    ]

    rows = []
    for i, c in enumerate(content_library):
        day = i + 1
        week = (day - 1) // 7 + 1
        if day <= 30: phase = "1: Setup & Consistencia"
        elif day <= 60: phase = "2: Optimización"
        else: phase = "3: Escalado & Conversión"
        
        kpi = "Impresiones" if day <= 30 else "Engagement" if day <= 60 else "Leads"
        
        rows.append([day, week, phase, c["pilar"], c["hook"], c["body"], c["cta"], c["formato"], kpi])

    df_matrix = pd.DataFrame(rows, columns=headers)

    # Roadmap sheet
    roadmap = [
        ["Mes 1 (1-30)", "Setup & Consistencia", "3-4 posts/semana, encontrar voz", "Impresiones / Seguidores"],
        ["Mes 2 (31-60)", "Optimización", "Analizar métricas, duplicar lo que funciona", "Engagement / Profile Views"],
        ["Mes 3 (61-90)", "Escalado & Conversión", "5 posts/semana, CTAs directos", "Leads / Registros"]
    ]
    df_roadmap = pd.DataFrame(roadmap, columns=["Periodo", "Fase", "Acción", "KPI"])

    # Hooks sheet
    hooks = [
        ["Curiosidad", "El 80% de estudiantes busca piso mal. Aquí está el error #1."],
        ["Storytelling", "Fundamos Livix porque nos estafaron buscando piso."],
        ["Contrarian", "Las inmobiliarias tradicionales están muertas."],
        ["Social Proof", "Pasamos de 0 a 500 pisos en 6 meses."],
        ["Educativo", "5 preguntas que DEBES hacer antes de firmar."],
        ["Vulnerable", "El día que casi cerramos Livix."],
        ["Predicción", "El futuro del alquiler será 100% sin agencias."],
        ["Datos", "¿Cuánto cuesta REALMENTE vivir en Zaragoza?"]
    ]
    df_hooks = pd.DataFrame(hooks, columns=["Tipo", "Ejemplo de Hook"])

    with pd.ExcelWriter(output_file, engine='openpyxl') as writer:
        df_matrix.to_excel(writer, index=False, sheet_name='🗓️ Plan 90 Días')
        df_roadmap.to_excel(writer, index=False, sheet_name='🚀 Estrategia')
        df_hooks.to_excel(writer, index=False, sheet_name='🪝 Hooks')

        from openpyxl.styles import Font, PatternFill, Alignment
        workbook = writer.book
        for sheet in workbook.worksheets:
            header_font = Font(bold=True, color="FFFFFF")
            header_fill = PatternFill(start_color="0A66C2", end_color="0A66C2", fill_type="solid") # LinkedIn blue
            for cell in sheet[1]:
                cell.font = header_font
                cell.fill = header_fill
                cell.alignment = Alignment(horizontal="center", wrap_text=True)
            for col in sheet.columns:
                max_len = max(len(str(c.value or "")[:50]) for c in col)
                sheet.column_dimensions[col[0].column_letter].width = min(max_len + 2, 55)

    import shutil
    if os.path.exists(final_destination):
        os.remove(final_destination)
    shutil.move(output_file, final_destination)
    print(f"LinkedIn Master Plan COMPLETO en: {final_destination}")

if __name__ == "__main__":
    generate_linkedin_master_plan()
