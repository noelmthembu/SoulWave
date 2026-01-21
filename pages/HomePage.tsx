import React, { useState, useEffect } from 'react';
import { getSamplePacks, getGenres } from '../services/graphqlService';
import { SamplePack, Genre } from '../types';
import SamplePackCard from '../components/SamplePackCard';
import ContentModal from '../components/ContentModal';
import { useNavigate } from 'react-router-dom';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="relative overflow-hidden py-24 px-6 text-center bg-gradient-to-b from-brand-panel to-brand-dark rounded-3xl border border-white/5 mb-16">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-cyan/10 blur-[120px] rounded-full -z-10"></div>
      <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
        Craft Your <span className="text-brand-cyan">Signature Sound</span>
      </h1>
      <p className="text-xl text-brand-muted max-w-2xl mx-auto mb-10 leading-relaxed">
        Discover thousands of royalty-free sample packs, presets, loops, and tutorials to elevate your productions. All completely free.
      </p>
      <button 
        onClick={() => navigate('/packs')}
        className="bg-brand-cyan hover:bg-cyan-400 text-brand-dark font-black px-10 py-4 rounded-full text-lg shadow-xl shadow-brand-cyan/20 transition-all transform hover:scale-105 active:scale-95"
      >
        Explore Packs
      </button>
    </div>
  );
};

const HomePage: React.FC = () => {
  const [packs, setPacks] = useState<SamplePack[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPack, setSelectedPack] = useState<SamplePack | null>(null);

  const fetchData = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const [pData, gData] = await Promise.all([getSamplePacks(), getGenres()]);
      setPacks(pData.filter(p => p.featured));
      setGenres(gData);
    } catch (err) {
      console.error(err);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(true);
    // Polling every 10 seconds for real-time updates from Hygraph
    const interval = setInterval(() => fetchData(false), 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pb-20">
      <Hero />
      
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <span className="w-2 h-8 bg-brand-cyan rounded-full"></span>
            Featured Collections
          </h2>
          <span className="text-[10px] text-brand-muted font-black uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">Updates Real-Time</span>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-64 bg-white/5 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {packs.map(pack => (
              <SamplePackCard 
                key={pack.id} 
                pack={pack} 
                onViewDetails={() => setSelectedPack(pack)} 
              />
            ))}
          </div>
        )}
      </div>

      <div className="bg-brand-panel/50 border border-white/5 rounded-3xl p-8 text-center">
        <h3 className="text-xl font-bold mb-4">Browse by Genre</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {genres.map(genre => (
            <button 
              key={genre.id}
              className="px-6 py-2 rounded-full bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors border border-white/5"
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>

      {selectedPack && (
        <ContentModal 
          item={selectedPack} 
          onClose={() => setSelectedPack(null)} 
        />
      )}
    </div>
  );
};

export default HomePage;