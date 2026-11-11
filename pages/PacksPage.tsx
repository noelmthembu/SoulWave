import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Button from '../components/Button';
import ContentCard from '../components/ContentCard';
import ContentGrid from '../components/ContentGrid';
import ContentModal from '../components/ContentModal';
import EmptyState from '../components/EmptyState';
import ErrorNotice from '../components/ErrorNotice';
import FilterChips from '../components/FilterChips';
import PageHeader from '../components/PageHeader';
import SearchForm from '../components/SearchForm';
import { getGenres, getSamplePacks } from '../services/graphqlService';
import { Genre, SamplePack } from '../types';

const PacksPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [packs, setPacks] = useState<SamplePack[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get('genre') || 'All');
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPack, setSelectedPack] = useState<SamplePack | null>(null);

  const loadPacks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [packData, genreData] = await Promise.all([getSamplePacks(), getGenres()]);
      setPacks(packData);
      setGenres(genreData);
    } catch {
      setError('The pack library could not be loaded. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPacks();
  }, [loadPacks]);

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
    setSelectedGenre(searchParams.get('genre') || 'All');
  }, [searchParams]);

  const filteredPacks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return packs.filter((pack) => {
      const matchesGenre = selectedGenre === 'All' || pack.genre.includes(selectedGenre);
      const matchesQuery = !normalizedQuery || [pack.name, pack.description, ...pack.genre].filter(Boolean).some((value) => value.toLowerCase().includes(normalizedQuery));
      return matchesGenre && matchesQuery;
    });
  }, [packs, query, selectedGenre]);

  const updateParams = (nextQuery: string, nextGenre: string) => {
    const params: Record<string, string> = {};
    if (nextQuery.trim()) params.q = nextQuery.trim();
    if (nextGenre !== 'All') params.genre = nextGenre;
    setSearchParams(params, { replace: true });
  };

  const selectGenre = (genre: string) => {
    setSelectedGenre(genre);
    updateParams(query, genre);
  };

  const resetFilters = () => {
    setQuery('');
    setSelectedGenre('All');
    setSearchParams({}, { replace: true });
  };

  const hasFilters = selectedGenre !== 'All' || Boolean(query.trim());
  const count = filteredPacks.length;

  return (
    <div>
      <PageHeader
        eyebrow="Library / Packs"
        title="Sample packs"
        description="Royalty-free loops, sounds, and stems built for a working session."
      >
        <SearchForm
          id="pack-search"
          label="Search sample packs"
          placeholder="Search packs..."
          value={query}
          onChange={setQuery}
          onSearch={() => updateParams(query, selectedGenre)}
          actionLabel="Search"
        />
      </PageHeader>

      <div className="py-6 sm:py-7">
        <FilterChips
          label="Filter by genre"
          options={['All', ...genres.map((genre) => genre.name)]}
          value={selectedGenre}
          onChange={selectGenre}
          action={hasFilters ? (
            <button
              type="button"
              onClick={resetFilters}
              className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand-accent underline decoration-brand-accent/30 underline-offset-4 hover:decoration-brand-accent"
            >
              Reset filters
            </button>
          ) : undefined}
        />
      </div>

      {error && <ErrorNotice className="mb-6" message={error} onRetry={() => void loadPacks()} />}

      <section aria-labelledby="pack-results-title">
        <div className="mb-4 flex items-baseline justify-between gap-4 border-t border-brand-border pt-4">
          <h2 id="pack-results-title" className="eyebrow">
            {loading ? 'Loading…' : `${count} ${count === 1 ? 'pack' : 'packs'}`}
          </h2>
          {hasFilters && !loading && <span className="eyebrow">Filtered</span>}
        </div>

        <ContentGrid
          loading={loading}
          loadingLabel="Loading sample packs…"
          isEmpty={count === 0}
          emptyState={(
            <EmptyState
              title="No packs match these filters"
              description="Try another search term or clear the active genre filter."
              action={<Button variant="secondary" size="sm" onClick={resetFilters}>Clear filters</Button>}
            />
          )}
        >
          {filteredPacks.map((pack) => (
            <ContentCard key={pack.id} item={pack} typeLabel="Pack" onViewDetails={() => setSelectedPack(pack)} />
          ))}
        </ContentGrid>
      </section>

      {selectedPack && <ContentModal item={selectedPack} onClose={() => setSelectedPack(null)} />}
    </div>
  );
};

export default PacksPage;
