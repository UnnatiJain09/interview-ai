import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsAPI } from '../services/api';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ScoreBadge from '../components/common/ScoreBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  Clock,
  Filter,
  ArrowUpDown,
  ArrowRight,
  Calendar,
  Layers,
  Award,
  Search,
} from 'lucide-react';

const HistoryPage = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSort, setSelectedSort] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await analyticsAPI.getHistory({
          type: selectedType,
          sort: selectedSort,
        });
        if (res.data.success) {
          setInterviews(res.data.interviews);
        }
      } catch (err) {
        console.error('Failed to load interview history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [selectedType, selectedSort]);

  const filteredInterviews = interviews.filter((item) =>
    item.targetRole?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.interviewType?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B0F17] text-slate-800 dark:text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-300 border border-brand-500/20">
            <Clock className="w-3.5 h-3.5" />
            <span>Practice Session Archive</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Interview History & Reports
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Access complete transcripts, score breakdowns, and recommendations from past interview rounds.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
            {['all', 'Technical', 'HR', 'Coding', 'Full Mock'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedType === type
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {type === 'all' ? 'All Types' : type}
              </button>
            ))}
          </div>

          {/* Search & Sort */}
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search role..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500 text-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="flex items-center space-x-1.5 text-xs text-slate-400">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs rounded-xl px-2.5 py-1.5 text-slate-700 dark:text-slate-200 focus:outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="score_high">Highest Score</option>
                <option value="score_low">Lowest Score</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* History List Table / Empty State */}
        {loading ? (
          <div className="py-16">
            <LoadingSpinner message="Loading historical sessions..." />
          </div>
        ) : filteredInterviews.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <Clock className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No Interview Records Found
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You haven't completed any sessions matching this criteria yet.
            </p>
            <Link
              to="/interview/setup"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 transition-all mt-2"
            >
              <span>Configure First Interview</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="glass-panel rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px] bg-slate-50/50 dark:bg-slate-900/50">
                    <th className="py-4 px-4">Date</th>
                    <th className="py-4 px-4">Category</th>
                    <th className="py-4 px-4">Target Role</th>
                    <th className="py-4 px-4">Difficulty</th>
                    <th className="py-4 px-4">Duration</th>
                    <th className="py-4 px-4">Overall Score</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredInterviews.map((item) => (
                    <tr
                      key={item._id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-4 px-4 text-slate-600 dark:text-slate-300 font-medium">
                        {new Date(item.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-4 px-4 font-semibold text-slate-900 dark:text-white">
                        {item.interviewType}
                      </td>
                      <td className="py-4 px-4 text-slate-500 dark:text-slate-400">
                        {item.targetRole}
                      </td>
                      <td className="py-4 px-4">
                        <span className="capitalize px-2 py-0.5 rounded-md text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                          {item.difficulty}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-500 dark:text-slate-400">
                        {item.duration} mins
                      </td>
                      <td className="py-4 px-4">
                        <ScoreBadge score={item.overallScore} showClassification={false} />
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Link
                          to={`/interview/${item._id}/results`}
                          className="inline-flex items-center space-x-1 px-3 py-1 rounded-xl text-xs font-semibold text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/50 transition-colors"
                        >
                          <span>View Report</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default HistoryPage;
