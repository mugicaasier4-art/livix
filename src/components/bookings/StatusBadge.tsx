import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle, Clock, FileText, AlertCircle, XCircle, Ban } from 'lucide-react';
import type { BookingStatus } from '@/data/bookings';
import { useI18n } from '@/contexts/I18nContext';

interface StatusBadgeProps {
  status: BookingStatus;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const { t } = useI18n();

  const statusConfig = {
    enviada: {
      label: 'Enviada',
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: Clock
    },
    preaprobada: {
      label: 'Preaprobada',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: Clock
    },
    pendiente_docs: {
      label: 'Documentos pendientes',
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      icon: FileText
    },
    aprobada: {
      label: 'Aprobada',
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: CheckCircle
    },
    rechazada: {
      label: 'Rechazada',
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: XCircle
    },
    cancelada_estudiante: {
      label: 'Cancelada',
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      icon: Ban
    },
    expirada: {
      label: 'Expirada',
      color: 'bg-gray-100 text-gray-600 border-gray-200',
      icon: AlertCircle
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 font-medium",
        config.color,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};

export default StatusBadge;