"use client";

import { useEffect, useRef, useState } from "react";

export default function WebSocketAudioPlayer({ caseId }) {
  const wsRef = useRef(null);
  const audioContextRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [chunkCount, setChunkCount] = useState(0);
  const [isSenderPresent, setIsSenderPresent] = useState(true);

  useEffect(() => {
    if (!caseId) return;

    console.log("🎧 [WebSocket] Initializing audio player...");

    // Initialize Audio Context
    audioContextRef.current = new (
      window.AudioContext || window.webkitAudioContext
    )({
      sampleRate: 44100,
    });

    // Connect to WebSocket
    const wsUrl = "wss://skudyx-backend-thtu.onrender.com/ws/audio-stream";
    console.log("🔌 Connecting to:", wsUrl);

    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => {
      console.log("✅ [WebSocket] Connected");
      setIsConnected(true);
      setError(null);
      setIsSenderPresent(true);

      // Join as Listener
      wsRef.current.send(
        JSON.stringify({
          type: "join",
          caseId: caseId,
          isSender: false,
        }),
      );
    };

    wsRef.current.onmessage = (event) => {
      // Check if message is text (JSON) or binary/blob
      if (event.data instanceof Blob) {
        event.data
          .text()
          .then((text) => processMessage(text))
          .catch(console.error);
      } else {
        processMessage(event.data);
      }
    };

    const processMessage = (text) => {
      try {
        const data = JSON.parse(text);

        if (data.type === "joined") {
          console.log("✅ Joined case:", data.caseId);
        } else if (data.type === "sender_left") {
          console.log("⚠️ Sender disconnected");
          setIsSenderPresent(false);
        } else if (data.type === "audio_chunk") {
          // Decode and Play
          playBase64Audio(data.chunk);
          setChunkCount((prev) => prev + 1);
        }
      } catch (err) {
        console.error("❌ Message error:", err);
      }
    };

    wsRef.current.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
      setError("Connection failed");
    };

    wsRef.current.onclose = () => {
      console.log("🔌 WebSocket closed");
      setIsConnected(false);
    };

    return () => {
      if (wsRef.current) {
        if (wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ type: "leave", caseId }));
        }
        // wsRef.current.send(JSON.stringify({ type: "leave", caseId }));
        wsRef.current.close();
      }
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, [caseId]);

  // Play Base64 Audio
  const playBase64Audio = async (base64Data) => {
    try {
      // Decode Base64 -> Binary
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Convert PCM16 (Int16) to Float32 for Web Audio
      // Ensure length is even (2 bytes per sample)
      const length = bytes.length - (bytes.length % 2);
      const int16Data = new Int16Array(bytes.buffer, 0, length / 2);

      const float32Data = new Float32Array(int16Data.length);
      for (let i = 0; i < int16Data.length; i++) {
        float32Data[i] = int16Data[i] / 32768.0; // Normalize
      }

      // Create Audio Buffer
      const audioBuffer = audioContextRef.current.createBuffer(
        1,
        float32Data.length,
        44100,
      );
      audioBuffer.getChannelData(0).set(float32Data);

      // Play
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      source.start(0);

      // Update visualizer
      const rms = Math.sqrt(
        float32Data.reduce((sq, n) => sq + n * n, 0) / float32Data.length,
      );
      setAudioLevel(Math.min(100, rms * 300));
    } catch (error) {
      console.error("❌ Audio decode error:", error);
    }
  };

  return (
    <div className="p-6 rounded-xl bg-gray-800 border border-gray-700 shadow-lg max-w-md w-full">
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-3 h-3 rounded-full ${isSenderPresent ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
        />
        <h2 className="text-xl font-bold text-white">
          {isSenderPresent ? "🔊 Live Audio" : "⏸️ Waiting for Sender"}
        </h2>
      </div>

      <div className="space-y-2 text-sm text-gray-300">
        <p>Status: {isConnected ? "✅ Connected" : "❌ Disconnected"}</p>
        <p>Case ID: {caseId || "-"}</p>
        <p>Chunks received: {chunkCount}</p>
      </div>

      {/* Audio Level Visualizer */}
      <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-500 transition-all duration-75"
          style={{ width: `${audioLevel}%` }}
        />
      </div>

      {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}
    </div>
  );
}
