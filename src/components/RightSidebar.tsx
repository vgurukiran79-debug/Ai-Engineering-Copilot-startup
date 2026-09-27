import React, { useState } from 'react';
import {
  Sparkles,
  Rocket,
  Code2,
  Zap,
  ShieldCheck,
  ChevronRight,
  X,
  Cpu,
  Terminal,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { QuickSuggestion } from '../types/chat';

interface RightSidebarProps {
  quickSuggestions: QuickSuggestion[];
  onSelectSuggestion: (prompt: string) => void;
  onOpenProjects: () => void;
  onCloseMobile?: () => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  quickSuggestions,
  onSelectSuggestion,
  onOpenProjects,
  onCloseMobile,
}) => {
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const getIcon = (type: string) => {
    switch (type) {
      case 'Code2':
        return <Code2 className="w-3.5 h-3.5 text-cyan-400" />;
      case 'Rocket':
        return <Rocket className="w-3.5 h-3.5 text-sky-400" />;
      case 'Zap':
        return <Zap className="w-3.5 h-3.5 text-amber-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-cyan-400" />;
    }
  };

  return (
    <aside className="w-full h-full flex flex-col justify-between bg-[#070B14] border-l border-cyan-500/15 overflow-y-auto select-none p-4 space-y-5">
      <div className="space-y-5">
        {/* Mobile close bar */}
        {onCloseMobile && (
          <div className="flex items-center justify-between pb-2 border-b border-cyan-500/10 md:hidden">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-semibold text-slate-200">Tools &amp; Context</span>
            </div>
            <button
              onClick={onCloseMobile}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Quick Suggestions Section */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Quick Suggestions</span>
            </h3>
            <span className="text-[10px] text-cyan-400/80 font-mono">1-Click</span>
          </div>

          <div className="space-y-1.5">
            {quickSuggestions.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectSuggestion(item.prompt)}
                className="w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[#0D1527] hover:bg-[#121c35] text-xs text-slate-200 hover:text-white border border-cyan-500/15 hover:border-cyan-400/40 shadow-sm transition-all duration-150 cursor-pointer group"
              >
                <span className="p-1 rounded-lg bg-black/40 border border-cyan-500/20 group-hover:border-cyan-400/40 transition-colors">
                  {getIcon(item.iconType)}
                </span>
                <span className="truncate font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Feature Banner: Purple to Blue Gradient */}
        {!bannerDismissed && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#4C1D95] via-[#2563EB] to-[#0284C7] p-4 text-white shadow-[0_4px_25px_rgba(76,29,149,0.35)] border border-cyan-300/30">
            <div className="flex items-start justify-between">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-[10px] font-semibold text-white mb-2">
                <Rocket className="w-3 h-3" />
                <span>CODER STUDIO</span>
              </div>
              <button
                onClick={() => setBannerDismissed(true)}
                className="text-white/70 hover:text-white p-0.5 rounded transition-colors cursor-pointer"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <h4 className="text-sm font-bold tracking-tight mb-1 text-white">
              Build Your Own AI Projects
            </h4>
            <p className="text-xs text-cyan-100/90 leading-relaxed mb-3">
              Generate microservices, test suites, and Docker workflows in seconds.
            </p>

            <button
              onClick={onOpenProjects}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white text-slate-900 font-semibold text-xs hover:bg-slate-100 active:scale-[0.98] shadow-md transition-all cursor-pointer"
            >
              <span>Explore Blueprints</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Workspace Quick Insights & Capabilities */}
        <div className="p-3.5 rounded-2xl bg-[#091122] border border-cyan-500/20 space-y-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold text-white">System Capabilities</span>
          </div>

          <div className="space-y-2 text-[11px] text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Full-Stack Architecture &amp; Review</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Code Generation with 1-Click Copy</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Integrated OpenRouter Model Routing</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Cloud Projects Workspace Sync</span>
            </div>
          </div>
        </div>
      </div>

      {/* Model Spec & Database Badge */}
      <div className="pt-2 border-t border-cyan-500/10 space-y-1.5 mt-auto">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono">Copilot v2.4 Pro</span>
          </span>
          <span className="text-[10px] font-mono text-cyan-400">Ready</span>
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-400 bg-[#070B14] px-2 py-1 rounded-lg border border-cyan-500/15">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-slate-300 font-mono">Supabase Sync</span>
          </span>
          <span className="text-[9px] font-mono text-emerald-400">Live Auto-Save</span>
        </div>
      </div>
    </aside>
  );
};
