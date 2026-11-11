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
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-brand-text/70 p-3 sm:p-6"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="relative my-auto flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden border border-brand-border bg-brand-surface md:grid md:grid-cols-[minmax(15rem,0.85fr)_minmax(0,1.15fr)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="absolute right-0 top-0 z-20 grid h-11 w-11 place-items-center border-b border-l border-brand-border bg-brand-surface text-brand-text transition-colors hover:bg-brand-raised"
          aria-label="Close details"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="relative aspect-[4/3] w-full border-b border-brand-border bg-brand-raised md:aspect-auto md:h-full md:border-b-0 md:border-r">
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
          <div className="pr-12">
            <p className="eyebrow">{item.itemType || 'Library item'}</p>
            <h2 id={titleId} className="display mt-2 break-words text-2xl leading-tight text-brand-text sm:text-3xl">{item.name}</h2>
            <p id={descriptionId} className="mt-3 break-words text-sm leading-relaxed text-brand-muted sm:text-base">
              {item.description || 'No additional description is available for this item.'}
            </p>
            {genres.length > 0 && (
              <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-brand-muted">
                {genres.join(' · ')}
              </p>
            )}
          </div>

          <div className="mt-auto border-t border-brand-border pt-5 sm:pt-6">
            <a
              href={item.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 w-full items-center justify-center border border-brand-accent bg-brand-accent px-5 text-center text-sm font-medium text-brand-on-accent transition-colors hover:border-brand-accent-strong hover:bg-brand-accent-strong sm:text-base"
            >
              {downloadText}
            </a>
            <p className="mt-3 text-center text-xs leading-5 text-brand-muted">Downloads open in a new tab. Verify files before opening.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentModal;
