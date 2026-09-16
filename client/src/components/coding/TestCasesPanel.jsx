import React, { useState } from 'react';
import { CheckCircle, XCircle, Play, Send, Terminal, Clock, ShieldAlert } from 'lucide-react';

const TestCasesPanel = ({
  testCases = [],
  testResults = [],
  onRunCode,
  onSubmitCode,
  isRunning = false,
  isSubmitting = false,
  executionTimeMs = 0,
}) => {
  const [selectedCaseTab, setSelectedCaseTab] = useState(0);

  const activeResults = testResults.length > 0 ? testResults : null;
  const currentCase = testCases[selectedCaseTab] || {};
  const currentResult = activeResults ? activeResults[selectedCaseTab] : null;

  return (
    <div className="glass-panel rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 flex flex-col space-y-4">
      {/* Header & Execution bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/70 dark:border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-brand-500" />
          <h4 className="text-sm font-bold text-slate-800 dark:text-white">
            Test Cases & Sandboxed Execution
          </h4>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={onRunCode}
            disabled={isRunning || isSubmitting}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition-all disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current text-emerald-500" />
            <span>{isRunning ? 'Running Tests...' : 'Run Code'}</span>
          </button>

          <button
            type="button"
            onClick={onSubmitCode}
            disabled={isRunning || isSubmitting}
            className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-teal-500 hover:from-brand-500 hover:to-teal-400 shadow-md shadow-brand-500/20 transition-all disabled:opacity-50 hover:scale-[1.02]"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Evaluating with AI...' : 'Submit Solution'}</span>
          </button>
        </div>
      </div>

      {/* Case Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {testCases.map((tc, idx) => {
          const res = activeResults ? activeResults[idx] : null;
          return (
            <button
              key={idx}
              onClick={() => setSelectedCaseTab(idx)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCaseTab === idx
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {res && (
                res.passed ? (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-300" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-rose-300" />
                )
              )}
              <span>Case {idx + 1}</span>
              {tc.isHidden && <span className="opacity-70 text-[10px]">(Hidden)</span>}
            </button>
          );
        })}
      </div>

      {/* Active Case Details */}
      <div className="bg-slate-900 rounded-xl p-4 text-xs font-mono space-y-3 text-slate-200">
        <div>
          <span className="text-slate-400 block mb-1 font-sans font-semibold text-[11px] uppercase tracking-wider">
            Input:
          </span>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-teal-300 overflow-x-auto">
            {currentCase.input || 'None'}
          </div>
        </div>

        <div>
          <span className="text-slate-400 block mb-1 font-sans font-semibold text-[11px] uppercase tracking-wider">
            Expected Output:
          </span>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 overflow-x-auto">
            {currentCase.expectedOutput || 'None'}
          </div>
        </div>

        {currentResult && (
          <div>
            <div className="flex items-center justify-between mb-1 font-sans">
              <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                Actual Output:
              </span>
              <span
                className={`inline-flex items-center space-x-1 text-[11px] font-bold ${
                  currentResult.passed ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {currentResult.passed ? 'Passed ✓' : 'Failed ✕'}
              </span>
            </div>
            <div
              className={`p-2.5 rounded-lg bg-slate-950 border overflow-x-auto ${
                currentResult.passed ? 'border-emerald-800/80 text-emerald-300' : 'border-rose-800/80 text-rose-300'
              }`}
            >
              {currentResult.actualOutput || 'No output'}
            </div>
          </div>
        )}

        {executionTimeMs > 0 && (
          <div className="pt-2 flex items-center space-x-1.5 text-slate-400 text-[11px] font-sans">
            <Clock className="w-3.5 h-3.5" />
            <span>Execution runtime: {executionTimeMs} ms</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestCasesPanel;
