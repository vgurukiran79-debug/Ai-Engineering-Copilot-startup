import React, { useState, useEffect } from 'react';
import { Search, X, MessageSquare, Terminal, Rocket, Sparkles, BookOpen, Bug } from 'lucide-react';
import { ChatSession } from '../types/chat';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  onSelectSession: (id: string) => void;
  onSelectPrompt: (prompt: string) => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  sessions,
  onSelectSession,
  onSelectPrompt,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(query.toLowerCase())
  );

  const presetActions = [
    {
      title: 'Scaffold Next.js 15 Fullstack Monorepo',
      icon: <Rocket className="w-4 h-4 text-blue-400" />,
      prompt: 'Scaffold a modern Next.js 15 App Router monorepo with Tailwind CSS and Prisma schema.',
    },
    {
      title: 'Debug Memory Leak & Profiling Checklist',
      icon: <Bug className="w-4 h-4 text-cyan-400" />,
      prompt: 'How do I profile and trace V8 heap memory leaks in a production Node.js service?',
    },
    {
      title: 'Distributed System Design: Microservice Event Bus',
      icon: <Terminal className="w-4 h-4 text-purple-400" />,
      prompt: 'Design an event-driven architecture using Kafka, Redis Streams, and Outbox pattern.',
    },
    {
      title: 'Explain Raft Distributed Consensus Algorithm',
      icon: <BookOpen className="w-4 h-4 text-indigo-400" />,
      prompt: 'Explain leader election and log replication in the Raft consensus algorithm.',
    },
  ].filter((a) => a.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl rounded-2xl bg-[#0D1527] border border-cyan-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-cyan-500/20 flex items-center gap-3 bg-[#0B132B]">
          <Search className="w-4 h-4 text-cyan-400 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, search recent chats, or enter a prompt..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 outline-none font-sans"
          />
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-2 overflow-y-auto space-y-4 flex-1">
          {/* Recent Chats Section */}
          {filteredSessions.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Recent Chat Histories
              </div>
              <div className="space-y-1">
                {filteredSessions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      onSelectSession(s.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs text-slate-200 hover:bg-[#070B14] hover:text-cyan-300 border border-transparent hover:border-cyan-500/20 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <MessageSquare className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate font-medium">{s.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono ml-2 shrink-0">
                      {s.createdAt}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Engineering Presets */}
          {presetActions.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Engineering Blueprints &amp; Actions
              </div>
              <div className="space-y-1">
                {presetActions.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      onSelectPrompt(action.prompt);
                      onClose();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs text-slate-200 hover:bg-[#070B14] hover:text-cyan-300 border border-transparent hover:border-cyan-500/20 transition-all cursor-pointer"
                  >
                    <div className="p-1 rounded bg-[#0B132B] border border-cyan-500/20 shrink-0">
                      {action.icon}
                    </div>
                    <span className="font-medium truncate">{action.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-[#091020] border-t border-cyan-500/10 flex items-center justify-between text-[11px] text-slate-400">
          <span>
            Press <kbd className="px-1 py-0.5 rounded bg-slate-800 text-[10px]">Esc</kbd> to exit
          </span>
          <span className="font-mono text-cyan-400/80">AI Engineering Copilot</span>
        </div>
      </div>
    </div>
  );
};
