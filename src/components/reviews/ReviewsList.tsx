import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { StarRating } from './StarRating';
import { useReviews, Review } from '@/hooks/useReviews';
import { useAuth } from '@/contexts/AuthContext';
import { Trash2, MessageSquare } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ReviewsListProps {
  listingId: string;
  landlordId: string;
}

export const ReviewsList = ({ listingId, landlordId }: ReviewsListProps) => {
  const { user } = useAuth();
  const { reviews, averageRating, totalReviews, deleteReview, addLandlordResponse, isLoading } = useReviews(listingId);
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [response, setResponse] = useState('');

  const handleDelete = async (reviewId: string) => {
    await deleteReview(reviewId);
  };

  const handleRespond = async (reviewId: string) => {
    if (!response.trim()) return;
    
    const success = await addLandlordResponse(reviewId, response.trim());
    if (success) {
      setRespondingTo(null);
      setResponse('');
    }
  };

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Aún no hay valoraciones para esta propiedad
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-4xl font-bold">{averageRating?.toFixed(1)}</div>
              <StarRating rating={averageRating || 0} size="md" />
              <p className="text-sm text-muted-foreground mt-1">
                {totalReviews} valoracion{totalReviews !== 1 ? 'es' : ''}
              </p>
            </div>
            <div className="flex-1">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviews.filter(r => r.rating === star).length;
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-2 mb-1">
                    <span className="text-sm w-3">{star}</span>
                    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-8">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews */}
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardContent className="pt-6">
            {/* Review header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {review.student?.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{review.student?.name || 'Usuario'}</p>
                  <div className="flex items-center gap-2">
                    <StarRating rating={review.rating} size="sm" />
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(review.created_at), {
                        addSuffix: true,
                        locale: es
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {user?.id === review.student_id && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Eliminar valoración?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. Tu valoración será eliminada permanentemente.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(review.id)}>
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>

            {/* Review content */}
            <p className="text-sm mb-4">{review.comment}</p>

            {/* Landlord response */}
            {review.landlord_response ? (
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-medium mb-1">Respuesta del propietario</p>
                <p className="text-sm text-muted-foreground">{review.landlord_response}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {formatDistanceToNow(new Date(review.landlord_response_at!), {
                    addSuffix: true,
                    locale: es
                  })}
                </p>
              </div>
            ) : (
              user?.id === landlordId && (
                <div>
                  {respondingTo === review.id ? (
                    <div className="space-y-2">
                      <Textarea
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        placeholder="Escribe tu respuesta..."
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleRespond(review.id)}
                          disabled={!response.trim() || isLoading}
                        >
                          Publicar respuesta
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setRespondingTo(null);
                            setResponse('');
                          }}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setRespondingTo(review.id)}
                    >
                      <MessageSquare className="h-3 w-3 mr-2" />
                      Responder
                    </Button>
                  )}
                </div>
              )
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
