import React from 'react';
import { Briefcase, Calendar, CheckCircle2, ChevronDown, Clock, Plus, Share2, Sparkles, User } from 'lucide-react';
import { useBA } from '../context/BAContext';

export const ProjectHeader = ({ onAddRequirementClick, onNavigateProcess }) => {
  const { activeProject, projectsList, setActiveProject } = useBA();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'In Progress':
        return 'bg-[#DFFF72] text-[#064E45] border border-[#087F6A]/20';
      case 'Under Review':
        return 'bg-amber-100 text-amber-900 border border-amber-300';
      case 'Completed':
        return 'bg-emerald-100 text-emerald-900 border border-emerald-300';
      case 'Planning':
      default:
        return 'bg-[#EFF2E9] text-[#5A6E69] border border-[#E3E8DE]';
    }
  };

  return (
    <div className="saas-card-emerald p-6 sm:p-8 mb-8 relative overflow-hidden">
      {/* Decorative subtle ambient pattern */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#DFFF72]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          {/* Top metadata tags */}
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/10 text-white border border-white/15">
              Active BA Portfolio
            </span>
            <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${getStatusBadge(activeProject.status)}`}>
              {activeProject.status}
            </span>
            <span className="text-xs text-[#E1ECE9] font-mono flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#DFFF72]" />
              BA: <strong>{activeProject.ba}</strong>
            </span>
          </div>

          {/* Project Title & Selector */}
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight">
              {activeProject.name}
            </h1>
          </div>

          <p className="text-sm text-[#E1ECE9] mt-2 max-w-2xl leading-relaxed">
            {activeProject.description}
          </p>

          <div className="flex flex-wrap items-center gap-5 mt-4 text-xs font-mono text-[#D6E6E3]">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#DFFF72]" /> Target Handover: <strong>{activeProject.deadline}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[#DFFF72]" /> Client: <strong>{activeProject.client}</strong>
            </span>
          </div>
        </div>

        {/* Progress & Quick Actions */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 w-full sm:w-auto text-left lg:text-right">
            <div className="text-[11px] font-mono text-[#DFFF72] uppercase tracking-wider">
              BA Process Velocity
            </div>
            <div className="text-3xl font-extrabold text-white font-heading mt-0.5">
              {activeProject.progress}% <span className="text-sm font-normal text-[#E1ECE9]">Complete</span>
            </div>
            <div className="w-48 h-2 bg-white/20 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-[#DFFF72] rounded-full transition-all duration-700"
                style={{ width: `${activeProject.progress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {onAddRequirementClick && (
              <button
                onClick={onAddRequirementClick}
                className="btn-lime text-xs flex-1 sm:flex-none"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>New Requirement</span>
              </button>
            )}
            {onNavigateProcess && (
              <button
                onClick={onNavigateProcess}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all flex items-center gap-1.5 flex-1 sm:flex-none"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#DFFF72]" />
                <span>Process Map</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
