import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  XCircle, 
  X, 
  ShoppingCart, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  action?: ToastAction;
  duration?: number;
  icon?: React.ReactNode;
}

interface ToastContextValue {
  showToast: (toast: Omit<ToastItem, 'id'>) => string;
  success: (message: string, title?: string, action?: ToastAction) => string;
  info: (message: string, title?: string, action?: ToastAction) => string;
  warning: (message: string, title?: string, action?: ToastAction) => string;
  error: (message: string, title?: string, action?: ToastAction) => string;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((toastData: Omit<ToastItem, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const duration = toastData.duration ?? 3800;

    const newToast: ToastItem = {
      ...toastData,
      id,
      duration
    };

    setToasts((prev) => [...prev.slice(-3), newToast]); // Keep maximum 4 toasts on screen

    if (duration > 0) {
      setTimeout(() => {
        dismissToast(id);
      }, duration);
    }

    return id;
  }, [dismissToast]);

  const success = useCallback((message: string, title?: string, action?: ToastAction) => {
    return showToast({
      type: 'success',
      title: title || 'Sucesso',
      message,
      action
    });
  }, [showToast]);

  const info = useCallback((message: string, title?: string, action?: ToastAction) => {
    return showToast({
      type: 'info',
      title: title || 'Informação',
      message,
      action
    });
  }, [showToast]);

  const warning = useCallback((message: string, title?: string, action?: ToastAction) => {
    return showToast({
      type: 'warning',
      title: title || 'Atenção',
      message,
      action
    });
  }, [showToast]);

  const error = useCallback((message: string, title?: string, action?: ToastAction) => {
    return showToast({
      type: 'error',
      title: title || 'Erro',
      message,
      action
    });
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, info, warning, error, dismissToast }}>
      {children}
      
      {/* Toast Container fixed on bottom-right for desktop and top-center/bottom-center for mobile */}
      <div 
        id="toast-notifications-container"
        className="fixed bottom-4 right-4 left-4 sm:left-auto sm:right-6 sm:bottom-6 z-[9999] flex flex-col gap-2.5 pointer-events-none max-w-sm sm:max-w-md w-auto"
        aria-live="polite"
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: -10, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="pointer-events-auto w-full bg-[#08182B] text-white rounded-xl shadow-2xl border border-neutral-700/80 overflow-hidden flex flex-col backdrop-blur-md"
            >
              <div className="p-3.5 flex items-start gap-3">
                {/* Status Icon */}
                <div className="flex-shrink-0 mt-0.5">
                  {toast.type === 'success' && (
                    <div className="w-8 h-8 rounded-lg bg-[#72BF44]/20 border border-[#72BF44]/40 flex items-center justify-center text-[#72BF44]">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  )}
                  {toast.type === 'info' && (
                    <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
                      <Info className="w-5 h-5" />
                    </div>
                  )}
                  {toast.type === 'warning' && (
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                  )}
                  {toast.type === 'error' && (
                    <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                      <XCircle className="w-5 h-5" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-1">
                  {toast.title && (
                    <h4 className="text-xs font-bold text-neutral-100 flex items-center gap-1.5 leading-tight">
                      <span>{toast.title}</span>
                    </h4>
                  )}
                  <p className="text-xs text-neutral-300 mt-0.5 leading-snug break-words">
                    {toast.message}
                  </p>

                  {/* Optional Action Button */}
                  {toast.action && (
                    <button
                      onClick={() => {
                        toast.action?.onClick();
                        dismissToast(toast.id);
                      }}
                      className="mt-2 text-[11px] font-bold text-[#72BF44] hover:text-[#88d956] hover:underline flex items-center gap-1 transition-colors active:scale-95"
                    >
                      <span>{toast.action.label}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Close Button */}
                <button
                  onClick={() => dismissToast(toast.id)}
                  className="flex-shrink-0 p-1 text-neutral-400 hover:text-white rounded-md hover:bg-white/10 transition-colors"
                  aria-label="Fechar notificação"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Progress Bar */}
              {toast.duration && toast.duration > 0 ? (
                <div className="w-full bg-white/10 h-0.5 overflow-hidden">
                  <motion.div
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: toast.duration / 1000, ease: 'linear' }}
                    className={`h-full ${
                      toast.type === 'success' 
                        ? 'bg-[#72BF44]' 
                        : toast.type === 'warning' 
                        ? 'bg-amber-400' 
                        : toast.type === 'error' 
                        ? 'bg-rose-400' 
                        : 'bg-sky-400'
                    }`}
                  />
                </div>
              ) : null}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
