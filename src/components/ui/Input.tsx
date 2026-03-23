'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  hint?: string;
  containerClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className = "", 
    label, 
    error, 
    leftIcon, 
    rightIcon, 
    hint,
    containerClassName = "",
    id,
    disabled = false,
    ...props 
  }, ref) => {
    
    // 48px height, rounded-xl, gray-50 bg, blue border focus with glow
    const baseInputStyles = "w-full h-12 bg-slate-50 border border-slate-100 text-slate-900 rounded-xl px-4 text-[15px] font-medium transition-all duration-200 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 placeholder:text-slate-400 disabled:bg-slate-100 disabled:text-slate-400 disabled:pointer-events-none shadow-sm shadow-black/5";
    const errorInputStyles = "border-red-500 focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/15";
    const iconInputPadding = `${leftIcon ? 'pl-11' : ''} ${rightIcon ? 'pr-11' : ''}`;

    return (
      <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
        {label && (
          <label 
            htmlFor={id} 
            className="text-[13px] font-bold text-slate-600 pl-0.5"
          >
            {label}
          </label>
        )}
        
        <div className="relative group">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none">
              {React.cloneElement(leftIcon as React.ReactElement, { size: 18 })}
            </div>
          )}
          
          <input
            ref={ref}
            id={id}
            disabled={disabled}
            className={`
              ${baseInputStyles} 
              ${iconInputPadding} 
              ${error ? errorInputStyles : ''} 
              ${className}
            `}
            {...props}
          />
          
          {rightIcon && (
            <div className={`absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors ${props.type === 'button' ? 'cursor-pointer' : 'pointer-events-none'}`}>
              {React.cloneElement(rightIcon as React.ReactElement, { size: 18 })}
            </div>
          )}
        </div>
        
        {error ? (
          <p className="text-[12px] font-bold text-red-500 pl-1">{error}</p>
        ) : hint ? (
          <p className="text-[12px] font-medium text-slate-500 pl-1">{hint}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
