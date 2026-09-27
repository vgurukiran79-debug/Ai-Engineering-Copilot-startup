/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LeftSidebar } from './components/LeftSidebar';
import { CenterCanvas } from './components/CenterCanvas';
import { RightSidebar } from './components/RightSidebar';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { ProjectsModal } from './components/ProjectsModal';
import { SettingsModal } from './components/SettingsModal';
import { OpenRouterSettingsModal } from './components/OpenRouterSettingsModal';
import { ChartsModal } from './components/ChartsModal';
import { AuthModal } from './components/AuthModal';
import { useSupabaseAuth } from './hooks/useSupabaseAuth';
import {
  INITIAL_ACTION_CARDS,
  INITIAL_SESSIONS,
  QUICK_SUGGESTIONS,
  simulateAIResponse,
} from './data/mockData';
import { Attachment, ChatSession, Message } from './types/chat';
import {
  syncSessionToSupabase,
  loadSessionsFromSupabase,
  deleteSessionFromSupabase,
  supabase,
} from './lib/supabaseClient';
import {
  loadLocalChatSessions,
  saveLocalChatSessions,
  loadLocalActiveSessionId,
  saveLocalActiveSessionId,
  saveLocalMessage,
  clearLocalChatHistory,
} from './lib/chatStorage';

