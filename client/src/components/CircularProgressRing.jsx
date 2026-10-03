import React from 'react';

export const CircularProgressRing = ({ progress = 0, size = 180, strokeWidth = 14 }) => {
  const normalizedProgress = Math.min(100, Math.max(0, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedProgress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90 filter drop-shadow-[0_0_12px_rgba(0,245,255,0.4)]"
      >
        <defs>
          <linearGradient id="cyber-ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f5ff" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <filter id="ring-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Animated Glowing Progress Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#cyber-ring-gradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          style={{
            transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />
      </svg>

      {/* Center Percentage Display */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
          {normalizedProgress}
          <span className="text-xl text-cyan-400 font-mono">%</span>
        </span>
        <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400">
          COMPLETED
        </span>
      </div>
    </div>
  );
};
