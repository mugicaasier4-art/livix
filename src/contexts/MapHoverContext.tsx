import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface MapHoverContextType {
  hoveredListingId: number | null;
  selectedListingId: number | null;
  visitedListingIds: Set<number>;
  setHoveredListingId: (id: number | null) => void;
  setSelectedListingId: (id: number | null) => void;
  markAsVisited: (id: number) => void;
  scrollToListing: (id: number) => void;
  listingRefs: React.MutableRefObject<Map<number, HTMLElement>>;
}

const MapHoverContext = createContext<MapHoverContextType | null>(null);

export const useMapHover = () => {
  const context = useContext(MapHoverContext);
  if (!context) {
    throw new Error('useMapHover must be used within a MapHoverProvider');
  }
  return context;
};

export const MapHoverProvider = ({ children }: { children: ReactNode }) => {
  const [hoveredListingId, setHoveredListingId] = useState<number | null>(null);
  const [selectedListingId, setSelectedListingId] = useState<number | null>(null);
  const [visitedListingIds, setVisitedListingIds] = useState<Set<number>>(new Set());
  const listingRefs = React.useRef<Map<number, HTMLElement>>(new Map());

  const markAsVisited = useCallback((id: number) => {
    setVisitedListingIds(prev => new Set([...prev, id]));
  }, []);

  const scrollToListing = useCallback((id: number) => {
    const element = listingRefs.current.get(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  return (
    <MapHoverContext.Provider
      value={{
        hoveredListingId,
        selectedListingId,
        visitedListingIds,
        setHoveredListingId,
        setSelectedListingId,
        markAsVisited,
        scrollToListing,
        listingRefs,
      }}
    >
      {children}
    </MapHoverContext.Provider>
  );
};
