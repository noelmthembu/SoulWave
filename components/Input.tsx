import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
  containerClassName?: string;
};

const Input: React.FC<InputProps> = ({ label, id, hint, error, containerClassName = '', className = '', required, ...props }) => {
  const hintId = hint && id ? `${id}-hint` : undefined;
  const errorId = error && id ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={containerClassName}>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-brand-text">
        {label}{required && <span aria-hidden="true"> *</span>}
      </label>
      {hint && <p id={hintId} className="mb-2 text-xs leading-5 text-brand-muted">{hint}</p>}
      <input
        id={id}
        required={required}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={describedBy}
        className={`min-h-12 w-full rounded-lg border border-brand-border bg-brand-canvas px-3 py-3 text-base text-brand-text placeholder:text-brand-muted focus:border-brand-cyan focus:outline-none ${error ? 'border-red-300 focus:border-red-300' : ''} ${className}`}
        {...props}
      />
      {error && <p id={errorId} className="mt-2 text-sm text-brand-error" role="alert">{error}</p>}
    </div>
  );
};

export default Input;
