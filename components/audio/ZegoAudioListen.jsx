"use client";

import { useParams } from "next/navigation";
import { initZego } from "@/lib/zegoConfig";
import { useEffect, useRef, useState } from "react";
import { useGetToken } from "@/hook/zego";

export default function ZegoAudioListen() {
  const { id } = useParams();
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState("");
  const [activeStreams, setActiveStreams] = useState(0);
  const [isStreamAvailable, setIsStreamAvailable] = useState(false);
  const [streamIds, setStreamIds] = useState([]); // ✅ State (not ref) so React renders the divs
  const remoteStreams = useRef(new Map());
  const zgRef = useRef(null);

  const listenerId = useRef(
    `listener_${id}_${Math.random().toString(36).slice(2)}`,
  );
  const { token } = useGetToken(listenerId.current);

  useEffect(() => {
    if (id && token) {
      initListener();
    }
    return () => {
      cleanup();
    };
  }, [id, token]);

  const initListener = async () => {
    try {
      const zg = await initZego();
      zgRef.current = zg;

      // ✅ Register BEFORE loginRoom
      zg.on("roomStreamUpdate", async (roomID, updateType, streamList) => {
        console.log("Stream update:", updateType, streamList);

        if (updateType === "ADD") {
          for (const stream of streamList) {
            if (remoteStreams.current.has(stream.streamID)) continue;

            // ✅ Step 1: Pull the media stream from ZEGO
            const remoteStream = await zg.startPlayingStream(stream.streamID);
            const remoteView = zg.createRemoteStreamView(remoteStream);

            // ✅ Step 2: Add the div ID to state so React renders <div id="remote-audio-xxx">
            setStreamIds((prev) => {
              if (prev.includes(stream.streamID)) return prev;
              return [...prev, stream.streamID];
            });

            // ✅ Step 3: Wait one tick for React to mount the div into the DOM
            await new Promise((r) => setTimeout(r, 50));

            // ✅ Step 4: Play into the now-mounted div
            remoteView.play(`remote-audio-${stream.streamID}`, {
              enableAutoplayDialog: true,
            });

            remoteStreams.current.set(stream.streamID, remoteView);
            setActiveStreams(remoteStreams.current.size);
            setIsStreamAvailable(true);
          }
        } else if (updateType === "DELETE") {
          for (const stream of streamList) {
            if (!remoteStreams.current.has(stream.streamID)) continue;

            zg.stopPlayingStream(stream.streamID);
            remoteStreams.current.delete(stream.streamID);
            setStreamIds((prev) => prev.filter((s) => s !== stream.streamID));
            setActiveStreams(remoteStreams.current.size);
            if (remoteStreams.current.size === 0) {
              setIsStreamAvailable(false);
            }
          }
        }
      });

      await zg.loginRoom(id, token, {
        userID: listenerId.current,
        userName: listenerId.current,
      });

      // ✅ REMOVED: await zg.startPlayingStream(id)
      // The room ID is NOT a stream ID. Real stream IDs come from roomStreamUpdate above.

      setIsListening(true);
      console.log("Joined room, waiting for streams via roomStreamUpdate...");
    } catch (err) {
      console.error("Error starting listener:", err);
      setError("Failed to join audio stream. Please try again.");
    }
  };

  const stopListening = async () => {
    if (zgRef.current) {
      for (const [streamID] of remoteStreams.current) {
        zgRef.current.stopPlayingStream(streamID);
      }
      remoteStreams.current.clear();
      setStreamIds([]);
      await zgRef.current.logoutRoom(id);
      setIsListening(false);
      setActiveStreams(0);
      setIsStreamAvailable(false);
    }
  };

  const cleanup = async () => {
    if (zgRef.current) {
      zgRef.current.off("roomStreamUpdate");
    }
    await stopListening();
  };

  const reconnect = () => {
    setError("");
    cleanup().then(() => initListener());
  };

  return (
    <div className="bg-gray-900 w-full rounded-2xl">
      <div className="px-4 py-12 max-w-4xl">
        {/* ✅ Driven by state, so divs exist in DOM before remoteView.play() is called */}
        <div style={{ display: "none" }}>
          {streamIds.map((streamID) => (
            <div key={streamID} id={`remote-audio-${streamID}`} />
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 mt-8">
            <p className="text-red-400 text-center mb-3">{error}</p>
            <div className="text-center">
              <button
                onClick={reconnect}
                className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all duration-200 text-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Main Player */}
        <div className="mx-auto p-8 mb-8">
          {!isListening ? (
            <div className="flex flex-col items-center gap-6">
              <button
                onClick={initListener}
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Join Audio Stream
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center mx-auto gap-6">
              <div className="relative">
                <div
                  className={`w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center ${isStreamAvailable ? "animate-pulse" : ""}`}
                >
                  <svg
                    className="w-16 h-16 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m0 0a5 5 0 007.072 0m-7.072 0L3 21m3.586-3.586L3 21"
                    />
                  </svg>
                </div>
                {/* {isStreamAvailable && (
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-gray-800"></div>
                )} */}
              </div>

              <div className="text-center">
                <p className="text-gray-400 text-sm mb-2">Stream Status</p>
                {isStreamAvailable ? (
                  <div className="space-y-2">
                    <p className="text-green-400 font-semibold flex items-center justify-center gap-2">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </span>
                      Streaming Live
                    </p>
                    <p className="text-gray-300 text-sm">
                      {activeStreams} active stream
                      {activeStreams !== 1 ? "s" : ""}
                    </p>
                  </div>
                ) : (
                  <p className="text-yellow-400">
                    Waiting for streamer to start broadcasting...
                  </p>
                )}
              </div>

              <button
                onClick={stopListening}
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-200"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Stop Stream
              </button>
            </div>
          )}
        </div>

        {/* Waiting status */}
        {isListening && !isStreamAvailable && !error && (
          <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-xl p-4 mb-8">
            <div className="flex items-center justify-center gap-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
              <p className="text-yellow-400 font-medium">
                Waiting for streamer to start broadcasting...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
