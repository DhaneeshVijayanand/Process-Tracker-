import React, { useState } from 'react';
import { KeyRound, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ChangePasswordModal = ({ isOpen, onClose }) => {
  const { changePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const res = await changePassword(currentPassword, newPassword);
      setSuccess(res.message || 'Password updated successfully!');
      setTimeout(() => {
        onClose();
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setSuccess('');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 relative border border-[#E3E8DE] shadow-saas-float">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#5A6E69] hover:text-[#10201D] transition-colors p-1 rounded-xl hover:bg-[#F7F8F2]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-[#EFF2E9] text-[#064E45] flex items-center justify-center">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#10201D] font-heading tracking-tight">Change Security Key</h3>
            <p className="text-xs text-[#5A6E69]">Update your account access password</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-rose-800 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-800 text-xs">
            <CheckCircle className="w-4 h-4 flex-shrink-0 text-[#087F6A]" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#10201D] mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl saas-input text-xs"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block font-bold text-[#10201D] mb-1.5">
              New Password (min 6 chars)
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl saas-input text-xs"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block font-bold text-[#10201D] mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl saas-input text-xs"
              placeholder="••••••••"
            />
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-[#D8E0D7] hover:bg-[#F7F8F2] text-[#5A6E69] text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl btn-lime text-xs font-bold disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
