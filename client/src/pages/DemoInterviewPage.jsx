import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import AIAvatar from '../components/interview/AIAvatar';
import QuestionCard from '../components/interview/QuestionCard';
import AudioRecorder from '../components/interview/AudioRecorder';
import TranscriptBox from '../components/interview/TranscriptBox';
import Toast from '../components/common/Toast';
import {
  Clock,
  Sparkles,
  PhoneOff,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Zap,
} from 'lucide-react';

const DEMO_QUESTIONS = [
  {
    _id: 'demo-q1',
    question:
      'Explain how the Event Loop works in Node.js, and how asynchronous non-blocking I/O operations are handled using libuv.',
    difficulty: 'Medium',
    type: 'technical',
    expectedTopics: ['Call Stack', 'Libuv Thread Pool', 'Microtasks vs Macrotasks', 'Event Queue'],
  },
  {
    _id: 'demo-q2',
    question:
      'Describe the difference between Client-Side Rendering (CSR) and Server-Side Rendering (SSR) in React, and how hydration impacts First Contentful Paint.',
    difficulty: 'Medium',
    type: 'technical',
    expectedTopics: ['Hydration', 'First Contentful Paint (FCP)', 'SEO Impact', 'Bundle Size'],
  },
  {
    _id: 'demo-q3',
    question:
      'Tell me about a challenging technical bug or performance bottleneck you encountered in a web application. How did you diagnose and resolve it?',
    difficulty: 'Hard',
    type: 'technical',
    expectedTopics: ['STAR Method', 'Profiling Tools', 'Root Cause Analysis', 'Quantifiable Impact'],
  },
];

const DemoInterviewPage = () => {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState(DEMO_QUESTIONS);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answerText, setAnswerText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluatingStatus, setEvaluatingStatus] = useState('listening');
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [toast, setToast] = useState(null);
  const [evaluationHistory, setEvaluationHistory] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentQuestion = questions[currentIdx] || questions[0];

  const handleTranscription = (text) => {
    setAnswerText(text);
    setToast({
      type: 'info',
      message: 'Speech transcribed successfully! You can review or edit before submitting.',
    });
  };

  const handleSubmitAnswer = () => {
    if (!answerText.trim()) return;

    setIsSubmitting(true);
    setEvaluatingStatus('evaluating');

    setTimeout(() => {
      const words = answerText.trim().split(/\s+/).length;
      const score = Math.min(95, Math.max(72, 75 + (words > 25 ? 12 : 5)));

      const evalData = {
        questionId: currentQuestion._id,
        score,
        relevance: 88,
        accuracy: 85,
        communication: 90,
        clarity: 87,
        feedback: `Great technical breakdown! Your explanation of ${currentQuestion.expectedTopics[0]} and non-blocking mechanics was articulate and well-structured.`,
      };

      setEvaluationHistory((prev) => [...prev, evalData]);
      setIsSubmitting(false);
      setEvaluatingStatus('listening');

      setToast({
        type: 'success',
        message: `AI Evaluation: ${score}/100! (Relevance: 88, Clarity: 87, Accuracy: 85)`,
      });

      // If on question 1, dynamically inject follow-up probe
      if (currentIdx === 0 && questions.length === 3) {
        const followUpQ = {
          _id: 'demo-q-followup',
          question:
            'Follow-up Probe: You mentioned the worker thread pool in libuv. How do CPU-intensive tasks affect event loop latency, and what architecture would you use to offload them?',
          difficulty: 'Hard',
          type: 'follow-up',
          expectedTopics: ['Worker Threads', 'Child Processes', 'Cluster Module', 'Redis Queues'],
        };
        setQuestions([questions[0], followUpQ, questions[1], questions[2]]);
        setCurrentIdx(1);
        setAnswerText('');
      } else if (currentIdx + 1 < questions.length) {
        setCurrentIdx((prev) => prev + 1);
        setAnswerText('');
      } else {
        handleCompleteDemo();
      }
    }, 1200);
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
      setAnswerText('');
    } else {
      handleCompleteDemo();
    }
  };

  const handleCompleteDemo = () => {
    // Navigate to results page with mock session id
    navigate('/history');
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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

      {/* Demo Mode Notice Header */}
      <div className="border-b border-teal-500/20 bg-teal-500/10 dark:bg-teal-950/40 backdrop-blur-md sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse"></span>
            <span className="font-bold text-teal-700 dark:text-teal-300">
              Interactive Demo Simulation
            </span>
            <span className="hidden sm:inline text-teal-600/70 dark:text-teal-400/70">
              — Full-Stack Engineer Mock Session with Speech Recognition & AI Evaluation
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-white/80 dark:bg-slate-800/80 font-mono font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
              <Clock className="w-3.5 h-3.5 text-brand-500" />
              <span>{formatTimer(timeLeft)}</span>
            </div>

            <button
              onClick={handleCompleteDemo}
              className="inline-flex items-center space-x-1 px-3 py-1 rounded-xl font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 transition-colors"
            >
              <PhoneOff className="w-3.5 h-3.5" />
              <span>Finish Demo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Room Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: AI Interviewer */}
          <div className="lg:col-span-4 space-y-6">
            <AIAvatar
              name="Sarah • AI Lead Interviewer"
              status={evaluatingStatus}
              currentQuestionText={currentQuestion.question}
            />

            <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                <Zap className="w-3.5 h-3.5 text-brand-500" />
                <span>Demo Session Status</span>
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Questions Progress:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {currentIdx + 1} / {questions.length}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Target Role:</span>
                  <span className="font-semibold text-brand-500">Full Stack Developer</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Evaluation Mode:</span>
                  <span className="font-semibold text-emerald-500">Instant AI Feedback</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Candidate Interaction */}
          <div className="lg:col-span-8 space-y-6">
            <QuestionCard
              questionNumber={currentIdx + 1}
              totalQuestions={questions.length}
              questionText={currentQuestion.question}
              difficulty={currentQuestion.difficulty}
              type={currentQuestion.type}
              expectedTopics={currentQuestion.expectedTopics}
            />

            {/* Audio Recorder */}
            <AudioRecorder
              onTranscriptionComplete={handleTranscription}
              disabled={isSubmitting}
            />

            {/* Transcript & Text Box */}
            <TranscriptBox
              answerText={answerText}
              setAnswerText={setAnswerText}
              onSubmit={handleSubmitAnswer}
              onSkip={handleNextQuestion}
              isSubmitting={isSubmitting}
              mode="voice"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DemoInterviewPage;
