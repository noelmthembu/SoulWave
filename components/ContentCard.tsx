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
    <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-brand-border bg-brand-surface">
      <button
        type="button"
        onClick={onViewDetails}
        className="group relative aspect-[4/3] w-full overflow-hidden bg-brand-raised text-left"
        aria-label={`View details for ${item.name}`}
      >
        {coverUrl && !imageFailed ? (
          <img
            src={coverUrl}
            alt=""
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02] motion-reduce:transition-none"
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="grid h-full place-items-center px-6 text-center text-sm text-brand-muted">Artwork unavailable</div>
        )}
        <span className="absolute inset-x-0 bottom-0 bg-brand-canvas/80 px-4 py-3 text-sm font-semibold text-brand-text opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none">
          View details
        </span>
      </button>

      <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          {typeLabel && <span className="rounded-md bg-brand-raised px-2 py-1 text-brand-subtle">{typeLabel}</span>}
          {featured && <span className="rounded-md bg-brand-cyan px-2 py-1 text-brand-ink">Featured</span>}
        </div>

        <div className="min-w-0">
          <h3 className="break-words text-lg font-bold leading-snug text-brand-text">{item.name}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-brand-muted">{item.description || 'Download details are available in the item view.'}</p>
        </div>

        <div className="flex min-h-7 flex-wrap gap-1.5" aria-label="Genres">
          {genres.length > 0 ? genres.slice(0, 3).map((genre) => (
            <span key={genre} className="rounded-md border border-brand-border px-2 py-1 text-xs text-brand-muted">{genre}</span>
          )) : <span className="text-xs text-brand-muted">General</span>}
          {genres.length > 3 && <span className="px-1 py-1 text-xs text-brand-muted">+{genres.length - 3} more</span>}
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2 pt-1">
          <Button variant="secondary" size="sm" className="w-full" onClick={onViewDetails}>Details</Button>
          <a
            href={item.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-brand-cyan bg-brand-cyan px-3 text-sm font-semibold text-brand-ink transition-colors hover:border-brand-cyan-strong hover:bg-brand-cyan-strong"
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
