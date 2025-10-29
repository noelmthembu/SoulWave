
import React from 'react';
import { MOCK_TUTORIALS } from '../constants';
import TutorialCard from '../components/TutorialCard';

const TutorialsPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Learn from the <span className="text-brand-cyan">Best</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
          Level up your production skills with our curated collection of free tutorials from industry professionals.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {MOCK_TUTORIALS.map(tutorial => (
          <TutorialCard key={tutorial.id} tutorial={tutorial} />
        ))}
      </div>
    </div>
  );
};

export default TutorialsPage;
