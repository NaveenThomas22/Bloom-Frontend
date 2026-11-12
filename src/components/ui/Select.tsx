import React from 'react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string | number; label: string }>;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', id, ...props }, ref) => {
    const generatedId = React.useId();
    const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}-${generatedId}` : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-medium text-sage-900 dark:text-sage-200">
            {label}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={`w-full px-4 py-3 rounded-2xl bg-white/90 dark:bg-dark-surface border text-sm text-sage-950 dark:text-dark-text focus:outline-none focus:ring-2 appearance-none transition-all duration-200 cursor-pointer ${
              error
                ? 'border-rose-dark focus:ring-rose-dark/30 focus:border-rose-dark'
                : 'border-sage-200/80 dark:border-dark-border focus:ring-sage-400/50 focus:border-sage-400'
            } ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none text-sage-500">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>

        {error && <p className="text-xs text-rose-dark font-medium pl-1">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

