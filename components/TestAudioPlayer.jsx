"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// Plays a 1-sample silent buffer to unlock AudioContext without a visible button
const unlockAudioContext = async (ctx) => {
  if (ctx.state !== "suspended") return;

  const buf = ctx.createBuffer(1, 1, 22050);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.connect(ctx.destination);
  src.start(0);

  await ctx.resume();
};

export default function TestAudioPlayer({ caseId }) {
  const wsRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const nextPlayTimeRef = useRef(0);
  const animFrameRef = useRef(null);
  const unlockedRef = useRef(false);

  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [chunkCount, setChunkCount] = useState(0);
  const [isSenderPresent, setIsSenderPresent] = useState(true);
  const [needsGesture, setNeedsGesture] = useState(false);

  // ─── Audio context ────────────────────────────────────────────────────────
  const initAudioContext = useCallback(() => {
    if (audioContextRef.current) return;

    const ctx = new (window.AudioContext || window.webkitAudioContext)({
      sampleRate: 44100,
      latencyHint: "interactive",
    });

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.connect(ctx.destination);
    analyserRef.current = analyser;
    audioContextRef.current = ctx;
  }, []);

  // Called if autoplay was blocked and user taps the button
  const handleUserGesture = useCallback(async () => {
    if (!audioContextRef.current) return;
    await unlockAudioContext(audioContextRef.current);
    unlockedRef.current = true;
    setNeedsGesture(false);
  }, []);

  // ─── Scheduled playback ───────────────────────────────────────────────────
  const playBase64Audio = useCallback(async (base64Data) => {
    try {
      const ctx = audioContextRef.current;
      if (!ctx) return;

      // On the very first chunk, try the silent-buffer unlock trick.
      // This works automatically if a prior gesture (page load, button click)
      // happened recently — no visible button needed in most cases.
      if (!unlockedRef.current) {
        await unlockAudioContext(ctx);
        if (ctx.state === "suspended") {
          // Still blocked → show the manual tap button and discard chunk
          setNeedsGesture(true);
          return;
        }
        unlockedRef.current = true;
        setNeedsGesture(false);
      }

      // Decode Base64 → PCM Float32
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const length = bytes.length - (bytes.length % 2);
      const int16Data = new Int16Array(bytes.buffer, 0, length / 2);
      const float32Data = new Float32Array(int16Data.length);
      for (let i = 0; i < int16Data.length; i++) {
        float32Data[i] = int16Data[i] / 32768.0;
      }

      const audioBuffer = ctx.createBuffer(1, float32Data.length, 44100);
      audioBuffer.getChannelData(0).set(float32Data);

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(analyserRef.current);

      const now = ctx.currentTime;

      // ── Delay reduction ──────────────────────────────────────────────────
      // LOOK_AHEAD: minimal scheduling offset (10 ms) — just enough to prevent
      //   glitches from scheduling jitter; was 50 ms before.
      // MAX_AHEAD: if the queued audio is already >150 ms ahead of now,
      //   drop this chunk so we stay close to real-time.
      const LOOK_AHEAD = 0.01; // 10 ms
      const MAX_AHEAD = 0.5; // 150 ms queue cap

      if (nextPlayTimeRef.current > now + MAX_AHEAD) {
        return; // queue too deep — drop chunk to catch up
      }

      // Jitter guard: if we fell behind (tab backgrounded etc.), resync to now
      if (nextPlayTimeRef.current < now - 0.05) {
        nextPlayTimeRef.current = now + LOOK_AHEAD;
      }

      const startTime = Math.max(now + LOOK_AHEAD, nextPlayTimeRef.current);
      source.start(startTime);
      nextPlayTimeRef.current = startTime + audioBuffer.duration;
    } catch (err) {
      console.error("❌ Audio error:", err);
    }
  }, []);

  // ─── Visualizer (polls AnalyserNode via rAF) ──────────────────────────────
  useEffect(() => {
    const tick = () => {
      animFrameRef.current = requestAnimationFrame(tick);
      if (!analyserRef.current) return;

      const data = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteTimeDomainData(data);

      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        const v = (data[i] - 128) / 128;
        sum += v * v;
      }
      setAudioLevel(Math.min(100, Math.sqrt(sum / data.length) * 400));
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  // ─── WebSocket lifecycle ──────────────────────────────────────────────────
  useEffect(() => {
    if (!caseId) return;

    initAudioContext();

    const wsUrl = "wss://skudyx-backend-thtu.onrender.com/ws/audio-stream";
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
      setIsConnected(true);
      setError(null);
      setIsSenderPresent(true);
      nextPlayTimeRef.current = 0;
      unlockedRef.current = false;

      ws.send(JSON.stringify({ type: "join", caseId, isSender: false }));
    };

    const processMessage = (text) => {
      try {
        const data = JSON.parse(text);

        if (data.type === "joined") {
          console.log("✅ Joined case:", data.caseId);
        } else if (data.type === "sender_left") {
          setIsSenderPresent(false);
        } else if (data.type === "audio_chunk") {
          playBase64Audio(data.chunk);
          setChunkCount((c) => c + 1);
        }
      } catch (e) {
        console.error("❌ Message parse error:", e);
      }
    };

    ws.onmessage = (event) => {
      if (event.data instanceof Blob) {
        event.data.text().then(processMessage).catch(console.error);
      } else {
        processMessage(event.data);
      }
    };

    ws.onerror = () => setError("Connection failed. Please try again.");

    ws.onclose = () => {
      setIsConnected(false);
      nextPlayTimeRef.current = 0;
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "leave", caseId }));
      }
      ws.close();

      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
        analyserRef.current = null;
      }
    };
  }, [caseId, initAudioContext, playBase64Audio]);

  // ─── UI ───────────────────────────────────────────────────────────────────
  const statusColor = isConnected
    ? isSenderPresent
      ? "bg-green-500"
      : "bg-yellow-400"
    : "bg-red-500";

  const statusLabel = !isConnected
    ? "Disconnected"
    : isSenderPresent
      ? "Live"
      : "Waiting for sender";

  return (
    <div
      className="p-6 rounded-xl bg-gray-800 border border-gray-700 shadow-lg max-w-md w-full space-y-4"
      onClick={needsGesture ? handleUserGesture : undefined}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${statusColor} ${
              isConnected && isSenderPresent ? "animate-pulse" : ""
            }`}
          />
          <h2 className="text-base font-semibold text-white">
            {isConnected && isSenderPresent ? "Live Audio" : "Audio Player"}
          </h2>
        </div>
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            isConnected
              ? isSenderPresent
                ? "bg-green-900 text-green-300"
                : "bg-yellow-900 text-yellow-300"
              : "bg-red-900 text-red-300"
          }`}
        >
          {statusLabel}
        </span>
      </div>

      {/* Tap-to-enable banner — only rendered if browser blocked autoplay */}
      {needsGesture && (
        <button
          onClick={handleUserGesture}
          className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-sm font-medium transition-all"
        >
          Tap to enable audio
        </button>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-gray-700 rounded-lg p-3">
          <p className="text-gray-400 text-xs mb-1">Case ID</p>
          <p className="text-white font-mono truncate">{caseId || "—"}</p>
        </div>
        <div className="bg-gray-700 rounded-lg p-3">
          <p className="text-gray-400 text-xs mb-1">Chunks received</p>
          <p className="text-white font-semibold">{chunkCount}</p>
        </div>
      </div>

      {/* Level bar */}
      <div>
        <p className="text-gray-400 text-xs mb-1.5">Audio level</p>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-75 ${
              audioLevel > 60
                ? "bg-red-500"
                : audioLevel > 30
                  ? "bg-yellow-400"
                  : "bg-green-500"
            }`}
            style={{ width: `${audioLevel}%` }}
          />
        </div>
      </div>

      {error && (
        <p className="text-red-400 text-sm bg-red-900/30 border border-red-800 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
    </div>
  );
}
