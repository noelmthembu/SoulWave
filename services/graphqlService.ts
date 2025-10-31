import { SamplePack, Comment } from '../types';

// ==================================================================
// This service is now connected to your Hygraph project.
// All content management should be done in your Hygraph dashboard.
// ==================================================================
const API_URL = 'https://api-ap-south-1.hygraph.com/v2/cmhbi308501mb07w7xwb16yd5/master';
const AUTH_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE3NjE3MzQ2NTEsImF1ZCI6WyJodHRwczovL2FwaS1hcC1zb3V0aC0xLmh5Z3JhcGguY29tL3YyL2NtaGJpMzA4NTAxbWIwN3c3eHdiMTZ5ZDUvbWFzdGVyIiwibWFuYWdlbWVudC1uZXh0LmdyYXBoY21zLmNvbSJdLCJpc3MiOiJodHRwczovL21hbmFnZW1lbnQtYXAtc291dGgtMS5oeWdyYXBoLmNvbS8iLCJzdWIiOiJiMjlkYmQzMC1iMjhjLTQyMTAtYTkyNC03YjUxYmEyNTNhZTEiLCJqdGkiOiJjbWhidmJvcTcwanBxMDdwbjR2N3M0N2F1In0.lctlFtrsisbVIPp_fDbAs78dNqXTBNpqi_1sYe4lqoMZ5oqxmNdWE2D7s8atUIjA9MYqWaLwsFfwIyR2Sw3ndj6sabxWyRASkI_jRqWdiuOQab9Y0XxhVwvb49OxlF9ZFUyHHEnO2r8_SPB04Nv_Cxz_1AC3PbpgwwBvknrjSLpA5fPsqJRD1Cck-xfks39PB7OUirmaSLA75TTM6nZJmBKGdpxDWobfTL6imAgYe1mct6bPk-kgfOTmbfB1N2lt1NP-fHi9HKm_cteTLy_c85U_WWO9qSUtMQBwiVmWXP4TuQ5pPHiv8P_vD6urV5bo7Qfko8cOQcKSlVz95-bkyuhAMT4vrRtBs6-ew141XjPqWAMxU0ZIbGlhyiRm6YT0aPSJ-GFzLtHnIDB7HYtlQlDEYBC55rKjPU4EKYX6pv87zdC1G3UHoiWjC1ug53UyDkbzTO0zMbJDubkUzShpFF7ZEc5ej-Pzt8-fv0TXfLPZJIpLXwyknWd1wyXqLN3ngQe4X-K7ARVSJWUS7t7iHswpzcuL2WVLp03u7PgW-1h-X27J3ePII1hQErUZ3-E-2XkE0DC1D2u-zaeQMRvFRzOUFA8n1zxRCTS8WDmv5HlIW8qyx1SifMitqF9L-8nZ3gP0mfHVMsGGGc-jInLB1MW-a4e8OEROKLTi-7jFxXw';

/**
 * A generic function to handle GraphQL requests to the Hygraph API.
 * @param query The GraphQL query or mutation.
 * @param variables The variables for the query or mutation.
 * @returns The data from the GraphQL response.
 */
async function graphqlRequest(query: string, variables: Record<string, any> = {}) {
    const headers: HeadersInit = {
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

        if (!response.ok) {
            console.error('HTTP Error Response:', json);
            throw new Error(`HTTP error! status: ${response.status} - ${JSON.stringify(json)}`);
        }

        if (json.errors) {
            console.error('GraphQL Error:', json.errors);
            throw new Error(json.errors.map((e: { message: string }) => e.message).join('\n'));
        }

        return json.data;
    } catch (error) {
        console.error("Network or GraphQL request error:", error);
        throw error;
    }
}

// Fetches all sample packs
export const getSamplePacks = async (): Promise<SamplePack[]> => {
    const query = `
        query GetSamplePacks {
            samplePacks {
    id
    name
    creator
    covertArt {
      url
    }
    genre
    description
    downloadUrl
  }
            
        }
    `;
    const data = await graphqlRequest(query);

    if (!data || !data.samplePacks) {
        console.error('No data returned from Hygraph');
        return [];
    }

    // Transform the data to match the frontend's expected SamplePack type
    return data.samplePacks.map((pack: any) => ({
        ...pack,
        coverArt: pack.coverArt || '',
        longDescription: pack.longDescription || pack.description || '',
    }));
};

// Fetches all comments for a specific sample pack
export const getCommentsForPack = async (packId: string): Promise<Comment[]> => {
    const query = `
        query GetCommentsForPack($packId: ID!) {
            comments(where: { samplePack: { id: $packId } }, orderBy: createdAt_DESC) {
                id
                author
                text
                createdAt
            }
        }
    `;
    const data = await graphqlRequest(query, { packId });
    // Add packId to each comment object for consistency
    return data.comments.map((comment: any) => ({...comment, packId}));
};

// Creates a new comment, connects it to a sample pack, and publishes it.
export const addComment = async (commentData: { packId: string; text: string; author: string }): Promise<Comment> => {
    const mutation = `
        mutation AddAndPublishComment($packId: ID!, $text: String!, $author: String!) {
            createComment(
                data: {
                    author: $author,
                    text: $text,
                    samplePack: { connect: { id: $packId } }
                }
            ) {
                id
                author
                text
                createdAt
            }
        }
    `;
    const createData = await graphqlRequest(mutation, commentData);
    const newCommentId = createData.createComment.id;
    
    // Now, publish the newly created comment so it's visible.
    const publishMutation = `
      mutation PublishComment($id: ID!) {
        publishComment(where: {id: $id}, to: PUBLISHED) {
          id
        }
      }
    `;
    await graphqlRequest(publishMutation, { id: newCommentId });

    return { ...createData.createComment, packId: commentData.packId };
};
