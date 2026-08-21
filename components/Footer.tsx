import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => (
  <footer className="border-t border-brand-border bg-brand-surface">
    <div className="mx-auto flex w-full max-w-[90rem] flex-col gap-5 px-4 py-8 text-sm sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
      <div>
        <p className="font-bold tracking-[-0.02em] text-brand-text">SOUND<span className="text-brand-cyan">WAVE</span></p>
        <p className="mt-1 text-brand-muted">A focused library for producers building their next track.</p>
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-2 text-brand-subtle">
        <Link to="/packs" className="hover:text-brand-cyan">Packs</Link>
        <Link to="/presets" className="hover:text-brand-cyan">Presets</Link>
        <Link to="/plugins" className="hover:text-brand-cyan">Plugins</Link>
        <Link to="/contact" className="hover:text-brand-cyan">Contact</Link>
      </div>
      <p className="text-xs text-brand-muted">© {new Date().getFullYear()} SoundWave Samples.</p>
    </div>
  </footer>
);

export default Footer;
