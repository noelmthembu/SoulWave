import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => (
  <div className="mx-auto max-w-md py-16 text-center sm:py-24">
    <p className="eyebrow">Error 404</p>
    <h1 className="display mt-3 text-4xl leading-tight text-brand-text sm:text-5xl">Page not found</h1>
    <p className="mt-3 text-sm leading-relaxed text-brand-muted sm:text-base">
      The page you are looking for does not exist or has moved.
    </p>
    <Link
      to="/"
      className="mt-7 inline-flex min-h-11 items-center justify-center border border-brand-accent bg-brand-accent px-5 text-sm font-medium text-brand-on-accent transition-colors hover:border-brand-accent-strong hover:bg-brand-accent-strong"
    >
      Back to the library
    </Link>
  </div>
);

export default NotFoundPage;
