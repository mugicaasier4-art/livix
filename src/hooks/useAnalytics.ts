import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AnalyticsData {
  totalViews: number;
  totalApplications: number;
  approvedApplications: number;
  conversionRate: number;
  projectedRevenue: number;
  averagePrice: number;
  viewsByDay: Array<{ date: string; views: number }>;
  viewsByListing: Array<{ listingId: string; title: string; views: number; applications: number }>;
  applicationsByStatus: Array<{ status: string; count: number }>;
  recentViews: Array<{ listing_id: string; viewed_at: string; listing_title: string }>;
}

export const useAnalytics = (days: number = 30) => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = async () => {
    if (!user) return;

    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Fetch landlord's listings
      const { data: listings, error: listingsError } = await supabase
        .from('listings')
        .select('id, title, price')
        .eq('landlord_id', user.id);

      if (listingsError) throw listingsError;

      const listingIds = listings?.map(l => l.id) || [];

      // Fetch views for listings
      const { data: views, error: viewsError } = await supabase
        .from('listing_views')
        .select('*')
        .in('listing_id', listingIds)
        .gte('viewed_at', startDate.toISOString());

      if (viewsError) throw viewsError;

      // Fetch applications
      const { data: applications, error: appsError } = await supabase
        .from('applications')
        .select('*, listings!inner(title)')
        .eq('landlord_id', user.id)
        .gte('created_at', startDate.toISOString());

      if (appsError) throw appsError;

      // Calculate metrics
      const totalViews = views?.length || 0;
      const totalApplications = applications?.length || 0;
      const approvedApplications = applications?.filter(a => a.status === 'aprobada').length || 0;
      const conversionRate = totalViews > 0 ? (totalApplications / totalViews) * 100 : 0;

      // Calculate projected revenue (approved applications * average price)
      const averagePrice = listings?.reduce((sum, l) => sum + l.price, 0) / (listings?.length || 1);
      const projectedRevenue = approvedApplications * averagePrice;

      // Group views by day
      const viewsByDay = views?.reduce((acc: any, view) => {
        const date = new Date(view.viewed_at).toISOString().split('T')[0];
        const existing = acc.find((d: any) => d.date === date);
        if (existing) {
          existing.views++;
        } else {
          acc.push({ date, views: 1 });
        }
        return acc;
      }, []).sort((a: any, b: any) => a.date.localeCompare(b.date)) || [];

      // Group views by listing
      const viewsByListing = listings?.map(listing => {
        const listingViews = views?.filter(v => v.listing_id === listing.id).length || 0;
        const listingApps = applications?.filter(a => a.listing_id === listing.id).length || 0;
        return {
          listingId: listing.id,
          title: listing.title,
          views: listingViews,
          applications: listingApps,
        };
      }).sort((a, b) => b.views - a.views) || [];

      // Group applications by status
      const applicationsByStatus = applications?.reduce((acc: any, app) => {
        const existing = acc.find((s: any) => s.status === app.status);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ status: app.status, count: 1 });
        }
        return acc;
      }, []) || [];

      // Recent views (last 10)
      const recentViews = views
        ?.sort((a, b) => new Date(b.viewed_at).getTime() - new Date(a.viewed_at).getTime())
        .slice(0, 10)
        .map(v => {
          const listing = listings?.find(l => l.id === v.listing_id);
          return {
            listing_id: v.listing_id,
            viewed_at: v.viewed_at,
            listing_title: listing?.title || 'Desconocido',
          };
        }) || [];

      setAnalytics({
        totalViews,
        totalApplications,
        approvedApplications,
        conversionRate,
        projectedRevenue,
        averagePrice,
        viewsByDay,
        viewsByListing,
        applicationsByStatus,
        recentViews,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [user, days]);

  return { analytics, isLoading, refetch: fetchAnalytics };
};

// Track listing view
export const trackListingView = async (listingId: string, sessionId?: string) => {
  try {
    await supabase.from('listing_views').insert({
      listing_id: listingId,
      viewer_id: (await supabase.auth.getUser()).data.user?.id || null,
      session_id: sessionId || crypto.randomUUID(),
      referrer: document.referrer,
      user_agent: navigator.userAgent,
    });
  } catch (error) {
    console.error('Error tracking listing view:', error);
  }
};
