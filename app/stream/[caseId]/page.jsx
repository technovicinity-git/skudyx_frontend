"use client";
import { useEffect, useRef, useState } from "react";

import { useParams } from "next/navigation";
import { initZego } from "@/lib/zegoConfig";
import { generateToken } from "@/lib/tokenGenerator";

export default function StreamPage() {
  const id = useParams().caseId;
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState("");
  const [listenerCount, setListenerCount] = useState(0);
  const localStream = useRef(null);
  const zgRef = useRef(null);

  useEffect(() => {
    console.log("Test -----  1");
    if (id) {
      initStream();
    }
    return () => {
      cleanup();
    };
  }, [id]);

  const initStream = async () => {
    try {
      const zg = await initZego();
      zgRef.current = zg;
      console.log("Test -----  2");

      // Generate token on frontend (TESTING ONLY!)
      const token =
        "eyJhcHBfaWQiOjczMzMzMTI0MywidXNlcl9pZCI6ImFiY2QiLCJyb29tX2lkIjoiYWJjIiwicHJpdmlsZWdlIjp7IjEiOjEsIjIiOjF9LCJjdGltZSI6MTc3NjIzMzU3MiwiZXhwaXJlIjoxNzc2MjQwNzcyLCJub25jZSI6NjU2NTUxMTU0fS4wODJhZGY1ZGM5YjBjNjY5YzQyMjU4MDViYWE4MDBhOTUzZjUwY2ExMzBjZmUxNGQwNzc4NjNjNWU2NGZjYzkx";

      console.log("Generated token:", token);

      if (!token) {
        throw new Error("Failed to generate token");
      }
      await zg.loginRoom(id, token, {
        userID: `streamer_${Date.now()}`,
        userName: "Streamer",
      });

      console.log("Test -----  3");

      // Set up room stream update listener
      zg.on("roomStreamUpdate", (roomID, updateType, streamList) => {
        if (updateType === "ADD") {
          setListenerCount((prev) => prev + streamList.length);
        } else if (updateType === "DELETE") {
          setListenerCount((prev) => Math.max(0, prev - streamList.length));
        }
      });

      const stream = await zg.createStream({
        camera: { video: false },
        microphone: true,
      });

      localStream.current = stream;
      await zg.startPublishingStream(stream, id);
      setIsStreaming(true);

      // Get initial listener count
      const streams = await zg.getStreams(id);
      setListenerCount(streams.length);

      console.log("Streaming started successfully");
    } catch (err) {
      console.error("Error starting stream:", err);
      setError(
        "Failed to start audio stream. Please check microphone permissions.",
      );
    }
  };

  const stopStream = async () => {
    if (zgRef.current && localStream.current) {
      await zgRef.current.stopPublishingStream(id);
      await zgRef.current.destroyStream(localStream.current);
      await zgRef.current.logoutRoom(id);
      setIsStreaming(false);
      setListenerCount(0);
    }
  };

  const cleanup = async () => {
    if (isStreaming) {
      await stopStream();
    }
  };

  const copyStreamLink = () => {
    const streamUrl = `${window.location.origin}/listen/${id}`;
    navigator.clipboard.writeText(streamUrl);
    alert("Stream link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">
            Live Audio Stream
          </h1>
          <p className="text-gray-400">Broadcast your voice to listeners</p>
        </div>

        {/* Room Info Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-700">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Room ID</p>
              <p className="text-2xl font-mono font-bold text-white">{id}</p>
            </div>
            {isStreaming && (
              <div className="flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">
                  {listenerCount} Listener{listenerCount !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 mb-8">
            <p className="text-red-400 text-center">{error}</p>
          </div>
        )}

        {/* Main Controls */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mb-8">
          <div className="flex flex-col items-center gap-6">
            {!isStreaming ? (
              <button
                onClick={initStream}
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 rounded-full hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
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
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
                Start Streaming
              </button>
            ) : (
              <>
                <button
                  onClick={stopStream}
                  className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl"
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
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                    />
                  </svg>
                  Stop Streaming
                </button>

                <button
                  onClick={copyStreamLink}
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
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                    />
                  </svg>
                  Copy Shareable Link
                </button>
              </>
            )}
          </div>
        </div>

        {/* Status Indicator */}
        {isStreaming && (
          <div className="bg-green-500/10 border border-green-500/50 rounded-xl p-4 mb-8 animate-pulse">
            <div className="flex items-center justify-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
              <p className="text-green-400 font-medium">
                You are live! Your audio is being broadcasted.
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
            How to share your stream
          </h3>
          <div className="space-y-3 text-gray-300">
            <p className="flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 bg-blue-500/20 rounded-full text-blue-400 text-sm">
                1
              </span>
              Click &quot;Start Streaming&quot; and allow microphone access
            </p>
            <p className="flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 bg-blue-500/20 rounded-full text-blue-400 text-sm">
                2
              </span>
              Click &quot;Copy Shareable Link&quot; to get your stream URL
            </p>
            <p className="flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 bg-blue-500/20 rounded-full text-blue-400 text-sm">
                3
              </span>
              Share the link with your listeners - they&apos;ll join as /listen/
              {id}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
