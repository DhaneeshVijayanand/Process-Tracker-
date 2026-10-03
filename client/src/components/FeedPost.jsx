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
  Zap,
  Check
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
        return 'text-[#064E45] bg-[#EFF2E9] border-[#D1E2DD]';
      case 'In Progress':
        return 'text-[#064E45] bg-[#DFFF72] border-[#087F6A]/20';
      case 'Review':
        return 'text-amber-800 bg-amber-100 border-amber-200';
      case 'Completed':
        return 'text-emerald-900 bg-emerald-100 border-emerald-200';
      default:
        return 'text-slate-700 bg-slate-100 border-slate-200';
    }
  };

  return (
    <>
      <article className="saas-card overflow-hidden mb-6">
        {/* Post Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-[#EFF2E9] bg-[#F7F8F2]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#064E45] text-[#DFFF72] flex items-center justify-center font-bold font-heading text-sm shadow-sm">
              {update.author?.name ? update.author.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#10201D] font-heading">
                  {update.author?.name}
                </span>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-white text-[#064E45] border border-[#E3E8DE]">
                  {update.author?.role}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#5A6E69] font-mono mt-0.5">
                <Clock className="w-3 h-3 text-[#8C9E9A]" />
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
              className={`px-2.5 py-0.5 text-xs font-bold rounded-full border font-mono tracking-wide ${getStageColor(
                update.stage
              )}`}
            >
              {update.stage}
            </span>
            <span className="text-[11px] font-mono text-[#064E45] font-bold">
              {update.progress}% Completed
            </span>
          </div>
        </div>

        {/* Post Narrative */}
        <div className="p-5 text-sm sm:text-base text-[#10201D] leading-relaxed font-sans">
          {update.text}
        </div>

        {/* Uploaded Attachment Photo */}
        {update.imageUrl && (
          <div
            className="relative group bg-[#F7F8F2] border-y border-[#EFF2E9] overflow-hidden cursor-pointer"
            onClick={() => setPreviewImage(update.imageUrl)}
          >
            <img
              src={update.imageUrl}
              alt="Daily update attachment"
              className="w-full max-h-[460px] object-cover object-center group-hover:scale-[1.01] transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
              <span className="text-xs font-mono text-white bg-black/60 px-2 py-1 rounded">
                Click to expand view
              </span>
              <div className="p-2 rounded-lg bg-black/70 text-white">
                <Maximize2 className="w-4 h-4" />
              </div>
            </div>
          </div>
        )}

        {/* Reaction Bar & Stats */}
        <div className="px-5 py-3 border-t border-[#EFF2E9] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            {['🔥', '👍', '❤️'].map((emoji) => {
              const count = reactions[emoji] || 0;
              const hasReacted = userReactions.includes(emoji);
              const isAnimating = animatingEmoji === emoji;

              return (
                <button
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  className={`px-3 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all duration-200 ${
                    hasReacted
                      ? 'bg-[#DFFF72] text-[#064E45] border border-[#087F6A]/30 scale-105 shadow-sm'
                      : 'bg-[#F7F8F2] border border-[#E3E8DE] text-[#5A6E69] hover:bg-[#EFF2E9]'
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
            className="flex items-center gap-1.5 text-xs font-mono text-[#5A6E69] hover:text-[#064E45] transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-[#064E45]" />
            <span>{comments.length} comments</span>
          </button>
        </div>

        {/* Comments Thread */}
        {showComments && (
          <div className="px-5 py-4 border-t border-[#EFF2E9] bg-[#F7F8F2]/40 space-y-3">
            {comments.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-3 rounded-2xl bg-white border border-[#E3E8DE] text-xs flex items-start gap-2.5"
                  >
                    <div className="w-6 h-6 rounded-lg bg-[#064E45] text-[#DFFF72] flex items-center justify-center font-bold flex-shrink-0 text-[10px]">
                      {comment.user?.name ? comment.user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-[#10201D]">
                            {comment.user?.name}
                          </span>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#EFF2E9] text-[#064E45]">
                            {comment.user?.role}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#8C9E9A] font-mono">
                          {new Date(comment.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="text-[#5A6E69] leading-relaxed break-words font-sans">
                        {comment.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-2 text-xs text-[#8C9E9A] font-mono">
                No comments yet. Provide client feedback.
              </div>
            )}

            {/* Comment Input */}
            <form onSubmit={handlePostComment} className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Leave feedback or ask a technical question..."
                className="flex-1 px-3.5 py-2 rounded-xl saas-input text-xs text-[#10201D] placeholder-[#8C9E9A]"
              />
              <button
                type="submit"
                disabled={!commentText.trim() || submittingComment}
                className="btn-lime text-xs font-bold px-4 py-2 disabled:opacity-40"
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
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl border border-[#DFFF72]/40 shadow-2xl">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/80 text-white hover:text-[#DFFF72]"
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
