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
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  className,
  size = 'md',
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
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full m-4',
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />
      <div 
        ref={modalRef}
        className={cn(
          "relative bg-white rounded-xl shadow-xl w-full max-h-[90vh] flex flex-col transition-all transform",
          sizeClasses[size],
          className
        )}
        role="dialog"
        aria-modal="true"
      >
        {(title || subtitle) && (
          <div className="flex items-start justify-between p-6 border-b border-neutral-100">
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
        
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
