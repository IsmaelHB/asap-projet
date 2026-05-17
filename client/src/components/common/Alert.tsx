import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

type AlertType = 'error' | 'success' | 'info' | 'warning';

interface AlertProps {
  type?: AlertType;
  title?: string;
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string; 
}

export default function Alert({
  type = 'info',
  title,
  message,
  dismissible = false,
  onDismiss,
  className = '',
}: AlertProps) {
  const baseClasses = 'rounded-lg p-4 flex items-start text-sm';

  const variants: Record<AlertType, string> = {
    error: 'bg-red-50 border border-red-200 text-red-800',
    success: 'bg-green-50 border border-green-200 text-green-800',
    info: 'bg-blue-50 border border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border border-yellow-200 text-yellow-800',
  };

  const Icon =
    type === 'error'
      ? AlertCircle
      : type === 'success'
      ? CheckCircle2
      : type === 'warning'
      ? AlertTriangle
      : Info;

  return (
    <div className={`${baseClasses} ${variants[type]} ${className}`}>
      <Icon className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        {title && <p className="font-semibold mb-1">{title}</p>}
        <p className="text-sm">{message}</p>
      </div>
      {dismissible && (
        <button
          type="button"
          onClick={onDismiss}
          className="ml-3 text-xs opacity-75 hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}