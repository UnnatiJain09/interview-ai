import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mic, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/common/Navbar';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B0F17] text-slate-800 dark:text-slate-100">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-teal-400 mx-auto flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                <Mic className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Reset Password
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Enter your email address and we'll send password recovery instructions.
              </p>
            </div>

            {sent ? (
              <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                  Recovery Email Sent
                </h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-400">
                  If an account exists for <span className="font-semibold">{email}</span>, you will receive a reset link shortly.
                </p>
                <Link
                  to="/login"
                  className="inline-block mt-2 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  Return to Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@college.edu"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-teal-500 hover:from-brand-500 hover:to-teal-400 shadow-md shadow-brand-500/20 transition-all hover:scale-[1.01]"
                >
                  <span>Send Reset Instructions</span>
                </button>

                <div className="text-center pt-2">
                  <Link
                    to="/login"
                    className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Login</span>
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
