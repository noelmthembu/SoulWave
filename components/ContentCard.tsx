import React, { useState } from 'react';
import { BaseContent, Plugin, Preset, SamplePack } from '../types';
import Button from './Button';

interface ContentCardProps {
  item: BaseContent | SamplePack | Preset | Plugin;
  onViewDetails: () => void;
  typeLabel?: string;
}

const ContentCard: React.FC<ContentCardProps> = ({ item, onViewDetails, typeLabel }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const coverUrl = item.coverArt?.[0]?.url;
  const genres = Array.isArray((item as SamplePack).genre) ? (item as SamplePack).genre : [];
  const featured = Boolean((item as SamplePack).featured);

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-brand-border bg-brand-surface transition-all duration-200 hover:border-brand-muted/40 hover:shadow-lg">
      <button
        type="button"
        onClick={onViewDetails}
        className="relative aspect-[16/10] w-full overflow-hidden bg-brand-raised text-left"
        aria-label={`View details for ${item.name}`}
      >
        {coverUrl && !imageFailed ? (
          <img
            src={coverUrl}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="grid h-full place-items-center px-4 text-center text-xs sm:text-sm text-brand-muted">Artwork unavailable</div>
        )}
        <span className="absolute inset-x-0 bottom-0 bg-brand-canvas/85 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-brand-text opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none backdrop-blur-xs">
          View details
        </span>
      </button>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
          {typeLabel && <span className="rounded-md bg-brand-raised px-2 py-0.5 text-brand-subtle">{typeLabel}</span>}
          {featured && <span className="rounded-md bg-brand-cyan px-2 py-0.5 text-brand-ink font-bold">Featured</span>}
        </div>

        <div className="mt-3 min-w-0">
          <h3 className="line-clamp-1 text-base font-bold text-brand-text sm:text-lg" title={item.name}>{item.name}</h3>
          <p className="mt-1.5 line-clamp-2 text-xs sm:text-sm leading-relaxed text-brand-muted">{item.description || 'Download details and source files are available in the item view.'}</p>
        </div>

        <div className="mt-3 flex min-h-6 flex-wrap items-center gap-1.5" aria-label="Genres">
          {genres.length > 0 ? genres.slice(0, 2).map((genre) => (
            <span key={genre} className="truncate max-w-[120px] rounded-md border border-brand-border/80 bg-brand-canvas/50 px-2 py-0.5 text-xs text-brand-muted">{genre}</span>
          )) : <span className="text-xs text-brand-muted">General</span>}
          {genres.length > 2 && <span className="px-1 text-xs text-brand-muted">+{genres.length - 2}</span>}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 pt-2 border-t border-brand-border/40">
          <Button variant="secondary" size="sm" className="w-full text-xs sm:text-sm" onClick={onViewDetails}>Details</Button>
          <a
            href={item.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-brand-cyan bg-brand-cyan px-3 text-xs sm:text-sm font-semibold text-brand-ink transition-colors hover:border-brand-cyan-strong hover:bg-brand-cyan-strong"
            aria-label={`Open download for ${item.name}`}
          >
            Get
          </a>
        </div>
      </div>
    </article>
  );
};

export default ContentCard;
