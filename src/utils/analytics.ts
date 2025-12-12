// Analytics and telemetry utilities
interface EventProperties {
  [key: string]: string | number | boolean | undefined;
}

interface AnalyticsEvent {
  name: string;
  properties?: EventProperties;
  timestamp: number;
}

class Analytics {
  private events: AnalyticsEvent[] = [];
  private isEnabled = true;

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

    // In production, send to analytics service
    this.sendToService(event);
  }

  private sendToService(event: AnalyticsEvent) {
    // Stub for real analytics service integration
    // This would normally send to services like Mixpanel, Amplitude, etc.
  }

  // Search and filtering events
  trackSearchFilterApplied(filterType: string, filterValue: string | number) {
    this.track('search_filter_applied', {
      filter_type: filterType,
      filter_value: filterValue.toString(),
    });
  }

  trackListingCardView(listingId: number, position: number) {
    this.track('listing_card_view', {
      listing_id: listingId,
      position,
    });
  }

  trackListingCardSaveToggled(listingId: number, saved: boolean) {
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

  trackSwipeAction(listingId: number, action: 'like' | 'dislike') {
    this.track('swipe_action', {
      listing_id: listingId,
      action,
    });
  }

  // Listing detail events
  trackListingView(listingId: number, source?: string) {
    this.track('listing_view', {
      listing_id: listingId,
      source,
    });
  }

  trackCTAClicked(listingId: number, ctaType: 'save' | 'apply' | 'visit' | 'share') {
    this.track('cta_clicked', {
      listing_id: listingId,
      cta_type: ctaType,
    });
  }

  trackApplicationSubmitted(listingId: number, applicationMethod: string) {
    this.track('application_submitted', {
      listing_id: listingId,
      application_method: applicationMethod,
    });
  }

  trackVisitScheduled(listingId: number, visitDate: string) {
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

  trackReportOpened(listingId: number, reportType: string) {
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