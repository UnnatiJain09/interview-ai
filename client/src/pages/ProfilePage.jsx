import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Toast from '../components/common/Toast';
import {
  User,
  Mail,
  Briefcase,
  Award,
  Code2,
  FileText,
  Save,
  CheckCircle2,
  Sparkles,
  Layers,
} from 'lucide-react';

const ProfilePage = () => {
  const { user, updateUserProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [role, setRole] = useState(user?.role || 'Full Stack Developer');
  const [experience, setExperience] = useState(user?.experience || 'Fresher');
  const [skills, setSkills] = useState(user?.skills?.join(', ') || 'JavaScript, React, Node.js, MongoDB');
  const [preferredLanguage, setPreferredLanguage] = useState(user?.preferredLanguage || 'javascript');
  const [resumeSummary, setResumeSummary] = useState(user?.resumeSummary || '');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUserProfile({
        name,
        role,
        experience,
        skills,
        preferredLanguage,
        resumeSummary,
      });
      setToast({
        type: 'success',
        message: 'Profile settings updated successfully!',
      });
    } catch (err) {
      setToast({
        type: 'error',
        message: err.message || 'Failed to update profile.',
      });
    } finally {
      setSaving(false);
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
            <User className="w-3.5 h-3.5" />
            <span>Candidate Account Settings</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Profile & Career Preferences
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Keep your skills and target role updated so AI interviewers generate personalized questions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Email Address (Read Only)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Target Role
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800 dark:text-slate-100"
                >
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Software Developer">Software Developer</option>
                  <option value="Python Developer">Python Developer</option>
                  <option value="Java Developer">Java Developer</option>
                  <option value="Data Analyst">Data Analyst</option>
                  <option value="AI/ML Engineer">AI/ML Engineer</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Experience Level
              </label>
              <div className="relative">
                <Award className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800 dark:text-slate-100"
                >
                  <option value="Fresher">Fresher (Final Year / Graduate)</option>
                  <option value="1-2 years">1–2 years</option>
                  <option value="3-5 years">3–5 years</option>
                  <option value="Experienced">Experienced</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Preferred Coding Language
              </label>
              <div className="relative">
                <Code2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800 dark:text-slate-100"
                >
                  <option value="javascript">JavaScript (Node.js)</option>
                  <option value="python">Python 3</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Technical Skills (Comma separated)
              </label>
              <div className="relative">
                <Sparkles className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="React, Node.js, MongoDB, Python, Docker"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Resume Bio & Background Summary
            </label>
            <textarea
              rows={4}
              value={resumeSummary}
              onChange={(e) => setResumeSummary(e.target.value)}
              placeholder="Provide a brief summary of your academic background, major capstone projects, internships, and core technical proficiencies..."
              className="w-full p-4 rounded-xl text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800 dark:text-slate-100 placeholder-slate-400 resize-none leading-relaxed"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-teal-500 hover:from-brand-500 hover:to-teal-400 shadow-md shadow-brand-500/20 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
