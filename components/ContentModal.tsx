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
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-brand-canvas/90 p-4 sm:p-6 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="relative my-auto flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-brand-border bg-brand-surface shadow-2xl md:grid md:grid-cols-[minmax(16rem,0.9fr)_minmax(0,1.2fr)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-20 grid h-10 w-10 place-items-center rounded-full border border-brand-border bg-brand-canvas/90 text-brand-text shadow-md transition-colors hover:bg-brand-raised"
          aria-label="Close details"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="relative aspect-[16/10] w-full bg-brand-raised md:aspect-auto md:h-full">
          {coverUrl && !imageFailed ? (
            <img
              src={coverUrl}
              alt=""
              className="h-full w-full object-cover"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="grid h-full min-h-48 place-items-center px-6 text-center text-sm text-brand-muted">Artwork unavailable</div>
          )}
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto p-5 sm:p-7">
          <div className="pr-8 sm:pr-10">
            <div className="mb-3 flex flex-wrap gap-1.5">
              <span className="rounded-md bg-brand-raised px-2.5 py-1 text-xs font-bold text-brand-cyan">{item.itemType || 'Library item'}</span>
              {genres.map((genre) => (
                <span key={genre} className="rounded-md border border-brand-border px-2.5 py-1 text-xs text-brand-muted">{genre}</span>
              ))}
            </div>
            <h2 id={titleId} className="break-words text-xl font-bold tracking-tight text-brand-text sm:text-2xl">{item.name}</h2>
            <p id={descriptionId} className="mt-3 break-words text-sm leading-relaxed text-brand-subtle sm:text-base">{item.description || 'No additional description is available for this item.'}</p>
          </div>

          <div className="mt-auto pt-6 border-t border-brand-border/60">
            <a
              href={item.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-brand-cyan bg-brand-cyan px-5 text-center text-sm sm:text-base font-bold text-brand-ink transition-colors hover:border-brand-cyan-strong hover:bg-brand-cyan-strong shadow-sm"
            >
              {downloadText}
            </a>
            <p className="mt-2.5 text-center text-xs leading-5 text-brand-muted">Downloads open in a new tab. Verify files before opening.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentModal;
