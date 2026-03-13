import React, { useEffect } from 'react';
import { SamplePack } from '../types';
import Button from './Button';
import { CloseIcon } from '../constants';

interface ContentModalProps {
  item: SamplePack;
  onClose: () => void;
}

const ContentModal: React.FC<ContentModalProps> = ({ item, onClose }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [item.slug, onClose]);

  const coverUrl = item.coverArt?.[0]?.url || 'https://via.placeholder.com/600';

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-brand-dark/95 backdrop-blur-xl animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="relative bg-brand-panel-light border border-white/10 w-full max-w-5xl max-h-[92vh] rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button - Always visible */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 bg-brand-dark/60 hover:bg-white/10 backdrop-blur-md rounded-full text-white transition-all z-50 border border-white/10 shadow-lg"
        >
          <CloseIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Image Section - Strict containment logic */}
        <div className="w-full md:w-5/12 lg:w-4/12 flex items-center justify-center bg-black/40 relative overflow-hidden shrink-0 h-[35vh] md:h-auto">
          {/* Ambient Glow Backdrop (derived from image) */}
          <div 
            className="absolute inset-0 opacity-20 blur-3xl scale-150 pointer-events-none"
            style={{ backgroundImage: `url(${coverUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
          
          <div className="relative z-10 w-full h-full p-4 sm:p-8 flex items-center justify-center">
            <img 
              src={coverUrl} 
              alt={item.name} 
              className="max-w-full max-h-full w-auto h-auto object-contain rounded-xl shadow-2xl transition-all duration-700" 
            />
          </div>
        </div>

        {/* Content Section - Priority Layout */}
        <div className="flex-1 min-w-0 p-6 sm:p-8 md:p-10 lg:p-12 overflow-y-auto custom-scrollbar flex flex-col bg-brand-panel-light/40">
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {(item.genre as string[] || []).map(g => (
                <span key={g} className="px-2.5 py-0.5 bg-brand-cyan/10 border border-brand-cyan/20 rounded-full text-[9px] sm:text-[10px] font-black text-brand-cyan uppercase tracking-widest">{g}</span>
              ))}
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black mb-1 text-white leading-tight break-words tracking-tighter">{item.name}</h2>
            
            <div className="mt-5 bg-white/5 p-5 sm:p-6 rounded-2xl border border-white/5 shadow-inner">
               <p className="text-brand-muted leading-relaxed text-sm sm:text-base">{item.description}</p>
            </div>
          </div>

          <div className="mb-8">
            <a href={item.downloadUrl} target="_blank" rel="noopener noreferrer" className="block">
              <Button size="lg" className="w-full py-5 text-lg font-black rounded-xl sm:rounded-2xl shadow-xl shadow-brand-cyan/10 active:scale-[0.98]">
                Download Free Pack
              </Button>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContentModal;