"use client";
import { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import to avoid SSR issues with ZEGOCLOUD
const LiveStreamingRoom = dynamic(
  () => import("../../components/LiveStreamingRoom"),
  { ssr: false },
);

export default function StreamPage() {
  const [inRoom, setInRoom] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [liveID, setLiveID] = useState("");
  const [userID, setUserID] = useState("");
  const [userName, setUserName] = useState("");

  const generateUserID = () => {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleJoinRoom = () => {
    if (!liveID.trim()) {
      alert("Please enter a Live ID");
      return;
    }
    if (!userName.trim()) {
      alert("Please enter your name");
      return;
    }

    setUserID(generateUserID());
    setInRoom(true);
  };

  if (inRoom) {
    return (
      <LiveStreamingRoom
        liveID={liveID}
        isHost={isHost}
        userID={userID}
        userName={userName}
        onLeave={() => setInRoom(false)}
      />
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
          Audio Live Stream
        </h1>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Your Name:
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your name"
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              fontSize: "16px",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Live Room ID:
          </label>
          <input
            type="text"
            value={liveID}
            onChange={(e) => setLiveID(e.target.value)}
            placeholder="Enter room ID"
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              fontSize: "16px",
            }}
          />
        </div>

        <div style={{ marginBottom: "30px" }}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Join as:
          </label>
          <div style={{ display: "flex", gap: "20px" }}>
            <label style={{ display: "flex", alignItems: "center" }}>
              <input
                type="radio"
                checked={isHost === true}
                onChange={() => setIsHost(true)}
                style={{ marginRight: "8px" }}
              />
              Host (Stream Audio)
            </label>
            <label style={{ display: "flex", alignItems: "center" }}>
              <input
                type="radio"
                checked={isHost === false}
                onChange={() => setIsHost(false)}
                style={{ marginRight: "8px" }}
              />
              Listener
            </label>
          </div>
        </div>

        <button
          onClick={handleJoinRoom}
          style={{
            width: "100%",
            padding: "12px",
            background: "#667eea",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            cursor: "pointer",
            transition: "background 0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.background = "#5a67d8")}
          onMouseLeave={(e) => (e.target.style.background = "#667eea")}
        >
          {isHost ? "Start Streaming" : "Join Stream"}
        </button>
      </div>
    </div>
  );
}
