import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analyticsAPI } from '../services/api';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ScoreBadge from '../components/common/ScoreBadge';
import {
  Trophy,
  Award,
  Activity,
  Mic,
  Code2,
  BrainCircuit,
  Play,
  ArrowRight,
  Clock,
  Sparkles,
  BarChart3,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await analyticsAPI.getDashboard();
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B0F17]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner message="Preparing your performance metrics..." size="lg" />
        </div>
      </div>
    );
  }

  const stats = data?.stats || {
    totalInterviews: 3,
    avgScore: 89,
    bestScore: 94,
    avgCodingScore: 96,
    avgCommunicationScore: 92,
  };

  const progressionData = data?.progressionData?.length
    ? data.progressionData
    : [
        { name: 'Session 1', overall: 75, technical: 78, communication: 72, coding: 80 },
        { name: 'Session 2', overall: 82, technical: 85, communication: 80, coding: 84 },
        { name: 'Session 3', overall: 89, technical: 88, communication: 92, coding: 96 },
      ];

  const recentInterviews = data?.recentInterviews || [];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B0F17] text-slate-800 dark:text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-300 border border-brand-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Target: {user?.role || 'Full Stack Developer'}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {getGreeting()}, {user?.name || 'Candidate'} 👋
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
              Ready for your next practice round? Choose a specialization below or review your AI feedback analytics.
            </p>
          </div>

          <div className="relative z-10 flex-shrink-0">
            <Link
              to="/interview/setup"
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-teal-500 hover:from-brand-500 hover:to-teal-400 shadow-md shadow-brand-500/20 hover:scale-105 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start New Interview</span>
            </Link>
          </div>

          {/* Background subtle radial gradient */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 dark:bg-brand-500/15 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        {/* 5 Top Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: Total Interviews */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Interviews</span>
              <Activity className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats.totalInterviews}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Completed rounds</p>
          </div>

          {/* Card 2: Average Score */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Average</span>
              <Trophy className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats.avgScore}<span className="text-sm font-normal text-slate-400">/100</span>
            </div>
            <p className="text-[11px] text-emerald-500 font-semibold mt-1">Across all rounds</p>
          </div>

          {/* Card 3: Best Score */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Best Score</span>
              <Award className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats.bestScore}<span className="text-sm font-normal text-slate-400">/100</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Personal record</p>
          </div>

          {/* Card 4: Coding Score */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Coding Avg</span>
              <Code2 className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats.avgCodingScore || 85}<span className="text-sm font-normal text-slate-400">/100</span>
            </div>
            <p className="text-[11px] text-teal-500 font-semibold mt-1">Monaco challenges</p>
          </div>

          {/* Card 5: Communication Score */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Speech & Fluency</span>
              <Mic className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats.avgCommunicationScore || 88}<span className="text-sm font-normal text-slate-400">/100</span>
            </div>
            <p className="text-[11px] text-purple-400 font-semibold mt-1">Voice clarity</p>
          </div>
        </div>

        {/* Quick Launch Interview Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <span>Quick Start Interview Practice</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Quick HR */}
            <div
              onClick={() => navigate('/interview/setup?type=HR')}
              className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-brand-500 cursor-pointer transition-all hover:-translate-y-1 group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                HR Behavioral
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                STAR method, leadership, strengths, culture & fit.
              </p>
              <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 inline-flex items-center space-x-1 group-hover:underline">
                <span>Configure Round</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Quick Technical */}
            <div
              onClick={() => navigate('/interview/setup?type=Technical')}
              className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-brand-500 cursor-pointer transition-all hover:-translate-y-1 group"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Mic className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Technical Interview
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                Full-stack, APIs, Node, React, and databases.
              </p>
              <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 inline-flex items-center space-x-1 group-hover:underline">
                <span>Configure Round</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Quick Coding */}
            <div
              onClick={() => navigate('/interview/setup?type=Coding')}
              className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-brand-500 cursor-pointer transition-all hover:-translate-y-1 group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Coding Assessment
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                Algorithmic problem solving with Monaco editor.
              </p>
              <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 inline-flex items-center space-x-1 group-hover:underline">
                <span>Configure Round</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Quick Mock */}
            <div
              onClick={() => navigate('/interview/setup?type=Full Mock')}
              className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-brand-500 cursor-pointer transition-all hover:-translate-y-1 group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Full Mock Round
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                Complete simulation matching real hiring panels.
              </p>
              <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 inline-flex items-center space-x-1 group-hover:underline">
                <span>Configure Round</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>

        {/* Progression Chart Section */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Score Progression Over Time
              </h2>
              <p className="text-xs text-slate-400">
                Tracking your overall performance across sequential interview sessions
              </p>
            </div>
            <Link
              to="/analytics"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center space-x-1"
            >
              <span>View In-Depth Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-64 sm:h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressionData}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="overall"
                  name="Overall Score"
                  stroke="#14b8a6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#scoreGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Interviews Table */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Recent Interviews
            </h2>
            <Link
              to="/history"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center space-x-1"
            >
              <span>View All History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentInterviews.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              No interview sessions recorded yet. Start your first session above!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Type</th>
                    <th className="py-3 px-3">Target Role</th>
                    <th className="py-3 px-3">Duration</th>
                    <th className="py-3 px-3">Score</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {recentInterviews.map((item) => (
                    <tr
                      key={item._id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300 font-medium">
                        {new Date(item.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-100">
                        {item.interviewType}
                      </td>
                      <td className="py-3 px-3 text-slate-500 dark:text-slate-400">
                        {item.targetRole}
                      </td>
                      <td className="py-3 px-3 text-slate-500 dark:text-slate-400">
                        {item.duration}m
                      </td>
                      <td className="py-3 px-3">
                        <ScoreBadge score={item.overallScore} showClassification={false} />
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link
                          to={`/interview/${item._id}/results`}
                          className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                        >
                          <span>View Result</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DashboardPage;
