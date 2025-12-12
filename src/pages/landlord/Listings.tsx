import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useListings } from '@/hooks/useListings';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Eye, Edit, Trash2, MapPin, Euro, Bed, Bath, Home } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const LandlordListings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { listings, fetchLandlordListings, deleteListing } = useListings();
  const [localListings, setLocalListings] = useState(listings);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role === 'landlord') {
      fetchLandlordListings(user.id);
    }
  }, [user, navigate, fetchLandlordListings]);

  useEffect(() => {
    setLocalListings(listings);
  }, [listings]);

  const handleToggleActive = async (listingId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('listings')
        .update({ is_active: !currentStatus })
        .eq('id', listingId);

      if (error) throw error;

      // Update local state
      setLocalListings(prev =>
        prev.map(listing =>
          listing.id === listingId
            ? { ...listing, is_active: !currentStatus }
            : listing
        )
      );

      toast.success(!currentStatus ? 'Anuncio activado' : 'Anuncio pausado', {
        description: !currentStatus
          ? 'Tu anuncio ahora es visible para estudiantes'
          : 'Tu anuncio está oculto temporalmente'
      });
    } catch (error) {
      toast.error('Error', {
        description: 'No se pudo actualizar el estado del anuncio'
      });
    }
  };

  const handleDelete = async (listingId: string) => {
    try {
      await deleteListing(listingId);
      setLocalListings(prev => prev.filter(l => l.id !== listingId));
    } catch (error) {
      // Error already handled in useListings
    }
  };

  if (!user || user.role !== 'landlord') return null;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mis Anuncios</h1>
            <p className="text-muted-foreground mt-2">
              {localListings.length} anuncio{localListings.length !== 1 ? 's' : ''} en total
            </p>
          </div>
          
          <Button onClick={() => navigate('/ll/create-listing')}>
            <Plus className="mr-2 h-4 w-4" />
            Crear anuncio
          </Button>
        </div>

        {/* Listings Grid */}
        {localListings.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Home className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No tienes anuncios aún</h3>
              <p className="text-muted-foreground mb-6">
                Crea tu primer anuncio y comienza a recibir solicitudes de estudiantes
              </p>
              <Button onClick={() => navigate('/ll/create-listing')}>
                <Plus className="mr-2 h-4 w-4" />
                Crear primer anuncio
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {localListings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden">
                {/* Image */}
                <div className="relative h-48 bg-muted">
                  {listing.images && listing.images.length > 0 ? (
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Home className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <Badge variant={listing.is_active ? 'default' : 'secondary'}>
                      {listing.is_active ? 'Activo' : 'Pausado'}
                    </Badge>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="line-clamp-1 text-lg">
                    {listing.title}
                  </CardTitle>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span className="line-clamp-1">{listing.address}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Price and Details */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-foreground">
                        {listing.price}€
                      </span>
                      <span className="text-sm text-muted-foreground">/mes</span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Bed className="h-4 w-4" />
                        <span>{listing.bedrooms}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="h-4 w-4" />
                        <span>{listing.bathrooms}</span>
                      </div>
                      {listing.area_sqm && (
                        <span>{listing.area_sqm}m²</span>
                      )}
                    </div>
                  </div>

                  {/* Toggle Active */}
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">
                      {listing.is_active ? 'Visible' : 'Oculto'}
                    </span>
                    <Switch
                      checked={listing.is_active}
                      onCheckedChange={() => handleToggleActive(listing.id, listing.is_active)}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => navigate(`/listing/${listing.id}`)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Ver
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => navigate(`/ll/edit-listing/${listing.id}`)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Eliminar anuncio?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. El anuncio se eliminará permanentemente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(listing.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default LandlordListings;
