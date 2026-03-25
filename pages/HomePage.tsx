import React, { useState, useEffect } from 'react';
import { getSamplePacks, getGenres, getPresets, getPlugins } from '../services/graphqlService';
import { SamplePack, Genre, Preset, Plugin, BaseContent } from '../types';
import ContentCard from '../components/ContentCard';
import ContentModal from '../components/ContentModal';
import { useNavigate } from 'react-router-dom';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="relative overflow-hidden py-24 px-6 text-center bg-gradient-to-b from-brand-panel to-brand-dark rounded-3xl border border-white/5 mb-16">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-cyan/10 blur-[120px] rounded-full -z-10"></div>
      <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
        Craft Your <span className="text-brand-cyan">Signature Sound</span>
      </h1>
      <p className="text-xl text-brand-muted max-w-2xl mx-auto mb-10 leading-relaxed">
        Discover thousands of royalty-free sample packs, presets, loops, and tutorials to elevate your productions. All completely free.
      </p>
      
      <div className="max-w-xl mx-auto mb-10">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input 
            type="text"
            placeholder="Search for anything..."
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-lg text-white placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:bg-white/10 transition-all"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            type="submit"
            className="bg-brand-cyan hover:bg-cyan-400 text-brand-dark font-black px-8 py-4 rounded-2xl text-lg shadow-xl shadow-brand-cyan/20 transition-all transform hover:scale-105 active:scale-95"
          >
            Search
          </button>
        </form>
      </div>

      <button 
        onClick={() => navigate('/packs')}
        className="text-brand-cyan hover:underline font-black uppercase text-xs tracking-widest opacity-60"
      >
        Or browse all packs
      </button>
    </div>
  );
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [packs, setPacks] = useState<SamplePack[]>([]);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<BaseContent | null>(null);

  const fetchData = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const [pData, gData, preData, pluData] = await Promise.all([
        getSamplePacks(), 
        getGenres(),
        getPresets(),
        getPlugins()
      ]);
      setPacks(pData.filter(p => p.featured).slice(0, 3));
      setPresets(preData.slice(0, 3));
      setPlugins(pluData.slice(0, 3));
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
      
      {/* Featured Sample Packs */}
      <div className="mb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black flex items-center gap-3">
            <span className="w-2 h-10 bg-brand-cyan rounded-full"></span>
            Featured Sample Packs
          </h2>
          <button 
            onClick={() => navigate('/packs')}
            className="text-brand-cyan hover:text-cyan-400 font-black uppercase text-xs tracking-widest transition-colors"
          >
            View All
          </button>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(n => (
              <div key={n} className="aspect-square bg-white/5 animate-pulse rounded-[2rem]"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {packs.map(pack => (
              <ContentCard 
                key={pack.id} 
                item={pack} 
                typeLabel="Pack"
                onViewDetails={() => setSelectedItem(pack)} 
              />
            ))}
          </div>
        )}
      </div>

      {/* Presets Section */}
      <div className="mb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black flex items-center gap-3">
            <span className="w-2 h-10 bg-brand-cyan rounded-full"></span>
            Latest Presets
          </h2>
          <button 
            onClick={() => navigate('/presets')}
            className="text-brand-cyan hover:text-cyan-400 font-black uppercase text-xs tracking-widest transition-colors"
          >
            View All
          </button>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(n => (
              <div key={n} className="aspect-square bg-white/5 animate-pulse rounded-[2rem]"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {presets.map(preset => (
              <ContentCard 
                key={preset.id} 
                item={preset} 
                typeLabel="Preset"
                onViewDetails={() => setSelectedItem(preset)} 
              />
            ))}
          </div>
        )}
      </div>

      {/* Plugins Section */}
      <div className="mb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black flex items-center gap-3">
            <span className="w-2 h-10 bg-brand-cyan rounded-full"></span>
            Essential Plugins
          </h2>
          <button 
            onClick={() => navigate('/plugins')}
            className="text-brand-cyan hover:text-cyan-400 font-black uppercase text-xs tracking-widest transition-colors"
          >
            View All
          </button>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(n => (
              <div key={n} className="aspect-square bg-white/5 animate-pulse rounded-[2rem]"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {plugins.map(plugin => (
              <ContentCard 
                key={plugin.id} 
                item={plugin} 
                typeLabel="Plugin"
                onViewDetails={() => setSelectedItem(plugin)} 
              />
            ))}
          </div>
        )}
      </div>

      <div className="bg-brand-panel/50 border border-white/5 rounded-[3rem] p-12 text-center">
        <h3 className="text-2xl font-black mb-6">Browse by Genre</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {genres.map(genre => (
            <button 
              key={genre.id}
              onClick={() => navigate(`/packs?genre=${genre.name}`)}
              className="px-8 py-3 rounded-full bg-white/5 hover:bg-brand-cyan hover:text-brand-dark text-sm font-black transition-all border border-white/5 hover:scale-105"
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>

      {selectedItem && (
        <ContentModal 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
        />
      )}
    </div>
  );
};

export default HomePage;
