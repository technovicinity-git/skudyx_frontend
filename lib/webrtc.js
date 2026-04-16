let pc = null;

export const initPeerConnection = (socket, caseId, onStream) => {
  pc = new RTCPeerConnection({
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  });

  pc.ontrack = (event) => {
    console.log("🎧 Remote track received");

    const stream = event.streams[0];
    onStream(stream);
  };

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("webrtc_ice_candidate", {
        case_id: caseId,
        candidate: event.candidate,
      });
    }
  };

  pc.onconnectionstatechange = () => {
    console.log("🔗 Connection:", pc.connectionState);
  };

  pc.oniceconnectionstatechange = () => {
    console.log("❄️ ICE:", pc.iceConnectionState);
  };

  return pc;
};

export const handleOffer = async (socket, caseId, data, onStream) => {
  const offer = data.sdp;

  pc = initPeerConnection(socket, caseId, onStream);

  await pc.setRemoteDescription(new RTCSessionDescription(offer));

  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);

  socket.emit("webrtc_answer", {
    case_id: caseId,
    answer,
    requester_id: data.sender,
  });
  socket.emit("viewer_joined", caseId);

  console.log("📤 Answer sent");
};

export const handleIceCandidate = async (candidate) => {
  if (!pc) return;

  try {
    await pc.addIceCandidate(new RTCIceCandidate(candidate));
  } catch (err) {
    console.error("ICE error:", err);
  }
};

export const closeConnection = () => {
  if (pc) {
    pc.close();
    pc = null;
  }
};
