import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('campus_token');
        const storedUser = await AsyncStorage.getItem('campus_user');
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } else {
          // Default mock session for instant ease of access
          const defaultUser = {
            id: 'usr_default',
            name: 'Mridul Verma',
            email: 'admin@campus.edu',
            role: 'Administrator',
            department: 'Computer Science & Engineering',
            profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
            phone: '+1 (555) 019-2834'
          };
          setUser(defaultUser);
          setToken('mock_jwt_token_2026');
          await AsyncStorage.setItem('campus_token', 'mock_jwt_token_2026');
          await AsyncStorage.setItem('campus_user', JSON.stringify(defaultUser));
        }
      } catch (err) {
        console.error('[AuthContext] Load stored auth error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadStoredAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await apiService.login({ email, password });
      if (res.token && res.user) {
        setToken(res.token);
        setUser(res.user);
        return { success: true, user: res.user };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err) {
      return { success: false, message: err.message || 'Network error' };
    }
  };

  const register = async (userData) => {
    try {
      const res = await apiService.register(userData);
      if (res.token && res.user) {
        setToken(res.token);
        setUser(res.user);
        return { success: true, user: res.user };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (err) {
      return { success: false, message: err.message || 'Network error' };
    }
  };

  const logout = async () => {
    await apiService.logout();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        register,
        logout,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
