/**
 * create-checkout-session — Supabase Edge Function
 *
 * Creates a Stripe Checkout Session for Premium subscription upgrades.
 *
 * Required environment variables (set in Supabase Dashboard > Settings > Edge Functions):
 *   - STRIPE_SECRET_KEY      — Stripe secret key (sk_live_... or sk_test_...)
 *   - STRIPE_PRICE_ID        — Stripe Price ID for the Premium plan (price_XXXX)
 *   - SUPABASE_URL           — Auto-injected by Supabase
 *   - SUPABASE_SERVICE_ROLE_KEY — Auto-injected by Supabase
 *
 * Called by: src/hooks/usePremium.ts → upgradeToPremium()
 * On success: Stripe redirects to success_url, then stripe-webhook updates subscriptions table.
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("ALLOWED_ORIGIN") || "https://livix.es",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    const stripePriceId = Deno.env.get("STRIPE_PRICE_ID");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // TODO: Remove this guard once Stripe keys are configured in Supabase Dashboard
    if (!stripeSecretKey || !stripePriceId) {
      console.error("Stripe env vars not configured: STRIPE_SECRET_KEY and STRIPE_PRICE_ID required");
      return new Response(
        JSON.stringify({
          error: "Stripe not configured",
          hint: "Set STRIPE_SECRET_KEY and STRIPE_PRICE_ID in Supabase Edge Function environment variables",
        }),
        {
          status: 503,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Verify the caller is authenticated
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    const { user_id, plan_type, success_url, cancel_url } = body;

    // Input validation
    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!user_id || typeof user_id !== "string" || !UUID_REGEX.test(user_id)) {
      return new Response(JSON.stringify({ error: "Invalid user_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (plan_type && !["premium", "basic"].includes(plan_type)) {
      return new Response(JSON.stringify({ error: "Invalid plan_type" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const ALLOWED_REDIRECT_DOMAINS = new Set(["livix.es", "www.livix.es", "checkout.stripe.com"]);
    if (success_url && typeof success_url === "string") {
      try {
        const hostname = new URL(success_url).hostname;
        if (!ALLOWED_REDIRECT_DOMAINS.has(hostname)) {
          return new Response(JSON.stringify({ error: "success_url domain not allowed" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      } catch {
        return new Response(JSON.stringify({ error: "success_url is not a valid URL" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }
    if (cancel_url && typeof cancel_url === "string") {
      try {
        const hostname = new URL(cancel_url).hostname;
        if (!ALLOWED_REDIRECT_DOMAINS.has(hostname)) {
          return new Response(JSON.stringify({ error: "cancel_url domain not allowed" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      } catch {
        return new Response(JSON.stringify({ error: "cancel_url is not a valid URL" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Verify the caller is creating a session for themselves
    if (user_id !== user.id) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch user email for Stripe
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("email, name")
      .eq("id", user_id)
      .single();

    const userEmail = profile?.email ?? user.email;

    // Check if user already has a Stripe customer ID
    const { data: subscription } = await supabaseAdmin
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user_id)
      .maybeSingle();

    let customerId: string | undefined = subscription?.stripe_customer_id ?? undefined;

    // If no existing customer, we'll let Stripe create one via the checkout session
    const sessionParams: Record<string, unknown> = {
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      success_url: success_url ?? `${supabaseUrl}/settings?upgrade=success`,
      cancel_url: cancel_url ?? `${supabaseUrl}/settings?upgrade=cancelled`,
      metadata: {
        user_id,
        plan_type: plan_type ?? "premium",
      },
      // Pre-fill email if we have it
      ...(userEmail ? { customer_email: userEmail } : {}),
      // Reuse existing customer if available
      ...(customerId ? { customer: customerId } : {}),
    };

    // Create Stripe Checkout Session
    const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(
        // Stripe API expects form-encoded nested params
        flattenStripeParams(sessionParams)
      ).toString(),
    });

    if (!stripeResponse.ok) {
      console.error("Stripe checkout session creation failed, status:", stripeResponse.status);
      return new Response(
        JSON.stringify({ error: "Failed to create Stripe session" }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const session = await stripeResponse.json();

    return new Response(
      JSON.stringify({ url: session.url, session_id: session.id }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("create-checkout-session error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

/**
 * Converts a nested JS object to Stripe's form-encoded flat param format.
 * e.g. { line_items: [{ price: 'price_X', quantity: 1 }] }
 *   -> { 'line_items[0][price]': 'price_X', 'line_items[0][quantity]': '1' }
 */
function flattenStripeParams(
  obj: Record<string, unknown>,
  prefix = ""
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}[${key}]` : key;
    if (value === null || value === undefined) continue;
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === "object" && item !== null) {
          Object.assign(
            result,
            flattenStripeParams(item as Record<string, unknown>, `${fullKey}[${index}]`)
          );
        } else {
          result[`${fullKey}[${index}]`] = String(item);
        }
      });
    } else if (typeof value === "object") {
      Object.assign(
        result,
        flattenStripeParams(value as Record<string, unknown>, fullKey)
      );
    } else {
      result[fullKey] = String(value);
    }
  }
  return result;
}
