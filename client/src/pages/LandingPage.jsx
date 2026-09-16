import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Mic,
  Bot,
  Code2,
  BarChart3,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Award,
  Zap,
  Layers,
  Users,
  Play,
} from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B0F17] text-slate-800 dark:text-slate-100">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Glow ambient backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-500/20 to-teal-400/10 blur-[130px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Announcement Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-300 border border-brand-500/20 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-brand-500" />
              <span>Next-Gen Engineering Interview Simulator</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Your AI-Powered Personal{' '}
              <span className="bg-gradient-to-r from-brand-500 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
                Interview Coach
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Master technical, HR, and algorithmic coding rounds. Practice with realistic AI voice interviewers powered by Whisper speech recognition and receive comprehensive multi-metric evaluations.
            </p>

            {/* Hero Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl text-base font-bold text-white bg-gradient-to-r from-brand-600 to-teal-500 hover:from-brand-500 hover:to-teal-400 shadow-lg shadow-brand-500/25 transition-all hover:scale-105 active:scale-95"
              >
                <span>Open Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                to="/demo"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 rounded-xl text-base font-semibold text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:scale-105"
              >
                <Zap className="w-5 h-5 text-amber-500" />
                <span>Instant Demo Preview</span>
              </Link>
            </div>
          </div>

          {/* Interactive Simulation Dashboard Mockup (Clickable -> /demo) */}
          <Link
            to="/demo"
            className="block mt-14 max-w-5xl mx-auto rounded-2xl border border-slate-200/80 dark:border-slate-800/80 glass-panel shadow-2xl overflow-hidden group hover:border-brand-500/50 transition-all cursor-pointer"
            title="Click to launch interactive demo"
          >
            <div className="px-4 py-3 bg-slate-100/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span className="ml-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                  interview-room.ai/session/full-stack-round
                </span>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-brand-600 dark:text-brand-400 font-medium group-hover:underline">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping"></span>
                <span>Active Voice Assessment • Click to Try Demo</span>
              </div>
            </div>

            <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              {/* Left Interviewer Avatar */}
              <div className="flex flex-col items-center text-center p-5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-brand-600 to-teal-400 p-1 mb-3">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                    <Bot className="w-10 h-10 text-teal-300" />
                  </div>
                </div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                  Sarah • Lead AI Interviewer
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">Full Stack Engineering Specialist</p>
                <div className="mt-3 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Click to launch interactive room
                </div>
              </div>

              {/* Center & Right Question & Response Preview */}
              <div className="lg:col-span-2 space-y-4">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/70 shadow-sm">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                    Question 2 of 5 • Technical Round
                  </span>
                  <p className="text-base font-semibold text-slate-900 dark:text-white mt-1">
                    "Explain how Node.js manages non-blocking asynchronous I/O via the Event Loop and libuv thread pool."
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                      <Mic className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                      <span>Transcribed Voice Response (Whisper API)</span>
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      Confidence: 94%
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-mono">
                    "Node.js executes synchronous code on the call stack, while delegating asynchronous tasks to the libuv worker pool..."
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Core Features Grid */}
      <section id="features" className="py-20 border-t border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              Cutting-Edge Capabilities
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Engineered for Placement Excellence
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Everything you need to transform anxiety into confidence and secure top software engineering offers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Link
              to="/interview/new?type=Technical"
              className="glass-panel p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-brand-500/50 transition-all hover:-translate-y-1 block group"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-brand-500 transition-colors">
                Dynamic AI Interviewer
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Adaptive question generation powered by GPT-4o. The AI listens to your responses and asks real-time follow-up probes just like a senior tech lead.
              </p>
            </Link>

            {/* Feature 2 */}
            <Link
              to="/demo"
              className="glass-panel p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-brand-500/50 transition-all hover:-translate-y-1 block group"
            >
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Mic className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-brand-500 transition-colors">
                Voice Interviews & Whisper STT
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Speak answers naturally. OpenAI Whisper converts speech into high-precision transcripts while analyzing fluency, clarity, and articulation.
              </p>
            </Link>

            {/* Feature 3 */}
            <Link
              to="/coding"
              className="glass-panel p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-brand-500/50 transition-all hover:-translate-y-1 block group"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Code2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-brand-500 transition-colors">
                Monaco Coding Arena
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Solve algorithmic challenges in a professional VS Code-like Monaco editor. Executes against unit test cases in safe sandboxes with Big-O time/space evaluation.
              </p>
            </Link>

            {/* Feature 4 */}
            <Link
              to="/analytics"
              className="glass-panel p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-brand-500/50 transition-all hover:-translate-y-1 block group"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-brand-500 transition-colors">
                8-Metric Answer Evaluation
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Detailed breakdowns for Relevance, Accuracy, Completeness, Clarity, Grammar, Technical Knowledge, Strengths, Weaknesses, and model Ideal Answers.
              </p>
            </Link>

            {/* Feature 5 */}
            <Link
              to="/analytics"
              className="glass-panel p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-brand-500/50 transition-all hover:-translate-y-1 block group"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-brand-500 transition-colors">
                Progress Analytics & History
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Track your trajectory with interactive Recharts timelines and skill radar charts. Measure improvement percentages across sequential interview attempts.
              </p>
            </Link>

            {/* Feature 6 */}
            <Link
              to="/dashboard"
              className="glass-panel p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-brand-500/50 transition-all hover:-translate-y-1 block group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-brand-500 transition-colors">
                Secure Full-Stack Architecture
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                JWT authentication, bcrypt password hashing, input validation, and sandboxed code execution engineered to commercial standards.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 border-t border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              Intuitive Workflow
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              From Practice to Offer in 5 Steps
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {[
              { step: '01', title: 'Choose Interview', desc: 'Select HR, Technical, Coding, or Full Mock round.', link: '/interview/new' },
              { step: '02', title: 'Answer Dynamically', desc: 'Speak naturally via microphone or type in editor.', link: '/demo' },
              { step: '03', title: 'Whisper Converts', desc: 'Speech is converted to text with high fidelity.', link: '/demo' },
              { step: '04', title: 'AI Evaluates', desc: 'GPT analyzes relevance, depth, clarity & grammar.', link: '/analytics' },
              { step: '05', title: 'Review & Improve', desc: 'Get actionable suggestions, ideal answers & analytics.', link: '/dashboard' },
            ].map((item, idx) => (
              <Link
                key={idx}
                to={item.link}
                className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 relative flex flex-col justify-between hover:border-brand-500/50 transition-all hover:-translate-y-1 block"
              >
                <div className="text-2xl font-black text-brand-500/40 font-mono mb-2">
                  {item.step}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Interview Types Showcase */}
      <section id="interview-types" className="py-20 border-t border-slate-200/60 dark:border-slate-800/60 bg-white/30 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              Role Specializations
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Tailored for Every Interview Round
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: HR */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 mb-3">
                  Behavioral
                </span>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  HR & Culture Fit
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                  Master classic questions: Tell me about yourself, strengths & weaknesses, handling pressure, and STAR method team conflict scenarios.
                </p>
              </div>
              <Link
                to="/interview/new?type=HR"
                className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center space-x-1"
              >
                <span>Practice HR Round</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 2: Technical */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300 mb-3">
                  Architecture
                </span>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  Technical Deep-Dive
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                  Full Stack, Frontend, Backend, Python, Java, and Database architecture. Dynamic probing into trade-offs and real-world system bottlenecks.
                </p>
              </div>
              <Link
                to="/interview/new?type=Technical"
                className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center space-x-1"
              >
                <span>Practice Technical Round</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 3: Coding */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 mb-3">
                  Algorithms
                </span>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  Monaco Coding Round
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                  Data structure and algorithmic problem solving. Interactive code runner with automated test cases and AI Big-O complexity audits.
                </p>
              </div>
              <Link
                to="/coding"
                className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center space-x-1"
              >
                <span>Practice Coding Arena</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 4: Full Mock */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 mb-3">
                  Comprehensive
                </span>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  Full Mock Simulation
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                  Simulate real-world hiring loops combining behavioral questions, technical scrutiny, and live coding problems in one continuous session.
                </p>
              </div>
              <Link
                to="/interview/new?type=Full Mock"
                className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center space-x-1"
              >
                <span>Start Full Mock Round</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 border-t border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-brand-500 font-mono">10+</p>
              <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                Role Specializations
              </p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-teal-400 font-mono">8</p>
              <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                Evaluation Dimensions
              </p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-500 font-mono">100%</p>
              <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                Voice & Whisper Enabled
              </p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-purple-400 font-mono">Real-Time</p>
              <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                AI Feedback & Insights
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
