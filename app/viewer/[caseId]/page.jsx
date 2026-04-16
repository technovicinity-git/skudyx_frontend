"use client";

import { socket } from "@/lib/socket";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function ListenPage() {
  const { caseId } = useParams();

  const audioRef = useRef(null);
  const pcRef = useRef(null);
  const broadcasterRef = useRef(null);

  const [status, setStatus] = useState("Waiting for connection...");

  useEffect(() => {
    // 🎧 Handle incoming audio stream
    const handleStream = (stream) => {
      if (audioRef.current) {
        audioRef.current.srcObject = stream;
        setStatus("🔊 Live audio playing");
      }
    };

    // 🔌 On socket connect
    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);

      socket.emit("join_case", caseId);

      socket.emit("request_offer", {
        case_id: caseId,
        requester_id: socket.id,
      });
      setStatus("Requesting connection...");
    });

    // 🎯 RECEIVE OFFER
    socket.on("webrtc_offer", async (data) => {
      console.log("📡 Offer received", data);

      setStatus("Connecting...");

      const { sdp, sender_id } = data;
      broadcasterRef.current = sender_id;

      const pc = new RTCPeerConnection({
        iceServers: [
          // { urls: "stun:stun.l.google.com:19302" },
          // {
          //   urls: "turn:your-turn-server.com:3478",
          //   username: process.env.NEXT_PUBLIC_METERED_USERNAME,
          //   credential: process.env.NEXT_PUBLIC_METERED_CREDENTIAL,
          // },
          {
            urls: "stun:stun.metered.ca:80",
          },
          {
            urls: "turn:stun.metered.ca:80",
            username: process.env.NEXT_PUBLIC_METERED_USERNAME,
            credential: process.env.NEXT_PUBLIC_METERED_CREDENTIAL,
          },
          {
            urls: "turn:stun.metered.ca:80?transport=tcp",
            username: process.env.NEXT_PUBLIC_METERED_USERNAME,
            credential: process.env.NEXT_PUBLIC_METERED_CREDENTIAL,
          },
          {
            urls: "turn:stun.metered.ca:443",
            username: process.env.NEXT_PUBLIC_METERED_USERNAME,
            credential: process.env.NEXT_PUBLIC_METERED_CREDENTIAL,
          },
          {
            urls: "turns:stun.metered.ca:443?transport=tcp",
            username: process.env.NEXT_PUBLIC_METERED_USERNAME,
            credential: process.env.NEXT_PUBLIC_METERED_CREDENTIAL,
          },
        ],
      });

      pcRef.current = pc;

      // 🎧 Receive audio
      pc.ontrack = (event) => {
        console.log("🎧 Track received:", event.streams);
        handleStream(event.streams[0]);
      };

      // ❄️ ICE sending
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("webrtc_ice_candidate", {
            case_id: caseId,
            candidate: event.candidate,
            sender_id: socket?.id, // 🔥 IMPORTANT
          });
        }
      };

      // 🧠 Set remote offer
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));

      // 🧠 Create answer
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      console.log("Test ------ 1", caseId, sender_id);

      // 📤 Send answer (targeted)
      socket.emit("webrtc_answer", {
        case_id: caseId,
        answer,
        sender_id,
      });
      console.log("Test ------ 2");
    });

    // ❄️ RECEIVE ICE
    socket.on("webrtc_ice_candidate", async (data) => {
      const { candidate } = data;

      console.log("❄️ ICE data:", data);

      const pc = pcRef.current;
      if (!pc) return;

      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error("ICE error:", err);
      }
    });

    // ❌ Disconnect
    socket.on("disconnect", () => {
      setStatus("❌ Disconnected");
    });

    // 🧹 Cleanup
    return () => {
      socket.off("connect");
      socket.off("webrtc_offer");
      socket.off("webrtc_ice_candidate");
      socket.off("disconnect");

      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
    };
  }, [caseId, socket, setStatus]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Live Case Audio</h1>

        <p className="text-sm text-gray-400 mb-4">{status}</p>

        <audio ref={audioRef} autoPlay controls className="w-full" />

        <p className="mt-4 text-xs text-gray-500">Case ID: {caseId}</p>
      </div>
    </div>
  );
}
