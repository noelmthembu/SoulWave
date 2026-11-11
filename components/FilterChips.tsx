import React from 'react';

interface FilterChipsProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  action?: React.ReactNode;
}

const FilterChips: React.FC<FilterChipsProps> = ({ label, options, value, onChange, action }) => (
  <section aria-label={label}>
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
      <h2 className="eyebrow">{label}</h2>
      {action}
    </div>
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const selected = option === value;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={selected}
            className={`min-h-10 rounded-none border px-3 py-1.5 text-[13px] font-medium transition-colors ${
              selected
                ? 'border-brand-text bg-brand-text text-brand-canvas'
                : 'border-brand-border bg-transparent text-brand-subtle hover:border-brand-border-strong hover:text-brand-text'
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  </section>
);

export default FilterChips;
