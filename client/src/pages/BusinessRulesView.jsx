import React from 'react';
import { ShieldAlert, ArrowRight, CheckCircle2, Lock, Sparkles, Filter } from 'lucide-react';
import { useBA } from '../context/BAContext';

export const BusinessRulesView = () => {
  const { businessRules } = useBA();

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3E8DE]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#DFFF72] text-[#064E45]">
              System Policy Engine
            </span>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#10201D] tracking-tight">
              Business Rules Catalog
            </h1>
          </div>
          <p className="text-sm text-[#5A6E69] mt-1 font-medium">
            Strict behavioral logic, compliance mandates, and operational policy constraints.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-[#064E45] bg-[#EFF2E9] px-3 py-1.5 rounded-full">
            {businessRules.length} Active Rules
          </span>
        </div>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {businessRules.map((rule) => (
          <div
            key={rule.id}
            className="saas-card p-6 flex flex-col justify-between hover:border-[#064E45]/40 transition-all"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-[#064E45] text-[#DFFF72]">
                  {rule.id}
                </span>
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {rule.status}
                </span>
              </div>

              <h3 className="font-heading font-bold text-base text-[#10201D] mb-4">
                {rule.rule}
              </h3>

              {/* Condition -> Action Flow */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-[#F7F8F2] border border-[#E3E8DE]">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#064E45] block mb-1">
                    IF Condition:
                  </span>
                  <p className="text-xs font-medium text-[#10201D] leading-snug">
                    {rule.condition}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F2F7F5] border border-[#CDE0DC]">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#087F6A] block mb-1">
                    THEN System Action:
                  </span>
                  <p className="text-xs font-semibold text-[#064E45] leading-snug">
                    {rule.action}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#EFF2E9] flex items-center justify-between text-xs text-[#5A6E69] font-mono">
              <span>Priority: <strong className="text-rose-700">{rule.priority}</strong></span>
              <span className="text-[11px] text-[#087F6A] font-bold">Policy Enforced</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
