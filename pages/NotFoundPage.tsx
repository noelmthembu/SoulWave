
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-extrabold text-brand-cyan">404</h1>
      <h2 className="mt-4 text-3xl font-bold text-white">Page Not Found</h2>
      <p className="mt-4 text-lg text-gray-400">Sorry, the page you are looking for does not exist.</p>
      <Link to="/" className="mt-8 inline-block bg-brand-cyan text-brand-dark font-bold py-3 px-6 rounded-md hover:bg-cyan-300 transition-colors">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
