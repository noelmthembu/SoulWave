import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, Search, X } from 'lucide-react';
import Button from './Button';

const navigation = [
  { to: '/packs', label: 'Packs' },
  { to: '/presets', label: 'Presets' },
  { to: '/plugins', label: 'Plugins' },
  { to: '/contact', label: 'Contact' },
];

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setSearchQuery('');
    setIsMenuOpen(false);
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `inline-flex min-h-11 items-center border-b-2 px-1 text-sm font-semibold transition-colors motion-reduce:transition-none ${
      isActive
        ? 'border-brand-cyan text-brand-text'
        : 'border-transparent text-brand-muted hover:border-brand-border hover:text-brand-text'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-brand-border bg-brand-canvas/95">
      <nav className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8" aria-label="Primary navigation">
        <div className="flex min-h-16 items-center justify-between gap-3">
          <Link to="/" className="shrink-0 text-lg font-extrabold tracking-[-0.04em] text-brand-text sm:text-xl" aria-label="SoundWave home">
            SOUND<span className="text-brand-cyan">WAVE</span>
          </Link>

          <div className="hidden items-center gap-5 lg:flex">
            {navigation.map((item) => (
              <NavLink key={item.to} to={item.to} className={navLinkClasses}>
                {item.label}
              </NavLink>
            ))}
          </div>

          <form onSubmit={handleSearch} className="hidden w-full max-w-xs lg:block">
            <label className="sr-only" htmlFor="site-search">Search SoundWave</label>
            <div className="relative">
              <input
                id="site-search"
                type="search"
                placeholder="Search packs and tools"
                className="min-h-11 w-full rounded-lg border border-brand-border bg-brand-surface py-2 pl-3 pr-11 text-sm text-brand-text placeholder:text-brand-muted focus:border-brand-cyan focus:outline-none"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
              <button type="submit" className="absolute right-1 top-1 grid h-9 w-9 place-items-center rounded-md text-brand-muted hover:bg-brand-raised hover:text-brand-text" aria-label="Run search">
                <Search className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </form>

          <Button
            type="button"
            variant="secondary"
            className="min-h-11 shrink-0 px-3 lg:hidden"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            <span className="sr-only">{isMenuOpen ? 'Close navigation' : 'Open navigation'}</span>
          </Button>
        </div>

        {isMenuOpen && (
          <div id="mobile-navigation" className="border-t border-brand-border py-3 lg:hidden">
            <form onSubmit={handleSearch} className="mb-3">
              <label className="sr-only" htmlFor="mobile-site-search">Search SoundWave</label>
              <div className="relative">
                <input
                  id="mobile-site-search"
                  type="search"
                  placeholder="Search packs and tools"
                  className="min-h-12 w-full rounded-lg border border-brand-border bg-brand-surface py-3 pl-3 pr-12 text-base text-brand-text placeholder:text-brand-muted focus:border-brand-cyan focus:outline-none"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
                <button type="submit" className="absolute right-1 top-1 grid h-10 w-10 place-items-center rounded-md text-brand-muted hover:bg-brand-raised hover:text-brand-text" aria-label="Run search">
                  <Search className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </form>
            <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
              {navigation.map((item) => (
                <NavLink key={item.to} to={item.to} className={navLinkClasses} onClick={() => setIsMenuOpen(false)}>
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
