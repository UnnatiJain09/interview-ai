import React from 'react';

const CircularScore = ({ score = 0, size = 120, strokeWidth = 10, label = 'Overall Score' }) => {
  const normalizedScore = Math.min(100, Math.max(0, Math.round(score)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  const getColor = (val) => {
    if (val >= 85) return 'text-emerald-500 stroke-emerald-500';
    if (val >= 70) return 'text-brand-500 stroke-brand-500';
    if (val >= 50) return 'text-amber-500 stroke-amber-500';
    return 'text-rose-500 stroke-rose-500';
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            className="stroke-slate-200 dark:stroke-slate-800 fill-none"
          />
          {/* Progress circle stroke */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`${getColor(normalizedScore)} fill-none transition-all duration-1000 ease-out`}
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">
            {normalizedScore}
          </span>
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            / 100
          </span>
        </div>
      </div>

      {label && (
        <span className="mt-2 text-xs font-semibold text-slate-600 dark:text-slate-300 text-center">
          {label}
        </span>
      )}
    </div>
  );
};

export default CircularScore;
