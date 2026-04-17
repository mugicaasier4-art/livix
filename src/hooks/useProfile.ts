import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { validateImageFile } from '@/utils/fileValidation';
import { resizeImage } from '@/utils/imageResize';

export interface ProfileData {
  name: string;
  phone: string | null;
  bio: string | null;
  avatar_url: string | null;
}

export const useProfile = () => {
  const { user, refreshUser } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const updateProfile = async (data: Partial<ProfileData>) => {
    if (!user) throw new Error('No autenticado');

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);

      if (error) throw error;

      await refreshUser();

      toast.success('Perfil actualizado', {
        description: 'Tus cambios se guardaron correctamente',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error al actualizar perfil', {
        description: 'No se pudo actualizar el perfil',
      });
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const uploadAvatar = async (file: File): Promise<string> => {
    if (!user) throw new Error('No autenticado');
    
    // Validate image file before upload
    const validationError = validateImageFile(file);
    if (validationError) {
      toast.error('Imagen no válida', { description: validationError });
      throw new Error(validationError);
    }

    setIsUploadingAvatar(true);
    try {
      const resized = await resizeImage(file, { maxWidth: 400, maxHeight: 400 });
      const fileExt = resized.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, resized, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      await updateProfile({ avatar_url: publicUrl });

      return publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Error al subir imagen', {
        description: 'No se pudo subir la imagen',
      });
      throw error;
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  return {
    updateProfile,
    uploadAvatar,
    isUpdating,
    isUploadingAvatar,
  };
};
