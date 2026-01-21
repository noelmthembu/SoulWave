import React from 'react';
import { Tutorial } from '../types';

interface TutorialCardProps {
  tutorial: Tutorial;
}

const TutorialCard: React.FC<TutorialCardProps> = ({ tutorial }) => {
  return (
    <div className="group bg-brand-panel border border-white/5 rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-cyan/5 flex flex-col h-full">
      <div className="relative aspect-video shrink-0 bg-brand-dark">
        <iframe
          src={`https://www.youtube.com/embed/${tutorial.youtubeId}`}
          title={tutorial.name}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full grayscale-[40%] group-hover:grayscale-0 transition-all duration-700"
        ></iframe>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-brand-cyan/10 flex items-center justify-center text-[14px]">🎬</div>
          <a 
            href={tutorial.channelUrl || `https://www.youtube.com/results?search_query=${encodeURIComponent(tutorial.creator)}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[10px] font-black text-brand-cyan uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1.5"
          >
            {tutorial.creator}
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
          </a>
        </div>
        <h3 className="text-xl font-black text-white mb-2 line-clamp-2 leading-tight group-hover:text-brand-cyan transition-colors">{tutorial.name}</h3>
        <p className="text-sm text-brand-muted line-clamp-2 mb-6 leading-relaxed flex-grow">
          {tutorial.description}
        </p>
        <button 
          onClick={() => window.open(`https://www.youtube.com/watch?v=${tutorial.youtubeId}`, '_blank')}
          className="text-white bg-white/5 hover:bg-brand-cyan hover:text-brand-dark px-4 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all self-start border border-white/5"
        >
          Watch on YouTube
        </button>
      </div>
    </div>
  );
};

export default TutorialCard;