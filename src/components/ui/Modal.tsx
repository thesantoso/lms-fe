import React, { useEffect, useRef } from 'react';
import { X } from '@phosphor-icons/react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  mobileMode?: 'sheet' | 'fullscreen';
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  className,
  size = 'md',
  mobileMode = 'sheet',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-full sm:max-w-md',
    md: 'max-w-full sm:max-w-lg',
    lg: 'max-w-full sm:max-w-2xl',
    xl: 'max-w-full sm:max-w-4xl',
    full: 'max-w-full',
  };

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity z-[-1]" 
        onClick={onClose}
        aria-hidden="true"
      />
      <div 
        ref={modalRef}
        className={cn(
          "relative bg-white shadow-xl w-full flex flex-col transition-all transform",
          mobileMode === 'fullscreen'
            ? "h-[100dvh] max-h-[100dvh] rounded-none"
            : "h-auto max-h-[85dvh] rounded-t-2xl",
          "sm:h-auto sm:max-h-[90vh] sm:rounded-xl",
          sizeClasses[size],
          className
        )}
        role="dialog"
        aria-modal="true"
      >
        {mobileMode === 'sheet' && (
          <div className="sm:hidden flex items-center justify-center pt-2">
            <div className="h-1.5 w-12 rounded-full bg-neutral-300" />
          </div>
        )}
        {(title || subtitle) && (
          <div className="flex items-start justify-between p-4 sm:p-6 border-b border-neutral-100">
            <div>
              {title && <h2 className="text-xl font-bold text-neutral-900">{title}</h2>}
              {subtitle && <p className="text-sm text-neutral-500 mt-1">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-500 p-1 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        )}
        
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-[calc(env(safe-area-inset-bottom)+16px)]">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
