import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getPresets } from '../services/graphqlService';
import { Preset } from '../types';
import SamplePackCard from '../components/SamplePackCard'; 
import ContentModal from '../components/ContentModal';

const PresetsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('q') || '';
  
  const [presets, setPresets] = useState<Preset[]>([]);
  const [inputValue, setInputValue] = useState(initialSearch);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<Preset | null>(null);

  const fetchData = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const data = await getPresets();
      setPresets(data);
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

  const filteredPresets = useMemo(() => {
    const searchLower = inputValue.toLowerCase();
    return presets.filter(p => 
      p.name.toLowerCase().includes(searchLower) || 
      (p.description && p.description.toLowerCase().includes(searchLower))
    );
  }, [presets, inputValue]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(inputValue.trim())}`);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-6 justify-between items-end">
        <div>
          <h1 className="text-4xl font-black mb-2">Synth Presets</h1>
          <p className="text-brand-muted">Pro patches for your favorite software synthesizers.</p>
        </div>

        <form onSubmit={handleSearchSubmit} className="w-full md:w-96 flex gap-2">
          <input 
            type="text"
            placeholder="Search presets..."
            className="w-full px-5 py-3 bg-brand-panel border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 transition-all shadow-lg"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setSearchParams(e.target.value ? { q: e.target.value } : {}, { replace: true });
            }}
          />
          <button 
            type="submit" 
            className="px-6 py-3 bg-brand-cyan text-brand-dark rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-cyan-400 transition-colors shrink-0"
          >
            Search
          </button>
        </form>
      </div>

      {loading && presets.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1,2,3].map(i => <div key={i} className="h-72 bg-white/5 animate-pulse rounded-2xl"></div>)}
        </div>
      ) : filteredPresets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredPresets.map(item => (
            <SamplePackCard 
              key={item.id} 
              pack={item as any} 
              onViewDetails={() => setSelectedItem(item)} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-brand-panel/30 rounded-[3rem] border border-dashed border-white/10">
          <p className="text-xl font-bold text-brand-muted mb-4">No presets found for "{inputValue}"</p>
          <div className="flex flex-col items-center gap-4">
            <button 
              onClick={() => navigate(`/search?q=${encodeURIComponent(inputValue)}`)}
              className="px-8 py-3 bg-brand-cyan text-brand-dark rounded-full font-black uppercase text-xs tracking-widest hover:bg-cyan-400 transition-colors"
            >
              Search All Categories
            </button>
            <button 
              onClick={() => { setInputValue(''); setSearchParams({}); }}
              className="text-brand-cyan hover:underline font-black uppercase text-[10px] tracking-widest opacity-60"
            >
              Clear search
            </button>
          </div>
        </div>
      )}

      {selectedItem && (
        <ContentModal 
          item={selectedItem as any} 
          onClose={() => setSelectedItem(null)} 
        />
      )}
    </div>
  );
};

export default PresetsPage;