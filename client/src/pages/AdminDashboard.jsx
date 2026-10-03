import React, { useState, useEffect } from 'react';
import {
  Users,
  FolderGit2,
  Layers,
  Plus,
  Trash2,
  Shield,
  Zap,
  Activity,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  Lock,
  UserPlus,
  FolderPlus
} from 'lucide-react';
import { api } from '../utils/api';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showUserModal, setShowUserModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);

  // New User Form
  const [newUserId, setNewUserId] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('CLIENT');
  const [userError, setUserError] = useState('');
  const [userSuccess, setUserSuccess] = useState('');

  // New Project Form
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectClientId, setNewProjectClientId] = useState('');
  const [newProjectStage, setNewProjectStage] = useState('Planning');
  const [newProjectProgress, setNewProjectProgress] = useState(0);
  const [projectError, setProjectError] = useState('');
  const [projectSuccess, setProjectSuccess] = useState('');

  const [deletingId, setDeletingId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, projectsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/users'),
        api.get('/projects')
      ]);

      setStats(statsRes);
      setUsers(usersRes.users || []);
      setProjects(projectsRes.projects || []);

      // If client accounts exist, set initial default for new project client
      const clients = (usersRes.users || []).filter((u) => u.role === 'CLIENT');
      if (clients.length > 0 && !newProjectClientId) {
        setNewProjectClientId(clients[0].id);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setUserError('');
    setUserSuccess('');

    try {
      await api.post('/users', {
        userId: newUserId.trim(),
        name: newUserName.trim(),
        password: newUserPassword,
        role: newUserRole
      });

      setUserSuccess('User account provisioned successfully!');
      setNewUserId('');
      setNewUserName('');
      setNewUserPassword('');
      fetchData();

      setTimeout(() => {
        setUserSuccess('');
        setShowUserModal(false);
      }, 1200);
    } catch (err) {
      setUserError(err.message || 'Failed to create user');
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setProjectError('');
    setProjectSuccess('');

    try {
      await api.post('/projects', {
        name: newProjectName.trim(),
        clientId: newProjectClientId,
        stage: newProjectStage,
        progress: Number(newProjectProgress)
      });

      setProjectSuccess('Project created and client notified!');
      setNewProjectName('');
      setNewProjectProgress(0);
      fetchData();

      setTimeout(() => {
        setProjectSuccess('');
        setShowProjectModal(false);
      }, 1200);
    } catch (err) {
      setProjectError(err.message || 'Failed to create project');
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove user "${name}"? All associated data will be deleted.`)) {
      return;
    }

    try {
      setDeletingId(id);
      await api.delete(`/users/${id}`);
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to delete user');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteProject = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete project "${name}" and all its daily updates?`)) {
      return;
    }

    try {
      await api.delete(`/projects/${id}`);
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to delete project');
    }
  };

  const clientUsers = users.filter((u) => u.role === 'CLIENT');

  // Bar chart helper: calculate max updates for scaling
  const chartItems = stats?.chartData || [];
  const maxUpdates = Math.max(1, ...chartItems.map((c) => c.updateCount));

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-wide flex items-center gap-2">
            <span>ADMIN COMMAND CONSOLE</span>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/30">
              OPERATIONS ROOT
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
            Global governance, client provisioning, and system deliverable telemetry
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowUserModal(true)}
            className="px-4 py-2.5 rounded-xl cyber-button-pink text-xs font-semibold flex items-center gap-1.5 shadow-glow-pink"
            style={{
              background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
              color: '#ffffff'
            }}
          >
            <UserPlus className="w-4 h-4" />
            <span>Create User</span>
          </button>

          <button
            onClick={() => setShowProjectModal(true)}
            className="px-4 py-2.5 rounded-xl cyber-button-cyan text-xs font-semibold flex items-center gap-1.5 shadow-glow-cyan"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Create Project</span>
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-panel rounded-3xl p-6 border border-pink-500/20 hover:border-pink-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
              Total System Users
            </span>
            <div className="w-9 h-9 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-display text-white mt-4">
            {stats?.metrics?.totalUsers || users.length}
          </div>
          <div className="flex items-center gap-2 mt-2 text-[11px] font-mono text-slate-400">
            <span>{stats?.roleBreakdown?.client || 0} Clients</span> •
            <span>{stats?.roleBreakdown?.team || 0} Team</span> •
            <span>{stats?.roleBreakdown?.admin || 0} Admins</span>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6 border border-cyan-500/20 hover:border-cyan-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
              Active Projects
            </span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-display text-white mt-4">
            {stats?.metrics?.totalProjects || projects.length}
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-2 block">
            Client-assigned deliverable tracks
          </span>
        </div>

        <div className="glass-panel rounded-3xl p-6 border border-violet-500/20 hover:border-violet-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
              Daily Updates Logged
            </span>
            <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-display text-white mt-4">
            {stats?.metrics?.totalUpdates || 0}
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-2 block">
            {stats?.metrics?.totalComments || 0} collaborative feedback notes
          </span>
        </div>
      </div>

      {/* BAR CHART: Updates per Project */}
      <div className="glass-panel-glow rounded-3xl p-6 sm:p-7 border border-cyan-500/30">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold font-display text-white">
                Project Activity Velocity (Updates Per Project)
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Comparative telemetry of milestone publications across client accounts
              </p>
            </div>
          </div>
        </div>

        {chartItems.length === 0 ? (
          <div className="py-12 text-center text-slate-500 font-mono text-xs">
            No projects registered to plot activity.
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            {chartItems.map((item) => {
              const percentage = Math.round((item.updateCount / maxUpdates) * 100);
              return (
                <div key={item.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-200 font-semibold truncate max-w-sm">
                      {item.name} <span className="text-slate-500 font-normal">({item.clientName})</span>
                    </span>
                    <span className="text-cyan-400 font-bold">
                      {item.updateCount} updates ({item.progress}% progress)
                    </span>
                  </div>

                  {/* Visual Bar */}
                  <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden border border-slate-800/80 p-0.5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500 shadow-glow-cyan"
                      style={{
                        width: `${Math.max(6, percentage)}%`,
                        transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* TABLES: Users & Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* USERS TABLE */}
        <div className="glass-panel rounded-3xl p-6 border border-cyan-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold font-display text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-pink-400" />
                <span>Account Directory ({users.length})</span>
              </h3>
              <button
                onClick={() => setShowUserModal(true)}
                className="text-xs text-pink-400 hover:text-pink-300 font-mono flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> New
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase">
                    <th className="pb-2.5">User</th>
                    <th className="pb-2.5">Role</th>
                    <th className="pb-2.5">Created</th>
                    <th className="pb-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-2.5 pr-2">
                        <div className="font-semibold text-white">{u.name}</div>
                        <div className="font-mono text-[10px] text-slate-400">@{u.userId}</div>
                      </td>
                      <td className="py-2.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            u.role === 'ADMIN'
                              ? 'bg-pink-500/10 text-pink-400 border border-pink-500/30'
                              : u.role === 'TEAM'
                              ? 'bg-violet-500/10 text-violet-400 border border-violet-500/30'
                              : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-2.5 text-[11px] font-mono text-slate-400">
                        {new Date(u.createdAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          disabled={deletingId === u.id}
                          className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* PROJECTS TABLE */}
        <div className="glass-panel rounded-3xl p-6 border border-cyan-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold font-display text-white flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-cyan-400" />
                <span>Projects Registry ({projects.length})</span>
              </h3>
              <button
                onClick={() => setShowProjectModal(true)}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> New
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase">
                    <th className="pb-2.5">Project</th>
                    <th className="pb-2.5">Client</th>
                    <th className="pb-2.5">Stage & Progress</th>
                    <th className="pb-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {projects.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-2.5 pr-2">
                        <div className="font-semibold text-white truncate max-w-[160px]">
                          {p.name}
                        </div>
                        <div className="font-mono text-[10px] text-slate-400">
                          {p._count?.updates || 0} logged updates
                        </div>
                      </td>
                      <td className="py-2.5 font-mono text-[11px] text-slate-300">
                        {p.client?.name || 'Unassigned'}
                      </td>
                      <td className="py-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-cyan-400 font-bold">
                            {p.stage}
                          </span>
                          <span className="font-mono text-[10px] text-slate-500">
                            ({p.progress}%)
                          </span>
                        </div>
                        <div className="w-20 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full bg-cyan-400 rounded-full"
                            style={{ width: `${p.progress}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => handleDeleteProject(p.id, p.name)}
                          className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: CREATE USER */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md glass-panel-glow rounded-3xl p-6 sm:p-7 border border-pink-500/30 relative">
            <button
              onClick={() => setShowUserModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 shadow-glow-pink">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-display text-white">Provision User Account</h3>
                <p className="text-xs text-slate-400">Add client, team member, or system administrator</p>
              </div>
            </div>

            {userError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-red-400 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{userError}</span>
              </div>
            )}

            {userSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-emerald-400 text-xs">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{userSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-slate-300 mb-1">
                  User Handle / Login ID
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. client_apex, dev_sam"
                  value={newUserId}
                  onChange={(e) => setNewUserId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-slate-300 mb-1">
                  Full Name / Organization
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Samantha Wu (Apex Global)"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-slate-300 mb-1">
                  Initial Password (min 6 characters)
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-slate-300 mb-1">
                  Access Role
                </label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white bg-slate-900 border border-slate-700"
                >
                  <option value="CLIENT">CLIENT (Sees only own projects)</option>
                  <option value="TEAM">TEAM MEMBER (Can publish daily updates)</option>
                  <option value="ADMIN">ADMINISTRATOR (Full management access)</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl cyber-button-pink text-xs font-semibold"
                  style={{
                    background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
                    color: '#ffffff'
                  }}
                >
                  Provision User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE PROJECT */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md glass-panel-glow rounded-3xl p-6 sm:p-7 border border-cyan-500/30 relative">
            <button
              onClick={() => setShowProjectModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-glow-cyan">
                <FolderPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-display text-white">Create New Project</h3>
                <p className="text-xs text-slate-400">Initialize deliverable and assign to client</p>
              </div>
            </div>

            {projectError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-red-400 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{projectError}</span>
              </div>
            )}

            {projectSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-emerald-400 text-xs">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{projectSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-slate-300 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next-Gen Mobile Banking Core"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-slate-300 mb-1">
                  Assign to Client
                </label>
                {clientUsers.length === 0 ? (
                  <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-mono">
                    No CLIENT users exist yet. Please create a CLIENT user account first.
                  </div>
                ) : (
                  <select
                    value={newProjectClientId}
                    onChange={(e) => setNewProjectClientId(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white bg-slate-900 border border-slate-700"
                  >
                    {clientUsers.map((c) => (
                      <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                        {c.name} (@{c.userId})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-slate-300 mb-1">
                    Initial Stage
                  </label>
                  <select
                    value={newProjectStage}
                    onChange={(e) => setNewProjectStage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white bg-slate-900 border border-slate-700 font-mono"
                  >
                    <option value="Planning">Planning</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Review">Review</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-mono font-semibold uppercase text-slate-300">
                      Progress
                    </label>
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      {newProjectProgress}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={newProjectProgress}
                    onChange={(e) => setNewProjectProgress(e.target.value)}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 mt-2"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={clientUsers.length === 0}
                  className="flex-1 py-2.5 rounded-xl cyber-button-cyan text-xs font-semibold disabled:opacity-40"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
