import React from 'react';
import {
  X,
  FileText,
  CheckCircle2,
  Calendar,
  User,
  ShieldAlert,
  GitCommit,
  Tag,
  MessageSquare,
  Bookmark
} from 'lucide-react';

export const RequirementDetailModal = ({ requirement, onClose }) => {
  if (!requirement) return null;

  const getPriorityBadge = (p) => {
    switch (p) {
      case 'Critical':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'High':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Medium':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusBadge = (s) => {
    switch (s) {
      case 'Implemented':
        return 'bg-[#DFFF72] text-[#064E45] border-[#087F6A]/20';
      case 'Approved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Analyzed':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Gathering':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl border border-[#E3E8DE] shadow-saas-float p-6 sm:p-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-[#5A6E69] hover:text-[#10201D] hover:bg-[#F7F8F2] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="border-b border-[#E3E8DE] pb-5 mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-[#064E45] text-[#DFFF72]">
              {requirement.id}
            </span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#EFF2E9] text-[#064E45]">
              {requirement.type}
            </span>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getPriorityBadge(requirement.priority)}`}>
              {requirement.priority} Priority
            </span>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(requirement.status)}`}>
              {requirement.status}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-[#10201D] tracking-tight">
            {requirement.title}
          </h2>

          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-[#5A6E69] font-mono">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-[#064E45]" /> Assigned BA: <strong>{requirement.assignedBA}</strong>
            </span>
            <span className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-[#064E45]" /> Stakeholder: <strong>{requirement.stakeholder}</strong>
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#064E45]" /> Target Due: <strong>{requirement.dueDate}</strong>
            </span>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-6 text-sm">
          {/* 1. Description */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#064E45] mb-1.5">
              1. Detailed Functional Description
            </h3>
            <p className="text-[#10201D] bg-[#F7F8F2] p-4 rounded-2xl border border-[#E3E8DE] leading-relaxed">
              {requirement.description}
            </p>
          </div>

          {/* 2. Business Need */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#064E45] mb-1.5">
              2. Strategic Business Need & Justification
            </h3>
            <p className="text-[#10201D] bg-[#F7F8F2] p-4 rounded-2xl border border-[#E3E8DE] leading-relaxed">
              {requirement.businessNeed}
            </p>
          </div>

          {/* 3. Acceptance Criteria (Gherkin style) */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#064E45] mb-2">
              3. Acceptance Criteria Checklist (MoSCoW / Gherkin)
            </h3>
            <div className="space-y-2">
              {requirement.acceptanceCriteria && Array.isArray(requirement.acceptanceCriteria) ? (
                requirement.acceptanceCriteria.map((ac, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-[#E3E8DE]">
                    <CheckCircle2 className="w-4 h-4 text-[#087F6A] mt-0.5 flex-shrink-0" />
                    <span className="text-[#10201D] leading-snug">{ac}</span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-[#5A6E69] p-3 rounded-xl bg-[#F7F8F2]">
                  Standard verification checks logged in test management system.
                </div>
              )}
            </div>
          </div>

          {/* 4. Business Rules & Dependencies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-[#E3E8DE] bg-[#F7F8F2]">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#064E45] mb-1">
                <ShieldAlert className="w-4 h-4" />
                <span>Associated Business Rules</span>
              </div>
              <span className="font-semibold text-xs text-[#10201D]">
                {requirement.businessRules || 'BR-001 High-Value Transfer Threshold'}
              </span>
            </div>

            <div className="p-4 rounded-2xl border border-[#E3E8DE] bg-[#F7F8F2]">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#064E45] mb-1">
                <GitCommit className="w-4 h-4" />
                <span>Upstream System Dependencies</span>
              </div>
              <span className="font-semibold text-xs text-[#10201D]">
                {requirement.dependencies || 'SMS Gateway Service, User Identity Directory (UID)'}
              </span>
            </div>
          </div>

          {/* 5. Related User Stories */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#064E45] mb-1.5 flex items-center gap-1.5">
              <Bookmark className="w-4 h-4" />
              <span>Related User Stories Backlog</span>
            </h3>
            <div className="p-3.5 rounded-2xl bg-[#F7F8F2] border border-[#E3E8DE] text-xs font-mono text-[#064E45] font-bold">
              {requirement.relatedStories || 'US-102 (Sprint 3 Backlog)'}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-[#E3E8DE] flex justify-end">
          <button onClick={onClose} className="btn-emerald text-xs">
            Close Specification
          </button>
        </div>
      </div>
    </div>
  );
};
