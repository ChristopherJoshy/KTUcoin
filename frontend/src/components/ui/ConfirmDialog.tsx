import React, { createContext, useContext, useCallback, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/cn';

interface ConfirmOptions {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'primary' | 'danger';
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

interface PendingState extends ConfirmOptions {
  resolve: (value: boolean) => void;
}

// this function is used for global confirm dialog provider replacing native window.confirm for more info refer code-wiki.md line 136
export const ConfirmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pending, setPending] = useState<PendingState | null>(null);
  const pendingRef = useRef<PendingState | null>(null);

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise(resolve => {
      const state: PendingState = { ...options, resolve };
      pendingRef.current = state;
      setPending(state);
    });
  }, []);

  const settle = useCallback((result: boolean) => {
    pendingRef.current?.resolve(result);
    pendingRef.current = null;
    setPending(null);
  }, []);

  const value = useMemo(() => ({ confirm }), [confirm]);

  return (
    <ConfirmContext.Provider value={value}>
      {children}

      <AnimatePresence>
        {pending && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
            <motion.div
              className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => settle(false)}
            />

            <motion.div
              role="alertdialog"
              aria-modal="true"
              className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-zen-lg p-6"
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-start gap-3 mb-3">
                <div
                  className={cn(
                    'p-2.5 rounded-xl shrink-0',
                    pending.tone === 'danger'
                      ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400'
                      : 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400'
                  )}
                >
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-bold font-display text-slate-900 dark:text-slate-50 leading-snug">
                    {pending.title}
                  </h3>
                  {pending.message && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {pending.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => settle(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-colors"
                >
                  {pending.cancelLabel || 'Cancel'}
                </button>
                <button
                  onClick={() => settle(true)}
                  className={cn(
                    'flex-1 py-2.5 px-4 rounded-xl text-white font-bold text-sm transition-all',
                    pending.tone === 'danger'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-teal-700 hover:bg-teal-800'
                  )}
                >
                  {pending.confirmLabel || 'Confirm'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ConfirmContext.Provider>
  );
};

// this function is used for consuming confirm dialog hook for more info refer code-wiki.md line 137
export const useConfirm = (): ConfirmContextType => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
};
