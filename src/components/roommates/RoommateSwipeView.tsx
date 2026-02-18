import { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, X, MapPin, Calendar, GraduationCap, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type MockRoommate } from '@/data/mockRoommates';

interface RoommateSwipeViewProps {
    profiles: (MockRoommate & { _compat: number })[];
    onLike: (id: string) => void;
    onPass?: (id: string) => void;
}

const RoommateSwipeView = ({ profiles, onLike, onPass }: RoommateSwipeViewProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    const currentProfile = profiles[currentIndex];
    const nextProfile = profiles[currentIndex + 1];

    const handleSwipe = (direction: 'left' | 'right') => {
        setSwipeDirection(direction);

        // Ejecutar acción después de la animación
        setTimeout(() => {
            if (direction === 'right') {
                onLike(currentProfile.id);
            } else if (onPass) {
                onPass(currentProfile.id);
            }

            if (currentIndex < profiles.length) {
                setCurrentIndex(prev => prev + 1);
            }
            setSwipeDirection(null);
        }, 300);
    };

    const handleReset = () => {
        setCurrentIndex(0);
    };

    if (!currentProfile) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center h-[500px] border-2 border-dashed rounded-3xl bg-muted/20">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <Sparkles className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">¡Has visto todos los perfiles!</h3>
                <p className="text-muted-foreground mb-8 text-lg max-w-sm">
                    No hay más resultados con tus filtros actuales. Prueba a cambiar los filtros o vuelve a empezar.
                </p>
                <Button onClick={handleReset} size="lg" className="rounded-full px-8">
                    <RotateCcw className="mr-2 h-5 w-5" />
                    Volver a empezar
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto relative px-4">
            {/* Stack Effect (Next Card) */}
            <div className="relative h-[600px] w-full">
                {nextProfile && (
                    <Card className="absolute top-4 inset-x-4 bottom-0 transform scale-95 opacity-60 -rotate-2 rounded-3xl border-0 shadow-lg bg-white overflow-hidden pointer-events-none z-0">
                        <div className="h-full w-full bg-muted" />
                    </Card>
                )}

                {/* Current Card */}
                <Card
                    ref={cardRef}
                    className={cn(
                        "absolute inset-0 z-10 rounded-3xl border-0 shadow-2xl overflow-hidden transition-all duration-500 ease-out bg-white",
                        swipeDirection === 'left' && "transform -translate-x-[150%] -rotate-12 opacity-0",
                        swipeDirection === 'right' && "transform translate-x-[150%] rotate-12 opacity-0"
                    )}
                >
                    {/* Image Section */}
                    <div className="relative h-[65%] w-full overflow-hidden group">
                        <img
                            src={currentProfile.image}
                            alt={currentProfile.name}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                        {/* Top Badges */}
                        <div className="absolute top-4 left-4 flex gap-2">
                            <Badge className={cn(
                                "border-0 text-xs font-bold shadow-md backdrop-blur-md",
                                currentProfile._compat >= 80 ? "bg-green-500/90 text-white" :
                                    currentProfile._compat >= 60 ? "bg-amber-500/90 text-white" : "bg-gray-500/90 text-white"
                            )}>
                                {currentProfile._compat}% Compatible
                            </Badge>
                            {currentProfile.verified && (
                                <Badge className="bg-blue-500/90 backdrop-blur-md text-white border-0 text-[10px] font-bold gap-1 shadow-md">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Verificado
                                </Badge>
                            )}
                        </div>

                        {/* Name & Age Overlay */}
                        <div className="absolute bottom-4 left-4 text-white">
                            <h2 className="text-3xl font-black drop-shadow-md flex items-end gap-2">
                                {currentProfile.name}
                                <span className="text-xl font-medium opacity-90 mb-1">{currentProfile.age}</span>
                            </h2>
                            <div className="flex items-center gap-1.5 text-white/90 font-medium text-sm drop-shadow-sm">
                                <GraduationCap className="h-4 w-4" />
                                {currentProfile.studies}
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <CardContent className="h-[35%] p-5 flex flex-col justify-between">
                        <div>
                            {/* Info Rows */}
                            <div className="flex gap-4 mb-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                    <div className="p-1.5 bg-primary/10 rounded-full text-primary">
                                        <MapPin className="h-3.5 w-3.5" />
                                    </div>
                                    <span className="font-medium text-foreground">{currentProfile.location}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="p-1.5 bg-primary/10 rounded-full text-primary">
                                        <Calendar className="h-3.5 w-3.5" />
                                    </div>
                                    <span className="font-medium text-foreground">{currentProfile.moveDate}</span>
                                </div>
                            </div>

                            {/* Bio */}
                            <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                                {currentProfile.bio}
                            </p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1.5 mt-3">
                                {currentProfile.tags.slice(0, 3).map((tag, i) => (
                                    <Badge key={i} variant="secondary" className="text-[10px] px-2">
                                        {tag}
                                    </Badge>
                                ))}
                                {currentProfile.tags.length > 3 && (
                                    <Badge variant="outline" className="text-[10px] px-2">
                                        +{currentProfile.tags.length - 3}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-6 mt-8">
                <Button
                    size="lg"
                    variant="outline"
                    className="w-16 h-16 rounded-full border-2 border-destructive/20 text-destructive bg-white hover:bg-destructive hover:text-white hover:border-destructive shadow-lg hover:shadow-destructive/30 hover:-translate-y-1 transition-all duration-300"
                    onClick={() => handleSwipe('left')}
                    disabled={swipeDirection !== null}
                >
                    <X className="h-8 w-8" />
                </Button>

                <Button
                    size="lg"
                    className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-200 hover:shadow-green-300 hover:-translate-y-1 transition-all duration-300 border-4 border-white"
                    onClick={() => handleSwipe('right')}
                    disabled={swipeDirection !== null}
                >
                    <Heart className="h-8 w-8 fill-current" />
                </Button>
            </div>

            <div className="text-center mt-4 text-xs font-medium text-muted-foreground/60 uppercase tracking-widest">
                Desliza para conectar
            </div>
        </div>
    );
};

export default RoommateSwipeView;
