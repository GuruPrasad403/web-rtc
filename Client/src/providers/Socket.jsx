
import { createContext, useContext } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export default function SocketProvider({ children }) {
  const socket = io(window.location.hostname === 'localhost' 
    ? "http://localhost:3000"
    : window.location.origin);
    
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}
