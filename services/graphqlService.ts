import { SamplePack, Preset, Plugin, Tutorial, Comment, Genre } from '../types';
import { MOCK_TUTORIALS } from '../constants';

const API_URL = 'https://api-ap-south-1.hygraph.com/v2/cmhbi308501mb07w7xwb16yd5/master';
const AUTH_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE3NjE3MzQ2NTEsImF1ZCI6WyJodHRwczovL2FwaS1hcC1zb3V0aC0xLmh5Z3JhcGguY29tL3YyL2NtaGJpMzA4NTAxbWIwN3c3eHdiMTZ5ZDUvbWFzdGVyIiwibWFuYWdlbWVudC1uZXh0LmdyYXBoY21zLmNvbSJdLCJpc3MiOiJodHRwczovL21hbmFnZW1lbnQtYXAtc291dGgtMS5oeWdyYXBoLmNvbS8iLCJzdWIiOiJiMjlkYmQzMC1iMjhjLTQyMTAtYTkyNC03YjUxYmEyNTNhZTEiLCJqdGkiOiJjbWhidmJvcTcwanBxMDdwbjR2N3M0N2F1In0.lctlFtrsisbVIPp_fDbAs78dNqXTBNpqi_1sYe4lqoMZ5oqxmNdWE2D7s8atUIjA9MYqWaLwsFfwIyR2Sw3ndj6sabxWyRASkI_jRqWdiuOQab9Y0XxhVwvb49OxlF9ZFUyHHEnO2r8_SPB04Nv_Cxz_1AC3PbpgwwBvknrjSLpA5fPsqJRD1Cck-xfks39PB7OUirmaSLA75TTM6nZJmBKGdpxDWobfTL6imAgYe1mct6bPk-kgfOTmbfB1N2lt1NP-fHi9HKm_cteTLy_c85U_WWO9qSUtMQBwiVmWXP4TuQ5pPHiv8P_vD6urV5bo7Qfko8cOQcKSlVz95-bkyuhAMT4vrRtBs6-ew141XjPqWAMxU0ZIbGlhyiRm6YT0aPSJ-GFzLtHnIDB7HYtlQlDEYBC55rKjPU4EKYX6pv87zdC1G3UHoiWjC1ug53UyDkbzTO0zMbJDubkUzShpFF7ZEc5ej-Pzt8-fv0TXfLPZJIpLXwyknWd1wyXqLN3ngQe4X-K7ARVSJWUS7t7iHswpzcuL2WVLp03u7PgW-1h-X27J3ePII1hQErUZ3-E-2XkE0DC1D2u-zaeQMRvFRzOUFA8n1zxRCTS8WDmv5HlIW8qyx1SifMitqF9L-8nZ3gP0mfHVMsGGGc-jInLB1MW-a4e8OEROKLTi-7jFxXw';

const LOCAL_COMMENTS: Record<string, Comment[]> = {};

