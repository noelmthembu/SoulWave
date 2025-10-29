
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-light-dark mt-12">
      <div className="container mx-auto py-6 px-4 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} SoundWave Samples. All rights reserved.</p>
        <p className="text-sm mt-1">Crafted for creators, by creators.</p>
      </div>
    </footer>
  );
};

export default Footer;
