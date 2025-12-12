import { Shield } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';

interface VerificationBadgeProps {
  isVerified?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const VerificationBadge = ({ isVerified, size = 'md' }: VerificationBadgeProps) => {
  if (!isVerified) return null;

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Shield 
              className={`${sizeClasses[size]} text-primary fill-primary/20`}
              aria-label="Usuario verificado"
            />
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Usuario verificado</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
