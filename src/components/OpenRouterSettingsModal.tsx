import React, { useState, useEffect } from 'react';
import {
  Settings,
  Eye,
  EyeOff,
  KeyRound,
  Sparkles,
  Check,
  X,
  Shield,
  ExternalLink,
  ChevronDown,
  Trash2,
} from 'lucide-react';

export interface OpenRouterConfig {
  apiKey: string;
  selectedModel: string;
}

export const OPENROUTER_MODELS = [
  {
    id: 'google/gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'Google',
    badge: 'Fast & Smart',
    context: '1M tokens',
  },
  {
    id: 'anthropic/claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    badge: 'Top Tier Coding',
    context: '200k tokens',
  },
  {
    id: 'openai/gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    badge: 'Multimodal Flagship',
    context: '128k tokens',
  },
  {
    id: 'meta-llama/llama-3.3-70b-instruct',
    name: 'Llama 3.3 70B Instruct',
    provider: 'Meta',
    badge: 'Open Weights Leader',
    context: '128k tokens',
  },
  {
    id: 'deepseek/deepseek-chat',
    name: 'DeepSeek V3',
    provider: 'DeepSeek',
    badge: 'Efficient & Accurate',
    context: '64k tokens',
  },
  {
    id: 'mistralai/mistral-large-2411',
    name: 'Mistral Large 2',
    provider: 'Mistral',
    badge: 'High Reasoning',
    context: '128k tokens',
  },
  {
    id: 'google/gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    provider: 'Google',
    badge: 'Deep Reasoning',
    context: '2M tokens',
  },
];

const STORAGE_KEY_API_KEY = 'openrouter_api_key';
const STORAGE_KEY_MODEL = 'openrouter_selected_model';

export interface OpenRouterSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (config: OpenRouterConfig) => void;
}

/**
 * Modular Settings Modal Component
 * - Hidden by default, controlled via `isOpen` and `onClose`
 * - OpenRouter API key secure text input with show/hide toggle
 * - Model selection dropdown
 * - Saves securely into localStorage and triggers automatic close
 * - Isolated Tailwind CSS classes to prevent global interference
 */
