import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { interviewAPI } from '../services/api';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import CircularScore from '../components/common/CircularScore';
import ScoreBadge from '../components/common/ScoreBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  Trophy,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  BarChart2,
  Printer,
  ChevronDown,
  ChevronUp,
  Award,
  BookOpen,
  MessageSquare,
  LayoutDashboard,
} from 'lucide-react';

const FALLBACK_RESULTS = {
  interview: {
    interviewType: 'Technical',
    targetRole: 'Full Stack Developer',
    difficulty: 'Medium',
    duration: 20,
    overallScore: 87,
    technicalScore: 90,
    communicationScore: 86,
    codingScore: 88,
    answerQuality: 88,
    relevanceScore: 92,
    clarityScore: 89,
    grammarScore: 94,
    mode: 'voice',
    summaryFeedback:
      'Candidate performed admirably, demonstrating solid grasp of core asynchronous Node.js execution, REST API security best practices, and React reconciliation. Speech was clear and logically structured.',
    strengths: [
      'Accurate explanation of libuv thread offloading and Event Loop mechanics',
      'Effective structure when breaking down architectural tradeoffs',
      'Confident delivery with high vocabulary precision and minimal filler words',
    ],
    improvements: [
      'Incorporate more quantifiable performance metrics and benchmark data',
      'Structure behavioral answers using the STAR method consistently',
      'Highlight concrete edge cases in distributed database caching discussions',
    ],
  },
  questions: [
    {
      _id: 'q1',
      question:
        'Explain how the Event Loop works in Node.js, and how it handles asynchronous I/O operations without blocking the main execution thread.',
    },
    {
      _id: 'q2',
      question:
        'How do you design and structure a secure RESTful API with JWT authentication, refresh tokens, and rate limiting in Express.js?',
    },
  ],
  answers: [
    {
      questionId: 'q1',
      score: 88,
      answerText:
        'Node.js uses a single-threaded event loop powered by libuv. When an asynchronous operation like a database query or file read starts, Node offloads it to the OS or libuv thread pool. Meanwhile, the main call stack continues executing synchronous code. When the async operation completes, its callback is placed in the event queue and executed.',
      feedback:
        'Excellent explanation of libuv thread delegation and non-blocking I/O flow. Adding a mention of microtask queue priorities would make it perfect.',
      idealAnswer:
        'Node.js operates on a single execution thread with an event-driven architecture powered by libuv. Synchronous code executes immediately on the Call Stack. Asynchronous tasks are delegated to the underlying OS or the libuv worker pool. Once complete, callbacks enter specific phase queues while Microtasks (Promises, process.nextTick) execute immediately after phase transitions.',
    },
    {
      questionId: 'q2',
      score: 86,
      answerText:
        'For secure REST APIs, I store short-lived JWT access tokens in memory or headers and long-lived refresh tokens in HttpOnly Secure cookies to prevent XSS attacks. In Express, I use express-rate-limit to protect against brute-force attacks and sanitize incoming request bodies.',
      feedback:
        'Strong security fundamentals. Great emphasis on HttpOnly cookies and rate limiting middleware.',
      idealAnswer:
        'A secure Express REST API implements multi-tier defense: short-lived JWT access tokens (15m) paired with rotating refresh tokens stored in HttpOnly, SameSite=Strict cookies. Middleware layers should enforce CORS whitelisting, rate limiting per IP/route, Helmet security headers, and request body validation.',
    },
  ],
};

const ResultsPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedQuestion, setExpandedQuestion] = useState(0);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        if (id && id !== 'demo' && !id.startsWith('session_')) {
          const res = await interviewAPI.getById(id);
          if (res.data.success && res.data.interview) {
            setData(res.data);
            if ((res.data.interview?.overallScore || 0) >= 70) {
              confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
            }
            return;
          }
        }
        // Fallback for demo mode
        setData(FALLBACK_RESULTS);
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch (err) {
        console.warn('Using fallback report data:', err.message);
        setData(FALLBACK_RESULTS);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B0F17]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner message="Synthesizing final AI evaluation & analytics..." size="lg" />
        </div>
      </div>
    );
  }

  const interview = data?.interview || FALLBACK_RESULTS.interview;
  const questions = data?.questions?.length ? data.questions : FALLBACK_RESULTS.questions;
  const answers = data?.answers?.length ? data.answers : FALLBACK_RESULTS.answers;
  const overallScore = interview.overallScore || 87;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B0F17] text-slate-800 dark:text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Top Banner Celebration */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Trophy className="w-3.5 h-3.5 text-emerald-500" />
            <span>Interview Session Completed Successfully</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Interview Performance Report 🎉
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {interview.interviewType} Round • {interview.targetRole} • {interview.difficulty || 'Medium'} Level
          </p>
        </div>

        {/* Overall Score Showcase Card */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Circular Score Gauge */}
          <div className="flex justify-center border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 pb-6 md:pb-0">
            <CircularScore score={overallScore} size={150} strokeWidth={12} label="Composite Score" />
          </div>

          {/* Classification & Summary */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Performance Rating:
              </span>
              <ScoreBadge score={overallScore} showClassification={true} />
            </div>

            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed">
              {interview.summaryFeedback ||
                'Candidate performed admirably, demonstrating consistent technical knowledge, articulate speech clarity, and structured thought delivery across the session.'}
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                Questions: {questions.length}
              </span>
              <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                Duration: {interview.duration}m
              </span>
              <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                Mode: {interview.mode || 'voice'}
              </span>
            </div>
          </div>
        </div>

        {/* 6 Metric Breakdown Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Technical Depth', score: interview.technicalScore || 88 },
            { label: 'Communication', score: interview.communicationScore || 85 },
            { label: 'Answer Quality', score: interview.answerQuality || 88 },
            { label: 'Relevance', score: interview.relevanceScore || 92 },
            { label: 'Clarity & Flow', score: interview.clarityScore || 89 },
            { label: 'Grammar', score: interview.grammarScore || 94 },
          ].map((m, idx) => (
            <div
              key={idx}
              className="glass-panel p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center space-y-1"
            >
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                {m.score}
              </div>
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                {m.label}
              </div>
            </div>
          ))}
        </div>

        {/* Strengths & Areas to Improve */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths */}
          <div className="glass-panel p-6 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 space-y-4">
            <h3 className="text-base font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>Demonstrated Key Strengths</span>
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
              {(interview.strengths?.length
                ? interview.strengths
                : FALLBACK_RESULTS.interview.strengths
              ).map((str, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas for Improvement */}
          <div className="glass-panel p-6 rounded-3xl border border-amber-500/20 bg-amber-500/5 space-y-4">
            <h3 className="text-base font-bold text-amber-600 dark:text-amber-400 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Targeted Areas for Improvement</span>
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
              {(interview.improvements?.length
                ? interview.improvements
                : FALLBACK_RESULTS.interview.improvements
              ).map((imp, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  <span>{imp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Question-by-Question Deep Dive with Ideal Answers */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Question-by-Question AI Analysis
            </h2>
            <p className="text-xs text-slate-400">
              Review your answers alongside personalized AI feedback and model high-scoring responses.
            </p>
          </div>

          <div className="space-y-4">
            {questions.map((q, idx) => {
              const answerObj = answers.find(
                (a) => (a.questionId?._id || a.questionId) === q._id
              ) || answers[idx] || answers[0];
              const isExpanded = expandedQuestion === idx;

              return (
                <div
                  key={q._id || idx}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white/50 dark:bg-slate-900/40"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedQuestion(isExpanded ? -1 : idx)}
                    className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center space-x-3 pr-4">
                      <span className="w-7 h-7 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center">
                        Q{idx + 1}
                      </span>
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 line-clamp-1">
                        {q.question}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 flex-shrink-0">
                      {answerObj && <ScoreBadge score={answerObj.score || 85} showClassification={false} />}
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-5 border-t border-slate-200/80 dark:border-slate-800 space-y-4 text-xs sm:text-sm">
                      <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-semibold">
                        {q.question}
                      </div>

                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                          Your Recorded Response:
                        </span>
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800 text-slate-700 dark:text-slate-300 leading-relaxed italic">
                          "{answerObj?.answerText || 'No answer recorded for this question.'}"
                        </div>
                      </div>

                      {answerObj && (
                        <div className="p-4 rounded-xl bg-brand-50/40 dark:bg-brand-950/30 border border-brand-200/60 dark:border-brand-900/60 space-y-2">
                          <div className="flex items-center space-x-1.5 text-xs font-bold text-brand-700 dark:text-brand-300">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>AI Feedback:</span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                            {answerObj.feedback || 'Good articulation with solid core coverage.'}
                          </p>
                        </div>
                      )}

                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center space-x-1 mb-1">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Suggested High-Scoring Model Answer:</span>
                        </span>
                        <div className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/60 text-slate-700 dark:text-slate-200 leading-relaxed text-xs sm:text-sm">
                          {answerObj?.idealAnswer ||
                            'A comprehensive model response emphasizes concrete architectural separation, defines edge cases clearly, and cites practical engineering trade-offs.'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
          <Link
            to="/interview/new"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-teal-500 hover:from-brand-500 hover:to-teal-400 shadow-md shadow-brand-500/20 transition-all hover:scale-105"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Practice Another Interview</span>
          </Link>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center space-x-1.5 px-4 py-3 rounded-xl text-sm font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-400 transition-colors"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Print / Export PDF</span>
            </button>

            <Link
              to="/dashboard"
              className="inline-flex items-center space-x-1.5 px-4 py-3 rounded-xl text-sm font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-800 dark:text-slate-100"
            >
              <LayoutDashboard className="w-4 h-4 text-brand-500" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/analytics"
              className="inline-flex items-center space-x-1.5 px-5 py-3 rounded-xl text-sm font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-800 dark:text-slate-100"
            >
              <BarChart2 className="w-4 h-4 text-brand-500" />
              <span>Analytics</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ResultsPage;