export default function App() {
  // Initialize from localStorage or fallback to default mock sessions
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = loadLocalChatSessions();
    return saved && saved.length > 0 ? saved : INITIAL_SESSIONS;
  });

  const [activeSessionId, setActiveSessionId] = useState<string | null>(() => {
    return loadLocalActiveSessionId();
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [supabaseConnected, setSupabaseConnected] = useState(true);

  // Sync state to localStorage on every change
  useEffect(() => {
    saveLocalChatSessions(sessions);
  }, [sessions]);

  useEffect(() => {
    saveLocalActiveSessionId(activeSessionId);
  }, [activeSessionId]);

  // Load existing chat histories from Supabase on mount (merging if available)
  useEffect(() => {
    async function initSupabaseData() {
      try {
        const remoteSessions = await loadSessionsFromSupabase();
        if (remoteSessions && remoteSessions.length > 0) {
          setSessions(remoteSessions);
          saveLocalChatSessions(remoteSessions);
        }
      } catch (e) {
        console.warn('Initial Supabase fetch:', e);
      }
    }
    initSupabaseData();
  }, []);

  // Mobile drawer states
  const [isMobileLeftOpen, setIsMobileLeftOpen] = useState(false);
  const [isMobileRightOpen, setIsMobileRightOpen] = useState(false);

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isOpenRouterSettingsOpen, setIsOpenRouterSettingsOpen] = useState(false);
  const [isChartsOpen, setIsChartsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Supabase Auth listener & active session
  const { user, profile } = useSupabaseAuth();
  const currentUserEmail = user?.email || null;

  // Current session object or null for empty "New Chat" state
  const currentSession = sessions.find((s) => s.id === activeSessionId) || null;

  // Handler for New Chat: Resets active session to null so Hero/Grid empty state is displayed
  const handleNewChat = () => {
    setActiveSessionId(null);
    setIsMobileLeftOpen(false);
  };

  // Handler to switch chats without full page reload
  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
    setIsMobileLeftOpen(false);
    setIsMobileRightOpen(false);
  };

  // Handler to delete a session
  const handleDeleteSession = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      saveLocalChatSessions(filtered);
      return filtered;
    });
    deleteSessionFromSupabase(id);
    if (activeSessionId === id) {
      setActiveSessionId(null);
    }
  };

  // Handler to clear entire chat history locally
  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear all stored chat conversations?')) {
      clearLocalChatHistory();
      setSessions([]);
      setActiveSessionId(null);
    }
  };

  // Core API Readiness: Appends user message, simulates AI response, and saves automatically to Supabase + localStorage
  const handleSendMessage = async (text: string, attachments?: Attachment[]) => {
    if (!text.trim() && (!attachments || attachments.length === 0)) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessage: Message = {
      id: 'usr-' + Date.now(),
      role: 'user',
      content: text,
      timestamp: timeStr,
      attachments,
    };

    let targetSessionId = activeSessionId;
    let updatedSessionToSync: ChatSession | null = null;

    // If starting a brand new conversation from Hero state, create a new session
    if (!targetSessionId) {
      const generatedTitle =
        text.trim().length > 32 ? text.trim().slice(0, 32) + '...' : text.trim() || 'New Discussion';
      const newSession: ChatSession = {
        id: 'sess-' + Date.now(),
        title: generatedTitle,
        category: 'general',
        createdAt: 'Just now',
        updatedAt: 'Just now',
        messages: [userMessage],
      };
      setSessions((prev) => {
        const next = [newSession, ...prev];
        saveLocalChatSessions(next);
        return next;
      });
      setActiveSessionId(newSession.id);
      targetSessionId = newSession.id;
      updatedSessionToSync = newSession;
    } else {
      // Append user message immediately to existing session
      saveLocalMessage(targetSessionId, userMessage);
      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === targetSessionId) {
            const updated = { ...s, messages: [...s.messages, userMessage], updatedAt: 'Just now' };
            updatedSessionToSync = updated;
            return updated;
          }
          return s;
        })
      );
    }

    // Save prompt immediately to Supabase
    if (updatedSessionToSync) {
      syncSessionToSupabase(updatedSessionToSync);
    }

    // Trigger AI response generation
    setIsGenerating(true);
    try {
      const activeHistory = currentSession?.messages || [];
      const aiResponse = await simulateAIResponse(text, [...activeHistory, userMessage]);
      let sessionWithAI: ChatSession | null = null;

      // Save AI message immediately locally
      if (targetSessionId) {
        saveLocalMessage(targetSessionId, aiResponse);
      }

      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === targetSessionId) {
            const updated = { ...s, messages: [...s.messages, aiResponse], updatedAt: 'Just now' };
            sessionWithAI = updated;
            return updated;
          }
          return s;
        })
      );

      // Automatically sync completed conversation to Supabase
      if (sessionWithAI) {
        syncSessionToSupabase(sessionWithAI);
      }
    } catch (err) {
      console.error('Error generating AI response:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handler to create a dedicated Project Workspace (like ChatGPT / Claude Projects)
  const handleCreateProject = (name: string, description: string, techStack: string[]) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userPrompt = `I am initiating a new engineering project: **${name}**.\n\n**Scope & Objectives**:\n${description}\n\n**Technologies**:\n${techStack.join(', ')}\n\nLet's start discussing and planning this project. Outline the core architectural layers, key technical trade-offs, and first sprint action items.`;

    const userMessage: Message = {
      id: 'usr-' + Date.now(),
      role: 'user',
      content: userPrompt,
      timestamp: timeStr,
    };

    const newProjectSession: ChatSession = {
      id: 'proj-' + Date.now(),
      title: name,
      category: 'project',
      createdAt: 'Just now',
      updatedAt: 'Just now',
      messages: [userMessage],
      isPinned: true,
      projectMeta: {
        projectName: name,
        projectGoal: description,
        techStack,
      },
    };

    // Prepend to sessions, activate it, and trigger initial AI architectural discussion
    setSessions((prev) => {
      const next = [newProjectSession, ...prev];
      saveLocalChatSessions(next);
      return next;
    });
    setActiveSessionId(newProjectSession.id);
    setIsMobileLeftOpen(false);
    setIsMobileRightOpen(false);

    // Save prompt to Supabase
    syncSessionToSupabase(newProjectSession);

    // Generate initial AI discussion response for the project
    setIsGenerating(true);
    simulateAIResponse(userPrompt, [userMessage])
      .then((aiResponse) => {
        saveLocalMessage(newProjectSession.id, aiResponse);
        setSessions((prev) =>
          prev.map((s) => {
            if (s.id === newProjectSession.id) {
              const updated = {
                ...s,
                messages: [...s.messages, aiResponse],
                updatedAt: 'Just now',
              };
              syncSessionToSupabase(updated);
              return updated;
            }
            return s;
          })
        );
      })
      .catch((err) => {
        console.error('Error generating initial project response:', err);
      })
      .finally(() => {
        setIsGenerating(false);
      });
  };

  // Handler for quick suggestions from right sidebar
  const handleSelectSuggestion = (prompt: string) => {
    setIsMobileRightOpen(false);
    handleSendMessage(prompt);
  };

  // Handler for project scaffolding from modal
  const handleScaffoldProject = (prompt: string) => {
    handleSendMessage(prompt);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#070B14] text-[#F8FAFC]">
      {/* 1. DESKTOP LEFT SIDEBAR (~260px) */}
      <div className="hidden lg:block w-[260px] shrink-0 h-full">
        <LeftSidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelectSession={handleSelectSession}
          onNewChat={handleNewChat}
          onDeleteSession={handleDeleteSession}
          onClearHistory={handleClearHistory}
          onOpenProjects={() => setIsProjectsOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenOpenRouterSettings={() => setIsOpenRouterSettingsOpen(true)}
          onOpenCharts={() => setIsChartsOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
          currentUserEmail={currentUserEmail}
        />
      </div>

      {/* 2. CENTER CANVAS (Flexible width flex-1) */}
      <CenterCanvas
        currentSession={currentSession}
        actionCards={INITIAL_ACTION_CARDS}
        isGenerating={isGenerating}
        onSendMessage={handleSendMessage}
        onOpenMobileLeft={() => setIsMobileLeftOpen(true)}
        onOpenMobileRight={() => setIsMobileRightOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenProjects={() => setIsProjectsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        currentUserEmail={currentUserEmail}
      />

      {/* 3. DESKTOP RIGHT SIDEBAR (~320px) */}
      <div className="hidden xl:block w-[320px] shrink-0 h-full">
        <RightSidebar
          quickSuggestions={QUICK_SUGGESTIONS}
          onSelectSuggestion={handleSelectSuggestion}
          onOpenProjects={() => setIsProjectsOpen(true)}
        />
      </div>

      {/* MOBILE / TABLET OFF-CANVAS DRAWER: LEFT SIDEBAR */}
      {isMobileLeftOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileLeftOpen(false)}
          />
          <div className="relative w-[280px] max-w-[85vw] h-full z-10 animate-in slide-in-from-left duration-200 shadow-2xl">
            <LeftSidebar
              sessions={sessions}
              activeSessionId={activeSessionId}
              onSelectSession={handleSelectSession}
              onNewChat={handleNewChat}
              onDeleteSession={handleDeleteSession}
              onClearHistory={() => {
                handleClearHistory();
                setIsMobileLeftOpen(false);
              }}
              onOpenProjects={() => {
                setIsMobileLeftOpen(false);
                setIsProjectsOpen(true);
              }}
              onOpenSettings={() => {
                setIsMobileLeftOpen(false);
                setIsSettingsOpen(true);
              }}
              onOpenOpenRouterSettings={() => {
                setIsMobileLeftOpen(false);
                setIsOpenRouterSettingsOpen(true);
              }}
              onOpenCharts={() => {
                setIsMobileLeftOpen(false);
                setIsChartsOpen(true);
              }}
              onOpenAuth={() => {
                setIsMobileLeftOpen(false);
                setIsAuthOpen(true);
              }}
              currentUserEmail={currentUserEmail}
              onCloseMobile={() => setIsMobileLeftOpen(false)}
            />
          </div>
        </div>
      )}

      {/* MOBILE / TABLET OFF-CANVAS DRAWER: RIGHT SIDEBAR */}
      {isMobileRightOpen && (
        <div className="fixed inset-0 z-50 xl:hidden flex justify-end">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileRightOpen(false)}
          />
          <div className="relative w-[300px] max-w-[85vw] h-full z-10 animate-in slide-in-from-right duration-200 shadow-2xl">
            <RightSidebar
              quickSuggestions={QUICK_SUGGESTIONS}
              onSelectSuggestion={handleSelectSuggestion}
              onOpenProjects={() => {
                setIsMobileRightOpen(false);
                setIsProjectsOpen(true);
              }}
              onCloseMobile={() => setIsMobileRightOpen(false)}
            />
          </div>
        </div>
      )}

      {/* MODALS */}
      <CommandPaletteModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        sessions={sessions}
        onSelectSession={handleSelectSession}
        onSelectPrompt={(p) => {
          handleSendMessage(p);
        }}
      />

      <ProjectsModal
        isOpen={isProjectsOpen}
        onClose={() => setIsProjectsOpen(false)}
        sessions={sessions}
        onSelectSession={handleSelectSession}
        onCreateProject={handleCreateProject}
        onDeleteSession={handleDeleteSession}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <OpenRouterSettingsModal
        isOpen={isOpenRouterSettingsOpen}
        onClose={() => setIsOpenRouterSettingsOpen(false)}
      />

      <ChartsModal
        isOpen={isChartsOpen}
        onClose={() => setIsChartsOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </div>
  );
}
