import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('campus_user');
    return savedUser ? JSON.parse(savedUser) : {
      id: 'demo_user_1',
      name: 'Alex Johnson',
      email: 'student@campus.edu',
      role: 'Student',
      department: 'Computer Science & Engineering',
      profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      phone: '+1 (555) 019-2834'
    };
  });

  const [token, setToken] = useState(() => localStorage.getItem('campus_token') || 'demo_token_2026');
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
