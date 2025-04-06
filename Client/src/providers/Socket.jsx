import { createContext, useContext } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export default function SocketProvider({ children }) {
  const socket = io(
    "https://0e6ea978-db8c-43b1-b068-436bc70be319-00-1cl2u3bwczal2.kirk.replit.dev/",
  );

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}
