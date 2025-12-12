import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Home, Users, MessageSquare, Calendar, Plus, Eye, Settings, BarChart3 } from 'lucide-react';
import { useListings } from '@/hooks/useListings';
import { useApplications } from '@/hooks/useApplications';
import { useMessages } from '@/hooks/useMessages';
import { useEffect, useState } from 'react';

const LandlordDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { listings, fetchLandlordListings } = useListings();
  const { applications } = useApplications();
  const { conversations } = useMessages();
  const [stats, setStats] = useState({
    activeListings: 0,
    pendingApplications: 0,
    unreadMessages: 0,
    upcomingVisits: 0
  });

  useEffect(() => {
    if (user && user.role === 'landlord') {
      fetchLandlordListings(user.id);
    }
  }, [user]);

  useEffect(() => {
    // Calculate stats from real data
    const activeListings = listings.filter(l => l.is_active).length;
    const pendingApplications = applications.filter(
      app => app.status === 'enviada' || app.status === 'preaprobada'
    ).length;
    const unreadMessages = conversations.reduce((sum, conv) => sum + (conv.unread_count || 0), 0);

    setStats({
      activeListings,
      pendingApplications,
      unreadMessages,
      upcomingVisits: 0 // TODO: Implement visits
    });
  }, [listings, applications, conversations]);

  const statsDisplay = [
    {
      title: 'Anuncios activos',
      value: stats.activeListings.toString(),
      change: stats.activeListings === 0 ? 'Crea tu primer anuncio' : `${stats.activeListings} activo${stats.activeListings !== 1 ? 's' : ''}`,
      icon: Home,
      color: 'text-primary'
    },
    {
      title: 'Solicitudes pendientes',
      value: stats.pendingApplications.toString(),
      change: stats.pendingApplications === 0 ? 'No hay solicitudes aún' : `${stats.pendingApplications} pendiente${stats.pendingApplications !== 1 ? 's' : ''}`,
      icon: Users,
      color: stats.pendingApplications > 0 ? 'text-primary' : 'text-muted-foreground'
    },
    {
      title: 'Mensajes sin leer',
      value: stats.unreadMessages.toString(),
      change: stats.unreadMessages === 0 ? 'No hay mensajes nuevos' : `${stats.unreadMessages} sin leer`,
      icon: MessageSquare,
      color: stats.unreadMessages > 0 ? 'text-primary' : 'text-muted-foreground'
    },
    {
      title: 'Visitas esta semana',
      value: stats.upcomingVisits.toString(),
      change: stats.upcomingVisits === 0 ? 'No hay visitas programadas' : `${stats.upcomingVisits} programada${stats.upcomingVisits !== 1 ? 's' : ''}`,
      icon: Calendar,
      color: stats.upcomingVisits > 0 ? 'text-primary' : 'text-muted-foreground'
    }
  ];

  const recentActivity = applications.slice(0, 3).map(app => ({
    type: 'application' as const,
    message: `Nueva solicitud de ${app.student_name}`,
    time: new Date(app.created_at).toLocaleDateString('es', { day: 'numeric', month: 'short' }),
    urgent: app.status === 'enviada',
    applicationId: app.id
  }));

  // If no applications, show welcome messages
  const displayActivity = recentActivity.length > 0 ? recentActivity : [
    {
      type: 'info' as const,
      message: 'Bienvenido a tu panel de propietario',
      time: 'Comienza creando tu primer anuncio',
      urgent: false
    },
    {
      type: 'info' as const,
      message: 'Configura tu perfil y preferencias',
      time: 'Añade información de contacto',
      urgent: false
    },
    {
      type: 'info' as const,
      message: 'Explora las herramientas disponibles',
      time: 'Familiarízate con la plataforma',
      urgent: false
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Dashboard Propietario
            </h1>
            <p className="text-muted-foreground">
              Bienvenido, {user?.name}
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/ll/analytics')}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Analíticas
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/ll/settings')}
            >
              <Settings className="mr-2 h-4 w-4" />
              Configuración
            </Button>
            <Button 
              size="sm"
              onClick={() => navigate('/ll/create-listing')}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nuevo anuncio
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statsDisplay.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Actividad reciente</CardTitle>
                <CardDescription>
                  Primeros pasos en la plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {displayActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border">
                      <div className="mt-1">
                        {activity.type === 'application' && <Users className="h-4 w-4 text-primary" />}
                        {activity.type === 'message' && <MessageSquare className="h-4 w-4 text-blue-500" />}
                        {activity.type === 'visit' && <Calendar className="h-4 w-4 text-green-500" />}
                        {activity.type === 'info' && <Home className="h-4 w-4 text-muted-foreground" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium">{activity.message}</p>
                          {activity.urgent && <Badge variant="destructive" className="text-xs">Urgente</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          if (activity.type === 'application' && 'applicationId' in activity) {
                            navigate(`/ll/applications/${activity.applicationId}`);
                          }
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Acciones rápidas</CardTitle>
                <CardDescription>
                  Tareas comunes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => navigate('/ll/listings')}
                    data-tour="my-listings"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Mis anuncios
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => navigate('/ll/create-listing')}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Crear anuncio
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => navigate('/ll/applications')}
                    data-tour="applications"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Ver solicitudes
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => navigate('/ll/analytics')}
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Ver analíticas
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => navigate('/messages')}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Mensajes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LandlordDashboard;