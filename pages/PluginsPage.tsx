import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import Button from '../components/Button';
import ContentCard from '../components/ContentCard';
import ContentModal from '../components/ContentModal';
import { getPlugins } from '../services/graphqlService';
import { Plugin } from '../types';

const PluginsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null);

  const loadPlugins = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setPlugins(await getPlugins());
    } catch {
      setError('The plugin library could not be loaded. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPlugins();
  }, [loadPlugins]);

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const filteredPlugins = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return plugins;
    return plugins.filter((plugin) => [plugin.name, plugin.description, ...(plugin.genre || [])].filter(Boolean).some((value) => value.toLowerCase().includes(normalizedQuery)));
  }, [plugins, query]);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setSearchParams(query.trim() ? { q: query.trim() } : {}, { replace: true });
  };

  return (
    <div>
      <header className="border-b border-brand-border pb-6 sm:pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-cyan">Library / Tools</p>
        <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-brand-text sm:text-4xl">Production tools</h1>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-brand-muted sm:text-base">Review tools and plugins listed for your DAW and production workflow.</p>
          </div>
          <form onSubmit={submitSearch} className="w-full lg:max-w-md" role="search">
            <label className="sr-only" htmlFor="plugin-search">Search production tools</label>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-muted" aria-hidden="true" />
                <input id="plugin-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tools and VSTs..." className="h-11 w-full rounded-xl border border-brand-border bg-brand-surface py-2.5 pl-11 pr-3 text-sm sm:text-base text-brand-text placeholder:text-brand-muted focus:border-brand-cyan focus:outline-none" />
              </div>
              <Button type="submit" size="md" className="h-11 w-full sm:w-auto shrink-0">Search</Button>
            </div>
          </form>
        </div>
      </header>

      {error && (
        <div className="my-6 flex flex-col gap-3 rounded-xl border border-red-300/40 bg-red-950/30 p-4 text-sm text-red-100 sm:flex-row sm:items-center sm:justify-between" role="alert">
          <span>{error}</span><Button variant="secondary" size="sm" onClick={() => void loadPlugins()}>Try again</Button>
        </div>
      )}

      <section className="pt-6" aria-labelledby="plugin-results-title">
        <div className="mb-4 flex items-center justify-between text-xs text-brand-muted">
          <h2 id="plugin-results-title" className="font-normal">{loading ? 'Loading tools...' : `${filteredPlugins.length} ${filteredPlugins.length === 1 ? 'tool' : 'tools'} available`}</h2>
          {query && <button type="button" className="font-semibold text-brand-cyan hover:underline" onClick={() => { setQuery(''); setSearchParams({}, { replace: true }); }}>Clear search</button>}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" role="status" aria-live="polite">
            {Array.from({ length: 8 }, (_, index) => <div key={index} className="aspect-[4/5] rounded-xl border border-brand-border bg-brand-surface animate-pulse" />)}
            <span className="sr-only">Loading production tools…</span>
          </div>
        ) : filteredPlugins.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredPlugins.map((plugin) => <ContentCard key={plugin.id} item={plugin} typeLabel="Tool" onViewDetails={() => setSelectedPlugin(plugin)} />)}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-brand-border px-5 py-10 text-center">
            <h2 className="text-lg font-bold text-brand-text">No tools match that search</h2>
            <p className="mt-2 text-sm text-brand-muted">Try a product name, manufacturer, or a different keyword.</p>
            {query && <Button className="mt-4" variant="secondary" size="sm" onClick={() => { setQuery(''); setSearchParams({}, { replace: true }); }}>Clear search</Button>}
          </div>
        )}
      </section>

      {selectedPlugin && <ContentModal item={selectedPlugin} onClose={() => setSelectedPlugin(null)} />}
    </div>
  );
};

export default PluginsPage;
