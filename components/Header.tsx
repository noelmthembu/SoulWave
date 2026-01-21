import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import Button from './Button';

const Header: React.FC = () => {
  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-full text-sm font-medium transition-all ${
      isActive
        ? 'text-brand-cyan bg-white/5'
        : 'text-brand-muted hover:text-white hover:bg-white/5'
    }`;

  return (
    <header className="bg-brand-dark/80 backdrop-blur-md sticky top-0 z-50 border-b border-white/5">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center group">
              <span className="text-2xl font-black tracking-tighter text-white">
                SOUND<span className="text-brand-cyan group-hover:text-cyan-300 transition-colors">WAVE</span>
              </span>
            </Link>
            
            <div className="hidden md:flex items-center gap-1">
              <NavLink to="/packs" className={navLinkClasses}>Sample Packs</NavLink>
              <NavLink to="/presets" className={navLinkClasses}>Presets</NavLink>
              <NavLink to="/plugins" className={navLinkClasses}>Plugins</NavLink>
              <NavLink to="/tutorials" className={navLinkClasses}>Tutorials</NavLink>
              <NavLink to="/contact" className={navLinkClasses}>Contact</NavLink>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/5 rounded-full">
               <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-cyan"></span>
              </span>
              <span className="text-[10px] font-black text-brand-cyan uppercase tracking-widest">Live Sync</span>
            </div>
            
            <a 
              href="https://app.hygraph.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden lg:block"
            >
              <Button size="sm" variant="secondary" className="border border-white/10">
                Manage Content
              </Button>
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;