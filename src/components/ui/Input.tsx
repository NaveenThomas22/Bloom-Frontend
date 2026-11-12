import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, type = 'text', className = '', id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
    const generatedId = React.useId();
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}-${generatedId}` : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium text-sage-900 dark:text-sage-200">
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {icon && (
            <span className="absolute left-3.5 text-sage-500 dark:text-dark-muted pointer-events-none">
              {icon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            type={inputType}
            className={`w-full px-4 py-3 rounded-2xl bg-white/90 dark:bg-dark-surface border text-sm text-sage-950 dark:text-dark-text placeholder:text-sage-400 dark:placeholder:text-dark-muted focus:outline-none focus:ring-2 transition-all duration-200 ${
              icon ? 'pl-10' : ''
            } ${isPassword ? 'pr-11' : ''} ${
              error
                ? 'border-rose-dark focus:ring-rose-dark/30 focus:border-rose-dark'
                : 'border-sage-200/80 dark:border-dark-border focus:ring-sage-400/50 focus:border-sage-400'
            } ${className}`}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 p-1 text-sage-500 hover:text-forest dark:text-dark-muted dark:hover:text-sage-200 transition-colors focus:outline-none"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
        </div>

        {error ? (
          <p className="text-xs text-rose-dark font-medium pl-1">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-sage-600 dark:text-dark-muted pl-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

