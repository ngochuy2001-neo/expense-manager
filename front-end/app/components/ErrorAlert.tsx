'use client';

type ErrorAlertProps = {
  title?: string;
  message: string;
  onDismiss?: () => void;
  className?: string;
};

export default function ErrorAlert({
  title = 'Có lỗi xảy ra',
  message,
  onDismiss,
  className = '',
}: ErrorAlertProps) {
  return (
    <div
      role="alert"
      className={`rounded-lg border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/50 p-4 text-red-800 dark:text-red-200 ${className}`}
    >
      <div className="flex gap-3">
        <span className="flex-shrink-0 text-red-500 dark:text-red-400" aria-hidden>
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-red-800 dark:text-red-200">{title}</p>
          <p className="mt-1 text-sm text-red-700 dark:text-red-300">{message}</p>
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="flex-shrink-0 rounded p-1 text-red-500 hover:bg-red-200 dark:hover:bg-red-900/50 focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Đóng"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
