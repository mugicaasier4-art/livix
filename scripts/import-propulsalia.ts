import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars: Record<string, string> = {};
envContent.split('\n').forEach((line: string) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let key = match[1];
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    }
    envVars[key] = value;
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Attempting to sign up Propulsalia user...");
  
  // 1. Sign up user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: 'contacto@propulsalia.com',
    password: 'Propulsalia2026!Secure',
    options: {
      data: {
        name: 'Propulsalia Gestión Integral de Propiedades'
      }
    }
  });

  if (authError) {
    console.error("Error signing up:", authError.message);
    if (authError.message.includes("already registered")) {
      console.log("User already exists. Attempting to sign in...");
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: 'contacto@propulsalia.com',
        password: 'Propulsalia2026!Secure'
      });
      if (signInError) {
        console.error("Failed to sign in. Cannot proceed without a valid session.", signInError.message);
        return;
      }
      console.log("Successfully signed in.");
    } else {
      return;
    }
  } else if (!authData.session) {
    console.warn("User signed up, but email confirmation is required. Cannot proceed with insertion.");
    console.log("Please confirm the email or bypass in Supabase Dashboard, then run this script again.");
    return;
  } else {
    console.log("Successfully signed up and logged in.");
  }

  const user = (await supabase.auth.getUser()).data.user;
  if (!user) {
    console.error("No active user session.");
    return;
  }

  const landlordId = user.id;

  // 2. Update profile (make them verified and add bio/phone)
  console.log("Updating profile...");
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      name: 'Propulsalia Gestión Integral de Propiedades',
      phone: '639 725 755',
      bio: 'Profesionales del sector inmobiliario con amplia experiencia en Zaragoza y la Ebro valle.',
      is_verified: true
    })
    .eq('id', landlordId);

  if (profileError) {
    console.error("Error updating profile:", profileError.message);
    // Proceed anyway, might fail due to RLS but we try.
  }

  // 3. Insert listings
  console.log("Inserting properties...");
  const listingsToInsert = [
    {
      landlord_id: landlordId,
      title: 'Espectacular piso céntrico en Jerónimo Blancas',
      description: 'Precioso y cómodo piso exterior de 120 m2 útiles, orientación este/oeste y muy luminoso. Situado en una planta intermedia en la calle Jerónimo Blancas, frente al teatro Principal y a escasos metros de la plaza de España de Zaragoza. La vivienda se alquila totalmente amueblada y equipada. Distribución: Vestíbulo de entrada, baño con plato de ducha, pasillo con armario empotrado, amplio salón-comedor con chimenea y galería exterior, 3 dormitorios amplios y otro baño.',
      address: 'Calle Jerónimo Blancas',
      city: 'Zaragoza',
      price: 1200,
      property_type: 'apartment',
      bedrooms: 3,
      bathrooms: 2,
      area_sqm: 146,
      is_furnished: true,
      has_elevator: true,
      has_ac: true,
      has_heating: true,
      has_parking: false,
      allows_pets: false,
      is_active: true,
      available_from: new Date().toISOString().split('T')[0],
      images: [] // Empty for now
    },
    {
      landlord_id: landlordId,
      title: 'Casa pareada de lujo en Montecanal',
      description: 'Espectacular vivienda pareada en Avenida de la Ilustración, Montecanal. Vivienda de 330m² construidos (320m² útiles) en parcela de 390m². Consta de 4 plantas: semisótano con garaje para 3 vehículos y gran bodega equipada, planta baja con espectacular salón-comedor y jardín de 170m², planta primera con dormitorios y 2 baños, y bajo cubierta abuhardillado con acceso a solárium. Ubicada en urbanización privada con vigilancia 24h. Fianza de 2.300€ y gastos de comunidad (75€/mes) extra.',
      address: 'Avenida de la Ilustración',
      city: 'Zaragoza',
      price: 2000,
      property_type: 'house',
      bedrooms: 5,
      bathrooms: 4, // 3 + 1 aseo
      area_sqm: 330,
      is_furnished: true,
      has_elevator: false,
      has_ac: true,
      has_heating: true,
      has_parking: true,
      allows_pets: false,
      is_active: true,
      available_from: new Date().toISOString().split('T')[0],
      images: [] // Empty for now
    }
  ];

  for (const listing of listingsToInsert) {
    const { data: insertedData, error: insertError } = await supabase
      .from('listings')
      .insert(listing)
      .select('id')
      .single();

    if (insertError) {
      console.error(`Error inserting listing "${listing.title}":`, insertError.message);
    } else {
      console.log(`Successfully inserted listing: ${listing.title} with ID: ${insertedData.id}`);
    }
  }

  console.log("Import process finished.");
}

main().catch(console.error);
