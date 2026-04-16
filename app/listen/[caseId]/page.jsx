"use client";

import { useParams } from "next/navigation";
import { initZego } from "@/lib/zegoConfig";
import { useEffect, useRef, useState } from "react";
import { generateToken } from "@/lib/tokenGenerator";

export default function ListenPage() {
  const id = useParams().caseId;
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState("");
  const [activeStreams, setActiveStreams] = useState(0);
  const [isStreamAvailable, setIsStreamAvailable] = useState(false);
  const remoteStreams = useRef(new Map());
  const zgRef = useRef(null);

  useEffect(() => {
    if (id) {
      initListener();
    }
    return () => {
      cleanup();
    };
  }, [id]);

  const initListener = async () => {
    try {
      const zg = await initZego();
      zgRef.current = zg;

      const userID = `listener_${Date.now()}_${Math.random()}`;

      // Generate token on frontend (TESTING ONLY!)
      const token = generateToken(userID, 7200);

      if (!token) {
        console.log("Failed to generate token");
      }

      await zg.loginRoom(id, token, {
        userID: `listener_${Date.now()}_${Math.random()}`,
        userName: "Listener",
      });

      // Set up event listeners for remote streams
      zg.on("roomStreamUpdate", (roomID, updateType, streamList) => {
        console.log("Stream update:", updateType, streamList);

        if (updateType === "ADD") {
          streamList.forEach(async (stream) => {
            if (!remoteStreams.current.has(stream.streamID)) {
              await zg.startPlayingStream(stream.streamID, {
                audio: true,
                video: false,
              });
              remoteStreams.current.set(stream.streamID, stream);
              setActiveStreams(remoteStreams.current.size);
              setIsStreamAvailable(true);
            }
          });
        } else if (updateType === "DELETE") {
          streamList.forEach((stream) => {
            if (remoteStreams.current.has(stream.streamID)) {
              zg.stopPlayingStream(stream.streamID);
              remoteStreams.current.delete(stream.streamID);
              setActiveStreams(remoteStreams.current.size);
              if (remoteStreams.current.size === 0) {
                setIsStreamAvailable(false);
              }
            }
          });
        }
      });

      // Get existing streams
      const streams = await zg.getStreams(id);
      streams.forEach(async (stream) => {
        if (!remoteStreams.current.has(stream.streamID)) {
          await zg.startPlayingStream(stream.streamID, {
            audio: true,
            video: false,
          });
          remoteStreams.current.set(stream.streamID, stream);
          setActiveStreams(remoteStreams.current.size);
          setIsStreamAvailable(true);
        }
      });

      setIsListening(true);
      console.log("Listening started successfully");
    } catch (err) {
      console.error("Error starting listener:", err);
      setError("Failed to join audio stream. Please try again.");
    }
  };

  const stopListening = async () => {
    if (zgRef.current) {
      for (const [streamID] of remoteStreams.current) {
        await zgRef.current.stopPlayingStream(streamID);
      }
      remoteStreams.current.clear();
      await zgRef.current.logoutRoom(id);
      setIsListening(false);
      setActiveStreams(0);
      setIsStreamAvailable(false);
    }
  };

  const cleanup = async () => {
    if (isListening) {
      await stopListening();
    }
  };

  const reconnect = () => {
    setError("");
    cleanup().then(() => {
      initListener();
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">
            Audio Stream Player
          </h1>
          <p className="text-gray-400">Listen to live audio broadcast</p>
        </div>

        {/* Room Info Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-700">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Room ID</p>
              <p className="text-2xl font-mono font-bold text-white">{id}</p>
            </div>
            {isListening && isStreamAvailable && (
              <div className="flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">Live</span>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 mb-8">
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
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mb-8">
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
            <div className="space-y-6">
              {/* Player Controls */}
              <div className="flex flex-col items-center gap-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center animate-pulse">
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
                  {isStreamAvailable && (
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-gray-800"></div>
                  )}
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
                  Leave Stream
                </button>
              </div>

              {/* Volume Control Placeholder */}
              {isStreamAvailable && (
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <div className="flex items-center justify-center gap-3">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m0 0a5 5 0 007.072 0m-7.072 0L3 21m3.586-3.586L3 21"
                      />
                    </svg>
                    <div className="w-48 h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div className="w-full h-full bg-blue-500 rounded-full"></div>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5.586 15.536A5 5 0 0011 18m0 0a5 5 0 005.414-2.464m-5.414 2.464L3 21m3.586-3.586L3 21"
                      />
                    </svg>
                  </div>
                  <p className="text-center text-gray-500 text-xs mt-2">
                    Volume is controlled by your device
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Status Messages */}
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

        {/* Instructions */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Listening Tips
          </h3>
          <div className="space-y-3 text-gray-300">
            <p className="flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 bg-blue-500/20 rounded-full text-blue-400 text-sm">
                1
              </span>
              Click &quot;Join Audio Stream&quot; to start listening
            </p>
            <p className="flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 bg-blue-500/20 rounded-full text-blue-400 text-sm">
                2
              </span>
              Make sure your device volume is turned up
            </p>
            <p className="flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 bg-blue-500/20 rounded-full text-blue-400 text-sm">
                3
              </span>
              The stream will start automatically when the broadcaster goes live
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
