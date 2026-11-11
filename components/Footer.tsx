import React from 'react';
import { Link } from 'react-router-dom';

const links = [
  { to: '/packs', label: 'Sample packs' },
  { to: '/presets', label: 'Presets' },
  { to: '/plugins', label: 'Plugins' },
  { to: '/contact', label: 'Contact' },
];

const Footer: React.FC = () => (
  <footer className="border-t border-brand-border bg-brand-canvas">
    <div className="container-page grid gap-8 py-10 sm:py-12 md:grid-cols-[1.5fr_1fr_auto] md:gap-12">
      <div>
        <p className="display text-lg leading-none text-brand-text">SoundWave</p>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-brand-muted">
          A focused sound library for producers building their next track.
        </p>
      </div>

      <nav aria-label="Footer navigation">
        <h2 className="eyebrow">Catalogue</h2>
        <ul className="mt-3 space-y-2">
          {links.map((link) => (
            <li key={link.to}>
              <Link to={link.to} className="text-sm text-brand-subtle transition-colors hover:text-brand-accent">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand-muted md:text-right">
        © {new Date().getFullYear()} SoundWave Samples
      </p>
    </div>
  </footer>
);

export default Footer;
