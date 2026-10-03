import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Tag,
  Calendar,
  User,
  CheckCircle2,
  AlertCircle,
  Eye,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { useBA } from '../context/BAContext';
import { RequirementDetailModal } from '../components/RequirementDetailModal';

export const RequirementsView = ({ onOpenNewModal }) => {
  const { requirements, addRequirement } = useBA();
  const [selectedReq, setSelectedReq] = useState(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Internal Add Requirement Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('Functional');
  const [newPriority, setNewPriority] = useState('High');
  const [newStatus, setNewStatus] = useState('Gathering');
  const [newStakeholder, setNewStakeholder] = useState('Elena Rostova (Apex Enterprise)');
  const [newDesc, setNewDesc] = useState('');
  const [newDueDate, setNewDueDate] = useState('24 Oct 2026');

  const filteredRequirements = requirements.filter((req) => {
    const matchesSearch =
      req.title.toLowerCase().includes(search.toLowerCase()) ||
      req.id.toLowerCase().includes(search.toLowerCase()) ||
      req.stakeholder.toLowerCase().includes(search.toLowerCase());

    const matchesType = typeFilter === 'ALL' || req.type === typeFilter;
    const matchesPriority = priorityFilter === 'ALL' || req.priority === priorityFilter;
    const matchesStatus = statusFilter === 'ALL' || req.status === statusFilter;

    return matchesSearch && matchesType && matchesPriority && matchesStatus;
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addRequirement({
      title: newTitle.trim(),
      type: newType,
      priority: newPriority,
      status: newStatus,
      stakeholder: newStakeholder,
      assignedBA: 'Dhaneesh Vijayanand',
      dueDate: newDueDate,
      description: newDesc.trim() || 'Requirement definition initialized.',
      businessNeed: 'Identified during stakeholder discovery session.',
      acceptanceCriteria: ['System validates user parameters.', 'Service responds within agreed SLA.']
    });

    setNewTitle('');
    setNewDesc('');
    setShowAddModal(false);
  };

  const getPriorityBadge = (p) => {
    switch (p) {
      case 'Critical':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'High':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Medium':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusBadge = (s) => {
    switch (s) {
      case 'Implemented':
        return 'bg-[#DFFF72] text-[#064E45] border-[#087F6A]/20';
      case 'Approved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Analyzed':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Gathering':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3E8DE]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#10201D] tracking-tight">
            Requirements Traceability
          </h1>
          <p className="text-sm text-[#5A6E69] mt-1 font-medium">
            Capture, analyze and track project requirements across development sprints.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn-lime text-xs sm:text-sm font-bold shadow-lime-btn"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Add Requirement</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="saas-card p-4 space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C9E9A]" />
            <input
              type="text"
              placeholder="Search by ID (REQ-1024), title, or stakeholder..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F7F8F2] border border-[#E3E8DE] text-xs text-[#10201D] placeholder-[#8C9E9A] focus:outline-none focus:border-[#064E45]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#F7F8F2] border border-[#E3E8DE] text-xs font-semibold text-[#10201D] focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Gathering">Gathering</option>
              <option value="Analyzed">Analyzed</option>
              <option value="Approved">Approved</option>
              <option value="Implemented">Implemented</option>
              <option value="Rejected">Rejected</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#F7F8F2] border border-[#E3E8DE] text-xs font-semibold text-[#10201D] focus:outline-none"
            >
              <option value="ALL">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#F7F8F2] border border-[#E3E8DE] text-xs font-semibold text-[#10201D] focus:outline-none"
            >
              <option value="ALL">All Types</option>
              <option value="Functional">Functional</option>
              <option value="Non-functional">Non-functional</option>
              <option value="Business">Business</option>
              <option value="Technical">Technical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Modern Requirements Table & Cards */}
      <div className="saas-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F7F8F2] border-b border-[#E3E8DE] text-[#5A6E69] font-mono uppercase tracking-wider">
                <th className="py-3.5 px-5">ID</th>
                <th className="py-3.5 px-4">Title & Scope</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Stakeholder</th>
                <th className="py-3.5 px-4">Due Date</th>
                <th className="py-3.5 px-5 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFF2E9]">
              {filteredRequirements.map((req) => (
                <tr
                  key={req.id}
                  onClick={() => setSelectedReq(req)}
                  className="hover:bg-[#F7F8F2]/70 cursor-pointer transition-colors"
                >
                  <td className="py-4 px-5 font-mono font-bold text-[#064E45]">
                    {req.id}
                  </td>
                  <td className="py-4 px-4 font-semibold text-[#10201D] max-w-xs sm:max-w-sm">
                    <div className="truncate text-sm">{req.title}</div>
                    <span className="text-[11px] text-[#5A6E69] truncate block mt-0.5 font-normal">
                      {req.description}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-medium text-[#5A6E69]">
                    <span className="px-2.5 py-0.5 rounded-lg bg-[#EFF2E9] text-[#064E45] font-semibold text-[11px]">
                      {req.type}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getPriorityBadge(req.priority)}`}>
                      {req.priority}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(req.status)}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-[#5A6E69] font-medium max-w-[140px] truncate">
                    {req.stakeholder}
                  </td>
                  <td className="py-4 px-4 font-mono text-[#5A6E69] text-[11px]">
                    {req.dueDate}
                  </td>
                  <td className="py-4 px-5 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedReq(req);
                      }}
                      className="p-1.5 rounded-lg text-[#064E45] hover:bg-[#EFF2E9] transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Requirement Detail Modal */}
      {selectedReq && (
        <RequirementDetailModal
          requirement={selectedReq}
          onClose={() => setSelectedReq(null)}
        />
      )}

      {/* Add Requirement Modal */}
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
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-heading font-bold text-[#10201D]">Capture New Requirement</h3>
                <p className="text-xs text-[#5A6E69]">Log deliverable specifications into the BA backlog</p>
              </div>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#10201D] mb-1">Requirement Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Automated Multi-Currency FX Settlement"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl saas-input text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#10201D] mb-1">Classification Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl saas-input text-xs"
                  >
                    <option value="Functional">Functional</option>
                    <option value="Non-functional">Non-functional</option>
                    <option value="Business">Business</option>
                    <option value="Technical">Technical</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#10201D] mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl saas-input text-xs"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#10201D] mb-1">Lifecycle Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl saas-input text-xs"
                  >
                    <option value="Gathering">Gathering</option>
                    <option value="Analyzed">Analyzed</option>
                    <option value="Approved">Approved</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#10201D] mb-1">Target Due Date</label>
                  <input
                    type="text"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl saas-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#10201D] mb-1">Key Stakeholder</label>
                <input
                  type="text"
                  value={newStakeholder}
                  onChange={(e) => setNewStakeholder(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl saas-input text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-[#10201D] mb-1">Description / Acceptance Notes</label>
                <textarea
                  rows="3"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Detail the specific user capabilities, business justification, and edge cases..."
                  className="w-full px-3.5 py-2.5 rounded-xl saas-input text-xs leading-relaxed"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#D8E0D7] text-[#5A6E69] font-semibold"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-lime text-xs font-bold">
                  Add to Backlog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
