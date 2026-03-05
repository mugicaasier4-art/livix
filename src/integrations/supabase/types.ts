export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      application_analytics: {
        Row: {
          applicant_age: number | null
          applicant_faculty: string | null
          applicant_id: string | null
          applicant_is_erasmus: boolean | null
          applicant_previous_applications: number | null
          application_id: string | null
          applications_to_same_listing: number | null
          created_at: string | null
          days_since_listing_published: number | null
          id: string
          listing_id: string | null
          listing_owner_id: string | null
          listing_price: number | null
          listing_type: string | null
          message_length: number | null
          proposed_duration_months: number | null
          proposed_move_in_date: string | null
          response_time_hours: number | null
          status: string | null
        }
        Insert: {
          applicant_age?: number | null
          applicant_faculty?: string | null
          applicant_id?: string | null
          applicant_is_erasmus?: boolean | null
          applicant_previous_applications?: number | null
          application_id?: string | null
          applications_to_same_listing?: number | null
          created_at?: string | null
          days_since_listing_published?: number | null
          id?: string
          listing_id?: string | null
          listing_owner_id?: string | null
          listing_price?: number | null
          listing_type?: string | null
          message_length?: number | null
          proposed_duration_months?: number | null
          proposed_move_in_date?: string | null
          response_time_hours?: number | null
          status?: string | null
        }
        Update: {
          applicant_age?: number | null
          applicant_faculty?: string | null
          applicant_id?: string | null
          applicant_is_erasmus?: boolean | null
          applicant_previous_applications?: number | null
          application_id?: string | null
          applications_to_same_listing?: number | null
          created_at?: string | null
          days_since_listing_published?: number | null
          id?: string
          listing_id?: string | null
          listing_owner_id?: string | null
          listing_price?: number | null
          listing_type?: string | null
          message_length?: number | null
          proposed_duration_months?: number | null
          proposed_move_in_date?: string | null
          response_time_hours?: number | null
          status?: string | null
        }
        Relationships: []
      }
      application_documents: {
        Row: {
          application_id: string
          id: string
          name: string
          status: string
          type: string
          uploaded_at: string
          url: string
        }
        Insert: {
          application_id: string
          id?: string
          name: string
          status?: string
          type: string
          uploaded_at?: string
          url: string
        }
        Update: {
          application_id?: string
          id?: string
          name?: string
          status?: string
          type?: string
          uploaded_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "application_documents_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      application_messages: {
        Row: {
          application_id: string
          created_at: string
          from_role: string
          id: string
          sender_id: string
          text: string
        }
        Insert: {
          application_id: string
          created_at?: string
          from_role: string
          id?: string
          sender_id: string
          text: string
        }
        Update: {
          application_id?: string
          created_at?: string
          from_role?: string
          id?: string
          sender_id?: string
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "application_messages_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      application_timeline: {
        Row: {
          actor: string
          application_id: string
          created_at: string
          description: string
          event: string
          id: string
        }
        Insert: {
          actor: string
          application_id: string
          created_at?: string
          description: string
          event: string
          id?: string
        }
        Update: {
          actor?: string
          application_id?: string
          created_at?: string
          description?: string
          event?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "application_timeline_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      application_visits: {
        Row: {
          application_id: string
          created_at: string
          end_time: string
          id: string
          notes: string | null
          start_time: string
          status: string
        }
        Insert: {
          application_id: string
          created_at?: string
          end_time: string
          id?: string
          notes?: string | null
          start_time: string
          status?: string
        }
        Update: {
          application_id?: string
          created_at?: string
          end_time?: string
          id?: string
          notes?: string | null
          start_time?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "application_visits_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          budget_eur: number
          created_at: string
          id: string
          is_erasmus: boolean | null
          landlord_id: string
          listing_id: string
          message: string
          move_in_date: string
          move_out_date: string | null
          paid_reservation: boolean | null
          rejection_reason: string | null
          status: string
          student_email: string
          student_id: string
          student_name: string
          student_phone: string | null
          updated_at: string
        }
        Insert: {
          budget_eur: number
          created_at?: string
          id?: string
          is_erasmus?: boolean | null
          landlord_id: string
          listing_id: string
          message: string
          move_in_date: string
          move_out_date?: string | null
          paid_reservation?: boolean | null
          rejection_reason?: string | null
          status?: string
          student_email: string
          student_id: string
          student_name: string
          student_phone?: string | null
          updated_at?: string
        }
        Update: {
          budget_eur?: number
          created_at?: string
          id?: string
          is_erasmus?: boolean | null
          landlord_id?: string
          listing_id?: string
          message?: string
          move_in_date?: string
          move_out_date?: string | null
          paid_reservation?: boolean | null
          rejection_reason?: string | null
          status?: string
          student_email?: string
          student_id?: string
          student_name?: string
          student_phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      blocked_dates: {
        Row: {
          blocked_date: string
          created_at: string | null
          id: string
          landlord_id: string
          listing_id: string
          reason: string | null
        }
        Insert: {
          blocked_date: string
          created_at?: string | null
          id?: string
          landlord_id: string
          listing_id: string
          reason?: string | null
        }
        Update: {
          blocked_date?: string
          created_at?: string | null
          id?: string
          landlord_id?: string
          listing_id?: string
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blocked_dates_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      club_benefits: {
        Row: {
          address: string | null
          category: string
          created_at: string
          description: string
          discount_code: string | null
          discount_text: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          partner_name: string
          phone: string | null
          priority: number | null
          sector: string
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          category: string
          created_at?: string
          description: string
          discount_code?: string | null
          discount_text?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          partner_name: string
          phone?: string | null
          priority?: number | null
          sector?: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          category?: string
          created_at?: string
          description?: string
          discount_code?: string | null
          discount_text?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          partner_name?: string
          phone?: string | null
          priority?: number | null
          sector?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      comparison_analytics: {
        Row: {
          action_taken: string | null
          created_at: string | null
          id: string
          listing_ids: string[] | null
          listing_prices: number[] | null
          listing_types: string[] | null
          selected_listing_id: string | null
          session_id: string
          user_id: string | null
        }
        Insert: {
          action_taken?: string | null
          created_at?: string | null
          id?: string
          listing_ids?: string[] | null
          listing_prices?: number[] | null
          listing_types?: string[] | null
          selected_listing_id?: string | null
          session_id: string
          user_id?: string | null
        }
        Update: {
          action_taken?: string | null
          created_at?: string | null
          id?: string
          listing_ids?: string[] | null
          listing_prices?: number[] | null
          listing_types?: string[] | null
          selected_listing_id?: string | null
          session_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string | null
          id: string
          is_archived_by_1: boolean | null
          is_archived_by_2: boolean | null
          is_muted_by_1: boolean | null
          is_muted_by_2: boolean | null
          last_message_at: string | null
          listing_id: string | null
          participant_1_id: string
          participant_2_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_archived_by_1?: boolean | null
          is_archived_by_2?: boolean | null
          is_muted_by_1?: boolean | null
          is_muted_by_2?: boolean | null
          last_message_at?: string | null
          listing_id?: string | null
          participant_1_id: string
          participant_2_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_archived_by_1?: boolean | null
          is_archived_by_2?: boolean | null
          is_muted_by_1?: boolean | null
          is_muted_by_2?: boolean | null
          last_message_at?: string | null
          listing_id?: string | null
          participant_1_id?: string
          participant_2_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_participant_1_id_fkey"
            columns: ["participant_1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_participant_1_id_fkey"
            columns: ["participant_1_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_participant_2_id_fkey"
            columns: ["participant_2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_participant_2_id_fkey"
            columns: ["participant_2_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_views: {
        Row: {
          added_to_compare: boolean | null
          added_to_favorites: boolean | null
          clicked_apply: boolean | null
          clicked_contact: boolean | null
          clicked_gallery: boolean | null
          clicked_map: boolean | null
          created_at: string | null
          device_type: string | null
          from_search_query: string | null
          id: string
          listing_id: string | null
          listing_owner_id: string | null
          listing_price: number | null
          listing_type: string | null
          position_in_results: number | null
          scroll_depth_percent: number | null
          session_id: string
          shared_listing: boolean | null
          time_on_page_seconds: number | null
          user_id: string | null
          view_source: string | null
        }
        Insert: {
          added_to_compare?: boolean | null
          added_to_favorites?: boolean | null
          clicked_apply?: boolean | null
          clicked_contact?: boolean | null
          clicked_gallery?: boolean | null
          clicked_map?: boolean | null
          created_at?: string | null
          device_type?: string | null
          from_search_query?: string | null
          id?: string
          listing_id?: string | null
          listing_owner_id?: string | null
          listing_price?: number | null
          listing_type?: string | null
          position_in_results?: number | null
          scroll_depth_percent?: number | null
          session_id: string
          shared_listing?: boolean | null
          time_on_page_seconds?: number | null
          user_id?: string | null
          view_source?: string | null
        }
        Update: {
          added_to_compare?: boolean | null
          added_to_favorites?: boolean | null
          clicked_apply?: boolean | null
          clicked_contact?: boolean | null
          clicked_gallery?: boolean | null
          clicked_map?: boolean | null
          created_at?: string | null
          device_type?: string | null
          from_search_query?: string | null
          id?: string
          listing_id?: string | null
          listing_owner_id?: string | null
          listing_price?: number | null
          listing_type?: string | null
          position_in_results?: number | null
          scroll_depth_percent?: number | null
          session_id?: string
          shared_listing?: boolean | null
          time_on_page_seconds?: number | null
          user_id?: string | null
          view_source?: string | null
        }
        Relationships: []
      }
      listings: {
        Row: {
          address: string
          allows_pets: boolean | null
          area_sqm: number | null
          available_from: string
          available_to: string | null
          bathrooms: number
          bedrooms: number
          city: string
          created_at: string | null
          description: string
          floor: number | null
          gender_preference: string | null
          has_ac: boolean | null
          has_elevator: boolean | null
          has_heating: boolean | null
          has_parking: boolean | null
          has_washing_machine: boolean | null
          has_wifi: boolean | null
          id: string
          images: string[] | null
          is_active: boolean | null
          is_furnished: boolean | null
          landlord_id: string
          latitude: number | null
          longitude: number | null
          max_occupants: number | null
          min_stay_months: number | null
          price: number
          property_type: string
          room_area_sqm: number | null
          rooms_config: Json | null
          smoking_allowed: boolean | null
          title: string
          updated_at: string | null
          utilities_included: boolean | null
        }
        Insert: {
          address: string
          allows_pets?: boolean | null
          area_sqm?: number | null
          available_from: string
          available_to?: string | null
          bathrooms: number
          bedrooms: number
          city?: string
          created_at?: string | null
          description: string
          floor?: number | null
          gender_preference?: string | null
          has_ac?: boolean | null
          has_elevator?: boolean | null
          has_heating?: boolean | null
          has_parking?: boolean | null
          has_washing_machine?: boolean | null
          has_wifi?: boolean | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_furnished?: boolean | null
          landlord_id: string
          latitude?: number | null
          longitude?: number | null
          max_occupants?: number | null
          min_stay_months?: number | null
          price: number
          property_type: string
          room_area_sqm?: number | null
          rooms_config?: Json | null
          smoking_allowed?: boolean | null
          title: string
          updated_at?: string | null
          utilities_included?: boolean | null
        }
        Update: {
          address?: string
          allows_pets?: boolean | null
          area_sqm?: number | null
          available_from?: string
          available_to?: string | null
          bathrooms?: number
          bedrooms?: number
          city?: string
          created_at?: string | null
          description?: string
          floor?: number | null
          gender_preference?: string | null
          has_ac?: boolean | null
          has_elevator?: boolean | null
          has_heating?: boolean | null
          has_parking?: boolean | null
          has_washing_machine?: boolean | null
          has_wifi?: boolean | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_furnished?: boolean | null
          landlord_id?: string
          latitude?: number | null
          longitude?: number | null
          max_occupants?: number | null
          min_stay_months?: number | null
          price?: number
          property_type?: string
          room_area_sqm?: number | null
          rooms_config?: Json | null
          smoking_allowed?: boolean | null
          title?: string
          updated_at?: string | null
          utilities_included?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "listings_landlord_id_fkey"
            columns: ["landlord_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_landlord_id_fkey"
            columns: ["landlord_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      market_intel: {
        Row: {
          active_listings: number | null
          avg_price: number | null
          city: string | null
          conversion_rate: number | null
          date: string
          deactivated_listings: number | null
          id: string
          max_price: number | null
          median_price: number | null
          min_price: number | null
          neighborhood: string | null
          new_listings: number | null
          searches_with_results: number | null
          searches_without_results: number | null
          top_amenities_searched: Json | null
          top_budget_ranges: Json | null
          top_faculties_searching: Json | null
          total_applications: number | null
          total_searches: number | null
          total_views: number | null
          unique_searchers: number | null
        }
        Insert: {
          active_listings?: number | null
          avg_price?: number | null
          city?: string | null
          conversion_rate?: number | null
          date: string
          deactivated_listings?: number | null
          id?: string
          max_price?: number | null
          median_price?: number | null
          min_price?: number | null
          neighborhood?: string | null
          new_listings?: number | null
          searches_with_results?: number | null
          searches_without_results?: number | null
          top_amenities_searched?: Json | null
          top_budget_ranges?: Json | null
          top_faculties_searching?: Json | null
          total_applications?: number | null
          total_searches?: number | null
          total_views?: number | null
          unique_searchers?: number | null
        }
        Update: {
          active_listings?: number | null
          avg_price?: number | null
          city?: string | null
          conversion_rate?: number | null
          date?: string
          deactivated_listings?: number | null
          id?: string
          max_price?: number | null
          median_price?: number | null
          min_price?: number | null
          neighborhood?: string | null
          new_listings?: number | null
          searches_with_results?: number | null
          searches_without_results?: number | null
          top_amenities_searched?: Json | null
          top_budget_ranges?: Json | null
          top_faculties_searching?: Json | null
          total_applications?: number | null
          total_searches?: number | null
          total_views?: number | null
          unique_searchers?: number | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          is_read: boolean | null
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          message: string
          related_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message: string
          related_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message?: string
          related_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      price_tracking: {
        Row: {
          id: string
          listing_id: string | null
          listing_type: string | null
          market_avg_price: number | null
          market_median_price: number | null
          owner_id: string | null
          percentile_in_market: number | null
          previous_price: number | null
          price: number | null
          price_change_percent: number | null
          recorded_at: string | null
        }
        Insert: {
          id?: string
          listing_id?: string | null
          listing_type?: string | null
          market_avg_price?: number | null
          market_median_price?: number | null
          owner_id?: string | null
          percentile_in_market?: number | null
          previous_price?: number | null
          price?: number | null
          price_change_percent?: number | null
          recorded_at?: string | null
        }
        Update: {
          id?: string
          listing_id?: string | null
          listing_type?: string | null
          market_avg_price?: number | null
          market_median_price?: number | null
          owner_id?: string | null
          percentile_in_market?: number | null
          previous_price?: number | null
          price?: number | null
          price_change_percent?: number | null
          recorded_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string
          id: string
          is_verified: boolean | null
          name: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email: string
          id: string
          is_verified?: boolean | null
          name: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string
          id?: string
          is_verified?: boolean | null
          name?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reputation_badges: {
        Row: {
          badge_type: string
          earned_at: string
          expires_at: string | null
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          badge_type: string
          earned_at?: string
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          badge_type?: string
          earned_at?: string
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reputation_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reputation_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      residence_analytics: {
        Row: {
          application_rate_vs_market: number | null
          applications_by_faculty: Json | null
          applications_from_erasmus: number | null
          applications_received: number | null
          competitors_compared_with: Json | null
          contact_clicks: number | null
          ctr_vs_market: number | null
          date: string
          gallery_clicks: number | null
          id: string
          impressions: number | null
          map_clicks: number | null
          phone_reveals: number | null
          residence_id: string
          times_added_to_compare: number | null
          times_won_comparison: number | null
          unique_viewers: number | null
          viewer_avg_age: number | null
          viewer_budget_distribution: Json | null
          viewer_faculty_distribution: Json | null
          viewer_gender_distribution: Json | null
          viewer_nationality_distribution: Json | null
          views: number | null
          website_clicks: number | null
        }
        Insert: {
          application_rate_vs_market?: number | null
          applications_by_faculty?: Json | null
          applications_from_erasmus?: number | null
          applications_received?: number | null
          competitors_compared_with?: Json | null
          contact_clicks?: number | null
          ctr_vs_market?: number | null
          date: string
          gallery_clicks?: number | null
          id?: string
          impressions?: number | null
          map_clicks?: number | null
          phone_reveals?: number | null
          residence_id: string
          times_added_to_compare?: number | null
          times_won_comparison?: number | null
          unique_viewers?: number | null
          viewer_avg_age?: number | null
          viewer_budget_distribution?: Json | null
          viewer_faculty_distribution?: Json | null
          viewer_gender_distribution?: Json | null
          viewer_nationality_distribution?: Json | null
          views?: number | null
          website_clicks?: number | null
        }
        Update: {
          application_rate_vs_market?: number | null
          applications_by_faculty?: Json | null
          applications_from_erasmus?: number | null
          applications_received?: number | null
          competitors_compared_with?: Json | null
          contact_clicks?: number | null
          ctr_vs_market?: number | null
          date?: string
          gallery_clicks?: number | null
          id?: string
          impressions?: number | null
          map_clicks?: number | null
          phone_reveals?: number | null
          residence_id?: string
          times_added_to_compare?: number | null
          times_won_comparison?: number | null
          unique_viewers?: number | null
          viewer_avg_age?: number | null
          viewer_budget_distribution?: Json | null
          viewer_faculty_distribution?: Json | null
          viewer_gender_distribution?: Json | null
          viewer_nationality_distribution?: Json | null
          views?: number | null
          website_clicks?: number | null
        }
        Relationships: []
      }
      residences: {
        Row: {
          address: string
          capacity: number | null
          city: string
          coordinates: number[] | null
          created_at: string | null
          description: string | null
          email: string | null
          gender: string
          highlight: string | null
          id: string
          images: string[] | null
          is_premium: boolean | null
          name: string
          phone: string[] | null
          postal_code: string | null
          price_max: number | null
          price_min: number | null
          rating: number | null
          review_count: number | null
          services: string[] | null
          status: string | null
          type: string
          updated_at: string | null
          verified: boolean | null
          website: string | null
        }
        Insert: {
          address: string
          capacity?: number | null
          city?: string
          coordinates?: number[] | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          gender?: string
          highlight?: string | null
          id?: string
          images?: string[] | null
          is_premium?: boolean | null
          name: string
          phone?: string[] | null
          postal_code?: string | null
          price_max?: number | null
          price_min?: number | null
          rating?: number | null
          review_count?: number | null
          services?: string[] | null
          status?: string | null
          type: string
          updated_at?: string | null
          verified?: boolean | null
          website?: string | null
        }
        Update: {
          address?: string
          capacity?: number | null
          city?: string
          coordinates?: number[] | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          gender?: string
          highlight?: string | null
          id?: string
          images?: string[] | null
          is_premium?: boolean | null
          name?: string
          phone?: string[] | null
          postal_code?: string | null
          price_max?: number | null
          price_min?: number | null
          rating?: number | null
          review_count?: number | null
          services?: string[] | null
          status?: string | null
          type?: string
          updated_at?: string | null
          verified?: boolean | null
          website?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string
          created_at: string
          id: string
          landlord_id: string
          landlord_response: string | null
          landlord_response_at: string | null
          listing_id: string
          rating: number
          student_id: string
          updated_at: string
        }
        Insert: {
          comment: string
          created_at?: string
          id?: string
          landlord_id: string
          landlord_response?: string | null
          landlord_response_at?: string | null
          listing_id: string
          rating: number
          student_id: string
          updated_at?: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: string
          landlord_id?: string
          landlord_response?: string | null
          landlord_response_at?: string | null
          listing_id?: string
          rating?: number
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      room_listings: {
        Row: {
          address: string
          amenities: string[] | null
          available_from: string
          bathrooms: number
          couples_allowed: boolean | null
          created_at: string
          deposit: number
          description: string
          id: string
          images: string[] | null
          is_active: boolean | null
          looking_for_age_range: string | null
          looking_for_description: string
          looking_for_gender: string
          looking_for_preferences: string[] | null
          neighborhood: string
          other_rules: string[] | null
          pets_allowed: boolean | null
          price: number
          roommates_ages: string | null
          roommates_count: number
          roommates_description: string
          roommates_gender: string
          roommates_occupations: string[] | null
          size_sqm: number | null
          smoking_allowed: boolean | null
          title: string
          total_rooms: number
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          amenities?: string[] | null
          available_from: string
          bathrooms?: number
          couples_allowed?: boolean | null
          created_at?: string
          deposit?: number
          description: string
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          looking_for_age_range?: string | null
          looking_for_description: string
          looking_for_gender: string
          looking_for_preferences?: string[] | null
          neighborhood: string
          other_rules?: string[] | null
          pets_allowed?: boolean | null
          price: number
          roommates_ages?: string | null
          roommates_count?: number
          roommates_description: string
          roommates_gender: string
          roommates_occupations?: string[] | null
          size_sqm?: number | null
          smoking_allowed?: boolean | null
          title: string
          total_rooms?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          amenities?: string[] | null
          available_from?: string
          bathrooms?: number
          couples_allowed?: boolean | null
          created_at?: string
          deposit?: number
          description?: string
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          looking_for_age_range?: string | null
          looking_for_description?: string
          looking_for_gender?: string
          looking_for_preferences?: string[] | null
          neighborhood?: string
          other_rules?: string[] | null
          pets_allowed?: boolean | null
          price?: number
          roommates_ages?: string | null
          roommates_count?: number
          roommates_description?: string
          roommates_gender?: string
          roommates_occupations?: string[] | null
          size_sqm?: number | null
          smoking_allowed?: boolean | null
          title?: string
          total_rooms?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      roommate_likes: {
        Row: {
          created_at: string | null
          id: string
          liked_id: string
          liker_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          liked_id: string
          liker_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          liked_id?: string
          liker_id?: string
        }
        Relationships: []
      }
      roommate_profiles: {
        Row: {
          age: number | null
          bio: string
          budget_max: number
          budget_min: number
          created_at: string | null
          faculty: string
          gender_preference: string | null
          id: string
          interests: string[] | null
          is_active: boolean | null
          lifestyle_preferences: Json | null
          move_date: string
          pets_allowed: boolean | null
          preferred_location: string
          smoking_allowed: boolean | null
          updated_at: string | null
          user_id: string
          year: string
        }
        Insert: {
          age?: number | null
          bio: string
          budget_max: number
          budget_min: number
          created_at?: string | null
          faculty: string
          gender_preference?: string | null
          id?: string
          interests?: string[] | null
          is_active?: boolean | null
          lifestyle_preferences?: Json | null
          move_date: string
          pets_allowed?: boolean | null
          preferred_location: string
          smoking_allowed?: boolean | null
          updated_at?: string | null
          user_id: string
          year: string
        }
        Update: {
          age?: number | null
          bio?: string
          budget_max?: number
          budget_min?: number
          created_at?: string | null
          faculty?: string
          gender_preference?: string | null
          id?: string
          interests?: string[] | null
          is_active?: boolean | null
          lifestyle_preferences?: Json | null
          move_date?: string
          pets_allowed?: boolean | null
          preferred_location?: string
          smoking_allowed?: boolean | null
          updated_at?: string | null
          user_id?: string
          year?: string
        }
        Relationships: [
          {
            foreignKeyName: "roommate_profiles_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "roommate_profiles_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      search_analytics: {
        Row: {
          all_inclusive_preferred: boolean | null
          amenities_searched: string[] | null
          browser: string | null
          budget_max: number | null
          budget_min: number | null
          city: string | null
          coordinates: unknown
          created_at: string | null
          device_type: string | null
          filters_applied: Json | null
          gender_preference: string | null
          id: string
          is_anonymous: boolean | null
          max_distance_km: number | null
          near_faculty: string | null
          neighborhood: string | null
          property_type_searched: string | null
          referrer_source: string | null
          results_count: number | null
          results_shown: Json | null
          roommates_preference: number | null
          search_query: string | null
          session_id: string
          user_id: string | null
        }
        Insert: {
          all_inclusive_preferred?: boolean | null
          amenities_searched?: string[] | null
          browser?: string | null
          budget_max?: number | null
          budget_min?: number | null
          city?: string | null
          coordinates?: unknown
          created_at?: string | null
          device_type?: string | null
          filters_applied?: Json | null
          gender_preference?: string | null
          id?: string
          is_anonymous?: boolean | null
          max_distance_km?: number | null
          near_faculty?: string | null
          neighborhood?: string | null
          property_type_searched?: string | null
          referrer_source?: string | null
          results_count?: number | null
          results_shown?: Json | null
          roommates_preference?: number | null
          search_query?: string | null
          session_id: string
          user_id?: string | null
        }
        Update: {
          all_inclusive_preferred?: boolean | null
          amenities_searched?: string[] | null
          browser?: string | null
          budget_max?: number | null
          budget_min?: number | null
          city?: string | null
          coordinates?: unknown
          created_at?: string | null
          device_type?: string | null
          filters_applied?: Json | null
          gender_preference?: string | null
          id?: string
          is_anonymous?: boolean | null
          max_distance_km?: number | null
          near_faculty?: string | null
          neighborhood?: string | null
          property_type_searched?: string | null
          referrer_source?: string | null
          results_count?: number | null
          results_shown?: Json | null
          roommates_preference?: number | null
          search_query?: string | null
          session_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      squad_members: {
        Row: {
          id: string
          joined_at: string | null
          role: string
          squad_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string | null
          role: string
          squad_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string | null
          role?: string
          squad_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "squad_members_squad_id_fkey"
            columns: ["squad_id"]
            isOneToOne: false
            referencedRelation: "squads"
            referencedColumns: ["id"]
          },
        ]
      }
      squads: {
        Row: {
          created_at: string | null
          created_by: string
          id: string
          invite_code: string
          name: string
          target_location: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          id?: string
          invite_code: string
          name: string
          target_location?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          id?: string
          invite_code?: string
          name?: string
          target_location?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          plan_type: string
          started_at: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          plan_type: string
          started_at?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          plan_type?: string
          started_at?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      tenant_reviews: {
        Row: {
          application_id: string
          categories: Json | null
          comment: string
          created_at: string
          id: string
          landlord_id: string
          rating: number
          student_id: string
          updated_at: string
          would_rent_again: boolean | null
        }
        Insert: {
          application_id: string
          categories?: Json | null
          comment: string
          created_at?: string
          id?: string
          landlord_id: string
          rating: number
          student_id: string
          updated_at?: string
          would_rent_again?: boolean | null
        }
        Update: {
          application_id?: string
          categories?: Json | null
          comment?: string
          created_at?: string
          id?: string
          landlord_id?: string
          rating?: number
          student_id?: string
          updated_at?: string
          would_rent_again?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "tenant_reviews_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenant_reviews_landlord_id_fkey"
            columns: ["landlord_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenant_reviews_landlord_id_fkey"
            columns: ["landlord_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenant_reviews_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenant_reviews_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      typing_indicators: {
        Row: {
          conversation_id: string
          id: string
          is_typing: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          conversation_id: string
          id?: string
          is_typing?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          conversation_id?: string
          id?: string
          is_typing?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "typing_indicators_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "typing_indicators_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "typing_indicators_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_onboarding: {
        Row: {
          created_at: string | null
          has_completed_profile: boolean | null
          has_completed_tour: boolean | null
          has_created_first_listing: boolean | null
          has_made_first_application: boolean | null
          has_viewed_welcome: boolean | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          has_completed_profile?: boolean | null
          has_completed_tour?: boolean | null
          has_created_first_listing?: boolean | null
          has_made_first_application?: boolean | null
          has_viewed_welcome?: boolean | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          has_completed_profile?: boolean | null
          has_completed_tour?: boolean | null
          has_created_first_listing?: boolean | null
          has_made_first_application?: boolean | null
          has_viewed_welcome?: boolean | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_profiles_analytics: {
        Row: {
          age: number | null
          avg_session_duration_seconds: number | null
          budget_flexibility: string | null
          budget_max: number | null
          budget_min: number | null
          cleanliness_level: number | null
          created_at: string | null
          current_housing_status: string | null
          degree: string | null
          faculty: string | null
          gender: string | null
          guests_frequency: string | null
          has_applied: boolean | null
          has_booked: boolean | null
          is_erasmus: boolean | null
          language: string | null
          nationality: string | null
          noise_level: string | null
          pets_allowed: boolean | null
          preferred_amenities: string[] | null
          preferred_neighborhoods: string[] | null
          preferred_property_type: string | null
          sleep_schedule: string | null
          smoking_allowed: boolean | null
          social_level: string | null
          study_year: number | null
          total_applications: number | null
          total_listings_viewed: number | null
          total_searches: number | null
          university: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          age?: number | null
          avg_session_duration_seconds?: number | null
          budget_flexibility?: string | null
          budget_max?: number | null
          budget_min?: number | null
          cleanliness_level?: number | null
          created_at?: string | null
          current_housing_status?: string | null
          degree?: string | null
          faculty?: string | null
          gender?: string | null
          guests_frequency?: string | null
          has_applied?: boolean | null
          has_booked?: boolean | null
          is_erasmus?: boolean | null
          language?: string | null
          nationality?: string | null
          noise_level?: string | null
          pets_allowed?: boolean | null
          preferred_amenities?: string[] | null
          preferred_neighborhoods?: string[] | null
          preferred_property_type?: string | null
          sleep_schedule?: string | null
          smoking_allowed?: boolean | null
          social_level?: string | null
          study_year?: number | null
          total_applications?: number | null
          total_listings_viewed?: number | null
          total_searches?: number | null
          university?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          age?: number | null
          avg_session_duration_seconds?: number | null
          budget_flexibility?: string | null
          budget_max?: number | null
          budget_min?: number | null
          cleanliness_level?: number | null
          created_at?: string | null
          current_housing_status?: string | null
          degree?: string | null
          faculty?: string | null
          gender?: string | null
          guests_frequency?: string | null
          has_applied?: boolean | null
          has_booked?: boolean | null
          is_erasmus?: boolean | null
          language?: string | null
          nationality?: string | null
          noise_level?: string | null
          pets_allowed?: boolean | null
          preferred_amenities?: string[] | null
          preferred_neighborhoods?: string[] | null
          preferred_property_type?: string | null
          sleep_schedule?: string | null
          smoking_allowed?: boolean | null
          social_level?: string | null
          study_year?: number | null
          total_applications?: number | null
          total_listings_viewed?: number | null
          total_searches?: number | null
          university?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      public_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string | null
          is_verified: boolean | null
          name: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string | null
          is_verified?: boolean | null
          name?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string | null
          is_verified?: boolean | null
          name?: string | null
        }
        Relationships: []
      }
      roommate_matches: {
        Row: {
          matched_at: string | null
          user_1_id: string | null
          user_2_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      award_badge: {
        Args: {
          p_badge_type: string
          p_expires_at?: string
          p_metadata?: Json
          p_user_id: string
        }
        Returns: string
      }
      create_system_notification: {
        Args: {
          p_link?: string
          p_message: string
          p_related_id?: string
          p_title: string
          p_type: string
          p_user_id: string
        }
        Returns: string
      }
      create_timeline_event: {
        Args: {
          p_actor: string
          p_application_id: string
          p_description: string
          p_event: string
        }
        Returns: string
      }
      generate_invite_code: { Args: never; Returns: string }
      get_application_contact: {
        Args: { app_id: string }
        Returns: {
          email: string
          phone: string
        }[]
      }
      has_premium_access: { Args: { user_id_param: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      revoke_badge: {
        Args: { p_badge_type: string; p_user_id: string }
        Returns: boolean
      }
      update_subscription_status: {
        Args: { p_expires_at?: string; p_status: string; p_user_id: string }
        Returns: boolean
      }
      upsert_subscription: {
        Args: {
          p_expires_at?: string
          p_plan_type: string
          p_status: string
          p_stripe_customer_id?: string
          p_stripe_subscription_id?: string
          p_user_id: string
        }
        Returns: string
      }
    }
    Enums: {
      app_role: "student" | "landlord" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["student", "landlord", "admin"],
    },
  },
} as const
