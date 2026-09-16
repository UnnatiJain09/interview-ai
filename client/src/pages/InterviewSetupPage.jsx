import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { interviewAPI } from '../services/api';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import {
  Play,
  Briefcase,
  Layers,
  Flame,
  Clock,
  HelpCircle,
  Mic,
  FileText,
  Code2,
  Sparkles,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

const InterviewSetupPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialType = searchParams.get('type') || 'Technical';

  const [formData, setFormData] = useState({
    interviewType: initialType,
    targetRole: user?.role || 'Full Stack Developer',
    difficulty: 'Medium',
    duration: 20,
    questionCount: 5,
    mode: 'voice',
    preferredLanguage: user?.preferredLanguage || 'javascript',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam) {
      setFormData((prev) => ({ ...prev, interviewType: typeParam }));
    }
  }, [searchParams]);

  const handleStart = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Create interview configuration via API
      const createRes = await interviewAPI.create(formData);
      const interview = createRes.data.interview;

      // 2. Start session and generate initial question
      await interviewAPI.start(interview._id);

      // 3. Navigate to interview room
      if (formData.interviewType === 'Coding') {
        navigate(`/interview/${interview._id}/coding`);
      } else {
        navigate(`/interview/${interview._id}`);
      }
    } catch (err) {
      console.warn('API error during interview initialization, using resilient fallback:', err.message);
      // Fallback session to prevent blocking user
      const fallbackId = 'session_' + Date.now();
      sessionStorage.setItem('interviewai_current_session', JSON.stringify({
        _id: fallbackId,
        ...formData,
        status: 'in-progress',
        createdAt: new Date().toISOString(),
      }));

      if (formData.interviewType === 'Coding') {
        navigate(`/coding`);
      } else {
        navigate(`/interview/${fallbackId}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B0F17] text-slate-800 dark:text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="space-y-2 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-300 border border-brand-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Simulator Setup</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Configure Your Interview Session
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Customize role targets, difficulty, duration, and question mode to practice realistically.
          </p>
        </div>

        {error && (
          <div className="flex items-start space-x-2.5 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300 text-xs sm:text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleStart} className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
          {/* 1. Interview Type Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-900 dark:text-white">
              1. Interview Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'HR', label: 'HR Behavioral', desc: 'Culture & STAR method' },
                { id: 'Technical', label: 'Technical', desc: 'System design & stack' },
                { id: 'Coding', label: 'Coding Assessment', desc: 'Monaco algorithmic test' },
                { id: 'Full Mock', label: 'Full Mock Round', desc: 'Comprehensive hiring loop' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, interviewType: item.id })}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    formData.interviewType === item.id
                      ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40 ring-2 ring-brand-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-sm text-slate-900 dark:text-white mb-0.5">
                    {item.label}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {item.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Target Role & Difficulty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
                2. Target Engineering Role
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <select
                  value={formData.targetRole}
                  onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800 dark:text-slate-100"
                >
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="Software Developer">Software Developer</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Python Developer">Python Developer</option>
                  <option value="Java Developer">Java Developer</option>
                  <option value="AI/ML Engineer">AI/ML Engineer</option>
                  <option value="Data Analyst">Data Analyst</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
                3. Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Easy', 'Medium', 'Hard'].map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setFormData({ ...formData, difficulty: diff })}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      formData.difficulty === diff
                        ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Duration & Question Count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
                4. Session Duration
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[10, 20, 30].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setFormData({ ...formData, duration: mins })}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      formData.duration === mins
                        ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {mins} min
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
                5. Number of Questions
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[5, 10, 15].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setFormData({ ...formData, questionCount: count })}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      formData.questionCount === count
                        ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {count} Questions
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Answer Mode (Voice vs Text) & Coding Language */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
                6. Answer Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, mode: 'voice' })}
                  className={`p-3 rounded-xl border flex items-center space-x-2 text-xs font-semibold transition-all ${
                    formData.mode === 'voice'
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Mic className="w-4 h-4 text-rose-500" />
                  <span>Voice (Whisper STT)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, mode: 'text' })}
                  className={`p-3 rounded-xl border flex items-center space-x-2 text-xs font-semibold transition-all ${
                    formData.mode === 'text'
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <FileText className="w-4 h-4 text-brand-500" />
                  <span>Text Mode</span>
                </button>
              </div>
            </div>

            {(formData.interviewType === 'Coding' || formData.interviewType === 'Full Mock') && (
              <div>
                <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
                  7. Programming Language
                </label>
                <div className="relative">
                  <Code2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <select
                    value={formData.preferredLanguage}
                    onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800 dark:text-slate-100"
                  >
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Start Interview Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-brand-600 to-teal-500 hover:from-brand-500 hover:to-teal-400 shadow-xl shadow-brand-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>{loading ? 'Initializing AI Interviewer...' : 'Start Interview'}</span>
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default InterviewSetupPage;
