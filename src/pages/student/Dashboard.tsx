import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useApplications } from '@/hooks/useApplications';
import { useMessages } from '@/hooks/useMessages';
import { useLikes } from '@/hooks/useLikes';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageSquare, FileText, Home, Eye, MapPin, Euro, Send } from 'lucide-react';
import SquadCard from '@/components/squads/SquadCard';
import { supabase } from '@/integrations/supabase/client';

interface ListingPreview {
  id: string;
  title: string;
  address: string;
  price: number;
  images: string[];
}

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { applications, fetchApplications } = useApplications();
  const { conversations } = useMessages();
  const { likedListings, fetchLikes } = useLikes();
  const [favoriteListings, setFavoriteListings] = useState<ListingPreview[]>([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);

  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    unreadMessages: 0,
    favoriteCount: 0
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    // Note: fetchApplications and fetchLikes are already called internally 
    // by their hooks when user changes, no need to call them again here
  }, [user, navigate]);

  useEffect(() => {
    // Calculate stats
    const totalApplications = applications.length;
    const pendingApplications = applications.filter(
      app => app.status === 'enviada' || app.status === 'preaprobada' || app.status === 'pendiente_docs'
    ).length;
    const approvedApplications = applications.filter(
      app => app.status === 'aprobada'
    ).length;
    const unreadMessages = conversations.reduce((sum, conv) => sum + (conv.unread_count || 0), 0);

    setStats({
      totalApplications,
      pendingApplications,
      approvedApplications,
      unreadMessages,
      favoriteCount: likedListings.length
    });
  }, [applications, conversations, likedListings]);

  useEffect(() => {
    // Fetch favorite listings details
    const fetchFavoriteListings = async () => {
      if (likedListings.length === 0) {
        setIsLoadingFavorites(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('listings')
          .select('id, title, address, price, images')
          .in('id', likedListings)
          .limit(3);

        if (error) throw error;
        setFavoriteListings(data || []);
      } catch (error) {
        console.error('Error fetching favorite listings:', error);
      } finally {
        setIsLoadingFavorites(false);
      }
    };

    fetchFavoriteListings();
  }, [likedListings]);

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
      'enviada': { label: 'Enviada', variant: 'secondary' },
      'preaprobada': { label: 'Preaprobada', variant: 'default' },
      'pendiente_docs': { label: 'Pendiente docs', variant: 'outline' },
      'aprobada': { label: 'Aprobada', variant: 'default' },
      'rechazada': { label: 'Rechazada', variant: 'destructive' },
      'cancelada_estudiante': { label: 'Cancelada', variant: 'secondary' },
      'expirada': { label: 'Expirada', variant: 'secondary' }
    };

    const config = statusConfig[status] || { label: status, variant: 'outline' };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (!user || user.role !== 'student') return null;

  const statsDisplay = [
    {
      title: 'Solicitudes totales',
      value: stats.totalApplications.toString(),
      description: `${stats.pendingApplications} en proceso`,
      icon: FileText,
      color: 'text-blue-500',
      action: () => navigate('/bookings')
    },
    {
      title: 'Solicitudes aprobadas',
      value: stats.approvedApplications.toString(),
      description: stats.approvedApplications === 0 ? 'Ninguna aprobada aún' : '¡Enhorabuena!',
      icon: Send,
      color: 'text-green-500',
      action: () => navigate('/bookings')
    },
    {
      title: 'Mensajes sin leer',
      value: stats.unreadMessages.toString(),
      description: stats.unreadMessages === 0 ? 'Todo al día' : `${stats.unreadMessages} sin leer`,
      icon: MessageSquare,
      color: 'text-purple-500',
      action: () => navigate('/messages')
    },
    {
      title: 'Pisos favoritos',
      value: stats.favoriteCount.toString(),
      description: `${stats.favoriteCount} guardado${stats.favoriteCount !== 1 ? 's' : ''}`,
      icon: Heart,
      color: 'text-red-500',
      action: () => navigate('/favorites')
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Mi Panel de Estudiante
          </h1>
          <p className="text-muted-foreground mt-2">
            Bienvenido, {user.name}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statsDisplay.map((stat, index) => (
            <Card
              key={index}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={stat.action}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.description}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column: Recent Applications */}
          <div className="lg:col-span-2 space-y-6">
            {/* Squad Card - Featured */}
            <SquadCard />
            
            {/* Recent Applications */}
            <div>
            <Card>
              <CardHeader>
                <CardTitle>Solicitudes recientes</CardTitle>
                <CardDescription>
                  Tus últimas solicitudes de alojamiento
                </CardDescription>
              </CardHeader>
              <CardContent>
                {applications.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      No has enviado ninguna solicitud aún
                    </p>
                    <Button onClick={() => navigate('/explore')}>
                      Buscar pisos
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.slice(0, 4).map((application) => (
                      <div
                        key={application.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium line-clamp-1">
                              Solicitud #{application.id.slice(0, 8)}
                            </h4>
                            {getStatusBadge(application.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(application.created_at).toLocaleDateString('es', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate('/bookings')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {applications.length > 4 && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => navigate('/bookings')}
                      >
                        Ver todas las solicitudes
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            </div>
          </div>

          {/* Favorites & Quick Actions */}
          <div className="space-y-6">
            {/* Favorite Listings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Favoritos
                </CardTitle>
                <CardDescription>
                  Pisos que te gustan
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingFavorites ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
                    ))}
                  </div>
                ) : favoriteListings.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No tienes favoritos aún
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {favoriteListings.map((listing) => (
                      <div
                        key={listing.id}
                        className="flex gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => navigate(`/listing/${listing.id}`)}
                      >
                        <div className="h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                          {listing.images?.[0] ? (
                            <img
                              src={listing.images[0]}
                              alt={listing.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <Home className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-1">
                            {listing.title}
                          </h4>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            <span className="line-clamp-1">{listing.address}</span>
                          </p>
                          <p className="text-sm font-semibold text-primary mt-1">
                            {listing.price}€/mes
                          </p>
                        </div>
                      </div>
                    ))}
                    {likedListings.length > 3 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full"
                        onClick={() => navigate('/favorites')}
                      >
                        Ver todos
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/explore')}
                >
                  <Home className="mr-2 h-4 w-4" />
                  Buscar pisos
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/messages')}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Mis mensajes
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/profile')}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Mi perfil
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentDashboard;
