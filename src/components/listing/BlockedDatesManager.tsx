import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CalendarX, Trash2, Plus } from 'lucide-react';
import { useBlockedDates } from '@/hooks/useBlockedDates';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface BlockedDatesManagerProps {
  listingId: string;
}

export const BlockedDatesManager = ({ listingId }: BlockedDatesManagerProps) => {
  const { blockedDates, isLoading, addBlockedDate, removeBlockedDate } = useBlockedDates(listingId);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [reason, setReason] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [dateToDelete, setDateToDelete] = useState<string>();

  const handleAddBlockedDate = async () => {
    if (!selectedDate) return;

    try {
      await addBlockedDate(selectedDate, reason);
      setSelectedDate(undefined);
      setReason('');
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleDeleteClick = (dateId: string) => {
    setDateToDelete(dateId);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (dateToDelete) {
      await removeBlockedDate(dateToDelete);
    }
    setShowConfirm(false);
    setDateToDelete(undefined);
  };

  const blockedDatesSet = new Set(blockedDates.map(bd => bd.blocked_date));

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarX className="h-5 w-5" />
            Gestionar Fechas Bloqueadas
          </CardTitle>
          <CardDescription>
            Bloquea fechas específicas cuando la propiedad no esté disponible
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Blocked Date */}
          <div className="space-y-4">
            <div>
              <Label>Seleccionar fecha a bloquear</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                locale={es}
                className="rounded-md border mt-2"
                modifiers={{
                  blocked: (date) => blockedDatesSet.has(date.toISOString().split('T')[0]),
                }}
                modifiersStyles={{
                  blocked: {
                    backgroundColor: 'hsl(var(--destructive) / 0.1)',
                    color: 'hsl(var(--destructive))',
                    textDecoration: 'line-through',
                  },
                }}
              />
            </div>

            {selectedDate && (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="reason">Motivo (opcional)</Label>
                  <Input
                    id="reason"
                    placeholder="Ej: Mantenimiento, reserva confirmada..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>

                <Button 
                  onClick={handleAddBlockedDate} 
                  className="w-full"
                  disabled={!selectedDate}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Bloquear {format(selectedDate, 'dd/MM/yyyy')}
                </Button>
              </div>
            )}
          </div>

          {/* List of Blocked Dates */}
          {blockedDates.length > 0 && (
            <div className="space-y-3 pt-4 border-t">
              <h4 className="font-medium text-sm">Fechas bloqueadas ({blockedDates.length})</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {blockedDates.map((blockedDate) => (
                  <div
                    key={blockedDate.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {format(new Date(blockedDate.blocked_date), 'dd MMMM yyyy', { locale: es })}
                      </div>
                      {blockedDate.reason && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {blockedDate.reason}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(blockedDate.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {blockedDates.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <CalendarX className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No hay fechas bloqueadas</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Desbloquear fecha?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta fecha volverá a estar disponible para nuevas reservas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Desbloquear
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
