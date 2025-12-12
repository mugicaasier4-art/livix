import { motion, PanInfo, useAnimation } from 'framer-motion';
import { ReactNode, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

interface MobileDrawerProps {
  children: ReactNode;
  peekHeight?: number;
}

const MobileDrawer = ({ children, peekHeight = 120 }: MobileDrawerProps) => {
  const controls = useAnimation();
  const maxHeight = typeof window !== 'undefined' ? window.innerHeight * 0.85 : 500;

  useEffect(() => {
    controls.start({ y: 0 });
  }, [controls]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 50;
    const velocity = info.velocity.y;
    
    // Use setTimeout to ensure this runs after component update
    setTimeout(() => {
      // If dragging down with enough force, collapse to peek
      if (info.offset.y > threshold || velocity > 500) {
        controls.start({ y: 0 });
      }
      // If dragging up with enough force, expand fully
      else if (info.offset.y < -threshold || velocity < -500) {
        controls.start({ y: -(maxHeight - peekHeight) });
      }
      // Otherwise snap to nearest state
      else {
        const currentY = info.point.y;
        const midpoint = window.innerHeight - (maxHeight + peekHeight) / 2;
        
        if (currentY > midpoint) {
          controls.start({ y: 0 });
        } else {
          controls.start({ y: -(maxHeight - peekHeight) });
        }
      }
    }, 0);
  };

  return (
    <motion.div
      drag="y"
      dragConstraints={{ top: -(maxHeight - peekHeight), bottom: 0 }}
      dragElastic={0.1}
      onDragEnd={handleDragEnd}
      animate={controls}
      initial={{ y: 0 }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed bottom-0 left-0 right-0 z-[60] bg-background rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.15)]"
      style={{
        height: maxHeight,
        touchAction: 'none',
        willChange: 'transform',
      }}
    >
      {/* Drag Handle */}
      <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
        <div className="flex flex-col items-center gap-1">
          <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full" />
          <ChevronUp className="w-5 h-5 text-muted-foreground/50" />
        </div>
      </div>

      {/* Content */}
      <div className="overflow-y-auto h-[calc(100%-48px)] px-4 pb-4">
        {children}
      </div>
    </motion.div>
  );
};

export default MobileDrawer;
