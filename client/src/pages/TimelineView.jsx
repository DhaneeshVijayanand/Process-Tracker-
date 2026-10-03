import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Plus,
  Send,
  Upload,
  X,
  Sparkles,
  Calendar,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sliders,
  Filter
} from 'lucide-react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useBA } from '../context/BAContext';
import { FeedPost } from '../components/FeedPost';

export const TimelineView = () => {
  const { user } = useAuth();
  const { activeProject } = useBA();

  const [backendProjects, setBackendProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(false);

  // Composer Form
  const [stage, setStage] = useState('In Progress');
  const [progress, setProgress] = useState(72);
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch projects from backend
  const fetchBackendProjects = async () => {
    try {
      const res = await api.get('/projects');
      const projs = res.projects || [];
      setBackendProjects(projs);
      if (projs.length > 0 && !selectedProjectId) {
        setSelectedProjectId(projs[0].id);
      }
    } catch (e) {
      console.warn('Backend projects fetch:', e);
    }
  };

  useEffect(() => {
    fetchBackendProjects();
  }, []);

  const fetchUpdates = async (pId) => {
    if (!pId) return;
    try {
      setLoading(true);
      const res = await api.get(`/projects/${pId}/updates`);
      setUpdates(res.updates || []);
    } catch (e) {
      console.warn('Backend updates fetch:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProjectId) {
      fetchUpdates(selectedProjectId);
    }
  }, [selectedProjectId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Only image files are permitted.');
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
    if (!selectedProjectId || !text.trim()) return;

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

      setMessage('Daily update published! Client notification dispatched.');
      setText('');
      removeSelectedImage();
      fetchUpdates(selectedProjectId);

      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to broadcast update');
    } finally {
      setPublishing(false);
    }
  };

  const canPost = user?.role === 'TEAM' || user?.role === 'ADMIN';

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3E8DE]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#DFFF72] text-[#064E45]">
              Live Stakeholder Stream
            </span>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#10201D] tracking-tight">
              Daily Progress Timeline
            </h1>
          </div>
          <p className="text-sm text-[#5A6E69] mt-1 font-medium">
            Chronological engineering updates, prototype screenshots, stakeholder reactions, and feedback threads.
          </p>
        </div>

        {backendProjects.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#5A6E69]">Feed:</span>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-white border border-[#E3E8DE] text-xs font-bold text-[#10201D]"
            >
              {backendProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* COMPOSER (Only for Team & Admin) - 5 Cols */}
        {canPost && (
          <div className="lg:col-span-5 sticky top-24">
            <div className="saas-card p-6 border-[#064E45]/20 shadow-saas-card">
              <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#E3E8DE]">
                <div className="w-8 h-8 rounded-xl bg-[#EFF2E9] text-[#064E45] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm text-[#10201D]">
                    Broadcast Daily Progress
                  </h3>
                  <p className="text-[11px] text-[#5A6E69]">Dispatches automatic notification to client</p>
                </div>
              </div>

              {error && (
                <div className="mb-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {message && (
                <div className="mb-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[#064E45] text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-[#087F6A]" />
                  <span>{message}</span>
                </div>
              )}

              <form onSubmit={handlePublish} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#10201D] mb-1">Stage</label>
                    <select
                      value={stage}
                      onChange={(e) => setStage(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl saas-input text-xs"
                    >
                      <option value="Planning">Planning</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Review">Review</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-[#10201D]">Progress</label>
                      <span className="font-mono font-bold text-[#064E45]">{progress}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={progress}
                      onChange={(e) => setProgress(Number(e.target.value))}
                      className="w-full h-2 bg-[#EFF2E9] rounded-lg appearance-none cursor-pointer accent-[#064E45] mt-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#10201D] mb-1">Update Summary</label>
                  <textarea
                    rows="3"
                    required
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Describe completed milestones, prototype updates, or testing sign-offs..."
                    className="w-full px-3.5 py-2.5 rounded-xl saas-input text-xs leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#10201D] mb-1">Attachment (Optional)</label>
                  {imagePreview ? (
                    <div className="relative rounded-2xl overflow-hidden border border-[#E3E8DE] bg-[#F7F8F2] p-1.5">
                      <img src={imagePreview} alt="Preview" className="w-full max-h-36 object-cover rounded-xl" />
                      <button
                        type="button"
                        onClick={removeSelectedImage}
                        className="absolute top-3 right-3 p-1 rounded-full bg-black/70 text-white hover:text-rose-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-[#D8E0D7] hover:border-[#064E45] rounded-2xl cursor-pointer bg-[#F7F8F2]/60 hover:bg-white transition-all">
                      <Upload className="w-5 h-5 text-[#5A6E69] mb-1" />
                      <span className="text-[11px] font-semibold text-[#10201D]">Upload diagram or prototype screenshot</span>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={publishing}
                  className="w-full btn-lime text-xs font-bold py-2.5 mt-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{publishing ? 'Broadcasting...' : 'Publish Daily Log'}</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* FEED STREAM - 7 or 12 Cols */}
        <div className={canPost ? 'lg:col-span-7' : 'lg:col-span-12'}>
          <div className="space-y-4">
            {loading ? (
              <div className="py-16 text-center text-xs font-mono text-[#5A6E69]">
                Synchronizing stream updates...
              </div>
            ) : updates.length === 0 ? (
              <div className="saas-card p-10 text-center">
                <MessageSquare className="w-8 h-8 text-[#8C9E9A] mx-auto mb-2" />
                <h3 className="font-heading font-bold text-sm text-[#10201D]">No updates published yet</h3>
                <p className="text-xs text-[#5A6E69] mt-1">
                  Team members can broadcast the first sprint update using the composer.
                </p>
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
  );
};
