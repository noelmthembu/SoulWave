import React, { useState, useEffect } from 'react';
import { getTutorials } from '../services/graphqlService';
import { Tutorial } from '../types';
import TutorialCard from '../components/TutorialCard';

const TutorialsPage: React.FC = () => {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const data = await getTutorials();
      setTutorials(data);
    } catch (err) {
      console.error(err);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(true);
    const interval = setInterval(() => fetchData(false), 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-12 pb-20">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
          Learn from the <span className="text-brand-cyan">Pros</span>
        </h1>
        <p className="text-xl text-brand-muted leading-relaxed">
          Level up your production skills with our curated collection of free masterclasses and tutorials.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1,2,3,4].map(i => <div key={i} className="aspect-video bg-white/5 animate-pulse rounded-3xl"></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {tutorials.map(tutorial => (
            <TutorialCard key={tutorial.id} tutorial={tutorial} />
          ))}
        </div>
      )}

      {tutorials.length === 0 && !loading && (
        <div className="text-center py-20 bg-brand-panel/30 rounded-3xl border border-white/5">
          <p className="text-brand-muted italic">Coming soon: Masterclasses from your favorite artists.</p>
        </div>
      )}
    </div>
  );
};

export default TutorialsPage;