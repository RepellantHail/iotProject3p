// socketCOM.ts
import io from "socket.io-client";
import { useState, useEffect } from "react";

const socket = io("http://192.168.0.102:3030");

export const useSocket = () => {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const handleConnect = () => {
      setConnected(true);
      console.log(socket.id); // Log the socket ID (for debugging only)
    };

    const handleDisconnect = (reason: string) => {
      setConnected(false);
      console.log(`Disconnected: ${reason}`);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    socket.on("message", (data: string) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("message");
    };
  }, []);

  const sendMessage = (message: string) => {
    if (socket && connected) {
      socket.emit("message", message);
    } else {
      console.log("Socket no está conectado.");
    }
  };

  return {
    connected,
    messages,
    sendMessage,
  };
};

export default socket;
