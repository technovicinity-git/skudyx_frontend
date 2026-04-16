"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import Hls from "hls.js";

export default function AudioPlayer() {
  const audioRef = useRef(null);
  const hlsRef = useRef(null);
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(true); // start paused
  const [streamUrl, setStreamUrl] = useState(
    "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  );

  // 🎯 Setup stream
  useEffect(() => {
    if (!streamUrl || !audioRef.current) return;

    const audio = audioRef.current;

    if (Hls.isSupported()) {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }

      const hls = new Hls({
        liveSyncDuration: 2,
        enableWorker: true,
      });

      hls.loadSource(streamUrl);
      hls.attachMedia(audio);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log("✅ Stream ready");
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("❌ HLS error:", data);
      });

      hlsRef.current = hls;
    } else {
      audio.src = streamUrl;
    }

    return () => {
      hlsRef.current?.destroy();
    };
  }, [streamUrl]);

  const startVisualizer = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;

    if (!canvas || !analyser) return;

    const ctx = canvas.getContext("2d");
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      requestAnimationFrame(draw);

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
  };

  const handleVolumeChange = (e) => {
    const vol = Number(e.target.value);
    setVolume(vol);

    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  // 🎛 Controls
  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !audioRef.current.muted;
    setIsMuted(audioRef.current.muted);
  };

  const togglePause = async () => {
    if (!audioRef.current) return;
    try {
      if (isPaused) {
        await audioRef.current.play();
        if (!audioContextRef.current) {
          const audioCtx = new AudioContext();
          const analyser = audioCtx.createAnalyser();
          const source = audioCtx.createMediaElementSource(audioRef.current);

          source.connect(analyser);
          analyser.connect(audioCtx.destination);

          analyser.fftSize = 64;

          audioContextRef.current = audioCtx;
          analyserRef.current = analyser;

          startVisualizer();
        }
        setIsPaused(false);
      } else {
        audioRef.current.pause();
        setIsPaused(true);
      }
    } catch (err) {
      console.error("Playback error:", err);
    }
  };

  return (
    <div className="bg-gray-200 text-gray-900 p-5 rounded-2xl w-full max-w-md">
      <audio ref={audioRef} />

      {/* 🔴 Header */}
      <div className="flex items-center justify-between">
        {/* <h2 className="text-sm font-semibold">Live Audio</h2> */}

        <div className="flex items-center gap-2 text-xs text-gray-500">
          {!isPaused ? (
            <div className="flex items-center gap-1 text-red-500">
              <span className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
              <span>LIVE</span>
            </div>
          ) : (
            <span>Paused</span>
          )}
        </div>
      </div>

      {/* 🌊 Visualizer */}
      <canvas
        ref={canvasRef}
        width={300}
        height={80}
        className="w-full mt-4 rounded-lg bg-black"
      />

      {/* 🎛 Controls */}
      <div className="flex items-center justify-between mt-5 gap-4">
        {/* ▶️ Play / Pause */}
        <button
          onClick={togglePause}
          className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-950 text-white hover:bg-blue-700 transition shadow"
        >
          {isPaused ? <Play size={18} /> : <Pause size={18} />}
        </button>

        {/* 🔊 Volume Section */}
        <div className="flex items-center gap-3 flex-1">
          {/* 🔇 Mute */}
          <button
            onClick={toggleMute}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            {isMuted || volume === 0 ? (
              <VolumeX size={18} />
            ) : (
              <Volume2 size={18} />
            )}
          </button>

          {/* 🎚 Slider */}
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full accent-blue-950"
          />
        </div>
      </div>
    </div>
  );
}
