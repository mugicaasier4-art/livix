import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

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
}

interface CompareContextType {
    compareList: CompareListing[];
    isCompareOpen: boolean;
    setIsCompareOpen: (open: boolean) => void;
    addToCompare: (listing: CompareListing) => boolean;
    removeFromCompare: (id: string | number) => void;
    clearCompare: () => void;
    isInCompare: (id: string | number) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider = ({ children }: { children: ReactNode }) => {
    const [compareList, setCompareList] = useState<CompareListing[]>([]);
    const [isCompareOpen, setIsCompareOpen] = useState(false);

    const addToCompare = useCallback((listing: CompareListing) => {
        if (compareList.length >= 3) {
            return false;
        }
        if (compareList.find(l => l.id === listing.id)) {
            return false;
        }
        setCompareList(prev => [...prev, listing]);
        return true;
    }, [compareList]);

    const removeFromCompare = useCallback((id: string | number) => {
        setCompareList(prev => prev.filter(l => l.id !== id));
    }, []);

    const clearCompare = useCallback(() => {
        setCompareList([]);
        setIsCompareOpen(false);
    }, []);

    const isInCompare = useCallback((id: string | number) => {
        return compareList.some(l => l.id === id);
    }, [compareList]);

    return (
        <CompareContext.Provider value={{
            compareList,
            isCompareOpen,
            setIsCompareOpen,
            addToCompare,
            removeFromCompare,
            clearCompare,
            isInCompare
        }}>
            {children}
        </CompareContext.Provider>
    );
};

export const useCompare = () => {
    const context = useContext(CompareContext);
    if (!context) {
        throw new Error('useCompare must be used within a CompareProvider');
    }
    return context;
};

export default CompareContext;
