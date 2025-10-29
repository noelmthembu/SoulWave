
import React from 'react';
import { Tutorial } from './types';

// Sample pack mock data is no longer used. Data is fetched from Supabase.

export const MOCK_TUTORIALS: Tutorial[] = [
    {
        id: '0pLgI8qWnE4',
        title: 'Making a Lofi Hip Hop Beat',
        channel: 'In The Mix',
        description: 'Learn the fundamentals of creating a chill lofi beat from scratch, covering drum programming, sampling, and mixing techniques.'
    },
    {
        id: 'lX1v4N5A4aI',
        title: 'Synthwave Production Masterclass',
        channel: 'Venus Theory',
        description: 'Dive deep into the sound design and arrangement of retro-futuristic synthwave music. Create iconic 80s sounds with modern synths.'
    },
    {
        id: 'DAc_Y_6g7Gk',
        title: 'How to Make Future Bass',
        channel: 'ARTFX',
        description: 'A comprehensive guide to producing Future Bass, focusing on sound design for saws, chords, and creating a massive drop.'
    },
    {
        id: 'aJb3mhGk44E',
        title: 'Drum & Bass Production Tips',
        channel: 'Stranjah',
        description: 'Discover the secrets behind powerful Drum & Bass tracks, from complex breakbeats to earth-shattering bass design.'
    }
];

// FIX: Changed component type from React.FC to a standard functional component to resolve SVG prop type conflicts.
export const PlayIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L7.279 20.99c-1.25.717-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
    </svg>
);

// FIX: Changed component type from React.FC to a standard functional component to resolve SVG prop type conflicts.
export const UploadIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 011.06 0l4.5 4.5a.75.75 0 01-1.06 1.06l-3.22-3.22V16.5a.75.75 0 01-1.5 0V4.81L8.03 8.03a.75.75 0 01-1.06-1.06l4.5-4.5zM3 15.75a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
  </svg>
);

// FIX: Changed component type from React.FC to a standard functional component to resolve SVG prop type conflicts.
export const SparklesIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 019.75 22.5a.75.75 0 01-.75-.75v-4.131A15.838 15.838 0 016.382 15H2.25a.75.75 0 01-.75-.75 6.75 6.75 0 017.815-6.666zM15 6.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" clipRule="evenodd" />
        <path d="M5.26 17.242a.75.75 0 10-1.06-1.06 7.5 7.5 0 0110.607-10.607.75.75 0 00-1.06 1.06 6 6 0 00-8.485 8.485z" />
    </svg>
);

export const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
    </svg>
);
