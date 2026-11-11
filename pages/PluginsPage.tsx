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
    return plugins.filter((plugin) =>
      [plugin.name, plugin.description, ...(plugin.genre || [])]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedQuery)),
    );
  }, [plugins, query]);

  const submitSearch = () => {
    setSearchParams(query.trim() ? { q: query.trim() } : {}, { replace: true });
  };

  const clearSearch = () => {
    setQuery('');
    setSearchParams({}, { replace: true });
  };

  const count = filteredPlugins.length;

  return (
    <div>
      <PageHeader
        eyebrow="Library / Tools"
        title="Production tools"
        description="Tools and plugins listed for your DAW and production workflow."
      >
        <SearchForm
          id="plugin-search"
          label="Search production tools"
          placeholder="Search tools and VSTs..."
          value={query}
          onChange={setQuery}
          onSearch={submitSearch}
          actionLabel="Search"
        />
      </PageHeader>

      {error && <ErrorNotice className="mt-6" message={error} onRetry={() => void loadPlugins()} />}

      <section className="pt-6 sm:pt-7" aria-labelledby="plugin-results-title">
        <div className="mb-4 flex items-baseline justify-between gap-4 border-t border-brand-border pt-4">
          <h2 id="plugin-results-title" className="eyebrow">
            {loading ? 'Loading…' : `${count} ${count === 1 ? 'tool' : 'tools'}`}
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
          loadingLabel="Loading production tools…"
          isEmpty={count === 0}
          emptyState={(
            <EmptyState
              title="No tools match that search"
              description="Try a product name, manufacturer, or a different keyword."
              action={query.trim() ? <Button variant="secondary" size="sm" onClick={clearSearch}>Clear search</Button> : undefined}
            />
          )}
        >
          {filteredPlugins.map((plugin) => (
            <ContentCard key={plugin.id} item={plugin} typeLabel="Tool" onViewDetails={() => setSelectedPlugin(plugin)} />
          ))}
        </ContentGrid>
      </section>

      {selectedPlugin && <ContentModal item={selectedPlugin} onClose={() => setSelectedPlugin(null)} />}
    </div>
  );
};

export default PluginsPage;
