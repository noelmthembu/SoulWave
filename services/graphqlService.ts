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

export const getGenres = async (): Promise<Genre[]> => {
  const data = await graphqlRequest<{ genres?: Genre[] }>('query GetGenres { genres(orderBy: name_ASC) { id name slug } }');
  return data.genres || [];
};

export const getSamplePacks = async (): Promise<SamplePack[]> => {
  const data = await graphqlRequest<{ samplePacks?: unknown[] }>(`
    query GetSamplePacks {
      samplePacks(first: 120) {
        id name description downloadUrl featured slug genre
        coverArt { url }
      }
    }
  `);
  return (data.samplePacks || []).map((item) => normalizeContent<SamplePack>(item, 'Pack'));
};

export const getPresets = async (): Promise<Preset[]> => {
  const data = await graphqlRequest<{ presets?: unknown[] }>(`
    query GetPresets {
      presets(first: 120) {
        id name slug description downloadUrl
        coverArt { url }
      }
    }
  `);
  return (data.presets || []).map((item) => normalizeContent<Preset>(item, 'Preset'));
};

export const getPlugins = async (): Promise<Plugin[]> => {
  const data = await graphqlRequest<{ plugins?: unknown[] }>(`
    query GetPlugins {
      plugins(first: 120) {
        id name slug description downloadUrl
        coverArt { url }
      }
    }
  `);
  return (data.plugins || []).map((item) => normalizeContent<Plugin>(item, 'Plugin'));
};
