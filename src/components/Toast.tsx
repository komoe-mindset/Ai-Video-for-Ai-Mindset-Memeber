import React from 'react';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { ToastNotification } from '../types';

interface ToastProps {
  toasts: ToastNotification[];
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts }) => {
  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:max-w-sm z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900/95 border border-emerald-500/40 text-emerald-200 text-xs shadow-2xl backdrop-blur-md transition-all duration-300 transform translate-y-0 font-medium font-burmese"
        >
          {toast.type === 'warning' ? (
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          ) : toast.type === 'info' ? (
            <Info className="w-4 h-4 text-blue-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span className="flex-1 leading-snug">{toast.message}</span>
        </div>
      ))}
    </div>
  );
};
