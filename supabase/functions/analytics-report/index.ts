import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AnalyticsReport {
  period: { start: string; end: string };
  listings: {
    total: number;
    active: number;
    newThisPeriod: number;
  };
  views: {
    total: number;
    uniqueViewers: number;
    avgPerListing: number;
  };
  applications: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    conversionRate: number;
  };
  topListings: Array<{
    id: string;
    title: string;
    views: number;
    applications: number;
  }>;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify user is a landlord
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);

    const isLandlord = roles?.some(r => r.role === "landlord" || r.role === "admin");
    if (!isLandlord) {
      return new Response(JSON.stringify({ error: "Forbidden - landlord access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse request body for date range
    const body = await req.json().catch(() => ({}));
    const now = new Date();
    const startDate = body.startDate || new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const endDate = body.endDate || now.toISOString();

    // Fetch landlord's listings
    const { data: listings } = await supabase
      .from("listings")
      .select("id, title, created_at, is_active")
      .eq("landlord_id", user.id);

    const listingIds = listings?.map(l => l.id) || [];

    // Fetch views for landlord's listings
    const { data: views } = await supabase
      .from("listing_views")
      .select("listing_id, viewer_id, viewed_at")
      .in("listing_id", listingIds)
      .gte("viewed_at", startDate)
      .lte("viewed_at", endDate);

    // Fetch applications for landlord's listings
    const { data: applications } = await supabase
      .from("applications")
      .select("id, listing_id, status, created_at")
      .eq("landlord_id", user.id)
      .gte("created_at", startDate)
      .lte("created_at", endDate);

    // Calculate metrics
    const totalListings = listings?.length || 0;
    const activeListings = listings?.filter(l => l.is_active)?.length || 0;
    const newListings = listings?.filter(l => 
      new Date(l.created_at) >= new Date(startDate)
    )?.length || 0;

    const totalViews = views?.length || 0;
    const uniqueViewers = new Set(views?.map(v => v.viewer_id).filter(Boolean)).size;
    const avgViewsPerListing = totalListings > 0 ? totalViews / totalListings : 0;

    const totalApps = applications?.length || 0;
    const pendingApps = applications?.filter(a => a.status === "pending")?.length || 0;
    const approvedApps = applications?.filter(a => a.status === "approved")?.length || 0;
    const rejectedApps = applications?.filter(a => a.status === "rejected")?.length || 0;
    const conversionRate = totalViews > 0 ? (totalApps / totalViews) * 100 : 0;

    // Calculate top listings by views
    const viewsByListing = new Map<string, number>();
    views?.forEach(v => {
      viewsByListing.set(v.listing_id, (viewsByListing.get(v.listing_id) || 0) + 1);
    });

    const appsByListing = new Map<string, number>();
    applications?.forEach(a => {
      appsByListing.set(a.listing_id, (appsByListing.get(a.listing_id) || 0) + 1);
    });

    const topListings = listings
      ?.map(l => ({
        id: l.id,
        title: l.title,
        views: viewsByListing.get(l.id) || 0,
        applications: appsByListing.get(l.id) || 0,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5) || [];

    const report: AnalyticsReport = {
      period: { start: startDate, end: endDate },
      listings: {
        total: totalListings,
        active: activeListings,
        newThisPeriod: newListings,
      },
      views: {
        total: totalViews,
        uniqueViewers,
        avgPerListing: Math.round(avgViewsPerListing * 10) / 10,
      },
      applications: {
        total: totalApps,
        pending: pendingApps,
        approved: approvedApps,
        rejected: rejectedApps,
        conversionRate: Math.round(conversionRate * 10) / 10,
      },
      topListings,
    };

    return new Response(JSON.stringify(report), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Analytics error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
