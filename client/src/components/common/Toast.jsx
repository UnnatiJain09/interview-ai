import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ type = 'info', message = '', onClose }) => {
  if (!message) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500" />,
    info: <Info className="w-5 h-5 text-brand-500" />,
  };

  const bgStyles = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/80 dark:border-emerald-800 dark:text-emerald-200',
    error: 'bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-950/80 dark:border-rose-800 dark:text-rose-200',
    info: 'bg-brand-50 border-brand-200 text-brand-900 dark:bg-brand-950/80 dark:border-brand-800 dark:text-brand-200',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md animate-bounce-short">
      <div className={`flex items-start p-4 rounded-xl border shadow-lg ${bgStyles[type] || bgStyles.info}`}>
        <div className="flex-shrink-0 mt-0.5 mr-3">{icons[type] || icons.info}</div>
        <div className="text-sm font-medium pr-2 flex-1">{message}</div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Toast;