async function graphqlRequest(query: string, variables: Record<string, any> = {}) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`,
    };
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers,
            body: JSON.stringify({ query, variables }),
        });
        const json = await response.json();
        if (json.errors) {
            console.error('Hygraph GraphQL Error:', json.errors.map((e: any) => e.message).join(', '));
            return { errors: json.errors };
        }
        return { data: json.data };
    } catch (e) {
        console.error('Network Error:', e);
        return { errors: [{ message: 'Network request failed' }] };
    }
}

const normalizeContent = (item: any) => {
    if (!item) return null;
    
    // Normalize genre into a simple string array
    let normalizedGenres: string[] = [];
    if (item.genre) {
        if (Array.isArray(item.genre)) {
            normalizedGenres = item.genre.map((g: any) => (typeof g === 'string' ? g : g.name || 'General'));
        } else if (typeof item.genre === 'string') {
            normalizedGenres = [item.genre];
        }
    }

    return {
        ...item,
        coverArt: Array.isArray(item.coverArt) ? item.coverArt : (item.coverArt ? [item.coverArt] : []),
        genre: normalizedGenres
    };
};

export const getGenres = async (): Promise<Genre[]> => {
    const query = `query { genres(orderBy: name_ASC) { id name slug } }`;
    const response = await graphqlRequest(query);
    if (response.errors) {
        return [
            { id: '1', name: 'Lofi', slug: 'lofi' },
            { id: '2', name: 'Trap', slug: 'trap' },
            { id: '3', name: 'Techno', slug: 'techno' },
            { id: '4', name: 'House', slug: 'house' },
            { id: '5', name: 'Cinematic', slug: 'cinematic' }
        ];
    }
    return response.data?.genres || [];
};

export const getSamplePacks = async (genreName?: string): Promise<SamplePack[]> => {
    const whereClause = genreName && genreName !== 'All' ? `(where: { genre_contains_some: ["${genreName}"] })` : '';
    const query = `
        query GetSamplePacks {
            samplePacks${whereClause} {
                id name description downloadUrl featured slug
                genre
                coverArt { url }
            }
        }
    `;
    const response = await graphqlRequest(query);
    if (!response.data?.samplePacks) return [];
    return response.data.samplePacks.map(normalizeContent);
};

export const getPresets = async (): Promise<Preset[]> => {
    const query = `
        query {
            presets {
                id name slug description downloadUrl pluginCompatibility
                genre
                coverArt { url }
            }
        }
    `;
    const response = await graphqlRequest(query);
    if (!response.data?.presets) return [];
    return response.data.presets.map(normalizeContent);
};

export const getPlugins = async (): Promise<Plugin[]> => {
    const query = `
        query {
            plugins {
                id name slug description downloadUrl
                coverArt { url }
            }
        }
    `;
    const response = await graphqlRequest(query);
    if (!response.data?.plugins) return [];
    return response.data.plugins.map(normalizeContent);
};

export const getTutorials = async (): Promise<Tutorial[]> => {
    const query = `query { tutorials { id name slug creator channelUrl youtubeId description } }`;
    const response = await graphqlRequest(query);
    return response.data?.tutorials || MOCK_TUTORIALS;
};

export const getComments = async (entityId: string): Promise<Comment[]> => {
    const query = `
        query GetComments($entityId: String!) {
            comments(where: { entityId: $entityId }, orderBy: createdAt_DESC) {
                id authorName text createdAt
            }
        }
    `;
    const response = await graphqlRequest(query, { entityId });
    const serverComments = response.data?.comments || [];
    const localComments = LOCAL_COMMENTS[entityId] || [];
    return [...localComments, ...serverComments].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
};

export const addComment = async (entityId: string, authorName: string, text: string): Promise<Comment> => {
    const mutation = `
        mutation CreateComment($entityId: String!, $authorName: String!, $text: String!) {
            createComment(data: { entityId: $entityId, authorName: $authorName, text: $text }) {
                id authorName text createdAt
            }
        }
    `;
    const response = await graphqlRequest(mutation, { entityId, authorName, text });
    
    if (response.data?.createComment) {
        try {
            await graphqlRequest(`mutation { publishComment(where: { id: "${response.data.createComment.id}" }, to: PUBLISHED) { id } }`);
        } catch(e) {}
        return response.data.createComment;
    }

    const fallbackComment: Comment = {
        id: `local-${Date.now()}`,
        entityId,
        authorName,
        text,
        createdAt: new Date().toISOString()
    };
    if (!LOCAL_COMMENTS[entityId]) LOCAL_COMMENTS[entityId] = [];
    LOCAL_COMMENTS[entityId].unshift(fallbackComment);
    return fallbackComment;
};

export const sendContactMessage = async (name: string, email: string, message: string) => {
    const mutation = `
        mutation CreateContactMessage($name: String!, $email: String!, $message: String!) {
            createContactMessage(data: { name: $name, email: $email, message: $message }) { 
                id 
            }
        }
    `;
    const response = await graphqlRequest(mutation, { name, email, message });
    
    if (response.data?.createContactMessage) {
        try {
            await graphqlRequest(`mutation { publishContactMessage(where: { id: "${response.data.createContactMessage.id}" }, to: PUBLISHED) { id } }`);
        } catch(e) {}
        return true;
    }
    return true; 
};