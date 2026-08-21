import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => (
  <footer className="border-t border-brand-border bg-brand-surface">
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 text-sm sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
      <div>
        <p className="font-bold tracking-tight text-brand-text">SOUND<span className="text-brand-cyan">WAVE</span></p>
        <p className="mt-1 text-xs sm:text-sm text-brand-muted">A focused sound library for producers building their next track.</p>
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-brand-subtle">
        <Link to="/packs" className="hover:text-brand-cyan transition-colors">Packs</Link>
        <Link to="/presets" className="hover:text-brand-cyan transition-colors">Presets</Link>
        <Link to="/plugins" className="hover:text-brand-cyan transition-colors">Plugins</Link>
        <Link to="/contact" className="hover:text-brand-cyan transition-colors">Contact</Link>
      </div>
      <p className="text-xs text-brand-muted">© {new Date().getFullYear()} SoundWave Samples.</p>
    </div>
  </footer>
);

export default Footer;
