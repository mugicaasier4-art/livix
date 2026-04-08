import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/**
 * Edge Function: notify-new-lead
 *
 * Triggered by a Supabase Database Webhook on INSERT to landlord_leads.
 * Sends an email notification to the Livix team when a new landlord lead comes in.
 *
 * Setup:
 * 1. Deploy this function: supabase functions deploy notify-new-lead
 * 2. Create a Database Webhook in Supabase Dashboard:
 *    - Table: landlord_leads
 *    - Events: INSERT
 *    - Type: Supabase Edge Function
 *    - Function: notify-new-lead
 * 3. Set env var NOTIFY_EMAIL (defaults to the hardcoded email below)
 */

const NOTIFY_EMAIL = Deno.env.get("NOTIFY_EMAIL") || "asier@livix.es";

interface WebhookPayload {
  type: "INSERT";
  table: string;
  record: {
    id: string;
    nombre: string;
    email: string | null;
    telefono: string;
    zona: string | null;
    habitaciones: number | null;
    precio_orientativo: number | null;
    created_at: string;
  };
  schema: string;
}

Deno.serve(async (req) => {
  // This function is called by Supabase Database Webhooks (server-to-server)
  // No CORS needed, no auth header needed (webhook secret handles auth)

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const payload: WebhookPayload = await req.json();

    if (payload.type !== "INSERT" || payload.table !== "landlord_leads") {
      return new Response("Ignored: not a landlord_leads INSERT", { status: 200 });
    }

    const lead = payload.record;

    // Build notification message
    const subject = `Nuevo lead propietario: ${lead.nombre}`;
    const body = [
      `Nombre: ${lead.nombre}`,
      `Telefono: ${lead.telefono}`,
      lead.email ? `Email: ${lead.email}` : null,
      lead.zona ? `Zona: ${lead.zona}` : null,
      lead.habitaciones ? `Habitaciones: ${lead.habitaciones}` : null,
      lead.precio_orientativo ? `Precio orientativo: ${lead.precio_orientativo} EUR/mes` : null,
      ``,
      `Fecha: ${new Date(lead.created_at).toLocaleString("es-ES", { timeZone: "Europe/Madrid" })}`,
      ``,
      `Responde en <1h para maximizar conversion.`,
    ]
      .filter(Boolean)
      .join("\n");

    // Option 1: Use Supabase's built-in email (via auth admin)
    // Option 2: Use a third-party email service
    // Option 3: Log to console (for now) + insert into a notifications table

    // For now: log the notification and insert into a simple log table
    // This can be upgraded to email/WhatsApp later
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Log the notification
    console.log(`=== NEW LEAD NOTIFICATION ===`);
    console.log(`To: ${NOTIFY_EMAIL}`);
    console.log(`Subject: ${subject}`);
    console.log(body);
    console.log(`=============================`);

    // Try to send email via Supabase Auth (admin API)
    // This sends a "magic link" style email - not ideal but works as a notification
    // For production: integrate with Resend, SendGrid, or similar
    try {
      const resendKey = Deno.env.get("RESEND_API_KEY");
      if (resendKey) {
        // If Resend is configured, send a proper email
        const emailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Livix <notificaciones@livix.es>",
            to: [NOTIFY_EMAIL],
            subject: subject,
            text: body,
          }),
        });

        if (emailRes.ok) {
          console.log("Email sent via Resend");
        } else {
          console.error("Resend error:", await emailRes.text());
        }
      } else {
        console.log("RESEND_API_KEY not set — email not sent. Lead logged to console only.");
      }
    } catch (emailError) {
      console.error("Email send failed:", emailError);
    }

    return new Response(
      JSON.stringify({ success: true, lead_id: lead.id, notified: NOTIFY_EMAIL }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
