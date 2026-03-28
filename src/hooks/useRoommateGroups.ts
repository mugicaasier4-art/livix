import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// ---------------------------------------------------------------------------
// Local row interfaces for Supabase tables not yet in generated types.
// The `as any` on `.from()` is kept only because these tables are missing
// from the generated Database type — every other `as any` has been removed.
// ---------------------------------------------------------------------------

/** Row shape returned by `roommate_groups` table */
interface GroupRow {
  id: string;
  name: string;
  created_by: string;
  city: string;
  university: string | null;
  budget_min: number | null;
  budget_max: number | null;
  preferred_zones: string[] | null;
  max_members: number;
  looking_for_count: number;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

/** Row shape returned by `roommate_group_members` table */
interface MemberRow {
  id: string;
  group_id: string;
  user_id: string;
  role: string;
  joined_at: string;
}

/** Row shape returned by `roommate_group_applications` table */
interface ApplicationRow {
  id: string;
  group_id: string;
  applicant_id: string;
  message: string | null;
  status: string;
  created_at: string;
}

/** Row shape returned by `roommate_group_votes` table */
interface VoteRow {
  id: string;
  application_id: string;
  voter_id: string;
  vote: string;
}

/** Row shape returned by `profiles` select used in this hook */
interface ProfileRow {
  id: string;
  name: string;
  avatar_url: string | null;
  is_verified: boolean;
}

// ---------------------------------------------------------------------------
// Public exported interfaces (unchanged API surface)
// ---------------------------------------------------------------------------

export interface RoommateGroup {
  id: string;
  name: string;
  created_by: string;
  city: string;
  university: string | null;
  budget_min: number | null;
  budget_max: number | null;
  preferred_zones: string[] | null;
  max_members: number;
  looking_for_count: number;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  members?: GroupMember[];
}

export interface GroupMember {
  id: string;
  user_id: string;
  role: 'admin' | 'member';
  joined_at: string;
  profile?: {
    name: string;
    avatar_url: string | null;
    is_verified: boolean;
  };
}

export interface GroupApplication {
  id: string;
  group_id: string;
  applicant_id: string;
  message: string | null;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  applicant_profile?: {
    name: string;
    avatar_url: string | null;
  };
  votes?: { voter_id: string; vote: 'yes' | 'no' }[];
}

export interface CreateGroupData {
  name: string;
  city: string;
  university?: string;
  budget_min?: number;
  budget_max?: number;
  preferred_zones?: string[];
  max_members: number;
  looking_for_count: number;
  description?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function fetchProfilesForUserIds(
  userIds: string[]
): Promise<Record<string, { name: string; avatar_url: string | null; is_verified: boolean }>> {
  if (userIds.length === 0) return {};
  const { data } = await supabase
    .from('profiles')
    .select('id, name, avatar_url, is_verified')
    .in('id', userIds);
  const map: Record<string, { name: string; avatar_url: string | null; is_verified: boolean }> = {};
  (data as ProfileRow[] | null)?.forEach((p) => {
    map[p.id] = { name: p.name, avatar_url: p.avatar_url, is_verified: p.is_verified };
  });
  return map;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export const useRoommateGroups = () => {
  const [myGroups, setMyGroups] = useState<RoommateGroup[]>([]);
  const [publicGroups, setPublicGroups] = useState<RoommateGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Fetch groups where the current user is a member
  const fetchMyGroups = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      // Get group IDs where user is member
      const { data: memberRows, error: memberError } = await supabase
        .from('roommate_group_members' as any)
        .select('group_id')
        .eq('user_id', user.id);

      if (memberError) throw memberError;
      if (!memberRows || memberRows.length === 0) {
        setMyGroups([]);
        return;
      }

      const groupIds = (memberRows as unknown as MemberRow[]).map((r) => r.group_id);

      const { data: groups, error: groupError } = await supabase
        .from('roommate_groups' as any)
        .select('*')
        .in('id', groupIds)
        .order('created_at', { ascending: false });

      if (groupError) throw groupError;

      // For each group, fetch members with profiles
      const groupsWithMembers = await Promise.all(
        ((groups as unknown as GroupRow[]) || []).map(async (group) => {
          const members = await fetchGroupMembers(group.id);
          return { ...group, members } as RoommateGroup;
        })
      );

      setMyGroups(groupsWithMembers);
    } catch (error) {
      console.error('Error fetching my groups:', error);
      toast.error('Error al cargar tus grupos');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Fetch active public groups looking for members
  const fetchPublicGroups = useCallback(async (city?: string) => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('roommate_groups' as any)
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (city) {
        query = query.eq('city', city);
      }

      const { data: groups, error } = await query;
      if (error) throw error;

      // Fetch members for each group
      const groupsWithMembers = await Promise.all(
        ((groups as unknown as GroupRow[]) || []).map(async (group) => {
          const members = await fetchGroupMembers(group.id);
          return { ...group, members } as RoommateGroup;
        })
      );

      // Filter to only groups that still need members
      const filtered = groupsWithMembers.filter(
        (g) => (g.members?.length || 0) < g.max_members
      );

      setPublicGroups(filtered);
    } catch (error) {
      console.error('Error fetching public groups:', error);
      toast.error('Error al cargar grupos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch members of a specific group
  const fetchGroupMembers = async (groupId: string): Promise<GroupMember[]> => {
    const { data: membersData, error } = await supabase
      .from('roommate_group_members' as any)
      .select('*')
      .eq('group_id', groupId);

    if (error) throw error;
    if (!membersData || membersData.length === 0) return [];

    const rows = membersData as unknown as MemberRow[];
    const userIds = rows.map((m) => m.user_id);
    const profiles = await fetchProfilesForUserIds(userIds);

    return rows.map((m) => ({
      id: m.id,
      user_id: m.user_id,
      role: m.role as 'admin' | 'member',
      joined_at: m.joined_at,
      profile: profiles[m.user_id] || { name: 'Usuario', avatar_url: null, is_verified: false },
    }));
  };

  // Get a single group with its members
  const getGroupWithMembers = async (groupId: string): Promise<RoommateGroup> => {
    const { data, error } = await supabase
      .from('roommate_groups' as any)
      .select('*')
      .eq('id', groupId)
      .single();

    if (error) throw error;

    const group = data as unknown as GroupRow;
    const members = await fetchGroupMembers(groupId);
    return { ...group, members } as RoommateGroup;
  };

  // Create a new group
  const createGroup = async (groupData: CreateGroupData): Promise<RoommateGroup> => {
    if (!user) throw new Error('No autenticado');

    try {
      const { data, error } = await supabase
        .from('roommate_groups' as any)
        .insert({
          name: groupData.name,
          created_by: user.id,
          city: groupData.city,
          university: groupData.university || null,
          budget_min: groupData.budget_min || null,
          budget_max: groupData.budget_max || null,
          preferred_zones: groupData.preferred_zones || null,
          max_members: groupData.max_members,
          looking_for_count: groupData.looking_for_count,
          description: groupData.description || null,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;

      const createdGroup = data as unknown as GroupRow;

      // Add creator as admin
      const { error: memberError } = await supabase
        .from('roommate_group_members' as any)
        .insert({
          group_id: createdGroup.id,
          user_id: user.id,
          role: 'admin',
        });

      if (memberError) throw memberError;

      toast.success('Grupo creado correctamente');
      await fetchMyGroups();
      return createdGroup as RoommateGroup;
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error('Error al crear el grupo');
      throw error;
    }
  };

  // Update group
  const updateGroup = async (groupId: string, updates: Partial<Omit<RoommateGroup, 'members'>>) => {
    if (!user) throw new Error('No autenticado');

    try {
      const { error } = await supabase
        .from('roommate_groups' as any)
        .update(updates as Record<string, unknown>)
        .eq('id', groupId);

      if (error) throw error;
      toast.success('Grupo actualizado');
      await fetchMyGroups();
    } catch (error) {
      console.error('Error updating group:', error);
      toast.error('Error al actualizar el grupo');
      throw error;
    }
  };

  // Delete group (admin only)
  const deleteGroup = async (groupId: string) => {
    if (!user) throw new Error('No autenticado');

    try {
      // Delete members first
      await supabase
        .from('roommate_group_members' as any)
        .delete()
        .eq('group_id', groupId);

      // Delete applications and votes
      const { data: apps } = await supabase
        .from('roommate_group_applications' as any)
        .select('id')
        .eq('group_id', groupId);

      const appRows = (apps as unknown as ApplicationRow[] | null) || [];
      if (appRows.length > 0) {
        const appIds = appRows.map((a) => a.id);
        await supabase
          .from('roommate_group_votes' as any)
          .delete()
          .in('application_id', appIds);
      }

      await supabase
        .from('roommate_group_applications' as any)
        .delete()
        .eq('group_id', groupId);

      // Delete group
      const { error } = await supabase
        .from('roommate_groups' as any)
        .delete()
        .eq('id', groupId);

      if (error) throw error;

      toast.success('Grupo eliminado');
      await fetchMyGroups();
    } catch (error) {
      console.error('Error deleting group:', error);
      toast.error('Error al eliminar el grupo');
      throw error;
    }
  };

  // Generate invite link
  const generateInviteLink = (groupId: string): string => {
    const base = typeof window !== 'undefined' ? window.location.origin : '';
    return `${base}/roommates/join/${groupId}`;
  };

  // Join group via invite link (direct join, no application)
  const joinGroup = async (groupId: string) => {
    if (!user) throw new Error('No autenticado');

    try {
      // Check if already a member
      const { data: existing } = await supabase
        .from('roommate_group_members' as any)
        .select('id')
        .eq('group_id', groupId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        toast.error('Ya eres miembro de este grupo');
        return;
      }

      // Check if group is full
      const group = await getGroupWithMembers(groupId);
      if ((group.members?.length || 0) >= group.max_members) {
        toast.error('Este grupo ya esta completo');
        return;
      }

      const { error } = await supabase
        .from('roommate_group_members' as any)
        .insert({
          group_id: groupId,
          user_id: user.id,
          role: 'member',
        });

      if (error) throw error;

      toast.success('Te has unido al grupo');
      await fetchMyGroups();
    } catch (error) {
      console.error('Error joining group:', error);
      toast.error('Error al unirse al grupo');
      throw error;
    }
  };

  // Leave group
  const leaveGroup = async (groupId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('roommate_group_members' as any)
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Has salido del grupo');
      await fetchMyGroups();
    } catch (error) {
      console.error('Error leaving group:', error);
      toast.error('Error al salir del grupo');
      throw error;
    }
  };

  // Remove member (admin only)
  const removeMember = async (groupId: string, userId: string) => {
    if (!user) throw new Error('No autenticado');

    try {
      const { error } = await supabase
        .from('roommate_group_members' as any)
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', userId);

      if (error) throw error;

      toast.success('Miembro eliminado del grupo');
    } catch (error) {
      console.error('Error removing member:', error);
      toast.error('Error al eliminar miembro');
      throw error;
    }
  };

  // Apply to join a group (public application)
  const applyToGroup = async (groupId: string, message: string) => {
    if (!user) throw new Error('No autenticado');

    try {
      // Check for existing pending application
      const { data: existing } = await supabase
        .from('roommate_group_applications' as any)
        .select('id')
        .eq('group_id', groupId)
        .eq('applicant_id', user.id)
        .eq('status', 'pending')
        .maybeSingle();

      if (existing) {
        toast.error('Ya tienes una solicitud pendiente para este grupo');
        return;
      }

      const { error } = await supabase
        .from('roommate_group_applications' as any)
        .insert({
          group_id: groupId,
          applicant_id: user.id,
          message: message || null,
          status: 'pending',
        });

      if (error) throw error;

      toast.success('Solicitud enviada. El grupo revisara tu perfil.');
    } catch (error) {
      console.error('Error applying to group:', error);
      toast.error('Error al enviar solicitud');
      throw error;
    }
  };

  // Get applications for a group
  const getGroupApplications = async (groupId: string): Promise<GroupApplication[]> => {
    try {
      const { data: apps, error } = await supabase
        .from('roommate_group_applications' as any)
        .select('*')
        .eq('group_id', groupId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const appRows = (apps as unknown as ApplicationRow[] | null) || [];
      if (appRows.length === 0) return [];

      // Fetch applicant profiles
      const applicantIds = appRows.map((a) => a.applicant_id);
      const profiles = await fetchProfilesForUserIds(applicantIds);

      // Fetch votes for each application
      const appIds = appRows.map((a) => a.id);
      const { data: votesData } = await supabase
        .from('roommate_group_votes' as any)
        .select('*')
        .in('application_id', appIds);

      const voteRows = (votesData as unknown as VoteRow[] | null) || [];

      return appRows.map((app) => ({
        id: app.id,
        group_id: app.group_id,
        applicant_id: app.applicant_id,
        message: app.message,
        status: app.status as 'pending' | 'accepted' | 'rejected',
        created_at: app.created_at,
        applicant_profile: profiles[app.applicant_id]
          ? { name: profiles[app.applicant_id].name, avatar_url: profiles[app.applicant_id].avatar_url }
          : { name: 'Usuario', avatar_url: null },
        votes: voteRows
          .filter((v) => v.application_id === app.id)
          .map((v) => ({ voter_id: v.voter_id, vote: v.vote as 'yes' | 'no' })),
      }));
    } catch (error) {
      console.error('Error fetching applications:', error);
      return [];
    }
  };

  // Vote on an application
  const voteOnApplication = async (applicationId: string, vote: 'yes' | 'no') => {
    if (!user) throw new Error('No autenticado');

    try {
      // Check if already voted
      const { data: existing } = await supabase
        .from('roommate_group_votes' as any)
        .select('id')
        .eq('application_id', applicationId)
        .eq('voter_id', user.id)
        .maybeSingle();

      if (existing) {
        // Update existing vote
        const { error } = await supabase
          .from('roommate_group_votes' as any)
          .update({ vote })
          .eq('application_id', applicationId)
          .eq('voter_id', user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('roommate_group_votes' as any)
          .insert({
            application_id: applicationId,
            voter_id: user.id,
            vote,
          });

        if (error) throw error;
      }

      toast.success(vote === 'yes' ? 'Has votado a favor' : 'Has votado en contra');
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Error al votar');
      throw error;
    }
  };

  // Resolve application: check if all members have voted, auto-accept/reject
  const resolveApplication = async (applicationId: string) => {
    try {
      // Get the application
      const { data: app, error: appError } = await supabase
        .from('roommate_group_applications' as any)
        .select('*')
        .eq('id', applicationId)
        .single();

      if (appError) throw appError;

      const appData = app as unknown as ApplicationRow;

      // Get group members
      const { data: members } = await supabase
        .from('roommate_group_members' as any)
        .select('user_id')
        .eq('group_id', appData.group_id);

      // Get votes for this application
      const { data: votes } = await supabase
        .from('roommate_group_votes' as any)
        .select('*')
        .eq('application_id', applicationId);

      const memberRows = (members as unknown as MemberRow[] | null) || [];
      const voteRows = (votes as unknown as VoteRow[] | null) || [];
      const memberCount = memberRows.length;
      const voteCount = voteRows.length;

      // All members have voted
      if (voteCount >= memberCount) {
        const yesVotes = voteRows.filter((v) => v.vote === 'yes').length;
        const allYes = yesVotes === memberCount;

        if (allYes) {
          // Accept: update application status and add member
          await supabase
            .from('roommate_group_applications' as any)
            .update({ status: 'accepted' })
            .eq('id', applicationId);

          // Check if group is not full before adding
          const group = await getGroupWithMembers(appData.group_id);
          if ((group.members?.length || 0) < group.max_members) {
            await supabase
              .from('roommate_group_members' as any)
              .insert({
                group_id: appData.group_id,
                user_id: appData.applicant_id,
                role: 'member',
              });

            toast.success('Solicitud aceptada. Nuevo miembro agregado al grupo.');
          }
        } else {
          // Reject
          await supabase
            .from('roommate_group_applications' as any)
            .update({ status: 'rejected' })
            .eq('id', applicationId);

          toast.info('Solicitud rechazada por votacion.');
        }
      }
    } catch (error) {
      console.error('Error resolving application:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyGroups();
    }
  }, [user, fetchMyGroups]);

  return {
    myGroups,
    publicGroups,
    isLoading,
    createGroup,
    fetchMyGroups,
    fetchPublicGroups,
    getGroupWithMembers,
    updateGroup,
    deleteGroup,
    generateInviteLink,
    joinGroup,
    leaveGroup,
    removeMember,
    applyToGroup,
    getGroupApplications,
    voteOnApplication,
    resolveApplication,
  };
};
