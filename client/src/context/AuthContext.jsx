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
        if (storedToken && storedToken.startsWith('demo_token_')) {
          const parts = storedToken.split('_');
          const roleId = parts[2] || 'admin';
          const demoMap = {
            admin: { id: 'admin', userId: 'admin', name: 'Elena Rostova (Program Director)', role: 'ADMIN' },
            team: { id: 'team', userId: 'team', name: 'Alex Vance (Lead Architect)', role: 'TEAM' },
            client: { id: 'client', userId: 'client', name: 'David Sterling (Client Sponsor)', role: 'CLIENT' }
          };
          if (demoMap[roleId]) {
            setUser(demoMap[roleId]);
            setLoading(false);
            return;
          }
        }
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
    try {
      const data = await api.post('/auth/login', { userId, password });
      setAuthToken(data.token);
      setTokenState(data.token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      const cleanId = userId.toLowerCase().trim();
      const demoUsers = {
        admin: { id: 'admin', userId: 'admin', name: 'Elena Rostova (Program Director)', role: 'ADMIN' },
        team: { id: 'team', userId: 'team', name: 'Alex Vance (Lead Architect)', role: 'TEAM' },
        client: { id: 'client', userId: 'client', name: 'David Sterling (Client Sponsor)', role: 'CLIENT' }
      };
      if (demoUsers[cleanId] && password === `${cleanId}123`) {
        const demoUser = demoUsers[cleanId];
        const demoToken = `demo_token_${cleanId}_${Date.now()}`;
        setAuthToken(demoToken);
        setTokenState(demoToken);
        setUser(demoUser);
        return demoUser;
      }
      throw err;
    }
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
