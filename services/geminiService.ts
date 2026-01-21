
import { GoogleGenAI } from "@google/genai";

// FIX: Aligned with Gemini API guidelines.
// Initialize the GoogleGenAI client using named parameter and environment variable.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDescriptionForSamplePack = async (packName: string): Promise<string> => {
    // FIX: Updated to use recommended model and direct property access.
    try {
        const prompt = `Generate a compelling, short marketing description for a music sample pack titled "${packName}". Focus on the mood, genre, and type of sounds included. Keep it under 60 words and make it sound exciting for music producers.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });

        // FIX: Access the .text property directly from the response object.
        return response.text || "Failed to generate description. Please write one manually.";
    } catch (error) {
        console.error("Error generating description with Gemini:", error);
        // Provide a user-friendly error message.
        return "Failed to generate description. Please write one manually.";
    }
};
