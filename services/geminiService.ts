
import { GoogleGenAI } from "@google/genai";
import { SamplePack } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateDescriptionForSamplePack = async (packName: string): Promise<string> => {
    try {
        const prompt = `Generate a compelling, short marketing description for a music sample pack titled "${packName}". Focus on the mood, genre, and type of sounds included. Keep it under 60 words and make it sound exciting for music producers.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error generating description with Gemini:", error);
        return "Failed to generate description. Please write one manually.";
    }
};

export const generateCommentWithGemini = async (pack: SamplePack): Promise<string> => {
    try {
        const prompt = `You are a music producer reviewing a sample pack. Write a brief, authentic comment (2-3 sentences) about the sample pack "${pack.name}" by ${pack.creator}. Genre: ${pack.genre.join(', ')}. Description: ${pack.description}. Make it sound natural and enthusiastic, like a real person would write it. Don't use hashtags or overly promotional language.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error generating comment with Gemini:", error);
        throw new Error("Failed to generate AI comment");
    }
};
