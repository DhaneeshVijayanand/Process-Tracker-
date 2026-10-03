import React, { useState } from 'react';
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Filter,
  Layers,
  Plus,
  Search,
  User,
  ArrowRight,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { useBA } from '../context/BAContext';
import { useAuth } from '../context/AuthContext';

export const ProjectsView = ({ onSelectProject, onOpenCreateProjectModal }) => {
  const { user } = useAuth();
  const { projectsList, activeProject, setActiveProject } = useBA();
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [search, setSearch] = useState('');

  const filteredProjects = projectsList.filter((p) => {
    const matchesStatus = filterStatus === 'ALL' || p.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.client.toLowerCase().includes(search.toLowerCase()) ||
      p.ba.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'In Progress':
        return 'bg-[#DFFF72] text-[#064E45] border border-[#087F6A]/20';
      case 'Under Review':
        return 'bg-amber-100 text-amber-900 border border-amber-300';
      case 'Completed':
        return 'bg-emerald-100 text-emerald-900 border border-emerald-300';
      case 'Blocked':
        return 'bg-rose-100 text-rose-900 border border-rose-300';
      case 'Planning':
      default:
        return 'bg-[#EFF2E9] text-[#5A6E69] border border-[#E3E8DE]';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3E8DE]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#10201D] tracking-tight">
            Projects Portfolio
          </h1>
          <p className="text-sm text-[#5A6E69] mt-1 font-medium">
            Monitor, organize, and navigate all active Business Analyst client engagements.
          </p>
        </div>

        {user?.role === 'ADMIN' && onOpenCreateProjectModal && (
          <button onClick={onOpenCreateProjectModal} className="btn-lime text-xs sm:text-sm font-bold">
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Create New Project</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="saas-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C9E9A]" />
          <input
            type="text"
            placeholder="Search by project name, client, or BA..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F7F8F2] border border-[#E3E8DE] text-xs text-[#10201D] placeholder-[#8C9E9A] focus:outline-none focus:border-[#064E45]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#5A6E69]" />
          <span className="text-xs text-[#5A6E69] font-medium hidden sm:inline">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#F7F8F2] border border-[#E3E8DE] text-xs font-semibold text-[#10201D] focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="In Progress">In Progress</option>
            <option value="Under Review">Under Review</option>
            <option value="Planning">Planning</option>
            <option value="Completed">Completed</option>
            <option value="Blocked">Blocked</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => {
          const isActive = activeProject.id === project.id;

          return (
            <div
              key={project.id}
              className={`saas-card p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 ${
                isActive ? 'ring-2 ring-[#064E45] border-[#064E45] shadow-saas-hover' : 'hover:border-[#064E45]/40'
              }`}
            >
              <div>
                {/* Header row */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${getStatusBadge(project.status)}`}>
                    {project.status}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-[#064E45] font-bold">
                    <span>{project.progress}% Complete</span>
                  </div>
                </div>

                <h3 className="text-xl font-heading font-bold text-[#10201D] mb-1.5">
                  {project.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#5A6E69] leading-relaxed mb-4">
                  {project.description}
                </p>

                {/* Progress Bar */}
                <div className="w-full h-2.5 bg-[#EFF2E9] rounded-full overflow-hidden mb-5">
                  <div
                    className="h-full bg-gradient-to-r from-[#064E45] to-[#087F6A] rounded-full"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-[#EFF2E9] text-xs">
                  <div>
                    <span className="text-[10px] text-[#8C9E9A] uppercase font-mono block">Assigned BA</span>
                    <strong className="text-[#10201D] truncate block">{project.ba}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8C9E9A] uppercase font-mono block">Deadline</span>
                    <strong className="text-[#10201D] block">{project.deadline}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8C9E9A] uppercase font-mono block">Requirements</span>
                    <strong className="text-[#10201D] block">{project.totalRequirements} items</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8C9E9A] uppercase font-mono block">Completed</span>
                    <strong className="text-[#087F6A] block">{project.completedRequirements} done</strong>
                  </div>
                </div>
              </div>

              {/* Action footer */}
              <div className="mt-5 pt-2 flex items-center justify-between">
                <span className="text-xs text-[#5A6E69] font-mono">
                  Client: <strong>{project.client}</strong>
                </span>

                <button
                  onClick={() => {
                    setActiveProject(project);
                    if (onSelectProject) onSelectProject(project);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#064E45] text-white shadow-sm'
                      : 'bg-[#EFF2E9] text-[#10201D] hover:bg-[#DFFF72] hover:text-[#064E45]'
                  }`}
                >
                  <span>{isActive ? 'Active Workspace' : 'Select Project'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