export const OpenRouterSettingsModal: React.FC<OpenRouterSettingsModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [showKey, setShowKey] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<string>(OPENROUTER_MODELS[0].id);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Load persisted configuration from localStorage on mount or when modal opens
  useEffect(() => {
    if (isOpen) {
      try {
        const storedKey = localStorage.getItem(STORAGE_KEY_API_KEY) || '';
        const storedModel = localStorage.getItem(STORAGE_KEY_MODEL) || OPENROUTER_MODELS[0].id;
        setApiKey(storedKey);
        setSelectedModel(storedModel);
        setShowKey(false);
        setSaveSuccess(false);
      } catch (err) {
        console.warn('Unable to read from localStorage:', err);
      }
    }
  }, [isOpen]);

  // Handle ESC key to dismiss modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cleanKey = apiKey.trim();
      if (cleanKey) {
        localStorage.setItem(STORAGE_KEY_API_KEY, cleanKey);
      } else {
        localStorage.removeItem(STORAGE_KEY_API_KEY);
      }
      localStorage.setItem(STORAGE_KEY_MODEL, selectedModel);

      setSaveSuccess(true);

      if (onSave) {
        onSave({ apiKey: cleanKey, selectedModel });
      }

      // Close modal gracefully after brief feedback
      setTimeout(() => {
        onClose();
        setSaveSuccess(false);
      }, 500);
    } catch (err) {
      console.error('Failed to save OpenRouter settings:', err);
    }
  };

  const handleClearKey = () => {
    setApiKey('');
    try {
      localStorage.removeItem(STORAGE_KEY_API_KEY);
    } catch (err) {
      console.warn(err);
    }
  };

  const selectedModelObj =
    OPENROUTER_MODELS.find((m) => m.id === selectedModel) || OPENROUTER_MODELS[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-2xl bg-[#0B1222] border border-cyan-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_30px_rgba(6,182,212,0.15)] text-slate-200 overflow-hidden transform transition-all"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-cyan-500/20 bg-gradient-to-r from-[#0B1222] via-[#0E1A33] to-[#0B1222]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 shadow-sm">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 id="settings-modal-title" className="text-base font-bold text-white tracking-wide">
                AI Engine &amp; OpenRouter Settings
              </h2>
              <p className="text-xs text-slate-400">
                Configure your OpenRouter API key &amp; preferred AI model
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close settings"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
          {/* Security Notice */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300/90 text-xs">
            <Shield className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-semibold text-emerald-300">Client-Side Secure Storage:</span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Your OpenRouter API key is saved strictly in your browser's private localStorage. It is never logged or exposed.
              </p>
            </div>
          </div>

          {/* OpenRouter API Key Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="openrouter-api-key" className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <span>OpenRouter API Key</span>
                <span className="text-[10px] text-cyan-400 font-mono font-normal">
                  (sk-or-v1-...)
                </span>
              </label>
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1 transition-colors"
              >
                <span>Get API key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="relative">
              <input
                id="openrouter-api-key"
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxx"
                autoComplete="off"
                spellCheck={false}
                className="w-full pl-3.5 pr-20 py-2.5 rounded-xl bg-[#060A14] border border-cyan-500/30 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-xs text-white font-mono placeholder:text-slate-600 outline-none transition-all"
              />

              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {apiKey && (
                  <button
                    type="button"
                    onClick={handleClearKey}
                    title="Clear key"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowKey((prev) => !prev)}
                  title={showKey ? 'Hide key' : 'Show key'}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors cursor-pointer"
                  aria-label={showKey ? 'Hide API key' : 'Show API key'}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              Leave blank to use the built-in protected server AI engine.
            </p>
          </div>

          {/* Model Selection Dropdown */}
          <div className="space-y-1.5">
            <label htmlFor="ai-model-select" className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Preferred AI Model</span>
            </label>

            <div className="relative">
              <select
                id="ai-model-select"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full appearance-none pl-3.5 pr-9 py-2.5 rounded-xl bg-[#060A14] border border-cyan-500/30 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-xs text-white font-sans outline-none transition-all cursor-pointer"
              >
                {OPENROUTER_MODELS.map((model) => (
                  <option key={model.id} value={model.id} className="bg-[#0B1222] text-slate-200">
                    {model.name} ({model.provider}) — {model.badge}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-cyan-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Selected model details card */}
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#060A14]/70 border border-cyan-500/15 text-[11px] text-slate-400">
              <span className="font-mono text-cyan-300 truncate">{selectedModelObj.id}</span>
              <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                {selectedModelObj.context}
              </span>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-cyan-500/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold transition-all shadow-md cursor-pointer ${
                saveSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
              }`}
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/**
 * Discreet Gear Trigger Button Component
 * Designed to sit seamlessly at the bottom of a sidebar or navigation panel.
 */
export interface SettingsTriggerButtonProps {
  onClick: () => void;
  className?: string;
  hasKeySet?: boolean;
}

export const SettingsTriggerButton: React.FC<SettingsTriggerButtonProps> = ({
  onClick,
  className = '',
  hasKeySet = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      title="Open AI Engine & OpenRouter Settings"
      aria-label="Open AI Engine & OpenRouter Settings"
      className={`group flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-[#0D1527] border border-transparent hover:border-cyan-500/20 transition-all duration-150 cursor-pointer ${className}`}
    >
      <div className="flex items-center gap-2.5">
        <div className="relative p-1.5 rounded-lg bg-slate-800/40 group-hover:bg-cyan-500/10 text-slate-400 group-hover:text-cyan-400 transition-colors">
          <Settings className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
          {hasKeySet && (
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10B981]" />
          )}
        </div>
        <span className="font-medium text-slate-300 group-hover:text-cyan-200 transition-colors">
          OpenRouter Settings
        </span>
      </div>

      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 group-hover:border-cyan-500/40">
        {hasKeySet ? 'CONFIGURED' : 'CONFIGURE'}
      </span>
    </button>
  );
};
