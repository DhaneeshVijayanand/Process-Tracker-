import React from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  CheckCircle2,
  AlertCircle,
  Users,
  GitPullRequest,
  CheckSquare,
  Sparkles
} from 'lucide-react';
import { useBA } from '../context/BAContext';

export const AnalyticsView = () => {
  const { requirements, tasks, changeRequests, activeProject } = useBA();

  const totalReqs = requirements.length;
  const implemented = requirements.filter((r) => r.status === 'Implemented').length;
  const approved = requirements.filter((r) => r.status === 'Approved').length;
  const analyzed = requirements.filter((r) => r.status === 'Analyzed').length;
  const gathering = requirements.filter((r) => r.status === 'Gathering').length;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'In Progress').length;
  const reviewTasks = tasks.filter((t) => t.status === 'Review').length;
  const todoTasks = tasks.filter((t) => t.status === 'To Do').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3E8DE]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#DFFF72] text-[#064E45]">
              Executive Telemetry
            </span>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#10201D] tracking-tight">
              BA Performance & Delivery Analytics
            </h1>
          </div>
          <p className="text-sm text-[#5A6E69] mt-1 font-medium">
            Quantitative velocity, status breakdown, and deliverable health metrics for <strong>{activeProject.name}</strong>.
          </p>
        </div>
      </div>

      {/* Top Velocity Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="saas-card p-6">
          <span className="text-xs font-mono font-bold uppercase text-[#5A6E69]">Requirement Completion</span>
          <div className="text-3xl font-extrabold font-heading text-[#10201D] mt-2">
            {Math.round(((implemented + approved) / totalReqs) * 100)}%
          </div>
          <div className="w-full h-2 bg-[#EFF2E9] rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-[#064E45] rounded-full" style={{ width: `${Math.round(((implemented + approved) / totalReqs) * 100)}%` }} />
          </div>
          <span className="text-[11px] text-[#5A6E69] mt-2 block font-mono">
            {implemented + approved} of {totalReqs} validated
          </span>
        </div>

        <div className="saas-card p-6">
          <span className="text-xs font-mono font-bold uppercase text-[#5A6E69]">Task Completion Ratio</span>
          <div className="text-3xl font-extrabold font-heading text-[#10201D] mt-2">
            {Math.round((completedTasks / totalTasks) * 100)}%
          </div>
          <div className="w-full h-2 bg-[#EFF2E9] rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-[#DFFF72] rounded-full" style={{ width: `${Math.round((completedTasks / totalTasks) * 100)}%` }} />
          </div>
          <span className="text-[11px] text-[#5A6E69] mt-2 block font-mono">
            {completedTasks} of {totalTasks} sprint items closed
          </span>
        </div>

        <div className="saas-card p-6">
          <span className="text-xs font-mono font-bold uppercase text-[#5A6E69]">Open Scope Issues</span>
          <div className="text-3xl font-extrabold font-heading text-[#10201D] mt-2">
            0
          </div>
          <span className="text-[11px] font-mono text-[#087F6A] font-bold mt-3 block">
            ✓ 0 blocking impediments
          </span>
        </div>

        <div className="saas-card p-6">
          <span className="text-xs font-mono font-bold uppercase text-[#5A6E69]">Stakeholder Engagement</span>
          <div className="text-3xl font-extrabold font-heading text-[#064E45] mt-2">
            96.4%
          </div>
          <span className="text-[11px] font-mono text-[#5A6E69] mt-3 block">
            High satisfaction rating
          </span>
        </div>
      </div>

      {/* Main Charts Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Requirement Status Distribution */}
        <div className="saas-card p-6 sm:p-7">
          <div className="flex items-center justify-between pb-3 mb-5 border-b border-[#E3E8DE]">
            <div>
              <h3 className="font-heading font-bold text-base text-[#10201D]">
                Requirement Status Distribution
              </h3>
              <p className="text-xs text-[#5A6E69]">Current lifecycle pipeline balance</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className="text-[#10201D] font-bold">Implemented ({implemented})</span>
                <span className="text-[#064E45] font-bold">{Math.round((implemented / totalReqs) * 100)}%</span>
              </div>
              <div className="w-full h-3 bg-[#EFF2E9] rounded-full overflow-hidden">
                <div className="h-full bg-[#064E45] rounded-full" style={{ width: `${(implemented / totalReqs) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className="text-[#10201D] font-bold">Approved ({approved})</span>
                <span className="text-[#087F6A] font-bold">{Math.round((approved / totalReqs) * 100)}%</span>
              </div>
              <div className="w-full h-3 bg-[#EFF2E9] rounded-full overflow-hidden">
                <div className="h-full bg-[#087F6A] rounded-full" style={{ width: `${(approved / totalReqs) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className="text-[#10201D] font-bold">Analyzed ({analyzed})</span>
                <span className="text-amber-800 font-bold">{Math.round((analyzed / totalReqs) * 100)}%</span>
              </div>
              <div className="w-full h-3 bg-[#EFF2E9] rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(analyzed / totalReqs) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className="text-[#10201D] font-bold">Gathering ({gathering})</span>
                <span className="text-[#5A6E69] font-bold">{Math.round((gathering / totalReqs) * 100)}%</span>
              </div>
              <div className="w-full h-3 bg-[#EFF2E9] rounded-full overflow-hidden">
                <div className="h-full bg-[#8C9E9A] rounded-full" style={{ width: `${(gathering / totalReqs) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="saas-card p-6 sm:p-7">
          <div className="flex items-center justify-between pb-3 mb-5 border-b border-[#E3E8DE]">
            <div>
              <h3 className="font-heading font-bold text-base text-[#10201D]">
                Priority & Criticality Allocation
              </h3>
              <p className="text-xs text-[#5A6E69]">MoSCoW risk-weighted requirement breakdown</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className="text-rose-800 font-bold">Critical Priority (2)</span>
                <span className="font-bold">33%</span>
              </div>
              <div className="w-full h-3 bg-[#EFF2E9] rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: '33%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className="text-amber-800 font-bold">High Priority (3)</span>
                <span className="font-bold">50%</span>
              </div>
              <div className="w-full h-3 bg-[#EFF2E9] rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: '50%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className="text-blue-800 font-bold">Medium Priority (1)</span>
                <span className="font-bold">17%</span>
              </div>
              <div className="w-full h-3 bg-[#EFF2E9] rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '17%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
