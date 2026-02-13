import React, { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { Check } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const checkboxId = id || (label ? `checkbox-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);

    return (
      <div className="inline-flex items-center gap-2">
        <div className="relative flex items-center justify-center">
          <input
            type="checkbox"
            id={checkboxId}
            ref={ref}
            className={cn(
              // Base styles
              "peer h-5 w-5 appearance-none rounded border border-neutral-300 bg-white cursor-pointer shrink-0 transition-all",
              // Interactive states
              "hover:border-blue-500 hover:bg-neutral-50",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
              // Checked state
              "checked:bg-[#2563EB] checked:border-[#2563EB] checked:hover:bg-blue-700",
              // Disabled state
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-100",
              className
            )}
            {...props}
          />
          <Check 
            weight="bold" 
            className="pointer-events-none absolute h-3.5 w-3.5 text-white opacity-0 transition-opacity peer-checked:opacity-100" 
          />
        </div>
        
        {label && (
          <label
            htmlFor={checkboxId}
            className="text-sm text-neutral-600 cursor-pointer select-none font-medium hover:text-neutral-900 transition-colors"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
