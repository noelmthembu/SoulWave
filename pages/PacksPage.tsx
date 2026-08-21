import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import Button from '../components/Button';
import ContentCard from '../components/ContentCard';
import ContentModal from '../components/ContentModal';
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

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    updateParams(query, selectedGenre);
  };

  return (
    <div>
      <header className="border-b border-brand-border pb-6 sm:pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-cyan">Library / Packs</p>
        <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-brand-text sm:text-4xl">Sample packs</h1>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-brand-muted sm:text-base">Find royalty-free loops, sounds, and stems built for a working session.</p>
          </div>
          <form onSubmit={submitSearch} className="w-full lg:max-w-md" role="search">
            <label className="sr-only" htmlFor="pack-search">Search sample packs</label>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-muted" aria-hidden="true" />
                <input id="pack-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search packs..." className="h-11 w-full rounded-xl border border-brand-border bg-brand-surface py-2.5 pl-11 pr-3 text-sm sm:text-base text-brand-text placeholder:text-brand-muted focus:border-brand-cyan focus:outline-none" />
              </div>
              <Button type="submit" size="md" className="h-11 w-full sm:w-auto shrink-0">Search</Button>
            </div>
          </form>
        </div>
      </header>

      <section className="py-5" aria-labelledby="genre-filter-title">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
          <h2 id="genre-filter-title" className="text-xs font-semibold uppercase tracking-wider text-brand-muted">Filter by genre</h2>
          {(selectedGenre !== 'All' || query) && (
            <button
              type="button"
              className="text-xs font-semibold text-brand-cyan hover:underline self-start sm:self-auto"
              onClick={() => { setQuery(''); selectGenre('All'); }}
            >
              Reset all filters
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {['All', ...genres.map((genre) => genre.name)].map((genre) => (
            <button
              key={genre}
              type="button"
              onClick={() => selectGenre(genre)}
              aria-pressed={selectedGenre === genre}
              className={`min-h-9 rounded-lg border px-3.5 py-1 text-xs sm:text-sm font-semibold transition-colors ${
                selectedGenre === genre
                  ? 'border-brand-cyan bg-brand-cyan text-brand-ink'
                  : 'border-brand-border bg-brand-surface text-brand-subtle hover:border-brand-cyan hover:text-brand-text'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </section>

      {error && (
        <div className="mb-6 flex flex-col gap-3 rounded-xl border border-red-300/40 bg-red-950/30 p-4 text-sm text-red-100 sm:flex-row sm:items-center sm:justify-between" role="alert">
          <span>{error}</span><Button variant="secondary" size="sm" onClick={() => void loadPacks()}>Try again</Button>
        </div>
      )}

      <div className="mb-4 flex items-center justify-between text-xs text-brand-muted">
        <span>{loading ? 'Loading...' : `${filteredPacks.length} ${filteredPacks.length === 1 ? 'pack' : 'packs'} found`}</span>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" role="status" aria-live="polite">
          {Array.from({ length: 8 }, (_, index) => <div key={index} className="aspect-[4/5] rounded-xl border border-brand-border bg-brand-surface animate-pulse" />)}
          <span className="sr-only">Loading sample packs…</span>
        </div>
      ) : filteredPacks.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredPacks.map((pack) => <ContentCard key={pack.id} item={pack} typeLabel="Pack" onViewDetails={() => setSelectedPack(pack)} />)}
        </div>
      ) : (
        <section className="rounded-xl border border-dashed border-brand-border px-5 py-10 text-center" aria-labelledby="empty-packs-title">
          <h2 id="empty-packs-title" className="text-lg font-bold text-brand-text">No packs match these filters</h2>
          <p className="mt-2 text-sm leading-6 text-brand-muted">Try another search term or clear the active genre filter.</p>
          <Button className="mt-5" variant="secondary" onClick={() => { setQuery(''); selectGenre('All'); }}>Clear filters</Button>
        </section>
      )}

      {selectedPack && <ContentModal item={selectedPack} onClose={() => setSelectedPack(null)} />}
    </div>
  );
};

export default PacksPage;
