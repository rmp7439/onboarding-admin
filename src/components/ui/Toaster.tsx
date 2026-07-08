import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

export function Toaster() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center justify-between space-x-4 rounded-lg p-4 shadow-lg border bg-white min-w-[300px] animate-in slide-in-from-bottom-5 fade-in duration-200 ${
            toast.type === 'error' ? 'border-red-200 text-red-800' :
            toast.type === 'success' ? 'border-emerald-200 text-emerald-800' :
            'border-blue-200 text-blue-800'
          }`}
        >
          <div className="flex items-center space-x-3">
            {toast.type === 'success' && <CheckCircle className="h-5 w-5 text-emerald-500" />}
            {toast.type === 'error' && <AlertCircle className="h-5 w-5 text-red-500" />}
            {toast.type === 'info' && <Info className="h-5 w-5 text-blue-500" />}
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