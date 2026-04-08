import { isDemoMode } from '@/utils/isDemo';

export const DemoBanner = () => {
  if (!isDemoMode()) return null;
  return (
    <div className="w-full bg-amber-50 border-b border-amber-200 text-center py-1.5 text-xs text-amber-700 font-medium">
      Modo Demo — Estás viendo datos de ejemplo.{' '}
      <a href="https://livix.es" className="underline hover:text-amber-900">
        Ir a la app real
      </a>
    </div>
  );
};

export default DemoBanner;
