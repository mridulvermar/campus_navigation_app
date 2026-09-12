import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

const getSocketServerUrl = () => {
  if (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL.replace(/\/api\/?$/, '');
  }
  if (typeof window !== 'undefined' && window.location) {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:5000';
    }
    if (window.location.hostname.endsWith('vercel.app')) {
      return null;
    }
    return window.location.origin;
  }
  return null;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [spatialLocation, setSpatialLocation] = useState({
    latitude: 11.500344,
    longitude: 77.277933,
    accuracyMeters: 4,
    timestamp: Date.now()
  });

  useEffect(() => {
    const serverUrl = getSocketServerUrl();
    let newSocket = null;

    if (serverUrl) {
      try {
        newSocket = io(serverUrl, {
          transports: ['polling', 'websocket'],
          autoConnect: true,
          reconnectionAttempts: 2,
          reconnectionDelay: 1000,
          timeout: 4000
        });

        newSocket.on('connect_error', () => {
          // Graceful silent fallback
        });

        newSocket.on('spatial_location_pulse', (data) => {
          if (data && data.latitude) setSpatialLocation(data);
        });

        setSocket(newSocket);
      } catch (err) {}
    }

    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, spatialLocation }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
