// Analytics and telemetry utilities — GA4 integration

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

interface EventProperties {
  [key: string]: string | number | boolean | undefined;
}

interface AnalyticsEvent {
  name: string;
  properties?: EventProperties;
  timestamp: number;
}

const CONSENT_KEY = 'cr_consent';

class Analytics {
  private events: AnalyticsEvent[] = [];
  private isEnabled = true;
  private ga4Loaded = false;
  private ga4MeasurementId: string | null = null;

  /**
   * Initialize GA4 — loads gtag.js only if user has given analytics consent.
   * Call once at app startup (main.tsx).
   */
  initGA4() {
    this.ga4MeasurementId = import.meta.env.VITE_GA4_MEASUREMENT_ID || null;

    if (!this.ga4MeasurementId || this.ga4MeasurementId === 'G-XXXXXXXXXX') {
      if (import.meta.env.DEV) {
        console.log('📊 GA4: No measurement ID configured, skipping');
      }
      return;
    }

    if (this.hasAnalyticsConsent()) {
      this.loadGtagScript();
    }
  }

  /**
   * Update GA4 consent state. Call when user changes cookie preferences.
   */
  updateConsent(analyticsAllowed: boolean) {
    if (analyticsAllowed && !this.ga4Loaded) {
      this.loadGtagScript();
    } else if (!analyticsAllowed && this.ga4Loaded) {
      // GA4 consent mode: revoke consent without removing the script
      if (window.gtag) {
        window.gtag('consent', 'update', {
          analytics_storage: 'denied',
        });
      }
    }
  }

  private hasAnalyticsConsent(): boolean {
    try {
      const raw = localStorage.getItem(CONSENT_KEY);
      if (!raw) return false;
      const consent = JSON.parse(raw);
      return consent.analytics === true;
    } catch {
      return false;
    }
  }

  private loadGtagScript() {
    if (this.ga4Loaded || !this.ga4MeasurementId) return;

    // Load gtag.js dynamically
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.ga4MeasurementId}`;
    document.head.appendChild(script);

    // Initialize dataLayer and gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function (...args: unknown[]) {
      window.dataLayer.push(args);
    };
    window.gtag('js', new Date());
    window.gtag('consent', 'default', {
      analytics_storage: 'granted',
    });
    window.gtag('config', this.ga4MeasurementId, {
      send_page_view: false, // We send pageviews manually via trackPageView
    });

    this.ga4Loaded = true;

    if (import.meta.env.DEV) {
      console.log('📊 GA4: Loaded with ID', this.ga4MeasurementId);
    }
  }

  track(eventName: string, properties?: EventProperties) {
    if (!this.isEnabled) return;

    const event: AnalyticsEvent = {
      name: eventName,
      properties,
      timestamp: Date.now(),
    };

    this.events.push(event);

    // Log to console in development
    if (import.meta.env.DEV) {
      console.log('📊 Analytics Event:', event);
    }

    // Send to GA4
    this.sendToService(event);
  }

  private sendToService(event: AnalyticsEvent) {
    if (!this.ga4Loaded || !window.gtag) return;

    // Map page_view to GA4 format
    if (event.name === 'page_view') {
      window.gtag('event', 'page_view', {
        page_path: event.properties?.path,
        page_title: event.properties?.title,
      });
      return;
    }

    // Send all other events as custom GA4 events
    window.gtag('event', event.name, event.properties || {});
  }

  // Search and filtering events
  trackSearchFilterApplied(filterType: string, filterValue: string | number) {
    this.track('search_filter_applied', {
      filter_type: filterType,
      filter_value: filterValue.toString(),
    });
  }

  trackListingCardView(listingId: string, position: number) {
    this.track('listing_card_view', {
      listing_id: listingId,
      position,
    });
  }

  trackListingCardSaveToggled(listingId: string, saved: boolean) {
    this.track('listing_card_save_toggled', {
      listing_id: listingId,
      saved,
    });
  }

  trackViewModeChanged(viewMode: 'list' | 'map' | 'swipe', previousMode?: string) {
    this.track('view_mode_changed', {
      view_mode: viewMode,
      previous_mode: previousMode,
    });
  }

  trackMapBoundsChanged(bounds: { north: number; south: number; east: number; west: number }) {
    this.track('map_bounds_changed', bounds);
  }

  trackSwipeAction(listingId: string, action: 'like' | 'dislike') {
    this.track('swipe_action', {
      listing_id: listingId,
      action,
    });
  }

  // Listing detail events
  trackListingView(listingId: string, source?: string) {
    this.track('listing_view', {
      listing_id: listingId,
      source,
    });
  }

  trackCTAClicked(listingId: string, ctaType: 'save' | 'apply' | 'visit' | 'share') {
    this.track('cta_clicked', {
      listing_id: listingId,
      cta_type: ctaType,
    });
  }

  trackApplicationSubmitted(listingId: string, applicationMethod: string) {
    this.track('application_submitted', {
      listing_id: listingId,
      application_method: applicationMethod,
    });
  }

  trackVisitScheduled(listingId: string, visitDate: string) {
    this.track('visit_scheduled', {
      listing_id: listingId,
      visit_date: visitDate,
    });
  }

  // Premium and paywall events
  trackPaywallViewed(feature: string, context: string) {
    this.track('paywall_viewed', {
      feature,
      context,
    });
  }

  trackPaywallAccepted(feature: string) {
    this.track('paywall_accepted', {
      feature,
    });
  }

  trackReportOpened(listingId: string, reportType: string) {
    this.track('report_opened', {
      listing_id: listingId,
      report_type: reportType,
    });
  }

  // User journey events
  trackPageView(path: string, title?: string) {
    this.track('page_view', {
      path,
      title,
    });
  }

  // Performance events
  trackLoadTime(component: string, loadTimeMs: number) {
    this.track('load_time', {
      component,
      load_time_ms: loadTimeMs,
    });
  }

  // Get all events (for debugging)
  getEvents() {
    return this.events;
  }

  // Clear events
  clearEvents() {
    this.events = [];
  }
}

export const analytics = new Analytics();
