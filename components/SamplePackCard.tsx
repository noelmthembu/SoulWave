import React from 'react';
import { SamplePack } from '../types';
import Button from './Button';

// --- Sub-Component 1: Cover Art with Overlay ---
interface CoverArtProps {
  coverArt: SamplePack['coverArt'];
  packName: string;
}

const CoverArt: React.FC<CoverArtProps> = ({ coverArt, packName }) => {
  // Safely extract the URL from the first item in the coverArt array.
  const coverArtUrl = coverArt.length > 0 ? coverArt[0].url : '';

  return (
    <div className="relative">
      <img
        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        src={coverArtUrl}
        alt={packName}
      />
      {/* Overlay for 'View Details' */}
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="text-white font-bold border-2 border-white rounded-md px-4 py-2 text-sm">
          View Details
        </span>
      </div>
    </div>
  );
};

// --- Sub-Component 2: Pack Info (Title, Creator, Genres) ---
interface PackInfoProps {
  pack: SamplePack;
}

const PackInfo: React.FC<PackInfoProps> = ({ pack }) => (
  <div className="p-4">
    <h3 className="text-lg font-bold text-white truncate">{pack.name}</h3>
    <p className="text-sm text-gray-400">{pack.creator}</p>
    <div className="mt-2 flex flex-wrap gap-2">
      {pack.genre.map((g) => (
        <span
          key={g}
          className="px-2 py-1 bg-gray-700 text-xs text-gray-300 rounded-full"
        >
          {g}
        </span>
      ))}
    </div>
  </div>
);

// --- Main Component: SamplePackCard ---
interface SamplePackCardProps {
  pack: SamplePack;
  onViewDetails: () => void;
}

const SamplePackCard: React.FC<SamplePackCardProps> = ({ pack, onViewDetails }) => {
  return (
    <div className="bg-brand-light-dark rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-brand-cyan/20 hover:-translate-y-1 group flex flex-col">
      {/* Clickable Card Body */}
      <button
        onClick={onViewDetails}
        className="block flex-grow text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-cyan rounded-t-lg"
      >
        <CoverArt coverArt={pack.coverArt} packName={pack.name} />
        <PackInfo pack={pack} />
      </button>

      {/* Download Button Section */}
      <div className="p-4 pt-0 mt-auto">
        <a
          href={pack.downloadUrl}
          download
          onClick={(e) => e.stopPropagation()}
          className="block" target="_blank"
        >
          <Button size="md" className="w-full">
            Download
          </Button>
        </a>
      </div>
    </div>
  );
};

export default SamplePackCard;