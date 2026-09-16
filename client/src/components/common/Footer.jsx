import React from 'react';
import { Mic, Heart, Cpu, ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-dark-bg/50 backdrop-blur-sm transition-colors py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-teal-400 flex items-center justify-center text-white">
                <Mic className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                Interview<span className="text-brand-500">AI</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              An intelligent, end-to-end interview practice simulator utilizing speech-to-text,
              generative language models, isolated code sandboxes, and deep analytics to prepare candidates
              for top-tier engineering roles.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                React 18 + Tailwind
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                Node.js REST API
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                MongoDB Atlas
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                OpenAI GPT-4o & Whisper
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                Monaco Code Editor
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
              Interview Categories
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>HR & Behavioral Simulation</li>
              <li>Full Stack & Technical Deep Dive</li>
              <li>Data Structures & Monaco Coding</li>
              <li>Comprehensive Mock Round</li>
            </ul>
          </div>

          {/* Project Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
              Project Specification
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              B.Tech Information Technology Capstone Project. Designed and engineered for production-grade evaluation, architectural elegance, and modern user experience.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-500 space-y-2 sm:space-y-0">
          <p>© {new Date().getFullYear()} InterviewAI. All rights reserved.</p>
          <p className="flex items-center space-x-1">
            <span>Built with precision for Engineering Placements</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
