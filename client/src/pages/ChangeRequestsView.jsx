import React, { useState } from 'react';
import {
  GitPullRequest,
  Plus,
  Calendar,
  User,
  AlertTriangle,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  X
} from 'lucide-react';
import { useBA } from '../context/BAContext';

export const ChangeRequestsView = () => {
  const { changeRequests, addChangeRequest } = useBA();
  const [showAddModal, setShowAddModal] = useState(false);
  const [requestedChange, setRequestedChange] = useState('');
  const [requestedBy, setRequestedBy] = useState('Elena Rostova (Apex Enterprise)');
  const [impact, setImpact] = useState('Medium Impact (API update)');
  const [priority, setPriority] = useState('High');
  const [costImpact, setCostImpact] = useState('$3,500');
  const [scheduleImpact, setScheduleImpact] = useState('+2 Days');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!requestedChange.trim()) return;

    addChangeRequest({
      requestedChange: requestedChange.trim(),
      requestedBy,
      impact,
      priority,
      status: 'Requested',
      costImpact,
      scheduleImpact
    });

    setRequestedChange('');
    setShowAddModal(false);
  };

  const getStatusBadge = (s) => {
    switch (s) {
      case 'Implemented':
        return 'bg-[#DFFF72] text-[#064E45] border-[#087F6A]/20';
      case 'Approved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Under Analysis':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Rejected':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3E8DE]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#10201D] tracking-tight">
            Scope Change Management (CRs)
          </h1>
          <p className="text-sm text-[#5A6E69] mt-1 font-medium">
            Evaluate, estimate, and track formal modifications to the baseline project scope.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn-lime text-xs sm:text-sm font-bold shadow-lime-btn"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Log Change Request</span>
        </button>
      </div>

      {/* Impact Summary Overview Card */}
      <div className="saas-card-emerald p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-mono font-bold text-[#DFFF72] uppercase tracking-wider block mb-1">
              Scope Control Governance
            </span>
            <h2 className="text-xl font-heading font-bold text-white">
              Cumulative Scope Impact Summary
            </h2>
            <p className="text-xs text-[#D6E6E3] mt-1">
              3 Change Requests logged • 2 Approved • 1 Pending Impact Analysis
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15">
              <span className="text-[10px] font-mono text-[#DFFF72] block uppercase">Cost Delta</span>
              <strong className="text-lg text-white font-mono">+$16,700</strong>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15">
              <span className="text-[10px] font-mono text-[#DFFF72] block uppercase">Schedule Delta</span>
              <strong className="text-lg text-white font-mono">+11 Days</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Change Requests List */}
      <div className="space-y-4">
        {changeRequests.map((cr) => (
          <div
            key={cr.id}
            className="saas-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-[#064E45]/40 transition-all"
          >
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-[#064E45] text-[#DFFF72]">
                  {cr.id}
                </span>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(cr.status)}`}>
                  {cr.status}
                </span>
                <span className="text-xs font-mono text-[#5A6E69]">
                  Logged on: {cr.date}
                </span>
              </div>

              <h3 className="font-heading font-bold text-base text-[#10201D]">
                {cr.requestedChange}
              </h3>

              <div className="flex flex-wrap items-center gap-4 text-xs text-[#5A6E69] font-mono">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#064E45]" /> Requested by: <strong>{cr.requestedBy}</strong>
                </span>
                <span className="flex items-center gap-1 text-amber-800">
                  <AlertTriangle className="w-3.5 h-3.5" /> {cr.impact}
                </span>
              </div>
            </div>

            {/* Impact Details Box */}
            <div className="p-3.5 rounded-2xl bg-[#F7F8F2] border border-[#E3E8DE] flex items-center gap-4 text-xs font-mono text-[#10201D]">
              <div>
                <span className="text-[10px] text-[#8C9E9A] uppercase block">Budget Impact</span>
                <strong className="text-[#064E45]">{cr.costImpact}</strong>
              </div>
              <div className="h-6 w-px bg-[#E3E8DE]" />
              <div>
                <span className="text-[10px] text-[#8C9E9A] uppercase block">Schedule Impact</span>
                <strong>{cr.scheduleImpact}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add CR Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-[#E3E8DE] shadow-saas-float p-6 sm:p-7 relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-[#5A6E69] hover:text-[#10201D]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-[#E3E8DE]">
              <div className="w-9 h-9 rounded-xl bg-[#EFF2E9] text-[#064E45] flex items-center justify-center">
                <GitPullRequest className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-heading font-bold text-[#10201D]">Log Scope Change Request</h3>
                <p className="text-xs text-[#5A6E69]">Document requirement variance for review board</p>
              </div>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#10201D] mb-1">Requested Scope Change</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Detail the requested feature change or modification..."
                  value={requestedChange}
                  onChange={(e) => setRequestedChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl saas-input text-xs leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-[#10201D] mb-1">Initiating Stakeholder</label>
                <input
                  type="text"
                  value={requestedBy}
                  onChange={(e) => setRequestedBy(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl saas-input text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#10201D] mb-1">Estimated Budget Impact</label>
                  <input
                    type="text"
                    value={costImpact}
                    onChange={(e) => setCostImpact(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl saas-input text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#10201D] mb-1">Schedule Variance</label>
                  <input
                    type="text"
                    value={scheduleImpact}
                    onChange={(e) => setScheduleImpact(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl saas-input text-xs"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#D8E0D7] text-[#5A6E69] font-semibold"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-lime text-xs font-bold">
                  Submit Change Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
