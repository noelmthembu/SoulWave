import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description, action }) => (
  <section className="border border-dashed border-brand-border px-6 py-12 text-center">
    <p className="eyebrow">No results</p>
    <h2 className="display mt-2 text-2xl leading-tight text-brand-text">{title}</h2>
    <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-brand-muted">{description}</p>
    {action && <div className="mt-5 flex justify-center">{action}</div>}
  </section>
);

export default EmptyState;
