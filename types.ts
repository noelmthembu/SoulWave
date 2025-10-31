
export interface SamplePack {
  id: string;
  name: string;
  creator: string;
  coverArt: ImageType[];
  genre: string[];
  description: string;
  longDescription: string;
  downloadUrl: string;
}
export interface ImageType{
  url: string;
}
export interface Tutorial {
  id: string; // YouTube video ID
  title: string;
  description:string;
  channel: string;
}

export interface User {
  id: string;
  email: string | null;
  isAdmin: boolean;
}

export interface Comment {
  id: string;
  packId: string;
  author: string;
  text: string;
  createdAt: string;
}