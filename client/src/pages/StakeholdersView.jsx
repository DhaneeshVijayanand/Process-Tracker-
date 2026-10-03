import React from 'react';
import {
  Users,
  Mail,
  Shield,
  MessageSquare,
  Sparkles,
  ArrowUpRight,
  UserCheck,
  CheckCircle2
} from 'lucide-react';
import { useBA } from '../context/BAContext';

export const StakeholdersView = () => {
  const { stakeholders } = useBA();

  // Categorize stakeholders into the 2x2 Matrix quadrants
  const manageClosely = stakeholders.filter((s) => s.influence === 'High' && s.interest === 'High');
  const keepSatisfied = stakeholders.filter((s) => s.influence === 'High' && s.interest === 'Low');
  const keepInformed = stakeholders.filter((s) => s.influence === 'Low' && s.interest === 'High');
  const monitor = stakeholders.filter((s) => s.influence === 'Low' && s.interest === 'Low');

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3E8DE]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#DFFF72] text-[#064E45]">
              Governance
            </span>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#10201D] tracking-tight">
              Stakeholder Management & Power Matrix
            </h1>
          </div>
          <p className="text-sm text-[#5A6E69] mt-1 font-medium">
            Analyze stakeholder influence, interest levels, and communication cadences across the engagement.
          </p>
        </div>
      </div>

      {/* 2x2 Stakeholder Influence vs Interest Matrix */}
      <div className="saas-card p-6 sm:p-8">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E3E8DE]">
          <div>
            <h2 className="text-lg font-bold font-heading text-[#10201D]">
              Power / Interest Grid (Mendelow's Matrix)
            </h2>
            <p className="text-xs text-[#5A6E69]">
              Strategic engagement prioritization based on organizational authority and project impact
            </p>
          </div>
          <span className="text-xs font-mono text-[#064E45] bg-[#EFF2E9] px-3 py-1 rounded-full font-bold">
            4 Quadrants
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Quadrant 1: High Influence / High Interest (Manage Closely) */}
          <div className="p-5 rounded-3xl bg-[#064E45] text-white border border-[#043F38] shadow-saas-card relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-[#DFFF72] tracking-wider uppercase">
                HIGH INFLUENCE • HIGH INTEREST
              </span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#DFFF72] text-[#064E45]">
                Manage Closely
              </span>
            </div>
            <h3 className="font-heading font-bold text-base text-white mb-2">
              Primary Project Decision Makers
            </h3>
            <p className="text-xs text-[#D6E6E3] mb-4">
              Requires frequent, proactive consultation and early sign-off on scope baselines.
            </p>

            <div className="space-y-2">
              {manageClosely.map((s) => (
                <div key={s.id} className="p-3 rounded-2xl bg-white/10 border border-white/15 text-xs flex items-center justify-between">
                  <div>
                    <strong className="text-white block">{s.name}</strong>
                    <span className="text-[#D6E6E3] text-[11px]">{s.role}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#DFFF72] bg-black/20 px-2 py-0.5 rounded">
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quadrant 2: High Influence / Low Interest (Keep Satisfied) */}
          <div className="p-5 rounded-3xl bg-[#F7F8F2] border border-[#E3E8DE] shadow-saas-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-[#064E45] tracking-wider uppercase">
                HIGH INFLUENCE • LOW INTEREST
              </span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#EFF2E9] text-[#064E45]">
                Keep Satisfied
              </span>
            </div>
            <h3 className="font-heading font-bold text-base text-[#10201D] mb-2">
              Architectural & Policy Authorities
            </h3>
            <p className="text-xs text-[#5A6E69] mb-4">
              Keep informed of major governance milestones without burdening with daily sprint details.
            </p>

            <div className="space-y-2">
              {keepSatisfied.map((s) => (
                <div key={s.id} className="p-3 rounded-2xl bg-white border border-[#E3E8DE] text-xs flex items-center justify-between">
                  <div>
                    <strong className="text-[#10201D] block">{s.name}</strong>
                    <span className="text-[#5A6E69] text-[11px]">{s.role}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#064E45] bg-[#EFF2E9] px-2 py-0.5 rounded font-bold">
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quadrant 3: Low Influence / High Interest (Keep Informed) */}
          <div className="p-5 rounded-3xl bg-[#F7F8F2] border border-[#E3E8DE] shadow-saas-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-[#087F6A] tracking-wider uppercase">
                LOW INFLUENCE • HIGH INTEREST
              </span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                Keep Informed
              </span>
            </div>
            <h3 className="font-heading font-bold text-base text-[#10201D] mb-2">
              Operational Users & SMEs
            </h3>
            <p className="text-xs text-[#5A6E69] mb-4">
              Regular feedback loops, usability walkthroughs, and sprint review demo invitations.
            </p>

            <div className="space-y-2">
              {keepInformed.map((s) => (
                <div key={s.id} className="p-3 rounded-2xl bg-white border border-[#E3E8DE] text-xs flex items-center justify-between">
                  <div>
                    <strong className="text-[#10201D] block">{s.name}</strong>
                    <span className="text-[#5A6E69] text-[11px]">{s.role}</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-bold">
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quadrant 4: Low Influence / Low Interest (Monitor) */}
          <div className="p-5 rounded-3xl bg-[#F7F8F2] border border-[#E3E8DE] shadow-saas-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-[#5A6E69] tracking-wider uppercase">
                LOW INFLUENCE • LOW INTEREST
              </span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800">
                Monitor
              </span>
            </div>
            <h3 className="font-heading font-bold text-base text-[#10201D] mb-2">
              Secondary Stakeholders
            </h3>
            <p className="text-xs text-[#5A6E69] mb-4">
              Periodic status reports via asynchronous newsletter or release documentation notes.
            </p>

            <div className="space-y-2">
              {monitor.map((s) => (
                <div key={s.id} className="p-3 rounded-2xl bg-white border border-[#E3E8DE] text-xs flex items-center justify-between">
                  <div>
                    <strong className="text-[#10201D] block">{s.name}</strong>
                    <span className="text-[#5A6E69] text-[11px]">{s.role}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded font-bold">
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stakeholder Directory Cards */}
      <div>
        <h2 className="text-lg font-bold font-heading text-[#10201D] mb-4">
          Stakeholder Directory & Contact Preferences
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {stakeholders.map((s) => (
            <div key={s.id} className="saas-card-interactive p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#EFF2E9] text-[#064E45] flex items-center justify-center font-bold text-sm">
                    {s.name.charAt(0)}
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#DFFF72] text-[#064E45]">
                    {s.matrixQuadrant}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-base text-[#10201D]">
                  {s.name}
                </h3>
                <span className="text-xs text-[#064E45] font-semibold block mt-0.5">
                  {s.role}
                </span>
                <span className="text-xs text-[#5A6E69] block mt-0.5">
                  {s.department}
                </span>

                <div className="mt-4 pt-3 border-t border-[#EFF2E9] space-y-2 text-xs text-[#5A6E69]">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#064E45]" />
                    <span className="truncate">{s.email}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-[#064E45] mt-0.5 flex-shrink-0" />
                    <span className="text-[11px] leading-snug">{s.commPreference}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#EFF2E9] flex items-center justify-between text-[11px] font-mono">
                <span className="text-[#5A6E69]">Influence: <strong>{s.influence}</strong></span>
                <span className="text-[#5A6E69]">Interest: <strong>{s.interest}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
