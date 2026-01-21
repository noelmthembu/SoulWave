import React from 'react';
import { SamplePack } from '../types';
import Button from './Button';

interface SamplePackCardProps {
  pack: SamplePack;
  onViewDetails: () => void;
}

const SamplePackCard: React.FC<SamplePackCardProps> = ({ pack, onViewDetails }) => {
  const coverUrl = pack.coverArt?.[0]?.url || 'https://via.placeholder.com/400';
  const genres = pack.genre || [];

  return (
    <div className="group bg-brand-panel border border-white/5 rounded-[2rem] overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-cyan/10 flex flex-col h-full">
      <div 
        className="relative aspect-square w-full overflow-hidden cursor-pointer bg-brand-dark/40" 
        onClick={onViewDetails}
      >
        <img 
          src={coverUrl} 
          alt={pack.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          loading="lazy"
        />
        <div className="absolute inset-0 bg-brand-dark/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full font-bold text-sm tracking-widest uppercase text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            Quick View
          </div>
        </div>
        {pack.featured && (
          <div className="absolute top-4 left-4 bg-brand-cyan text-brand-dark font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg z-10">
            Featured
          </div>
        )}
      </div>

      <div className="p-6 flex-grow flex flex-col">
        <div className="mb-4">
          <h3 className="text-lg font-black text-white truncate group-hover:text-brand-cyan transition-colors">
            {pack.name}
          </h3>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-6">
          {genres.length > 0 ? genres.slice(0, 3).map(g => (
            <span key={g} className="px-2.5 py-0.5 bg-white/5 rounded-full text-[10px] font-bold text-brand-muted uppercase tracking-wider border border-white/5">
              {g}
            </span>
          )) : (
            <span className="px-2.5 py-0.5 bg-white/5 rounded-full text-[10px] font-bold text-brand-muted/40 uppercase tracking-wider border border-white/5">
              General
            </span>
          )}
          {genres.length > 3 && (
            <span className="text-[10px] text-brand-muted font-bold self-center">+{genres.length - 3}</span>
          )}
        </div>

        <div className="mt-auto grid grid-cols-2 gap-3">
          <Button 
            variant="secondary" 
            size="sm" 
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl"
            onClick={onViewDetails}
          >
            Details
          </Button>
          <a href={pack.downloadUrl} target="_blank" rel="noopener noreferrer" className="block w-full">
            <Button size="sm" className="w-full rounded-xl">
              Get
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SamplePackCard;