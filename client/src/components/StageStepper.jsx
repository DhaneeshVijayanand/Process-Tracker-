import React from 'react';
import { Check, Clock, Eye, Sparkles } from 'lucide-react';

const STAGES = [
  { key: 'Planning', label: 'Planning', desc: 'Scope & Discovery', icon: Clock },
  { key: 'In Progress', label: 'In Progress', desc: 'Architecture & Build', icon: Sparkles },
  { key: 'Review', label: 'Review', desc: 'QA & Stakeholder Walkthrough', icon: Eye },
  { key: 'Completed', label: 'Completed', desc: 'Deployment & Handover', icon: Check }
];

export const StageStepper = ({ currentStage = 'Planning' }) => {
  const currentIndex = Math.max(
    0,
    STAGES.findIndex((s) => s.key.toLowerCase() === currentStage.toLowerCase())
  );

  return (
    <div className="w-full py-4">
      <div className="relative flex items-center justify-between max-w-4xl mx-auto">
        {/* Background Connecting Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2 z-0 rounded-full" />

        {/* Active Connecting Fill Line */}
        <div
          className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500 -translate-y-1/2 z-0 rounded-full shadow-[0_0_10px_rgba(0,245,255,0.6)]"
          style={{
            width: `${(currentIndex / (STAGES.length - 1)) * 100}%`,
            transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />

        {/* Stages */}
        {STAGES.map((stage, idx) => {
          const isPassed = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isUpcoming = idx > currentIndex;
          const Icon = stage.icon;

          return (
            <div key={stage.key} className="relative z-10 flex flex-col items-center">
              {/* Stepper Node */}
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  isPassed
                    ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 font-bold border border-cyan-400 shadow-[0_0_14px_rgba(0,245,255,0.5)]'
                    : isCurrent
                    ? 'bg-slate-900 border-2 border-cyan-400 text-cyan-400 animate-pulse-glow shadow-glow-cyan'
                    : 'bg-slate-900/90 border border-slate-700 text-slate-500'
                }`}
              >
                {isPassed ? (
                  <Check className="w-5 h-5 stroke-[2.5]" />
                ) : (
                  <Icon className={`w-5 h-5 ${isCurrent ? 'animate-spin-slow' : ''}`} />
                )}
              </div>

              {/* Stage Text Labels */}
              <div className="mt-2.5 text-center">
                <span
                  className={`block text-xs font-display font-bold uppercase tracking-wider ${
                    isCurrent
                      ? 'text-cyan-300 font-extrabold text-shadow-sm'
                      : isPassed
                      ? 'text-slate-200'
                      : 'text-slate-500'
                  }`}
                >
                  {stage.label}
                </span>
                <span className="text-[10px] text-slate-400 font-mono hidden sm:block max-w-[100px] truncate">
                  {stage.desc}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
