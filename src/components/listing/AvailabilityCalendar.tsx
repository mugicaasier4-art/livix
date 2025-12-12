import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { CalendarCheck, CalendarX, CalendarDays } from 'lucide-react';
import { useBlockedDates } from '@/hooks/useBlockedDates';
import { format, parseISO, isAfter, isBefore, isValid } from 'date-fns';
import { es } from 'date-fns/locale';

interface AvailabilityCalendarProps {
  listingId: string;
  availableFrom: string;
  availableTo?: string | null;
  onDateSelect?: (date: Date | undefined) => void;
  selectedDate?: Date;
  mode?: 'view' | 'select';
}

export const AvailabilityCalendar = ({
  listingId,
  availableFrom,
  availableTo,
  onDateSelect,
  selectedDate,
  mode = 'view',
}: AvailabilityCalendarProps) => {
  const { blockedDates, isLoading } = useBlockedDates(listingId);

  // Handle undefined or invalid availableFrom
  const availableFromDate = availableFrom ? parseISO(availableFrom) : new Date();
  const availableToDate = availableTo ? parseISO(availableTo) : undefined;

  // Validate dates
  if (!availableFrom || !isValid(availableFromDate)) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Fecha de disponibilidad no especificada</p>
        </CardContent>
      </Card>
    );
  }

  const isDateAvailable = (date: Date): boolean => {
    // Check if date is before availableFrom
    if (isBefore(date, availableFromDate)) return false;

    // Check if date is after availableTo
    if (availableToDate && isAfter(date, availableToDate)) return false;

    // Check if date is blocked
    const dateStr = date.toISOString().split('T')[0];
    const isBlocked = blockedDates.some(bd => bd.blocked_date === dateStr);
    
    return !isBlocked;
  };

  const modifiers = {
    available: (date: Date) => isDateAvailable(date),
    blocked: (date: Date) => {
      const dateStr = date.toISOString().split('T')[0];
      return blockedDates.some(bd => bd.blocked_date === dateStr);
    },
    unavailable: (date: Date) => {
      if (isBefore(date, availableFromDate)) return true;
      if (availableToDate && isAfter(date, availableToDate)) return true;
      return false;
    },
  };

  const modifiersStyles = {
    available: {
      backgroundColor: 'hsl(var(--primary) / 0.1)',
      color: 'hsl(var(--primary))',
      fontWeight: '600',
    },
    blocked: {
      backgroundColor: 'hsl(var(--destructive) / 0.1)',
      color: 'hsl(var(--destructive))',
      textDecoration: 'line-through',
    },
    unavailable: {
      color: 'hsl(var(--muted-foreground))',
      opacity: 0.5,
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          Disponibilidad
        </CardTitle>
        <CardDescription>
          Consulta las fechas disponibles para esta propiedad
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Legend */}
          <div className="flex flex-wrap gap-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-primary/10 border border-primary/30" />
              <span className="text-muted-foreground">Disponible</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-destructive/10 border border-destructive/30" />
              <span className="text-muted-foreground">Bloqueada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-muted" />
              <span className="text-muted-foreground">No disponible</span>
            </div>
          </div>

          {/* Calendar */}
          <Calendar
            mode={mode === 'select' ? 'single' : undefined}
            selected={selectedDate}
            onSelect={onDateSelect}
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            disabled={(date) => !isDateAvailable(date)}
            locale={es}
            className="rounded-md border"
            fromDate={availableFromDate}
            toDate={availableToDate}
          />

          {/* Date Range Info */}
          <div className="space-y-2 pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <CalendarCheck className="h-4 w-4" />
                Disponible desde:
              </span>
              <span className="font-medium">
                {format(availableFromDate, 'dd MMMM yyyy', { locale: es })}
              </span>
            </div>
            {availableToDate && isValid(availableToDate) && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <CalendarX className="h-4 w-4" />
                  Disponible hasta:
                </span>
                <span className="font-medium">
                  {format(availableToDate, 'dd MMMM yyyy', { locale: es })}
                </span>
              </div>
            )}
          </div>

          {/* Selected Date Display */}
          {mode === 'select' && selectedDate && (
            <Badge variant="secondary" className="w-full justify-center py-2">
              Fecha seleccionada: {format(selectedDate, 'dd MMMM yyyy', { locale: es })}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
