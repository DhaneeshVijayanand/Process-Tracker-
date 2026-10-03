import React, { useState, useEffect } from 'react';
import {
  Layers,
  MessageSquare,
  Search,
  Sparkles,
  TrendingUp,
  FolderGit2,
  Calendar,
  Filter,
  CheckCircle2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { CircularProgressRing } from '../components/CircularProgressRing';
import { StageStepper } from '../components/StageStepper';
import { FeedPost } from '../components/FeedPost';

export const ClientDashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [currentProject, setCurrentProject] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingUpdates, setLoadingUpdates] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');

  // Fetch projects belonging strictly to this client
  const fetchClientProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get('/projects');
      const clientProjects = res.projects || [];
      setProjects(clientProjects);

      if (clientProjects.length > 0 && !selectedProjectId) {
        setSelectedProjectId(clientProjects[0].id);
        setCurrentProject(clientProjects[0]);
      }
    } catch (err) {
      console.error('Error fetching client projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientProjects();
  }, []);

  // Fetch updates when selected project changes
  const fetchProjectUpdates = async (projectId) => {
    if (!projectId) return;
    try {
      setLoadingUpdates(true);
      const res = await api.get(`/projects/${projectId}/updates`);
      setUpdates(res.updates || []);
      setCurrentProject(res.project);
    } catch (err) {
      console.error('Error fetching updates:', err);
    } finally {
      setLoadingUpdates(false);
    }
  };

  useEffect(() => {
    if (selectedProjectId) {
      fetchProjectUpdates(selectedProjectId);
    }
  }, [selectedProjectId]);

  const stages = ['Planning', 'In Progress', 'Review', 'Completed'];
  const currentStageIdx = currentProject
    ? stages.findIndex((s) => s.toLowerCase() === currentProject.stage.toLowerCase())
    : 0;
  const stagesLeft = Math.max(0, stages.length - 1 - (currentStageIdx === -1 ? 0 : currentStageIdx));

  // Compute total comments in current project feed
  const totalComments = updates.reduce((sum, u) => sum + (u.comments?.length || 0), 0);

  // Filter updates based on search query and stage filter
  const filteredUpdates = updates.filter((u) => {
    const matchesSearch =
      u.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.author?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.stage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = stageFilter === 'ALL' || u.stage.toLowerCase() === stageFilter.toLowerCase();
    return matchesSearch && matchesStage;
  });

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-mono text-cyan-400 tracking-wider">
          SYNCHRONIZING SECURE CLIENT FEED...
        </span>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center">
        <div className="glass-panel-glow rounded-3xl p-10 border border-cyan-500/20">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto mb-4 shadow-glow-cyan">
            <FolderGit2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold font-display text-white mb-2">No Active Projects Assigned</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Your client profile is ready. The project management team will initiate and assign your deliverable track shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Banner: Project Switcher & Executive Header */}
      <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 border border-cyan-500/30 relative overflow-hidden">
        {/* Glow corner accents */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-cyan-500/10 to-violet-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                ACTIVE DELIVERABLE
              </span>
              <span className="text-xs font-mono text-slate-400">
                Client: {user?.name}
              </span>
            </div>

            {/* Multiple Project Selector Dropdown if user has > 1 */}
            {projects.length > 1 ? (
              <div className="flex items-center gap-3 mt-1">
                <select
                  value={selectedProjectId}
                  onChange={(e) => {
                    const found = projects.find((p) => p.id === e.target.value);
                    setSelectedProjectId(e.target.value);
                    setCurrentProject(found);
                  }}
                  className="px-4 py-2 rounded-xl glass-input text-base sm:text-xl font-display font-bold text-white cursor-pointer bg-slate-900"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-wide">
                {currentProject?.name}
              </h1>
            )}

            <p className="text-xs sm:text-sm text-slate-400 mt-2 font-mono flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              Tracking started on {new Date(currentProject?.createdAt).toLocaleDateString([], {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          </div>

          {/* Quick HUD Metrics */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                Current Health
              </span>
              <span className="text-sm font-bold text-emerald-400 flex items-center justify-end gap-1">
                <CheckCircle2 className="w-4 h-4" /> ON SCHEDULE
              </span>
            </div>
            <button
              onClick={() => fetchProjectUpdates(selectedProjectId)}
              className="p-2.5 rounded-xl glass-input hover:border-cyan-500/50 text-slate-300 hover:text-cyan-400 transition-colors"
              title="Refresh project feed"
            >
              <RefreshCw className={`w-4 h-4 ${loadingUpdates ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Stage Stepper Component */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <StageStepper currentStage={currentProject?.stage || 'Planning'} />
        </div>
      </div>

      {/* Progress & Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {/* Animated Circular Progress Gauge */}
        <div className="md:col-span-1 glass-panel rounded-3xl p-6 border border-cyan-500/20 flex flex-col items-center justify-center text-center">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Milestone Velocity
          </span>
          <CircularProgressRing progress={currentProject?.progress || 0} size={150} strokeWidth={12} />
          <span className="mt-3 text-xs text-slate-400 font-mono">
            Stage: <strong className="text-cyan-300">{currentProject?.stage}</strong>
          </span>
        </div>

        {/* Stats Card: Updates */}
        <div className="glass-panel rounded-3xl p-6 border border-cyan-500/20 flex flex-col justify-between hover:border-cyan-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
              Total Logged Updates
            </span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold font-display text-white mt-4">
              {updates.length}
            </div>
            <span className="text-xs text-slate-400 font-mono mt-1 block">
              Daily engineering & BA logs
            </span>
          </div>
        </div>

        {/* Stats Card: Comments & Collaboration */}
        <div className="glass-panel rounded-3xl p-6 border border-cyan-500/20 flex flex-col justify-between hover:border-cyan-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
              Discussion Feed
            </span>
            <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold font-display text-white mt-4">
              {totalComments}
            </div>
            <span className="text-xs text-slate-400 font-mono mt-1 block">
              Client & architect notes
            </span>
          </div>
        </div>

        {/* Stats Card: Stages Left */}
        <div className="glass-panel rounded-3xl p-6 border border-cyan-500/20 flex flex-col justify-between hover:border-cyan-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
              Phases Remaining
            </span>
            <div className="w-9 h-9 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold font-display text-white mt-4">
              {stagesLeft}
            </div>
            <span className="text-xs text-slate-400 font-mono mt-1 block">
              {stagesLeft === 0 ? 'Project Finalized 🎉' : `Milestone step ${currentStageIdx + 1} of 4`}
            </span>
          </div>
        </div>
      </div>

      {/* Feed Section Header & Search/Filter Controls */}
      <div className="pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-wide flex items-center gap-2">
              <span>PROJECT TIMELINE STREAM</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                {filteredUpdates.length} posts
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Live updates published by the engineering team
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search updates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3.5 py-1.5 rounded-xl glass-input text-xs text-white placeholder-slate-500 w-44 sm:w-56"
              />
            </div>

            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl glass-input text-xs text-slate-200 bg-slate-900 border border-slate-700 font-mono"
            >
              <option value="ALL">All Stages</option>
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="Review">Review</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Updates Feed (Newest First) */}
        {loadingUpdates ? (
          <div className="py-12 text-center text-xs font-mono text-cyan-400">
            LOADING TIMELINE UPDATES...
          </div>
        ) : filteredUpdates.length === 0 ? (
          <div className="glass-panel rounded-2xl p-10 text-center border border-slate-800">
            <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-sm text-slate-400 font-display">No matching updates found.</p>
            <span className="text-xs text-slate-500 font-mono mt-1 block">
              Try adjusting your search criteria or stage filter.
            </span>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredUpdates.map((update) => (
              <FeedPost
                key={update.id}
                update={update}
                onUpdateChanged={() => fetchProjectUpdates(selectedProjectId)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
