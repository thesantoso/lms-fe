import React from 'react';
import { cn } from '@/lib/utils';

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, checked, onChange, disabled, ...props }, ref) => {
    return (
      <label className={cn("inline-flex items-center cursor-pointer", disabled && "cursor-not-allowed opacity-50")}>
        <input
          type="checkbox"
          className="sr-only peer"
          ref={ref}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          {...props}
        />
        <div className={cn(
          "relative w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600",
          className
        )}></div>
        {label && <span className="ms-3 text-sm font-medium text-neutral-900">{label}</span>}
      </label>
    );
  }
);

Switch.displayName = "Switch";

export default Switch;
