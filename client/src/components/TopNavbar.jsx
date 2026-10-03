import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Menu,
  KeyRound,
  LogOut,
  ChevronDown,
  CheckCheck,
  Trash2,
  Eye,
  Shield,
  Zap,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useBA } from '../context/BAContext';

export const TopNavbar = ({ onOpenMobileMenu, onOpenPasswordModal, activeRoleView, setActiveRoleView }) => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, clearAll } = useNotifications();
  const { activeProject, projectsList, setActiveProject } = useBA();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#E3E8DE] px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Mobile Menu Toggle & Project Badge */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl border border-[#D8E0D7] bg-[#F7F8F2] text-[#10201D] hover:bg-[#EEF2E8]"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Active Project Switcher Capsule */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F7F8F2] border border-[#E3E8DE]">
            <span className="w-2 h-2 rounded-full bg-[#087F6A] animate-pulse" />
            <select
              value={activeProject?.id}
              onChange={(e) => {
                const found = projectsList.find((p) => p.id === e.target.value);
                if (found) setActiveProject(found);
              }}
              className="bg-transparent text-xs font-semibold text-[#10201D] cursor-pointer focus:outline-none"
            >
              {projectsList.map((p) => (
                <option key={p.id} value={p.id} className="text-[#10201D]">
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C9E9A]" />
            <input
              type="text"
              placeholder="Search requirements, tasks, user stories, rules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full bg-[#F7F8F2] border border-[#E3E8DE] text-xs text-[#10201D] placeholder-[#8C9E9A] focus:outline-none focus:border-[#064E45] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Right Section: Perspective Switcher (Admin), Notifications, Profile */}
        <div className="flex items-center gap-3">
          {/* Admin Multi-Perspective Switcher */}
          {user?.role === 'ADMIN' && (
            <div className="hidden xl:flex items-center gap-1 p-1 rounded-xl bg-[#F7F8F2] border border-[#E3E8DE]">
              <span className="text-[11px] font-mono text-[#5A6E69] px-2 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" /> View:
              </span>
              <button
                onClick={() => setActiveRoleView('ADMIN')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  (!activeRoleView || activeRoleView === 'ADMIN')
                    ? 'bg-[#064E45] text-white'
                    : 'text-[#5A6E69] hover:text-[#10201D]'
                }`}
              >
                Admin
              </button>
              <button
                onClick={() => setActiveRoleView('TEAM')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeRoleView === 'TEAM'
                    ? 'bg-[#064E45] text-white'
                    : 'text-[#5A6E69] hover:text-[#10201D]'
                }`}
              >
                Team
              </button>
              <button
                onClick={() => setActiveRoleView('CLIENT')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeRoleView === 'CLIENT'
                    ? 'bg-[#064E45] text-white'
                    : 'text-[#5A6E69] hover:text-[#10201D]'
                }`}
              >
                Client
              </button>
            </div>
          )}

          {/* Notifications Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-full border border-[#E3E8DE] bg-[#FFFFFF] hover:bg-[#F7F8F2] text-[#10201D] transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-[#064E45]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#064E45] text-[#DFFF72] font-mono text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-sm">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Drawer */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-white border border-[#E3E8DE] p-4 shadow-saas-float z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-[#E3E8DE] mb-3">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#064E45]" />
                    <span className="text-sm font-bold text-[#10201D]">Process Alerts</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#DFFF72] text-[#064E45] font-bold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {unreadCount > 0 && (
                      <button
                        onClick={() => markAsRead()}
                        className="text-xs text-[#064E45] hover:text-[#087F6A] font-semibold px-2 py-1 rounded hover:bg-[#EFF2E9]"
                      >
                        Read all
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button
                        onClick={() => clearAll()}
                        className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 rounded hover:bg-rose-50"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[#8C9E9A] font-mono">
                    All notifications cleared. System optimal.
                  </div>
                ) : (
                  <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => !n.isRead && markAsRead(n.id)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                          n.isRead
                            ? 'bg-[#F7F8F2] border-[#E3E8DE] text-[#5A6E69]'
                            : 'bg-white border-[#064E45]/30 text-[#10201D] shadow-sm'
                        }`}
                      >
                        <p className="font-medium leading-snug">{n.message}</p>
                        <span className="text-[10px] text-[#8C9E9A] font-mono mt-1 block">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(n.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full border border-[#E3E8DE] bg-[#FFFFFF] hover:bg-[#F7F8F2] transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-[#064E45] text-[#DFFF72] flex items-center justify-center font-bold text-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'D'}
              </div>
              <div className="text-left hidden sm:block">
                <span className="text-xs font-bold text-[#10201D] block leading-tight">
                  {user?.name || 'Dhaneesh'}
                </span>
                <span className="text-[10px] text-[#5A6E69] font-mono block leading-tight">
                  {user?.role || 'Lead BA'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#5A6E69]" />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-white border border-[#E3E8DE] p-2 shadow-saas-float z-50 animate-in fade-in">
                <div className="px-3 py-2 border-b border-[#E3E8DE] mb-1">
                  <div className="text-xs font-bold text-[#10201D]">{user?.name || 'Dhaneesh Vijayanand'}</div>
                  <div className="text-[11px] text-[#5A6E69] font-mono">@{user?.userId || 'dhaneesh'}</div>
                </div>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onOpenPasswordModal();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#10201D] hover:bg-[#F7F8F2] transition-colors"
                >
                  <KeyRound className="w-4 h-4 text-[#064E45]" />
                  <span>Change Password</span>
                </button>

                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
