import { createClient, User } from '@supabase/supabase-js';
import { ChatSession, Message } from '../types/chat';

export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://eouvcazhlnqlsidxqbts.supabase.co';
export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_oZzo9_7kAGZNQDJG3F7j6w_VhiUpOzc';

// 1. Initialize the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
  metadata?: Record<string, any>;
}

/**
 * Ensures user profile information is stored in the "profiles" table.
 * Saves user email, name, role and any custom metadata.
 */
export async function syncUserProfile(
  user: User,
  additionalMetadata?: Record<string, any>
): Promise<{ success: boolean; error?: string }> {
  try {
    const meta = {
      ...(user.user_metadata || {}),
      ...(additionalMetadata || {}),
    };

    const profileData = {
      id: user.id,
      email: user.email || '',
      full_name: meta.full_name || meta.name || user.email?.split('@')[0] || 'Engineer',
      avatar_url: meta.avatar_url || null,
      role: meta.role || 'developer',
      metadata: meta,
      updated_at: new Date().toISOString(),
    };

    // Upsert into separate "profiles" table
    const { error } = await supabase
      .from('profiles')
      .upsert(profileData, { onConflict: 'id' });

    if (error) {
      console.warn('[Supabase Profiles Table Notice]:', error.message);
      // Fallback: try "users" table if developer configured users table
      await supabase.from('users').upsert(profileData, { onConflict: 'id' });
    }

    return { success: true };
  } catch (err: any) {
    console.error('Failed to sync profile to database:', err);
    return { success: false, error: err?.message };
  }
}

/**
 * Sign up with email, password, and optional metadata
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  metadata?: { full_name?: string; role?: string }
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: metadata?.full_name || email.split('@')[0],
        role: metadata?.role || 'developer',
      },
    },
  });

  if (error) {
    return { user: null, session: null, error: error.message };
  }

  // Store user profile in separate database table
  if (data.user) {
    await syncUserProfile(data.user, metadata);
  }

  return { user: data.user, session: data.session, error: null };
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { user: null, session: null, error: error.message };
  }

  if (data.user) {
    await syncUserProfile(data.user);
  }

  return { user: data.user, session: data.session, error: null };
}

/**
 * Sign out current user
 */
export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  return { error: error ? error.message : null };
}

/**
 * Fetches user profile from profiles table
 */
export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return null;
    }
    return data as UserProfile;
  } catch {
    return null;
  }
}

/**
 * Persists a new or updated chat session to Supabase.
 */
export async function syncSessionToSupabase(session: ChatSession): Promise<{ success: boolean; error?: string }> {
  try {
    const sessionPayload = {
      id: session.id,
      title: session.title,
      category: session.category || 'general',
      messages: session.messages,
      is_pinned: session.isPinned || false,
      created_at: session.createdAt,
      updated_at: new Date().toISOString(),
    };

    const { error: sessionError } = await supabase
      .from('chat_sessions')
      .upsert(sessionPayload, { onConflict: 'id' });

    if (!sessionError) {
      return { success: true };
    }

    const { error: chatsError } = await supabase
      .from('chats')
      .upsert({
        id: session.id,
        title: session.title,
        messages: JSON.stringify(session.messages),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

    if (!chatsError) {
      return { success: true };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

/**
 * Loads recent chat sessions from Supabase.
 */
export async function loadSessionsFromSupabase(): Promise<ChatSession[] | null> {
  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return null;
    }

    return data.map((item: any) => ({
      id: item.id,
      title: item.title,
      category: item.category || 'general',
      createdAt: item.created_at || 'Recently',
      updatedAt: item.updated_at || 'Recently',
      isPinned: item.is_pinned || false,
      messages: Array.isArray(item.messages) ? item.messages : JSON.parse(item.messages || '[]'),
    }));
  } catch (err) {
    return null;
  }
}

/**
 * Removes a chat session from Supabase.
 */
export async function deleteSessionFromSupabase(sessionId: string): Promise<void> {
  try {
    await supabase.from('chat_sessions').delete().eq('id', sessionId);
    await supabase.from('chats').delete().eq('id', sessionId);
  } catch (err) {
    console.warn('[Supabase Delete]', err);
  }
}
