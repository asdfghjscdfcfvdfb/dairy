import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const styles = {
    success: 'bg-emerald-600 text-white shadow-emerald-200/50',
    error: 'bg-rose-600 text-white shadow-rose-200/50',
    info: 'bg-blue-600 text-white shadow-blue-200/50',
    warning: 'bg-amber-600 text-white shadow-amber-200/50'
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-100" />,
    error: <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-100" />,
    info: <Info className="w-5 h-5 flex-shrink-0 text-blue-100" />,
    warning: <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-100" />
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div className={`flex items-start gap-3 px-4 py-3.5 rounded-xl shadow-xl ${styles[toast.type || 'info']} transition-all`}>
        {icons[toast.type || 'info']}
        <div className="flex-1 pr-2">
          {toast.title && <div className="font-semibold text-sm leading-tight">{toast.title}</div>}
          <div className="text-xs text-white/90 mt-0.5 leading-relaxed">{toast.message}</div>
        </div>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
