import React from 'react';
import { X, BarChart3, Activity, Layers, Cpu, ArrowUpRight } from 'lucide-react';

interface ChartsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChartsModal: React.FC<ChartsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="w-full max-w-3xl rounded-3xl bg-[#0D1527] border border-cyan-500/30 shadow-[0_15px_60px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-cyan-500/20 flex items-center justify-between bg-[#0B132B]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-500/30">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                Charts &amp; System Telemetry
              </h2>
              <p className="text-xs text-slate-400">
                Visual telemetry, runtime benchmarks &amp; system architecture diagrams.
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
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-[#070B14] border border-cyan-500/20">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Average Response</span>
                <Activity className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-xl font-bold font-mono text-cyan-300">182 ms</div>
              <div className="text-[11px] text-emerald-400 mt-1 font-mono">↓ 42ms vs v1.0</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#070B14] border border-cyan-500/20">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Code Accuracy</span>
                <Layers className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-xl font-bold font-mono text-blue-300">99.4%</div>
              <div className="text-[11px] text-slate-400 mt-1">Zero syntax errors</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#070B14] border border-cyan-500/20">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Inference Memory</span>
                <Cpu className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-xl font-bold font-mono text-purple-300">14.2 MB</div>
              <div className="text-[11px] text-cyan-400 mt-1 font-mono">Client-side footprint</div>
            </div>
          </div>

          {/* Interactive Benchmark Chart Visualization */}
          <div className="p-4 rounded-2xl bg-[#070B14] border border-cyan-500/20">
            <h4 className="text-xs font-bold text-white mb-3 flex items-center justify-between">
              <span>Throughput Benchmark Across Microservices</span>
              <span className="text-[10px] text-cyan-400 font-mono">RPS (Req/Sec)</span>
            </h4>

            <div className="space-y-3 text-xs">
              {[
                { name: 'Rust Axum Gateway', rps: 124500, percent: 96, color: 'bg-cyan-400' },
                { name: 'Go Fiber Ingress', rps: 98200, percent: 78, color: 'bg-blue-500' },
                { name: 'Node.js Fastify Stream', rps: 64100, percent: 52, color: 'bg-sky-400' },
                { name: 'Python FastAPI Async', rps: 34800, percent: 32, color: 'bg-indigo-400' },
              ].map((bench, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-[11px] text-slate-300 mb-1 font-mono">
                    <span>{bench.name}</span>
                    <span className="text-cyan-300">{bench.rps.toLocaleString()} RPS</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${bench.color} transition-all duration-500`}
                      style={{ width: `${bench.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#091020] border-t border-cyan-500/15 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
