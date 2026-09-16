import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, userAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('interviewai_token') || null);
  const [loading, setLoading] = useState(true);

  // Check current session on mount
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await authAPI.getMe();
          if (res.data.success) {
            setUser(res.data.user);
          }
        } catch (err) {
          console.warn('[Auth] Session invalid or expired. Resetting auth state.');
          logout();
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const saveAuthSession = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('interviewai_token', newToken);
  };

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.data.success) {
      saveAuthSession(res.data.token, res.data.user);
      return res.data;
    }
  };

  const register = async (userData) => {
    const res = await authAPI.register(userData);
    if (res.data.success) {
      saveAuthSession(res.data.token, res.data.user);
      return res.data;
    }
  };

  const demoLogin = async () => {
    const res = await authAPI.demoLogin();
    if (res.data.success) {
      saveAuthSession(res.data.token, res.data.user);
      return res.data;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('interviewai_token');
    authAPI.logout().catch(() => {});
  };

  const updateUserProfile = async (profileData) => {
    const res = await userAPI.updateProfile(profileData);
    if (res.data.success) {
      setUser((prev) => ({ ...prev, ...res.data.user }));
      return res.data;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        demoLogin,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
