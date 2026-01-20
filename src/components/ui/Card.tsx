import React from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated';
}

const Card: React.FC<CardProps> = ({ 
  className, 
  variant = 'default',
  children,
  ...props 
}) => {
  const variants = {
    default: 'bg-white border border-neutral-200',
    bordered: 'bg-white border-2 border-neutral-300',
    elevated: 'bg-white shadow-md',
  };

  return (
    <div
      className={cn('rounded-lg', variants[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<HTMLAttributes<HTMLDivElement>> = ({ 
  className, 
  children,
  ...props 
}) => {
  return (
    <div
      className={cn('px-6 py-4 border-b border-neutral-200', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardBody: React.FC<HTMLAttributes<HTMLDivElement>> = ({ 
  className, 
  children,
  ...props 
}) => {
  return (
    <div
      className={cn('px-6 py-4', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardFooter: React.FC<HTMLAttributes<HTMLDivElement>> = ({ 
  className, 
  children,
  ...props 
}) => {
  return (
    <div
      className={cn('px-6 py-4 border-t border-neutral-200 bg-neutral-50', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
