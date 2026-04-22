"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const unlockAudioContext = async (ctx) => {
  if (ctx.state !== "suspended") return;
  const buf = ctx.createBuffer(1, 1, 22050);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.connect(ctx.destination);
  src.start(0);
  await ctx.resume();
};

const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

export default function LiveAudioV3({ caseId }) {
  const wsRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const gainNodeRef = useRef(null);
  const nextPlayTimeRef = useRef(0);
  const animFrameRef = useRef(null);
  const unlockedRef = useRef(false);
  const timerRef = useRef(null);
  const canvasRef = useRef(null);

  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  //   const [audioLevel, setAudioLevel] = useState(0);
  const [chunkCount, setChunkCount] = useState(0);
  const [isSenderPresent, setIsSenderPresent] = useState(true);
  const [needsGesture, setNeedsGesture] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1); // 0–1
  const [elapsed, setElapsed] = useState(0); // seconds
  const [isAudioReady, setIsAudioReady] = useState(false);

  // ─── Audio context ────────────────────────────────────────────────────────
  const initAudioContext = useCallback(() => {
    if (audioContextRef.current) return;

    const ctx = new (window.AudioContext || window.webkitAudioContext)({
      sampleRate: 44100,
      latencyHint: "interactive",
    });

    // GainNode → AnalyserNode → destination
    const gain = ctx.createGain();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;

    gain.connect(analyser);
    analyser.connect(ctx.destination);

    gain.gain.value = 1;
    gainNodeRef.current = gain;
    analyserRef.current = analyser;
    audioContextRef.current = ctx;
    setIsAudioReady(true);
  }, []);

  const handleUserGesture = useCallback(async () => {
    if (!audioContextRef.current) return;
    await unlockAudioContext(audioContextRef.current);
    unlockedRef.current = true;
    setNeedsGesture(false);
  }, []);

  // ─── Volume / mute ────────────────────────────────────────────────────────
  const applyVolume = useCallback((vol, muted) => {
    if (!gainNodeRef.current) return;
    gainNodeRef.current.gain.value = muted ? 0 : vol;
  }, []);

  const handleVolumeChange = useCallback(
    (e) => {
      const vol = parseFloat(e.target.value);
      setVolume(vol);
      setIsMuted(vol === 0);
      applyVolume(vol, vol === 0);
    },
    [applyVolume],
  );

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      applyVolume(volume, next);
      return next;
    });
  }, [applyVolume, volume]);

  // ─── Scheduled playback ───────────────────────────────────────────────────
  const playBase64Audio = useCallback(async (base64Data) => {
    try {
      const ctx = audioContextRef.current;
      if (!ctx) return;

      if (!unlockedRef.current) {
        await unlockAudioContext(ctx);
        if (ctx.state === "suspended") {
          setNeedsGesture(true);
          return;
        }
        unlockedRef.current = true;
        setNeedsGesture(false);
      }

      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++)
        bytes[i] = binaryString.charCodeAt(i);

      const length = bytes.length - (bytes.length % 2);
      const int16Data = new Int16Array(bytes.buffer, 0, length / 2);
      const float32Data = new Float32Array(int16Data.length);
      for (let i = 0; i < int16Data.length; i++)
        float32Data[i] = int16Data[i] / 32768.0;

      const audioBuffer = ctx.createBuffer(1, float32Data.length, 44100);
      audioBuffer.getChannelData(0).set(float32Data);

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(gainNodeRef.current); // go through gain first

      const now = ctx.currentTime;
      const LOOK_AHEAD = 0.02;
      const MAX_AHEAD = 0.5;

      if (nextPlayTimeRef.current > now + MAX_AHEAD) return;
      if (nextPlayTimeRef.current < now - 0.05)
        nextPlayTimeRef.current = now + LOOK_AHEAD;

      const startTime = Math.max(now + LOOK_AHEAD, nextPlayTimeRef.current);
      source.start(startTime);
      nextPlayTimeRef.current = startTime + audioBuffer.duration;
    } catch (err) {
      console.error("❌ Audio error:", err);
    }
  }, []);

  // ─── Visualizer ───────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext("2d");
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i];
        ctx.fillStyle = `rgb(${barHeight + 100}, 50, 200)`;
        ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
        x += barWidth + 1;
      }
    };

    draw();
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isAudioReady]);

  // ─── Elapsed timer ────────────────────────────────────────────────────────
  useEffect(() => {
    if (isConnected && isSenderPresent) {
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } else {
      clearInterval(timerRef.current);
      if (!isConnected) setElapsed(0);
    }
    return () => clearInterval(timerRef.current);
  }, [isConnected, isSenderPresent]);

  // ─── WebSocket lifecycle ──────────────────────────────────────────────────
  useEffect(() => {
    if (!caseId) return;
    initAudioContext();

    const wsUrl = "wss://skudyx-backend-c8do.onrender.com/ws/audio-stream";
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      setError(null);
      setIsSenderPresent(true);
      setElapsed(0);
      nextPlayTimeRef.current = 0;
      unlockedRef.current = false;
      ws.send(JSON.stringify({ type: "join", caseId, isSender: false }));
    };

    const processMessage = (text) => {
      try {
        const data = JSON.parse(text);
        if (data.type === "joined") {
          console.log("✅ Joined:", data.caseId);
        } else if (data.type === "sender_left") {
          setIsSenderPresent(false);
        } else if (data.type === "audio_chunk") {
          playBase64Audio(data.chunk);
          setChunkCount((c) => c + 1);
        }
      } catch (e) {
        console.error("❌ Parse error:", e);
      }
    };

    ws.onmessage = (event) => {
      if (event.data instanceof Blob)
        event.data.text().then(processMessage).catch(console.error);
      else processMessage(event.data);
    };

    ws.onerror = () => setError("Connection failed. Please try again.");
    ws.onclose = () => {
      setIsConnected(false);
      nextPlayTimeRef.current = 0;
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN)
        ws.send(JSON.stringify({ type: "leave", caseId }));
      ws.close();
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
        analyserRef.current = null;
        gainNodeRef.current = null;
      }
    };
  }, [caseId, initAudioContext, playBase64Audio]);

  // ─── Derived UI state ─────────────────────────────────────────────────────
  const isLive = isConnected && isSenderPresent;
  const statusColor = isConnected
    ? isSenderPresent
      ? "bg-green-500"
      : "bg-yellow-400"
    : "bg-red-500";
  const statusLabel = !isConnected
    ? "Disconnected"
    : isSenderPresent
      ? "Live"
      : "Waiting";

  //   const volumeIcon = isMuted || volume === 0
  //     ? "M9 9v6h4l5 5V4l-5 5H9z M3 9l6-6v18L3 15V9z" // muted (simplified)
  //     : volume < 0.5
  //     ? "M18.5 12A4.5 4.5 0 0 0 14 7.5v9A4.5 4.5 0 0 0 18.5 12zM5 9v6h4l5 5V4L9 9H5z"
  //     : "M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.5v9A4.5 4.5 0 0 0 16.5 12zm2.5-7.07v2.12c2.89.86 5 3.54 5 6.95s-2.11 6.09-5 6.95v2.12C22.88 19.12 25 15.78 25 12s-2.12-7.12-5-8.07z";

  return (
    <div
      className="p-3 rounded-xl w-full space-y-5"
      onClick={needsGesture ? handleUserGesture : undefined}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${statusColor} ${isLive ? "animate-pulse" : ""}`}
          />
          <h2 className="font-semibold">
            {isLive ? "Live Audio" : "Audio Player"}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {/* Elapsed time */}
          {/* <span className="text-xs font-mono text-gray-400 tabular-nums">
            {formatTime(elapsed)}
          </span> */}
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
      </div>

      {/* ── Tap-to-enable fallback ── */}
      {needsGesture && (
        <button
          onClick={handleUserGesture}
          className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-sm font-medium transition-all"
        >
          Tap to enable audio
        </button>
      )}

      {/* ── Audio level bar ── */}
      <canvas
        ref={canvasRef}
        width={300}
        height={80}
        className="w-full rounded-lg bg-gray-50"
      />

      {/* ── Volume controls ── */}
      <div className="flex items-center gap-3">
        {/* Mute button */}
        <button
          onClick={toggleMute}
          title={isMuted ? "Unmute" : "Mute"}
          className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-gray-700 hover:bg-gray-600 active:scale-95 transition-all text-white"
        >
          {isMuted || volume === 0 ? (
            /* muted icon */
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 fill-current text-red-400"
            >
              <path d="M16.5 12A4.5 4.5 0 0 0 14 7.97V10.18l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zm-14.27-9L3.27 4.27 2 5.54l4 4V13H2v2h4v5l5-5h3.73l4.73 4.73 1.27-1.27L4.73 3z" />
            </svg>
          ) : volume < 0.5 ? (
            /* low volume icon */
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 fill-current text-gray-200"
            >
              <path d="M18.5 12A4.5 4.5 0 0 0 16 7.97V16.02A4.5 4.5 0 0 0 18.5 12zM5 9v6h4l5 5V4L9 9H5z" />
            </svg>
          ) : (
            /* high volume icon */
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 fill-current text-gray-200"
            >
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97V16.02A4.5 4.5 0 0 0 16.5 12zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          )}
        </button>

        {/* Volume slider */}
        <div className="relative flex-1 flex items-center h-9">
          {/* Track background */}
          <div className="absolute w-full h-1.5 bg-gray-600 rounded-full" />
          {/* Filled portion */}
          <div
            className="absolute h-1.5 bg-blue-500 rounded-full pointer-events-none"
            style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
          />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="relative w-full appearance-none bg-transparent cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-4
              [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-white
              [&::-webkit-slider-thumb]:shadow-md
              [&::-webkit-slider-thumb]:border-2
              [&::-webkit-slider-thumb]:border-blue-500
              [&::-moz-range-thumb]:w-4
              [&::-moz-range-thumb]:h-4
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-white
              [&::-moz-range-thumb]:border-2
              [&::-moz-range-thumb]:border-blue-500
              [&::-moz-range-thumb]:border-solid"
          />
        </div>

        {/* Percentage label */}
        <span className="flex-shrink-0 w-10 text-right text-xs font-mono text-gray-400 tabular-nums">
          {isMuted ? "0" : Math.round(volume * 100)}%
        </span>
      </div>

      {/* ── Stats ── */}
      {/* <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-gray-700 rounded-lg p-3">
          <p className="text-gray-400 text-xs mb-1">Case ID</p>
          <p className="text-white font-mono truncate">{caseId || "—"}</p>
        </div>
        <div className="bg-gray-700 rounded-lg p-3">
          <p className="text-gray-400 text-xs mb-1">Chunks received</p>
          <p className="text-white font-semibold">{chunkCount}</p>
        </div>
      </div> */}

      {/* ── Error ── */}
      {error && (
        <p className="text-red-400 text-sm bg-red-900/30 border border-red-800 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
    </div>
  );
}
