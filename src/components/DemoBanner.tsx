import { isDemoMode } from '@/utils/isDemo';

export const DemoBanner = () => {
  if (!isDemoMode()) return null;
  return (
    <div className="w-full bg-foreground/95 backdrop-blur-sm text-center py-2 text-[11px] tracking-wider uppercase text-white/85">
      <span className="inline-flex items-center gap-2">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#E5BE5C]" />
        <span className="font-medium">Vista previa Livix · Datos de muestra</span>
      </span>
    </div>
  );
};

export default DemoBanner;
