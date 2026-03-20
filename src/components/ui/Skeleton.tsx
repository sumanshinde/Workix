'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ 
    className = "", 
    variant = 'rectangular', 
    width, 
    height, 
    animation = 'pulse', 
    style,
    ...props 
  }, ref) => {
    
    const baseStyles = "bg-gray-100 overflow-hidden relative";
    
    const variantStyles = {
      text: "h-3 w-full rounded-md mt-2 mb-2",
      rectangular: "rounded-xl",
      circular: "rounded-full shrink-0",
    };

    const pulseAnimation = animation === 'pulse' ? "animate-pulse" : "";
    
    const waveAnimation = animation === 'wave' ? (
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 from-transparent via-white/40 to-transparent"
      />
    ) : null;

    return (
      <div
        ref={ref}
        className={`
          ${baseStyles} 
          ${variantStyles[variant]} 
          ${pulseAnimation} 
          ${className}
        `}
        style={{ width, height, ...style }}
        {...props}
      >
        {waveAnimation}
      </div>
    );
  }
);

Skeleton.displayName = 'Skeleton';

export { Skeleton };
