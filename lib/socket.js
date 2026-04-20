import { io } from "socket.io-client";

export const socket = io("https://skudyx-backend-c8do.onrender.com", {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  // transports: ["websocket"],
});
