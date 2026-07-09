import { createContext, useState, useCallback, type ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  timerId?: ReturnType<typeof setTimeout>;
}

interface ToastContextType {
  toasts: Toast[];
  toast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    
    // Start the 5-second timer immediately when the toast is called
    const timerId = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);

    // Save the timerId with the toast so it can be cleared if manually closed
    setToasts((prev) => [...prev, { id, message, type, timerId }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => {
      const toastToRemove = prev.find(t => t.id === id);
      // Clear the timeout to prevent memory leaks or misfires
      if (toastToRemove?.timerId) {
        clearTimeout(toastToRemove.timerId);
      }
      return prev.filter((t) => t.id !== id);
    });
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}