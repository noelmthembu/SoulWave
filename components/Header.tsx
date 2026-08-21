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

  const mobileNavLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex min-h-12 items-center rounded-lg px-3.5 text-base font-semibold transition-colors ${
      isActive
        ? 'bg-brand-raised text-brand-cyan'
        : 'text-brand-subtle hover:bg-brand-raised/60 hover:text-brand-text'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-brand-border bg-brand-canvas/95 backdrop-blur-md">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8" aria-label="Primary navigation">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="shrink-0 text-xl font-black tracking-tight text-brand-text sm:text-2xl" aria-label="SoundWave home">
            SOUND<span className="text-brand-cyan">WAVE</span>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            {navigation.map((item) => (
              <NavLink key={item.to} to={item.to} className={navLinkClasses}>
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <form onSubmit={handleSearch} className="hidden w-56 lg:block xl:w-72">
              <label className="sr-only" htmlFor="site-search">Search SoundWave</label>
              <div className="relative">
                <input
                  id="site-search"
                  type="search"
                  placeholder="Search packs & tools..."
                  className="h-10 w-full rounded-lg border border-brand-border bg-brand-surface py-2 pl-3 pr-10 text-sm text-brand-text placeholder:text-brand-muted focus:border-brand-cyan focus:outline-none"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
                <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-md text-brand-muted hover:bg-brand-raised hover:text-brand-text" aria-label="Run search">
                  <Search className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </form>

            <Button
              type="button"
              variant="secondary"
              className="h-10 w-10 p-0 md:hidden shrink-0"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              {isMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
              <span className="sr-only">{isMenuOpen ? 'Close navigation' : 'Open navigation'}</span>
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div id="mobile-navigation" className="border-t border-brand-border py-4 md:hidden">
            <form onSubmit={handleSearch} className="mb-4">
              <label className="sr-only" htmlFor="mobile-site-search">Search SoundWave</label>
              <div className="relative">
                <input
                  id="mobile-site-search"
                  type="search"
                  placeholder="Search packs, presets & tools..."
                  className="min-h-12 w-full rounded-lg border border-brand-border bg-brand-surface py-3 pl-3 pr-12 text-base text-brand-text placeholder:text-brand-muted focus:border-brand-cyan focus:outline-none"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
                <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-md text-brand-muted hover:bg-brand-raised hover:text-brand-text" aria-label="Run search">
                  <Search className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </form>
            <div className="grid grid-cols-2 gap-2">
              {navigation.map((item) => (
                <NavLink key={item.to} to={item.to} className={mobileNavLinkClasses} onClick={() => setIsMenuOpen(false)}>
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
