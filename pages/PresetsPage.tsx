import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import Button from '../components/Button';
import ContentCard from '../components/ContentCard';
import ContentModal from '../components/ContentModal';
import { getPresets } from '../services/graphqlService';
import { Preset } from '../types';

const PresetsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [presets, setPresets] = useState<Preset[]>([]);
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);

  const loadPresets = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setPresets(await getPresets());
    } catch {
      setError('The preset library could not be loaded. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPresets();
  }, [loadPresets]);

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const filteredPresets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return presets;
    return presets.filter((preset) => [preset.name, preset.description, preset.pluginCompatibility, ...(preset.genre || [])].filter(Boolean).some((value) => value.toLowerCase().includes(normalizedQuery)));
  }, [presets, query]);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setSearchParams(query.trim() ? { q: query.trim() } : {}, { replace: true });
  };

  return (
    <div>
      <header className="border-b border-brand-border pb-7 sm:pb-9">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-cyan">Library / Presets</p>
        <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-[-0.04em] text-brand-text sm:text-4xl">Presets</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-brand-muted sm:text-base">Discover starting points for synths, instruments, and sound-design sessions.</p>
          </div>
          <form onSubmit={submitSearch} className="w-full max-w-xl" role="search">
            <label className="sr-only" htmlFor="preset-search">Search presets</label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-muted" aria-hidden="true" />
                <input id="preset-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search presets or compatible plugins" className="min-h-12 w-full rounded-lg border border-brand-border bg-brand-surface py-3 pl-11 pr-3 text-base text-brand-text placeholder:text-brand-muted focus:border-brand-cyan focus:outline-none" />
              </div>
              <Button type="submit" size="lg">Apply search</Button>
            </div>
          </form>
        </div>
      </header>

      {error && (
        <div className="my-6 flex flex-col gap-3 rounded-xl border border-red-300/40 bg-red-950/30 p-4 text-sm text-red-100 sm:flex-row sm:items-center sm:justify-between" role="alert">
          <span>{error}</span><Button variant="secondary" size="sm" onClick={() => void loadPresets()}>Try again</Button>
        </div>
      )}

      <section className="pt-7" aria-labelledby="preset-results-title">
        <div className="mb-5 flex items-baseline justify-between gap-4">
          <h2 id="preset-results-title" className="text-sm font-semibold text-brand-text">{loading ? 'Loading presets' : `${filteredPresets.length} ${filteredPresets.length === 1 ? 'preset' : 'presets'} available`}</h2>
          {query && <button type="button" className="min-h-10 text-sm font-semibold text-brand-cyan hover:text-brand-text" onClick={() => { setQuery(''); setSearchParams({}, { replace: true }); }}>Clear search</button>}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" role="status" aria-live="polite">
            {Array.from({ length: 8 }, (_, index) => <div key={index} className="aspect-[4/5] rounded-xl border border-brand-border bg-brand-surface animate-pulse" />)}
            <span className="sr-only">Loading presets…</span>
          </div>
        ) : filteredPresets.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredPresets.map((preset) => <ContentCard key={preset.id} item={preset} typeLabel="Preset" onViewDetails={() => setSelectedPreset(preset)} />)}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-brand-border px-5 py-10 text-center">
            <h2 className="text-lg font-bold text-brand-text">No presets match that search</h2>
            <p className="mt-2 text-sm text-brand-muted">Try a different instrument, plugin name, or sound category.</p>
          </div>
        )}
      </section>

      {selectedPreset && <ContentModal item={selectedPreset} onClose={() => setSelectedPreset(null)} />}
    </div>
  );
};

export default PresetsPage;
