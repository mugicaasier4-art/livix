import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, Home, AlertTriangle, TrendingUp, Activity, Database, Settings, Loader2, Building } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AdminStats {
  totalUsers: number;
  activeListings: number;
  pendingApplications: number;
  activeSubscriptions: number;
  isLoading: boolean;
}

interface RecentApplication {
  id: string;
  status: string;
  created_at: string;
  student_name: string | null;
  listing_title: string | null;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeListings: 0,
    pendingApplications: 0,
    activeSubscriptions: 0,
    isLoading: true,
  });
  const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const [usersRes, listingsRes, applicationsRes, subsRes, recentRes] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase
          .from('applications')
          .select('id, status, created_at')
          .order('created_at', { ascending: false })
          .limit(5),
      ]);

      setStats({
        totalUsers: usersRes.count ?? 0,
        activeListings: listingsRes.count ?? 0,
        pendingApplications: applicationsRes.count ?? 0,
        activeSubscriptions: subsRes.count ?? 0,
        isLoading: false,
      });

      setRecentApplications(
        (recentRes.data || []).map((a) => ({
          id: a.id,
          status: a.status,
          created_at: a.created_at,
          student_name: null,
          listing_title: null,
        }))
      );
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Usuarios totales',
      value: stats.isLoading ? '—' : stats.totalUsers.toLocaleString('es-ES'),
      change: 'Perfiles registrados',
      icon: Users,
      color: 'text-primary'
    },
    {
      title: 'Anuncios activos',
      value: stats.isLoading ? '—' : stats.activeListings.toLocaleString('es-ES'),
      change: 'En estado activo',
      icon: Home,
      color: 'text-success'
    },
    {
      title: 'Solicitudes pendientes',
      value: stats.isLoading ? '—' : stats.pendingApplications.toLocaleString('es-ES'),
      change: 'Esperando respuesta',
      icon: AlertTriangle,
      color: 'text-warning'
    },
    {
      title: 'Suscripciones activas',
      value: stats.isLoading ? '—' : stats.activeSubscriptions.toLocaleString('es-ES'),
      change: 'Planes premium activos',
      icon: TrendingUp,
      color: 'text-green-600'
    }
  ];

  const statusColor = (status: string) => {
    if (status === 'pending') return 'default';
    if (status === 'accepted') return 'secondary';
    if (status === 'rejected') return 'destructive';
    return 'outline';
  };

  const statusLabel = (status: string) => {
    const map: Record<string, string> = {
      pending: 'Pendiente',
      accepted: 'Aceptada',
      rejected: 'Rechazada',
      withdrawn: 'Retirada',
      completed: 'Completada',
    };
    return map[status] ?? status;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Panel de Administración
            </h1>
            <p className="text-muted-foreground">
              Bienvenido, {user?.name}
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Activity className="mr-2 h-4 w-4" />
              Ver logs
            </Button>
            <Button variant="outline" size="sm">
              <Database className="mr-2 h-4 w-4" />
              Backup
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    {stats.isLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mt-1" />
                    ) : (
                      <p className="text-2xl font-bold">{stat.value}</p>
                    )}
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
          {/* Recent Applications */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Solicitudes recientes</CardTitle>
                <CardDescription>
                  Últimas solicitudes de alquiler recibidas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {stats.isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : recentApplications.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No hay solicitudes recientes
                  </p>
                ) : (
                  <div className="space-y-4">
                    {recentApplications.map((app) => (
                      <div key={app.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                        <div className="mt-1">
                          <Home className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium">Solicitud #{app.id.slice(0, 8)}</p>
                            <Badge variant={statusColor(app.status)} className="text-xs">
                              {statusLabel(app.status)}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(app.created_at).toLocaleDateString('es-ES', {
                              day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Acciones rápidas</CardTitle>
                <CardDescription>
                  Gestión del sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full justify-start" variant="outline" onClick={() => window.open('https://supabase.com/dashboard/project/xeyfrydlojosratstsfk/editor', '_blank')}>
                    <Database className="mr-2 h-4 w-4" />
                    Supabase SQL Editor
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => window.open('https://supabase.com/dashboard/project/xeyfrydlojosratstsfk/logs/postgres-logs', '_blank')}>
                    <Activity className="mr-2 h-4 w-4" />
                    Logs de base de datos
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => window.open('/residences/admin-portal-x7k9', '_blank')}>
                    <Building className="mr-2 h-4 w-4" />
                    Portal de residencias
                  </Button>
                  <Button className="w-full justify-start" variant="outline" disabled title="Próximamente">
                    <Shield className="mr-2 h-4 w-4" />
                    Moderación de contenido
                  </Button>
                  <Button className="w-full justify-start" variant="outline" disabled title="Próximamente">
                    <Users className="mr-2 h-4 w-4" />
                    Gestionar usuarios
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

export default AdminDashboard;
