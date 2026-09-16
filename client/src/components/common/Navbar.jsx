import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Mic,
  Sun,
  Moon,
  User,
  Settings,
  LogOut,
  LayoutDashboard,
  Play,
  BarChart2,
  Clock,
  Code2,
  Sparkles,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout, demoLogin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDemo = async () => {
    try {
      await demoLogin();
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      navigate('/demo');
    }
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
      isActive
        ? 'bg-brand-500/10 text-brand-600 dark:text-brand-300 font-bold border border-brand-500/20 shadow-sm'
        : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
    }`;

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Interview<span className="text-brand-500">AI</span>
              </span>
              <span className="hidden sm:block text-[10px] font-medium tracking-wider uppercase text-slate-400 dark:text-slate-500">
                Practice. Perform. Improve.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            <NavLink to="/dashboard" className={navLinkClass}>
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </NavLink>

            <NavLink to="/interview/new" className={navLinkClass}>
              <Play className="w-4 h-4" />
              <span>New Interview</span>
            </NavLink>

            <NavLink to="/coding" className={navLinkClass}>
              <Code2 className="w-4 h-4" />
              <span>Coding</span>
            </NavLink>

            <NavLink to="/analytics" className={navLinkClass}>
              <BarChart2 className="w-4 h-4" />
              <span>Analytics</span>
            </NavLink>

            <NavLink to="/history" className={navLinkClass}>
              <Clock className="w-4 h-4" />
              <span>History</span>
            </NavLink>

            <NavLink
              to="/demo"
              className={({ isActive }) =>
                `flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-teal-500 text-white shadow-sm'
                    : 'bg-teal-500/10 text-teal-600 dark:text-teal-400 hover:bg-teal-500/20 border border-teal-500/30'
                }`
              }
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Demo Room</span>
            </NavLink>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-3">
            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle color theme"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600" />
              )}
            </button>

            {/* Profile Dropdown or Auth Buttons */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center space-x-2 p-1.5 pl-3 rounded-full border border-slate-200 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-500 transition-colors bg-white/50 dark:bg-slate-800/50"
                >
                  <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 max-w-[110px] truncate">
                    {user?.name || 'Alex Morgan'}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-teal-400 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {user?.name?.charAt(0) || 'A'}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu: Profile, Settings, Logout */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Signed in as
                      </p>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {user?.email || 'demo@interviewai.com'}
                      </p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center space-x-2.5 px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors"
                    >
                      <User className="w-4 h-4 text-brand-500" />
                      <span>Profile</span>
                    </Link>

                    <Link
                      to="/settings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center space-x-2.5 px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span>Settings</span>
                    </Link>

                    <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2.5 px-4 py-2.5 text-xs sm:text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleDemo}
                  className="hidden sm:inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-bold rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 hover:bg-brand-500/20 border border-brand-500/30 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Try Demo</span>
                </button>
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs sm:text-sm font-bold rounded-xl bg-gradient-to-r from-brand-600 to-teal-500 hover:from-brand-500 hover:to-teal-400 text-white shadow-md shadow-brand-500/20 transition-all hover:scale-105"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu trigger */}
            <div className="lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-3 pb-5 space-y-1.5 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-dark-bg/95 backdrop-blur-md shadow-xl">
          <NavLink
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className={navLinkClass}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/interview/new"
            onClick={() => setMobileMenuOpen(false)}
            className={navLinkClass}
          >
            <Play className="w-4 h-4" />
            <span>New Interview</span>
          </NavLink>

          <NavLink
            to="/coding"
            onClick={() => setMobileMenuOpen(false)}
            className={navLinkClass}
          >
            <Code2 className="w-4 h-4" />
            <span>Coding</span>
          </NavLink>

          <NavLink
            to="/analytics"
            onClick={() => setMobileMenuOpen(false)}
            className={navLinkClass}
          >
            <BarChart2 className="w-4 h-4" />
            <span>Analytics</span>
          </NavLink>

          <NavLink
            to="/history"
            onClick={() => setMobileMenuOpen(false)}
            className={navLinkClass}
          >
            <Clock className="w-4 h-4" />
            <span>History</span>
          </NavLink>

          <NavLink
            to="/demo"
            onClick={() => setMobileMenuOpen(false)}
            className={navLinkClass}
          >
            <Sparkles className="w-4 h-4 text-brand-500" />
            <span>Interactive Demo Room</span>
          </NavLink>

          <NavLink
            to="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className={navLinkClass}
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </NavLink>

          <NavLink
            to="/settings"
            onClick={() => setMobileMenuOpen(false)}
            className={navLinkClass}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </NavLink>

          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center space-x-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          ) : (
            <div className="pt-2 flex flex-col space-y-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleDemo();
                }}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-center bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/30"
              >
                ⚡ Instant Demo Account
              </button>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-center bg-brand-600 text-white"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
