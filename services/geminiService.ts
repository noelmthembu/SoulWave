
import { GoogleGenAI } from "@google/genai";

// FIX: Aligned with Gemini API guidelines.
// Initialize the GoogleGenAI client assuming the API key is available in environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateDescriptionForSamplePack = async (packName: string): Promise<string> => {
    // FIX: Aligned with Gemini API guidelines by removing API key validity checks
    // and simplifying error handling.
    try {
        const prompt = `Generate a compelling, short marketing description for a music sample pack titled "${packName}". Focus on the mood, genre, and type of sounds included. Keep it under 60 words and make it sound exciting for music producers.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error generating description with Gemini:", error);
        // Provide a user-friendly error message.
        return "Failed to generate description. Please write one manually.";
    }
};
