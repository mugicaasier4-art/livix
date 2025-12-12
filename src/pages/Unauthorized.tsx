import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, ArrowLeft } from 'lucide-react';

const Unauthorized = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <Shield className="h-6 w-6 text-destructive" />
              </div>
              <CardTitle className="text-2xl">Acceso denegado</CardTitle>
              <CardDescription>
                No tienes permisos para acceder a esta página
              </CardDescription>
            </CardHeader>
            
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground mb-6">
                Esta sección está reservada para usuarios con permisos específicos. 
                Si crees que esto es un error, contacta con soporte.
              </p>
              
              <div className="space-y-3">
                <Link to="/">
                  <Button className="w-full">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver al inicio
                  </Button>
                </Link>
                
                <Link to="/login">
                  <Button variant="outline" className="w-full">
                    Cambiar de cuenta
                  </Button>  
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Unauthorized;