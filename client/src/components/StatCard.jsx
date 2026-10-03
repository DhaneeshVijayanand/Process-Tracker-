import React from 'react';
import { ArrowUpRight, TrendingUp } from 'lucide-react';

export const StatCard = ({ title, value, subtitle, change, icon: Icon, badgeColor = 'emerald' }) => {
  return (
    <div className="saas-card-interactive p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#5A6E69]">
          {title}
        </span>
        {Icon && (
          <div className="w-10 h-10 rounded-2xl bg-[#EFF2E9] text-[#064E45] flex items-center justify-center">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div>
        <div className="text-3xl sm:text-4xl font-extrabold font-heading text-[#10201D] tracking-tight">
          {value}
        </div>

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#EFF2E9]">
          <span className="text-xs text-[#5A6E69] font-medium">
            {subtitle}
          </span>
          {change && (
            <span className="text-[11px] font-mono font-bold text-[#064E45] bg-[#DFFF72] px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />
              {change}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
