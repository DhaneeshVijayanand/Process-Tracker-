import React from 'react';
import { User, KeyRound, Shield, Bell, CheckCircle2, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SettingsView = ({ onOpenPasswordModal }) => {
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl">
      {/* Header */}
      <div className="pb-4 border-b border-[#E3E8DE]">
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#10201D] tracking-tight">
          Account & Security Settings
        </h1>
        <p className="text-sm text-[#5A6E69] mt-1 font-medium">
          Manage your credentials, session authorizations, and notification preferences.
        </p>
      </div>

      {/* Profile Card */}
      <div className="saas-card p-6 sm:p-8">
        <h2 className="text-base font-bold font-heading text-[#10201D] mb-4">
          Profile Credentials
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-[#F7F8F2] border border-[#E3E8DE]">
            <span className="text-[10px] text-[#8C9E9A] uppercase font-mono block">Full Name</span>
            <strong className="text-sm text-[#10201D] block mt-0.5">{user?.name || 'Dhaneesh Vijayanand'}</strong>
          </div>

          <div className="p-4 rounded-2xl bg-[#F7F8F2] border border-[#E3E8DE]">
            <span className="text-[10px] text-[#8C9E9A] uppercase font-mono block">User Handle / ID</span>
            <strong className="text-sm text-[#064E45] font-mono block mt-0.5">@{user?.userId || 'dhaneesh'}</strong>
          </div>

          <div className="p-4 rounded-2xl bg-[#F7F8F2] border border-[#E3E8DE]">
            <span className="text-[10px] text-[#8C9E9A] uppercase font-mono block">Security Access Role</span>
            <strong className="text-sm text-[#10201D] block mt-0.5">{user?.role || 'Lead BA'}</strong>
          </div>

          <div className="p-4 rounded-2xl bg-[#F7F8F2] border border-[#E3E8DE]">
            <span className="text-[10px] text-[#8C9E9A] uppercase font-mono block">Security Protocol</span>
            <strong className="text-sm text-[#087F6A] font-mono block mt-0.5">AES-256 JWT Token</strong>
          </div>
        </div>
      </div>

      {/* Password Management */}
      <div className="saas-card p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <KeyRound className="w-4 h-4 text-[#064E45]" />
            <h3 className="font-heading font-bold text-sm text-[#10201D]">
              Security Key & Password
            </h3>
          </div>
          <p className="text-xs text-[#5A6E69]">
            Update your account password using salted bcrypt validation.
          </p>
        </div>

        <button
          onClick={onOpenPasswordModal}
          className="btn-emerald text-xs font-semibold"
        >
          Change Password
        </button>
      </div>
    </div>
  );
};
