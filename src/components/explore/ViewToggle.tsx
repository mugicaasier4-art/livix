import { Button } from "@/components/ui/button";
import { List, Map, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

export type ViewMode = 'list' | 'map' | 'swipe';

interface ViewToggleProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

const ViewToggle = ({ currentView, onViewChange }: ViewToggleProps) => {
  // Primary views (map and swipe) - prominent
  const primaryViews = [
    { value: 'map' as ViewMode, icon: Map, label: 'Mapa' },
    { value: 'swipe' as ViewMode, icon: Layers, label: 'Swipe' },
  ];

  return (
    <div className="flex items-center gap-2" data-tour="view-toggle">
      {/* Primary toggle: Map & Swipe */}
      <div className="flex rounded-full border bg-background p-1 shadow-sm">
        {primaryViews.map((view) => (
          <Button
            key={view.value}
            variant={currentView === view.value ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange(view.value)}
            className={cn(
              "gap-2 rounded-full px-4 transition-all",
              currentView === view.value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "hover:bg-muted"
            )}
          >
            <view.icon className="h-4 w-4" />
            <span>{view.label}</span>
          </Button>
        ))}
      </div>

      {/* Secondary option: List - smaller */}
      <Button
        variant={currentView === 'list' ? "secondary" : "ghost"}
        size="sm"
        onClick={() => onViewChange('list')}
        className={cn(
          "gap-1.5 text-xs h-8 px-3",
          currentView === 'list'
            ? "bg-muted text-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <List className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Ver lista</span>
      </Button>
    </div>
  );
};

export default ViewToggle;
