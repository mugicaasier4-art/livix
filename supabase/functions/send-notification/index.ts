import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  userId: string;
  type: "application_received" | "application_status" | "message" | "visit_scheduled" | "review" | "custom";
  data: Record<string, unknown>;
}

// Helper to check if caller is authorized to send notification to target user
async function checkNotificationAuthorization(
  supabase: ReturnType<typeof createClient>,
  callerId: string,
  targetUserId: string,
  type: string,
  data: Record<string, unknown>
): Promise<boolean> {
  // Users can always send notifications to themselves
  if (callerId === targetUserId) {
    return true;
  }

  // Check if caller is an admin
  const { data: adminRole } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", callerId)
    .eq("role", "admin")
    .maybeSingle();
  
  if (adminRole) {
    return true;
  }

  // For application-related notifications, verify caller owns the listing or is the applicant
  if (type === "application_received" || type === "application_status" || type === "visit_scheduled") {
    const applicationId = data.applicationId as string || data.relatedId as string;
    if (applicationId) {
      const { data: application } = await supabase
        .from("applications")
        .select("landlord_id, student_id")
        .eq("id", applicationId)
        .single();
      
      if (application) {
        // Landlord can notify student, student can notify landlord
        if (application.landlord_id === callerId && application.student_id === targetUserId) {
          return true;
        }
        if (application.student_id === callerId && application.landlord_id === targetUserId) {
          return true;
        }
      }
    }
  }

  // For message notifications, verify caller is participant in conversation
  if (type === "message") {
    const conversationId = data.conversationId as string;
    if (conversationId) {
      const { data: conversation } = await supabase
        .from("conversations")
        .select("participant_1_id, participant_2_id")
        .eq("id", conversationId)
        .single();
      
      if (conversation) {
        const isParticipant = 
          conversation.participant_1_id === callerId || 
          conversation.participant_2_id === callerId;
        const targetIsOtherParticipant = 
          conversation.participant_1_id === targetUserId || 
          conversation.participant_2_id === targetUserId;
        
        if (isParticipant && targetIsOtherParticipant) {
          return true;
        }
      }
    }
  }

  // For review notifications, verify caller wrote the review
  if (type === "review") {
    const reviewId = data.reviewId as string || data.relatedId as string;
    if (reviewId) {
      const { data: review } = await supabase
        .from("reviews")
        .select("student_id, landlord_id")
        .eq("id", reviewId)
        .single();
      
      if (review) {
        // Student (reviewer) can notify landlord
        if (review.student_id === callerId && review.landlord_id === targetUserId) {
          return true;
        }
      }
    }
  }

  // Default: not authorized
  return false;
}

