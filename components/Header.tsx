import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import Button from './Button';

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/packs?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-full text-sm font-medium transition-all ${
      isActive
        ? 'text-brand-cyan bg-white/5'
        : 'text-brand-muted hover:text-white hover:bg-white/5'
    }`;

  return (
    <header className="bg-brand-dark/80 backdrop-blur-md sticky top-0 z-50 border-b border-white/5">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          <div className="flex items-center gap-6 lg:gap-8 shrink-0">
            <Link to="/" className="flex items-center group">
              <span className="text-2xl font-black tracking-tighter text-white">
                SOUND<span className="text-brand-cyan group-hover:text-cyan-300 transition-colors">WAVE</span>
              </span>
            </Link>
            
            <div className="hidden xl:flex items-center gap-1">
              <NavLink to="/packs" className={navLinkClasses}>Sample Packs</NavLink>
              <NavLink to="/presets" className={navLinkClasses}>Presets</NavLink>
              <NavLink to="/plugins" className={navLinkClasses}>Plugins</NavLink>
              <NavLink to="/contact" className={navLinkClasses}>Contact</NavLink>
            </div>
          </div>

          {/* Global Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md hidden md:flex relative group">
            <input 
              type="text"
              placeholder="Search sounds, presets..."
              className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-5 pr-12 text-sm text-white placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:bg-white/10 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-3 bg-brand-cyan hover:bg-cyan-400 text-brand-dark rounded-full transition-colors flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
              </svg>
            </button>
          </form>

          <div className="flex items-center gap-4 lg:gap-6 shrink-0">
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
              <Button size="sm" variant="secondary" className="border border-white/10 rounded-full">
                Manage
              </Button>
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;