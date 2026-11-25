import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose, duration = 5000 }) => {
  // Automatically dismiss system messages after 5 seconds
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, onClose, duration]);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed top-5 right-5 z-50 px-5 py-3.5 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-3 transition-all duration-300 animate-in fade-in slide-in-from-top-3 ${
        type === 'success'
          ? 'bg-[#176B78] text-white border border-[#125560]'
          : 'bg-[#FF6B55] text-white border border-[#e55a45]'
      }`}
    >
      {type === 'success' ? (
        <CheckCircle2 className="w-5 h-5 shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 shrink-0" />
      )}
      <span className="max-w-xs">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 hover:opacity-75 transition cursor-pointer p-0.5 rounded-lg"
        aria-label="Fechar"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
