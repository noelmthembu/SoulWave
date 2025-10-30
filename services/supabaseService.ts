import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
