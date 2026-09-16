import React from 'react';
import { HelpCircle, Tag, Layers, Flame } from 'lucide-react';

const QuestionCard = ({
  questionNumber = 1,
  totalQuestions = 5,
  questionText = '',
  difficulty = 'Medium',
  type = 'technical',
  expectedTopics = [],
}) => {
  const progressPercent = Math.round((questionNumber / totalQuestions) * 100);

  const difficultyColors = {
    Easy: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900',
    Medium: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900',
    Hard: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900',
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
      {/* Top Header & Progress */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-900">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span
            className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl text-xs font-semibold border ${
              difficultyColors[difficulty] || difficultyColors.Medium
            }`}
          >
            <Flame className="w-3 h-3" />
            <span>{difficulty}</span>
          </span>
          {type === 'follow-up' && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900">
              Follow-up Probe
            </span>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-32 sm:w-44 flex items-center space-x-2">
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-brand-600 to-teal-400 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Main Question Text */}
      <div className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-relaxed tracking-tight">
          {questionText}
        </h2>
      </div>

      {/* Expected Evaluation Topics */}
      {expectedTopics && expectedTopics.length > 0 && (
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 flex items-center space-x-1 mr-1">
            <Tag className="w-3 h-3" />
            <span>Key Evaluated Themes:</span>
          </span>
          {expectedTopics.map((topic, index) => (
            <span
              key={index}
              className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              {topic}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
