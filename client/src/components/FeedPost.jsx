import React, { useState } from 'react';
import {
  MessageCircle,
  Send,
  Sparkles,
  Maximize2,
  X,
  User,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export const FeedPost = ({ update, onUpdateChanged }) => {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [reactions, setReactions] = useState(update.reactionCounts || { '🔥': 0, '👍': 0, '❤️': 0 });
  const [userReactions, setUserReactions] = useState(update.userReactions || []);
  const [comments, setComments] = useState(update.comments || []);
  const [animatingEmoji, setAnimatingEmoji] = useState(null);

  const handleReaction = async (emoji) => {
    try {
      setAnimatingEmoji(emoji);
      setTimeout(() => setAnimatingEmoji(null), 600);

      const res = await api.post(`/updates/${update.id}/react`, { emoji });
      setReactions(res.reactionCounts);
      setUserReactions(res.userReactions);
    } catch (err) {
      console.error('Reaction failed:', err);
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || submittingComment) return;

    try {
      setSubmittingComment(true);
      const res = await api.post(`/updates/${update.id}/comments`, { text: commentText.trim() });
      setComments((prev) => [...prev, res.comment]);
      setCommentText('');
      if (onUpdateChanged) onUpdateChanged();
    } catch (err) {
      console.error('Comment posting failed:', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const getStageColor = (stage) => {
    switch (stage) {
      case 'Planning':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      case 'In Progress':
        return 'text-violet-400 bg-violet-500/10 border-violet-500/30';
      case 'Review':
        return 'text-pink-400 bg-pink-500/10 border-pink-500/30';
      case 'Completed':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      default:
        return 'text-slate-300 bg-slate-800 border-slate-700';
    }
  };

  const getRoleIcon = (role) => {
    if (role === 'ADMIN') return <ShieldCheck className="w-3.5 h-3.5 text-pink-400" />;
    if (role === 'TEAM') return <Zap className="w-3.5 h-3.5 text-violet-400" />;
    return <User className="w-3.5 h-3.5 text-cyan-400" />;
  };

  return (
    <>
      <article className="glass-panel rounded-2xl border border-cyan-500/20 overflow-hidden hover:border-cyan-500/40 transition-all duration-300 shadow-neon-card mb-6">
        {/* Post Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-800/80 bg-slate-900/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600/30 to-violet-600/30 border border-cyan-500/30 flex items-center justify-center text-cyan-300 font-bold font-display shadow-sm">
              {update.author?.name ? update.author.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white font-display tracking-wide">
                  {update.author?.name}
                </span>
                <span className="flex items-center gap-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-slate-800/90 text-slate-300 border border-slate-700">
                  {getRoleIcon(update.author?.role)}
                  {update.author?.role}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-0.5">
                <Clock className="w-3 h-3 text-slate-500" />
                <span>
                  {new Date(update.createdAt).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric'
                  })} at {new Date(update.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Stage & Progress Pill */}
          <div className="flex flex-col items-end gap-1">
            <span
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg border font-mono tracking-wide ${getStageColor(
                update.stage
              )}`}
            >
              {update.stage}
            </span>
            <span className="text-[11px] font-mono text-cyan-400 font-medium">
              {update.progress}% Completed
            </span>
          </div>
        </div>

        {/* Post Text Description */}
        <div className="p-4 sm:p-5 text-sm sm:text-base text-slate-200 leading-relaxed font-sans">
          {update.text}
        </div>

        {/* Optional Uploaded Photo */}
        {update.imageUrl && (
          <div className="relative group bg-slate-950/60 border-y border-slate-800/80 overflow-hidden cursor-pointer"
               onClick={() => setPreviewImage(update.imageUrl)}>
            <img
              src={update.imageUrl}
              alt="Daily update attachment"
              className="w-full max-h-[460px] object-cover object-center group-hover:scale-[1.01] transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
              <span className="text-xs font-mono text-cyan-300 bg-black/60 px-2 py-1 rounded">
                Click to expand view
              </span>
              <div className="p-2 rounded-lg bg-black/70 text-white">
                <Maximize2 className="w-4 h-4" />
              </div>
            </div>
          </div>
        )}

        {/* Reaction Bar & Stats */}
        <div className="px-4 sm:px-5 py-3 border-t border-slate-800/80 flex items-center justify-between bg-slate-900/20">
          <div className="flex items-center gap-2">
            {['🔥', '👍', '❤️'].map((emoji) => {
              const count = reactions[emoji] || 0;
              const hasReacted = userReactions.includes(emoji);
              const isAnimating = animatingEmoji === emoji;

              return (
                <button
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold flex items-center gap-1.5 transition-all duration-200 ${
                    hasReacted
                      ? 'bg-cyan-500/20 border border-cyan-400/60 text-cyan-300 shadow-glow-cyan/20 scale-105'
                      : 'bg-slate-800/60 border border-slate-700/60 text-slate-300 hover:border-slate-500 hover:bg-slate-700/50'
                  } ${isAnimating ? 'animate-bounce' : ''}`}
                >
                  <span className="text-sm">{emoji}</span>
                  <span>{count}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{comments.length} comments</span>
          </button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="px-4 sm:px-5 py-4 border-t border-slate-800/80 bg-slate-950/40 space-y-3">
            {/* List of comments */}
            {comments.length > 0 ? (
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs flex items-start gap-2.5 hover:border-slate-700 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-lg bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold flex-shrink-0 text-[10px]">
                      {comment.user?.name ? comment.user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-200">
                            {comment.user?.name}
                          </span>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                            {comment.user?.role}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(comment.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="text-slate-300 leading-relaxed break-words font-sans">
                        {comment.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-2 text-xs text-slate-500 font-mono">
                No comments yet. Start the conversation.
              </div>
            )}

            {/* Comment Input */}
            <form onSubmit={handlePostComment} className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Leave feedback or ask a question..."
                className="flex-1 px-3.5 py-2 rounded-xl glass-input text-xs text-white placeholder-slate-500"
              />
              <button
                type="submit"
                disabled={!commentText.trim() || submittingComment}
                className="px-3.5 py-2 rounded-xl cyber-button-cyan text-xs font-semibold flex items-center gap-1 disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Post</span>
              </button>
            </form>
          </div>
        )}
      </article>

      {/* Lightbox Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-cyan-500/40 shadow-2xl">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/80 text-white hover:text-cyan-400 border border-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewImage}
              alt="Expanded preview"
              className="max-w-full max-h-[85vh] object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
};
