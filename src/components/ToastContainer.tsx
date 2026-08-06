import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useToasts, dismissToast } from '../lib/toastStore';
import type { Toast } from '../lib/toastStore';

const ICON_MAP = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
} as const;

const COLOR_MAP: Record<string, string> = {
  success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
  error: 'bg-destructive/10 border-destructive/30 text-destructive',
  info: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
  warning: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
};

/** Individual toast item. Auto-dismisses after duration. */
function ToastItem({ toast }: { toast: Toast }) {
  const Icon = ICON_MAP[toast.type];

  useEffect(() => {
    const dur = toast.duration ?? 4000;
    const timer = setTimeout(() => dismissToast(toast.id), dur);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration]);

  return (
    <div
      className={`flex items-start gap-2.5 px-3.5 py-2.5 rounded-lg border backdrop-blur-md ${COLOR_MAP[toast.type]} shadow-lg animate-slide-up`}
      role="alert"
    >
      <Icon className="w-4 h-4 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold">{toast.title}</p>
        {toast.message && (
          <p className="text-[10px] opacity-80 mt-0.5 leading-relaxed">{toast.message}</p>
        )}
      </div>
      <button
        onClick={() => dismissToast(toast.id)}
        className="p-0.5 rounded opacity-50 hover:opacity-100 transition-opacity shrink-0"
        aria-label="Dismiss"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

/** Toast container — renders all active toasts in a stack. */
export function ToastContainer() {
  const toasts = useToasts();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} />
        </div>
      ))}
    </div>
  );
}