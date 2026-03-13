import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getSamplePacks, getPresets, getPlugins } from '../services/graphqlService';
import { SamplePack, Preset, Plugin } from '../types';
import SamplePackCard from '../components/SamplePackCard';
import ContentModal from '../components/ContentModal';

type SearchResult = (SamplePack | Preset | Plugin) & { type: 'pack' | 'preset' | 'plugin' };

const SearchResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<SearchResult | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [packs, presets, plugins] = await Promise.all([
          getSamplePacks(),
          getPresets(),
          getPlugins()
        ]);

        const allResults: SearchResult[] = [
          ...packs.map(p => ({ ...p, type: 'pack' as const })),
          ...presets.map(p => ({ ...p, type: 'preset' as const })),
          ...plugins.map(p => ({ ...p, type: 'plugin' as const }))
        ];

        setResults(allResults);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredResults = useMemo(() => {
    const searchLower = query.toLowerCase().trim();
    if (!searchLower) return results;
    
    return results.filter(item => 
      item.name.toLowerCase().includes(searchLower) || 
      (item.description && item.description.toLowerCase().includes(searchLower)) ||
      (item.genre && Array.isArray(item.genre) && item.genre.some(g => g.toLowerCase().includes(searchLower))) ||
      item.type.toLowerCase().includes(searchLower)
    );
  }, [results, query]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-6 justify-between items-end">
        <div>
          <h1 className="text-4xl font-black mb-2 tracking-tight">Search Results</h1>
          <p className="text-brand-muted">
            {query ? `Showing results for "${query}"` : 'Browse all content'}
          </p>
        </div>
        
        <div className="w-full md:w-96">
          <input 
            type="text"
            placeholder="Search everything..."
            className="w-full px-5 py-3 bg-brand-panel border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 transition-all shadow-lg"
            value={query}
            onChange={(e) => setSearchParams(e.target.value ? { q: e.target.value } : {}, { replace: true })}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1,2,3,4,5,6].map(i => <div key={i} className="aspect-square bg-white/5 animate-pulse rounded-[2rem]"></div>)}
        </div>
      ) : filteredResults.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredResults.map(item => (
            <div key={`${item.type}-${item.id}`} className="relative">
              <div className="absolute top-4 right-4 z-10">
                <span className="px-2 py-1 bg-brand-dark/80 backdrop-blur-md border border-white/10 rounded-md text-[9px] font-black uppercase tracking-widest text-brand-cyan">
                  {item.type}
                </span>
              </div>
              <SamplePackCard 
                pack={item as any} 
                onViewDetails={() => setSelectedItem(item)} 
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-brand-panel/30 rounded-[3rem] border border-dashed border-white/10">
          <p className="text-xl font-bold text-brand-muted mb-2">No results found for "{query}"</p>
          <button 
            onClick={() => setSearchParams({})}
            className="text-brand-cyan hover:underline font-black uppercase text-xs tracking-widest"
          >
            Clear search
          </button>
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

export default SearchResultsPage;
