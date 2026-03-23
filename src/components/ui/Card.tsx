'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hoverable?: boolean;
  border?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  glass?: boolean;
  motionProps?: HTMLMotionProps<"div">;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className = "", 
    padding = 'md', 
    hoverable = true, 
    border = true, 
    shadow = 'sm', 
    glass = true, 
    children, 
    motionProps,
    ...props 
  }, ref) => {
    
    const baseStyles = "relative bg-white/70 backdrop-blur-xl border border-slate-100 rounded-2xl transition-all duration-300 z-10";
    
    const paddingStyles: Record<string, string> = {
      none: "p-0",
      sm: "p-5",
      md: "p-7",
      lg: "p-9",
      xl: "p-12",
    };

    const shadowStyles: Record<string, string> = {
      none: "",
      sm: "shadow-sm hover:shadow-md hover:-translate-y-0.5",
      md: "shadow-lg shadow-black/5 hover:shadow-xl hover:-translate-y-1",
      lg: "shadow-xl shadow-black/5 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/5",
    };

    return (
      <div
        ref={ref}
        className={`
          ${baseStyles} 
          ${paddingStyles[padding] || paddingStyles.md} 
          ${hoverable ? shadowStyles[shadow] || shadowStyles.md : ''} 
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export { Card };
