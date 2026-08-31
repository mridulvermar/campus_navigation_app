import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Platform } from 'react-native';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [spatialLocation, setSpatialLocation] = useState({
    latitude: 11.4960,
    longitude: 77.2765,
    accuracyMeters: 5
  });
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const serverUrl = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';
    let socketInstance = null;

    try {
      socketInstance = io(serverUrl, {
        transports: ['websocket', 'polling'],
        timeout: 3000,
        reconnectionAttempts: 3
      });

      socketInstance.on('connect', () => {
        setConnected(true);
      });

      socketInstance.on('disconnect', () => {
        setConnected(false);
      });

      socketInstance.on('spatial:locationUpdate', (data) => {
        if (data && data.latitude && data.longitude) {
          setSpatialLocation(data);
        }
      });

      socketInstance.on('notification', (notif) => {
        setNotifications((prev) => [notif, ...prev]);
      });

      setSocket(socketInstance);
    } catch (err) {
      console.warn('[SocketContext] Connection fallback to local state');
    }

    return () => {
      if (socketInstance) socketInstance.disconnect();
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
