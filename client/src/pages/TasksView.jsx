import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Calendar,
  User,
  Clock,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Filter,
  X
} from 'lucide-react';
import { useBA } from '../context/BAContext';

export const TasksView = () => {
  const { tasks, addTask, updateTaskStatus } = useBA();
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('Dhaneesh Vijayanand');
  const [newTaskPriority, setNewTaskPriority] = useState('High');
  const [newTaskDueDate, setNewTaskDueDate] = useState('18 Oct 2026');

  const columns = [
    { id: 'To Do', label: 'To Do', count: tasks.filter((t) => t.status === 'To Do').length, color: 'bg-slate-200' },
    { id: 'In Progress', label: 'In Progress', count: tasks.filter((t) => t.status === 'In Progress').length, color: 'bg-[#DFFF72]' },
    { id: 'Review', label: 'Review', count: tasks.filter((t) => t.status === 'Review').length, color: 'bg-amber-300' },
    { id: 'Completed', label: 'Completed', count: tasks.filter((t) => t.status === 'Completed').length, color: 'bg-[#087F6A]' }
  ];

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    addTask({
      task: newTaskTitle.trim(),
      assignedTo: newTaskAssignee,
      priority: newTaskPriority,
      status: 'To Do',
      dueDate: newTaskDueDate
    });

    setNewTaskTitle('');
    setShowNewTaskModal(false);
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

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3E8DE]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#10201D] tracking-tight">
            Sprint Task Board
          </h1>
          <p className="text-sm text-[#5A6E69] mt-1 font-medium">
            Manage daily BA deliverables, specification reviews, and engineering clarification tasks.
          </p>
        </div>

        <button
          onClick={() => setShowNewTaskModal(true)}
          className="btn-lime text-xs sm:text-sm font-bold shadow-lime-btn"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Add Task</span>
        </button>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);

          return (
            <div key={col.id} className="bg-[#F7F8F2] rounded-3xl p-4 border border-[#E3E8DE] flex flex-col min-h-[500px]">
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E3E8DE]">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                  <span className="font-heading font-bold text-sm text-[#10201D]">
                    {col.label}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-white text-[#064E45] border border-[#E3E8DE]">
                  {col.count}
                </span>
              </div>

              {/* Task Cards Column */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {colTasks.length === 0 ? (
                  <div className="py-12 text-center text-xs text-[#8C9E9A] font-mono border border-dashed border-[#D8E0D7] rounded-2xl p-4">
                    No tasks in {col.label}
                  </div>
                ) : (
                  colTasks.map((t) => (
                    <div
                      key={t.id}
                      className="saas-card-interactive p-4 bg-white flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-mono font-bold text-[#064E45]">
                            {t.id}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityBadge(t.priority)}`}>
                            {t.priority}
                          </span>
                        </div>

                        <h4 className="font-heading font-bold text-xs sm:text-sm text-[#10201D] mb-3 leading-snug">
                          {t.task}
                        </h4>
                      </div>

                      <div>
                        {/* Progress */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-[10px] font-mono text-[#5A6E69] mb-1">
                            <span>Progress</span>
                            <span className="font-bold text-[#064E45]">{t.progress}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-[#EFF2E9] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#064E45] rounded-full"
                              style={{ width: `${t.progress}%` }}
                            />
                          </div>
                        </div>

                        <div className="pt-2 border-t border-[#EFF2E9] flex items-center justify-between text-[11px] text-[#5A6E69]">
                          <span className="flex items-center gap-1 truncate max-w-[120px]">
                            <User className="w-3 h-3 text-[#064E45]" />
                            {t.assignedTo.split(' ')[0]}
                          </span>

                          {/* Quick Status Shift Dropdown */}
                          <select
                            value={t.status}
                            onChange={(e) => updateTaskStatus(t.id, e.target.value)}
                            className="text-[10px] font-mono font-bold bg-[#F7F8F2] border border-[#E3E8DE] rounded-lg px-1.5 py-0.5 text-[#064E45] focus:outline-none cursor-pointer"
                          >
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Review">Review</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl border border-[#E3E8DE] shadow-saas-float p-6 sm:p-7 relative">
            <button
              onClick={() => setShowNewTaskModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-[#5A6E69] hover:text-[#10201D]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-[#E3E8DE]">
              <div className="w-9 h-9 rounded-xl bg-[#EFF2E9] text-[#064E45] flex items-center justify-center">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-heading font-bold text-[#10201D]">Create Sprint Task</h3>
                <p className="text-xs text-[#5A6E69]">Assign deliverable to the BA sprint workflow</p>
              </div>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#10201D] mb-1">Task Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Map edge cases on high-volume payout gateway"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl saas-input text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-[#10201D] mb-1">Assigned Owner</label>
                <input
                  type="text"
                  value={newTaskAssignee}
                  onChange={(e) => setNewTaskAssignee(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl saas-input text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#10201D] mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl saas-input text-xs"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#10201D] mb-1">Due Date</label>
                  <input
                    type="text"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl saas-input text-xs"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#D8E0D7] text-[#5A6E69] font-semibold"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-lime text-xs font-bold">
                  Add to Board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
