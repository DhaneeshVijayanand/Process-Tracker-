import React from 'react';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  FileText,
  Plus,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ChevronRight,
  UserCheck,
  Calendar,
  Layers,
  Activity,
  CheckSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBA } from '../context/BAContext';
import { StatCard } from '../components/StatCard';
import { ProjectHeader } from '../components/ProjectHeader';

export const DashboardView = ({ onNavigate, onOpenNewRequirementModal }) => {
  const { user } = useAuth();
  const { activeProject, projectsList, requirements, tasks, processSteps, setActiveProject } = useBA();

  const userName = user?.name || 'Dhaneesh';
  const firstName = userName.split(' ')[0];

  const completedReqs = requirements.filter((r) => r.status === 'Implemented' || r.status === 'Approved').length;
  const pendingTasksCount = tasks.filter((t) => t.status !== 'Completed').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Section: Greeting & Primary CTAs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E3E8DE]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#10201D] tracking-tight">
            Good morning, {firstName}
          </h1>
          <p className="text-sm text-[#5A6E69] mt-1 font-medium">
            Here’s your BA project overview and delivery trajectory for today.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenNewRequirementModal}
            className="btn-lime text-xs sm:text-sm font-bold shadow-lime-btn"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ New Requirement</span>
          </button>

          <button
            onClick={() => onNavigate('projects')}
            className="btn-outline text-xs sm:text-sm"
          >
            <Briefcase className="w-4 h-4 text-[#064E45]" />
            <span>View Projects</span>
          </button>
        </div>
      </div>

      {/* Hero Active Project Header */}
      <ProjectHeader
        onAddRequirementClick={onOpenNewRequirementModal}
        onNavigateProcess={() => onNavigate('process-tracker')}
      />

      {/* Four Primary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Projects"
          value="12"
          subtitle="3 Active in Sprint"
          change="+3 this month"
          icon={Briefcase}
        />
        <StatCard
          title="Active Requirements"
          value="28"
          subtitle="8 awaiting stakeholder review"
          change="+14% pace"
          icon={FileText}
        />
        <StatCard
          title="Pending Tasks"
          value={pendingTasksCount.toString()}
          subtitle="5 due this sprint"
          change="On track"
          icon={CheckSquare}
        />
        <StatCard
          title="Overall Progress"
          value={`${activeProject.progress}%`}
          subtitle="BA Lifecycle Phase 7 of 10"
          change="+8% this month"
          icon={TrendingUp}
        />
      </div>

      {/* Grid: 10-Step BA Lifecycle Timeline Preview + Tasks Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: BA Lifecycle Interactive Stepper Preview (8 Cols) */}
        <div className="lg:col-span-8 saas-card p-6 sm:p-7">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E3E8DE]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#064E45] bg-[#DFFF72] px-2.5 py-0.5 rounded-full">
                  Core Framework
                </span>
                <h2 className="text-lg font-bold font-heading text-[#10201D]">
                  BA Process Lifecycle
                </h2>
              </div>
              <p className="text-xs text-[#5A6E69] mt-0.5">
                Current Phase: <strong className="text-[#064E45]">07 Development Support (72% complete)</strong>
              </p>
            </div>

            <button
              onClick={() => onNavigate('process-tracker')}
              className="text-xs font-bold text-[#064E45] hover:text-[#087F6A] flex items-center gap-1 font-mono"
            >
              <span>Full 10-Step Map</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Stepper Horizontal Scroll Container */}
          <div className="overflow-x-auto pb-4 pt-2">
            <div className="flex items-center gap-3 min-w-[750px]">
              {processSteps.slice(0, 7).map((step, idx) => {
                const isCompleted = step.status === 'completed';
                const isCurrent = step.status === 'current';

                return (
                  <div
                    key={step.id}
                    onClick={() => onNavigate('process-tracker')}
                    className={`flex-1 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-[#064E45] text-white border-[#064E45] shadow-saas-card ring-2 ring-[#DFFF72]'
                        : isCompleted
                        ? 'bg-[#F2F7F5] border-[#D1E2DD] text-[#064E45] hover:bg-[#E6F0EC]'
                        : 'bg-white border-[#E3E8DE] text-[#5A6E69]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-mono font-bold ${isCurrent ? 'text-[#DFFF72]' : 'text-[#5A6E69]'}`}>
                        STEP {step.step}
                      </span>
                      {isCompleted && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#087F6A]" />
                      )}
                      {isCurrent && (
                        <span className="w-2 h-2 rounded-full bg-[#DFFF72] animate-ping" />
                      )}
                    </div>
                    <div className={`text-xs font-bold truncate ${isCurrent ? 'text-white' : 'text-[#10201D]'}`}>
                      {step.title}
                    </div>
                    <div className={`text-[10px] mt-1 truncate ${isCurrent ? 'text-[#D6E6E3]' : 'text-[#5A6E69]'}`}>
                      {step.phase}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Key Deliverables Pill Checklist */}
          <div className="mt-4 pt-4 border-t border-[#EFF2E9] flex flex-wrap items-center justify-between gap-3 text-xs text-[#5A6E69]">
            <span className="font-semibold text-[#10201D]">Active Sprint Deliverables:</span>
            <span className="bg-[#EFF2E9] text-[#064E45] px-2.5 py-1 rounded-lg font-mono text-[11px] font-semibold">
              ✓ User Story Backlog
            </span>
            <span className="bg-[#EFF2E9] text-[#064E45] px-2.5 py-1 rounded-lg font-mono text-[11px] font-semibold">
              ✓ BRD v2.4 Signed
            </span>
            <span className="bg-[#DFFF72] text-[#064E45] px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold">
              ⚡ Gherkin UAT Testing
            </span>
          </div>
        </div>

        {/* Right: Urgent Tasks & Deadlines (4 Cols) */}
        <div className="lg:col-span-4 saas-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E3E8DE]">
              <h2 className="text-base font-bold font-heading text-[#10201D] flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-[#064E45]" />
                <span>Sprint Task Focus</span>
              </h2>
              <button
                onClick={() => onNavigate('tasks')}
                className="text-xs text-[#064E45] font-bold hover:underline"
              >
                Board
              </button>
            </div>

            <div className="space-y-3">
              {tasks.slice(0, 4).map((t) => (
                <div
                  key={t.id}
                  className="p-3 rounded-xl border border-[#E3E8DE] bg-[#F7F8F2] hover:bg-white hover:border-[#064E45]/30 transition-all text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] text-[#5A6E69] font-bold">{t.id}</span>
                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        t.priority === 'Critical'
                          ? 'bg-rose-100 text-rose-800'
                          : t.priority === 'High'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {t.priority}
                    </span>
                  </div>
                  <div className="font-semibold text-[#10201D] line-clamp-2">
                    {t.task}
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E3E8DE] text-[10px] text-[#5A6E69]">
                    <span>{t.assignedTo}</span>
                    <span className="font-mono text-[#064E45] font-bold">{t.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('tasks')}
            className="w-full mt-4 py-2.5 rounded-xl border border-[#D8E0D7] bg-white hover:bg-[#F7F8F2] text-xs font-bold text-[#10201D] transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Open Kanban Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Projects Quick Overview Row */}
      <div className="saas-card p-6 sm:p-7">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#E3E8DE]">
          <div>
            <h2 className="text-lg font-bold font-heading text-[#10201D]">
              Monitored Projects Portfolio
            </h2>
            <p className="text-xs text-[#5A6E69]">
              Enterprise client deliverables managed under the BA traceability framework
            </p>
          </div>
          <button
            onClick={() => onNavigate('projects')}
            className="text-xs font-bold text-[#064E45] hover:text-[#087F6A] flex items-center gap-1"
          >
            <span>View All ({projectsList.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {projectsList.map((project) => (
            <div
              key={project.id}
              onClick={() => {
                setActiveProject(project);
                onNavigate('projects');
              }}
              className="p-5 rounded-2xl border border-[#E3E8DE] bg-[#FFFFFF] hover:border-[#064E45] hover:shadow-saas-hover transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full ${
                      project.status === 'In Progress'
                        ? 'bg-[#DFFF72] text-[#064E45]'
                        : project.status === 'Under Review'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-[#EFF2E9] text-[#5A6E69]'
                    }`}
                  >
                    {project.status}
                  </span>
                  <span className="text-xs font-mono font-extrabold text-[#064E45]">
                    {project.progress}%
                  </span>
                </div>

                <h3 className="font-heading font-bold text-sm text-[#10201D] mb-1">
                  {project.name}
                </h3>
                <p className="text-xs text-[#5A6E69] line-clamp-2 leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#EFF2E9] flex items-center justify-between text-[11px] text-[#5A6E69] font-mono">
                <span>{project.totalRequirements} Reqs</span>
                <span>Due: {project.deadline}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
