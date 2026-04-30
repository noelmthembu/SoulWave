import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getSamplePacks, getGenres } from '../services/graphqlService';
import { SamplePack, Genre } from '../types';
import ContentCard from '../components/ContentCard';
import ContentModal from '../components/ContentModal';
import Button from '../components/Button';

const PacksPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('q') || '';
  
  const [packs, setPacks] = useState<SamplePack[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [inputValue, setInputValue] = useState(initialSearch);
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

  // Update search when URL params change
  useEffect(() => {
    const q = searchParams.get('q') || '';
    setInputValue(q);
  }, [searchParams]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (inputValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(inputValue.trim())}`);
    }
  };

  const filteredPacks = useMemo(() => {
    return packs.filter(p => {
      const genreNames = p.genre || [];
      const matchesGenre = selectedGenre === 'All' || genreNames.includes(selectedGenre);
      
      const searchLower = inputValue.toLowerCase();
      const matchesSearch = 
        p.name.toLowerCase().includes(searchLower) || 
        (p.description && p.description.toLowerCase().includes(searchLower));
        
      return matchesGenre && matchesSearch;
    });
  }, [packs, selectedGenre, inputValue]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-6 justify-between items-end">
        <div>
          <h1 className="text-4xl font-black mb-2 tracking-tight">Sample Packs</h1>
          <p className="text-brand-muted">The ultimate library of royalty-free loops and hits.</p>
        </div>
        
        {/* Local Search Group with Button */}
        <form onSubmit={handleSearchSubmit} className="w-full md:w-96 flex gap-2">
          <div className="relative flex-grow">
            <input 
              type="text"
              placeholder="Search packs..."
              className="w-full px-5 py-3 bg-brand-panel border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 transition-all shadow-lg"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setSearchParams(e.target.value ? { q: e.target.value } : {}, { replace: true });
              }}
            />
          </div>
          <Button 
            type="submit" 
            className="rounded-2xl px-6 py-3 font-black uppercase text-xs tracking-widest shrink-0"
          >
            Search
          </Button>
        </form>
      </div>

      <div className="flex flex-wrap gap-2 py-2">
        {['All', ...genres.map(g => g.name)].map(genre => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all border ${
              selectedGenre === genre 
                ? 'bg-brand-cyan text-brand-dark border-brand-cyan shadow-lg shadow-brand-cyan/20' 
                : 'bg-white/5 text-brand-muted border-white/10 hover:border-white/20'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {loading && packs.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1,2,3,4,5,6].map(i => <div key={i} className="aspect-square bg-white/5 animate-pulse rounded-[2rem]"></div>)}
        </div>
      ) : filteredPacks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredPacks.map(pack => (
            <ContentCard 
              key={pack.id} 
              item={pack} 
              typeLabel="Pack"
              onViewDetails={() => setSelectedPack(pack)} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-brand-panel/30 rounded-[3rem] border border-dashed border-white/10">
          <p className="text-xl font-bold text-brand-muted mb-4">No packs found for "{inputValue}"</p>
          <div className="flex flex-col items-center gap-4">
            <Button 
              onClick={() => navigate(`/search?q=${encodeURIComponent(inputValue)}`)}
              className="px-8 py-3 rounded-full font-black uppercase text-xs tracking-widest"
            >
              Search All Categories
            </Button>
            <button 
              onClick={() => { setInputValue(''); setSearchParams({}); }}
              className="text-brand-cyan hover:underline font-black uppercase text-[10px] tracking-widest opacity-60"
            >
              Clear all filters
            </button>
          </div>
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