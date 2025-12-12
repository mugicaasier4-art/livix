import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Squad {
  id: string;
  name: string;
  target_location: string | null;
  created_by: string;
  invite_code: string;
  created_at: string;
  updated_at: string;
}

interface SquadMember {
  id: string;
  squad_id: string;
  user_id: string;
  role: 'admin' | 'member';
  joined_at: string;
  profiles?: {
    name: string;
    avatar_url: string | null;
  };
}

export const useSquads = () => {
  const [mySquad, setMySquad] = useState<Squad | null>(null);
  const [squadMembers, setSquadMembers] = useState<SquadMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchMySquad = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // Get squads where user is a member
      const { data: memberData, error: memberError } = await supabase
        .from('squad_members')
        .select('squad_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (memberError) throw memberError;

      if (!memberData) {
        setMySquad(null);
        setSquadMembers([]);
        return;
      }

      // Get squad details
      const { data: squadData, error: squadError } = await supabase
        .from('squads')
        .select('*')
        .eq('id', memberData.squad_id)
        .single();

      if (squadError) throw squadError;

      setMySquad(squadData);

      // Get all squad members
      const { data: membersData, error: membersError } = await supabase
        .from('squad_members')
        .select('*')
        .eq('squad_id', memberData.squad_id);

      if (membersError) throw membersError;

      // Fetch profiles separately
      if (membersData && membersData.length > 0) {
        const userIds = membersData.map(m => m.user_id);
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, name, avatar_url')
          .in('id', userIds);

        const membersWithProfiles = membersData.map(member => ({
          ...member,
          profiles: profilesData?.find(p => p.id === member.user_id)
        }));

        setSquadMembers(membersWithProfiles as SquadMember[]);
      } else {
        setSquadMembers([]);
      }
    } catch (error) {
      console.error('Error fetching squad:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createSquad = async (name: string, targetLocation?: string) => {
    if (!user) throw new Error('Not authenticated');

    try {
      // Generate invite code
      const { data: codeData, error: codeError } = await supabase
        .rpc('generate_invite_code');

      if (codeError) throw codeError;

      // Create squad
      const { data: squadData, error: squadError } = await supabase
        .from('squads')
        .insert({
          name,
          target_location: targetLocation || null,
          created_by: user.id,
          invite_code: codeData
        })
        .select()
        .single();

      if (squadError) throw squadError;

      // Add creator as admin member
      const { error: memberError } = await supabase
        .from('squad_members')
        .insert({
          squad_id: squadData.id,
          user_id: user.id,
          role: 'admin'
        });

      if (memberError) throw memberError;

      await fetchMySquad();
      toast.success('¡Squad creado!', {
        description: `Código de invitación: ${squadData.invite_code}`
      });

      return squadData;
    } catch (error) {
      console.error('Error creating squad:', error);
      toast.error('Error al crear el squad');
      throw error;
    }
  };

  const joinSquad = async (inviteCode: string) => {
    if (!user) throw new Error('Not authenticated');

    try {
      // Find squad by invite code
      const { data: squadData, error: squadError } = await supabase
        .from('squads')
        .select('id')
        .eq('invite_code', inviteCode.toUpperCase())
        .maybeSingle();

      if (squadError) throw squadError;

      if (!squadData) {
        toast.error('Código de invitación no válido');
        return;
      }

      // Check if already a member
      const { data: existingMember } = await supabase
        .from('squad_members')
        .select('id')
        .eq('squad_id', squadData.id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingMember) {
        toast.error('Ya eres miembro de este squad');
        return;
      }

      // Join squad as member
      const { error: memberError } = await supabase
        .from('squad_members')
        .insert({
          squad_id: squadData.id,
          user_id: user.id,
          role: 'member'
        });

      if (memberError) throw memberError;

      // Refetch squad data only once on success
      await fetchMySquad();
      toast.success('¡Te has unido al squad!');
    } catch (error) {
      console.error('Error joining squad:', error);
      toast.error('Error al unirse al squad');
      // Don't re-throw to prevent error propagation causing loops
    }
  };

  const leaveSquad = async () => {
    if (!user || !mySquad) return;

    try {
      const { error } = await supabase
        .from('squad_members')
        .delete()
        .eq('squad_id', mySquad.id)
        .eq('user_id', user.id);

      if (error) throw error;

      setMySquad(null);
      setSquadMembers([]);
      toast.success('Has salido del squad');
    } catch (error) {
      console.error('Error leaving squad:', error);
      toast.error('Error al salir del squad');
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      fetchMySquad();
    }
  }, [user]);

  return {
    mySquad,
    squadMembers,
    isLoading,
    createSquad,
    joinSquad,
    leaveSquad,
    refetch: fetchMySquad
  };
};
