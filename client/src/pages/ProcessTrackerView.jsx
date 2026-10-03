import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Check,
  FileCheck,
  Layers,
  Calendar,
  AlertCircle,
  HelpCircle,
  FolderGit2
} from 'lucide-react';
import { useBA } from '../context/BAContext';

export const ProcessTrackerView = () => {
  const { processSteps, activeProject } = useBA();
  const [selectedStep, setSelectedStep] = useState(processSteps[6]); // Step 07 default current

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3E8DE]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#DFFF72] text-[#064E45]">
              Core Methodology
            </span>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#10201D] tracking-tight">
              BA Process Lifecycle Tracker
            </h1>
          </div>
          <p className="text-sm text-[#5A6E69] mt-1 font-medium">
            Standardized 10-step end-to-end Business Analyst delivery framework for <strong>{activeProject.name}</strong>.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#064E45]" />
            <span>Completed (1-6)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#DFFF72] border border-[#064E45]" />
            <span>Current (7)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#E3E8DE]" />
            <span>Upcoming (8-10)</span>
          </div>
        </div>
      </div>

      {/* Main Layout: 10-Step Timeline on Left, Selected Step Detail on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* TIMELINE LIST (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          {processSteps.map((step) => {
            const isCompleted = step.status === 'completed';
            const isCurrent = step.status === 'current';
            const isSelected = selectedStep.id === step.id;

            return (
              <div
                key={step.id}
                onClick={() => setSelectedStep(step)}
                className={`saas-card p-4 sm:p-5 flex items-center justify-between cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'ring-2 ring-[#064E45] border-[#064E45] bg-white shadow-saas-hover translate-x-1'
                    : isCurrent
                    ? 'border-[#064E45]/40 bg-[#F3FFCC]/30 hover:border-[#064E45]'
                    : isCompleted
                    ? 'border-[#E3E8DE] bg-[#FFFFFF] hover:bg-[#FAFAF7]'
                    : 'border-[#E3E8DE] bg-[#F7F8F2]/60 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Step Number Circle */}
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center font-heading font-extrabold text-sm transition-all ${
                      isCompleted
                        ? 'bg-[#064E45] text-white shadow-sm'
                        : isCurrent
                        ? 'bg-[#DFFF72] text-[#064E45] ring-2 ring-[#064E45] font-black'
                        : 'bg-[#EFF2E9] text-[#5A6E69]'
                    }`}
                  >
                    {isCompleted ? <Check className="w-5 h-5 stroke-[2.5]" /> : step.step}
                  </div>

                  {/* Title and Phase */}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-bold text-sm sm:text-base text-[#10201D]">
                        {step.title}
                      </h3>
                      {isCurrent && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#DFFF72] text-[#064E45] border border-[#064E45]/30">
                          Active Phase
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#5A6E69] font-mono mt-0.5 block">
                      Phase: {step.phase} • {step.completion}% Verified
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-mono font-semibold hidden sm:inline ${
                      isCompleted ? 'text-[#087F6A]' : isCurrent ? 'text-[#064E45]' : 'text-[#8C9E9A]'
                    }`}
                  >
                    {isCompleted ? 'Complete' : isCurrent ? '72% Done' : 'Queued'}
                  </span>
                  <ArrowRight
                    className={`w-4 h-4 transition-transform ${
                      isSelected ? 'text-[#064E45] translate-x-1' : 'text-[#8C9E9A]'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* STEP DETAIL DRILLDOWN PANEL (5 Cols) */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="saas-card-emerald p-6 sm:p-7 relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              {/* Header */}
              <div className="border-b border-white/15 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-[#DFFF72] uppercase tracking-wider">
                    PHASE {selectedStep.step} OF 10
                  </span>
                  <span
                    className={`text-xs font-bold font-mono px-3 py-0.5 rounded-full ${
                      selectedStep.status === 'completed'
                        ? 'bg-[#DFFF72] text-[#064E45]'
                        : selectedStep.status === 'current'
                        ? 'bg-white text-[#064E45]'
                        : 'bg-white/10 text-white'
                    }`}
                  >
                    {selectedStep.status.toUpperCase()}
                  </span>
                </div>

                <h2 className="text-2xl font-heading font-extrabold text-white">
                  {selectedStep.title}
                </h2>
                <span className="text-xs text-[#D6E6E3] font-mono mt-1 block">
                  Category: {selectedStep.phase}
                </span>
              </div>

              {/* Description */}
              <div>
                <span className="text-[11px] font-mono text-[#DFFF72] uppercase font-bold tracking-wider block mb-1.5">
                  Phase Objective & Scope
                </span>
                <p className="text-sm text-[#E1ECE9] leading-relaxed">
                  {selectedStep.description}
                </p>
              </div>

              {/* Expected Deliverables */}
              <div>
                <span className="text-[11px] font-mono text-[#DFFF72] uppercase font-bold tracking-wider block mb-2">
                  Formal Deliverables & Artifacts
                </span>
                <ul className="space-y-2">
                  {selectedStep.deliverables.map((d, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 text-xs text-[#FFFFFF]">
                      <FileCheck className="w-4 h-4 text-[#DFFF72] flex-shrink-0" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Key BA Activities */}
              <div>
                <span className="text-[11px] font-mono text-[#DFFF72] uppercase font-bold tracking-wider block mb-2">
                  Key BA Execution Activities
                </span>
                <div className="space-y-1.5">
                  {selectedStep.activities.map((a, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-white/10 text-xs text-[#E1ECE9] border border-white/10 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#DFFF72] mt-1.5 flex-shrink-0" />
                      <span className="leading-snug">{a}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Completion Progress Bar */}
              <div className="pt-2 border-t border-white/15">
                <div className="flex items-center justify-between text-xs font-mono text-[#D6E6E3] mb-1.5">
                  <span>Phase Health</span>
                  <span className="font-bold text-white">{selectedStep.completion}%</span>
                </div>
                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#DFFF72] rounded-full"
                    style={{ width: `${selectedStep.completion}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
