import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, MessageCircle, Send, Share } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface ActionButtonsProps {
  listingId: number;
  price: number;
  onSaveToggle?: (saved: boolean) => void;
}

const ActionButtons = ({ listingId, price, onSaveToggle }: ActionButtonsProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const navigate = useNavigate();

  const handleSaveToggle = () => {
    const newSavedState = !isSaved;
    setIsSaved(newSavedState);
    onSaveToggle?.(newSavedState);
    
    // Here you would typically save to localStorage or send to API
    const savedListings = JSON.parse(localStorage.getItem('saved_listings') || '[]');
    if (newSavedState) {
      savedListings.push(listingId);
    } else {
      const index = savedListings.indexOf(listingId);
      if (index > -1) savedListings.splice(index, 1);
    }
    localStorage.setItem('saved_listings', JSON.stringify(savedListings));
  };

  const handleApply = () => {
    // Navigate to application flow
    navigate(`/apply/${listingId}`);
  };

  const handleMessage = () => {
    // Navigate to messaging or open chat
    navigate(`/messages/new?listing=${listingId}`);
  };

  const handleShare = () => {
    // Share functionality
    if (navigator.share) {
      navigator.share({
        title: 'Alojamiento en Livix',
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <Card className="sticky top-24">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Price */}
          <div className="text-center pb-4 border-b">
            <div className="text-2xl font-bold">€{price}</div>
            <div className="text-sm text-muted-foreground">por mes</div>
          </div>

          {/* Main Actions */}
          <div className="space-y-3">
            <Button 
              size="lg" 
              className="w-full"
              onClick={handleApply}
            >
              <Send className="mr-2 h-4 w-4" />
              Solicitar alojamiento
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full"
              onClick={handleMessage}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Enviar mensaje
            </Button>
          </div>

          {/* Secondary Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "flex-1 transition-colors",
                isSaved && "bg-destructive/10 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              )}
              onClick={handleSaveToggle}
            >
              <Heart className={cn("mr-2 h-4 w-4", isSaved && "fill-current")} />
              {isSaved ? 'Guardado' : 'Guardar'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={handleShare}
            >
              <Share className="mr-2 h-4 w-4" />
              Compartir
            </Button>
          </div>

          {/* Disclaimer */}
          <div className="text-xs text-muted-foreground text-center pt-4 border-t">
            No se cobran comisiones hasta confirmar la reserva
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActionButtons;