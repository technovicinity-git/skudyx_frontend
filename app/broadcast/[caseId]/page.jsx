"use client";

import { socket } from "@/lib/socket";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function Broadcast() {
  const videoRef = useRef(null);
  const peersRef = useRef({});
  const localStream = useRef(null);

  const { caseId } = useParams();

  useEffect(() => {
    init();

    return () => {
      socket.off("request_offer");
      socket.off("webrtc_answer");
      socket.off("webrtc_ice_candidate");

      // 🔥 Cleanup all peer connections
      Object.values(peersRef.current).forEach((pc) => pc.close());
      peersRef.current = {};
    };
  }, []);

  const init = async () => {
    socket.on("connect", () => {
      console.log("✅ Connected:", socket?.id);
    });
    socket.emit("join_case", caseId);

    // 🎥 Get media
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    videoRef.current.srcObject = stream;
    localStream.current = stream;

    // 🎯 When listener requests connection
    socket.on("request_offer", async ({ requester_id }) => {
      console.log("🎯 New listener:", requester_id);

      // ⚠️ Prevent duplicate connections
      if (peersRef.current[requester_id]) {
        console.log("⚠️ Already connected:", requester_id);
        return;
      }

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

      peersRef.current[requester_id] = pc;

      // 🎧 Add tracks
      localStream.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStream.current);
      });

      // ❄️ ICE candidate
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("webrtc_ice_candidate", {
            case_id: caseId,
            candidate: event.candidate,
            requester_id,
          });
        }
      };

      // 🧠 Create offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // 📤 Send offer to specific listener
      console.log("📤 Sending offer to:", caseId, requester_id);
      socket.emit("webrtc_offer", {
        case_id: caseId,
        offer,
        requester_id,
        sender_id: socket?.id,
      });
    });

    console.log("Test ------  4");

    // 🎯 Receive answer from listener
    socket.on("webrtc_answer", async (data) => {
      const { requester_id, sdp } = data;

      console.log("📡 Answer received from:", requester_id);

      const pc = peersRef.current[requester_id];
      if (!pc) {
        console.log("⚠️ No PC for requester:", requester_id);
        return;
      }

      try {
        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      } catch (err) {
        console.log("❌ Error setting remote description:", err);
      }
    });

    // ❄️ Receive ICE from listener
    socket.on("webrtc_ice_candidate", async (data) => {
      const { requester_id, candidate } = data;

      console.log("❄️ ICE received from:", requester_id);

      const pc = peersRef.current[requester_id];
      if (!pc) return;

      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error("❌ ICE error:", err);
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-xl mb-4">🎥 Broadcast (Multi Listener)</h1>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-[600px] rounded-lg"
      />
    </div>
  );
}
