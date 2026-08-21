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
      <header className="border-b border-brand-border pb-7 sm:pb-9">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-cyan">Library / Packs</p>
        <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-[-0.04em] text-brand-text sm:text-4xl">Sample packs</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-brand-muted sm:text-base">Find royalty-free loops, sounds, and MIDI built for a working session.</p>
          </div>
          <form onSubmit={submitSearch} className="w-full max-w-xl" role="search">
            <label className="sr-only" htmlFor="pack-search">Search sample packs</label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-muted" aria-hidden="true" />
                <input id="pack-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search packs" className="min-h-12 w-full rounded-lg border border-brand-border bg-brand-surface py-3 pl-11 pr-3 text-base text-brand-text placeholder:text-brand-muted focus:border-brand-cyan focus:outline-none" />
              </div>
              <Button type="submit" size="lg">Apply search</Button>
            </div>
          </form>
        </div>
      </header>

      <section className="py-6" aria-labelledby="genre-filter-title">
        <h2 id="genre-filter-title" className="text-sm font-semibold text-brand-text">Filter by genre</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {['All', ...genres.map((genre) => genre.name)].map((genre) => (
            <button key={genre} type="button" onClick={() => selectGenre(genre)} aria-pressed={selectedGenre === genre} className={`min-h-10 rounded-lg border px-3 text-sm font-semibold transition-colors ${selectedGenre === genre ? 'border-brand-cyan bg-brand-cyan text-brand-ink' : 'border-brand-border bg-brand-surface text-brand-subtle hover:border-brand-cyan hover:text-brand-text'}`}>
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
          <p className="mt-2 text-sm leading-6 text-brand-muted">Try another term or clear the active genre filter.</p>
          <Button className="mt-5" variant="secondary" onClick={() => { setQuery(''); selectGenre('All'); }}>Clear filters</Button>
        </section>
      )}

      {selectedPack && <ContentModal item={selectedPack} onClose={() => setSelectedPack(null)} />}
    </div>
  );
};

export default PacksPage;
