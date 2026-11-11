import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import SearchForm from './SearchForm';

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

  const handleSearch = () => {
    const query = searchQuery.trim();
    if (!query) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setSearchQuery('');
    setIsMenuOpen(false);
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `relative inline-flex h-16 items-center text-[13px] font-medium tracking-wide transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] motion-reduce:transition-none ${
      isActive
        ? 'text-brand-text after:bg-brand-text'
        : 'text-brand-muted after:bg-transparent hover:text-brand-text'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-brand-border bg-brand-canvas">
      <div className="container-page">
        <div className="flex h-16 items-center justify-between gap-3 lg:h-[4.5rem]">
          <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="SoundWave home">
            <span
              aria-hidden="true"
              className="grid h-7 w-7 place-items-center border border-brand-text font-mono text-[10px] font-medium tracking-[0.04em] text-brand-text"
            >
              SW
            </span>
            <span className="display text-lg leading-none text-brand-text sm:text-xl">SoundWave</span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex" aria-label="Primary navigation">
            {navigation.map((item) => (
              <NavLink key={item.to} to={item.to} className={navLinkClasses}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <SearchForm
              id="site-search"
              label="Search SoundWave"
              placeholder="Search library"
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              size="sm"
              className="hidden w-44 lg:block xl:w-56"
            />

            <button
              type="button"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setIsMenuOpen((open) => !open)}
              className="grid h-10 w-10 shrink-0 place-items-center border border-brand-border text-brand-text transition-colors hover:border-brand-border-strong hover:bg-brand-raised md:hidden"
            >
              {isMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
              <span className="sr-only">{isMenuOpen ? 'Close navigation' : 'Open navigation'}</span>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div id="mobile-navigation" className="border-t border-brand-border py-5 md:hidden">
            <SearchForm
              id="mobile-site-search"
              label="Search SoundWave"
              placeholder="Search packs, presets & tools"
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              actionLabel="Search"
              size="md"
              className="mb-5"
            />
            <nav className="border-t border-brand-border" aria-label="Mobile navigation">
              {navigation.map((item, index) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex min-h-14 items-center justify-between border-b border-brand-border text-base transition-colors ${
                      isActive ? 'text-brand-accent' : 'text-brand-subtle hover:text-brand-text'
                    }`
                  }
                >
                  <span>{item.label}</span>
                  <span aria-hidden="true" className="font-mono text-[11px] tracking-[0.16em] text-brand-muted">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
