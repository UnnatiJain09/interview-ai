import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  TrendingUp,
  Sparkles,
  BarChart2,
  Award,
  ShieldCheck,
  CheckCircle2,
  Target,
  Layers,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
} from 'recharts';

const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await analyticsAPI.getPerformance();
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load performance analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B0F17]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner message="Calculating competency radar & skill trajectories..." size="lg" />
        </div>
      </div>
    );
  }

  const timeline = data?.timeline || [
    { interview: 'Int 1', date: 'Day 1', overallScore: 72, technicalScore: 75, communicationScore: 70, codingScore: 78 },
    { interview: 'Int 2', date: 'Day 3', overallScore: 80, technicalScore: 82, communicationScore: 78, codingScore: 85 },
    { interview: 'Int 3', date: 'Day 5', overallScore: 89, technicalScore: 88, communicationScore: 92, codingScore: 94 },
  ];

  const radarData = data?.radarData || [
    { subject: 'Technical Depth', A: 88, fullMark: 100 },
    { subject: 'Communication', A: 92, fullMark: 100 },
    { subject: 'Relevance', A: 90, fullMark: 100 },
    { subject: 'Clarity', A: 85, fullMark: 100 },
    { subject: 'Grammar', A: 94, fullMark: 100 },
    { subject: 'Coding / Problem Solving', A: 96, fullMark: 100 },
  ];

  const typeBreakdown = data?.typeBreakdown || [];
  const insights = data?.insights || [
    'Your communication score improved by 14% across your last 3 interview attempts.',
    'Technical architecture and problem solving are your highest performing areas (90+/100).',
    'Focus on refining structured answers using the STAR method for behavioral questions.',
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B0F17] text-slate-800 dark:text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-300 border border-brand-500/20">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Multi-Dimensional Competency Analytics</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Performance Dashboard & Insights
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Track historical score evolutions, radar competency maps, and personalized improvement recommendations.
          </p>
        </div>

        {/* AI Actionable Insights Banner */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-brand-500/30 bg-gradient-to-r from-brand-500/5 via-teal-500/5 to-emerald-500/5 space-y-4">
          <div className="flex items-center space-x-2 text-brand-600 dark:text-brand-400 font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>AI Placement Readiness Insights</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insights.map((insight, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed flex items-start space-x-2.5"
              >
                <CheckCircle2 className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                <span>{insight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Grid: Charts (Radar & Multi-Line Timeline) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Radar Chart (5 cols) */}
          <div className="lg:col-span-5 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Skill Competency Radar
              </h3>
              <p className="text-xs text-slate-400">
                Evaluation across 6 core interview dimensions
              </p>
            </div>

            <div className="h-72 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="#334155" opacity={0.4} />
                  <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#64748b" fontSize={10} />
                  <Radar
                    name="Candidate Mastery"
                    dataKey="A"
                    stroke="#14b8a6"
                    fill="#14b8a6"
                    fillOpacity={0.4}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Longitudinal Trend Chart (7 cols) */}
          <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Multi-Metric Performance Evolution
              </h3>
              <p className="text-xs text-slate-400">
                Tracking technical, communication, and coding scores over sequential sessions
              </p>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                  <YAxis domain={[40, 100]} stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="overallScore"
                    name="Overall"
                    stroke="#14b8a6"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="technicalScore"
                    name="Technical"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="communicationScore"
                    name="Communication"
                    stroke="#a855f7"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="codingScore"
                    name="Coding"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Category Breakdown Cards */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Category-Wise Performance Averages
            </h3>
            <p className="text-xs text-slate-400">
              Comparative review across all distinct round formats
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {typeBreakdown.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {item.type}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    {item.count} sessions
                  </span>
                </div>
                <div className="text-3xl font-extrabold text-brand-500 font-mono">
                  {item.averageScore || 80}<span className="text-sm font-normal text-slate-400">/100</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-brand-500 h-full rounded-full"
                    style={{ width: `${item.averageScore || 80}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AnalyticsPage;
