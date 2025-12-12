import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StarRating } from './StarRating';
import { useReviews } from '@/hooks/useReviews';

interface ReviewFormProps {
  listingId: string;
  landlordId: string;
  onSuccess?: () => void;
}

export const ReviewForm = ({ listingId, landlordId, onSuccess }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const { createReview, isLoading } = useReviews();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      return;
    }

    const success = await createReview({
      listing_id: listingId,
      landlord_id: landlordId,
      rating,
      comment: comment.trim()
    });

    if (success) {
      setRating(0);
      setComment('');
      onSuccess?.();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deja tu valoración</CardTitle>
        <CardDescription>
          Comparte tu experiencia para ayudar a otros estudiantes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Puntuación
            </label>
            <StarRating
              rating={rating}
              size="lg"
              interactive
              onRatingChange={setRating}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Comentario
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Cuéntanos sobre tu experiencia con esta propiedad..."
              rows={4}
              required
              minLength={10}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Mínimo 10 caracteres
            </p>
          </div>

          <Button
            type="submit"
            disabled={isLoading || rating === 0 || comment.trim().length < 10}
            className="w-full"
          >
            {isLoading ? 'Publicando...' : 'Publicar valoración'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
