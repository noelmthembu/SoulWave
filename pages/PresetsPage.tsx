import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Button from '../components/Button';
import ContentCard from '../components/ContentCard';
import ContentGrid from '../components/ContentGrid';
import ContentModal from '../components/ContentModal';
import EmptyState from '../components/EmptyState';
import ErrorNotice from '../components/ErrorNotice';
import PageHeader from '../components/PageHeader';
import SearchForm from '../components/SearchForm';
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
    return presets.filter((preset) =>
      [preset.name, preset.description, preset.pluginCompatibility, ...(preset.genre || [])]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedQuery)),
    );
  }, [presets, query]);

  const submitSearch = () => {
    setSearchParams(query.trim() ? { q: query.trim() } : {}, { replace: true });
  };

  const clearSearch = () => {
    setQuery('');
    setSearchParams({}, { replace: true });
  };

  const count = filteredPresets.length;

  return (
    <div>
      <PageHeader
        eyebrow="Library / Presets"
        title="Presets"
        description="Starting points for synths, instruments, and sound-design sessions."
      >
        <SearchForm
          id="preset-search"
          label="Search presets"
          placeholder="Search presets or plugins..."
          value={query}
          onChange={setQuery}
          onSearch={submitSearch}
          actionLabel="Search"
        />
      </PageHeader>

      {error && <ErrorNotice className="mt-6" message={error} onRetry={() => void loadPresets()} />}

      <section className="pt-6 sm:pt-7" aria-label="Preset results">
        <div className="mb-4 flex items-baseline justify-between gap-4 border-t border-brand-border pt-4">
          <h2 className="eyebrow">
            {loading ? 'Loading…' : `${count} ${count === 1 ? 'preset' : 'presets'}`}
          </h2>
          {query.trim() && !loading && (
            <button
              type="button"
              onClick={clearSearch}
              className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand-accent underline decoration-brand-accent/30 underline-offset-4 hover:decoration-brand-accent"
            >
              Clear search
            </button>
          )}
        </div>

        <ContentGrid
          loading={loading}
          loadingLabel="Loading presets…"
          isEmpty={count === 0}
          emptyState={(
            <EmptyState
              title="No presets match that search"
              description="Try a different instrument, plugin name, or sound category."
              action={query.trim() ? <Button variant="secondary" size="sm" onClick={clearSearch}>Clear search</Button> : undefined}
            />
          )}
        >
          {filteredPresets.map((preset) => (
            <ContentCard key={preset.id} item={preset} typeLabel="Preset" onViewDetails={() => setSelectedPreset(preset)} />
          ))}
        </ContentGrid>
      </section>

      {selectedPreset && <ContentModal item={selectedPreset} onClose={() => setSelectedPreset(null)} />}
    </div>
  );
};

export default PresetsPage;
