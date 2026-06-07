"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { Volume2, VolumeX, Wifi, WifiOff } from "lucide-react";

const SERVER_URL = "https://skudix-new.onrender.com";
const MAX_OFFER_RETRIES = 6;

export default function WebRTCAudioPlayer({ caseId }) {
  const [isMuted, setIsMuted] = useState(false);
  const [connected, setConnected] = useState(false);
  const [showStart, setShowStart] = useState(false);
  const [listenerCount, setListenerCount] = useState(0);
  const [socketStatus, setSocketStatus] =
    (useState < "connecting") | "connected" | ("disconnected" > "connecting");

  // ── Refs ────────────────────────────────────────────────────────────────────
  const audioRef = useRef(null);
  const pcRef = useRef(null);
  const socketRef = useRef(null);

  // FIX 1: ref mirror of `connected` so closures never read stale state
  const connectedRef = useRef(false);

  // FIX 2: queue ICE candidates that arrive before setRemoteDescription
  const iceCandidateQueueRef = useRef([]);

  // FIX 3: retry timer for offer requests
  const retryTimerRef = useRef(null);

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const setConnectedBoth = useCallback((val) => {
    connectedRef.current = val;
    setConnected(val);
  }, []);

  const clearRetry = useCallback(() => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  }, []);

  // ── FIX 4: explicit offer request with exponential backoff ──────────────────
  // Replaces the fragile "leave + rejoin" hack.
  // The phone receives `webrtc:request-offer` and sends a fresh offer for us.
  const requestOffer = useCallback(
    (socket, attempt = 0) => {
      clearRetry();
      if (!socket.connected || connectedRef.current) return;

      const listenerId = socket.id;
      console.log(
        `📨 Requesting offer — attempt ${attempt + 1}/${MAX_OFFER_RETRIES}`,
      );
      socket.emit("webrtc:request-offer", { caseId, listenerId });

      if (attempt < MAX_OFFER_RETRIES) {
        // Backoff: 3 s, 4 s, 5 s … 9 s
        const delay = (3 + attempt) * 1000;
        retryTimerRef.current = setTimeout(() => {
          if (!connectedRef.current && socket.connected) {
            requestOffer(socket, attempt + 1);
          }
        }, delay);
      }
    },
    [caseId, clearRetry],
  );

  // ── Core: create / replace the RTCPeerConnection ────────────────────────────
  const initPC = useCallback(
    async (socket) => {
      clearRetry();
      iceCandidateQueueRef.current = [];

      // Tear down any existing PC cleanly
      if (pcRef.current) {
        pcRef.current.ontrack = null;
        pcRef.current.onicecandidate = null;
        pcRef.current.oniceconnectionstatechange = null;
        pcRef.current.close();
        pcRef.current = null;
      }

      // Fetch TURN credentials (fall back to STUN only)
      let iceServers = [{ urls: "stun:stun.l.google.com:19302" }];
      try {
        const res = await fetch(`${SERVER_URL}/api/turn/credentials`);
        const data = await res.json();
        if (data?.data?.iceServers) iceServers = data.data.iceServers;
      } catch {
        console.log("TURN fetch failed, using STUN only");
      }

      const pc = new RTCPeerConnection({ iceServers });
      pcRef.current = pc;
      const listenerId = socket.id;

      // ── Track arrived → start audio ─────────────────────────────────────────
      pc.ontrack = (event) => {
        console.log("🎵 Audio track received");
        const stream = event.streams[0] ?? new MediaStream([event.track]);

        if (!audioRef.current) {
          audioRef.current = new Audio();
          audioRef.current.autoplay = true;
          document.body.appendChild(audioRef.current);
        }
        audioRef.current.srcObject = stream;

        audioRef.current
          .play()
          .then(() => {
            console.log("✅ Autoplay succeeded");
            setConnectedBoth(true);
            setShowStart(false);
          })
          .catch(() => {
            console.log("⚠️ Autoplay blocked — showing Start button");
            setShowStart(true);
          });
      };

      // ── ICE connection state ─────────────────────────────────────────────────
      pc.oniceconnectionstatechange = () => {
        const state = pc.iceConnectionState;
        const thisPc = pc; // capture for the closure guard below
        console.log("🧊 ICE:", state);

        if (state === "connected" || state === "completed") {
          setConnectedBoth(true);
          setShowStart(false);
          clearRetry();
        }

        if (state === "disconnected" || state === "failed") {
          setConnectedBoth(false);
          // Only reinitialise if this PC is still the active one
          setTimeout(() => {
            if (
              !connectedRef.current &&
              socket.connected &&
              pcRef.current === thisPc
            ) {
              console.log("🔄 ICE failure — reinitialising...");
              initPC(socket).then(() => requestOffer(socket));
            }
          }, 2000);
        }
      };

      // ── Send our ICE candidates to the phone ─────────────────────────────────
      pc.onicecandidate = ({ candidate }) => {
        if (candidate && socket.connected) {
          socket.emit("webrtc:ice-candidate", {
            caseId,
            listenerId,
            candidate: candidate.candidate,
            sdpMid: candidate.sdpMid,
            sdpMLineIndex: candidate.sdpMLineIndex,
          });
        }
      };

      // ── Handle incoming offer from phone ─────────────────────────────────────
      socket.off("webrtc:offer");
      socket.on("webrtc:offer", async (data) => {
        // Ignore offers addressed to a different listener
        if (data.listenerId && data.listenerId !== listenerId) return;

        const currentPc = pcRef.current;
        if (!currentPc || currentPc.signalingState === "closed") return;

        console.log("📡 Offer received");
        clearRetry(); // offer arrived — stop retrying

        try {
          await currentPc.setRemoteDescription(new RTCSessionDescription(data));

          // FIX 5: drain the ICE candidate queue now that remote desc is set
          for (const candidateInit of iceCandidateQueueRef.current) {
            try {
              await currentPc.addIceCandidate(
                new RTCIceCandidate(candidateInit),
              );
            } catch {
              /* stale candidate, ignore */
            }
          }
          iceCandidateQueueRef.current = [];

          const answer = await currentPc.createAnswer();
          await currentPc.setLocalDescription(answer);
          socket.emit("webrtc:answer", {
            caseId,
            listenerId,
            sdp: answer.sdp,
            type: "answer",
          });
          console.log("📡 Answer sent");
        } catch (e) {
          console.error("WebRTC signaling error:", e);
        }
      });

      // ── Receive ICE candidates from phone ────────────────────────────────────
      socket.off("webrtc:ice-candidate");
      socket.on("webrtc:ice-candidate", async (data) => {
        if (data.listenerId && data.listenerId !== listenerId) return;

        const currentPc = pcRef.current;
        if (!currentPc || currentPc.signalingState === "closed") return;

        const candidateInit = {
          candidate: data.candidate,
          sdpMid: data.sdpMid,
          sdpMLineIndex: data.sdpMLineIndex,
        };

        // FIX 5 (cont.): remote desc not ready yet → queue it
        if (!currentPc.remoteDescription) {
          iceCandidateQueueRef.current.push(candidateInit);
        } else {
          try {
            await currentPc.addIceCandidate(new RTCIceCandidate(candidateInit));
          } catch {
            /* ignore invalid candidates */
          }
        }
      });

      // Kick off — ask the phone for an offer
      requestOffer(socket);
    },
    [caseId, clearRetry, requestOffer, setConnectedBoth],
  );

  // ── Socket lifecycle ─────────────────────────────────────────────────────────
  useEffect(() => {
    const socket = io(SERVER_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("🔌 Socket connected:", socket.id);
      setSocketStatus("connected");
      socket.emit("case:join", { caseId });
      initPC(socket);
    });

    socket.on("disconnect", () => {
      console.log("🔌 Socket disconnected");
      setSocketStatus("disconnected");
      setConnectedBoth(false);
      clearRetry();
    });

    socket.on("connect_error", () => setSocketStatus("disconnected"));

    socket.on("audio:keepalive-ack", (data) => {
      if (data.activePeers != null) setListenerCount(data.activePeers);
    });

    return () => {
      clearRetry();
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current.remove();
        audioRef.current = null;
      }
      socket.emit("case:leave", { caseId });
      socket.disconnect();
      socketRef.current = null;
    };
  }, [caseId, initPC, clearRetry, setConnectedBoth]);

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-3 h-3 rounded-full ${
              connected
                ? "bg-green-500 animate-pulse"
                : socketStatus === "connected"
                  ? "bg-yellow-500"
                  : "bg-gray-400"
            }`}
          />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Live Audio
          </h3>
          <span className="text-xs text-gray-400">
            {socketStatus === "connected" ? (
              <Wifi className="inline w-3 h-3 text-green-500" />
            ) : (
              <WifiOff className="inline w-3 h-3 text-red-400" />
            )}
          </span>
          {/* {listenerCount > 0 && (
            <span className="text-xs text-gray-400">{listenerCount} listening</span>
          )} */}
        </div>

        <div className="flex gap-2">
          {showStart && !connected && (
            <button
              onClick={() =>
                audioRef.current
                  ?.play()
                  .then(() => {
                    setConnectedBoth(true);
                    setShowStart(false);
                  })
                  .catch((e) => console.log("Play failed:", e.message))
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              Start Audio
            </button>
          )}

          {connected && (
            <button
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.muted = !isMuted;
                  setIsMuted((m) => !m);
                }
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                isMuted
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-4 h-4" /> Muted
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" /> Listening
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Status line */}
      {!showStart && !connected && socketStatus === "connected" && (
        <p className="text-sm text-gray-400">Waiting for audio stream…</p>
      )}
      {!showStart && !connected && socketStatus !== "connected" && (
        <p className="text-sm text-yellow-500">Reconnecting to audio server…</p>
      )}
      {showStart && !connected && (
        <p className="text-sm text-yellow-500">Click Start Audio to listen</p>
      )}
    </div>
  );
}
