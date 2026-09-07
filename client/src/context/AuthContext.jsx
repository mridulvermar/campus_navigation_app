import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('campus_user');
      const savedToken = localStorage.getItem('campus_token');
      if (savedToken && savedToken !== 'demo_token_2026' && savedToken !== 'mock_jwt_token_2026') {
        return savedUser ? JSON.parse(savedUser) : null;
      }
      localStorage.removeItem('campus_user');
      localStorage.removeItem('campus_token');
    } catch (e) {}
    return null;
  });

  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem('campus_token');
    if (savedToken && savedToken !== 'demo_token_2026' && savedToken !== 'mock_jwt_token_2026') {
      return savedToken;
    }
    return null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await apiService.login({ email, password });
      if (res.success) {
        setUser(res.user);
        setToken(res.token);
        localStorage.setItem('campus_user', JSON.stringify(res.user));
        localStorage.setItem('campus_token', res.token);
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('campus_user');
    localStorage.removeItem('campus_token');
  };

  const switchRole = (newRole) => {
    const updated = { ...user, role: newRole };
    setUser(updated);
    localStorage.setItem('campus_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
