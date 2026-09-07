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

        // Purge legacy mock tokens if present
        if (storedToken === 'mock_jwt_token_2026' || storedToken === 'demo_token_2026') {
          await AsyncStorage.removeItem('campus_token');
          await AsyncStorage.removeItem('campus_user');
          setToken(null);
          setUser(null);
          setLoading(false);
          return;
        }

        if (storedToken && storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setToken(storedToken);
            setUser(parsedUser);

            // Verify with server in background
            const meRes = await apiService.getMe();
            if (meRes?.success && meRes?.user) {
              setUser(meRes.user);
              await AsyncStorage.setItem('campus_user', JSON.stringify(meRes.user));
            } else if (meRes?.message && (meRes.message.includes('expired') || meRes.message.includes('Not authorized'))) {
              await apiService.logout();
              setToken(null);
              setUser(null);
            }
          } catch (parseErr) {
            console.warn('[AuthContext] Stored auth parse error:', parseErr);
          }
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
      if (res.success && res.token && res.user) {
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
      if (res.success && res.token && res.user) {
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
