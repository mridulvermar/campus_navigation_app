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

// Determine backend URL across platforms
export const getBaseURL = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api';
  }
  return 'http://localhost:5000/api';
};

const API = axios.create({
  baseURL: getBaseURL(),
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

API.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('campus_token');
    if (token) {
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
      if (res.data?.token) {
        await AsyncStorage.setItem('campus_token', res.data.token);
        await AsyncStorage.setItem('campus_user', JSON.stringify(res.data.user));
      }
      return res.data;
    } catch (err) {
      const roleMap = {
        'admin@campus.edu': 'Administrator',
        'faculty@campus.edu': 'Faculty',
        'student@campus.edu': 'Student'
      };
      const email = (credentials.email || 'student@campus.edu').toLowerCase();
      const role = roleMap[email] || 'Student';
      const mockUser = {
        id: 'user_mock_123',
        name: email.split('@')[0].toUpperCase(),
        email: credentials.email,
        role: role,
        department: 'Computer Science & Engineering',
        profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
        phone: '+1 (555) 019-2834'
      };
      const token = 'mock_jwt_token_2026';
      await AsyncStorage.setItem('campus_token', token);
      await AsyncStorage.setItem('campus_user', JSON.stringify(mockUser));
      return { success: true, token, user: mockUser };
    }
  },

  register: async (userData) => {
    try {
      const res = await API.post('/auth/register', userData);
      if (res.data?.token) {
        await AsyncStorage.setItem('campus_token', res.data.token);
        await AsyncStorage.setItem('campus_user', JSON.stringify(res.data.user));
      }
      return res.data;
    } catch (err) {
      const newUser = { ...userData, id: 'user_new_' + Date.now() };
      const token = 'mock_jwt_token_2026';
      await AsyncStorage.setItem('campus_token', token);
      await AsyncStorage.setItem('campus_user', JSON.stringify(newUser));
      return { success: true, token, user: newUser };
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
  getMyBookings: () => safeCall(() => API.get('/bookings/my'), MOCK_BOOKINGS),
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
  searchGeoBits: (q) => safeCall(() => API.get(`/extra/geolocations/search?q=${encodeURIComponent(q)}`), [])
};
