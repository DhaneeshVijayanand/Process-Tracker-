import React from 'react';
import { Bookmark, CheckCircle2, User, Code2, Sparkles, Plus, Clock } from 'lucide-react';
import { useBA } from '../context/BAContext';

export const UserStoriesView = () => {
  const { userStories } = useBA();

  const getPriorityBadge = (p) => {
    switch (p) {
      case 'Critical':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'High':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  const getStatusBadge = (s) => {
    switch (s) {
      case 'Implemented':
        return 'bg-[#DFFF72] text-[#064E45] border-[#087F6A]/20';
      case 'In Progress':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-[#EFF2E9] text-[#5A6E69] border-[#E3E8DE]';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3E8DE]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#10201D] tracking-tight">
            User Stories Backlog
          </h1>
          <p className="text-sm text-[#5A6E69] mt-1 font-medium">
            Agile user-centric specifications mapped to business value and engineering sprints.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-[#064E45] bg-[#EFF2E9] px-3 py-1.5 rounded-full">
            {userStories.length} Stories Active
          </span>
        </div>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {userStories.map((story) => (
          <div
            key={story.id}
            className="saas-card p-6 flex flex-col justify-between hover:border-[#064E45]/40 transition-all"
          >
            <div>
              {/* Header row */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-[#064E45] text-[#DFFF72]">
                  {story.id}
                </span>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getPriorityBadge(story.priority)}`}>
                    {story.priority}
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(story.status)}`}>
                    {story.status}
                  </span>
                </div>
              </div>

              {/* Story Narrative Box */}
              <div className="p-4 rounded-2xl bg-[#F7F8F2] border border-[#E3E8DE] mb-4">
                <p className="text-sm font-semibold text-[#10201D] leading-relaxed">
                  "{story.story}"
                </p>
              </div>

              {/* Acceptance Criteria */}
              <div className="mb-4">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#064E45] block mb-1">
                  Acceptance Criteria (Gherkin format)
                </span>
                <p className="text-xs text-[#5A6E69] leading-relaxed bg-white p-3 rounded-xl border border-[#EFF2E9]">
                  {story.acceptanceCriteria}
                </p>
              </div>
            </div>

            {/* Footer metadata */}
            <div className="pt-3 border-t border-[#EFF2E9] flex items-center justify-between text-xs text-[#5A6E69] font-mono">
              <span className="flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-[#064E45]" />
                {story.assignedDev}
              </span>
              <span className="font-bold text-[#064E45] bg-[#DFFF72] px-2.5 py-0.5 rounded-full text-[10px]">
                {story.sprint}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
