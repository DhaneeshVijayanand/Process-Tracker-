import React, { useState } from 'react';
import { Activity, Lock, User, ArrowRight, AlertCircle, Shield, Zap, Check } from 'lucide-react';
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
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-[#060913]">
      {/* Ambient Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Cyber Background Grid Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0, 245, 255, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 245, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-400 via-violet-500 to-pink-500 p-[1.5px] shadow-glow-cyan mb-4">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Activity className="w-7 h-7 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-wide">
            PROCESS <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">// TRACKER</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
            Real-Time Enterprise Delivery & Milestone Cockpit
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 border border-cyan-500/30 backdrop-blur-2xl">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2.5 text-red-400 text-xs sm:text-sm animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                User ID / Handle
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="e.g. admin, team, client"
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-white text-sm placeholder-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Security Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-white text-sm placeholder-slate-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl cyber-button-cyan text-sm flex items-center justify-center gap-2 tracking-wide disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  AUTHENTICATING...
                </span>
              ) : (
                <>
                  <span>INITIALIZE SESSION</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <span className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2.5 text-center">
              ⚡ Demo Access Credentials:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin', 'admin123')}
                className="px-2 py-2 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-pink-300 text-[11px] font-mono font-medium flex flex-col items-center justify-center gap-1 transition-all"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('team', 'team123')}
                className="px-2 py-2 rounded-xl bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/30 text-violet-300 text-[11px] font-mono font-medium flex flex-col items-center justify-center gap-1 transition-all"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Team</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('client', 'client123')}
                className="px-2 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono font-medium flex flex-col items-center justify-center gap-1 transition-all"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Client</span>
              </button>
            </div>
          </div>
        </div>

        {/* Security / System Notice */}
        <p className="text-center text-[11px] text-slate-500 font-mono mt-5">
          Encrypted AES-256 Auth • Role-isolated database sessions
        </p>
      </div>
    </div>
  );
};
