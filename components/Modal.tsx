'use client';

import { useEffect } from 'react';

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
  show?: boolean;
}

export default function Modal({ title, children, onClose, show = true }: ModalProps) {
  useEffect(() => {
    const closeOnEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white text-black rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div>{children}</div>
        {onClose && (
          <button
            className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-xl"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        )}
      </div>
    </div>
  );
}
