import { useEffect } from "react";
import { socket } from "./socket";

export const useSocketConnection = () => {
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);

      socket.emit("join_admin_dashboard");
      socket.emit("admin_room");
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Disconnected:", reason);
    });

    socket.on("reconnect", (attempt) => {
      console.log("🔄 Reconnected after", attempt, "tries");

      // Rejoin rooms after reconnect
      socket.emit("join_admin_dashboard");
      socket.emit("admin_room");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("reconnect");
    };
  }, []);
};
