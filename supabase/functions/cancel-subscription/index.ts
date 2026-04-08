/**
 * cancel-subscription — Supabase Edge Function
 *
 * Cancels a Stripe subscription at period end, then updates the DB.
 * Ensures Stripe is always cancelled before marking DB as canceled
 * to prevent billing leaks.
 *
 * Required environment variables (set in Supabase Dashboard > Settings > Edge Functions):
 *   - STRIPE_SECRET_KEY         — Stripe secret key (sk_live_... or sk_test_...)
 *   - SUPABASE_URL              — Auto-injected by Supabase
 *   - SUPABASE_SERVICE_ROLE_KEY — Auto-injected by Supabase
 *   - SUPABASE_ANON_KEY         — Auto-injected by Supabase
 *
 * Called by: src/hooks/usePremium.ts → cancelSubscription()
 * On success: Stripe subscription set to cancel_at_period_end=true, DB status → "canceled"
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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Authenticate user
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

    // Get user's cancellable subscription (active, free, or trialing)
    const { data: subscription, error: subError } = await supabaseAdmin
      .from("subscriptions")
      .select("id, stripe_subscription_id, status")
      .eq("user_id", user.id)
      .in("status", ["active", "free", "trialing"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (subError || !subscription) {
      return new Response(JSON.stringify({ error: "No cancellable subscription found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Cancel in Stripe first (if there's a Stripe subscription ID)
    if (subscription.stripe_subscription_id && stripeSecretKey) {
      const stripeResponse = await fetch(
        `https://api.stripe.com/v1/subscriptions/${subscription.stripe_subscription_id}`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${stripeSecretKey}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            cancel_at_period_end: "true",
          }).toString(),
        }
      );

      if (!stripeResponse.ok) {
        const stripeError = await stripeResponse.json().catch(() => ({}));
        console.error("Stripe cancel failed:", stripeResponse.status, stripeError);
        return new Response(
          JSON.stringify({ error: "Failed to cancel Stripe subscription" }),
          {
            status: 502,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // Update DB: mark as canceled with 30-day access window
    const { data: updated, error: updateError } = await supabaseAdmin
      .from("subscriptions")
      .update({
        status: "canceled",
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .eq("id", subscription.id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    return new Response(JSON.stringify({ subscription: updated }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("cancel-subscription error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
