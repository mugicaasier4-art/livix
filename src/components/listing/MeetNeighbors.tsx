import { useState } from 'react';
import { Users, MessageCircle, GraduationCap, Clock, Music, BookOpen, Coffee, Dumbbell, Moon, Sun, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// Mock data for neighbors - in production this would come from Supabase
interface Neighbor {
    id: string;
    name: string;
    avatar?: string;
    age: number;
    faculty: string;
    year: string;
    bio: string;
    moveInDate: string;
    lifestyle: {
        sleepSchedule: 'early' | 'late';
        cleanliness: 1 | 2 | 3 | 4 | 5;
        social: 'introvert' | 'ambivert' | 'extrovert';
        studyLocation: 'home' | 'library' | 'both';
        noise: 'silent' | 'moderate' | 'noisy';
    };
    interests: string[];
    compatibility?: number; // 0-100
}

interface MeetNeighborsProps {
    listingId: string;
    listingTitle: string;
    currentOccupants?: number;
    maxOccupants?: number;
}

// Sample neighbors for demo
const sampleNeighbors: Neighbor[] = [
    {
        id: '1',
        name: 'María G.',
        age: 21,
        faculty: 'Medicina',
        year: '3º año',
        bio: 'Busco un ambiente tranquilo para estudiar. Me gusta cocinar y ver series los fines de semana.',
        moveInDate: '2024-09-01',
        lifestyle: {
            sleepSchedule: 'early',
            cleanliness: 4,
            social: 'ambivert',
            studyLocation: 'home',
            noise: 'silent'
        },
        interests: ['Yoga', 'Cocina', 'Series'],
        compatibility: 87
    },
    {
        id: '2',
        name: 'Carlos R.',
        age: 22,
        faculty: 'Ingeniería Informática',
        year: '4º año',
        bio: 'Gamer y programador. Respeto los horarios de silencio. Busco compañeros para estudiar juntos.',
        moveInDate: '2024-09-01',
        lifestyle: {
            sleepSchedule: 'late',
            cleanliness: 3,
            social: 'introvert',
            studyLocation: 'both',
            noise: 'moderate'
        },
        interests: ['Gaming', 'Programación', 'Gym'],
        compatibility: 72
    }
];

const LifestyleIcon = ({ type, value }: { type: string; value: any }) => {
    const icons = {
        sleepSchedule: value === 'early' ? Sun : Moon,
        social: Users,
        studyLocation: value === 'home' ? BookOpen : Coffee,
        noise: Music
    };

    const labels = {
        sleepSchedule: value === 'early' ? 'Madrugador' : 'Noctámbulo',
        cleanliness: `Orden: ${value}/5`,
        social: value === 'introvert' ? 'Introvertido' : value === 'extrovert' ? 'Extrovertido' : 'Ambivertido',
        studyLocation: value === 'home' ? 'Estudia en casa' : value === 'library' ? 'Biblioteca' : 'Flexible',
        noise: value === 'silent' ? 'Silencio' : value === 'moderate' ? 'Moderado' : 'Ambiente'
    };

    const Icon = icons[type as keyof typeof icons] || Users;

    return (
        <Badge variant="secondary" className="gap-1 text-xs">
            <Icon className="h-3 w-3" />
            {labels[type as keyof typeof labels]}
        </Badge>
    );
};

const NeighborCard = ({ neighbor, onMessage }: { neighbor: Neighbor; onMessage: () => void }) => {
    return (
        <Card className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-4">
                <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <Avatar className="h-16 w-16 border-2 border-primary/20">
                        <AvatarImage src={neighbor.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                            {neighbor.name.charAt(0)}
                        </AvatarFallback>
                    </Avatar>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                            <div>
                                <h4 className="font-semibold text-foreground">{neighbor.name}</h4>
                                <p className="text-sm text-muted-foreground">{neighbor.age} años</p>
                            </div>
                            {neighbor.compatibility && (
                                <Badge
                                    className={cn(
                                        "gap-1",
                                        neighbor.compatibility >= 80 ? "bg-success text-success-foreground" :
                                            neighbor.compatibility >= 60 ? "bg-primary text-primary-foreground" :
                                                "bg-muted text-muted-foreground"
                                    )}
                                >
                                    <Sparkles className="h-3 w-3" />
                                    {neighbor.compatibility}%
                                </Badge>
                            )}
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs gap-1">
                                <GraduationCap className="h-3 w-3" />
                                {neighbor.faculty}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{neighbor.year}</span>
                        </div>
                    </div>
                </div>

                {/* Bio */}
                <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                    {neighbor.bio}
                </p>

                {/* Lifestyle */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                    <LifestyleIcon type="sleepSchedule" value={neighbor.lifestyle.sleepSchedule} />
                    <LifestyleIcon type="social" value={neighbor.lifestyle.social} />
                    <LifestyleIcon type="noise" value={neighbor.lifestyle.noise} />
                </div>

                {/* Interests */}
                <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs text-muted-foreground">Intereses:</span>
                    {neighbor.interests.slice(0, 3).map((interest, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                            {interest}
                        </Badge>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2"
                        onClick={onMessage}
                    >
                        <MessageCircle className="h-4 w-4" />
                        Enviar mensaje
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export const MeetNeighbors = ({
    listingId,
    listingTitle,
    currentOccupants = 2,
    maxOccupants = 4
}: MeetNeighborsProps) => {
    const [isOpen, setIsOpen] = useState(false);

    // In production, fetch real neighbors from Supabase
    const neighbors = sampleNeighbors;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                                    <Users className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-foreground">Conoce a tus vecinos</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {currentOccupants} de {maxOccupants} compañeros
                                    </p>
                                </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>

                        {/* Preview avatars */}
                        <div className="flex items-center gap-2 mt-4">
                            <div className="flex -space-x-3">
                                {neighbors.slice(0, 3).map((neighbor, idx) => (
                                    <Avatar key={neighbor.id} className="h-10 w-10 border-2 border-background">
                                        <AvatarImage src={neighbor.avatar} />
                                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                            {neighbor.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                ))}
                            </div>
                            <span className="text-sm text-muted-foreground ml-2">
                                {neighbors.map(n => n.name.split(' ')[0]).join(', ')}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </DialogTrigger>

            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        Tus futuros compañeros
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Occupancy indicator */}
                    <Card className="bg-muted/30">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Ocupación del piso</span>
                                <span className="text-sm text-muted-foreground">
                                    {currentOccupants}/{maxOccupants} habitaciones
                                </span>
                            </div>
                            <Progress value={(currentOccupants / maxOccupants) * 100} className="h-2" />
                            <p className="text-xs text-muted-foreground mt-2">
                                {maxOccupants - currentOccupants} habitación(es) disponible(s)
                            </p>
                        </CardContent>
                    </Card>

                    <Separator />

                    {/* Neighbors list */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-foreground">
                            Ya viven aquí ({neighbors.length})
                        </h3>

                        {neighbors.map((neighbor) => (
                            <NeighborCard
                                key={neighbor.id}
                                neighbor={neighbor}
                                onMessage={() => {
                                    // Navigate to messages or open chat
                                    setIsOpen(false);
                                }}
                            />
                        ))}
                    </div>

                    {/* CTA */}
                    <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="p-4 text-center">
                            <p className="text-sm text-muted-foreground mb-3">
                                ¿Quieres que tus futuros compañeros te conozcan?
                            </p>
                            <Button className="gap-2">
                                <Users className="h-4 w-4" />
                                Crear mi perfil de compañero
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default MeetNeighbors;
