import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [spatialLocation, setSpatialLocation] = useState({
    latitude: 37.774929,
    longitude: -122.419416,
    accuracyMeters: 4,
    timestamp: Date.now()
  });

  useEffect(() => {
    const newSocket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnectionAttempts: 3
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
