export interface ImageType {
  url: string;
}

export interface Genre {
  id: string;
  name: string;
  slug: string;
}

export interface BaseContent {
  id: string;
  name: string;
  slug: string;
  coverArt: ImageType[];
  description: string;
  downloadUrl: string;
}

export interface SamplePack extends BaseContent {
  genre: string[];
  featured?: boolean;
}

export interface Preset extends BaseContent {
  genre: string[];
  pluginCompatibility: string;
}

export interface Plugin extends BaseContent {
  genre: string[];
}

export interface Tutorial {
  id: string;
  name: string;
  slug: string;
  creator: string;
  channelUrl: string;
  youtubeId: string;
  description: string;
}

export interface Comment {
  id: string;
  entityId: string;
  authorName: string; // Reverted from name
  text: string;
  createdAt: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}