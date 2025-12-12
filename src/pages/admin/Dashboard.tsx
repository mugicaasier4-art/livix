import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, Home, AlertTriangle, TrendingUp, Activity, Database, Settings } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Usuarios totales',
      value: '2,847',
      change: '+127 este mes',
      icon: Users,
      color: 'text-primary'
    },
    {
      title: 'Anuncios activos',
      value: '486',
      change: '+23 esta semana',
      icon: Home,
      color: 'text-success'
    },
    {
      title: 'Reportes pendientes',
      value: '12',
      change: '3 urgentes',
      icon: AlertTriangle,
      color: 'text-warning'
    },
    {
      title: 'Ingresos del mes',
      value: '€12,450',
      change: '+15% vs mes anterior',
      icon: TrendingUp,
      color: 'text-green-600'
    }
  ];

  const recentReports = [
    {
      type: 'user',
      message: 'Reporte de usuario sospechoso',
      severity: 'high',
      time: 'Hace 1 hora'
    },
    {
      type: 'listing',
      message: 'Anuncio con contenido inapropiado',
      severity: 'medium',
      time: 'Hace 3 horas'
    },
    {
      type: 'payment',
      message: 'Problema con pago',
      severity: 'low',
      time: 'Hace 5 horas'
    }
  ];

  const quickActions = [
    { label: 'Moderar contenido', icon: Shield, href: '/admin/moderation' },
    { label: 'Gestionar usuarios', icon: Users, href: '/admin/users' },
    { label: 'Ver anuncios', icon: Home, href: '/admin/listings' },
    { label: 'Configuración', icon: Settings, href: '/admin/settings' }
  ];

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
          {stats.map((stat, index) => (
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
          {/* Recent Reports */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Reportes recientes</CardTitle>
                <CardDescription>
                  Últimos reportes que requieren atención
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentReports.map((report, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border">
                      <div className="mt-1">
                        {report.type === 'user' && <Users className="h-4 w-4 text-primary" />}
                        {report.type === 'listing' && <Home className="h-4 w-4 text-warning" />}
                        {report.type === 'payment' && <TrendingUp className="h-4 w-4 text-destructive" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium">{report.message}</p>
                          <Badge 
                            variant={
                              report.severity === 'high' ? 'destructive' : 
                              report.severity === 'medium' ? 'default' : 'secondary'
                            }
                            className="text-xs"
                          >
                            {report.severity === 'high' ? 'Alta' : 
                             report.severity === 'medium' ? 'Media' : 'Baja'}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{report.time}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        Revisar
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
                  Tareas de administración
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {quickActions.map((action, index) => (
                    <Button key={index} className="w-full justify-start" variant="outline">
                      <action.icon className="mr-2 h-4 w-4" />
                      {action.label}
                    </Button>
                  ))}
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