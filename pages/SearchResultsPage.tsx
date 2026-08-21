import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import Button from '../components/Button';
import ContentCard from '../components/ContentCard';
import ContentModal from '../components/ContentModal';
import { getPlugins, getPresets, getSamplePacks } from '../services/graphqlService';
import { Plugin, Preset, SamplePack } from '../types';

type SearchResult = (SamplePack | Preset | Plugin) & { resultType: 'Pack' | 'Preset' | 'Tool' };

const SearchResultsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const submittedQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(submittedQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedItem, setSelectedItem] = useState<SearchResult | null>(null);

  const loadResults = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [packs, presets, plugins] = await Promise.all([getSamplePacks(), getPresets(), getPlugins()]);
      setResults([
        ...packs.map((item) => ({ ...item, resultType: 'Pack' as const })),
        ...presets.map((item) => ({ ...item, resultType: 'Preset' as const })),
        ...plugins.map((item) => ({ ...item, resultType: 'Tool' as const })),
      ]);
    } catch {
      setError('Search is temporarily unavailable. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadResults();
  }, [loadResults]);

  useEffect(() => {
    setQuery(submittedQuery);
  }, [submittedQuery]);

  const filteredResults = useMemo(() => {
    const normalizedQuery = submittedQuery.trim().toLowerCase();
    if (!normalizedQuery) return results;
    return results.filter((item) => {
      const values = [item.name, item.description, item.resultType, ...(('genre' in item && item.genre) || [])].filter(Boolean);
      return values.some((value) => value.toLowerCase().includes(normalizedQuery));
    });
  }, [results, submittedQuery]);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setSearchParams(query.trim() ? { q: query.trim() } : {}, { replace: true });
  };

  return (
    <div>
      <header className="border-b border-brand-border pb-6 sm:pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-cyan">Library search</p>
        <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-brand-text sm:text-4xl">Search results</h1>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-brand-muted sm:text-base">{submittedQuery ? `Showing results matching “${submittedQuery}”.` : 'Search packs, presets, and production tools from one place.'}</p>
          </div>
          <form onSubmit={submitSearch} className="w-full lg:max-w-md" role="search">
            <label className="sr-only" htmlFor="all-search">Search SoundWave</label>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-muted" aria-hidden="true" />
                <input id="all-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search everything..." className="h-11 w-full rounded-xl border border-brand-border bg-brand-surface py-2.5 pl-11 pr-3 text-sm sm:text-base text-brand-text placeholder:text-brand-muted focus:border-brand-cyan focus:outline-none" />
              </div>
              <Button type="submit" size="md" className="h-11 w-full sm:w-auto shrink-0">Search</Button>
            </div>
          </form>
        </div>
      </header>

      {error && (
        <div className="my-6 flex flex-col gap-3 rounded-xl border border-red-300/40 bg-red-950/30 p-4 text-sm text-red-100 sm:flex-row sm:items-center sm:justify-between" role="alert">
          <span>{error}</span><Button variant="secondary" size="sm" onClick={() => void loadResults()}>Try again</Button>
        </div>
      )}

      <section className="pt-6" aria-labelledby="search-results-title">
        <div className="mb-4 flex items-center justify-between text-xs text-brand-muted">
          <h2 id="search-results-title" className="font-normal">{loading ? 'Searching the library...' : `${filteredResults.length} ${filteredResults.length === 1 ? 'result' : 'results'} found`}</h2>
          {submittedQuery && <button type="button" className="font-semibold text-brand-cyan hover:underline" onClick={() => setSearchParams({}, { replace: true })}>Clear search</button>}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" role="status" aria-live="polite">
            {Array.from({ length: 8 }, (_, index) => <div key={index} className="aspect-[4/5] rounded-xl border border-brand-border bg-brand-surface animate-pulse" />)}
            <span className="sr-only">Searching the library…</span>
          </div>
        ) : filteredResults.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredResults.map((item) => <ContentCard key={`${item.resultType}-${item.id}`} item={item} typeLabel={item.resultType} onViewDetails={() => setSelectedItem(item)} />)}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-brand-border px-5 py-10 text-center">
            <h2 className="text-lg font-bold text-brand-text">No results found</h2>
            <p className="mt-2 text-sm text-brand-muted">Try another genre, sound type, or product name.</p>
            {submittedQuery && <Button className="mt-4" variant="secondary" size="sm" onClick={() => setSearchParams({}, { replace: true })}>Clear search</Button>}
          </div>
        )}
      </section>

      {selectedItem && <ContentModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </div>
  );
};

export default SearchResultsPage;
