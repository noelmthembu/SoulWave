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

  const submitSearch = () => {
    setSearchParams(query.trim() ? { q: query.trim() } : {}, { replace: true });
  };

  const count = filteredResults.length;

  return (
    <div>
      <PageHeader
        eyebrow="Library search"
        title="Search results"
        description={submittedQuery
          ? `Showing results matching “${submittedQuery}”.`
          : 'Search packs, presets, and production tools from one place.'}
      >
        <SearchForm
          id="all-search"
          label="Search SoundWave"
          placeholder="Search everything..."
          value={query}
          onChange={setQuery}
          onSearch={submitSearch}
          actionLabel="Search"
        />
      </PageHeader>

      {error && <ErrorNotice className="mt-6" message={error} onRetry={() => void loadResults()} />}

      <section className="pt-6 sm:pt-7" aria-labelledby="search-results-title">
        <div className="mb-4 flex items-baseline justify-between gap-4 border-t border-brand-border pt-4">
          <h2 id="search-results-title" className="eyebrow">
            {loading ? 'Searching…' : `${count} ${count === 1 ? 'result' : 'results'}`}
          </h2>
          {submittedQuery && !loading && (
            <button
              type="button"
              onClick={() => setSearchParams({}, { replace: true })}
              className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand-accent underline decoration-brand-accent/30 underline-offset-4 hover:decoration-brand-accent"
            >
              Clear search
            </button>
          )}
        </div>

        <ContentGrid
          loading={loading}
          loadingLabel="Searching the library…"
          isEmpty={count === 0}
          emptyState={(
            <EmptyState
              title="No results found"
              description="Try another genre, sound type, or product name."
              action={submittedQuery ? (
                <Button variant="secondary" size="sm" onClick={() => setSearchParams({}, { replace: true })}>Clear search</Button>
              ) : undefined}
            />
          )}
        >
          {filteredResults.map((item) => (
            <ContentCard
              key={`${item.resultType}-${item.id}`}
              item={item}
              typeLabel={item.resultType}
              onViewDetails={() => setSelectedItem(item)}
            />
          ))}
        </ContentGrid>
      </section>

      {selectedItem && <ContentModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </div>
  );
};

export default SearchResultsPage;
