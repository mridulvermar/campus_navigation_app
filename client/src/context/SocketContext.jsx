import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [spatialLocation, setSpatialLocation] = useState({
    latitude: 11.500344,
    longitude: 77.277933,
    accuracyMeters: 4,
    timestamp: Date.now()
  });

  useEffect(() => {
    const newSocket = io('http://localhost:5000', {
      transports: ['polling', 'websocket'],
      autoConnect: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    newSocket.on('connect_error', () => {
      // Graceful fallback handling
    });

    newSocket.on('spatial_location_pulse', (data) => {
      setSpatialLocation(data);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, spatialLocation }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
