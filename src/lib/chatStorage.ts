/**
 * Chat Storage Utility using Browser localStorage
 * Provides persistent local chat history, automatic session saving, and history clearing.
 */

import { ChatSession, Message } from '../types/chat';

const STORAGE_KEY_SESSIONS = 'copilot_chat_sessions_v1';
const STORAGE_KEY_ACTIVE_ID = 'copilot_active_session_id_v1';

/**
 * Loads previous chat conversations from localStorage on page load.
 * Returns null if no valid previous data is saved.
 */
export function loadLocalChatSessions(): ChatSession[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SESSIONS);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (error) {
    console.error('Failed to load chat sessions from localStorage:', error);
  }
  return null;
}

/**
 * Loads the last active session ID from localStorage.
 */
export function loadLocalActiveSessionId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY_ACTIVE_ID) || null;
  } catch (error) {
    console.error('Failed to load active session ID from localStorage:', error);
    return null;
  }
}

/**
 * Saves all chat sessions to localStorage immediately.
 */
export function saveLocalChatSessions(sessions: ChatSession[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
  } catch (error) {
    console.error('Failed to save chat sessions to localStorage:', error);
  }
}

/**
 * Saves the active session ID to localStorage.
 */
export function saveLocalActiveSessionId(sessionId: string | null): void {
  try {
    if (sessionId) {
      localStorage.setItem(STORAGE_KEY_ACTIVE_ID, sessionId);
    } else {
      localStorage.removeItem(STORAGE_KEY_ACTIVE_ID);
    }
  } catch (error) {
    console.error('Failed to save active session ID to localStorage:', error);
  }
}

/**
 * Saves a single new message immediately into a specific session in localStorage.
 * If the session does not exist yet, creates it.
 */
export function saveLocalMessage(
  sessionId: string,
  message: Message,
  sessionTitle?: string
): ChatSession[] {
  try {
    const existingSessions = loadLocalChatSessions() || [];
    const index = existingSessions.findIndex((s) => s.id === sessionId);

    let updatedSessions: ChatSession[];

    if (index >= 0) {
      const target = existingSessions[index];
      const updated: ChatSession = {
        ...target,
        messages: [...target.messages, message],
        updatedAt: 'Just now',
      };
      updatedSessions = [
        updated,
        ...existingSessions.filter((_, i) => i !== index),
      ];
    } else {
      const newSession: ChatSession = {
        id: sessionId,
        title: sessionTitle || message.content.slice(0, 30) || 'New Conversation',
        createdAt: 'Just now',
        updatedAt: 'Just now',
        category: 'general',
        messages: [message],
      };
      updatedSessions = [newSession, ...existingSessions];
    }

    saveLocalChatSessions(updatedSessions);
    saveLocalActiveSessionId(sessionId);
    return updatedSessions;
  } catch (error) {
    console.error('Failed to save local message immediately:', error);
    return [];
  }
}

/**
 * Clears all chat history and active session data from localStorage.
 */
export function clearLocalChatHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_SESSIONS);
    localStorage.removeItem(STORAGE_KEY_ACTIVE_ID);
  } catch (error) {
    console.error('Failed to clear local chat history:', error);
  }
}
