import { createContext, useContext } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export default function SocketProvider({ children }) {
  const socket = io(
    "https://web-rtc-mu-livid.vercel.app/",
  );

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}
