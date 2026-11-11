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
    <article className="group flex h-full min-w-0 flex-col border border-brand-border bg-brand-surface transition-colors duration-150 hover:border-brand-border-strong">
      <button
        type="button"
        onClick={onViewDetails}
        className="relative aspect-[4/3] w-full overflow-hidden border-b border-brand-border bg-brand-raised text-left"
        aria-label={`View details for ${item.name}`}
      >
        {coverUrl && !imageFailed ? (
          <img
            src={coverUrl}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="grid h-full place-items-center px-4 text-center text-xs text-brand-muted">Artwork unavailable</div>
        )}
      </button>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="eyebrow truncate">{typeLabel || 'Library'}</span>
          {featured && (
            <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-brand-accent">Featured</span>
          )}
        </div>

        <div className="min-w-0">
          <h3 className="display text-lg leading-snug text-brand-text sm:text-xl">
            <span className="line-clamp-2">{item.name}</span>
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-brand-muted">
            {item.description || 'Download details and source files are available in the item view.'}
          </p>
        </div>

        <p className="mt-auto truncate border-t border-brand-border pt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-brand-muted" aria-label="Genres">
          {genres.length > 0 ? genres.slice(0, 2).join(' · ') : 'General'}
        </p>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="secondary" size="sm" className="w-full" onClick={onViewDetails}>Details</Button>
          <a
            href={item.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-10 items-center justify-center rounded-none border border-brand-accent bg-brand-accent px-3 text-[13px] font-medium text-brand-on-accent transition-colors hover:border-brand-accent-strong hover:bg-brand-accent-strong"
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
