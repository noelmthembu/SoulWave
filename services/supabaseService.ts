import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Comment {
    id: string;
    pack_id: string;
    author: string;
    text: string;
    ai_generated: boolean;
    user_identifier: string | null;
    created_at: string;
}

export interface UserCredits {
    id: string;
    user_identifier: string;
    credits_remaining: number;
    created_at: string;
    updated_at: string;
}

export async function getUserCredits(userIdentifier: string): Promise<number> {
    const { data, error } = await supabase
        .from('user_credits')
        .select('credits_remaining')
        .eq('user_identifier', userIdentifier)
        .maybeSingle();

    if (error) {
        console.error('Error fetching credits:', error);
        return 0;
    }

    if (!data) {
        const { data: newUser, error: insertError } = await supabase
            .from('user_credits')
            .insert({ user_identifier: userIdentifier, credits_remaining: 10 })
            .select('credits_remaining')
            .single();

        if (insertError) {
            console.error('Error creating user credits:', insertError);
            return 0;
        }

        return newUser?.credits_remaining || 10;
    }

    return data.credits_remaining;
}

export async function useCredit(userIdentifier: string): Promise<boolean> {
    const currentCredits = await getUserCredits(userIdentifier);

    if (currentCredits <= 0) {
        return false;
    }

    const { error } = await supabase
        .from('user_credits')
        .update({
            credits_remaining: currentCredits - 1,
            updated_at: new Date().toISOString()
        })
        .eq('user_identifier', userIdentifier);

    if (error) {
        console.error('Error using credit:', error);
        return false;
    }

    return true;
}

export async function getComments(packId: string): Promise<Comment[]> {
    const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('pack_id', packId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching comments:', error);
        return [];
    }

    return data || [];
}

export async function addComment(
    packId: string,
    author: string,
    text: string,
    aiGenerated: boolean = false,
    userIdentifier: string | null = null
): Promise<Comment | null> {
    const { data, error } = await supabase
        .from('comments')
        .insert({
            pack_id: packId,
            author,
            text,
            ai_generated: aiGenerated,
            user_identifier: userIdentifier
        })
        .select()
        .single();

    if (error) {
        console.error('Error adding comment:', error);
        return null;
    }

    return data;
}
