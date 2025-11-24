import { cn } from '@/lib/utils';
import React from 'react';

interface GradientTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'p';
  className?: string;
}

export const GradientText: React.FC<GradientTextProps> = ({ text, as: Component = 'span', className }) => {
  return (
    <Component
      className={cn(
        // Base styles
        "bg-clip-text text-transparent bg-gradient-to-b",
        
        // LIGHT MODE: Dark Grey to Lighter Grey
        "from-neutral-900 to-neutral-500",
        
        // DARK MODE: White to Transparent White
        "dark:from-white dark:to-white/40",
        
        // Allow overriding classes via props
        className
      )}
    >
      {text}
    </Component>
  );
};