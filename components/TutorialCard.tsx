
import React from 'react';
import { Tutorial } from '../types';

interface TutorialCardProps {
  tutorial: Tutorial;
}

const TutorialCard: React.FC<TutorialCardProps> = ({ tutorial }) => {
  return (
    <div className="bg-brand-light-dark rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-brand-cyan/20 hover:-translate-y-1">
      <div className="aspect-w-16 aspect-h-9">
        <iframe
          src={`https://www.youtube.com/embed/${tutorial.id}`}
          title={tutorial.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        ></iframe>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-white line-clamp-2">{tutorial.title}</h3>
        <p className="text-sm text-gray-400 mt-1">by {tutorial.channel}</p>
        <p className="text-sm text-gray-300 mt-2 line-clamp-3">{tutorial.description}</p>
      </div>
    </div>
  );
};

export default TutorialCard;
