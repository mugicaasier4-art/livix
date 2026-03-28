import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface RoommateProfile {
  id: string;
  user_id: string;
  faculty: string;
  year: string;
  bio: string;
  interests: string[];
  budget_min: number;
  budget_max: number;
  move_date: string;
  preferred_location: string;
  is_active: boolean;
  age: number | null;
  gender_preference: string;
  smoking_allowed: boolean;
  pets_allowed: boolean;
  created_at: string;
  // New fields from v2 migration
  city: string | null;
  university: string | null;
  campus: string | null;
  languages: string[] | null;
  sleep_time: number | null;
  cleanliness: number | null;
  noise_tolerance: number | null;
  guest_frequency: number | null;
  intro_extro: number | null;
  study_place: string | null;
  cooking: number | null;
  expense_sharing: string | null;
  party_frequency: number | null;
  hobbies: string[] | null;
  move_out_date: string | null;
  is_verified_student: boolean;
  personality_type: string | null;
  profile_completeness: number;
  lifestyle_preferences?: Record<string, unknown> | null;
  user?: {
    name: string;
    avatar_url: string | null;
    is_verified: boolean;
  };
}

export type RoommateProfileInput = Omit<
  RoommateProfile,
  'id' | 'user_id' | 'created_at' | 'user' | 'is_verified_student' | 'personality_type' | 'move_out_date'
> & {
  lifestyle_preferences?: Record<string, unknown>;
};

export const useRoommateProfiles = () => {
  const [profiles, setProfiles] = useState<RoommateProfile[]>([]);
  const [myProfile, setMyProfile] = useState<RoommateProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Fetch all active profiles (excluding current user and already liked)
  const fetchProfiles = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // First, get IDs of users we've already liked
      const { data: likedData, error: likedError } = await supabase
        .from('roommate_likes')
        .select('liked_id')
        .eq('liker_id', user.id);

      if (likedError) throw likedError;

      const likedIds = likedData?.map((like) => like.liked_id) || [];

      // Fetch active profiles excluding current user
      const { data, error } = await supabase
        .from('roommate_profiles')
        .select(
          `
          *,
          profiles!roommate_profiles_user_id_profiles_fkey(name, avatar_url, is_verified)
        `
        )
        .eq('is_active', true)
        .neq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data and filter out liked profiles in client
      const transformedProfiles = (data || [])
        .map((profile) => ({
          ...profile,
          user: Array.isArray(profile.profiles)
            ? profile.profiles[0]
            : profile.profiles,
        }))
        .filter((profile) => !likedIds.includes(profile.user_id));

      setProfiles(transformedProfiles as any);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast.error('Error al cargar perfiles');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user's own profile
  const fetchMyProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('roommate_profiles')
        .select(
          `
          *,
          profiles!roommate_profiles_user_id_profiles_fkey(name, avatar_url, is_verified)
        `
        )
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        const transformedProfile = {
          ...data,
          user: Array.isArray(data.profiles)
            ? data.profiles[0]
            : data.profiles,
        };
        setMyProfile(transformedProfile as any);
      } else {
        setMyProfile(null);
      }
    } catch (error) {
      console.error('Error fetching my profile:', error);
    }
  };

  // Create profile
  const createProfile = async (profileData: RoommateProfileInput) => {
    if (!user) throw new Error('No autenticado');

    try {
      const { data, error } = await supabase
        .from('roommate_profiles')
        .insert([
          {
            user_id: user.id,
            faculty: profileData.faculty,
            year: profileData.year,
            bio: profileData.bio,
            interests: profileData.interests,
            budget_min: profileData.budget_min,
            budget_max: profileData.budget_max,
            move_date: profileData.move_date,
            preferred_location: profileData.preferred_location,
            is_active: profileData.is_active ?? true,
            age: profileData.age,
            gender_preference: profileData.gender_preference,
            smoking_allowed: profileData.smoking_allowed,
            pets_allowed: profileData.pets_allowed,
            // New v2 fields
            city: profileData.city,
            university: profileData.university,
            campus: profileData.campus,
            languages: profileData.languages,
            sleep_time: profileData.sleep_time,
            cleanliness: profileData.cleanliness,
            noise_tolerance: profileData.noise_tolerance,
            guest_frequency: profileData.guest_frequency,
            intro_extro: profileData.intro_extro,
            study_place: profileData.study_place,
            cooking: profileData.cooking,
            expense_sharing: profileData.expense_sharing,
            party_frequency: profileData.party_frequency,
            hobbies: profileData.hobbies,
            profile_completeness: profileData.profile_completeness ?? 0,
            lifestyle_preferences: JSON.parse(
              JSON.stringify(profileData.lifestyle_preferences || {})
            ),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast.success('Perfil creado', {
        description: 'Tu perfil esta ahora visible para otros estudiantes!',
      });

      setMyProfile(data);
      return data;
    } catch (error) {
      console.error('Error creating profile:', error);
      toast.error('Error al crear perfil');
      throw error;
    }
  };

  // Update profile
  const updateProfile = async (updates: Partial<RoommateProfile>) => {
    if (!user || !myProfile) throw new Error('No profile to update');

    try {
      // Strip non-DB fields
      const { user: _user, ...dbUpdates } = updates as any;

      const { data, error } = await supabase
        .from('roommate_profiles')
        .update(dbUpdates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      toast.success('Perfil actualizado');
      setMyProfile(data);
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error al actualizar perfil');
      throw error;
    }
  };

  // Delete profile
  const deleteProfile = async () => {
    if (!user) throw new Error('No autenticado');

    try {
      const { error } = await supabase
        .from('roommate_profiles')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Perfil eliminado');
      setMyProfile(null);
    } catch (error) {
      console.error('Error deleting profile:', error);
      toast.error('Error al eliminar perfil');
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfiles();
      fetchMyProfile();
    }
  }, [user]);

  return {
    profiles,
    myProfile,
    isLoading,
    createProfile,
    updateProfile,
    deleteProfile,
    refetch: fetchProfiles,
    refetchMyProfile: fetchMyProfile,
  };
};
