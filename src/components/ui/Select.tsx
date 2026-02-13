import React from 'react';
import { cn } from '@/lib/utils';
import { CaretDown } from '@phosphor-icons/react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  options: SelectOption[];
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, error, size = 'md', placeholder, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            className={cn(
              "appearance-none w-full rounded-lg border border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-500 transition-colors",
              {
                'h-9 px-3 text-sm': size === 'sm',
                'h-11 px-4 text-base': size === 'md',
                'h-14 px-4 text-lg': size === 'lg',
              },
              error && "border-danger-500 focus:ring-danger-500",
              className
            )}
            ref={ref}
            {...props}
          >
            {placeholder && (
              <option value="" disabled selected>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-neutral-500">
            <CaretDown size={16} />
          </div>
        </div>
        {error && (
          <p className="mt-1 text-sm text-danger-600">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
