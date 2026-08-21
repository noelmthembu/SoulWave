import { Genre, Plugin, Preset, SamplePack } from '../types';

type ContentType = 'Pack' | 'Preset' | 'Plugin';

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message?: string }>;
}

const CATALOG_ENDPOINT = '/api/catalog';

async function graphqlRequest<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const response = await fetch(CATALOG_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });

  const payload = await response.json().catch(() => null) as GraphQLResponse<T> | null;
  if (!response.ok || !payload || payload.errors || !payload.data) {
    const reason = payload?.errors?.map((error) => error.message).filter(Boolean).join(', ') || 'Catalog request failed';
    throw new Error(reason);
  }
  return payload.data;
}

function normalizeContent<T>(item: unknown, type: ContentType): T {
  const source = (item || {}) as Record<string, unknown>;
  const rawGenres = source.genre;
  const genre = Array.isArray(rawGenres)
    ? rawGenres.map((value) => typeof value === 'string' ? value : (value as { name?: string })?.name || 'General')
    : typeof rawGenres === 'string' ? [rawGenres] : [];
  const rawCoverArt = source.coverArt;
  const coverArt = Array.isArray(rawCoverArt) ? rawCoverArt : rawCoverArt ? [rawCoverArt] : [];

  return { ...source, itemType: type, genre, coverArt } as T;
}

const FALLBACK_GENRES: Genre[] = [
  { id: 'g-1', name: 'Amapiano', slug: 'amapiano' },
  { id: 'g-2', name: 'Afro House', slug: 'afro-house' },
  { id: 'g-3', name: 'Hip Hop', slug: 'hip-hop' },
  { id: 'g-4', name: 'R&B', slug: 'rnb' },
  { id: 'g-5', name: 'Deep House', slug: 'deep-house' },
  { id: 'g-6', name: 'Trap', slug: 'trap' },
];

const FALLBACK_PACKS: SamplePack[] = [
  {
    id: 'pack-1',
    name: 'Amapiano Log Drum Mastery',
    slug: 'amapiano-log-drum-mastery',
    description: 'Punchy 808s, harmonic log drums, shakers, and percussive loops essential for private school and modern Amapiano production.',
    downloadUrl: 'https://drive.google.com',
    featured: true,
    genre: ['Amapiano', 'Afro House'],
    coverArt: [{ url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80' }],
    itemType: 'Pack',
  },
  {
    id: 'pack-2',
    name: 'Midnight Soul Rhodes & Keys',
    slug: 'midnight-soul-rhodes-keys',
    description: 'Lush neo-soul progressions, warm electric piano chords, and melodic one-shots with authentic analog warmth.',
    downloadUrl: 'https://drive.google.com',
    featured: true,
    genre: ['R&B', 'Hip Hop'],
    coverArt: [{ url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80' }],
    itemType: 'Pack',
  },
  {
    id: 'pack-3',
    name: 'Afro-Tech Club Essentials',
    slug: 'afro-tech-club-essentials',
    description: 'Hypnotic rolling basslines, tribal percussions, atmospheric FX, and rhythm stems engineered for the dancefloor.',
    downloadUrl: 'https://drive.google.com',
    featured: true,
    genre: ['Deep House', 'Afro House'],
    coverArt: [{ url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80' }],
    itemType: 'Pack',
  },
];

const FALLBACK_PRESETS: Preset[] = [
  {
    id: 'preset-1',
    name: 'Vintage Synth & Pad Patches',
    slug: 'vintage-synth-pad-patches',
    description: 'Rich analog-modeled polyphonic pads, expressive leads, and warm ambient soundscapes for your favorite synths.',
    downloadUrl: 'https://drive.google.com',
    genre: ['R&B', 'Trap'],
    pluginCompatibility: 'Serum / Vital',
    coverArt: [{ url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80' }],
    itemType: 'Preset',
  },
  {
    id: 'preset-2',
    name: 'Deep Sub & 808 Presets',
    slug: 'deep-sub-808-presets',
    description: 'Clean sub-bass tones and saturated 808 patches calibrated with tuned attack envelopes for low-end punch.',
    downloadUrl: 'https://drive.google.com',
    genre: ['Hip Hop', 'Trap'],
    pluginCompatibility: 'Vital',
    coverArt: [{ url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80' }],
    itemType: 'Preset',
  },
];

const FALLBACK_PLUGINS: Plugin[] = [
  {
    id: 'plugin-1',
    name: 'Vital Spectral Synth',
    slug: 'vital-spectral-synth',
    description: 'A powerful visual wavetable synth with high quality oscillators, flexible modulation, and an intuitive modern interface.',
    downloadUrl: 'https://vital.audio',
    genre: ['Electronic', 'Hip Hop'],
    coverArt: [{ url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80' }],
    itemType: 'Plugin',
  },
  {
    id: 'plugin-2',
    name: 'Spitfire LABS',
    slug: 'spitfire-labs',
    description: 'An infinite collection of free, high-end virtual instruments made by music makers in London for every producer.',
    downloadUrl: 'https://labs.spitfireaudio.com',
    genre: ['Acoustic', 'Cinematic'],
    coverArt: [{ url: 'https://images.unsplash.com/photo-1520523839898-50712405e60e?auto=format&fit=crop&w=600&q=80' }],
    itemType: 'Plugin',
  },
];

export const getGenres = async (): Promise<Genre[]> => {
  try {
    const data = await graphqlRequest<{ genres?: Genre[] }>('query GetGenres { genres(orderBy: name_ASC) { id name slug } }');
    if (data.genres && data.genres.length > 0) return data.genres;
  } catch {
    // Fall back to predefined genres
  }
  return FALLBACK_GENRES;
};

export const getSamplePacks = async (): Promise<SamplePack[]> => {
  try {
    const data = await graphqlRequest<{ samplePacks?: unknown[] }>(`
      query GetSamplePacks {
        samplePacks(first: 120) {
          id name description downloadUrl featured slug genre
          coverArt { url }
        }
      }
    `);
    if (data.samplePacks && data.samplePacks.length > 0) {
      return data.samplePacks.map((item) => normalizeContent<SamplePack>(item, 'Pack'));
    }
  } catch {
    // Fall back
  }
  return FALLBACK_PACKS;
};

export const getPresets = async (): Promise<Preset[]> => {
  try {
    const data = await graphqlRequest<{ presets?: unknown[] }>(`
      query GetPresets {
        presets(first: 120) {
          id name slug description downloadUrl
          coverArt { url }
        }
      }
    `);
    if (data.presets && data.presets.length > 0) {
      return data.presets.map((item) => normalizeContent<Preset>(item, 'Preset'));
    }
  } catch {
    // Fall back
  }
  return FALLBACK_PRESETS;
};

export const getPlugins = async (): Promise<Plugin[]> => {
  try {
    const data = await graphqlRequest<{ plugins?: unknown[] }>(`
      query GetPlugins {
        plugins(first: 120) {
          id name slug description downloadUrl
          coverArt { url }
        }
      }
    `);
    if (data.plugins && data.plugins.length > 0) {
      return data.plugins.map((item) => normalizeContent<Plugin>(item, 'Plugin'));
    }
  } catch {
    // Fall back
  }
  return FALLBACK_PLUGINS;
};
