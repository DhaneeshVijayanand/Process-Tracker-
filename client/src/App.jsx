import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { ClientDashboard } from './pages/ClientDashboard';
import { TeamDashboard } from './pages/TeamDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { Navbar } from './components/Navbar';
import { Activity, Shield, Zap, Users, Eye } from 'lucide-react';

export const App = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const [activeRoleView, setActiveRoleView] = useState(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060913] flex flex-col items-center justify-center gap-4 text-cyan-400 font-mono text-xs">
        <div className="w-12 h-12 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin shadow-glow-cyan" />
        <span className="tracking-widest">INITIALIZING PROCESS TRACKER COCKPIT...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Current view based on role or admin override
  const currentRole = activeRoleView || user.role;

  return (
    <div className="min-h-screen bg-[#060913] relative overflow-x-hidden text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* Background Animated Neon Orbs */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse-glow" />
      <div className="fixed bottom-10 right-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="fixed top-1/2 right-10 w-[350px] h-[350px] bg-pink-600/10 rounded-full blur-[110px] pointer-events-none -z-10" />

      {/* Cyber Grid Lines */}
      <div
        className="fixed inset-0 pointer-events-none opacity-15 -z-10"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0, 245, 255, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 245, 255, 0.08) 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Top Navbar */}
      <Navbar />

      {/* Admin Multi-Perspective Switcher Bar (only visible to ADMIN) */}
      {user.role === 'ADMIN' && (
        <div className="bg-slate-900/60 border-b border-pink-500/20 backdrop-blur-md px-4 py-2">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-pink-300">
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin Perspective Switcher:</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveRoleView('ADMIN')}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                  currentRole === 'ADMIN'
                    ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40 shadow-glow-pink'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Admin Root
              </button>
              <button
                onClick={() => setActiveRoleView('TEAM')}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                  currentRole === 'TEAM'
                    ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40 shadow-glow-violet'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Team Composer
              </button>
              <button
                onClick={() => setActiveRoleView('CLIENT')}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                  currentRole === 'CLIENT'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Client Feed View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main View Router */}
      <main className="flex-1 pb-16">
        {currentRole === 'ADMIN' && <AdminDashboard />}
        {currentRole === 'TEAM' && <TeamDashboard />}
        {currentRole === 'CLIENT' && <ClientDashboard />}
      </main>

      {/* Footer */}
      <footer className="glass-panel border-t border-cyan-500/10 py-6 px-4 text-center text-xs font-mono text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Process Tracker v2.4 HUD // Connected</span>
          </div>
          <span>Enterprise BA & Client Delivery Cockpit • AES-256 Encrypted</span>
        </div>
      </footer>
    </div>
  );
};
export default App;
