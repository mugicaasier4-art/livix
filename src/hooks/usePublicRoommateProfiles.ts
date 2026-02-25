import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface PublicRoommateProfile {
    id: string;
    user_id: string;
    faculty: string;
    year: string;
    bio: string;
    interests: string[] | null;
    budget_min: number;
    budget_max: number;
    move_date: string;
    preferred_location: string;
    is_active: boolean | null;
    age: number | null;
    gender_preference: string | null;
    smoking_allowed: boolean | null;
    pets_allowed: boolean | null;
    lifestyle_preferences: Record<string, unknown> | null;
    created_at: string | null;
    name: string;
    avatar_url: string | null;
    is_verified: boolean;
}

/**
 * Hook to fetch active roommate profiles from Supabase.
 * Works for both logged-in and anonymous users.
 * If the user is logged in, their own profile is excluded.
 */
export const usePublicRoommateProfiles = () => {
    const [profiles, setProfiles] = useState<PublicRoommateProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();

    const fetchProfiles = async () => {
        setIsLoading(true);
        try {
            let query = supabase
                .from('roommate_profiles')
                .select(`
          *,
          profiles!roommate_profiles_user_id_profiles_fkey(name, avatar_url, is_verified)
        `)
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            // Exclude current user's profile if logged in
            if (user) {
                query = query.neq('user_id', user.id);
            }

            const { data, error } = await query;

            if (error) throw error;

            const transformed: PublicRoommateProfile[] = (data || []).map(profile => {
                const userProfile = Array.isArray(profile.profiles)
                    ? profile.profiles[0]
                    : profile.profiles;
                return {
                    id: profile.id,
                    user_id: profile.user_id,
                    faculty: profile.faculty,
                    year: profile.year,
                    bio: profile.bio,
                    interests: profile.interests,
                    budget_min: profile.budget_min,
                    budget_max: profile.budget_max,
                    move_date: profile.move_date,
                    preferred_location: profile.preferred_location,
                    is_active: profile.is_active,
                    age: profile.age,
                    gender_preference: profile.gender_preference,
                    smoking_allowed: profile.smoking_allowed,
                    pets_allowed: profile.pets_allowed,
                    lifestyle_preferences: profile.lifestyle_preferences as Record<string, unknown> | null,
                    created_at: profile.created_at,
                    name: userProfile?.name || 'Estudiante',
                    avatar_url: userProfile?.avatar_url || null,
                    is_verified: userProfile?.is_verified || false,
                };
            });

            setProfiles(transformed);
        } catch (error) {
            console.error('Error fetching public roommate profiles:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfiles();
    }, [user]);

    return { profiles, isLoading, refetch: fetchProfiles };
};
