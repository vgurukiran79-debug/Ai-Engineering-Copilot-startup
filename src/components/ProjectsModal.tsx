import React, { useState } from 'react';
import {
  X,
  FolderGit2,
  Plus,
  Sparkles,
  ArrowRight,
  Boxes,
  Code2,
  Trash2,
  MessageSquare,
  Layers,
  Lightbulb,
} from 'lucide-react';
import { ChatSession } from '../types/chat';

interface ProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  onSelectSession: (id: string) => void;
  onCreateProject: (name: string, description: string, techStack: string[]) => void;
  onDeleteSession?: (id: string) => void;
}

const POPULAR_TAGS = [
  'React',
  'Next.js',
  'TypeScript',
  'Node.js',
  'Python',
  'FastAPI',
  'PostgreSQL',
  'Supabase',
  'Tailwind CSS',
  'Docker',
  'AI / LLM',
  'GraphQL',
];

export const ProjectsModal: React.FC<ProjectsModalProps> = ({
  isOpen,
  onClose,
  sessions,
  onSelectSession,
  onCreateProject,
  onDeleteSession,
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'list'>('create');
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['React', 'TypeScript']);
  const [customTagInput, setCustomTagInput] = useState('');

  if (!isOpen) return null;

  // Filter sessions that are flagged as projects or have projectMeta
  const projectSessions = sessions.filter(
    (s) => s.category === 'project' || Boolean(s.projectMeta)
  );

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleAddCustomTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    const tag = customTagInput.trim();
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags((prev) => [...prev, tag]);
      setCustomTagInput('');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = projectName.trim();
    const trimmedDesc = projectDescription.trim();

    if (!trimmedName) return;

    onCreateProject(
      trimmedName,
      trimmedDesc || 'Interactive engineering workspace & system design discussion.',
      selectedTags
    );

    // Reset fields
    setProjectName('');
    setProjectDescription('');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-3xl bg-[#0B1222] border border-cyan-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_35px_rgba(6,182,212,0.15)] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="p-5 border-b border-cyan-500/20 flex items-center justify-between bg-gradient-to-r from-[#0B1222] via-[#0E1A35] to-[#0B1222]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-500/15 border border-cyan-500/30 text-cyan-400 shadow-sm">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">
                  Projects Hub
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  WORKSPACE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Create a dedicated project space to architect, discuss, and build with your AI Copilot.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-cyan-500/10 bg-[#080E1C]">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'create'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Create New Project</span>
          </button>

          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'list'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Existing Projects ({projectSessions.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'create' ? (
            <form onSubmit={handleFormSubmit} className="space-y-5">
              {/* Introduction Banner */}
              <div className="p-4 rounded-2xl bg-[#060A14] border border-cyan-500/20 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-xs text-slate-300 space-y-1">
                  <p className="font-semibold text-white">
                    Start a focused Project Workspace
                  </p>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Name your project, state what you are building, and your AI Copilot will initialize a structured, persistent discussion thread loaded with context to help you architect, code, and debug it.
                  </p>
                </div>
              </div>

              {/* Project Name Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200 flex items-center justify-between">
                  <span>Project Name *</span>
                  <span className="text-[10px] text-slate-400 font-mono">e.g. Fintech SaaS Platform</span>
                </label>
                <input
                  type="text"
                  required
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g., Autonomous Trading Bot, E-Commerce Storefront, Mobile App..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#060A14] border border-cyan-500/30 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-xs text-white placeholder:text-slate-600 outline-none transition-all"
                />
              </div>

              {/* Project Goal / Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200 flex items-center justify-between">
                  <span>What are you building? / Goals</span>
                  <span className="text-[10px] text-slate-400 font-mono">Scope &amp; Objectives</span>
                </label>
                <textarea
                  rows={3}
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Describe your vision, target features, architecture requirements, or specific challenges you want to discuss with the AI..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#060A14] border border-cyan-500/30 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-xs text-white placeholder:text-slate-600 outline-none transition-all resize-none"
                />
              </div>

              {/* Tech Stack Selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Tech Stack &amp; Frameworks</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_TAGS.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm'
                            : 'bg-[#060A14] text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-300'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>

                {/* Custom tag input */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={customTagInput}
                    onChange={(e) => setCustomTagInput(e.target.value)}
                    onKeyDown={handleAddCustomTag}
                    placeholder="Add other technology (press Enter)..."
                    className="flex-1 px-3 py-1.5 rounded-lg bg-[#060A14] border border-cyan-500/20 focus:border-cyan-400 text-xs text-white placeholder:text-slate-600 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomTag}
                    className="px-3 py-1.5 rounded-lg bg-[#0D1527] hover:bg-[#111C35] text-cyan-300 text-xs font-medium border border-cyan-500/30 cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-cyan-500/15">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!projectName.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Project &amp; Start Discussion</span>
                </button>
              </div>
            </form>
          ) : (
            /* Existing Projects List */
            <div className="space-y-3">
              {projectSessions.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-2xl bg-[#060A14] border border-cyan-500/15">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center mb-3">
                    <Boxes className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">
                    No Projects Created Yet
                  </h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                    Create your first project workspace to start discussing system architectures, code modules, and requirements.
                  </p>
                  <button
                    onClick={() => setActiveTab('create')}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Your First Project</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {projectSessions.map((proj) => (
                    <div
                      key={proj.id}
                      onClick={() => {
                        onSelectSession(proj.id);
                        onClose();
                      }}
                      className="p-4 rounded-2xl bg-[#060A14] border border-cyan-500/20 hover:border-cyan-400/50 hover:bg-[#070D1D] transition-all cursor-pointer group flex items-start justify-between gap-4"
                    >
                      <div className="min-w-0 space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <FolderGit2 className="w-4 h-4 text-cyan-400 shrink-0" />
                          <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                            {proj.title}
                          </h4>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-blue-500/15 text-blue-300 border border-blue-500/30 shrink-0">
                            PROJECT
                          </span>
                        </div>

                        {proj.projectMeta?.projectGoal && (
                          <p className="text-[11px] text-slate-400 line-clamp-2">
                            {proj.projectMeta.projectGoal}
                          </p>
                        )}

                        {proj.projectMeta?.techStack && proj.projectMeta.techStack.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {proj.projectMeta.techStack.map((tech) => (
                              <span
                                key={tech}
                                className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-[#0D1527] text-slate-300 border border-slate-800"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center gap-3 text-[10px] text-slate-500 pt-1 font-mono">
                          <span>{proj.messages.length} messages</span>
                          <span>•</span>
                          <span>{proj.updatedAt || proj.createdAt}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-center">
                        {onDeleteSession && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteSession(proj.id);
                            }}
                            title="Delete Project"
                            className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
