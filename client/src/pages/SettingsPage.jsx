import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Toast from '../components/common/Toast';
import {
  Settings,
  Sun,
  Moon,
  Volume2,
  Sliders,
  Shield,
  Trash2,
  Save,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();

  const [voiceRate, setVoiceRate] = useState(
    () => localStorage.getItem('interviewai_voice_rate') || '1.0'
  );
  const [defaultMode, setDefaultMode] = useState(
    () => localStorage.getItem('interviewai_default_mode') || 'voice'
  );
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [toast, setToast] = useState(null);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('interviewai_voice_rate', voiceRate);
    localStorage.setItem('interviewai_default_mode', defaultMode);
    setToast({
      type: 'success',
      message: 'Preferences saved successfully!',
    });
  };

  const handleResetStorage = () => {
    if (window.confirm('Reset all cached preferences and return to defaults?')) {
      localStorage.removeItem('interviewai_voice_rate');
      localStorage.removeItem('interviewai_default_mode');
      setVoiceRate('1.0');
      setDefaultMode('voice');
      setToast({
        type: 'info',
        message: 'Settings reset to default values.',
      });
    }
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

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-300 border border-brand-500/20">
            <Settings className="w-3.5 h-3.5" />
            <span>Platform Configuration</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            System & Simulator Settings
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Customize appearance, speech synthesis voice speed, and interview defaults.
          </p>
        </div>

        <form onSubmit={handleSave} className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
          {/* Appearance Section */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <span>1. Appearance & Theme</span>
            </h3>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">
                  Color Mode: {theme === 'dark' ? 'Dark Theme' : 'Light Theme'}
                </span>
                <span className="text-xs text-slate-400">
                  Select between sleek dark aesthetics or crisp light mode
                </span>
              </div>

              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-brand-500 transition-colors"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span>Switch to Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-slate-600" />
                    <span>Switch to Dark</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI Voice & Audio Section */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <span>2. Audio & Speech Synthesis</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  AI Interviewer Speech Rate: {voiceRate}x
                </label>
                <input
                  type="range"
                  min="0.75"
                  max="1.25"
                  step="0.05"
                  value={voiceRate}
                  onChange={(e) => setVoiceRate(e.target.value)}
                  className="w-full accent-brand-500"
                />
                <span className="text-[11px] text-slate-400 block">
                  Speed at which the AI interviewer reads aloud questions.
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Default Candidate Response Mode
                </label>
                <select
                  value={defaultMode}
                  onChange={(e) => setDefaultMode(e.target.value)}
                  className="w-full p-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100"
                >
                  <option value="voice">Voice (Microphone & Whisper STT)</option>
                  <option value="text">Text (Direct keyboard typing)</option>
                </select>
                <span className="text-[11px] text-slate-400 block">
                  Preferred interaction format when launching new sessions.
                </span>
              </div>
            </div>
          </div>

          {/* Reset Cache */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleResetStorage}
              className="inline-flex items-center space-x-1.5 text-xs text-rose-500 hover:underline"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Local Preferences</span>
            </button>

            <button
              type="submit"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-teal-500 hover:from-brand-500 hover:to-teal-400 shadow-md shadow-brand-500/20 transition-all hover:scale-[1.02]"
            >
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default SettingsPage;
