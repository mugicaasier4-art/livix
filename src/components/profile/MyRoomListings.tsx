import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Home, Edit, Trash2, Eye, EyeOff, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface RoomListing {
  id: string;
  title: string;
  price: number;
  neighborhood: string;
  is_active: boolean;
  created_at: string;
  images: string[];
}

const MyRoomListings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState<RoomListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchMyListings();
  }, [user]);

  const fetchMyListings = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('room_listings')
      .select('id, title, price, neighborhood, is_active, created_at, images')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching listings:', error);
    } else {
      setListings(data || []);
    }
    setIsLoading(false);
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('room_listings')
      .update({ is_active: !currentStatus })
      .eq('id', id);

    if (error) {
      toast.error('Error al actualizar el anuncio');
    } else {
      toast.success(currentStatus ? 'Anuncio desactivado' : 'Anuncio activado');
      fetchMyListings();
    }
  };

  const deleteListing = async (id: string) => {
    const { error } = await supabase
      .from('room_listings')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Error al eliminar el anuncio');
    } else {
      toast.success('Anuncio eliminado');
      fetchMyListings();
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Mis Anuncios de Habitación
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-4 p-4 border rounded-lg">
              <Skeleton className="h-20 w-20 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5" />
          Mis Anuncios de Habitación
        </CardTitle>
        <Button 
          size="sm" 
          onClick={() => navigate('/roommates/create')}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Nuevo anuncio
        </Button>
      </CardHeader>
      <CardContent>
        {listings.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Home className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No tienes anuncios publicados</p>
            <Button 
              variant="link" 
              onClick={() => navigate('/roommates/create')}
              className="mt-2"
            >
              Publicar tu primera habitación
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {listings.map((listing) => (
              <div 
                key={listing.id} 
                className="flex gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                {/* Image */}
                <div className="h-20 w-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  {listing.images?.[0] ? (
                    <img 
                      src={listing.images[0]} 
                      alt={listing.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Home className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-medium truncate">{listing.title}</h3>
                      <p className="text-sm text-muted-foreground">{listing.neighborhood}</p>
                    </div>
                    <Badge variant={listing.is_active ? "default" : "secondary"}>
                      {listing.is_active ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <span className="font-semibold text-primary">{listing.price}€</span>
                      <span className="text-sm text-muted-foreground">/mes</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(listing.created_at), "d MMM yyyy", { locale: es })}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => navigate(`/roommates/edit/${listing.id}`)}
                    title="Editar"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => toggleActive(listing.id, listing.is_active)}
                    title={listing.is_active ? 'Desactivar' : 'Activar'}
                  >
                    {listing.is_active ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar anuncio?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. El anuncio será eliminado permanentemente.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteListing(listing.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MyRoomListings;