const emailTemplates: Record<string, (data: Record<string, unknown>) => { subject: string; html: string }> = {
  application_received: (data) => ({
    subject: `Nueva solicitud para ${data.listingTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a1a1a;">¡Nueva solicitud recibida!</h2>
        <p>Has recibido una nueva solicitud para tu anuncio:</p>
        <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <strong>${data.listingTitle}</strong>
          <p style="margin: 8px 0 0 0; color: #666;">De: ${data.studentName}</p>
          <p style="margin: 4px 0 0 0; color: #666;">Entrada: ${data.moveInDate}</p>
        </div>
        <a href="${data.actionUrl}" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
          Ver solicitud
        </a>
      </div>
    `,
  }),
  
  application_status: (data) => ({
    subject: `Tu solicitud ha sido ${data.status === 'approved' ? 'aprobada' : 'actualizada'}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a1a1a;">Actualización de tu solicitud</h2>
        <p>Tu solicitud para <strong>${data.listingTitle}</strong> ha sido ${
          data.status === 'approved' ? '✅ aprobada' : 
          data.status === 'rejected' ? '❌ rechazada' : 'actualizada'
        }.</p>
        ${data.status === 'approved' ? `
          <p>¡Enhorabuena! El siguiente paso es coordinar los detalles con el propietario.</p>
        ` : data.status === 'rejected' ? `
          <p>No te desanimes, hay muchas más opciones disponibles en Livix.</p>
        ` : ''}
        <a href="${data.actionUrl}" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">
          Ver detalles
        </a>
      </div>
    `,
  }),
  
  message: (data) => ({
    subject: `Nuevo mensaje de ${data.senderName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a1a1a;">Tienes un nuevo mensaje</h2>
        <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p style="margin: 0;"><strong>${data.senderName}</strong></p>
          <p style="margin: 8px 0 0 0; color: #666;">${data.preview}</p>
        </div>
        <a href="${data.actionUrl}" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
          Responder
        </a>
      </div>
    `,
  }),
  
  visit_scheduled: (data) => ({
    subject: `Visita programada: ${data.listingTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a1a1a;">Visita confirmada</h2>
        <p>Se ha programado una visita para:</p>
        <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <strong>${data.listingTitle}</strong>
          <p style="margin: 8px 0 0 0;">📅 ${data.date}</p>
          <p style="margin: 4px 0 0 0;">🕐 ${data.time}</p>
          <p style="margin: 4px 0 0 0;">📍 ${data.address}</p>
        </div>
        <a href="${data.actionUrl}" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
          Ver detalles
        </a>
      </div>
    `,
  }),
  
  review: (data) => ({
    subject: `Nueva reseña para ${data.listingTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a1a1a;">Has recibido una reseña</h2>
        <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <strong>${data.listingTitle}</strong>
          <p style="margin: 8px 0 0 0;">⭐ ${data.rating}/5</p>
          <p style="margin: 8px 0 0 0; color: #666;">"${data.comment}"</p>
        </div>
        <a href="${data.actionUrl}" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
          Responder
        </a>
      </div>
    `,
  }),
  
  custom: (data) => ({
    subject: data.subject as string,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a1a1a;">${data.title}</h2>
        <p>${data.message}</p>
        ${data.actionUrl ? `
          <a href="${data.actionUrl}" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">
            ${data.actionText || 'Ver más'}
          </a>
        ` : ''}
      </div>
    `,
  }),
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    
    // Create admin client for database operations
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // Verify authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("Missing Authorization header");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user: caller }, error: authError } = await supabaseAuth.auth.getUser(token);
    
    if (authError || !caller) {
      console.error("Invalid token:", authError?.message);
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { userId, type, data }: NotificationRequest = await req.json();

    if (!userId || !type) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Authorization check: users can only send notifications to themselves
    // OR landlords/admins can send notifications related to their listings/applications
    const isAuthorized = await checkNotificationAuthorization(supabaseAdmin, caller.id, userId, type, data);
    
    if (!isAuthorized) {
      console.error(`Unauthorized notification attempt: caller=${caller.id}, target=${userId}, type=${type}`);
      return new Response(JSON.stringify({ error: "Not authorized to send this notification" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("email, name")
      .eq("id", userId)
      .single();

    if (profileError || !profile?.email) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create in-app notification
    const notificationTitle = data.notificationTitle as string || "Nueva notificación";
    const notificationMessage = data.notificationMessage as string || data.message as string || "";
    
    await supabaseAdmin.rpc("create_system_notification", {
      p_user_id: userId,
      p_title: notificationTitle,
      p_message: notificationMessage,
      p_type: type,
      p_link: data.actionUrl as string || null,
      p_related_id: data.relatedId as string || null,
    });

    // Send email if API key is configured
    if (resendApiKey) {
      const template = emailTemplates[type];
      if (template) {
        const { subject, html } = template(data);
        
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "Livix <noreply@livix.app>",
            to: [profile.email],
            subject,
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="margin: 0; padding: 20px; background: #f9f9f9;">
                  ${html}
                  <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
                    <p>Este email fue enviado por Livix.</p>
                    <p>Si no deseas recibir estos emails, puedes configurar tus preferencias en tu perfil.</p>
                  </div>
                </body>
              </html>
            `,
          }),
        });

        if (!emailResponse.ok) {
          console.error("Email send failed:", await emailResponse.text());
        }
      }
    } else {
      console.log("RESEND_API_KEY not configured - skipping email");
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Notification error:", error);
    return new Response(JSON.stringify({ error: "Failed to send notification" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
