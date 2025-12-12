import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, ArrowLeft, MapPin, Users, Eye, Share2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLikes } from '@/hooks/useLikes';
import { useListings } from '@/hooks/useListings';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const Favorites = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { likedListings, isLoading: likesLoading, toggleLike, isLiked } = useLikes();
  const { listings, isLoading: listingsLoading } = useListings();
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const favoriteListings = listings.filter(listing => 
    likedListings.includes(listing.id)
  );

  const isLoading = likesLoading || listingsLoading;

  const handleToggleLike = async (e: React.MouseEvent, listingId: string) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleLike(listingId);
  };

  const handleShare = (e: React.MouseEvent, listingId: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/listing/${listingId}`);
    toast.success('Enlace copiado');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Heart className="h-6 w-6 text-primary fill-primary" />
                Favoritos
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {favoriteListings.length} {favoriteListings.length === 1 ? 'piso guardado' : 'pisos guardados'}
              </p>
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="flex h-full">
                    <Skeleton className="w-[60%] aspect-square" />
                    <div className="w-[40%] p-3 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                      <Skeleton className="h-6 w-1/3" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : favoriteListings.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {favoriteListings.map((listing) => (
                <Card 
                  key={listing.id} 
                  className="overflow-hidden transition-all duration-200 hover:shadow-elevated group cursor-pointer"
                >
                  <Link to={`/listing/${listing.id}`}>
                    <div className="flex h-full">
                      {/* Image - 60% */}
                      <div className="relative w-[60%] aspect-square overflow-hidden flex-shrink-0">
                        <img
                          src={listing.images?.[0] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'}
                          alt={listing.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        
                        {/* Overlay actions */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        <div className="absolute top-2 right-2 flex gap-1">
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-7 w-7 bg-white/90 hover:bg-white"
                            onClick={(e) => handleToggleLike(e, listing.id)}
                          >
                            <Heart className={cn(
                              "h-3 w-3",
                              isLiked(listing.id) && "fill-red-500 text-red-500"
                            )} />
                          </Button>
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-7 w-7 bg-white/90 hover:bg-white"
                            onClick={(e) => handleShare(e, listing.id)}
                          >
                            <Share2 className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Verified badge */}
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-success text-success-foreground text-xs">
                            Verificado
                          </Badge>
                        </div>
                      </div>

                      {/* Content - 40% */}
                      <div className="w-[40%] p-3 space-y-2 flex flex-col justify-between">
                        <div className="space-y-1">
                          <h3 className="font-semibold text-xs leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                            {listing.title}
                          </h3>
                          <div className="flex items-center text-muted-foreground text-[10px]">
                            <MapPin className="h-2.5 w-2.5 mr-0.5" />
                            <span className="truncate">{listing.address}</span>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="font-bold text-base">
                            €{listing.price}<span className="text-xs font-normal text-muted-foreground">/mes</span>
                          </div>

                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Users className="h-2.5 w-2.5" />
                            <span>{listing.bedrooms} hab</span>
                          </div>

                          <div className="flex flex-wrap gap-0.5">
                            {listing.utilities_included && (
                              <Badge variant="outline" className="text-[9px] px-1 py-0">
                                Todo incl.
                              </Badge>
                            )}
                            {listing.is_furnished && (
                              <Badge variant="outline" className="text-[9px] px-1 py-0">
                                Amueblado
                              </Badge>
                            )}
                          </div>
                        </div>

                        <Button size="sm" className="w-full h-7 text-xs">
                          <Eye className="h-3 w-3 mr-1" />
                          Ver
                        </Button>
                      </div>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 space-y-4">
              <Heart className="h-16 w-16 text-muted-foreground mx-auto" />
              <h3 className="text-lg font-medium">No tienes favoritos aún</h3>
              <p className="text-muted-foreground">
                Explora pisos y residencias para guardar tus favoritos
              </p>
              <Button onClick={() => navigate('/explore')}>
                Explorar pisos
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Favorites;
