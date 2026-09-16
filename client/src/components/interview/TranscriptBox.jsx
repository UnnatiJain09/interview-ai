import React from 'react';
import { Send, SkipForward, Edit3, Trash2, Sparkles } from 'lucide-react';

const TranscriptBox = ({
  answerText = '',
  setAnswerText,
  onSubmit,
  onSkip,
  isSubmitting = false,
  mode = 'voice',
}) => {
  const wordCount = answerText.trim() ? answerText.trim().split(/\s+/).length : 0;

  const insertSampleAnswer = () => {
    setAnswerText(
      'In my experience, building scalable systems requires a clear separation of concerns, defensive error handling, and robust database indexing. For asynchronous workloads, using message queues allows decoupling services and maintaining fast user response times without blocking the main event loop.'
    );
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Edit3 className="w-4 h-4 text-brand-500" />
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {mode === 'voice' ? 'Spoken Transcript & Text Editor' : 'Your Answer'}
          </h4>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={insertSampleAnswer}
            className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/50 rounded-lg transition-colors"
          >
            <Sparkles className="w-3 h-3" />
            <span>Fill Sample Answer</span>
          </button>
          {answerText && (
            <button
              type="button"
              onClick={() => setAnswerText('')}
              className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
              title="Clear text"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Editable textarea */}
      <div className="relative">
        <textarea
          rows={5}
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          placeholder={
            mode === 'voice'
              ? 'Click the microphone above to speak your answer, or type directly here...'
              : 'Type your comprehensive answer here...'
          }
          className="w-full p-4 rounded-xl text-sm sm:text-base leading-relaxed bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 resize-none transition-all shadow-inner"
        />
        <div className="absolute bottom-3 right-3 text-xs font-medium text-slate-400">
          {wordCount} words
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onSkip}
          disabled={isSubmitting}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
        >
          <SkipForward className="w-4 h-4" />
          <span>Skip Question</span>
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting || !answerText.trim()}
          className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-teal-500 hover:from-brand-500 hover:to-teal-400 shadow-md shadow-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Send className="w-4 h-4" />
          <span>{isSubmitting ? 'Evaluating with AI...' : 'Submit Answer'}</span>
        </button>
      </div>
    </div>
  );
};

export default TranscriptBox;
