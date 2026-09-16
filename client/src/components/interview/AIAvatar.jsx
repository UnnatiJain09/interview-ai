import React, { useState, useEffect } from 'react';
import { Bot, Volume2, VolumeX, Sparkles } from 'lucide-react';

const AIAvatar = ({
  name = 'Sarah (AI Lead Interviewer)',
  status = 'listening', // 'speaking', 'listening', 'evaluating'
  currentQuestionText = '',
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSupported(true);
    }
  }, []);

  const speakQuestion = () => {
    if (!speechSupported || !currentQuestionText) return;

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(currentQuestionText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    // Pick a natural English voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(
      (v) => (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.lang === 'en-US') && !v.name.includes('Bad')
    );
    if (naturalVoice) utterance.voice = naturalVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Status badges
  const statusConfig = {
    speaking: { text: 'Speaking Question', color: 'bg-emerald-500', pulse: true },
    listening: { text: 'Listening to Candidate', color: 'bg-teal-500', pulse: false },
    evaluating: { text: 'Evaluating Answer with AI...', color: 'bg-amber-500', pulse: true },
  };

  const currentStatus = isSpeaking ? statusConfig.speaking : (statusConfig[status] || statusConfig.listening);

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center relative overflow-hidden border border-slate-200/80 dark:border-slate-800">
      {/* Background glow orb */}
      <div className="absolute -top-10 -right-10 w-36 h-36 bg-brand-500/10 dark:bg-brand-500/15 rounded-full blur-2xl pointer-events-none"></div>

      {/* Avatar Graphic with Animated Speaking Rings */}
      <div className="relative mb-4">
        {/* Outer pulse ring when speaking or evaluating */}
        {(isSpeaking || status === 'evaluating') && (
          <div className="absolute -inset-2.5 rounded-full bg-gradient-to-r from-brand-500 to-teal-400 opacity-40 animate-ping"></div>
        )}

        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-brand-600 via-teal-500 to-emerald-400 p-1 shadow-lg shadow-brand-500/25 flex items-center justify-center relative">
          <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
            <Bot className="w-12 h-12 text-teal-300" />
          </div>
        </div>

        {/* Dynamic sound wave overlay */}
        {isSpeaking && (
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center space-x-1 bg-slate-900/90 px-2 py-0.5 rounded-full border border-teal-500/40">
            <span className="w-1 h-3 bg-brand-400 rounded animate-soundwave"></span>
            <span className="w-1 h-5 bg-teal-300 rounded animate-soundwave" style={{ animationDelay: '0.2s' }}></span>
            <span className="w-1 h-2.5 bg-emerald-400 rounded animate-soundwave" style={{ animationDelay: '0.4s' }}></span>
          </div>
        )}
      </div>

      {/* Interviewer Info */}
      <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center justify-center space-x-1.5">
        <span>{name}</span>
        <Sparkles className="w-4 h-4 text-brand-500" />
      </h3>

      {/* Status Pill */}
      <div className="mt-2 inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300">
        <span className={`w-2 h-2 rounded-full ${currentStatus.color} ${currentStatus.pulse ? 'animate-ping' : ''}`}></span>
        <span>{currentStatus.text}</span>
      </div>

      {/* Audio Synthesis Play/Stop Button */}
      {speechSupported && (
        <button
          onClick={speakQuestion}
          className={`mt-4 inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
            isSpeaking
              ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-brand-500 shadow-sm'
          }`}
        >
          {isSpeaking ? (
            <>
              <VolumeX className="w-3.5 h-3.5" />
              <span>Stop Audio</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-brand-500" />
              <span>Hear AI Question</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default AIAvatar;
