import React, { useState, useEffect } from 'react';
import {
  Send,
  Upload,
  Image as ImageIcon,
  X,
  Sparkles,
  Layers,
  FolderGit2,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sliders
} from 'lucide-react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { FeedPost } from '../components/FeedPost';
import { StageStepper } from '../components/StageStepper';

export const TeamDashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [currentProject, setCurrentProject] = useState(null);
  const [updates, setUpdates] = useState([]);

  // Form states
  const [stage, setStage] = useState('In Progress');
  const [progress, setProgress] = useState(50);
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch all projects for team selection
  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      const allProjects = res.projects || [];
      setProjects(allProjects);

      if (allProjects.length > 0 && !selectedProjectId) {
        setSelectedProjectId(allProjects[0].id);
        setCurrentProject(allProjects[0]);
        setStage(allProjects[0].stage);
        setProgress(allProjects[0].progress);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch updates for selected project
  const fetchUpdates = async (pId) => {
    if (!pId) return;
    try {
      const res = await api.get(`/projects/${pId}/updates`);
      setUpdates(res.updates || []);
      setCurrentProject(res.project);
    } catch (err) {
      console.error('Error fetching updates:', err);
    }
  };

  useEffect(() => {
    if (selectedProjectId) {
      fetchUpdates(selectedProjectId);
      const proj = projects.find((p) => p.id === selectedProjectId);
      if (proj) {
        setCurrentProject(proj);
        setStage(proj.stage);
        setProgress(proj.progress);
      }
    }
  }, [selectedProjectId, projects]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Only image files (JPEG, PNG, WEBP, GIF, SVG) are allowed.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file must not exceed 5MB.');
        return;
      }
      setError('');
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeSelectedImage = () => {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!selectedProjectId) {
      setError('Please select a target project.');
      return;
    }
    if (!text.trim()) {
      setError('Please provide an update summary description.');
      return;
    }

    try {
      setPublishing(true);
      setError('');
      setMessage('');

      const formData = new FormData();
      formData.append('text', text.trim());
      formData.append('stage', stage);
      formData.append('progress', progress);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await api.post(`/projects/${selectedProjectId}/updates`, formData);

      setMessage('Daily update published successfully! Client notification triggered.');
      setText('');
      removeSelectedImage();
      fetchUpdates(selectedProjectId);
      fetchProjects();

      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to publish update');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-wide flex items-center gap-2">
            <span>TEAM ARCHITECT CONSOLE</span>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/30">
              DISPATCH COCKPIT
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
            Publish daily milestone progress, blueprints, and deliverable status to clients
          </p>
        </div>
      </div>

      {/* Main Grid: Composer on Left, Live Project Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* COMPOSER CARD (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel-glow rounded-3xl p-6 sm:p-7 border border-violet-500/30">
            <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 shadow-glow-violet">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold font-display text-white">
                  Compose Daily Progress Log
                </h2>
                <p className="text-xs text-slate-400">Broadcasts instant notification to project stakeholders</p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-red-400 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {message && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-emerald-400 text-xs">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{message}</span>
              </div>
            )}

            <form onSubmit={handlePublish} className="space-y-4">
              {/* Project Select */}
              <div>
                <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Target Project
                </label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white bg-slate-900 border border-slate-700"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                      {p.name} {p.client ? `(${p.client.name})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stage Select & Progress Slider in 2 Columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Delivery Phase / Stage
                  </label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white bg-slate-900 border border-slate-700 font-mono"
                  >
                    <option value="Planning">Planning</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Review">Review</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
                      Overall Progress
                    </label>
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      {progress}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={(e) => setProgress(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>
              </div>

              {/* Text Description Box */}
              <div>
                <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Update Narrative / Key Deliverables
                </label>
                <textarea
                  rows="4"
                  required
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Detail the sprint achievements, architecture decisions, and deliverables finished today..."
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white placeholder-slate-500 leading-relaxed font-sans"
                />
              </div>

              {/* Photo Upload Zone */}
              <div>
                <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Attachment / Diagram / Prototype Screenshot (Optional)
                </label>

                {imagePreview ? (
                  <div className="relative rounded-2xl overflow-hidden border border-cyan-500/40 bg-slate-950 p-2">
                    <img
                      src={imagePreview}
                      alt="Upload preview"
                      className="w-full max-h-48 object-cover rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={removeSelectedImage}
                      className="absolute top-4 right-4 p-1.5 rounded-full bg-black/80 text-white hover:text-red-400 border border-white/20 transition-colors"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-2xl cursor-pointer bg-slate-900/30 hover:bg-slate-900/60 transition-all group">
                    <Upload className="w-6 h-6 text-slate-400 group-hover:text-cyan-400 transition-colors mb-2" />
                    <span className="text-xs text-slate-300 font-mono group-hover:text-cyan-300 transition-colors">
                      Click to upload screenshot or wireframe
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                      PNG, JPG, WEBP, GIF, SVG (Up to 5MB)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={publishing}
                className="w-full py-3 rounded-xl cyber-button-violet text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {publishing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    BROADCASTING UPDATE...
                  </span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>PUBLISH DAILY UPDATE</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* PROJECT PREVIEW & FEED (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {currentProject && (
            <div className="glass-panel rounded-3xl p-6 border border-cyan-500/20">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase text-slate-400">
                  Target Project Status
                </span>
                <span className="text-xs font-mono font-bold text-cyan-400">
                  {currentProject.progress}% Done
                </span>
              </div>

              <h3 className="text-lg font-bold font-display text-white">
                {currentProject.name}
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Client: {currentProject.client?.name || 'Unassigned'}
              </p>

              <div className="mt-4 pt-4 border-t border-slate-800">
                <StageStepper currentStage={currentProject.stage} />
              </div>
            </div>
          )}

          {/* Project Updates Feed */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider">
                Current Stream ({updates.length})
              </h3>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {updates.length === 0 ? (
                <div className="glass-panel rounded-2xl p-6 text-center text-xs font-mono text-slate-500">
                  No updates posted for this project yet. Use the composer on the left to publish the first log!
                </div>
              ) : (
                updates.map((update) => (
                  <FeedPost
                    key={update.id}
                    update={update}
                    onUpdateChanged={() => fetchUpdates(selectedProjectId)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
