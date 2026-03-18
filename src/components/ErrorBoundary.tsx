import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';

export const RouteErrorFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
    <h2 className="text-xl font-semibold mb-2">No se pudo cargar esta pagina</h2>
    <p className="text-muted-foreground mb-6 max-w-md">
      Ha ocurrido un error al cargar el contenido. Puedes intentar recargar o volver al inicio.
    </p>
    <div className="flex gap-3">
      <Button variant="outline" onClick={() => window.location.reload()}>
        Reintentar
      </Button>
      <Button onClick={() => { window.location.href = '/'; }}>
        Ir al inicio
      </Button>
    </div>
  </div>
);

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught:', error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Algo salió mal</h2>
          <p className="text-muted-foreground mb-4">
            Ha ocurrido un error inesperado. Por favor, intenta recargar la página.
          </p>
          {import.meta.env.DEV && this.state.error && (
            <pre className="text-xs text-left bg-muted p-4 rounded mb-4 max-w-lg overflow-auto">
              {this.state.error.message}
            </pre>
          )}
          <Button onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}>
            Recargar página
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
