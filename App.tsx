
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import TutorialsPage from './pages/TutorialsPage';
import NotFoundPage from './pages/NotFoundPage';

const AppContent: React.FC = () => {
  return (
    <div className="bg-brand-dark text-brand-text min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tutorials" element={<TutorialsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
};

const App: React.FC = () => {
  return (
      <HashRouter>
        <AppContent />
      </HashRouter>
  );
};

export default App;
