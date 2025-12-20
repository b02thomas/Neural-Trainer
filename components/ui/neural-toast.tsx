'use client';

import { useState, useEffect, createContext, useContext, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { Activity, Check, AlertTriangle, Zap } from 'lucide-react';

type ToastType = 'link' | 'success' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextValue {
  show: (message: string, type?: ToastType, duration?: number) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useNeuralToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useNeuralToast must be used within a NeuralToastProvider');
  }
  return context;
}

interface NeuralToastProviderProps {
  children: ReactNode;
}

export function NeuralToastProvider({ children }: NeuralToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((message: string, type: ToastType = 'info', duration: number = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ show, dismiss }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  useEffect(() => {
    if (toast.duration) {
      const timer = setTimeout(() => {
        onDismiss(toast.id);
      }, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, onDismiss]);

  const icons = {
    link: Activity,
    success: Check,
    warning: AlertTriangle,
    info: Zap,
  };

  const typeClasses = {
    link: 'neural-toast-link',
    success: 'neural-toast-success',
    warning: 'border-yellow-500/40 shadow-yellow-500/20',
    info: '',
  };

  const iconColors = {
    link: 'text-cyan-400',
    success: 'text-green-400',
    warning: 'text-yellow-400',
    info: 'text-purple-400',
  };

  const Icon = icons[toast.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.95 }}
      className={cn(
        'neural-toast px-4 py-3 flex items-center gap-3 pointer-events-auto cursor-pointer min-w-[280px]',
        typeClasses[toast.type]
      )}
      onClick={() => onDismiss(toast.id)}
    >
      <div className={cn('flex-shrink-0', iconColors[toast.type])}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">{toast.message}</p>
      </div>
      <div className="w-1 h-8 rounded-full overflow-hidden bg-white/10">
        <motion.div
          className={cn(
            'w-full',
            toast.type === 'link' ? 'bg-cyan-400' :
            toast.type === 'success' ? 'bg-green-400' :
            toast.type === 'warning' ? 'bg-yellow-400' :
            'bg-purple-400'
          )}
          initial={{ height: '100%' }}
          animate={{ height: '0%' }}
          transition={{ duration: (toast.duration || 3000) / 1000, ease: 'linear' }}
        />
      </div>
    </motion.div>
  );
}
