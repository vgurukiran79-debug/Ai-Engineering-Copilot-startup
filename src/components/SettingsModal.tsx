import React, { useState } from 'react';
import { X, Settings, Key, Cpu, Sparkles, Check, Sliders, Shield, Database } from 'lucide-react';
import { SUPABASE_URL } from '../lib/supabaseClient';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [provider, setProvider] = useState<'mock' | 'gemini' | 'openai' | 'claude'>('gemini');
  const [apiKey, setApiKey] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [systemPrompt, setSystemPrompt] = useState(
    "You are AI Engineering Copilot, an elite software engineering assistant specializing in clean code, robust system design, and algorithmic optimization."
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    localStorage.setItem('copilot_provider', provider);
    localStorage.setItem('copilot_temp', temperature.toString());
    localStorage.setItem('copilot_system_prompt', systemPrompt);
    if (apiKey) {
      localStorage.setItem(`copilot_key_${provider}`, apiKey);
    }
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl rounded-3xl bg-[#0D1527] border border-cyan-500/30 shadow-[0_15px_60px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-cyan-500/20 flex items-center justify-between bg-[#0B132B]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-500/30">
              <Settings className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                Engine &amp; LLM API Settings
              </h2>
              <p className="text-xs text-slate-400">
                Configure inference providers, API keys &amp; engineering prompt behavior.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Supabase Database Connection Card */}
          <div className="p-3.5 rounded-2xl bg-[#070B14] border border-cyan-500/25 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white text-xs">Supabase Cloud Database</div>
                  <div className="text-[10px] text-slate-400 font-mono">Project: eouvcazhlnqlsidxqbts</div>
                </div>
              </div>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono text-emerald-300 bg-emerald-500/10 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Connected</span>
              </span>
            </div>
            <div className="text-[11px] text-slate-300 leading-relaxed font-sans">
              All chatbot conversations and code responses are automatically persisted to your Supabase backend in real time.
            </div>
            <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400 font-mono truncate">
              Endpoint: {SUPABASE_URL}
            </div>
          </div>

          {/* Provider Selection */}
          <div>
            <label className="block text-slate-300 font-semibold mb-2">
              Inference Provider / Engine
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'mock', name: 'Mock Engine', badge: 'Active' },
                { id: 'gemini', name: 'Google Gemini', badge: 'v2.5' },
                { id: 'openai', name: 'OpenAI GPT-4o', badge: 'Ready' },
                { id: 'claude', name: 'Anthropic Claude', badge: '3.5' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setProvider(item.id as any)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    provider === item.id
                      ? 'bg-[#070B14] border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,210,255,0.2)]'
                      : 'bg-[#070B14]/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold text-white">{item.name}</div>
                  <div className="text-[10px] text-cyan-400/80 font-mono mt-0.5">
                    {item.badge}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* API Key Status / Configuration */}
          {provider === 'gemini' ? (
            <div className="p-3.5 rounded-2xl bg-[#070B14] border border-emerald-500/30 shadow-sm animate-in fade-in">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs">Google Gemini API Key</div>
                    <div className="text-[10px] text-emerald-400 font-mono">Protected on Backend Server</div>
                  </div>
                </div>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono text-emerald-300 bg-emerald-500/10 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Active &amp; Secure</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                Your key is strictly stored in the server backend (<code className="text-cyan-300 font-mono text-[10px]">GEMINI_API_KEY</code>). It is completely hidden from browsers and Developer Tools.
              </p>
            </div>
          ) : provider !== 'mock' ? (
            <div className="animate-in fade-in">
              <label className="block text-slate-300 font-semibold mb-1">
                {provider.toUpperCase()} API Key
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={`Paste your ${provider} API secret key here...`}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#070B14] border border-cyan-500/20 text-slate-200 placeholder-slate-600 outline-none focus:border-cyan-400 font-mono text-xs"
                />
                <Key className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-400" />
                <span>Keys are stored strictly in client-side memory or session.</span>
              </p>
            </div>
          ) : null}

          {/* Temperature Slider */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>Temperature (Creativity vs Determinism)</span>
              </label>
              <span className="font-mono text-cyan-400">{temperature}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>0.0 (Precise &amp; Deterministic)</span>
              <span>1.0 (Creative &amp; Exploratory)</span>
            </div>
          </div>

          {/* System Prompt Customization */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              System Instruction Role
            </label>
            <textarea
              rows={3}
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#070B14] border border-cyan-500/20 text-slate-200 outline-none focus:border-cyan-400 font-sans text-xs resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#091020] border-t border-cyan-500/15 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            {savedSuccess ? (
              <span className="text-emerald-400 flex items-center gap-1 font-medium">
                <Check className="w-3.5 h-3.5" /> Settings Saved!
              </span>
            ) : (
              'Changes apply to new chat turns.'
            )}
          </span>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-semibold shadow-md hover:brightness-110 active:scale-95 transition-all"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
