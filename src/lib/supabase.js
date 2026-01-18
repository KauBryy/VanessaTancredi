import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if we are in a "mock" environment (missing keys or placeholder)
const isMock = !supabaseUrl || supabaseUrl.includes('placeholder') || !supabaseAnonKey;

export const supabase = isMock
    ? {
        // Mock Supabase Client
        from: (table) => {
            const chain = {
                select: async () => ({ error: { message: 'Mock mode' }, data: null }),
                insert: async () => ({ error: { message: 'Mock mode' }, data: null }),
                update: async () => ({ error: { message: 'Mock mode' }, data: null }),
                delete: async () => ({ error: { message: 'Mock mode' }, data: null }),
                eq: () => chain,
                single: async () => ({ error: { message: 'Mock mode' }, data: null }),
                order: () => chain,
            };
            return chain;
        },
        storage: {
            from: () => ({
                upload: async () => ({ error: { message: 'Mock mode' } }),
                getPublicUrl: () => ({ data: { publicUrl: 'https://via.placeholder.com/300' } })
            })
        },
        auth: {
            getSession: async () => ({ data: { session: null } }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            signInWithPassword: async () => ({ error: { message: 'Mock auth: Configure Supabase to log in.' } }),
            signOut: async () => ({})
        }
    }
    : createClient(supabaseUrl, supabaseAnonKey);
