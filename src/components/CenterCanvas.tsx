import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Send,
  Paperclip,
  Image as ImageIcon,
  Mic,
  Plus,
  Copy,
  Check,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Menu,
  Info,
  X,
  Radio,
  FileCode,
  Terminal,
  UserCheck,
  FolderGit2,
} from 'lucide-react';
import { Attachment, ChatSession, Message } from '../types/chat';
import { RobotMascot } from './RobotMascot';
import { TypewriterText } from './TypewriterText';

interface CenterCanvasProps {
  currentSession: ChatSession | null;
  actionCards?: any[];
  isGenerating: boolean;
  onSendMessage: (text: string, attachments?: Attachment[]) => void;
  onOpenMobileLeft: () => void;
  onOpenMobileRight: () => void;
  onOpenSearch: () => void;
  onOpenSettings: () => void;
  onOpenProjects: () => void;
  onOpenAuth?: () => void;
  currentUserEmail?: string | null;
}

export const CenterCanvas: React.FC<CenterCanvasProps> = ({
  currentSession,
  actionCards,
  isGenerating,
  onSendMessage,
  onOpenMobileLeft,
  onOpenMobileRight,
  onOpenSearch,
  onOpenSettings,
  onOpenProjects,
  onOpenAuth,
  currentUserEmail,
}) => {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<Attachment[]>([]);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [showPlusMenu, setShowPlusMenu] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const plusMenuRef = useRef<HTMLDivElement>(null);

  const [animatedMessageIds, setAnimatedMessageIds] = useState<Set<string>>(() => new Set());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages, isGenerating]);

  // Handle Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onOpenSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenSearch]);

  // Handle clicking outside plus popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (plusMenuRef.current && !plusMenuRef.current.contains(event.target as Node)) {
        setShowPlusMenu(false);
      }
    };
    if (showPlusMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPlusMenu]);

  const handleSend = () => {
    if ((!inputText.trim() && attachedFiles.length === 0) || isGenerating) return;
    const textToSend = inputText;
    const filesToSend = [...attachedFiles];
    setInputText('');
    setAttachedFiles([]);
    setIsRecordingVoice(false);
    setShowPlusMenu(false);
    onSendMessage(textToSend, filesToSend);
  };

  const handleKeyDownInput = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyCode = (code: string, blockId: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(blockId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const addSimulatedAttachment = (type: 'code' | 'image' | 'doc') => {
    const newAttach: Attachment = {
      id: 'att-' + Date.now(),
      name:
        type === 'code'
          ? 'ArchitectureSpec.ts'
          : type === 'image'
          ? 'SystemDiagram.png'
          : 'DeploymentConfig.yaml',
      size: type === 'code' ? '14.2 KB' : type === 'image' ? '1.2 MB' : '4.8 KB',
      type,
    };
    setAttachedFiles((prev) => [...prev, newAttach]);
    setShowPlusMenu(false);
  };

  const toggleVoiceRecording = () => {
    if (!isRecordingVoice) {
      setIsRecordingVoice(true);
      setTimeout(() => {
        setInputText((prev) => (prev ? prev + ' ' : '') + 'Explain the difference between optimistic and pessimistic locking in SQL.');
        setIsRecordingVoice(false);
      }, 2500);
    } else {
      setIsRecordingVoice(false);
    }
  };

  const messages = currentSession?.messages || [];
  const isChatEmpty = messages.length === 0;

  return (
    <main className="flex-1 flex flex-col h-full bg-[#070B14] relative overflow-hidden select-text">
      {/* Top Bar Header */}
      <header className="h-14 px-4 md:px-6 flex items-center justify-between border-b border-cyan-500/15 bg-[#070B14]/80 backdrop-blur-md z-30 shrink-0">
        {/* Left: Mobile Drawer Trigger & Active Session Indicator */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenMobileLeft}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#0D1527] border border-cyan-500/20 transition-colors"
            title="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-2 h-2 rounded-full animate-pulse shrink-0 ${
              currentSession?.category === 'project' || Boolean(currentSession?.projectMeta)
                ? 'bg-blue-400'
                : 'bg-cyan-400'
            }`} />
            <span className="text-xs font-semibold text-slate-300 truncate">
              {currentSession ? currentSession.title : 'AI Engineering Copilot'}
            </span>
            {currentSession && (
              <span className={`hidden sm:inline-flex text-[10px] font-mono px-2 py-0.5 rounded-full border shrink-0 ${
                currentSession?.category === 'project' || Boolean(currentSession?.projectMeta)
                  ? 'text-blue-300 bg-blue-500/15 border-blue-500/30'
                  : 'text-cyan-400/80 bg-cyan-500/10 border-cyan-500/20'
              }`}>
                {currentSession?.category === 'project' || Boolean(currentSession?.projectMeta)
                  ? 'Project Workspace'
                  : 'Session Active'}
              </span>
            )}
          </div>
        </div>

        {/* Right: Search Action, Supabase Auth Trigger & Mobile Drawer Trigger */}
        <div className="flex items-center gap-2">
          {/* Supabase Account button */}
          {onOpenAuth && (
            <button
              onClick={onOpenAuth}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all cursor-pointer shadow-sm text-xs font-medium ${
                currentUserEmail
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25'
                  : 'bg-[#0D1527] border-cyan-500/30 text-cyan-300 hover:border-cyan-400 hover:text-white'
              }`}
              title={currentUserEmail ? `Logged in as ${currentUserEmail}` : 'Sign In or Sign Up with Supabase'}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {currentUserEmail ? currentUserEmail.split('@')[0] : 'Sign In'}
              </span>
            </button>
          )}

          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0D1527] border border-cyan-500/20 hover:border-cyan-400/50 text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm group"
            title="Search chats & commands (Ctrl + K)"
          >
            <Search className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium hidden sm:inline">Search</span>
            <kbd className="hidden md:inline-flex items-center text-[10px] font-mono text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700/60 ml-0.5">
              Ctrl K
            </kbd>
          </button>

          <button
            onClick={onOpenMobileRight}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#0D1527] border border-cyan-500/20 transition-colors"
            title="Open context & tools"
          >
            <Info className="w-5 h-5 text-cyan-400" />
          </button>
        </div>
      </header>

      {/* Main Content Area: Scrollable chat / Hero section */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 max-w-4xl w-full mx-auto flex flex-col justify-start">
        {/* CASE 1: EMPTY STATE / HERO SECTION */}
        {isChatEmpty ? (
          <div className="my-auto py-12 flex flex-col items-center text-center animate-in fade-in duration-300 max-w-xl mx-auto">
            {/* Mascot Container without background circle */}
            <div className="relative mb-6 cursor-pointer">
              <RobotMascot size="xl" isFloating={true} />
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-sky-200 to-blue-500 bg-clip-text text-transparent mb-3">
              AI ENGINEERING COPILOT
            </h1>

            {/* Greeting */}
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed max-w-md">
              👋 Hello Guru! I'm your AI Engineering Copilot.
            </p>
          </div>
        ) : (
          /* CASE 2: CONVERSATIONAL MESSAGE VIEW */
          <div className="space-y-6 pb-4">
            {/* Project Workspace Context Card */}
            {currentSession && (currentSession.category === 'project' || Boolean(currentSession.projectMeta)) && (
              <div className="p-4 rounded-2xl bg-[#091122] border border-blue-500/30 shadow-[0_0_20px_rgba(37,99,235,0.15)] flex items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      <FolderGit2 className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-white tracking-wide truncate">
                      {currentSession.projectMeta?.projectName || currentSession.title}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-blue-500/15 text-blue-300 border border-blue-500/30">
                      PROJECT DISCUSSION
                    </span>
                  </div>

                  {currentSession.projectMeta?.projectGoal && (
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {currentSession.projectMeta.projectGoal}
                    </p>
                  )}

                  {currentSession.projectMeta?.techStack && currentSession.projectMeta.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {currentSession.projectMeta.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-[#060A14] text-cyan-300 border border-cyan-500/20"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                } animate-in fade-in duration-200`}
              >
                {/* Assistant Robot Avatar */}
                {msg.role === 'assistant' && (
                  <div className="shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-xl bg-[#0D1527] border border-cyan-500/30 flex items-center justify-center p-0.5 shadow-[0_0_12px_rgba(0,210,255,0.2)]">
                      <RobotMascot size="xs" />
                    </div>
                  </div>
                )}

                {/* Message Bubble Body */}
                <div
                  className={`max-w-2xl rounded-2xl p-4 text-xs md:text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-tr-xs shadow-[0_4px_20px_rgba(37,99,235,0.25)]'
                      : 'bg-[#0D1527] border border-cyan-500/20 text-slate-200 rounded-tl-xs shadow-lg'
                  }`}
                >
                  {/* Message Content formatted */}
                  {msg.role === 'assistant' ? (
                    <TypewriterText
                      content={msg.content}
                      isNew={!animatedMessageIds.has(msg.id)}
                      onUpdate={scrollToBottom}
                      onComplete={() => {
                        setAnimatedMessageIds((prev) => new Set(prev).add(msg.id));
                      }}
                    />
                  ) : (
                    <div className="whitespace-pre-wrap font-sans">{msg.content}</div>
                  )}

                  {/* Attached files chips */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {msg.attachments.map((att) => (
                        <div
                          key={att.id}
                          className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-black/40 border border-cyan-500/30 text-[11px]"
                        >
                          <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                          <span className="font-medium text-slate-200">{att.name}</span>
                          <span className="text-slate-400">({att.size})</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Code Blocks with Syntax Highlighter & Copy Button */}
                  {msg.codeBlocks &&
                    msg.codeBlocks.map((block, idx) => {
                      const blockId = `${msg.id}-code-${idx}`;
                      const isCopied = copiedId === blockId;

                      return (
                        <div
                          key={idx}
                          className="mt-3 rounded-xl overflow-hidden border border-cyan-500/25 bg-[#070B14] shadow-md"
                        >
                          {/* Code Header Bar */}
                          <div className="px-3 py-1.5 bg-[#091020] border-b border-cyan-500/20 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                            <span className="flex items-center gap-1.5 text-cyan-300 font-semibold">
                              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                              <span>{block.filename || block.language}</span>
                            </span>

                            <button
                              onClick={() => copyCode(block.code, blockId)}
                              className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                            >
                              {isCopied ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>

                          {/* Code Content */}
                          <pre className="p-3.5 text-xs font-mono text-cyan-100 overflow-x-auto selection:bg-cyan-500/40">
                            <code>{block.code}</code>
                          </pre>
                        </div>
                      );
                    })}

                  {/* Footer metadata & action buttons on assistant message */}
                  <div className="mt-2.5 pt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-700/30">
                    <span className="font-mono">{msg.timestamp}</span>

                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(msg.content);
                            setCopiedId(msg.id);
                            setTimeout(() => setCopiedId(null), 2000);
                          }}
                          className="hover:text-cyan-300 transition-colors p-1"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                        <button
                          onClick={() => onSendMessage(`Regenerate and expand on previous solution: ${msg.content.slice(0, 80)}...`)}
                          className="hover:text-cyan-300 transition-colors p-1"
                          title="Regenerate response"
                        >
                          <RotateCcw className="w-3 h-3" />
                        </button>
                        <button className="hover:text-cyan-300 transition-colors p-1" title="Helpful">
                          <ThumbsUp className="w-3 h-3" />
                        </button>
                        <button className="hover:text-red-400 transition-colors p-1" title="Needs improvement">
                          <ThumbsDown className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* User Avatar */}
                {msg.role === 'user' && (
                  <div className="shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white font-extrabold text-xs shadow-sm ring-2 ring-cyan-500/30">
                      G
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Real-time Typing / Thinking Indicator */}
            {isGenerating && (
              <div className="flex items-center gap-3.5 animate-in fade-in duration-200">
                <div className="w-8 h-8 rounded-xl bg-[#0D1527] border border-cyan-500/30 flex items-center justify-center p-0.5 shadow-[0_0_12px_rgba(0,210,255,0.2)]">
                  <RobotMascot size="xs" />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-tl-xs bg-[#0D1527] border border-cyan-500/30 text-xs text-cyan-300 flex items-center gap-2 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse [animation-delay:200ms]" />
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse [animation-delay:400ms]" />
                  <span className="text-slate-400 font-mono text-[11px] ml-1">
                    Copilot is synthesizing solution...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area (Sticky at Bottom) */}
      <div className="p-4 md:p-6 bg-gradient-to-t from-[#070B14] via-[#070B14]/95 to-transparent z-20 shrink-0">
        <div className="max-w-4xl mx-auto">
          {/* Active Attached Files preview chips */}
          {attachedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {attachedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0D1527] border border-cyan-500/30 text-xs text-slate-200 shadow-sm"
                >
                  <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-medium">{file.name}</span>
                  <span className="text-[10px] text-slate-400">({file.size})</span>
                  <button
                    onClick={() =>
                      setAttachedFiles((prev) => prev.filter((f) => f.id !== file.id))
                    }
                    className="p-0.5 hover:text-red-400 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Voice Recording Simulation Bar */}
          {isRecordingVoice && (
            <div className="flex items-center justify-between px-4 py-2 mb-2 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 animate-pulse">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-red-400 animate-ping" />
                <span className="font-medium">Listening to speech...</span>
              </div>
              <button
                onClick={() => setIsRecordingVoice(false)}
                className="text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Floating Glassmorphic Text Box */}
          <div className="relative rounded-2xl bg-[#0D1527]/90 backdrop-blur-xl border border-cyan-500/25 shadow-[0_8px_32px_rgba(0,0,0,0.5)] focus-within:border-cyan-400/60 focus-within:shadow-[0_0_25px_rgba(0,210,255,0.2)] transition-all duration-200 p-2.5">
            <textarea
              ref={inputRef}
              rows={2}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDownInput}
              placeholder="Type your message here... (e.g. Debug this memory leak, generate Dockerfile, scaffold app)"
              className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-xs md:text-sm px-2 py-1 outline-none resize-none font-sans leading-relaxed"
            />

            {/* Bottom Row: Plus Menu Popover & Send Button */}
            <div className="flex items-center justify-between pt-1 px-1 border-t border-cyan-500/10 mt-1">
              <div className="relative" ref={plusMenuRef}>
                {/* Plus Toggle Button */}
                <button
                  type="button"
                  onClick={() => setShowPlusMenu(!showPlusMenu)}
                  className={`p-2 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center ${
                    showPlusMenu
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_15px_rgba(0,210,255,0.25)] rotate-45'
                      : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 border border-transparent'
                  }`}
                  title={showPlusMenu ? 'Close menu' : 'Attach document, gallery image, or voice'}
                  aria-expanded={showPlusMenu}
                  aria-haspopup="true"
                >
                  <Plus className="w-4 h-4 transition-transform duration-200" />
                </button>

                {/* Popover / Dropdown Menu for Pin (Document), Gallery (Image) & Mic (Voice) */}
                {showPlusMenu && (
                  <div
                    className="absolute left-0 bottom-12 w-64 rounded-2xl bg-[#0D1527] border border-cyan-500/30 shadow-[0_12px_40px_rgba(0,0,0,0.85)] backdrop-blur-xl p-2 z-50 text-xs text-slate-200 animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-150 space-y-1"
                  >
                    <div className="px-2.5 py-1 text-[10px] font-mono text-cyan-400/80 uppercase tracking-wider font-semibold border-b border-cyan-500/15 mb-1 flex items-center justify-between">
                      <span>Add to Message</span>
                      <span className="text-[9px] text-slate-400 font-sans">Attachments</span>
                    </div>

                    {/* 1. Pin / Document */}
                    <button
                      type="button"
                      onClick={() => addSimulatedAttachment('doc')}
                      className="w-full flex items-center gap-3 px-2.5 py-2 rounded-xl hover:bg-cyan-500/15 hover:text-cyan-300 transition-all cursor-pointer group text-left"
                    >
                      <div className="p-2 rounded-lg bg-black/40 border border-cyan-500/20 group-hover:border-cyan-400/50 text-cyan-400 group-hover:scale-105 transition-all shrink-0">
                        <Paperclip className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-200 group-hover:text-cyan-200 truncate">
                          Attach Document
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          Pin code, PDF, or configuration
                        </div>
                      </div>
                    </button>

                    {/* 2. Gallery / Image */}
                    <button
                      type="button"
                      onClick={() => addSimulatedAttachment('image')}
                      className="w-full flex items-center gap-3 px-2.5 py-2 rounded-xl hover:bg-cyan-500/15 hover:text-cyan-300 transition-all cursor-pointer group text-left"
                    >
                      <div className="p-2 rounded-lg bg-black/40 border border-cyan-500/20 group-hover:border-sky-400/50 text-sky-400 group-hover:scale-105 transition-all shrink-0">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-200 group-hover:text-cyan-200 truncate">
                          Gallery Image
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          Screenshot or diagram
                        </div>
                      </div>
                    </button>

                    {/* 3. Mic / Voice Dictation */}
                    <button
                      type="button"
                      onClick={() => {
                        setShowPlusMenu(false);
                        toggleVoiceRecording();
                      }}
                      className="w-full flex items-center gap-3 px-2.5 py-2 rounded-xl hover:bg-cyan-500/15 hover:text-cyan-300 transition-all cursor-pointer group text-left"
                    >
                      <div className="p-2 rounded-lg bg-black/40 border border-cyan-500/20 group-hover:border-rose-400/50 text-rose-400 group-hover:scale-105 transition-all shrink-0">
                        <Mic className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-200 group-hover:text-cyan-200 truncate">
                          Voice Dictation
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          Record engineering prompt
                        </div>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Prominent Send Button (Electric Blue) */}
              <button
                onClick={handleSend}
                disabled={(!inputText.trim() && attachedFiles.length === 0) || isGenerating}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold text-xs transition-all duration-200 cursor-pointer ${
                  (!inputText.trim() && attachedFiles.length === 0) || isGenerating
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : 'bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(0,210,255,0.5)] hover:brightness-110 active:scale-95'
                }`}
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 px-2">
            <span>Press Enter to send, Shift + Enter for new line</span>
            <span className="hidden sm:inline">Engineered for production developers &amp; students</span>
          </div>
        </div>
      </div>
    </main>
  );
};
