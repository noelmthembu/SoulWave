import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getGenres, getPlugins, getPresets, getSamplePacks } from '../services/graphqlService';
import { BaseContent, Genre, Plugin, Preset, SamplePack } from '../types';
import ContentCard from '../components/ContentCard';
import ContentGrid from '../components/ContentGrid';
import ContentModal from '../components/ContentModal';
import EmptyState from '../components/EmptyState';
import ErrorNotice from '../components/ErrorNotice';
import SearchForm from '../components/SearchForm';

type CatalogItem = SamplePack | Preset | Plugin;

const quickLinks = [
  { to: '/packs', label: 'Sample packs' },
  { to: '/presets', label: 'Presets' },
  { to: '/plugins', label: 'Tools & VSTs' },
];

interface CatalogSectionProps {
  index: string;
  title: string;
  description: string;
  to: string;
  typeLabel: string;
  items: CatalogItem[];
  loading: boolean;
  onViewDetails: (item: CatalogItem) => void;
}

const CatalogSection: React.FC<CatalogSectionProps> = ({ index, title, description, to, typeLabel, items, loading, onViewDetails }) => (
  <section aria-labelledby={`${typeLabel.toLowerCase()}-heading`}>
    <div className="flex flex-col gap-3 border-b border-brand-border pb-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
      <div className="flex gap-4">
        <span aria-hidden="true" className="mt-1.5 shrink-0 font-mono text-[11px] tracking-[0.16em] text-brand-muted">{index}</span>
        <div className="min-w-0">
          <h2 id={`${typeLabel.toLowerCase()}-heading`} className="display text-2xl leading-tight text-brand-text sm:text-3xl">{title}</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-brand-muted">{description}</p>
        </div>
      </div>
      <Link
        to={to}
        className="group inline-flex shrink-0 items-center gap-1.5 self-start text-[13px] font-medium text-brand-accent transition-colors hover:text-brand-accent-strong sm:self-auto"
      >
        Explore all
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
      </Link>
    </div>

    <div className="mt-5">
      <ContentGrid
        loading={loading}
        loadingLabel={`Loading ${title.toLowerCase()}…`}
        isEmpty={items.length === 0}
        skeletonCount={3}
        columns={3}
        emptyState={(
          <EmptyState
            title={`No ${title.toLowerCase()} yet`}
            description="Nothing is listed in this category right now. Check back later or explore another part of the library."
          />
        )}
      >
        {items.map((item) => (
          <ContentCard key={item.id} item={item} typeLabel={typeLabel} onViewDetails={() => onViewDetails(item)} />
        ))}
      </ContentGrid>
    </div>
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

  const handleSearch = () => {
    const cleanQuery = query.trim();
    if (cleanQuery) navigate(`/search?q=${encodeURIComponent(cleanQuery)}`);
  };

  return (
    <div>
      <section className="border-b border-brand-border pb-9 sm:pb-12" aria-labelledby="home-title">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-end lg:gap-14">
          <div className="min-w-0">
            <p className="eyebrow">Sound library for producers</p>
            <h1 id="home-title" className="display mt-4 max-w-xl text-[2.25rem] leading-[1.02] text-brand-text sm:text-5xl lg:text-6xl">
              Find the sound that fits this session.
            </h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-brand-muted sm:text-lg">
              Browse free sample packs, presets, and production tools without losing your place in the work.
            </p>

            <SearchForm
              id="hero-search"
              label="Search the library"
              placeholder="Search loops, synths, Amapiano..."
              value={query}
              onChange={setQuery}
              onSearch={handleSearch}
              actionLabel="Search library"
              size="lg"
              className="mt-7 max-w-xl"
            />
          </div>

          <nav aria-label="Browse categories" className="border-t border-brand-border pt-4 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <p className="eyebrow">Browse</p>
            <ul className="mt-2">
              {quickLinks.map((link, index) => (
                <li key={link.to} className="border-b border-brand-border">
                  <Link
                    to={link.to}
                    className="group flex items-center justify-between gap-3 py-3 text-sm text-brand-subtle transition-colors hover:text-brand-accent"
                  >
                    <span>{link.label}</span>
                    <span aria-hidden="true" className="font-mono text-[11px] tracking-[0.16em] text-brand-muted group-hover:text-brand-accent">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      {error && <ErrorNotice className="mt-7" message={error} onRetry={() => void loadCatalog()} />}

      <div className="mt-9 space-y-10 sm:mt-12 sm:space-y-12">
        <CatalogSection index="01" title="Featured sample packs" description="A short, practical selection of sound sources for your current project." to="/packs" typeLabel="Pack" items={packs} loading={loading} onViewDetails={setSelectedItem} />
        <CatalogSection index="02" title="Latest presets" description="Settings designed to give synth and instrument ideas a clear direction." to="/presets" typeLabel="Preset" items={presets} loading={loading} onViewDetails={setSelectedItem} />
        <CatalogSection index="03" title="Production tools" description="Software and tools listed by the SoundWave community." to="/plugins" typeLabel="Plugin" items={plugins} loading={loading} onViewDetails={setSelectedItem} />
      </div>

      <section className="mt-11 border-t border-brand-border pt-7 sm:mt-14 sm:pt-8" aria-labelledby="genres-heading">
        <div className="flex gap-4">
          <span aria-hidden="true" className="mt-1.5 shrink-0 font-mono text-[11px] tracking-[0.16em] text-brand-muted">04</span>
          <div className="min-w-0">
            <h2 id="genres-heading" className="display text-2xl leading-tight text-brand-text sm:text-3xl">Browse by genre</h2>
            <p className="mt-2 text-sm leading-relaxed text-brand-muted">Choose a genre to open matching sample packs.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {genres.length > 0 ? genres.map((genre) => (
                <Link
                  key={genre.id}
                  to={`/packs?genre=${encodeURIComponent(genre.name)}`}
                  className="inline-flex min-h-10 items-center border border-brand-border px-3.5 py-1.5 text-[13px] font-medium text-brand-subtle transition-colors hover:border-brand-border-strong hover:text-brand-text"
                >
                  {genre.name}
                </Link>
              )) : <p className="text-sm text-brand-muted">Genres will appear when the library is available.</p>}
            </div>
          </div>
        </div>
      </section>

      {selectedItem && <ContentModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </div>
  );
};

export default HomePage;
