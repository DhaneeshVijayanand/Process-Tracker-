import React, { useState } from 'react';
import { Sparkles, Lock, User, ArrowRight, AlertCircle, Shield, Zap, Check, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const { login } = useAuth();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId.trim() || !password) return;

    setError('');
    setLoading(true);

    try {
      await login(userId.trim(), password);
    } catch (err) {
      setError(err.message || 'Authentication failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (uId, pwd) => {
    setUserId(uId);
    setPassword(pwd);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-[#F7F8F2] overflow-hidden">
      {/* Decorative Emerald Circles in background */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#064E45]/5 rounded-full pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#DFFF72]/20 rounded-full pointer-events-none" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-[#064E45] text-[#DFFF72] shadow-emerald-btn mb-4">
            <Sparkles className="w-7 h-7 fill-current" />
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#10201D] tracking-tight">
            BA Process Tracker
          </h1>
          <p className="text-xs sm:text-sm text-[#5A6E69] font-medium mt-1">
            Enterprise Business Analyst & Client Delivery Platform
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3E8DE] shadow-saas-card">
          {error && (
            <div className="mb-5 p-3 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-rose-800 text-xs animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#10201D] mb-1.5 uppercase font-mono tracking-wider">
                User ID / Handle
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C9E9A]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="e.g. admin, team, client"
                  className="w-full pl-10 pr-4 py-3 rounded-xl saas-input text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#10201D] mb-1.5 uppercase font-mono tracking-wider">
                Security Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C9E9A]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl saas-input text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl btn-lime text-xs font-bold flex items-center justify-center gap-2 tracking-wide disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#064E45] border-t-transparent rounded-full animate-spin" />
                  AUTHENTICATING...
                </span>
              ) : (
                <>
                  <span>Sign In to Cockpit</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-6 pt-5 border-t border-[#EFF2E9]">
            <span className="block text-[11px] font-mono uppercase tracking-wider text-[#5A6E69] mb-2.5 text-center font-bold">
              ⚡ 1-Click Demo Credentials:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin', 'admin123')}
                className="px-2 py-2 rounded-xl bg-[#EFF2E9] hover:bg-[#DFFF72] text-[#064E45] text-[11px] font-mono font-bold flex flex-col items-center justify-center gap-1 transition-all"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('team', 'team123')}
                className="px-2 py-2 rounded-xl bg-[#EFF2E9] hover:bg-[#DFFF72] text-[#064E45] text-[11px] font-mono font-bold flex flex-col items-center justify-center gap-1 transition-all"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Team</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('client', 'client123')}
                className="px-2 py-2 rounded-xl bg-[#EFF2E9] hover:bg-[#DFFF72] text-[#064E45] text-[11px] font-mono font-bold flex flex-col items-center justify-center gap-1 transition-all"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Client</span>
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] text-[#5A6E69] font-mono mt-5">
          Encrypted AES-256 Auth • Role-isolated database sessions
        </p>
      </div>
    </div>
  );
};
