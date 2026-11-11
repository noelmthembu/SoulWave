import React from 'react';

interface ErrorNoticeProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

const ErrorNotice: React.FC<ErrorNoticeProps> = ({ message, onRetry, className = '' }) => (
  <div
    className={`flex flex-col gap-3 border-l-2 border-brand-error bg-brand-error-soft px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${className}`}
    role="alert"
  >
    <p className="text-sm leading-relaxed text-brand-error">{message}</p>
    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        className="self-start whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.16em] text-brand-error underline decoration-brand-error/40 underline-offset-4 hover:decoration-brand-error sm:self-auto"
      >
        Try again
      </button>
    )}
  </div>
);

export default ErrorNotice;
