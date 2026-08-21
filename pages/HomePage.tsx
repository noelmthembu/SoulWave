import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import { getGenres, getPlugins, getPresets, getSamplePacks } from '../services/graphqlService';
import { BaseContent, Genre, Plugin, Preset, SamplePack } from '../types';
import Button from '../components/Button';
import ContentCard from '../components/ContentCard';
import ContentModal from '../components/ContentModal';

type CatalogItem = SamplePack | Preset | Plugin;

interface CatalogSectionProps {
  title: string;
  description: string;
  to: string;
  typeLabel: string;
  items: CatalogItem[];
  loading: boolean;
  onViewDetails: (item: CatalogItem) => void;
}

const CatalogSection: React.FC<CatalogSectionProps> = ({ title, description, to, typeLabel, items, loading, onViewDetails }) => (
  <section aria-labelledby={`${typeLabel.toLowerCase()}-heading`} className="border-t border-brand-border pt-8 sm:pt-10">
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-cyan">Library</p>
        <h2 id={`${typeLabel.toLowerCase()}-heading`} className="mt-2 text-2xl font-bold tracking-[-0.03em] text-brand-text sm:text-3xl">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-brand-muted">{description}</p>
      </div>
      <Link to={to} className="inline-flex min-h-11 items-center gap-2 self-start text-sm font-semibold text-brand-cyan hover:text-brand-text sm:self-auto">
        Explore all <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>

    {loading ? (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-live="polite" aria-label={`Loading ${title.toLowerCase()}`}>
        {[0, 1, 2].map((index) => <div key={index} className="aspect-[4/5] rounded-xl border border-brand-border bg-brand-surface animate-pulse" />)}
        <span className="sr-only">Loading {title.toLowerCase()}…</span>
      </div>
    ) : items.length > 0 ? (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => <ContentCard key={item.id} item={item} typeLabel={typeLabel} onViewDetails={() => onViewDetails(item)} />)}
      </div>
    ) : (
      <div className="rounded-xl border border-dashed border-brand-border px-5 py-8 text-sm text-brand-muted">No {title.toLowerCase()} are available right now. Check back later or explore another category.</div>
    )}
  </section>
);

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [packs, setPacks] = useState<SamplePack[]>([]);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedItem, setSelectedItem] = useState<BaseContent | null>(null);

  const loadCatalog = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [packData, genreData, presetData, pluginData] = await Promise.all([
        getSamplePacks(),
        getGenres(),
        getPresets(),
        getPlugins(),
      ]);
      setPacks(packData.filter((pack) => pack.featured).slice(0, 3));
      setPresets(presetData.slice(0, 3));
      setPlugins(pluginData.slice(0, 3));
      setGenres(genreData);
    } catch {
      setError('We could not load the library. Your saved search and navigation are still available.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCatalog();
  }, [loadCatalog]);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const cleanQuery = query.trim();
    if (cleanQuery) navigate(`/search?q=${encodeURIComponent(cleanQuery)}`);
  };

  return (
    <div className="pb-8">
      <section className="border-b border-brand-border pb-10 sm:pb-14" aria-labelledby="home-title">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-cyan">Sound library for producers</p>
          <h1 id="home-title" className="mt-4 max-w-2xl text-4xl font-bold tracking-[-0.05em] text-brand-text sm:text-5xl lg:text-6xl">Find the sound that fits this session.</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-brand-subtle sm:text-lg">Browse free sample packs, presets, and production tools without losing your place in the work.</p>
        </div>

        <form onSubmit={handleSearch} className="mt-8 max-w-2xl" role="search">
          <label htmlFor="hero-search" className="text-sm font-semibold text-brand-text">Search the library</label>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-muted" aria-hidden="true" />
              <input
                id="hero-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Try “Amapiano keys” or “drum kit”"
                className="min-h-12 w-full rounded-lg border border-brand-border bg-brand-surface py-3 pl-11 pr-3 text-base text-brand-text placeholder:text-brand-muted focus:border-brand-cyan focus:outline-none"
              />
            </div>
            <Button type="submit" size="lg" className="w-full sm:w-auto">Search library</Button>
          </div>
        </form>

        <nav className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm" aria-label="Browse categories">
          <Link to="/packs" className="font-semibold text-brand-cyan hover:text-brand-text">Browse packs</Link>
          <Link to="/presets" className="font-semibold text-brand-cyan hover:text-brand-text">Explore presets</Link>
          <Link to="/plugins" className="font-semibold text-brand-cyan hover:text-brand-text">Find tools</Link>
        </nav>
      </section>

      {error && (
        <div className="mt-8 flex flex-col gap-3 rounded-xl border border-red-300/40 bg-red-950/30 p-4 text-sm text-red-100 sm:flex-row sm:items-center sm:justify-between" role="alert">
          <span>{error}</span>
          <Button variant="secondary" size="sm" onClick={() => void loadCatalog()}>Try again</Button>
        </div>
      )}

      <div className="space-y-10 sm:space-y-14">
        <CatalogSection title="Featured sample packs" description="A short, practical selection of sound sources for your current project." to="/packs" typeLabel="Pack" items={packs} loading={loading} onViewDetails={setSelectedItem} />
        <CatalogSection title="Latest presets" description="Start with settings designed to give synth and instrument ideas a clear direction." to="/presets" typeLabel="Preset" items={presets} loading={loading} onViewDetails={setSelectedItem} />
        <CatalogSection title="Production tools" description="Browse the software and tools listed by the SoundWave community." to="/plugins" typeLabel="Plugin" items={plugins} loading={loading} onViewDetails={setSelectedItem} />
      </div>

      <section className="mt-10 border-t border-brand-border pt-8 sm:mt-14 sm:pt-10" aria-labelledby="genres-heading">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-cyan">Filter</p>
        <h2 id="genres-heading" className="mt-2 text-2xl font-bold tracking-[-0.03em] text-brand-text">Browse by genre</h2>
        <p className="mt-2 text-sm leading-6 text-brand-muted">Choose a genre to open matching sample packs.</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {genres.length > 0 ? genres.map((genre) => (
            <Link key={genre.id} to={`/packs?genre=${encodeURIComponent(genre.name)}`} className="inline-flex min-h-10 items-center rounded-lg border border-brand-border bg-brand-surface px-3 text-sm text-brand-subtle hover:border-brand-cyan hover:text-brand-text">
              {genre.name}
            </Link>
          )) : <p className="text-sm text-brand-muted">Genres will appear when the library is available.</p>}
        </div>
      </section>

      {selectedItem && <ContentModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </div>
  );
};

export default HomePage;
