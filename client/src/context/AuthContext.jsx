import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getAuthToken, setAuthToken } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(getAuthToken());
  const [loading, setLoading] = useState(true);

  // Initialize and verify user token on app mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getAuthToken();
      if (!storedToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const data = await api.get('/auth/me');
        setUser(data.user);
      } catch (err) {
        console.warn('Session expired or invalid, logging out:', err);
        setAuthToken(null);
        setTokenState(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (userId, password) => {
    const data = await api.post('/auth/login', { userId, password });
    setAuthToken(data.token);
    setTokenState(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    setAuthToken(null);
    setTokenState(null);
    setUser(null);
  };

  const changePassword = async (currentPassword, newPassword) => {
    return await api.post('/auth/change-password', {
      currentPassword,
      newPassword
    });
  };

  const refreshUser = async () => {
    try {
      const data = await api.get('/auth/me');
      setUser(data.user);
    } catch (e) {
      console.error('Failed to refresh user:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        changePassword,
        refreshUser,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
        isTeam: user?.role === 'TEAM',
        isClient: user?.role === 'CLIENT'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
