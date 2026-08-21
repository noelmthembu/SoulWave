import React, { useEffect, useId, useRef, useState } from 'react';
import { BaseContent, Plugin, Preset, SamplePack } from '../types';
import { X } from 'lucide-react';

interface ContentModalProps {
  item: BaseContent | SamplePack | Preset | Plugin;
  onClose: () => void;
}

const focusableSelector = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const ContentModal: React.FC<ContentModalProps> = ({ item, onClose }) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);
  const [imageFailed, setImageFailed] = useState(false);
  const titleId = useId();
  const descriptionId = useId();
  const coverUrl = item.coverArt?.[0]?.url;
  const genres = 'genre' in item && Array.isArray(item.genre) ? item.genre : [];

  useEffect(() => {
    previouslyFocusedElement.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => closeButtonRef.current?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusableElements: HTMLElement[] = [...dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector)];
      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocusedElement.current?.focus();
    };
  }, [onClose]);

  const downloadText = item.itemType === 'Plugin'
    ? 'Open plugin download'
    : item.itemType === 'Preset'
      ? 'Open preset download'
      : 'Open pack download';

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-brand-canvas/90 p-3 sm:p-6"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="flex min-h-full items-center justify-center">
        <div
          ref={dialogRef}
          className="relative grid w-full max-w-4xl overflow-hidden rounded-xl border border-brand-border bg-brand-surface shadow-2xl md:grid-cols-[minmax(15rem,0.8fr)_minmax(0,1.2fr)]"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
        >
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-lg border border-brand-border bg-brand-canvas/95 text-brand-text hover:bg-brand-raised"
            aria-label="Close details"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>

          <div className="aspect-[4/3] bg-brand-raised md:aspect-auto">
            {coverUrl && !imageFailed ? (
              <img
                src={coverUrl}
                alt=""
                className="h-full w-full object-cover"
                onError={() => setImageFailed(true)}
              />
            ) : (
              <div className="grid h-full min-h-56 place-items-center px-6 text-center text-sm text-brand-muted">Artwork unavailable</div>
            )}
          </div>

          <div className="flex min-w-0 flex-col p-6 sm:p-8">
            <div className="pr-12">
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded-md bg-brand-raised px-2 py-1 text-xs font-semibold text-brand-subtle">{item.itemType || 'Library item'}</span>
                {genres.map((genre) => <span key={genre} className="rounded-md border border-brand-border px-2 py-1 text-xs text-brand-muted">{genre}</span>)}
              </div>
              <h2 id={titleId} className="break-words text-2xl font-bold tracking-[-0.03em] text-brand-text sm:text-3xl">{item.name}</h2>
              <p id={descriptionId} className="mt-4 break-words text-sm leading-7 text-brand-subtle sm:text-base">{item.description || 'No additional description is available for this item.'}</p>
            </div>

            <div className="mt-8 border-t border-brand-border pt-5">
              <a
                href={item.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-brand-cyan bg-brand-cyan px-5 text-center text-sm font-semibold text-brand-ink transition-colors hover:border-brand-cyan-strong hover:bg-brand-cyan-strong"
              >
                {downloadText}
              </a>
              <p className="mt-3 text-xs leading-5 text-brand-muted">Downloads open in a new tab. Review the source before installing any software.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentModal;
