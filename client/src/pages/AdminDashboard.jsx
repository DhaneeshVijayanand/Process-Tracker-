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
  const chartItems = stats?.chartData || [];
  const maxUpdates = Math.max(1, ...chartItems.map((c) => c.updateCount));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3E8DE]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#10201D] tracking-tight">
            Administrator Command Console
          </h1>
          <p className="text-sm text-[#5A6E69] mt-1 font-medium">
            Global governance, client provisioning, and system deliverable telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowUserModal(true)}
            className="btn-outline text-xs font-bold"
          >
            <UserPlus className="w-4 h-4 text-[#064E45]" />
            <span>Create User</span>
          </button>

          <button
            onClick={() => setShowProjectModal(true)}
            className="btn-lime text-xs font-bold shadow-lime-btn"
          >
            <FolderPlus className="w-4 h-4 stroke-[3]" />
            <span>Create Project</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="saas-card p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-[#5A6E69]">Total System Users</span>
            <div className="w-10 h-10 rounded-2xl bg-[#EFF2E9] text-[#064E45] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-heading text-[#10201D] mt-3">
            {stats?.metrics?.totalUsers || users.length}
          </div>
          <div className="flex items-center gap-2 mt-2 text-[11px] font-mono text-[#5A6E69]">
            <span>{stats?.roleBreakdown?.client || 0} Clients</span> •
            <span>{stats?.roleBreakdown?.team || 0} Team</span> •
            <span>{stats?.roleBreakdown?.admin || 0} Admins</span>
          </div>
        </div>

        <div className="saas-card p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-[#5A6E69]">Active Projects</span>
            <div className="w-10 h-10 rounded-2xl bg-[#EFF2E9] text-[#064E45] flex items-center justify-center">
              <FolderGit2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-heading text-[#10201D] mt-3">
            {stats?.metrics?.totalProjects || projects.length}
          </div>
          <span className="text-[11px] text-[#5A6E69] font-mono mt-2 block">
            Client-assigned deliverable tracks
          </span>
        </div>

        <div className="saas-card p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-[#5A6E69]">Daily Updates Logged</span>
            <div className="w-10 h-10 rounded-2xl bg-[#EFF2E9] text-[#064E45] flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-heading text-[#10201D] mt-3">
            {stats?.metrics?.totalUpdates || 0}
          </div>
          <span className="text-[11px] text-[#5A6E69] font-mono mt-2 block">
            {stats?.metrics?.totalComments || 0} stakeholder comments
          </span>
        </div>
      </div>

      {/* Bar Chart: Updates per Project */}
      <div className="saas-card p-6 sm:p-7">
        <div className="flex items-center justify-between pb-3 mb-5 border-b border-[#E3E8DE]">
          <div>
            <h3 className="font-heading font-bold text-base text-[#10201D]">
              Project Activity Velocity (Updates Per Project)
            </h3>
            <p className="text-xs text-[#5A6E69]">Comparative telemetry of milestone publications across client accounts</p>
          </div>
          <BarChart3 className="w-5 h-5 text-[#064E45]" />
        </div>

        {chartItems.length === 0 ? (
          <div className="py-12 text-center text-[#8C9E9A] font-mono text-xs">
            No projects registered to plot activity.
          </div>
        ) : (
          <div className="space-y-4 pt-1">
            {chartItems.map((item) => {
              const percentage = Math.round((item.updateCount / maxUpdates) * 100);
              return (
                <div key={item.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#10201D] font-bold truncate max-w-sm">
                      {item.name} <span className="text-[#5A6E69] font-normal">({item.clientName})</span>
                    </span>
                    <span className="text-[#064E45] font-bold">
                      {item.updateCount} updates ({item.progress}% progress)
                    </span>
                  </div>

                  <div className="w-full h-3.5 bg-[#EFF2E9] rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full rounded-full bg-[#064E45]"
                      style={{
                        width: `${Math.max(6, percentage)}%`,
                        transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Tables: Users & Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* USERS TABLE */}
        <div className="saas-card p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E3E8DE]">
            <h3 className="text-base font-bold font-heading text-[#10201D] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#064E45]" />
              <span>Account Directory ({users.length})</span>
            </h3>
            <button
              onClick={() => setShowUserModal(true)}
              className="text-xs text-[#064E45] hover:underline font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> New
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E3E8DE] text-[#5A6E69] font-mono uppercase">
                  <th className="pb-2.5">User</th>
                  <th className="pb-2.5">Role</th>
                  <th className="pb-2.5">Created</th>
                  <th className="pb-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFF2E9]">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#F7F8F2] transition-colors">
                    <td className="py-2.5 pr-2">
                      <div className="font-bold text-[#10201D]">{u.name}</div>
                      <div className="font-mono text-[10px] text-[#5A6E69]">@{u.userId}</div>
                    </td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#EFF2E9] text-[#064E45]">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-2.5 text-[11px] font-mono text-[#5A6E69]">
                      {new Date(u.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={() => handleDeleteUser(u.id, u.name)}
                        disabled={deletingId === u.id}
                        className="p-1 rounded text-[#8C9E9A] hover:text-rose-600 hover:bg-rose-50"
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

        {/* PROJECTS TABLE */}
        <div className="saas-card p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E3E8DE]">
            <h3 className="text-base font-bold font-heading text-[#10201D] flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-[#064E45]" />
              <span>Projects Registry ({projects.length})</span>
            </h3>
            <button
              onClick={() => setShowProjectModal(true)}
              className="text-xs text-[#064E45] hover:underline font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> New
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E3E8DE] text-[#5A6E69] font-mono uppercase">
                  <th className="pb-2.5">Project</th>
                  <th className="pb-2.5">Client</th>
                  <th className="pb-2.5">Progress</th>
                  <th className="pb-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFF2E9]">
                {projects.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F7F8F2] transition-colors">
                    <td className="py-2.5 pr-2">
                      <div className="font-bold text-[#10201D] truncate max-w-[150px]">{p.name}</div>
                      <div className="font-mono text-[10px] text-[#5A6E69]">{p._count?.updates || 0} updates</div>
                    </td>
                    <td className="py-2.5 font-mono text-[11px] text-[#5A6E69]">
                      {p.client?.name || 'Unassigned'}
                    </td>
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-[#064E45] font-bold">{p.stage}</span>
                        <span className="font-mono text-[10px] text-[#5A6E69]">({p.progress}%)</span>
                      </div>
                      <div className="w-20 h-1.5 bg-[#EFF2E9] rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-[#064E45] rounded-full" style={{ width: `${p.progress}%` }} />
                      </div>
                    </td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={() => handleDeleteProject(p.id, p.name)}
                        className="p-1 rounded text-[#8C9E9A] hover:text-rose-600 hover:bg-rose-50"
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

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 border border-[#E3E8DE] shadow-saas-float relative">
            <button onClick={() => setShowUserModal(false)} className="absolute top-5 right-5 p-1 text-[#5A6E69] hover:text-[#10201D]">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold font-heading text-[#10201D] mb-4">Provision User Account</h3>
            {userError && <div className="mb-3 p-2.5 rounded-xl bg-rose-50 text-rose-800 text-xs">{userError}</div>}
            {userSuccess && <div className="mb-3 p-2.5 rounded-xl bg-emerald-50 text-[#064E45] text-xs">{userSuccess}</div>}
            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#10201D] mb-1">User ID</label>
                <input type="text" required value={newUserId} onChange={(e) => setNewUserId(e.target.value)} className="w-full px-3 py-2 rounded-xl saas-input" />
              </div>
              <div>
                <label className="block font-bold text-[#10201D] mb-1">Full Name</label>
                <input type="text" required value={newUserName} onChange={(e) => setNewUserName(e.target.value)} className="w-full px-3 py-2 rounded-xl saas-input" />
              </div>
              <div>
                <label className="block font-bold text-[#10201D] mb-1">Password</label>
                <input type="password" required value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)} className="w-full px-3 py-2 rounded-xl saas-input" />
              </div>
              <div>
                <label className="block font-bold text-[#10201D] mb-1">Role</label>
                <select value={newUserRole} onChange={(e) => setNewUserRole(e.target.value)} className="w-full px-3 py-2 rounded-xl saas-input">
                  <option value="CLIENT">CLIENT</option>
                  <option value="TEAM">TEAM</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowUserModal(false)} className="flex-1 py-2 rounded-xl border border-[#D8E0D7] text-[#5A6E69]">Cancel</button>
                <button type="submit" className="flex-1 btn-lime text-xs font-bold">Create User</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 border border-[#E3E8DE] shadow-saas-float relative">
            <button onClick={() => setShowProjectModal(false)} className="absolute top-5 right-5 p-1 text-[#5A6E69] hover:text-[#10201D]">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold font-heading text-[#10201D] mb-4">Create New Project</h3>
            {projectError && <div className="mb-3 p-2.5 rounded-xl bg-rose-50 text-rose-800 text-xs">{projectError}</div>}
            {projectSuccess && <div className="mb-3 p-2.5 rounded-xl bg-emerald-50 text-[#064E45] text-xs">{projectSuccess}</div>}
            <form onSubmit={handleCreateProject} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#10201D] mb-1">Project Name</label>
                <input type="text" required value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} className="w-full px-3 py-2 rounded-xl saas-input" />
              </div>
              <div>
                <label className="block font-bold text-[#10201D] mb-1">Assign Client</label>
                <select value={newProjectClientId} onChange={(e) => setNewProjectClientId(e.target.value)} required className="w-full px-3 py-2 rounded-xl saas-input">
                  {clientUsers.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} (@{c.userId})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#10201D] mb-1">Initial Stage</label>
                  <select value={newProjectStage} onChange={(e) => setNewProjectStage(e.target.value)} className="w-full px-3 py-2 rounded-xl saas-input">
                    <option value="Planning">Planning</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Review">Review</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#10201D] mb-1">Progress %</label>
                  <input type="number" min="0" max="100" value={newProjectProgress} onChange={(e) => setNewProjectProgress(e.target.value)} className="w-full px-3 py-2 rounded-xl saas-input" />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowProjectModal(false)} className="flex-1 py-2 rounded-xl border border-[#D8E0D7] text-[#5A6E69]">Cancel</button>
                <button type="submit" className="flex-1 btn-lime text-xs font-bold">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
