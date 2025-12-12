import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import MyRoomListings from '@/components/profile/MyRoomListings';
import { VerificationBadge } from '@/components/verification/VerificationBadge';
import { User, Camera, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { updateProfile, uploadAvatar, isUpdating, isUploadingAvatar } = useProfile();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bio: '',
    avatar_url: '',
    is_verified: false
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('name, phone, bio, avatar_url, is_verified')
        .eq('id', user.id)
        .single();

      if (data) {
        setFormData({
          name: data.name || '',
          phone: data.phone || '',
          bio: data.bio || '',
          avatar_url: data.avatar_url || '',
          is_verified: data.is_verified || false
        });
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name: formData.name,
      phone: formData.phone || null,
      bio: formData.bio || null,
    });
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadAvatar(file);
    setFormData(prev => ({ ...prev, avatar_url: url }));
  };

  if (!user) return null;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-2xl">
        {/* Mobile-friendly header */}
        <div className="flex items-center gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Mi Perfil</h1>
          <div className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
            {user.role === 'student' && '🎓 Estudiante'}
            {user.role === 'landlord' && '🏠 Propietario'}
            {user.role === 'admin' && '👨‍💼 Admin'}
          </div>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="p-4 md:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Avatar - Mobile optimized layout */}
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-muted/30 rounded-xl">
                <div className="relative">
                  <Avatar className="h-20 w-20 md:h-24 md:w-24 border-4 border-background shadow-lg">
                    <AvatarImage src={formData.avatar_url} />
                    <AvatarFallback className="bg-primary/10">
                      <User className="h-10 w-10 md:h-12 md:w-12 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1">
                    <VerificationBadge isVerified={formData.is_verified} size="lg" />
                  </div>
                </div>

                <div className="flex flex-col items-center sm:items-start gap-2">
                  <p className="font-semibold text-lg">{formData.name || 'Tu nombre'}</p>
                  <Label htmlFor="avatar" className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-background rounded-full border hover:bg-muted transition-colors min-h-[44px]">
                      {isUploadingAvatar ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Camera className="h-4 w-4" />
                      )}
                      <span className="text-sm font-medium">Cambiar foto</span>
                    </div>
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                      disabled={isUploadingAvatar}
                    />
                  </Label>
                </div>
              </div>

              {/* Form fields with larger touch targets */}
              <div className="space-y-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Nombre completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    className="h-12 text-base"
                  />
                </div>

                {/* Email (read-only) */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    disabled
                    className="h-12 text-base bg-muted"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">Teléfono</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+34 600 000 000"
                    className="h-12 text-base"
                  />
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-sm font-medium">Biografía</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Cuéntanos algo sobre ti..."
                    rows={3}
                    className="text-base resize-none"
                  />
                </div>
              </div>

              <Button type="submit" disabled={isUpdating} className="w-full h-12 text-base font-medium">
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  'Guardar cambios'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* My Room Listings Section */}
        <div className="mt-6">
          <MyRoomListings />
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
