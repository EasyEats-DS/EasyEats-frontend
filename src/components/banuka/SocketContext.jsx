// src/context/SocketContext.js

import React, { createContext, useContext } from 'react';
import useDriversSocket from './hooks/useDriversSocket'; // adjust path as needed

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socket = useDriversSocket();

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
