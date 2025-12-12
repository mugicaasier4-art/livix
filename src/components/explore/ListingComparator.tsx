import { useState } from 'react';
import { X, Check, Minus, MapPin, Bed, Bath, Users, Wifi, Car, Thermometer, Wind, PawPrint } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface CompareListing {
    id: string | number;
    originalId?: string;
    title: string;
    location: string;
    price: number;
    image: string;
    bedrooms?: number;
    bathrooms?: number;
    roommates?: number;
    amenities?: string[];
    verified?: boolean;
    matchScore?: number;
    allInclusive?: boolean;
    furnished?: boolean;
    coordinates?: [number, number];
}

interface ListingComparatorProps {
    listings: CompareListing[];
    onRemove: (id: string | number) => void;
    onClear: () => void;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

const CompareRow = ({
    label,
    values,
    type = 'text',
    icon: Icon
}: {
    label: string;
    values: (string | number | boolean | undefined)[];
    type?: 'text' | 'boolean' | 'price';
    icon?: React.ComponentType<{ className?: string }>;
}) => {
    const bestValue = type === 'price'
        ? Math.min(...values.filter(v => typeof v === 'number') as number[])
        : null;

    return (
        <div className="grid grid-cols-[120px_repeat(3,1fr)] gap-2 py-3 border-b border-muted/50 items-center">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                {Icon && <Icon className="h-4 w-4" />}
                {label}
            </div>
            {values.map((value, idx) => (
                <div
                    key={idx}
                    className={cn(
                        "text-center text-sm font-medium",
                        type === 'price' && value === bestValue && "text-success font-bold"
                    )}
                >
                    {type === 'boolean' ? (
                        value ? (
                            <Check className="h-5 w-5 text-success mx-auto" />
                        ) : (
                            <Minus className="h-5 w-5 text-muted-foreground/50 mx-auto" />
                        )
                    ) : type === 'price' ? (
                        <span className={cn(value === bestValue && "text-success")}>
                            €{value}/mes
                        </span>
                    ) : (
                        value ?? <Minus className="h-4 w-4 text-muted-foreground/50 mx-auto" />
                    )}
                </div>
            ))}
            {/* Fill empty slots */}
            {Array.from({ length: 3 - values.length }).map((_, idx) => (
                <div key={`empty-${idx}`} className="text-center text-muted-foreground/30">
                    —
                </div>
            ))}
        </div>
    );
};

export const ListingComparator = ({
    listings,
    onRemove,
    onClear,
    isOpen,
    onOpenChange
}: ListingComparatorProps) => {
    if (listings.length === 0) return null;

    return (
        <>
            {/* Floating Compare Button */}
            {listings.length > 0 && !isOpen && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4">
                    <Button
                        onClick={() => onOpenChange(true)}
                        className="rounded-full px-6 py-6 shadow-2xl gap-2"
                        size="lg"
                    >
                        <span className="bg-primary-foreground text-primary rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                            {listings.length}
                        </span>
                        Comparar pisos
                    </Button>
                </div>
            )}

            {/* Compare Modal */}
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-4xl max-h-[90vh] p-0">
                    <DialogHeader className="p-6 pb-0 border-b">
                        <div className="flex items-center justify-between">
                            <DialogTitle className="text-xl font-bold">
                                Comparar ({listings.length}/3 pisos)
                            </DialogTitle>
                            <Button variant="ghost" size="sm" onClick={onClear}>
                                Limpiar todo
                            </Button>
                        </div>
                    </DialogHeader>

                    <ScrollArea className="max-h-[70vh]">
                        <div className="p-6">
                            {/* Listing Headers */}
                            <div className="grid grid-cols-[120px_repeat(3,1fr)] gap-2 mb-4">
                                <div />
                                {listings.map((listing) => (
                                    <Card key={listing.id} className="overflow-hidden relative group">
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                            onClick={() => onRemove(listing.id)}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                        <img
                                            src={listing.image}
                                            alt={listing.title}
                                            className="w-full h-28 object-cover"
                                        />
                                        <CardContent className="p-3">
                                            <h4 className="font-semibold text-sm line-clamp-1">{listing.title}</h4>
                                            <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                                                {listing.location}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))}
                                {/* Empty slots */}
                                {Array.from({ length: 3 - listings.length }).map((_, idx) => (
                                    <Card
                                        key={`empty-${idx}`}
                                        className="border-dashed border-2 flex items-center justify-center min-h-[160px] bg-muted/20"
                                    >
                                        <p className="text-sm text-muted-foreground text-center px-4">
                                            Añade otro piso para comparar
                                        </p>
                                    </Card>
                                ))}
                            </div>

                            {/* Comparison Rows */}
                            <div className="space-y-0">
                                <CompareRow
                                    label="Precio"
                                    values={listings.map(l => l.price)}
                                    type="price"
                                />
                                <CompareRow
                                    label="Habitaciones"
                                    values={listings.map(l => l.bedrooms)}
                                    icon={Bed}
                                />
                                <CompareRow
                                    label="Baños"
                                    values={listings.map(l => l.bathrooms)}
                                    icon={Bath}
                                />
                                <CompareRow
                                    label="Compañeros"
                                    values={listings.map(l => l.roommates?.toString() || '0')}
                                    icon={Users}
                                />
                                <CompareRow
                                    label="Verificado"
                                    values={listings.map(l => l.verified)}
                                    type="boolean"
                                />
                                <CompareRow
                                    label="Gastos incl."
                                    values={listings.map(l => l.allInclusive)}
                                    type="boolean"
                                />
                                <CompareRow
                                    label="Amueblado"
                                    values={listings.map(l => l.furnished)}
                                    type="boolean"
                                />
                                <CompareRow
                                    label="WiFi"
                                    values={listings.map(l => l.amenities?.includes('WiFi'))}
                                    type="boolean"
                                    icon={Wifi}
                                />
                                <CompareRow
                                    label="Parking"
                                    values={listings.map(l => l.amenities?.includes('Parking'))}
                                    type="boolean"
                                    icon={Car}
                                />
                                <CompareRow
                                    label="Calefacción"
                                    values={listings.map(l => l.amenities?.includes('Calefacción'))}
                                    type="boolean"
                                    icon={Thermometer}
                                />
                                <CompareRow
                                    label="Aire Acond."
                                    values={listings.map(l => l.amenities?.includes('AC') || l.amenities?.includes('Aire acondicionado'))}
                                    type="boolean"
                                    icon={Wind}
                                />
                                <CompareRow
                                    label="Mascotas"
                                    values={listings.map(l => l.amenities?.includes('Mascotas permitidas'))}
                                    type="boolean"
                                    icon={PawPrint}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-[120px_repeat(3,1fr)] gap-2 mt-6">
                                <div />
                                {listings.map((listing) => (
                                    <Link key={listing.id} to={`/listing/${listing.originalId || listing.id}`}>
                                        <Button className="w-full" size="sm">
                                            Ver detalle
                                        </Button>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </>
    );
};

// Hook to manage comparison state
export const useListingCompare = () => {
    const [compareList, setCompareList] = useState<CompareListing[]>([]);
    const [isCompareOpen, setIsCompareOpen] = useState(false);

    const addToCompare = (listing: CompareListing) => {
        if (compareList.length >= 3) {
            return false;
        }
        if (compareList.find(l => l.id === listing.id)) {
            return false;
        }
        setCompareList(prev => [...prev, listing]);
        return true;
    };

    const removeFromCompare = (id: string | number) => {
        setCompareList(prev => prev.filter(l => l.id !== id));
    };

    const clearCompare = () => {
        setCompareList([]);
        setIsCompareOpen(false);
    };

    const isInCompare = (id: string | number) => {
        return compareList.some(l => l.id === id);
    };

    return {
        compareList,
        isCompareOpen,
        setIsCompareOpen,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare
    };
};

export default ListingComparator;
