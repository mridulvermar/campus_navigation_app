import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Platform } from 'react-native';

const SocketContext = createContext();

const getSocketServerUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL.replace(/\/api\/?$/, '');
  }
  if (typeof window !== 'undefined' && window.location) {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:5000';
    }
  }
  // Standalone APK and production fallback
  return 'https://campus-navigation-app-6nil.onrender.com';
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [spatialLocation, setSpatialLocation] = useState({
    latitude: 11.4960,
    longitude: 77.2765,
    accuracyMeters: 5,
    timestamp: Date.now()
  });
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const serverUrl = getSocketServerUrl();
    let socketInstance = null;
    let localSimInterval = null;

    if (serverUrl) {
      try {
        socketInstance = io(serverUrl, {
          transports: ['polling', 'websocket'],
          timeout: 4000,
          reconnectionAttempts: 2,
          autoConnect: true
        });

        socketInstance.on('connect', () => {
          setConnected(true);
        });

        socketInstance.on('disconnect', () => {
          setConnected(false);
        });

        socketInstance.on('connect_error', () => {
          // Graceful silent fallback to local simulated spatial tracking
          setConnected(false);
        });

        socketInstance.on('spatial:locationUpdate', (data) => {
          if (data && data.latitude && data.longitude) {
            setSpatialLocation(data);
          }
        });

        socketInstance.on('spatial_location_pulse', (data) => {
          if (data && data.latitude && data.longitude) {
            setSpatialLocation(data);
          }
        });

        socketInstance.on('notification', (notif) => {
          setNotifications((prev) => [notif, ...prev]);
        });

        setSocket(socketInstance);
      } catch (err) {
        // Fallback safely
      }
    }

    // Local simulated spatial GPS jitter
    localSimInterval = setInterval(() => {
      setSpatialLocation((prev) => ({
        latitude: 11.4960 + (Math.random() - 0.5) * 0.0008,
        longitude: 77.2765 + (Math.random() - 0.5) * 0.0008,
        accuracyMeters: Math.floor(Math.random() * 3) + 3,
        timestamp: Date.now()
      }));
    }, 4000);

    return () => {
      if (socketInstance) socketInstance.disconnect();
      if (localSimInterval) clearInterval(localSimInterval);
    };
  }, []);

  const emitLocation = (coords) => {
    if (socket && connected) {
      socket.emit('spatial:location', coords);
    }
    setSpatialLocation((prev) => ({ ...prev, ...coords }));
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
        spatialLocation,
        emitLocation,
        notifications
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
