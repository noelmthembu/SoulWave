import React, { lazy, Suspense } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';

const PacksPage = lazy(() => import('./pages/PacksPage'));
const PresetsPage = lazy(() => import('./pages/PresetsPage'));
const PluginsPage = lazy(() => import('./pages/PluginsPage'));
const SearchResultsPage = lazy(() => import('./pages/SearchResultsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const RouteFallback: React.FC = () => (
  <div className="grid min-h-64 place-items-center" role="status" aria-live="polite">
    <p className="text-sm text-brand-muted">Loading page…</p>
  </div>
);

const AppContent: React.FC = () => (
  <div className="flex min-h-screen flex-col bg-brand-canvas text-brand-text antialiased selection:bg-brand-cyan selection:text-brand-ink">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <Header />
    <main id="main-content" className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10" tabIndex={-1}>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/packs" element={<PacksPage />} />
          <Route path="/presets" element={<PresetsPage />} />
          <Route path="/plugins" element={<PluginsPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </main>
    <Footer />
  </div>
);

const App: React.FC = () => (
  <HashRouter>
    <AppContent />
  </HashRouter>
);

export default App;
