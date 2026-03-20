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
    glass = false, 
    children, 
    motionProps,
    ...props 
  }, ref) => {
    
    const baseStyles = "relative bg-white border border-[#e5e7eb] rounded-xl transition-all duration-200";
    
    const paddingStyles: Record<string, string> = {
      none: "p-0",
      sm: "p-4",
      md: "p-5",
      lg: "p-8",
      xl: "p-10",
    };

    const shadowStyles: Record<string, string> = {
      none: "",
      sm: "shadow-sm hover:shadow-md hover:border-gray-300",
      md: "shadow-md hover:shadow-lg",
      lg: "shadow-lg",
    };

    return (
      <div
        ref={ref}
        className={`
          ${baseStyles} 
          ${paddingStyles[padding] || paddingStyles.md} 
          ${shadowStyles[shadow] || shadowStyles.sm} 
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
