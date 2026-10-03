import React, { useState, useRef, useEffect } from 'react';
import {
  Activity,
  Bell,
  Check,
  CheckCheck,
  ChevronDown,
  KeyRound,
  LogOut,
  Shield,
  Trash2,
  User,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { ChangePasswordModal } from './ChangePasswordModal';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, clearAll } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const notifRef = useRef(null);

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN':
        return (
          <span className="px-2.5 py-0.5 text-[11px] font-mono font-bold tracking-wider rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/30 flex items-center gap-1 shadow-glow-pink">
            <Shield className="w-3 h-3" /> ADMIN // LEAD
          </span>
        );
      case 'TEAM':
        return (
          <span className="px-2.5 py-0.5 text-[11px] font-mono font-bold tracking-wider rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/30 flex items-center gap-1 shadow-glow-violet">
            <Zap className="w-3 h-3" /> TEAM // ARCHITECT
          </span>
        );
      case 'CLIENT':
      default:
        return (
          <span className="px-2.5 py-0.5 text-[11px] font-mono font-bold tracking-wider rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1 shadow-glow-cyan">
            <Activity className="w-3 h-3" /> CLIENT // STAKEHOLDER
          </span>
        );
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-cyan-500/20 px-4 lg:px-8 py-3.5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo / Branding */}
          <div className="flex items-center gap-3">
            <div className="relative group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center text-black font-extrabold shadow-glow-cyan">
                <Activity className="w-6 h-6 text-slate-950 animate-pulse" />
              </div>
              <div className="absolute -inset-0.5 rounded-xl bg-cyan-500/30 blur-sm opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-lg lg:text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-300 to-pink-400">
                  PROCESS // TRACKER
                </span>
                <span className="hidden sm:inline-block text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950/70 text-cyan-400 border border-cyan-500/30">
                  v2.4 HUD
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono tracking-tight hidden sm:block">
                Enterprise Business Analyst & Operations Cockpit
              </p>
            </div>
          </div>

          {/* Right Section: Role, Notifications, User Menu */}
          <div className="flex items-center gap-3 lg:gap-4">
            {/* Role Badge */}
            {user && getRoleBadge(user.role)}

            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl glass-input hover:border-cyan-500/50 text-slate-300 hover:text-cyan-400 transition-all"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-pink-500 text-white font-mono text-[10px] font-bold flex items-center justify-center animate-bounce shadow-glow-pink">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Panel */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl glass-panel-glow border border-cyan-500/30 p-4 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-700/60 mb-3">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm font-bold text-white font-display">System Alerts</span>
                      {unreadCount > 0 && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                          {unreadCount} unread
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {unreadCount > 0 && (
                        <button
                          onClick={() => markAsRead()}
                          className="text-xs text-cyan-400 hover:text-cyan-300 p-1 rounded hover:bg-cyan-500/10 flex items-center gap-1 transition-colors"
                          title="Mark all read"
                        >
                          <CheckCheck className="w-3.5 h-3.5" /> Read
                        </button>
                      )}
                      {notifications.length > 0 && (
                        <button
                          onClick={() => clearAll()}
                          className="text-xs text-slate-400 hover:text-red-400 p-1 rounded hover:bg-red-500/10 flex items-center gap-1 transition-colors"
                          title="Clear all"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Clear
                        </button>
                      )}
                    </div>
                  </div>

                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-slate-500 text-xs font-mono">
                      No notifications logged. System steady.
                    </div>
                  ) : (
                    <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => !notif.isRead && markAsRead(notif.id)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                            notif.isRead
                              ? 'bg-slate-900/40 border-slate-800 text-slate-400'
                              : 'bg-cyan-950/30 border-cyan-500/30 text-slate-200 shadow-glow-cyan/10 hover:border-cyan-400/50'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {!notif.isRead && (
                              <span className="w-2 h-2 rounded-full bg-cyan-400 mt-1 flex-shrink-0 animate-ping" />
                            )}
                            <div className="flex-1">
                              <p className="leading-snug">{notif.message}</p>
                              <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                                {new Date(notif.createdAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })} • {new Date(notif.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User Profile Capsule */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="hidden md:block text-right">
                <div className="text-xs font-semibold text-slate-200 truncate max-w-[140px]">
                  {user?.name}
                </div>
                <div className="text-[10px] font-mono text-cyan-400">
                  @{user?.userId}
                </div>
              </div>

              {/* Password Change Button */}
              <button
                onClick={() => setShowPasswordModal(true)}
                className="p-2 rounded-xl glass-input hover:border-violet-500/50 text-slate-400 hover:text-violet-400 transition-colors"
                title="Change Password"
              >
                <KeyRound className="w-4 h-4" />
              </button>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="p-2 rounded-xl glass-input hover:border-red-500/50 text-slate-400 hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Password Modal */}
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </>
  );
};
