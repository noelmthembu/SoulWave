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
  type = 'button',
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 rounded-none border font-medium transition-colors duration-150 motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-50';

  const variantClasses = {
    primary: 'border-brand-accent bg-brand-accent text-brand-on-accent hover:border-brand-accent-strong hover:bg-brand-accent-strong',
    secondary: 'border-brand-border-strong bg-transparent text-brand-text hover:bg-brand-raised',
    quiet: 'border-transparent bg-transparent text-brand-muted hover:bg-brand-raised hover:text-brand-text',
    danger: 'border-brand-error/40 bg-brand-error-soft text-brand-error hover:border-brand-error hover:bg-brand-error hover:text-brand-on-accent',
  };

  const sizeClasses = {
    sm: 'min-h-10 px-3 text-[13px]',
    md: 'min-h-11 px-4 text-sm',
    lg: 'min-h-12 px-5 text-sm sm:px-6 sm:text-base',
  };

  return (
    <button
      type={type}
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
