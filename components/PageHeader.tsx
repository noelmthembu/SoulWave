import React from 'react';

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}

/** Shared page masthead: eyebrow, serif title, description and an optional action slot. */
const PageHeader: React.FC<PageHeaderProps> = ({ eyebrow, title, description, children }) => (
  <header className="border-b border-brand-border pb-7 sm:pb-9">
    <p className="eyebrow">{eyebrow}</p>
    <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
      <div className="min-w-0 max-w-2xl">
        <h1 className="display text-[2rem] leading-[1.05] text-brand-text sm:text-4xl lg:text-5xl">{title}</h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-brand-muted sm:text-base">{description}</p>
      </div>
      {children && <div className="w-full shrink-0 lg:w-[22rem]">{children}</div>}
    </div>
  </header>
);

export default PageHeader;
