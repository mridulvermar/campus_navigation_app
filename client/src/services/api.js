import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  MOCK_BUILDINGS, 
  MOCK_ROOMS, 
  MOCK_ASSETS, 
  MOCK_BOOKINGS, 
  MOCK_NOTIFICATIONS, 
  MOCK_ANALYTICS 
} from '../data/mockData';
import { clientRagEngine } from './ragEngine';

// Determine backend URL across platforms
export const getBaseURL = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    let url = process.env.EXPO_PUBLIC_API_URL.trim();
    if (!url.endsWith('/api') && !url.endsWith('/api/')) {
      url = `${url.replace(/\/+$/, '')}/api`;
    }
    return url;
  }
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location) {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return '/api';
    }
  }
  // Production / Standalone APK fallback to live Render backend
  return 'https://campus-navigation-app-6nil.onrender.com/api';
};

const API = axios.create({
  baseURL: getBaseURL(),
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json'
  }
});

API.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('campus_token');
    if (token && token !== 'mock_jwt_token_2026' && token !== 'demo_token_2026') {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // Ignore storage read error
  }
  return config;
});

// Helper wrapper handling offline fallback
const safeCall = async (apiCall, fallbackData) => {
  try {
    const response = await apiCall();
    return response.data;
  } catch (err) {
    return { success: true, data: fallbackData, count: Array.isArray(fallbackData) ? fallbackData.length : undefined };
  }
};

export const apiService = {
  // Auth API
  login: async (credentials) => {
    try {
      const res = await API.post('/auth/login', credentials);
      if (res.data?.token && res.data?.user) {
        await AsyncStorage.setItem('campus_token', res.data.token);
        await AsyncStorage.setItem('campus_user', JSON.stringify(res.data.user));
        return { success: true, token: res.data.token, user: res.data.user };
      }
      return { success: false, message: res.data?.message || 'Login failed' };
    } catch (err) {
      const errorMsg = err.response?.data?.message || (err.message === 'Network Error' ? `Cannot reach server at ${getBaseURL()}` : err.message);
      return { success: false, message: errorMsg };
    }
  },

  register: async (userData) => {
    try {
      const res = await API.post('/auth/register', userData);
      if (res.data?.token && res.data?.user) {
        await AsyncStorage.setItem('campus_token', res.data.token);
        await AsyncStorage.setItem('campus_user', JSON.stringify(res.data.user));
        return { success: true, token: res.data.token, user: res.data.user };
      }
      return { success: false, message: res.data?.message || 'Registration failed' };
    } catch (err) {
      const errorMsg = err.response?.data?.message || (err.message === 'Network Error' ? `Cannot reach server at ${getBaseURL()}` : err.message);
      return { success: false, message: errorMsg };
    }
  },

  getMe: async () => {
    try {
      const token = await AsyncStorage.getItem('campus_token');
      if (!token || token === 'mock_jwt_token_2026' || token === 'demo_token_2026') {
        return { success: false, message: 'No token stored' };
      }
      const res = await API.get('/auth/me');
      if (res.data?.user) {
        await AsyncStorage.setItem('campus_user', JSON.stringify(res.data.user));
      }
      return res.data;
    } catch (err) {
      return { success: false, message: err.response?.data?.message || err.message };
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem('campus_token');
      await AsyncStorage.removeItem('campus_user');
    } catch (e) {}
  },

  // Buildings API
  getBuildings: () => safeCall(() => API.get('/buildings'), MOCK_BUILDINGS),
  getBuildingById: (id) => safeCall(() => API.get(`/buildings/${id}`), MOCK_BUILDINGS.find(b => b._id === id) || MOCK_BUILDINGS[0]),

  // Rooms API
  getRooms: () => safeCall(() => API.get('/rooms'), MOCK_ROOMS),

  // Assets API
  getAssets: () => safeCall(() => API.get('/assets'), MOCK_ASSETS),

  // Bookings API
  getBookings: () => safeCall(() => API.get('/bookings'), MOCK_BOOKINGS),
  getMyBookings: async () => {
    try {
      const token = await AsyncStorage.getItem('campus_token');
      if (!token || token === 'mock_jwt_token_2026' || token === 'demo_token_2026') {
        return { success: true, data: MOCK_BOOKINGS, count: MOCK_BOOKINGS.length };
      }
      return safeCall(() => API.get('/bookings/my'), MOCK_BOOKINGS);
    } catch (err) {
      return { success: true, data: MOCK_BOOKINGS, count: MOCK_BOOKINGS.length };
    }
  },
  createBooking: async (bookingData) => {
    try {
      const res = await API.post('/bookings', bookingData);
      return res.data;
    } catch (err) {
      const newBooking = {
        _id: 'bk_' + Date.now(),
        user: { name: 'Current User', email: 'user@campus.edu' },
        ...bookingData,
        status: 'Pending',
        qrCodeData: `CAMPUS-BOOKING-${Date.now()}`
      };
      return { success: true, data: newBooking };
    }
  },
  updateBookingStatus: async (id, status, adminComment) => {
    try {
      const res = await API.patch(`/bookings/${id}/status`, { status, adminComment });
      return res.data;
    } catch (err) {
      return { success: true, message: `Booking updated to ${status}` };
    }
  },

  // Notifications API
  getNotifications: () => safeCall(() => API.get('/notifications'), MOCK_NOTIFICATIONS),

  // Analytics API
  getAnalytics: () => safeCall(() => API.get('/analytics'), MOCK_ANALYTICS),

  // Navigation History API
  logNavigation: async (navData) => {
    try {
      const res = await API.post('/extra/navigation-history', navData);
      return res.data;
    } catch (err) {
      return { success: true, data: { _id: 'nav_' + Date.now(), ...navData } };
    }
  },
  getNavigationHistory: () => safeCall(() => API.get('/extra/navigation-history'), []),

  // Geolocations Integration API
  getGeolocationLocations: () => safeCall(() => API.get('/extra/geolocations/locations'), []),
  searchGeolocations: (q) => safeCall(() => API.get(`/extra/geolocations/search?q=${encodeURIComponent(q)}`), []),
  getGeoBitsLocations: () => safeCall(() => API.get('/extra/geolocations/locations'), []),
  searchGeoBits: (q) => safeCall(() => API.get(`/extra/geolocations/search?q=${encodeURIComponent(q)}`), []),

  // RAG Chatbot API
  sendChatMessage: async (message, history = []) => {
    try {
      const res = await API.post('/rag/chat', { message, history });
      if (res.data && res.data.success && res.data.data) {
        return res.data.data;
      }
    } catch (err) {
      // Backend is offline or unreachable - use client-side offline RAG engine
    }
    return clientRagEngine.query(message);
  },

  getChatSuggestedPrompts: async () => {
    try {
      const res = await API.get('/rag/suggested');
      if (res.data && res.data.success && res.data.data) {
        return res.data.data;
      }
    } catch (err) {
      // Offline fallback
    }
    return [
      { id: '1', label: 'Where is the AI Lab located?', category: 'Navigation' },
      { id: '2', label: 'What are the hostel curfew hours?', category: 'Campus Rules' },
      { id: '3', label: 'What is the booking 15-min grace period?', category: 'Bookings' },
      { id: '4', label: 'What is the campus emergency number?', category: 'Emergency' },
      { id: '5', label: 'How does Dijkstra road navigation work?', category: 'GIS Routing' },
      { id: '6', label: 'How can I reserve a MacBook Pro or VR headset?', category: 'Assets' }
    ];
  }
};
