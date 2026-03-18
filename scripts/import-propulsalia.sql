-- ==============================================================================
-- IMPORTACIÓN DE PROPIEDADES DE PROPULSALIA A LIVIX (SUPABASE SQL SCRIPT)
-- ==============================================================================

/*
INSTRUCCIONES DE USO:

1. CREAR EL USUARIO (LANDLORD):
   - Ve al dashboard de Supabase -> "Authentication" -> "Users" -> "Add user".
   - Introduce el email: "contacto@propulsalia.es" y una contraseña segura.
   - Una vez creado, copia el "User UID" (un chorro de texto tipo "123e4567-e89b-12d3...").

2. SUBIR LAS FOTOS AL BUCKET (Opcional antes o después):
   - Ve a "Storage" -> "listing-images".
   - Crea una carpeta llamada "propulsalia".
   - Sube las fotos de las propiedades que tengas descargadas. 
   - Modifica los ARRAY de 'images' de abajo con las URLs públicas de tus fotos. 
   - Si no las tienes, puedes dejar arrays vacíos "ARRAY[]::text[]" e insertarlas después por la interfaz.

3. CONFIGURAR EL SCRIPT:
   - Reemplaza la variable 'TU_UUID_AQUI' de abajo por el "User UID" que copiaste en el Paso 1.

4. EJECUTAR SCRIPT:
   - Ve al "SQL Editor" de Supabase, pega todo este código configurado y haz click en "Run".
*/

DO $$
DECLARE
  v_landlord_id UUID; 
  -- ⬆️⬆️⬆️ ----------------------------------------------------------- ⬆️⬆️⬆️
  
  v_listing1_id UUID := gen_random_uuid();
  v_listing2_id UUID := gen_random_uuid();
BEGIN

  SELECT id INTO v_landlord_id FROM auth.users WHERE email = 'contacto@propulsalia.com';

  IF v_landlord_id IS NULL THEN
    RAISE EXCEPTION 'User contacto@propulsalia.com not found. Make sure the user is created.';
  END IF;

  -- 1. Actualizar el perfil (la tabla auth.users crea este perfil automáticamente vía trigger)
  UPDATE public.profiles
  SET 
    name = 'Propulsalia Gestión Integral de Propiedades',
    phone = '639 725 755',
    bio = 'Profesionales del sector inmobiliario con amplia experiencia en Zaragoza y la Ebro valle.',
    is_verified = true
  WHERE id = v_landlord_id;

  -- 2. Insertar Listing 1: Jerónimo Blancas (Centro)
  INSERT INTO public.listings (
    id, landlord_id, title, description, address, city, 
    price, property_type, bedrooms, bathrooms, area_sqm,
    is_furnished, has_elevator, has_ac, has_heating, 
    has_parking, allows_pets, is_active, available_from,
    images
  ) VALUES (
    v_listing1_id, 
    v_landlord_id, 
    'Espectacular piso céntrico en Jerónimo Blancas', 
    'Precioso y cómodo piso exterior de 120 m2 útiles, orientación este/oeste y muy luminoso. Situado en una planta intermedia en la calle Jerónimo Blancas, frente al teatro Principal y a escasos metros de la plaza de España de Zaragoza. La vivienda se alquila totalmente amueblada y equipada. Distribución: Vestíbulo de entrada, baño con plato de ducha, pasillo con armario empotrado, amplio salón-comedor con chimenea y galería exterior, 3 dormitorios amplios y otro baño.', 
    'Calle Jerónimo Blancas, Centro', 
    'Zaragoza', 
    1200, 
    'apartment', 
    3, 
    2, 
    146,
    true, -- is_furnished
    true, -- has_elevator
    true, -- has_ac
    true, -- has_heating
    false, -- has_parking (no se menciona)
    false, -- allows_pets
    true, -- is_active
    CURRENT_DATE, -- available_from
    ARRAY[]::text[] -- <-- AÑADE URLs DE IMÁGENES AQUÍ (ej: ARRAY['https://.../img1.jpg', 'https://.../img2.jpg'])
  );

    -- 3. Insertar Listing 2: Casa pareada en Montecanal
  INSERT INTO public.listings (
    id, landlord_id, title, description, address, city, 
    price, property_type, bedrooms, bathrooms, area_sqm,
    is_furnished, has_elevator, has_ac, has_heating, 
    has_parking, allows_pets, is_active, available_from,
    images
  ) VALUES (
    v_listing2_id, 
    v_landlord_id, 
    'Casa pareada de lujo en Montecanal', 
    'Espectacular vivienda pareada en Avenida de la Ilustración, Montecanal. Vivienda de 330m² construidos (320m² útiles) en parcela de 390m². Consta de 4 plantas: semisótano con garaje para 3 vehículos y gran bodega equipada, planta baja con espectacular salón-comedor y jardín de 170m², planta primera con dormitorios y 2 baños, y bajo cubierta abuhardillado con acceso a solárium. Ubicada en urbanización privada con vigilancia 24h. Fianza de 2.300€ y gastos de comunidad (75€/mes) extra.', 
    'Avenida de la Ilustración, Montecanal', 
    'Zaragoza', 
    2000, 
    'house',
    5, 
    4, -- 3 baños + 1 aseo
    330,
    true, -- is_furnished
    false, -- has_elevator
    true, -- has_ac
    true, -- has_heating
    true, -- has_parking (garaje 3 vehículos)
    false, -- allows_pets
    true, -- is_active
    CURRENT_DATE, -- available_from
    ARRAY[]::text[] -- <-- AÑADE URLs DE IMÁGENES AQUÍ
  );
  
END $$;
