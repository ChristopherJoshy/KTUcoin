import React, { createContext, useContext, useCallback, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, XCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/cn';

type ToastVariant = 'success' | 'error' | 'info' | 'warning';

interface ToastItem {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastContextType {
  toast: (title: string, options?: { description?: string; variant?: ToastVariant }) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let toastIdCounter = 0;

const VARIANT_META: Record<ToastVariant, { icon: React.ReactNode; ring: string }> = {
  success: {
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
    ring: 'border-emerald-200 dark:border-emerald-900'
  },
  error: {
    icon: <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />,
    ring: 'border-red-200 dark:border-red-900'
  },
  info: {
    icon: <Info className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
    ring: 'border-teal-200 dark:border-teal-900'
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
    ring: 'border-amber-200 dark:border-amber-900'
  }
};

// this function is used for global toast notification provider replacing native alert dialogs for more info refer code-wiki.md line 134
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback(
    (title: string, options?: { description?: string; variant?: ToastVariant }) => {
      const id = ++toastIdCounter;
      const item: ToastItem = {
        id,
        title,
        description: options?.description,
        variant: options?.variant || 'info'
      };
      setToasts(prev => [...prev, item]);
      setTimeout(() => dismiss(id), 4000);
    },
    [dismiss]
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Toast Stack */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-sm flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map(t => {
            const meta = VARIANT_META[t.variant];
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: -16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.97 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  'pointer-events-auto bg-white dark:bg-slate-900 border rounded-2xl shadow-zen-lg p-4 flex items-start gap-3',
                  meta.ring
                )}
              >
                <div className="shrink-0 mt-0.5">{meta.icon}</div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                    {t.title}
                  </p>
                  {t.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {t.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => dismiss(t.id)}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors p-0.5 shrink-0"
                  aria-label="Dismiss notification"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

// this function is used for consuming toast notification hook for more info refer code-wiki.md line 135
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
