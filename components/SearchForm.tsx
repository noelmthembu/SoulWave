import React from 'react';
import { Search } from 'lucide-react';

interface SearchFormProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  /** When set, a visible submit button sits beside the field. Omit for a compact inline field. */
  actionLabel?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: { field: 'min-h-10 pl-9 text-sm', icon: 'left-3 h-4 w-4', submit: 'right-1 h-8 w-8', action: 'min-h-10 px-4 text-[13px]' },
  md: { field: 'min-h-11 pl-10 text-sm', icon: 'left-3.5 h-4 w-4', submit: 'right-1 h-9 w-9', action: 'min-h-11 px-5 text-sm' },
  lg: { field: 'min-h-12 pl-11 text-base', icon: 'left-4 h-5 w-5', submit: 'right-1 h-10 w-10', action: 'min-h-12 px-6 text-sm' },
};

const SearchForm: React.FC<SearchFormProps> = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  onSearch,
  actionLabel,
  size = 'md',
  className = '',
}) => {
  const s = sizes[size];

  return (
    <form
      role="search"
      className={className}
      onSubmit={(event) => {
        event.preventDefault();
        onSearch();
      }}
    >
      <label className="sr-only" htmlFor={id}>{label}</label>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
        <div className="relative min-w-0 flex-1">
          <Search className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-brand-muted ${s.icon}`} aria-hidden="true" />
          <input
            id={id}
            type="search"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            className={`w-full rounded-none border border-brand-border bg-brand-surface py-2 text-brand-text placeholder:text-brand-muted/80 transition-colors hover:border-brand-border-strong focus:border-brand-accent focus:outline-none ${s.field} ${actionLabel ? 'pr-3' : 'pr-12'}`}
          />
          {!actionLabel && (
            <button
              type="submit"
              className={`absolute top-1/2 grid -translate-y-1/2 place-items-center text-brand-muted transition-colors hover:text-brand-text ${s.submit}`}
              aria-label={label}
            >
              <Search className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
        {actionLabel && (
          <button
            type="submit"
            className={`shrink-0 rounded-none border border-brand-accent bg-brand-accent font-medium text-brand-on-accent transition-colors hover:border-brand-accent-strong hover:bg-brand-accent-strong ${s.action}`}
          >
            {actionLabel}
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchForm;
