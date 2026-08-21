import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'quiet' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-4 font-semibold transition-colors motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-55';

  const variantClasses = {
    primary: 'border-brand-cyan bg-brand-cyan text-brand-ink hover:border-brand-cyan-strong hover:bg-brand-cyan-strong',
    secondary: 'border-brand-border bg-brand-raised text-brand-text hover:border-brand-cyan hover:bg-brand-raised/80',
    quiet: 'border-transparent bg-transparent text-brand-subtle hover:bg-brand-raised hover:text-brand-text',
    danger: 'border-red-300/45 bg-red-950/50 text-red-100 hover:bg-red-950',
  };

  const sizeClasses = {
    sm: 'min-h-10 px-3 text-sm',
    md: 'min-h-11 px-4 text-sm',
    lg: 'min-h-12 px-5 text-base',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading && (
        <svg className="h-4 w-4 animate-spin" aria-hidden="true" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
          <path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
