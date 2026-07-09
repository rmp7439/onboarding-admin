import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

const TOAST_STYLES = {
  error: 'border-red-200 text-red-800',
  success: 'border-emerald-200 text-emerald-800',
  info: 'border-blue-200 text-blue-800'
};

const TOAST_ICONS = {
  success: <CheckCircle className="h-5 w-5 text-emerald-500" />,
  error: <AlertCircle className="h-5 w-5 text-red-500" />,
  info: <Info className="h-5 w-5 text-blue-500" />
};

export function Toaster() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center justify-between space-x-4 rounded-lg p-4 shadow-lg border bg-white min-w-[300px] animate-in slide-in-from-bottom-5 fade-in duration-200 ${TOAST_STYLES[toast.type]}`}
        >
          <div className="flex items-center space-x-3">
            {TOAST_ICONS[toast.type]}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
          <button onClick={() => removeToast(toast.id)} className="text-gray-400 hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}