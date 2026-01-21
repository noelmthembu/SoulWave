import React, { useState, useEffect, useMemo } from 'react';
import { getSamplePacks, getGenres } from '../services/graphqlService';
import { SamplePack, Genre } from '../types';
import SamplePackCard from '../components/SamplePackCard';
import ContentModal from '../components/ContentModal';
import Input from '../components/Input';

const PacksPage: React.FC = () => {
  const [packs, setPacks] = useState<SamplePack[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedPack, setSelectedPack] = useState<SamplePack | null>(null);

  const fetchData = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const [p, g] = await Promise.all([getSamplePacks(), getGenres()]);
      setPacks(p);
      setGenres(g);
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

  const filteredPacks = useMemo(() => {
    return packs.filter(p => {
      const genreNames = p.genre || [];
      const matchesGenre = selectedGenre === 'All' || genreNames.includes(selectedGenre);
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesGenre && matchesSearch;
    });
  }, [packs, selectedGenre, searchTerm]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-6 justify-between items-end">
        <div>
          <h1 className="text-4xl font-black mb-2">Sample Packs</h1>
          <p className="text-brand-muted">The ultimate library of royalty-free loops and hits.</p>
        </div>
        <div className="w-full md:w-80">
          <Input 
            label=""
            placeholder="Search packs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {['All', ...genres.map(g => g.name)].map(genre => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all border ${
              selectedGenre === genre 
                ? 'bg-brand-cyan text-brand-dark border-brand-cyan' 
                : 'bg-white/5 text-brand-muted border-white/10 hover:border-white/20'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-72 bg-white/5 animate-pulse rounded-2xl"></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredPacks.map(pack => (
            <SamplePackCard 
              key={pack.id} 
              pack={pack} 
              onViewDetails={() => setSelectedPack(pack)} 
            />
          ))}
        </div>
      )}

      {selectedPack && (
        <ContentModal 
          item={selectedPack} 
          onClose={() => setSelectedPack(null)} 
        />
      )}
    </div>
  );
};

export default PacksPage;