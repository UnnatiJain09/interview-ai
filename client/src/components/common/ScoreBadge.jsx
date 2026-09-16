import React from 'react';

const ScoreBadge = ({ score = 0, showClassification = true }) => {
  let label = 'Needs Improvement';
  let badgeStyle = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/60';

  if (score >= 85) {
    label = 'Excellent';
    badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/60';
  } else if (score >= 70) {
    label = 'Good';
    badgeStyle = 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-400 dark:border-teal-900/60';
  } else if (score >= 50) {
    label = 'Average';
    badgeStyle = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/60';
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeStyle} shadow-sm`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current animate-pulse"></span>
      <span>{score}/100</span>
      {showClassification && <span className="ml-1 opacity-80">({label})</span>}
    </span>
  );
};

export default ScoreBadge;
