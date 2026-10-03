import React from 'react';

export const LogoIcon = ({ size = 40, variant = 'lime', className = "" }) => {
  const isEmerald = variant === 'emerald';
  const bgClass = isEmerald 
    ? 'bg-[#064E45] text-[#DFFF72] shadow-emerald-btn border border-[#0A5C52]' 
    : 'bg-[#DFFF72] text-[#064E45] shadow-lime-btn';

  const strokeColor = isEmerald ? '#DFFF72' : '#064E45';
  const secondaryStroke = isEmerald ? '#8BE4A0' : '#087F6A';
  const nodeFill = isEmerald ? '#E8FF9A' : '#043F38';
  const targetRing = isEmerald ? '#FFFFFF' : '#064E45';

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden transition-all duration-300 hover:scale-105 ${bgClass} ${className}`}
    >
      {/* Bespoke BA Process Trajectory Vector Mark */}
      <svg
        width={size * 0.65}
        height={size * 0.65}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Upper dashed milestone arc */}
        <path
          d="M8 9C12 5.5 19 5.5 24 9.5"
          stroke={secondaryStroke}
          strokeWidth="2"
          strokeDasharray="2.5 2.5"
          strokeLinecap="round"
          opacity="0.85"
        />
        {/* Main Process Execution Flow */}
        <path
          d="M6 24L13 17L18 21L26 9"
          stroke={strokeColor}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Step Nodes */}
        <circle cx="6" cy="24" r="2.4" fill={nodeFill} />
        <circle cx="13" cy="17" r="2.4" fill={nodeFill} />
        <circle cx="18" cy="21" r="2.4" fill={nodeFill} />
        {/* Target Milestone Node */}
        <circle cx="26" cy="9" r="3.4" fill={targetRing} stroke={strokeColor} strokeWidth="1.8" />
        {/* Target Center Dot */}
        <circle cx="26" cy="9" r="1.2" fill={isEmerald ? '#064E45' : '#DFFF72'} />
      </svg>
    </div>
  );
};

export const BrandLogo = ({ showSubtitle = true, iconSize = 40, variant = 'lime', className = "" }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoIcon size={iconSize} variant={variant} />
      <div className="select-none">
        <span className="font-heading font-extrabold text-lg tracking-tight block text-white leading-none">
          BA Process <span className="text-[#DFFF72]">Tracker</span>
        </span>
        {showSubtitle && (
          <span className="text-[10px] font-mono text-[#DFFF72] uppercase tracking-wider block mt-1 opacity-90">
            Enterprise Delivery Cockpit
          </span>
        )}
      </div>
    </div>
  );
};

