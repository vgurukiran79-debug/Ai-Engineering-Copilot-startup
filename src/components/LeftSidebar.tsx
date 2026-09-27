import React from 'react';
import {
  Plus,
  FolderGit2,
  Clock,
  Settings,
  MessageSquare,
  Trash2,
  Pin,
  X,
  User,
} from 'lucide-react';
import { ChatSession } from '../types/chat';
import { RobotMascot } from './RobotMascot';

interface LeftSidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
  onClearHistory?: () => void;
  onOpenProjects: () => void;
  onOpenSettings: () => void;
  onOpenOpenRouterSettings?: () => void;
  onOpenCharts?: () => void;
  onOpenAuth?: () => void;
  currentUserEmail?: string | null;
  onCloseMobile?: () => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onClearHistory,
  onOpenProjects,
  onOpenSettings,
  onOpenOpenRouterSettings,
  onOpenCharts,
  onOpenAuth,
  currentUserEmail,
  onCloseMobile,
}) => {
  return (
    <aside className="w-full h-full flex flex-col bg-[#070B14] border-r border-cyan-500/15 select-none overflow-hidden">
      {/* Top Branding Header */}
      <div className="p-4 flex items-center justify-between border-b border-cyan-500/10">
        <div className="flex items-center gap-3">
          <div className="p-1 rounded-xl bg-[#0D1527] border border-cyan-500/30 shadow-[0_0_15px_rgba(0,210,255,0.2)]">
            <RobotMascot size="xs" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-extrabold tracking-wider bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
              AI ENGINEERING
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-300 tracking-widest">
                COPILOT
              </span>
              <span className="text-[10px] text-cyan-400 font-mono tracking-tighter">
                &lt;/&gt;
              </span>
            </div>
          </div>
        </div>

        {/* Mobile close button */}
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* New Chat Action Button */}
      <div className="p-3.5 pb-2">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white font-medium text-sm shadow-[0_0_20px_rgba(37,99,235,0.35)] hover:shadow-[0_0_25px_rgba(0,210,255,0.45)] hover:brightness-110 active:scale-[0.98] transition-all duration-200 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Navigation Links */}
      <div className="px-3 py-2 space-y-0.5 text-xs font-medium">
        <button
          onClick={onOpenProjects}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#0D1527] transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <FolderGit2 className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
            <span>Projects</span>
          </div>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
            NEW
          </span>
        </button>

        <button
          onClick={() => {
            if (sessions.length > 0) {
              onSelectSession(sessions[0].id);
            }
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#0D1527] transition-colors cursor-pointer group"
        >
          <Clock className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
          <span>History</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#0D1527] transition-colors cursor-pointer group"
        >
          <Settings className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
          <span>Settings</span>
        </button>

        {onOpenAuth && (
          <button
            onClick={onOpenAuth}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#0D1527] transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <User className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
              <span className="truncate">{currentUserEmail ? currentUserEmail.split('@')[0] : 'Account & Auth'}</span>
            </div>
            <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono border ${
              currentUserEmail
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
            }`}>
              {currentUserEmail ? 'LOGGED IN' : 'SUPABASE'}
            </span>
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="px-4 py-1.5 flex items-center justify-between text-[11px] font-medium text-slate-400 uppercase tracking-wider">
        <span>Recent Chats</span>
        <div className="flex items-center gap-2">
          {onClearHistory && sessions.length > 0 && (
            <button
              onClick={onClearHistory}
              title="Clear all stored chat history"
              className="text-[10px] text-red-400/80 hover:text-red-300 normal-case cursor-pointer hover:underline"
            >
              Clear All
            </button>
          )}
          <span className="text-[10px] font-mono text-slate-500">{sessions.length}</span>
        </div>
      </div>

      {/* History Items Scrollable List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {sessions.map((session) => {
          const isActive = activeSessionId === session.id;
          const isProject = session.category === 'project' || Boolean(session.projectMeta);
          return (
            <div
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-normal transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-[#0D1527] text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,210,255,0.15)] font-medium'
                  : 'text-slate-300 hover:bg-[#0D1527]/70 hover:text-white border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                {isProject ? (
                  <FolderGit2
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isActive ? 'text-blue-400' : 'text-blue-400/80 group-hover:text-blue-300'
                    }`}
                  />
                ) : (
                  <MessageSquare
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                    }`}
                  />
                )}
                <span className="truncate">{session.title}</span>
                {isProject && (
                  <span className="px-1 py-0.2 rounded text-[8px] font-mono bg-blue-500/15 text-blue-300 border border-blue-500/30 shrink-0">
                    PROJECT
                  </span>
                )}
              </div>

              {/* Action buttons on hover */}
              <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                {session.isPinned && (
                  <Pin className="w-3 h-3 text-cyan-400/80 fill-cyan-400/20" />
                )}
                <button
                  onClick={(e) => onDeleteSession(session.id, e)}
                  title="Delete chat"
                  className="p-1 rounded hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Settings Trigger if available */}
      {onOpenOpenRouterSettings && (
        <div className="p-3 mt-auto border-t border-cyan-500/10">
          <button
            type="button"
            onClick={onOpenOpenRouterSettings}
            title="Open OpenRouter & AI Settings"
            aria-label="Open OpenRouter & AI Settings"
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#0D1527] transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <Settings className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:rotate-45 transition-all duration-300" />
              <span className="text-[11px] font-medium text-slate-400 group-hover:text-cyan-300 transition-colors">
                AI Model &amp; Key Settings
              </span>
            </div>
            <span className="text-[9px] font-mono px-1 py-0.5 rounded text-cyan-400/80 bg-cyan-500/10 border border-cyan-500/20">
              OPENROUTER
            </span>
          </button>
        </div>
      )}
    </aside>
  );
};
