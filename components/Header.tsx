
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import Button from './Button';

const Header: React.FC = () => {
  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-brand-cyan text-brand-dark'
        : 'text-gray-300 hover:bg-brand-light-dark hover:text-white'
    }`;

  return (
    <header className="bg-brand-light-dark/50 backdrop-blur-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-white">Sound<span className="text-brand-cyan">Wave</span></span>
            </Link>
            <div className="hidden sm:block sm:ml-6">
              <div className="flex space-x-4">
                <NavLink to="/" className={navLinkClasses} end>Sample Packs</NavLink>
                <NavLink to="/tutorials" className={navLinkClasses}>Tutorials</NavLink>
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
             {/* This link should point to your Hygraph project dashboard */}
            <a href="https://app.hygraph.com/" target="_blank" rel="noopener noreferrer">
              <Button>Manage Content</Button>
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;