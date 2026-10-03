import React from 'react';
import {
  LayoutDashboard,
  Briefcase,
  GitMerge,
  FileText,
  Users,
  CheckSquare,
  Bookmark,
  ShieldAlert,
  GitPullRequest,
  BarChart3,
  MessageSquare,
  Settings,
  X,
  Sparkles,
  LogOut,
  ChevronRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { BrandLogo } from './Logo';
import { useAuth } from '../context/AuthContext';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
  { id: 'projects', label: 'Projects', icon: Briefcase, badge: '3' },
  { id: 'process-tracker', label: 'Process Tracker', icon: GitMerge, badge: '10 Steps' },
  { id: 'requirements', label: 'Requirements', icon: FileText, badge: '6' },
  { id: 'stakeholders', label: 'Stakeholders', icon: Users, badge: null },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare, badge: '6' },
  { id: 'user-stories', label: 'User Stories', icon: Bookmark, badge: null },
  { id: 'business-rules', label: 'Business Rules', icon: ShieldAlert, badge: null },
  { id: 'change-requests', label: 'Change Requests', icon: GitPullRequest, badge: '3' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: null },
  { id: 'timeline', label: 'Daily Stream', icon: MessageSquare, badge: 'Live' },
  { id: 'settings', label: 'Settings', icon: Settings, badge: null }
];

export const Sidebar = ({ activeTab, setActiveTab, mobileOpen, setMobileOpen, onOpenPasswordModal }) => {
  const { user, logout } = useAuth();

  const handleSelect = (id) => {
    setActiveTab(id);
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-in fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#064E45] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r border-[#043F38] shadow-2xl`}
      >
        {/* Brand Header */}
        <div>
          <div className="p-6 pb-4 flex items-center justify-between border-b border-[#0A5C52]">
            <BrandLogo />

            {/* Mobile Close Button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-[#0A5C52]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links List */}
          <nav className="p-4 space-y-1 max-h-[calc(100vh-210px)] overflow-y-auto pr-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#DFFF72] text-[#10201D] shadow-lime-btn font-bold translate-x-1'
                      : 'text-[#E1ECE9] hover:bg-[#0A5C52] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#064E45]' : 'text-[#8EA7A2]'}`} />
                    <span className="tracking-wide">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-[#064E45] text-[#DFFF72] font-bold'
                          : 'bg-[#0A5C52] text-[#DFFF72]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Profile Section */}
        <div className="p-4 border-t border-[#0A5C52] bg-[#043F38]/60">
          <div className="flex items-center justify-between p-2 rounded-2xl bg-[#032B26]/50 border border-[#0A5C52]/50">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#DFFF72] to-[#0E9B82] text-[#064E45] flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'D'}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">
                  {user?.name || 'Dhaneesh Vijayanand'}
                </div>
                <div className="text-[10px] text-[#A0B8B3] font-mono flex items-center gap-1 truncate">
                  <UserCheck className="w-3 h-3 text-[#DFFF72]" />
                  <span>{user?.role || 'Lead BA'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-1.5 rounded-xl text-[#A0B8B3] hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
