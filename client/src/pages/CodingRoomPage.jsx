import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { interviewAPI, codingAPI } from '../services/api';
import Navbar from '../components/common/Navbar';
import CodeEditor from '../components/coding/CodeEditor';
import TestCasesPanel from '../components/coding/TestCasesPanel';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Toast from '../components/common/Toast';
import {
  Code2,
  Terminal,
  Clock,
  Sparkles,
  PhoneOff,
  CheckCircle2,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

const CodingRoomPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [question, setQuestion] = useState(null);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [testResults, setTestResults] = useState([]);
  const [executionTime, setExecutionTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionEvaluation, setSubmissionEvaluation] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await interviewAPI.getById(id);
        if (res.data.success) {
          setInterview(res.data.interview);
          const codingQ = res.data.questions.find((q) => q.type === 'coding') || res.data.questions[0];
          setQuestion(codingQ);

          const defaultLang = res.data.interview.preferredLanguage || 'javascript';
          setLanguage(defaultLang);

          // Set starter code
          if (codingQ?.codingChallenge?.starterCode) {
            setCode(codingQ.codingChallenge.starterCode[defaultLang] || codingQ.codingChallenge.starterCode.javascript || '');
          } else {
            setCode(`function solution() {\n  // Write your code here\n}`);
          }
        }
      } catch (err) {
        console.error('Failed to load coding session:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [id]);

  // Handle language switch
  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    if (question?.codingChallenge?.starterCode?.[newLang]) {
      setCode(question.codingChallenge.starterCode[newLang]);
    }
  };

  // Reset starter code
  const handleResetCode = () => {
    if (question?.codingChallenge?.starterCode?.[language]) {
      setCode(question.codingChallenge.starterCode[language]);
    }
  };

  // Run Code against test cases
  const handleRunCode = async () => {
    if (!question) return;
    setIsRunning(true);
    setToast(null);

    try {
      const res = await codingAPI.runCode({
        questionId: question._id,
        language,
        code,
      });

      if (res.data.success) {
        setTestResults(res.data.testResults || []);
        setExecutionTime(res.data.executionTimeMs || 0);

        const passed = res.data.testCasesPassed || 0;
        const total = res.data.totalTestCases || 1;
        setToast({
          type: passed === total ? 'success' : 'info',
          message: `Passed ${passed} of ${total} test cases (${res.data.executionTimeMs}ms)`,
        });
      }
    } catch (err) {
      setToast({
        type: 'error',
        message: err.message || 'Execution error.',
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Submit Code for final evaluation
  const handleSubmitCode = async () => {
    if (!question) return;
    setIsSubmitting(true);
    setToast(null);

    try {
      const res = await codingAPI.submitCode({
        interviewId: id,
        questionId: question._id,
        language,
        code,
      });

      if (res.data.success) {
        setSubmissionEvaluation(res.data.evaluation);
        setTestResults(res.data.submission.testResults || []);
        setToast({
          type: 'success',
          message: `Code Evaluated: ${res.data.evaluation.score}/100! Complexity: ${res.data.evaluation.timeComplexity}`,
        });
      }
    } catch (err) {
      setToast({
        type: 'error',
        message: err.message || 'Submission error.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinishSession = async () => {
    try {
      setLoading(true);
      await interviewAPI.complete(id);
      navigate(`/interview/${id}/results`);
    } catch (err) {
      navigate(`/interview/${id}/results`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B0F17]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner message="Setting up isolated coding sandbox..." size="lg" />
        </div>
      </div>
    );
  }

  const challenge = question?.codingChallenge || {
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    examples: [],
    constraints: [],
    testCases: [],
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B0F17] text-slate-800 dark:text-slate-100">
      <Navbar />

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Control Header */}
      <div className="border-b border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold text-sm text-slate-900 dark:text-white">
              Algorithmic Coding Assessment
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {challenge.title}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleFinishSession}
              className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-teal-500 hover:from-brand-500 hover:to-teal-400 shadow-md shadow-brand-500/20 transition-all hover:scale-105"
            >
              <span>Finish & View Evaluation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Split Interface */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Problem Description (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-5">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-900 mb-2">
                  Problem Statement
                </span>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {challenge.title}
                </h2>
              </div>

              <div className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                {challenge.description}
              </div>

              {/* Examples */}
              {challenge.examples && challenge.examples.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Examples:
                  </h4>
                  {challenge.examples.map((ex, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-xs font-mono space-y-1">
                      <div><span className="text-slate-400">Input:</span> {ex.input}</div>
                      <div><span className="text-slate-400">Output:</span> {ex.output}</div>
                      {ex.explanation && (
                        <div className="text-slate-500 text-[11px] font-sans mt-1">
                          {ex.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Constraints */}
              {challenge.constraints && challenge.constraints.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Constraints:
                  </h4>
                  <ul className="list-disc list-inside text-xs text-slate-500 dark:text-slate-400 space-y-1 font-mono">
                    {challenge.constraints.map((c, idx) => (
                      <li key={idx}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* AI Code Review Snapshot (After Submission) */}
            {submissionEvaluation && (
              <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Architectural Review</span>
                  </h4>
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                    Score: {submissionEvaluation.score}/100
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200">
                    Time: <span className="text-teal-400 font-bold">{submissionEvaluation.timeComplexity}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200">
                    Space: <span className="text-teal-400 font-bold">{submissionEvaluation.spaceComplexity}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {submissionEvaluation.feedback}
                </p>

                {submissionEvaluation.strengths?.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Strengths:</span>
                    <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-300 mt-1 space-y-0.5">
                      {submissionEvaluation.strengths.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Editor & Test Cases (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <CodeEditor
              language={language}
              setLanguage={handleLanguageChange}
              code={code}
              setCode={setCode}
              onReset={handleResetCode}
              height="440px"
            />

            <TestCasesPanel
              testCases={challenge.testCases || []}
              testResults={testResults}
              onRunCode={handleRunCode}
              onSubmitCode={handleSubmitCode}
              isRunning={isRunning}
              isSubmitting={isSubmitting}
              executionTimeMs={executionTime}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CodingRoomPage;
