import { socket } from "@/lib/socket";
import { useEffect, useRef, useState } from "react";

export function useWebRTCAudio(caseId) {
  const [status, setStatus] = useState("idle");
  const pcRef = useRef(null);
  const socketRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    socketRef.current = socket;

    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    });

    console.log("WebRTC PeerConnection created2", pc);
    pcRef.current = pc;

    // 🔊 When remote audio track arrives, play it
    pc.ontrack = (event) => {
      console.log("🎧 Remote stream received 2");
      setStatus("receiving audio");
      if (!audioRef.current) {
        audioRef.current = new Audio();
        audioRef.current.autoplay = true;
      }
      audioRef.current.srcObject = event.streams[0];
    };

    // Send ICE candidates to Flutter via signaling
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice_candidate", {
          caseId,
          candidate: event.candidate.toJSON(),
        });
      }
    };

    pc.onconnectionstatechange = () => {
      setStatus(pc.connectionState);
    };

    // 📥 Receive SDP offer from Flutter
    socket.on("offer", async ({ sdp, type }) => {
      setStatus("answering");
      await pc.setRemoteDescription(new RTCSessionDescription({ sdp, type }));

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      // Send answer back to Flutter
      socket.emit("answer", {
        caseId,
        sdp: answer.sdp,
        type: answer.type,
      });

      setStatus("connected");
    });

    // 📥 Receive ICE candidates from Flutter
    socket.on("ice_candidate", async ({ candidate }) => {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e) {
        console.error("ICE candidate error:", e);
      }
    });

    // Join the case room
    socket.emit("join", { caseId });

    return () => {
      pc.close();
      socket.disconnect();
      audioRef.current?.pause();
    };
  }, [caseId]);

  return { status };
}
